let sqlite3 = require('sqlite3').verbose();

function createDb() {
    console.log("createDb bitmedia");
    db = new sqlite3.Database('bitmedia.sqlite3', createTable);
};

function createTable() {
    console.log("createTable users");
    db.run("CREATE TABLE IF NOT EXISTS users (info TEXT)", insertUsers);
    db.run("CREATE TABLE IF NOT EXISTS users_statistic (info TEXT, info2 TEXT)", insertStatistic);
}

function insertUsers() {
    console.log("start insertUsers");
    var stmt = db.prepare("INSERT INTO users VALUES (?)");

    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }

    //stmt.finalize(readAllRows);
}

function insertStatistic() {
    console.log("start insertStatistic");
    var stmt = db.prepare("INSERT INTO users_statistic VALUES (?, ?)");

    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i, i);
    }

    //stmt.finalize(readAllRows);
}


let db = new sqlite3.Database('bitmedia.db', (err) => {
    if (err) {

        console.log(err);
        if (err.errno == 14) {
            console.log("True")
            //createDb();
        }      //return console.error(err.message);
      
    }
    console.log('Connected to SQlite database.');

    createTable();

    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='lorem'", function(error, row) {
		if (row !== undefined) {}})

  });

  require("./controllers/pars")