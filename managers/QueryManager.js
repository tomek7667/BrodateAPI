
let QueryManager = {
    con: null,
    setCon: function (con) {
        this.con = con;
    },
    getUsers: function () {
        return new Promise((resolve, reject) => {
            this.con.query("SELECT * FROM players", [], (err, result) => {
                if (err) {
                    reject();
                }
                resolve(result);
            })
        })
    },
    addUser: function (username, reporter, reason, score) {
        return new Promise((resolve, reject) => {
            this.con.query("INSERT INTO players (username, reporter, reason, score) VALUES (?, ?, ?, ?)", [username, reporter, reason, score], (err, result) => {
                if (err) {
                    reject()
                }
                resolve();
            });
        })
    },
    getUserData: function (username) {
        return new Promise((resolve, reject) => {
            this.con.query("SELECT * FROM players WHERE username = ?", [username], (err, result) => {
                console.log(result)
            })
        })
    }
}

exports.QueryManager = QueryManager;