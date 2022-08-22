// let user: { username: string; age: number } = {
//   username: 'zMouse',
//   age: 35,
// };
// ok
// user.username;
// user.age;
// error
// user.gender;

interface Person {
  username: string;
  age: number;
}
let person: Person = {
  username: 'zMouse',
  age: 35,
};

interface AjaxOptions {
  url: string;
  method: string;
  type: string;
}

function ajax(options: AjaxOptions) {}

ajax({
  url: '',
  method: 'get',
  type: 'aa',
});
