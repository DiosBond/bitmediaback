let sqlite3 = require('sqlite3').verbose();
const tableUser = "users";
const tableStat = "users_statistic";


  //db.close();

    let db = new sqlite3.Database('bitmedia.db');

    //* function for get users by page number
    async function GetUsersFunc (x){
       
        dataPromis = new Promise((res,rej) => {
            db.all(`SELECT * FROM ${tableUser} LIMIT 50 OFFSET ${(x-1)*50};`,async (error, rows) => {
                if (error){
                    console.log("Error ", error)
                }
                else {
                    let rows2 = addValue(rows);
                    res(rows2)
                }
            }
            )     
        })
     
        return await dataPromis
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

        return await dataTotalPromis.then(async function(data){return await data})
    }
    
    //* function for attach data of user
    async function addValue(rows){
        let newRows = new Promise (async (res,rej) => {
                let rows2 = rows.map(async (row) => {
                        obj1 = GetTotal(row.id);
                        obj2 = Object.assign(row, await obj1.then(async data => {return data}));
                        return obj2
                });
                res(rows2)
        });
        
          return await newRows
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