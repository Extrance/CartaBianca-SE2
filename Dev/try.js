const express = require('express');
const pg      = require('pg');
const app = express();
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

var diocane, user, former, group;

async function main () {
  try {
    user = await query('SELECT * FROM "user"')
    former = await query('SELECT * FROM "former"')
    group = await query('SELECT * FROM "group"')
    //console.log(JSON.stringify(rows))
  } catch (err) {
    console.log('Database ' + err)
  }
}
main()


var tryi = [];
pool.query('SELECT u.iduser AS utente, g.idgroup AS gruppo, grado FROM "user" u, "group" g, "former" f WHERE u.iduser = f.iduser OR f.idgroup = g.idgroup;', (err, res) => {
    tryi = res.rows;
});

app.get('/', (req, res) => {
    //main()
    res.json(user.rows[0].iduser);
});

app.listen(4000, () => console.log('Example app listening on port 4000'))
