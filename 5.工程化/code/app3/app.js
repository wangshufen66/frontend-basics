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
    let users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));

    ctx.set('Content-Type', 'text/event-stream');

    // ctx.body = users;

    let eventStreamData = JSON.stringify(users);

    ctx.body = `event: users\ndata:${eventStreamData}\n\n`;
})

app.use(router.routes())

app.listen(8888)
