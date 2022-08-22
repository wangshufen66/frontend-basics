let a: string;
a = '1';
// error String对象有的，string不一定有（对象有的，基础类型不一定有）
// a = new String('1');

let b: String;
b = new String('2');
// ok 和上面正好相反
b = '2';
