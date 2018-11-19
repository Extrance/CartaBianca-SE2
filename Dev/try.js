const express = require('express');
const pg      = require('pg');
const app = express();
const pool = new pg.Pool({
    user: 'ehackszoekjlvm',
    host: 'ec2-79-125-124-30.eu-west-1.compute.amazonaws.com',
    database: 'd2o8v3sgciholh',
    password: '729588177481f511fac8c56e199a9436380e782f8f0355f8e5f2c92637c02ba7',
    port: '5432',
    ssl: 'true'
});

function exeQ(stringa){
    pool.query(stringa)
        .then(res => console.log(res.rows))
        .catch(e => console.error(e.stack))
}

var diocane = [];
diocane = exeQ('SELECT * FROM "user";');
console.log("Res: "+diocane);

var user = [];
pool.query('SELECT * FROM  "user";', (err, res) => {
    user = res.rows;
    //pool.end();
});

var former = [];
pool.query('SELECT * FROM  "former";', (err, res) => {
    former = res.rows;
    //pool.end();
});

var group = [];
pool.query('SELECT * FROM  "group";', (err, res) => {
    group = res.rows;
    //pool.end();
});

var tryi = [];
pool.query('SELECT u.iduser AS utente, g.idgroup AS gruppo, grado FROM "user" u, "group" g, "former" f WHERE u.iduser = f.iduser OR f.idgroup = g.idgroup;', (err, res) => {
    tryi = res.rows;
});

app.get('/', (req, res) => {
    res.send(diocane);
});

app.listen(4000, () => console.log('Example app listening on port 4000'))
