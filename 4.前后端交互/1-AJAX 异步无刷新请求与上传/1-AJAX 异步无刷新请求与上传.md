# 1-AJAX 异步无刷新请求与上传

[toc]



## 1、传统请求交互的特点和问题

### 1-1、传统请求交互的特点

客户端请求 -> 服务端（node web server）处理请求 -> **处理数据（数据+模板的渲染）** -> 返回渲染后的数据到前端。

**问题：**

- 服务端需要每次对数据和模板进行渲染、占用服务端的资源。
  - 影响服务端性能。
- 每次想获取新的内容都会通过浏览器重新发送一个请求，并重载整个页面（或在另外一个窗口中渲染页面）。
  - 影响用户体验。



## 2、异步无刷新

通过浏览器提供的一个 `JS API` ， 它可以向服务端发送请求，这个请求返回的数据将被 `JS` 所接收，然后我们就可以通过 `JS` 来控制这个数据的渲染（DOM操作） - `AJAX（Asynchronous Javascript And XML（异步JavaScript和XML））`。

> XML：一种与 `HTML` 类似的标记语言，早期 `AJAX` 利用该格式进行前后端的数据传输，`AJAX` 中的 `X` 虽然早期可能代表 `XML` ，但是实际上传输过程中的数据也可以是其它任意类型格式的数据，如 `HTML` 、`JSON` ……，所以 `X` 表示未知或者不限更合理：）。

现代浏览器支持多个具有 `HTTP` 的 `API` 

**XMLHttpRequest**

优势：出现较早，浏览器支持最好的 `API` 。

劣势：`API` 相对陈旧，一些现代 `JS` 语言特性需要封装（如：`Promise`）。

**Fetch**

优势：较新，对一些特性有天然良好的支持（如：`Promise` 、`CORS`）。

劣势：兼容、缺少事件支持。



## 3、异步请求流程与实现 - XMLHttpRequest

