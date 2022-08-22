const Koa = require('koa');
const koaBody = require('koa-body');
const KoaRouter = require('koa-router');

let userId = 2;
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


router.post('/add', koaBody(), async (ctx, next) => {

    let {username} = ctx.request.body;

    users.push({
        id: ++userId,
        username
    })

    ctx.body = '添加成功';
})

router.post('/login', async (ctx, next) => {

    ctx.cookies.set('a', 1);
    ctx.body = '登录成功';
})


app.use(router.routes());

app.listen(8888, () => {
    console.log(`服务器启动成功：http://localhost:8888`);
});
