import { Map, Set } from 'immutable';
import { Component } from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { v4 as uuid } from 'uuid';

let state = Map({
  File: Map(),
  Directory: Map(),
  File_directory: Map(),
  Directory_files: Map(),
  Directory_parent: Map(),
  Directory_subDirectories: Map(),
  Directory_allNames: Map(),
  Directory_size: Map()
});

function init(){
  let root = {id: 'root', name: 'root'};
  let f1 = {id: 'f1', name: 'f1', size: 25};
  let d1 = {id: 'd1', name: 'd1'};
  let f2 = {id: 'f2', name: 'f2', size: 15};

  state = state.update('Directory', e => e.set(root.id, root));
  state = state.update('Directory', e => e.set(d1.id, d1));
  state = state.update('File', e => e.set(f1.id, f1));
  state = state.update('File', e => e.set(f2.id, f2));
  state = setDirectory_parent(state, {id: root.id, value: null});
  state = setDirectory_subDirectories(state, {id: root.id, value: Set()});
  state = setDirectory_parent(state, {id: d1.id, value: null});
  state = setDirectory_subDirectories(state, {id: d1.id, value: Set()});
  state = setDirectory_files(state, {id: root.id, value: Set([f1.id])});
  state = setDirectory_files(state, {id: d1.id, value: Set([f2.id])});
  state = setDirectory_subDirectories(state, {id: root.id, value: Set([d1.id])});
}

function calculate_Directory_size(state, id){
  let value = state.get('Directory_size').get(id);
  if(value === undefined){
    console.log('calculating Directory_size for ' + id);

    value = state.get('Directory_files').get(id)
      .map(fId => state.get('File').get(fId).size)
      .update(sum)

    +

    // state.get('Directory_subDirectories').get(id)
    //   .map(dId => {
    //     const calc = calculate_Directory_size(state, dId);
    //     console.log('dId', dId, value)
    //     state = calc.state;
    //     return calc.value;
    //   })
    //   .update(sum);






    state.get('Directory_subDirectories').get(id)
      .flatMap(id => {
        const value = state.get('Directory_parent').get(id);
        return null;//value !== null ? [value] : []
      })
      .flatMap(id => state.get('Directory_subDirectories').get(id))
      .map(id => {
        const calc = calculate_Directory_size(state, id);
        console.log('dId', id, value);
        state = calc.state;
        return calc.value;
      })
      .update(sum);

    console.log('value is ', value);

    state = state.update('Directory_size', Directory_size => Directory_size.set(id, value));
  }
  console.log('result', id, value);

  return {state, value};
}


function sum(collection){
  return collection.reduce((sum, x) => sum + x, 0);
}

function setDirectory_files(state, {id, value}){
  state = state.update('Directory_files', Directory_files => Directory_files.set(id, value));
  state = state.update('File_directory', File_directory => {
    value.forEach(fId => {File_directory = File_directory.set(fId, id);});
    return File_directory;
  });
  return state;
}

function setFile_Directory(state, {id, value}){
  state = state.update('File_directory', File_directory => File_directory.set(id, value));
  state = state.update('Directory_files', Directory_files => Directory_files.update(value, set => set.add(id)));
  return state;
}

function setDirectory_subDirectories(state, {id, value}){
  state = state.update('Directory_subDirectories', Directory_subDirectories => Directory_subDirectories.set(id, value));
  state = state.update('Directory_parent', Directory_parent => {
    value.forEach(dId => {Directory_parent = Directory_parent.set(dId, id);});
    return Directory_parent;
  });
  return state;
}

function setDirectory_parent(state, {id, value}){
  let previousValue = state.get('Directory_parent').get(id);
  if(previousValue != null){ //remove inverse
    state = state.update('Directory_subDirectories', Directory_subDirectories => {
      Directory_subDirectories.update(previousValue, subDirectories => subDirectories.remove(id));
    });
  }

  state = state.update('Directory_parent', Directory_parent => Directory_parent.set(id, value));
  if(value != null){ //set inverse
    state = state.update('Directory_subDirectories', Directory_subDirectories =>
      Directory_subDirectories.update(value, subDirectories => subDirectories.add(id))
    );
  }
  return state;
}