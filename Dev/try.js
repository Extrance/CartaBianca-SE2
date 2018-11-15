const express   = require('express');
const app       = express();

const { Pool, Client } = require('pg')
const connectionString = 'postgres://ehackszoekjlvm:729588177481f511fac8c56e199a9436380e782f8f0355f8e5f2c92637c02ba7@ec2-79-125-124-30.eu-west-1.compute.amazonaws.com:5432/d2o8v3sgciholh?ssl=true'

const pool = new Pool({
  connectionString: connectionString,
})

/*const client = new Client({
  connectionString: connectionString,
})
client.connect()*/

app.get('/', (req, res, next) => {
   pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('SELECT * FROM users', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
       })
   })
});

app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});