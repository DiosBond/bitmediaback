const Koa = require('koa');

//const send = require('koa-send');
//const KoaBody = require('koa-body');
const bodyParser = require('koa-bodyparser'); 
//const convert = require('koa-convert');

const Router = require('koa-router');

const getFunc = require('../controllers/get_dbFunc');

const app = new Koa();
let router = new Router(app);


/** Search all contact */
let dataDB = [];
let dataPromis = {};

//let koaBody = convert(KoaBody());

    router
        .get('/users/:id', bodyParser(), async (ctx, next) => {
          console.log('user id Route Requested');
          ctx.status = 200;
          //ctx.response.body = "Hi Lotus" + ctx.params.id;
          ctx.response.body = await getFunc.data(ctx.params.id).then(function(data){return data});
        })

        .get('/stat/:id', bodyParser(), async (ctx, next) => {
          console.log('stat id Route Requested');
          ctx.status = 200;
          //ctx.response.body = "Hi Lotus" + ctx.params.id;
          ctx.response.body = await getFunc.stat(ctx.params.id);
        })

     

exports.routes = router.routes();
exports.allowedMethods = router.allowedMethods();