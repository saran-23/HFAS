const express = require('express');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
// const jwt_decode = require('jwt-decode');

const app = express();

// Connect to the PostgreSQL database
const client = new Client({
  // user: '',
  // host: '',
  // database: '',
  // password: '',
  // port: ,
  user: 'aiml_grain',
  host: '192.168.5.3',
  database: 'grains',
  password: 'Tnega1234',
  port: 5432,
});
client.connect();

// Async function to retrieve data by ufc
async function getDataByufc(ufc) {
  const res = await client.query('SELECT * FROM pds_data.src_pds_data_nov2022 WHERE ufc = $1;', [ufc]);
  return res.rows;
}

// Route that retrieves data by ufc
app.get('/data/:ufc', async (req, res) => {
  try {
    // Get the ufc from the URL parameters
    const ufc = req.params.ufc;

    // Get the data by ufc
    const item = await getDataByufc(ufc);

    // If no item was found, return a 404 status code
    if (!item) {
      return res.status(404).send('Item not found');
    }

    // Otherwise, create a JWT token with the data
    const token = jwt.sign({ data: item }, 'secret');
    
    // Return the token to the client
    res.send({ token });
  } catch (error) {
    // If an error occurred, return a 500 status code
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.listen(3000, () => console.log('Listening on port 3000'));
