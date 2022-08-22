const Koa = require('koa');
const koaStaticCache = require('koa-static-cache');

const app = new Koa();

app.use(koaStaticCache({
    prefix: '/public',
    dir: './public',
    gzip: true,
    dynamic: true
}));


app.listen(9999, () => {
    console.log(`服务器启动成功：http://localhost:9999`);
});
