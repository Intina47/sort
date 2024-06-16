const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
app.use(cors());

// serve our index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/data', (req, res) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'worker_visa.csv'))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const query = req.query.query || '';

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const filteredResults = results.filter((result) => {
                return result['Town/City'].toLowerCase().includes(query.toLowerCase());
            });

            const paginatedResults = filteredResults.slice(startIndex, endIndex);

            res.json({
                data: paginatedResults,
                page: page,
                total: filteredResults.length
            });
        });
});


app.get('/cities', async (_, res) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'worker_visa.csv'))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const cities = results.map((result) => result['Town/City']).filter((city, index, self) => self.indexOf(city) === index);
            res.json(cities);
        });
}
);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});