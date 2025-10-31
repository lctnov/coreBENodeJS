import knex from 'knex';

class Database {
    constructor() {
        this.config = {
            cfsglobal: {
                //Thoilc-Dbs local SQL Server
                // user: "sa",
                // password: "Admin123",
                // server: "192.168.1.3",
                // database: "CFS",
                //Thoilc-Dbs local PostgreSQL
                user: "postgres",
                password: "Admin123",
                server: "localhost",
                port: "5432",
                database: "CFS_ITC",
                options: {
                    encrypt: false,
                },
            }
        };

        this.cfsglobal = knex({
            // client: "mssql",
            client: "pg",
            connection: {
                host: this.config.cfsglobal.server,
                user: this.config.cfsglobal.user,
                password: this.config.cfsglobal.password,
                database: this.config.cfsglobal.database,
            },
            pool: {
                min: 3,
                max: 40,
                idleTimeoutMillis: 10000,
                acquireTimeoutMillis: 30000,
            },
            log: {
                warn(message) { console.log(message); },
            },
        });
    }

    getCfsglobal() {
        return this.cfsglobal;
    }
}
const databaseInstance = new Database();
export default databaseInstance;
