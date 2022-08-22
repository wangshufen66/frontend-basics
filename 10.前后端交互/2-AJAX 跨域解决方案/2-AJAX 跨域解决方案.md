# 2-AJAX 跨域解决方案

[toc]



## 1、前后端分离模式

- 静态资源（html）- `server-a` 提供前端静态资源。
- 后端数据（商品信息……）- `server-b` 提供基于 `HTTP` 的 `API`。



## 2、同源策略

当我们通过 `xhr` 的方式从一个源去获取另外一个源的数据的时候，就会触发同源策略的协议。

**源**

域：协议+主机（ip、域名）+端口，比如 http://localhost:8888。

**同源策略**

`浏览器` 的一种安全机制，避免浏览器中通过脚本等方式去获取非同源的数据。



## 3、跨域解决方案：   

这套机制建立在一个核心内容基础之上：**http header**，这套机制定义了一系列的 `HTTP` 头，通过这些 `HTTP` 头来控制资源的访问。这些http头基本都是以 `access-control-?` 来进行命名的，不同的 `HTTP` 头有不同的作用。

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS

### 普通资源请求

**Access-Control-Allow-Origin**

控制当前允许访问该资源的源（origin） 

### 非普通的资源请求

**简单请求 & 非简单请求**

当请求满足一定规则的时候，为简单请求

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#%E7%AE%80%E5%8D%95%E8%AF%B7%E6%B1%82

**预检请求**

 如果当前请求满足了非简单请求，那么就会先发送一个 method 为 options 的请求（浏览器），称为 `预检` ，后端需要对这个预检请求进行处理，根据业务返回对应的头信息，来告知客户端是否允许发送非简单请求，我们需要在预检请求中返回一系列的头信息，来控制之前发送的非简单请求是否继续

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#%E9%A2%84%E6%A3%80%E8%AF%B7%E6%B1%82



## 4、跨域解决方案：后端代理

除了 `js` 能够通过一些 `API` 发送 `HTTP` 请求，其它很多语言都能够实现，`Node.js` 自然也可以。而且 `同源策略` 仅仅是浏览器下的某种策略机制，`Node.js` 不受其限制，所以，我们就可以利用静态资源（也就是 `js` 发送请求所在的资源服务器）去发送请求，然后进行转发。我们称为：`代理` 。

**提供 API 服务服务端：ServerA**

源：http://localhost:8888

```js
const Koa = require('koa');
const KoaRouter = require('koa-router');

const app = new Koa();
const router = new KoaRouter();

router.get('/data', async (ctx, next) => {
    ctx.body = [1, 2, 3, 4, 5];
})

app.use(router.routes());

app.listen(8888);
```

**发送 JS 请求所在服务端：ServerB**

```js
const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const http = require('http');

const app = new Koa();

app.use(KoaStaticCache({
    prefix: '',
    dir: './public',
    gzip: true,
    dynamic: true
}));

// 跨域问题：浏览器的同源策略限制，但是其他不一定有，很多的语言都有基于网络的编程，它既可以监听请求，也可以发送请求，而且一般默认是没有所谓的同源策略的
// 我们可以基于node提供http模块来发送请求
// 这个 URL 就是给我们当前服务端下的 js 发送 ajax 请求的转发接口
router.get('/data', async (ctx, next) => {

    // 使用发送一个http请求到真正的服务器接口上
    // 后端代理
    // [server1.ajax => server1] => server2 , server1 就是代理
    return new Promise((resolve, reject) => {
        let req = http.request({
            // method: 'get',
            hostname: 'localhost',
            port: 8888,
            path: '/data'
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk.toString();
            });
            res.on('end', () => {
                console.log('数据：', data);
                ctx.body = data;
                resolve();
            });
        });

        req.write('');
        req.end();
    })

});

app.use(router.routes());
app.listen(9999);
```

**ServerB 下的 JS 请求**

```js
let xhr = new XMLHttpRequest();
// 这里的 /data 一定要添加当前 js 所在服务器的地址
xhr.open('/get', '/data');
xhr.onload = function() {
  console.log(this.responseText);
}
xhr.send();
```



代理

- 正向代理
  - (app server => proxy  ) => api server
- 反向代理
  - app server => (proxy server) => api server



