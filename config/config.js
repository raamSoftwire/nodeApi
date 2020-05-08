module.exports = {
    development: {
        username: 'node_api_db',
        password: 'node_api_db',
        database: 'node_api_db',
        host: '127.0.0.1',
        dialect: 'postgres'
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:'
    },
    production: {
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DB_NAME,
        host: process.env.RDS_HOSTNAME,
        dialect: 'postgres'
    }
}
