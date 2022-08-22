const Koa = require('koa');
const http = require('http');
const koaStaticCache = require('koa-static-cache');

// io => 构建websocket服务器的方法
const io = require("socket.io");

const app = new Koa();


app.use(koaStaticCache({
    prefix: '/public',
    dir: './public',
    dynamic: true,
    gzip: true
}));


// app.listen(8888);
// 重写 koa 的listen 过程
const server = http.createServer(app.callback());

// 构建
const webSocket = io(server);


// 监听事件
// 每一个独立的客户端和服务器建立连接以后，会生成一个 对象，该对象保存了两个独立连接的相关信息和对应的方法，当前这个客户端与服务器的通信都是基于给对象来进行的

let sockets = [];

webSocket.on('connection', (socket) => {
    console.log(`有客户端通过websocket连接了`);

    sockets.push(socket);

    // 监听 chat message 事件
    socket.on('chat message - client', (msg) => {
        console.log('message: ' + msg);

        // 对当前这个 socket 进行 emit
        socket.emit('chat message - server', msg);

        // sockets.filter(s => s==socket);
        socket.broadcast.emit('chat message - server', msg);


        // sockets.forEach(s => {
        //     s.emit('chat message - server', msg);
        // })
    })

})

server.listen(8888);
