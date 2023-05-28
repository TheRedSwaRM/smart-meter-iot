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
        if (res.rows.length) {
            console.log('Result:\n', res.rows[res.rows.length-1]);
        } else {
            console.log('No results\n')
        }
        return res.rows
    },
    query: async (text, params) => {
        console.log('Queried:\n', text, params);
        const res = await pool.query(text, params);
        if (res.rows.length) {
            console.log('Result:\n', res.rows[res.rows.length-1]);
        } else {
            console.log('No results\n')
        }
        return res.rows;
    }
}