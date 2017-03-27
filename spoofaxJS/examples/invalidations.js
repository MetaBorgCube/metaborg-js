import {Map, Set} from 'immutable';

let state = Map({
  A: Map({
    a1: {id: 'a1'},
    a2: {id: 'a2'}
  }),
  B: Map({
    b1: {id: 'b1'},
    b2: {id: 'b2'},
    b3: {id: 'b3'}
  }),
  A_bs: Map({
    a1: Set(['b1', 'b2']),
    a2: Set(['b3'])
  }),
  B_a: Map({
    b1: 'a1',
    b2: 'a1',
    b3: 'a2'
  })
});

function setA_bs(state, {id, value}) {

  const previous = state.get('A_bs').get(id);
  const add = value.subtract(previous);
  const remove = previous.subtract(value);
  const complement = add.union(remove);


  state = state.update('A_bs', A_bs => A_bs.set(id, value));


  return state;
}

function setB_a(state, {id, value}) {

}

console.log(setA_bs(state, {
  id: 'a1',
  value: Set(['b1', 'b2', 'b3'])
}).toJS());

