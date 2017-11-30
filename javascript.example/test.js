class Foo {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  
  sum(){
    return this.x + this.y;
  }
}

class Bar extends Foo {
  constructor(z){
    super(42, 43);
    this.z = z;
  }
  
  betterSum(){
    return super.sum() + this.z;
  }
}

var bar = new Bar(123);
console.log(bar.betterSum());
console.log(bar.betterSum());
console.log(bar.betterSum());
console.log(bar.betterSum());


