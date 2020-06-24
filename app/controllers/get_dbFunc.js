let sqlite3 = require('sqlite3').verbose();
let dataFileUser = require('../data/users.json');
let dataFileStat = require('../data/users_statistic.json');
const tableUser = "users";
const tableStat = "users_statistic";




// let db = new sqlite3.Database('bitmedia.db', (err) => {
//     if (err) {

//         console.log(err);
//         if (err.errno == 14) {
//             console.log("True")
//             //createDb();
            
//         }      //return console.error(err.message);
      
//     }

//     console.log('Connected to SQlite database.');



    //db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='lorem'", function(error, row) {
	//	if (row !== undefined) {}})

//   } );

//   function checkTable(table){
//     db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`, function(error, searchTable) {
//         console.log("table", searchTable);
//         if (searchTable == undefined) {
//             console.log("no table", table);
//             switch (table) {
//                 case tableUser :
//                     createTableUsers();
//                 break;
//                 case tableStat :
//                     createTableStat();
//                 break;
//             }
//       }
//     })
//   }
  

  //db.close();

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

    let db = new sqlite3.Database('bitmedia.db');

    //* function for get users by page number
    function GetUsersFunc (x){
        dataPromis = new Promise((res,rej) => {
            db.all(`SELECT * FROM ${tableUser} LIMIT 1 OFFSET ${(x-1)*50};`, (error, rows) => {
                if (error){
                    console.log(error)
                }
                if (rows !== undefined) {
                    //console.log(row);
                    rows.forEach((row) => {
                        console.log(row);
                        GetTotal(row.id)
                      });
                    }
                    res(rows);
                    //console.log(rows)
                //}
            })     
            })
            return dataPromis;
    }

    //* get clicks and views by user id
    function GetTotal(id){
        db.all(`SELECT page_views, clicks FROM ${tableStat} WHERE user_id=${id};`, (error, rows) => {
            let countViews = 0;
            let countClicks = 0;

            rows.forEach((el) => {

                countViews = countViews + el.page_views;
                countClicks = countClicks + el.clicks;
            })
            console.log(rows)
            console.log(countClicks, countViews)
        }
        )
    }

    //exports.func = func();
    module.exports = GetUsersFunc;