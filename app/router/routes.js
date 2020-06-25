const Koa = require('koa');
const bodyParser = require('koa-bodyparser'); 
//const convert = require('koa-convert');
//const KoaBody = require('koa-body');
//const cors = require('@koa/cors');
const Router = require('koa-router');

const GetFunc = require('../controllers/get_dbFunc');
const Validate = require('../controllers/validate');

const app = new Koa();
let router = new Router(app);

//let koaBody = convert(KoaBody());
//* Router
    router
        .get('/users/:id', bodyParser(), async (ctx, next) => {
          console.log('user id Route Requested');
          ctx.status = 200;
          //* add allow CORS
          ctx.set('Access-Control-Allow-Origin', origin);

          //* Validate number page
          console.log(Validate.asNumber(ctx.params.id))
          if (!Validate.asNumber(ctx.params.id)) {
              ctx.response.body = await GetFunc.data(ctx.params.id).then(function(data){return data})
          };
        })

        .get('/stat/:id', bodyParser(), async (ctx, next) => {
          console.log('stat id Route Requested');
          ctx.status = 200;
          //* add allow CORS
          ctx.set('Access-Control-Allow-Origin', "*");
          //* Validate as number id user
          if (!Validate.asNumber(ctx.params.id)) {
              ctx.response.body = await GetFunc.stat(ctx.params.id);
          }
        })

     

exports.routes = router.routes();
exports.allowedMethods = router.allowedMethods();