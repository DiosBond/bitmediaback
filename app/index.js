require("./controllers/start_dbFunc");
require("./controllers/pars");

const portNum = 8080;

const Koa = require('koa');
const routers = require('./router/routes');
const app = new Koa();

app.use(routers.routes);
app.use(routers.allowedMethods);

app.listen(portNum, function () {
    let d = new Date();
    console.log('server app start at port ', portNum, " " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes());
    

});
