const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./util/db');

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API check
app.get('/api/user_input/all', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM user_input');
        return res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

app.get('/api/device_response/all', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM device_response');
        return res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

app.get('/api/cloud_response/all', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM cloud_response');
        return res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

app.get('/user/device_user/all', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM device_user');
        return res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

app.get('/user/all', async (req, res) => {
    try {
        const rows = await db.query('SELECT id, username FROM user_auth');
        return res.json(rows)
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

app.get('/user/data', async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.send('Missing id. Please add a query of the following format: /user/data?id=<id here>');
        }

        const query = `SELECT * FROM user_input AS ui
                        INNER JOIN device_user AS du ON ui.id = du.user_id
                        INNER JOIN device_response AS dr ON du.device_id = dr.device_id
                        INNER JOIN cloud_response AS cr ON dr.id = cr.device_response_id
                        WHERE ui.id = $1`;
        const rows = (await db.query(query, [id]));
        return res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

// actual APIs
app.post('/api/device_response', async (req, res) => {
    try {
        const { kwh, device_id } = req.body;
        // scripted muna device_id = 'A'
        // scripted muna user_id = 2
        const { user_id } = (await db.query('SELECT user_id FROM device_user WHERE device_id = $1', [device_id]))[0];
        const user_info = (await db.query('SELECT * FROM user_input WHERE id = $1', [user_id]))[0];
        
        const estimatedCost = kwh * user_info.cost_per_kwh;
        let led_status;
        let buzzer_status;
        
        if (estimatedCost < user_info.thresh_low) {
            led_status = 0;
            buzzer_status = 0;
        } else if (estimatedCost < user_info.thresh_up) {
            led_status = 1;
            buzzer_status = 1;
        } else {
            led_status = 2;
            buzzer_status = 2;
        }
        
        const deviceQuery = `INSERT INTO device_response (device_id, created_on, current_value)
                                VALUES ($1, NOW(), $2) RETURNING *`;
        const deviceResponse = (await db.query(deviceQuery, [device_id, kwh]))[0];
        const responseQuery = `INSERT INTO cloud_response 
                                (created_on, estimated_cost, led_status, buzzer_status, device_response_id)
                            VALUES (NOW(), $1, $2, $3, $4) RETURNING *`;
        const cloudResponse = (await db.query(responseQuery, [estimatedCost, led_status, buzzer_status, deviceResponse.id]))[0];

        return res.json({
            cost: cloudResponse.estimated_cost,
            led_status: cloudResponse.led_status,
            buzzer_status: cloudResponse.buzzer_status
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!')
    }
})

// User APIs
app.post('/user/new', async (req, res) => {
    try {
        const { 
            username, 
            password, 
            device_id,
            cost_per_kwh,
            thresh_low,
            thresh_up 
        } = req.body;

        if (!username) {
            return res.status(400).send('Missing username');
        } else if(!password) {
            return res.status(400).send('Missing password');
        } else if (!device_id) {
            return res.status(400).send('Missing device id (integer)');
        } else if (!cost_per_kwh) {
            return res.status(400).send('Invalid cost per kwh');
        } else if (!thresh_low) {
            return res.status(400).send('Invalid thresh low');
        } else if (!thresh_up) {
            return res.status(400).send('Invalid thresh up');
        } else if (thresh_low > thresh_up) {
            return res.status(400).send('Invalid threshold range');
        }

        const query1 = `INSERT INTO user_auth (username, passplain) VALUES ($1, $2) RETURNING *`;
        const user = (await db.query(query1, [username, password]))[0];

        const query2 = `INSERT INTO user_input (id, cost_per_kwh, thresh_low, thresh_up)
                        VALUES ($1, $2, $3, $4) RETURNING *`;
        const userInput = (await db.query(query2, [user.id, cost_per_kwh, thresh_low, thresh_up]))[0];

        const query3 = `INSERT INTO device_user (device_id, user_id) VALUES ($1, $2)`;
        await db.query(query3, [device_id, userInput.id]);

        return res.json({ id: user.id, username: user.username });

    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

app.post('/user/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username) {
            return res.status(400).send('Missing username');
        } else if (!password) {
            return res.status(400).send('Missing password');
        }

        const users = await db.query('SELECT * FROM user_auth WHERE username = $1', [username]);

        if (users.length == 0) {
            return res.status(400).send('Wrong username');
        } else if (users[0].passplain != password) {
            return res.status(400).send('Wrong password');
        }

        return res.json({ id: users[0].id, username: users[0].username });

    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

// Health test APIs
app.get('/api/up', (req, res) => {
    res.send('Backend is running!');
});

app.post('/api/ping', (req, res) => {
    if (req.body.msg === 'ping') {
        let newValue = 0;

        if (req.body.value || req.body.value === 0) {
            newValue = req.body.value + 1;
        }

        return res.json({
            ...req.body,
            msg: 'pong',
            value: newValue
        });
    } else {
        return res.status(400).json({
            msg: 'please include the parameter \'msg\' with value \'ping\''
        })
    }
})

app.get('/api/now', async (req, res) => {
    try {
        const rows = await db.query('SELECT NOW()');
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong!');
    }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))