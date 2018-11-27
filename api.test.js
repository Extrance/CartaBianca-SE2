/*test('basic test', () => {
    expect(true).toBe(true);
});*/

const express = require('express');
const pg      = require('pg');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const pool = new pg.Pool({
    user: 'ehackszoekjlvm',
    host: 'ec2-79-125-124-30.eu-west-1.compute.amazonaws.com',
    database: 'd2o8v3sgciholh',
    password: '729588177481f511fac8c56e199a9436380e782f8f0355f8e5f2c92637c02ba7',
    port: '5432',
    ssl: 'true',
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed

});

async function query (q) {
  const client = await pool.connect()
  let res
  try {
    await client.query('BEGIN')
    try {
      res = await client.query(q)
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  } finally {
    client.release()
  }
  return res
}

var logged = true;
var logId = 185010;

//==================================== TEST CASES ====================================

//-------------------- USERS + MAIN --------------------

//------------------------ EXAMS ------------------------

//----------------------- GROUPS -----------------------

//------------------------ TASKS ------------------------

//==================================== FUNCTIONS ====================================

//-------------------- USERS + MAIN --------------------

//------------------------ EXAMS ------------------------

//----------------------- GROUPS -----------------------

//------------------------ TASKS ------------------------
