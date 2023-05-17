const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))