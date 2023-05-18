const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    keepAlive: true,
    ssl: { rejectUnauthorized: false }
});

// Check if connected to database
// console.log(`Connected to:\nUser: ${process.env.PGUSER}\nDatabase: ${process.env.PGDATABASE}`);
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        return console.error(err)
    } else {
        return console.log(`Connected to ${process.env.PGUSER} at database ${process.env.PGDATABASE} at ${res.rows[0].now}`);
    }
})

module.exports = {
    pool: pool,
    query: async (query) => {
        console.log('Queried:\n', query);
        const res = await pool.query(query);
        console.log('Result:\n', res.rows);
        return res.rows
    },
    query: async (text, params) => {
        console.log('Queried:\n', text, params);
        const res = await pool.query(text, params);
        console.log('Result:\n', res.rows);
        return res.rows;
    }
}