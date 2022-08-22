const Koa = require('koa');
const koaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const http = require('http');

const app = new Koa();

app.use(koaStaticCache({
    prefix: '/public',
    dir: './public',
    gzip: true,
    dynamic: true
}));


const router = new KoaRouter();

router.get('/users', async (ctx, next) => {

    // 利用 nodejs 提供的 api 去请求 目标服务器的真实数据
    let users = await request();

    console.log(users);

    // ctx.body = 'users';
    ctx.body = users;
})

app.use(router.routes());


app.listen(9999, () => {
    console.log(`服务器启动成功：http://localhost:9999`);
});


function request() {
    return new Promise((resolve, reject) => {
        let req = http.request({
            protocol: 'http:',
            hostname: 'localhost',
            port: '8888',
            path: '/users',
            method: 'get'
        }, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk.toString();
            });

            res.on('end', () => {
                resolve(data);
            })
        });

        req.write('');
        req.end();
    })
}
