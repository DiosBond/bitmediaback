require("./controllers/start_dbFunc");

const Koa = require('koa');
const routers = require('./router/routes');
const app = new Koa();

const portNum = 8080;

app.use(routers.routes);
app.use(routers.allowedMethods);

app.listen(portNum, function () {
    let d = new Date();
    console.log('server app start at port ', portNum, " " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes());
});
