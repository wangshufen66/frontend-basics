interface IResponseData<T> {
  code: number;
  message?: string;
  data: T;
}

// 用户接口
interface IResponseUserData {
  id: number;
  username: string;
  email: string;
}
// 文章接口
interface IResponseArticleData {
  id: number;
  title: string;
  author: IResponseUserData;
}

// function getData(url: string) {
//   return fetch(url)
//     .then((res) => {
//       return res.json();
//     })
//     .then((data: IResponseData) => {
//       return data;
//     });
// }
async function getData<U>(url: string) {
  let res = await fetch(url);
  let data: Promise<IResponseData<U>> = await res.json();
  return data;
}

(async function () {
  let user = await getData<IResponseUserData>('/user');
  if (user.code === 1) {
    console.log(user.message);
  } else {
    console.log(user.data.username);
  }

  let articles = await getData<IResponseArticleData>('/articles');
  if (articles.code === 1) {
    console.log(articles.message);
  } else {
    console.log(articles.data.id);
    console.log(articles.data.author.username);
  }
});
