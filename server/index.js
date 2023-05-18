const express = require('express');
require('dotenv').config();

const db = require('./util/db');

const app = express();

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

// actual APIs
app.post('/api/device_response', async (req, res) => {
    try {
        const { kwh, device_id } = req.body;
        // scripted muna device_id = 1
        // scripted muna user_id = 1
        const { user_id } = (await db.query('SELECT user_id FROM device_user WHERE device_id = $1', [device_id]))[0];
        const user_info = (await db.query('SELECT * FROM user_input WHERE id = $1', [user_id]))[0];
        const deviceQuery = `INSERT INTO device_response (device_id, created_on, current_value, user_id)
                                VALUES ($1, NOW(), $2, 1) RETURNING *`;

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
        
        const device = (await db.query(deviceQuery, [device_id, kwh]))[0];
        const responseQuery = `INSERT INTO cloud_response 
                                (device_id, created_on, estimated_cost, led_status, buzzer_status, device_response_id)
                            VALUES ($1, NOW(), $2, $3, $4, $5) RETURNING *`;
        const cloudResponse = (await db.query(responseQuery, [device_id, estimatedCost, led_status, buzzer_status, device.id]))[0];

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