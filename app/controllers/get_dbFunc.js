let sqlite3 = require('sqlite3').verbose();
const tableUser = "users";
const tableStat = "users_statistic";


  //db.close();

    let db = new sqlite3.Database('bitmedia.db');

    //* function for get users by page number
    async function GetUsersFunc (x){
        
        dataPromis = new Promise((res,rej) => {
            db.all(`SELECT * FROM ${tableUser} LIMIT 50 OFFSET ${(x-1)*50};`, (error, rows) => {
                if (error){
                    console.log(error)
                }
                let rows2 = addValue(rows)
                res(rows);
            }

            )     
            })
                 //!!! not work is back map array
                // .then(rows2 => {
                // return new Promise((res, rej) => {
                //         let rows3 = rows2.map(async function (row) {
                //         obj1 = GetTotal(row.id);
                //         obj2 = Object.assign(row, await obj1.then(data => {return data}));
                //         console.log('RR P', obj2);
                //         return obj2
                // })

                //     console.log(rows3)
                //     res(rows3)
                // })
                // })

           
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
    
    //* function for attach data of user
    async function addValue(rows){
        let newRows = new Promise ((res,rej) => {
                let rows2 = rows.map(async function (row) {
                        obj1 = GetTotal(row.id);
                        obj2 = Object.assign(row, await obj1.then(data => {return data}));
                        console.log('RR', obj2);
                        return obj2
                });
                res(rows2)
        });
        
          return await newRows.then(function(data){return data})
    }

     //* get all statistic by user id
    let GetUsersStat = (id) => {
        let dataStatPromis = new Promise ((res,rej) => {
            db.all(`SELECT page_views, clicks FROM ${tableStat} WHERE user_id=${id};`, (error, rows) => {
                    res(rows)
                }
            )
        });
        return dataStatPromis.then(function(data){return data})
    }

    module.exports.data = GetUsersFunc;
    module.exports.stat = GetUsersStat;