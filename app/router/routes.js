const Koa = require('koa');

const send = require('koa-send');
const KoaBody = require('koa-body');
const bodyParser = require('koa-bodyparser'); 
const convert = require('koa-convert');

//const mongoose = require('mongoose');
const path = require('path');

const Router = require('koa-router');

const getFunc = require('../controllers/get_dbFunc');
//const session = require('koa-session');
//const session = require("koa-session2");

//let dbFunc = require('../controllers/dbFunc');
//let npFunc = require('../controllers/novapostaFunc');


//import config from '../../config/default';
const app = new Koa();
let router = new Router(app);


//app.keys = ['some secret hurr']; should be in start app file

//app.use(session(app));



/** Search all contact */
let dataDB = [];
let dataPromis = {};

function GetDataContact(){
    dataPromis = new Promise((res,rej) => {
        contactModel.find({}, 
            //await function(err, name) {
            function(err, data) {
                 if (err) {
                   next(err)
                 } else {
                    //console.log("GET DATA")
                    res(dataDB = data)
                    //console.log(dataDB)
                 }
            })
        })
    };



let koaBody = convert(KoaBody());

    router

        .get('/users/:id', bodyParser(), async (ctx, next) => {
          console.log('Test POST Route Requested');
          //console.log(ctx.req.body);
          //console.log(ctx.req)
          ctx.status = 200;
          //ctx.response.body = "Hi Lotus" + ctx.params.id;
          ctx.response.body = await getFunc(ctx.params.id).then(function(data){return data});
        })

        //* login register route
 

        // .get('/logout', bodyParser(), async (ctx, next) => {
        //   //console.log(dbFunc.getAllUserData());
        //   console.log('Logout route requested');
        //   ctx.session.username = '';
        //   ctx.session.usertype = '';
        //   ctx.res.status = 302;
        //   ctx.redirect('/');
        // })

        .post('/', bodyParser(), async (ctx, next) => {
            console.log('post req - app send home page')
            ctx.status = 204;
            let contactUser = new contactModel(ctx.request.body);
            contactUser.save();

            await GetDataContact();
            await dataPromis.then(function () {
                ctx.body = page1(arrPerson, dataDB);
            })
            ctx.status = 205;
            
        })
        .post('/create', bodyParser(), async (ctx, next) => {
            console.log('post req - app send home page action /create')
            //ctx.status = 205;
            //console.log (ctx.params);
            console.log ('/create');
            console.log ("Body req", ctx.request.body);
            //***let contactUser = new contactModel(await ctx.request.body);
            //***contactUser.save();

            dbFunc.create(await ctx.request.body);

            //await GetDataContact();
            //await dataPromis.then(function () {
            //    ctx.body = page1(arrPerson, dataDB);
            //})
            ctx.status = 200;

        })

        .post('/update/:id', bodyParser(), async (ctx, next) => {
          console.log('post req - app send home page action /UPDATE')
          //ctx.status = 205;
          //console.log (ctx.params);
          //console.log ('/update');
          console.log (await ctx.request.body);
          console.log (await ctx.params);
          //let contactUser = new contactModel(await ctx.request.body);
          //contactUser.save();
          //await contactModel.update(ctx.request.body._id, ctx.request.body.name);
          await contactModel.updateOne({"_id" : ctx.params.id}, ctx.request.body );
              //{
              //  $set: { ctx.request.body },
                  //$set: {  "name" : ctx.request.body.name,  "internal_phone" : ctx.request.body.internal_phone },
              //}
          

          //await GetDataContact();
          //await dataPromis.then(function () {
          //    ctx.body = page1(arrPerson, dataDB);
          //})
          ctx.status = 205;

      })
        .delete('/', bodyParser(), async (ctx, next) => {
            console.log('post req - app send home page action /delete')
            
            //console.log (ctx.params);
            console.log ('/delete');
            console.log (await ctx.request.body);
            await RemoveContact(await ctx.request.body.id);
            
            //ctx.redirect('/');
            //ctx.redirect('http://google.com')
            await GetDataContact();
            await dataPromis.then(function () {
                //ctx.body = page1(arrPerson, dataDB);
                ctx.body = "Hi";
                //ctx.res.end()
            })
            ctx.status = 205;

            //let contactUser = new contactModel(ctx.request.body);
            //contactUser.save();
        })



        .get('/stat', async (ctx, next) => {
            ctx.set({
              'Etag': '1234',
              'Last-Modified': "bla-bla-bla",
              powerr: "powerr"
            });
         
          await GetDataContact();
          await dataPromis.then(function () {
              ctx.body = pageStat(arrPerson, dataDB);
              ctx.res.statusCode = 200;

          })

          //await send(ctx, ctx.path, { powerr:'my_power'});
        console.log('GET req - app send home page')
        //console.log(ctx)
      })

        .get('/employee', bodyParser(), async (ctx, next) => {
            console.log('GET req - app send employee page')
            //ctx.body = await product.getAll()
            //console.log(ctx.path);
            //console.log(ctx);
            ctx.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
            ctx.path = '/';
            ctx.type = 'html';
            //ctx.set('Content-Type', 'text/html');
            //console.log(ctx,  ctx.path, {root:  catalog + '/employee_to_work.html'});
            ctx.body = 'Hi employee'
            await send(ctx,  ctx.path, {root:  catalog + '/employee_to_work.html'});
            
            
            
            //ctx.body = 'employee';
            //ctx.status = 200;   
            

            
        })

  
       
        //**User routes */
        .get('/user', async (ctx, next) => {
            console.log('Requested user route');
            //ctx.path = '/';
            //ctx.body = 'Hi employee'
            //await send(ctx,  ctx.path, {root:  catalog + '/userhome.html'});
            if (ctx.session.usertype == 'user' | ctx.session.usertype == 'admin') {
              //console.log(ctx.session.usertype)

              //ctx.body = await npFunc.getCities();
              
              await GetDataContact();
              await dataPromis.then(function () {
                ctx.body = pageUserHome(ctx.session.username, arrPerson, dataDB);
                  ctx.res.statusCode = 200;
              })
              //ctx.status = 200;
              //ctx.response.body = ctx.session.username;

          }
          else {
              ctx.status = 401;
              ctx.response.body = 'Access denies';
          }
        })
        
       


exports.routes = router.routes();
exports.allowedMethods = router.allowedMethods();