`XMLHttpRequest`（XHR）对象用于与服务器交互。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 `URL` ，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。`XMLHttpRequest` 在 [AJAX](https://developer.mozilla.org/zh-CN/docs/Glossary/AJAX) 编程中被大量使用。

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest

使用 `XHR` 与服务端通信的基本流程如下：

### 3-1、创建 XMLHttpRequest 对象

```js
let xhr = new XMLHttpRequest();
```

### 3-2、配置请求参数

```js
xhr.open(string method, string url, boolean async);
```

**method：**

`HTTP` 请求方法，支持：`GET`、`POST`、`PUT`、`PATCH`、`DELETE` ……。

**url：**

请求资源的 `URL` 。

**async：**

是否使用 `异步模式` 发送请求，默认为 `true` ，且推荐在主进程中是用 `true` 。

使用 `false` 表示使用 `同步模式` ，会影响用户体验。

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open

### 3-3、发送请求

只有调用 `send` 方法，请求才正式发出：

```js
xhr.send();
```

### 3-4、监听请求相关事件

因为我们使用了 `异步` 的方式来发送请求，那么就需要通过 `事件` 回调的方式来得到相关的反馈。

我们知道，一次交互会包含两个阶段：`请求（数据上传）` 、 `响应（数据下载）` 。

响应相关的事件：

**loadstart：**

接收到响应数据时触发。也可以使用 [`onloadstart`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onloadstart) 属性。

**progress：**

当请求接收到更多数据时，周期性地触发。也可以使用 [`onprogress`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onprogress) 属性。

**loadend：**

当请求结束时触发, 无论请求成功 ( [`load`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/load_event)) 还是失败 ([`abort`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/abort_event) 或 [`error`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/error_event))。也可以使用 `onloadend` 属性。

**load：**

[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)请求成功完成时触发。也可以使用 [`onload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onload) 属性。

**timeout：**

在预设时间内没有接收到响应时触发。也可以使用 `ontimeout` 属性。

**abort：**

当 request 被停止时触发，例如当程序调用 [`XMLHttpRequest.abort()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/abort) 时。也可以使用 [`onabort`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onabort) 属性。

**error：**

当 request 遭遇错误时触发。也可以使用 [`onerror`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onerror) 属性。

```js
xhr.onload = function() {
  console.log('请求完成了');
}
```

### 3-5、获取数据

`xhr` 对象还提供了许多的属性和方法，来帮助我们完成一些关键信息的获取：

**readyState：**

请求的状态码，参考：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState。

同时还提供一个 `readystatechange` 事件来监听 `readyState` 的变化。

**response：**

返回的原始内容，取决于 `responseType` 。

**responseType：**

返回响应数据的类型，可设置。参考：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType 。

**responseText：**

返回转换成文本类型的响应数据。类似：`responseType='text'` 后 `response` 的内容。

**status：**

响应状态码。

**statusText：**

响应状态文本。

**timeout：**

设置请求超时时间。

**upload：**

上传相关。

**withCredentials：**

跨域授权相关。

**getAllResponseHeaders()：**

获取所有响应头信息。

**getResponseHeader(string name)：**

获取指定头信息。

**overrideMimeType(string mimeType)：**

覆写响应头信息。

**setRequestHeader(string header, string value)：**

`XMLHttpRequest.setRequestHeader()` 是设置HTTP请求头部的方法。此方法必须在  `open()` 方法和 `send()`  之间调用。

**abort()：**

取消请求。

```js
...
xhr.onload = function() {
  console.log(this.responseText);
}
...
```

## 4、请求配置参数与数据的设置

### 4-1、动态路由

```js
...
let itemId = 1;
xhr.open('get', `/item/${itemId}`);
...
```

### 4-2、queryString

```js
...
let page = 1;
let limit = 5;
xhr.open('get', `/items?page=${page}&limit=${limit}`);
...
```

### 4-3、正文

**urlencoded**

```js
...
let username = 'zMouse';
let password = '123456';
xhr.open('post', '/login');

// 设置头信息
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// 正文通过 send 方法传入
xhr.send(`username=${username}&password=${password}`);
```

**json**

```js
...
let username = 'zMouse';
let password = '123456';
xhr.open('post', '/login');

// 设置头信息
xhr.setRequestHeader('Content-Type', 'application/json');
// 正文通过 send 方法传入
xhr.send( JSON.stringify( {username, password} ) );
```

**form-data**

```js
...
let username = 'zMouse';
let password = '123456';
xhr.open('post', '/login');

// 使用 FormData 来构建数据
let fd = new FormData();
fd.append('username', username);
fd.append('password', password);
// 直接把 FormData 作为参数，xhr 会在发送请求的时候自动设置对应的 头信息 和 对应的数据格式
xhr.send( fd );
```



## 5、上传与下载

`xhr` 提供了一个 `upload` 属性，它是一个 `XMLHttpRequestUpload` 对象，用来表示上传的进度。

| 事件          | 相应属性的信息类型               |
| ------------- | -------------------------------- |
| `onloadstart` | 获取开始                         |
| `onprogress`  | 数据传输进行中                   |
| `onabort`     | 获取操作终止                     |
| `onerror`     | 获取失败                         |
| `onload`      | 获取成功                         |
| `ontimeout`   | 获取操作在用户规定的时间内未完成 |
| `onloadend`   | 获取完成（不论成功与否）         |

```js
...
// <input type="file" id="avatar" />
let avatar = document.querySelector('#avatar');

avatar.onchange = function() {
  
  let xhr = new XMLHttpRequest();
  
  xhr.open('post', '/avatar');
  
  xhr.upload.onloadstart = function() {
    console.log('开始上传');
  }
  xhr.upload.progress = function(e) {
    console.log( `上传进度: ${e.loaded}/${e.total} ` );
  }
  xhr.upload.onload = function() {
    console.log(`上传成功`);
  }
  
  let fd = new FormData();
  // 获取 input 中选择的文件
  fd.append('avatar', avatar.files[0]);
  
  xhr.send(fd);
}

...
```



## 6、案例：使用 ajax 重构商城应用



