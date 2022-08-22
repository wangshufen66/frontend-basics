const Koa = require('koa');
const koaBody = require('koa-body');
const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const key = 'kkb';

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

    let token = ctx.get('Authorization');
    // 验证token是否合法，如果不合法则抛出错误，如果合法，则把token 中的 payload 数据进行解析返回
    let user;
    try {
        let user = jwt.verify(token, key);
    } catch (e) {
        ctx.status = 401;
        return ctx.body = {
            code: 1000,
            message: '你还没有登录'
        }
    }

    console.log('user', user);

    // console.log('token', token);

    if (!user) {
        ctx.status = 401;
        return ctx.body = {
            code: 1000,
            message: '你还没有登录'
        }
    }

    ctx.body = users;
})

router.post('/login', koaBody(), async (ctx, next) => {
    let {username} = ctx.request.body;

    let user = users.find(u => u.username == username);

    if (!user) {
        ctx.status = 401;
        return ctx.body = {
            code: 1000,
            message: '用户不存在或密码错误'
        }
    }

    // cookie
    // 生成 token 字符串（签名）
    let token = jwt.sign({
        id: user.id,
        username: user.username
    }, key);

    // console.log('token', token);

    ctx.set('Authorization', token);

    ctx.body = {
        code: 0,
        message: '登录成功',
        data: user
    }
})


router.post('/add', koaBody(), async (ctx, next) => {

    let {username} = ctx.request.body;

    users.push({
        id: ++userId,
        username
    })

    ctx.body = '添加成功';
})

// router.post('/login', async (ctx, next) => {
//
//     ctx.cookies.set('a', 1);
//     ctx.body = '登录成功';
// })


app.use(router.routes());

app.listen(8888, () => {
    console.log(`服务器启动成功：http://localhost:8888`);
});
