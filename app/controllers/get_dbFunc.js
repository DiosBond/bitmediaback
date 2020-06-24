let sqlite3 = require('sqlite3').verbose();
const tableUser = "users";
const tableStat = "users_statistic";


  //db.close();

    let db = new sqlite3.Database('bitmedia.db');

    //* function for get users by page number
    async function GetUsersFunc (x){
        
        dataPromis = new Promise((res,rej) => {
            db.all(`SELECT * FROM ${tableUser} LIMIT 3 OFFSET ${(x-1)*50};`, (error, rows) => {
                if (error){
                    console.log(error)
                }

                //let rows2 = addValue(rows)
                res(rows);
            }

            )     
            })
      
                .then(rows2 => {
                return new Promise((res, rej) => {
                        let rows3 = rows2.map(async function (row) {
                        obj1 = GetTotal(row.id);
                        obj2 = Object.assign(row, await obj1.then(data => {return data}));
                        console.log('RR P', obj2);
                        return obj2
                })

                    console.log(rows3)
                    res(rows3)
                })
                })

           

        return dataPromis;
  
    }

    //* get clicks and views by user id
    async function GetTotal(id){

        let count = {
            views : 0,
            clicks : 0
        };

        let dataTotalPromis = new Promise ((res,rej) => {
            db.all(`SELECT page_views, clicks FROM ${tableStat} WHERE user_id=${id};`, (error, rows) => {
                    rows.forEach((el) => {
                        count.views = count.views + el.page_views;
                        count.clicks = count.clicks + el.clicks;
                    })
                    res(count)
                }
            )
        });
        return await dataTotalPromis.then(function(data){return data})
    }
    
    async function addValue(rows){
        let newRows = new Promise ((res,rej) => {
                let rows2 = rows.map(async function (row) {
                        obj1 = GetTotal(row.id);
                        obj2 = Object.assign(row, await obj1.then(data => {return data}));
                        console.log('RR', obj2);
                        return obj2
                });
                //console.log("rows2", rows2.then((data)=>{console.log(data)}));
                res(rows2)
        });
        
          //console.log("rows", newRow.then(function(data){return data}))
          //console.log("new Rows", newRows.then((data)=>{console.log(data)}))
          return await newRows.then(function(data){return data})
    }


    //exports.func = func();
    module.exports = GetUsersFunc;