// Import the necessary modules
const express = require('express');
const cors = require('cors');
const http = require('http');

// Load the environment variables
require('dotenv').config();

// Load the module for connecting with the database
const db = require('./util/db');

// Create an instance of an ExpressJS Application
const app = express();

// Use the app in creating a server
const server = http.createServer(app);

// Make sure that the app uses CORS so that it can
// accept requests from the frontend and device
app.use(cors())

// Load functions used in decoding the HTTP packets
// received. In particular, decode JSON and
// URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* =================================== */
/* These routes are used for debugging */
/* ============== START ============== */

app.get('/api/user_input/all', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM user_input');
        return res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

app.get('/api/user_input/:id', async (req, res) => {
    let { id } = req.params;
    if (!id) {
        return res.status(400).send('Missing user id');
    } else {
        id = parseInt(id);
    }
    try {
        const row = (await db.query('SELECT * FROM user_input WHERE id = $1', [id]))[0];
        return res.json(row);
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
/* =============== END =============== */

/* =================================== */
/* These routes are used in production */
/* ============== START ============== */

// Create a route for POST /api/user_input/<user_id>
// This route is used for configuring and updating
// the user's threshold and cost per kwh.
app.post('/api/user_input/:id', async (req, res) => {
    // Extract the user id from the parameters
    let { id } = req.params

    // Ensure that an id is provided
    if (!id) {
        // If there is none, inform the client
        return res.status(400).send('Missing user id');
    } else {
        // If there is, parse it into an integer since that
        // is the convention used in the server
        id = parseInt(id);
    }

    try {
        // Extract the updated configurations
        const { cost_per_kwh, thresh_low, thresh_up, } = req.body

        // Update the database with the new data
        const row = (await db.query(`UPDATE user_input 
                                    SET cost_per_kwh = $1, 
                                        thresh_low = $2, 
                                        thresh_up = $3 
                                    WHERE id = $4
                                    RETURNING *`, 
                        [cost_per_kwh, thresh_low, thresh_up, id]))[0]
        
        // To confirm that the database has indeed been updated, 
        // return the updated value returned by the database
        return res.json(row)
    } catch (err) {
        // Handle potential errors
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

// Create route for GET /user/data?id=<user_id>
// This route is used for obtaining the historical
// data, such as past device readings and server
// computations.
app.get('/user/data', async (req, res) => {
    try {
        // Extract the user id from the URL
        const { id } = req.query;

        if (!id) {
            // Ensure that the id is present. If not, inform the client regarding the proper format
            return res.send('Missing id. Please add a query of the following format: /user/data?id=<id here>');
        }

        // Obtain the relevant data from the database
        // Here, the tables are being joined together so that
        // data from both the device readings and server
        // computations can be combined easily.
        const query = `SELECT * FROM user_input AS ui
                        INNER JOIN device_user AS du ON ui.id = du.user_id
                        INNER JOIN device_response AS dr ON du.device_id = dr.device_id
                        INNER JOIN cloud_response AS cr ON dr.id = cr.device_response_id
                        WHERE ui.id = $1`;
        const rows = (await db.query(query, [id]));

        // Pre-process the data so that entries with missing
        // power will show 0, instead of NaN
        const processed = rows.map(row => ({ ...row, power: row.power || 0 }))

        // Return the historical data. It will be an array
        return res.json(processed);
    } catch (err) {
        // Handle potential errors
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

// Create route for POST /api/device_response
// This route is used by the device to send its
// readings. The data received will be used by the
// server to compute the estimated cost and it
// will be compared against the user's threshold
// to know what instruction the server should
// send to the device.
app.post('/api/device_response', async (req, res) => {
    try {
        // Extract the sent data
        const { kwh, power, device_id } = req.body;

        // Obtain the user's id and configurations
        const { user_id } = (await db.query('SELECT user_id FROM device_user WHERE device_id = $1', [device_id]))[0];
        const user_info = (await db.query('SELECT * FROM user_input WHERE id = $1', [user_id]))[0];
        
        // compute the estimated cost
        const estimatedCost = kwh * user_info.cost_per_kwh;
        let led_status;
        let buzzer_status;
        
        // determine how the device should light up
        // and buzz
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
        
        // For recording, store the device's readings and server's computations
        // into the database
        const deviceQuery = `INSERT INTO device_response (device_id, created_on, current_value, power)
                                VALUES ($1, NOW(), $2, $3) RETURNING *`;
        const deviceResponse = (await db.query(deviceQuery, [device_id, kwh, power]))[0];
        const responseQuery = `INSERT INTO cloud_response 
                                (created_on, estimated_cost, led_status, buzzer_status, device_response_id)
                            VALUES (NOW(), $1, $2, $3, $4) RETURNING *`;
        const cloudResponse = (await db.query(responseQuery, [estimatedCost, led_status, buzzer_status, deviceResponse.id]))[0];

        // For debugging purposes, print some information
        console.log(`device: ${kwh} ${device_id} ${new Date()}`)

        // Return the server's computation to the device
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

// Create route for POST /user/new
// This route is used for creating a new user.
app.post('/user/new', async (req, res) => {
    try {
        // Extract the sent data
        const { 
            username, 
            password, 
            device_id,
            cost_per_kwh,
            thresh_low,
            thresh_up 
        } = req.body;

        // Ensure that none of the fields are missing
        // and are valid
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


        // Insert the relevant information into the database
        const query1 = `INSERT INTO user_auth (username, passplain) VALUES ($1, $2) RETURNING *`;
        const user = (await db.query(query1, [username, password]))[0];

        const query2 = `INSERT INTO user_input (id, cost_per_kwh, thresh_low, thresh_up)
                        VALUES ($1, $2, $3, $4) RETURNING *`;
        const userInput = (await db.query(query2, [user.id, cost_per_kwh, thresh_low, thresh_up]))[0];

        const query3 = `INSERT INTO device_user (device_id, user_id) VALUES ($1, $2)`;
        await db.query(query3, [device_id, userInput.id]);

        // Return the user's id and username
        return res.json({ id: user.id, username: user.username });

    } catch (err) {
        // Handle potential errors
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})

// Create route for POST /user/login
// This route is used for logging in. It checks
// if the credentials uploaded matches the one in
// the database. Currently, security is low
// since the passwords are stored in plaintext
// so that the packets sent will be easier
// to analyze.
app.post('/user/login', async (req, res) => {
    try {
        // Extract the sent data
        const { username, password } = req.body;
        
        // Ensure that the fields are complete
        if (!username) {
            return res.status(400).send('Missing username');
        } else if (!password) {
            return res.status(400).send('Missing password');
        }

        // Get the user's credentials from the database
        const users = await db.query('SELECT * FROM user_auth WHERE username = $1', [username]);

        // Check if the credentials are correct
        if (users.length == 0) {
            return res.status(400).send('Wrong username');
        } else if (users[0].passplain != password) {
            return res.status(400).send('Wrong password');
        }

        // Return the user's id and username
        return res.json({ id: users[0].id, username: users[0].username });

    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
})
/* ============== END ================ */

/* =================================== */
/* These routes are used for debugging */
/* ============== START ============== */

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
/* ============== END ================ */

// Set the server's port number
const PORT = process.env.PORT || 8000
// Make the server listen to that port
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))