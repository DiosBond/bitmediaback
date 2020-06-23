let sqlite3 = require('sqlite3').verbose();
let dataFileUser = require('../data/users.json');
let dataFileStat = require('../data/users_statistic.json');
const tableUser = "users";
const tableStat = "users_statistic";


function createDb() {
    console.log("createDb bitmedia");
    db = new sqlite3.Database('bitmedia.sqlite3');
    //db = new sqlite3.Database('bitmedia.sqlite3', createTable);
};

function createTableUsers() {
    console.log("createTable users");
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, email EMAIL, gender TEXT, ip_address TEXT)", insertUsers);
}

function createTableStat() {
    db.run("CREATE TABLE IF NOT EXISTS users_statistic (user_id INTEGER, date DATE, page_views INTEGER, clicks INTEGER)", insertStatistic);
}

function insertUsers() {
    console.log("start insertUsers");
    let stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?,?)");

    dataFileUser.forEach(elem => {
        // id, first_name, last_name, email, gender, ip_address
        stmt.run(elem.id, elem.first_name, elem.last_name, elem.email, elem.gender, elem.ip_address);
        })
    console.log("create table from JSON USER")
    //stmt.finalize(readAllRows);
}

function insertStatistic() {
    console.log("start insertStatistic");
    let stmt = db.prepare("INSERT INTO users_statistic VALUES (?, ?, ?, ?)");

    dataFileStat.forEach(elem => {
        //user_id, date, page_views, clicks
        stmt.run(elem.user_id, elem.date, elem.page_views, elem.clicks);
    })
    console.log("create table from JSON STAT")
    //stmt.finalize(readAllRows);
}


let db = new sqlite3.Database('bitmedia.db', (err) => {
    if (err) {

        console.log(err);
        if (err.errno == 14) {
            console.log("True")
            createDb();
            
        }      //return console.error(err.message);
      
    }

    console.log('Connected to SQlite database.');



    //db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='lorem'", function(error, row) {
	//	if (row !== undefined) {}})

  } );

  function checkTable(table){
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`, function(error, searchTable) {
        console.log("table", searchTable);
        if (searchTable == undefined) {
            console.log("no table", table);
            switch (table) {
                case tableUser :
                    createTableUsers();
                break;
                case tableStat :
                    createTableStat();
                break;
            }
      }
    })
  }
  
  dataFileStat[0];
  checkTable(tableUser);
  checkTable(tableStat);

  exports.func = func();