## 5、跨域凭证信息处理

### 5-1、基于 `Cookie` 的 `CORS` 处理

`cookie` 实际也是会受到同源策略的限制的，如果非同源请求，`cookie` 是默认被禁止携带处理的。

**附带身份凭证的请求**

- 客户端在请求中要设置：`withCredentials: true`
- 服务端要在cors中设置：`ctx.set('Access-Control-Allow-Credentials', 'true');`

### 5-2、基于 `Token` 的鉴权机制

基于 `Cookie` 的验证会有一些问题：

- 无论当前请求是否需要传递 `Cookie` ，浏览器都会主动发送（浪费）。
- 容易被 `CSRF` 攻击。

#### 5-2-1、 `JWT` 介绍

`Json web token (JWT)` , 是为了在网络应用环境间传递声明而执行的一种基于 `JSON` 的开放标准。

> 参考：https://jwt.io/introduction

组成结构：

`JWT` 是由通过 `.` 链接的三段文本信息构成

```js
let header = `{
  "alg": "HS256",
  "typ": "JWT"
}`;
let payload = `{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`;
let key = 'kkb';

let sign = HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
 key
);

let token = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.${sign}`;
```

生成的 `token` 内容：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.E1H9eRej3pbltuEr9IL12jJjb-612z_q1eEfvNKK0t8
```

**header**

`ALGORITHM & TOKEN TYPE` ，什么类型和所使用的算法。

**payload**

存放的数据

**sign**

签名

#### 5-2-2、使用 `JWT`

我们可以使用 `jsonwebtoken` 来实现 `token` 的生成和验证

```sh
npm install jsonwebtoken
```



```js
// 后端
...
const jwt = require('jsonwebtoken');

const signKey = 'kkb';
...

router.post('/login', async (ctx, next) => {
  
  let user = {id: 1, username: 'zMouse'};
  
  const token = jwt.sign(user, signKey);
  
  // 通过 头信息 Authorization 进行发送
  ctx.set('Authorization', token);
  
  ctx.body = '登录成功';
})

router.get('/user/profile', async (ctx, next) => {
  let user = null;
  try {
    let 
    let token = ctx.get('Authorization');
    user = jwt.sign(token, signKey);
    if (!user) {
      ctx.throw(401, '无权访问');
    }
    ctx.body = '大海和小蕊';
  }
})

...
```

客户端请求登录成功以后，会得到 `token` ，可以使用 `localStorage` 等方式保存在客户端。

```js
function login() {
  let xhr = new XMLHttpRequest();
  xhr.open('post', '/login');
  xhr.onload = function() {
    if ( xhr.status >= 200 && xhr.status < 300 ) {
      let token = xhr.getResponseHeader('Authorization');
      localStorage.setItem('token', token);
    }
  }
  xhr.send(JSON.stringify({username:'zMouse', password: '123456'}));
}

function getUserProfile() {
  let xhr = new XMLHttpRequest();
  xhr.open('get', '/user/profile');
  xhr.onload = function() {
    console.log(xhr.responseText);
  }
  let token = localStorage.getItem('token');
  xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  xhr.send();
}
```



## 6、Fetch 请求

`Fetch API` 提供了一个获取资源的接口（包括跨域请求）。任何使用过 `XMLHttpRequest` 的人都能轻松上手，而且新的 `API` 提供了更强大和灵活的功能集。同时还提供了一些常用通用对象的定义：

- Reuqest
  - 针对资源请求进行操作的对象。
- Response
  - 针对响应资源进行操作的对象。
- Headers
  - 针对头信息进行检索、设置、添加、删除等操作的对象。

```js
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');

const myRequest = new Request('/user', {
  method: 'post',
  headers: myHeaders,
  body: JSON.stringify({username: 'zMouse', password: '123456'})
});

// res => response 对象
let res = await fetch(myRequest);
let data = await res.json();
// let data = await res.text();
```



## 7、XMLHttpRequest Vs Fetch

**XMLHttpRequest**

- 支持请求和响应进度事件
- 支持请求取消：`abort`

**Fetch**

- 更规范、标准的 `API` 支持。
  - `Header` 、`Request` 、`Response` 、`Promise` 、`CORS` 



## 

## 8、案例：前后端分离重构商城应用