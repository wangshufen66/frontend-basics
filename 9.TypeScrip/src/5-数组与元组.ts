// <number> 表示数组中存储的数据类型，泛型具体概念后续会讲
let arr1: Array<number> = [];
// ok
arr1.push(100);
// error
// arr1.push('开课吧');

//简单标注
let arr2: string[] = [];
// ok
arr2.push('开课吧');
// error
// arr2.push(1);

//元组
let data1: [string, number] = ['开课吧', 100];
// ok
data1.push(100);
// ok
data1.push('100');
// error
// data1.push(true);
