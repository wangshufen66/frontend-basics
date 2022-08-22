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

const whiteList = [
    'http://localhost:9999',
    'http://localhost:7777'
]

app.use(async (ctx, next) => {
    // ctx.set('Access-Control-Allow-Origin', 'http://localhost:9999');

    // console.log(ctx.get('origin'));

    if (whiteList.includes(ctx.get('origin'))) {
        ctx.set('Access-Control-Allow-Origin', ctx.get('origin'));
        ctx.set('Access-Control-Allow-Credentials', true);
    }


    // console.log(ctx.method)

    if (ctx.method.toUpperCase() === 'OPTIONS') {
        ctx.set('Access-Control-Allow-Headers', 'Content-Type');
        ctx.body = '';
    } else {
        await next();
    }
});

const router = new KoaRouter();


router.get('/users', async (ctx, next) => {
    // CORS 头

    ctx.body = users;
})

// router.options('/add', async (ctx, next) => {
//     // console.log('...')
//     // ctx.set('Access-Control-Allow-Origin', 'http://localhost:9999');
//     ctx.set('Access-Control-Allow-Headers', 'Content-Type');
//
//     ctx.body = '';
// });

router.post('/add', koaBody(), async (ctx, next) => {

    console.log('a', ctx.cookies.get('a'));

    let {username} = ctx.request.body;

    users.push({
        id: ++userId,
        username
    })

    ctx.set('Access-Control-Allow-Origin', 'http://localhost:9999');
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
