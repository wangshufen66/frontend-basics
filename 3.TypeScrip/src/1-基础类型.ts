let title: string = '开课吧';
let isOk: boolean = true;
// let abc: number;
// abc = 3;
// console.log(abc);
// abc.toFixed(1);

let ele = document.querySelector('div');
// 获取元素的方法返回的类型可能会包含 null，所以最好是先进行必要的判断，再进行操作
if (ele) {
  ele.style.display = 'none';
}
