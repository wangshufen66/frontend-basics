class Person {
  constructor(public username: string, public age: number) {}
}

let user1: Person = new Person('wsf', 18);

console.log(user1.username);
console.log(user1.age);
