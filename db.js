const { Pool, Client } = require('pg')
require("dotenv").config()
const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port:5432
})


module.exports = {db}