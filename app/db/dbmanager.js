class dbmanager {
    constructor() {
        this.fs = require('fs');
    }

    getEnvironment() {
        return process.env.NODE_ENV || 'DEV';
    }

    getDBConfig() {
        return JSON.parse(this.fs.readFileSync(__dirname + '/../../config/db_credentials.json', 'utf8'));
    }

    async execute(datasource, sql, parameters) {
        const dbconfig = this.getDBConfig()[this.getEnvironment()][datasource];
        if (!dbconfig) throw (`Datasource '${datasource}' was not found on ${this.getEnvironment()} environment.`);

        let result, Adapter;
        switch (dbconfig.TYPE) {
            case "ORACLE":
                Adapter = require('./db/oracle');
                const oracleConn = new Adapter(dbconfig);
                result = await oracleConn.execute(sql, parameters);
                oracleConn.closeAll();
                return result;
            case "MYSQL":
                Adapter = require('./mysql');
                const mysqlConn = new Adapter(dbconfig);
                result = await mysqlConn.execute(sql, parameters);
                mysqlConn.close();
                return result;
            default:
                throw ('Unhandled database type: ' + dbconfig.TYPE);
        }
    }
}

module.exports = dbmanager;