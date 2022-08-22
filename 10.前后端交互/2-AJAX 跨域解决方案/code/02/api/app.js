const Koa = require('koa');
const koaBody = require('koa-body');
const KoaRouter = require('koa-router');

let users = [
    {
        id: 1,
        username: 'DaHai'
    },
    {
        id: 2,
        username: 'zMouse'
    }
]

const app = new Koa();

const router = new KoaRouter();


router.get('/users', async (ctx, next) => {
    ctx.body = users;
})

app.use(router.routes());

app.listen(8888, () => {
    console.log(`服务器启动成功：http://localhost:8888`);
});
