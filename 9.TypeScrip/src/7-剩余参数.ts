interface IObj {
    [key: string]: any;
}
function merge(target: IObj, ...others: Array<IObj>) {
//   return others.reduce((prev, currnet) => {
//     prev = Object.assign(prev, currnet);
//     return prev;
//   }, target);
    console.log('others', others);

  return Object.assign(target, ...others);
}
let newObj = merge({ x: 1 }, { y: 2 }, { z: 3 });
