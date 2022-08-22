const Koa = require('koa');
const koaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const koaBody = require('koa-body');

let userId = 3;
let users = [
    {
        id: 1,
        username: 'haizi',
        gender: '男'
    },
    {
        id: 2,
        username: 'zMouse',
        gender: '男'
    },
    {
        id: 3,
        username: '萱姐',
        gender: '女'
    }
];

const app = new Koa();

app.use(koaStaticCache({
    prefix: '/public',
    dir: './public',
    gzip: true,
    dynamic: true
}));

const router = new KoaRouter();

router.get('/user/:id', async (ctx, next) => {
    let {id} = ctx.request.params;

    let user = users.find(u => u.id == id);

    ctx.body = user;
});


router.get('/users', async (ctx, next) => {

    let {gender} = ctx.request.query;

    // ctx.status = 400;
    // return ctx.body = {
    //     code: 100,
    //     message:'错误'
    // }

    let resUsers = users;

    console.log(gender)

    if (gender) {
        resUsers = users.filter(u => u.gender == gender);
    }

    // 不需要对数据进行渲染了，直接返回处理好的数据
    ctx.body = {
        code: 0,
        message: '',
        data: resUsers
    };

    // return new Promise(((resolve, reject) => {
    //
    //     setTimeout(() => {
    //         ctx.body = users;
    //         resolve();
    //     }, 3000);
    // }))
});

router.post('/add', koaBody({
    multipart: true
}), async (ctx, next) => {
    let {username, gender} = ctx.request.body;

    if (!username || !gender) {
        ctx.status = 400;
        ctx.body = {
            // 业务错误代码
            code: 1000,
            message: '参数传入错误'
        }
    }

    users.push({
        id: ++userId,
        username,
        gender
    });

    ctx.body = {
        code: 0,
        message: '添加成功'
    };
})

router.post('/avatar', koaBody({
    multipart: true,
    formidable: {
        uploadDir: './public/avatar',
        keepExtensions: true
    }
}), async (ctx, next) => {
    let {avatar} = ctx.request.files;

    let path = avatar.path;

    ctx.body = {
        code: 0,
        message: '上传成功',
        data: path
    }
});

router.post('/attachment', koaBody({
    multipart: true,
    formidable: {
        uploadDir: './public/attachment',
        keepExtensions: true,
        maxFileSize: 100000000
    }
}), async (ctx, next) => {
    let {attachment} = ctx.request.files;

    let path = attachment.path;

    ctx.body = {
        code: 0,
        message: '上传成功',
        data: path
    }
});

app.use(router.routes());

app.listen(8888, () => {
    console.log(`服务启动成功：http://localhost:8888`);
});
