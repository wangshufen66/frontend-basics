const Koa = require('koa');
const koaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const fs = require('fs');


const app = new Koa();

app.use(koaStaticCache({
    prefix: '/public',
    dir: './public',
    dynamic: true,
    gzip: true
}));

const router = new KoaRouter();


router.get('/users', async (ctx, next) => {

    // 客户端的每一次请求，都需要在服务端判断一下当前这次请求与上次请求的数据是否有不同
    let n = ctx.request.query.n;

    let users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));

    while (users.length == n) {
        console.log(`数据没有变化，休眠1s，继续读取`);
        // 数据没有变化，间隔1s，再次读取数据，进行判断，不断重复，直到 users.length 与 n 的值不一样
        await sleep(3000);
        // console.log(123)
        users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
    }

    console.log(`返回数据`);

    ctx.body = users;
})

app.use(router.routes())

app.listen(8888)


function sleep(t = 1000) {
    return new Promise(((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, t);
    }))
}
