const 	pg      	= require('pg');
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

exports.query  = async(q) => {
  return await query2(q);
}

async function query2 (q) {
  const client = await pool.connect()
  let res
  try {
    await client.query2('BEGIN')
    try {
      res = await client.query2(q)
      await client.query2('COMMIT')
    } catch (err) {
      await client.query2('ROLLBACK')
      throw err
    }
  } finally {
    client.release()
  }
  return res
}
