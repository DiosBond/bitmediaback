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
        //.all('/create', async (ctx, next) => {
        //  console.log('all req')
        //})
        // .get('/', async (ctx, next) => {
            
        //     //    ctx.body = (path.join(__dirname, './public/login.html'));
        //     ctx.path = '/';
        //     //console.log(ctx,  ctx.path, {root:  catalog + '/employee_to_work.html'});
        //     await send(ctx,  ctx.path, {root:  catalog + '/login.html'});
        //     ctx.status = 200;
            // ctx.set({
            //     'Etag': '1234',
            //     'Last-Modified': "bla-bla-bla",
            //     powerr: "powerr"
            //   });

            // await GetDataContact();
            // await dataPromis.then(function () {
            //     ctx.body = page1(arrPerson, dataDB);
            //     ctx.res.statusCode = 200;

            //})

            //await send(ctx, ctx.path, { powerr:'my_power'});
        //   console.log('GET req - app send home page')

        // })

        .get('/manager', bodyParser(), async (ctx, next) => {
            console.log('MANAGER GET Route Requested');
            //console.log(ctx.request.body);
            //ctx.status = 200;
            if (ctx.session.usertype == 'admin') {
                //console.log(ctx.session.usertype)
                
                await GetDataContact();
                await dataPromis.then(function () {
                    ctx.body = pageManagerHome(ctx.session.username, arrPerson, dataDB);
                    ctx.res.statusCode = 200;
                })
                //ctx.status = 200;
                //ctx.response.body = ctx.session.username;

            }
            else {
                ctx.status = 401;
                ctx.response.body = 'Access denies';
            }
            
            //ctx.status = 302;
            //ctx.response.redirect('/employee')

        })

        .get('/users/:id', bodyParser(), async (ctx, next) => {
          console.log('Test POST Route Requested');
          //console.log(ctx.req.body);
          //console.log(ctx.req)
          ctx.status = 200;
          //ctx.response.body = "Hi Lotus" + ctx.params.id;
          ctx.response.body = getFunc(ctx.params.id);
        })

        //* login register route
        .post('/login', bodyParser(), async (ctx, next) => {
            //console.log(dbFunc.getAllUserData());
            console.log('IP', ctx.request.ip)
            let arrUsers = await dbFunc.getAllUserData();
            let f_user;
            console.log(await ctx.request.body);
            // поиск пользователя в массиве users 
            for (let i = 0; i < arrUsers.length; i++) {
                console.log(arrUsers.length)
                let user = arrUsers[i];

                console.log("User", user.name, user.pass)

                if ((user.name == ctx.request.body.username) && (user.pass == ctx.request.body.password)) {
                    f_user = {
                        name : user.name,
                        type : user.type
                    }
              
                    break;
                }
            };
            console.log("Finded and verif user from db", f_user)
        
              // ignore favicon
  //if (ctx.path === '/favicon.ico') return;
  // app.use(async (ctx, next) => {
  //   this.session.username = 'james';
  //   this.session.type = 'admin'

            if (f_user !== undefined) {
                ctx.session.username = f_user.name;
                ctx.session.usertype = f_user.type;
                console.log("Login is OK: ", ctx.request.body.username);
                console.log("Session usertype", ctx.session.usertype)

      
                if (f_user.type == "admin") {
                    ctx.body = '/manager';  //***send route for page*/
       
                }
                else {
                    ctx.response.redirect(301, 'user')
                }
            } else {
            console.log("Login error by user: ", ctx.request.body.username)
            ctx.res.status = 401
            ctx.body = 'Login or password error';
              }
      



        })

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


        .get('/warehouse', async (ctx, next) => {
          ctx.set({
            'Etag': '1234',
            'Last-Modified': "bla-bla-bla",
            powerr: "warehouse"
          });
       
        await GetDataContact();
        await dataPromis.then(function () {
            ctx.body = pageWarehouse(arrPerson, dataDB);
            ctx.res.statusCode = 200;

        })
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
        .get('/books/:id', async (ctx, next) => {
            let result = await product.get(ctx.params.id);
            if (result) {
                ctx.body = result
            } else {
                ctx.status = 204;
            }
        })
  
        // .post('/', async (ctx, next) => {
        //     //ctx.status = 200;
        //     console.log('post req');
        //     ctx.status = 204;
        //     await send(ctx, ctx.path, { root: catalog + '/index.html' });
        // })
        // .post('/create', koaBody, async (ctx, next) => {
        //     console.log('post create req');
        //     ctx.status = 204;
        //     console.log(await ctx.request.body)
        //     //ctx.body = await books_func.create(ctx.request.body);
        //     await send(ctx, ctx.path, { root: catalog + '/index.html' });
        // })
        .put('/books/:id', koaBody, async (ctx, next) => {
            ctx.status = 204;
            await product.update(ctx.params.id, ctx.request.body);
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
        
        //**Test routes */
        .get('/getCity', async (ctx, next) => {
          console.log('Requested getCity route');
          if (ctx.session.usertype == 'user' | ctx.session.usertype == 'admin') {
            ctx.body = await npFunc.getAllCities();
            //ctx.body = await npFunc.getWarehouseCity('125bfa12-dadf-11e9-b48a-005056b24375')

          }
          else {
            ctx.status = 401;
            ctx.response.body = 'Access denies';
        }
        })
        .get('/getWarehouse', async (ctx, next) => {
          console.log('Requested getCity route');
          if (ctx.session.usertype == 'user' | ctx.session.usertype == 'admin') {
            //ctx.body = await npFunc.getAllCities();
            ctx.body = await npFunc.getWarehouseCity('125bfa12-dadf-11e9-b48a-005056b24375')

          }
          else {
            ctx.status = 401;
            ctx.response.body = 'Access denies';
        }
        });



  //       function RemoveContact (Todo, req, res) {
  //         Todo.findByIdAndRemove(req.params.todoId, (err, todo) => {
  //           // As always, handle any potential errors:
  //           if (err) return res.status(500).send(err);
  //           // We'll create a simple object to send back with a message and the id of the document that was removed
  //           // You can really do this however you want, though.
  //           const response = {
  //               message: "Todo successfully deleted",
  //               id: todo._id
  //           };
  //           return res.status(200).send(response);
  //       });
  //   }
  
    function RemoveContact (id, Todo, req, res) {
      //contactModel.findByIdAndRemove(id, (err, todo) => {
          contactModel.findByIdAndDelete(id, (err, todo) => {
              console.log("deletion")
        // As always, handle any potential errors:
      //   if (err) return res.status(500).send(err);
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        //const response = {
        //    message: "Todo successfully deleted",
      //       id: todo._id
      //   };
        //return res.status(200).send(response);
    });
    GetDataContact();
  }


exports.routes = router.routes();
exports.allowedMethods = router.allowedMethods();