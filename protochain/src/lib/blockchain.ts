import Block from './block';

const block1 = new Block(2, "abc");

// block1.hash = "abc";
// block1.index = 2;

console.log(block1);
console.log(block1.isValid());


function somar(n1 : number, n2 : number) : number {
    return n1 + n2;
}

console.log(somar(7, 3));
