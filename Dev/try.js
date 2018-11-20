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



// ========================================================== USERS FUNCTION BEGIN ==============================================================

async function userIn(){
  var plot = '<html><head></head><body>';
  plot += '<h1>Users</h1><br>';
  var user = await query('SELECT * FROM "user"');
  for(var i in user.rows){
    var u = user.rows[i];
    plot += u.iduser +' - ' + u.name + ' - ' + u.surname +'<br>';
  }
  plot += '<form action="/users/" method="post">ID: <input type="text" name="mat" /><br />NAME :<input type="text" name="name" /><br />SURNAME: <input type="text" name="surname" /><br />PASSWORD: <input type="text" name="password" /><br /><button>Submit</button></form>';
  return plot;
}

async function insUt(b){
  var mat = b.mat;
  var name = b.name;
  var surn = b.surname;
  var pass = b.password;
  await query ('INSERT INTO "user" VALUES ('+mat+', \''+name+'\', \''+surn+'\', \''+pass+'\');');
}

async function userOut(){
  console.log("im here");
  var plot = '<html><head></head><body>';
  plot += '<h1>Users</h1><br>';
  var user = await query('SELECT * FROM "user";');
  for(var i in user.rows){
    var u = user.rows[i];
    plot += u.iduser +'<br>';
  }

  return plot;
}

async function checkUt(id, idMine){
  var t = "";
  if(parseInt(id, 10) == parseInt(idMine, 10)){
    var ut = await query('SELECT * FROM "user" WHERE iduser = \''+id+'\';');
    t = '<HTML><head></head><body><h1>'+ut.rows[0].iduser+'</h1><h1>'+ut.rows[0].name+' '+ut. rows[0].surname+'</h1>';
    //console.log(ut.rows);
    var u = await query('SELECT name FROM "former" f, "group" g WHERE iduser=\''+id+'\' AND f.idgroup = g.idgroup;');
    //AGGIUNGERE ESAMI E CAVOLI VARI
    for (var i in u.rows){
        t += '<h1>'+u.rows[i].name+'</h1>';
    }
    t+= '<form action="/users/'+id+'" method="post"><button>Cancella account</button></form></body></html>';
  }else{
    var ut = await query('SELECT * FROM "user" WHERE iduser = \''+id+'\';');
    t = '<HTML><head></head><body><h1>'+ut.rows[0].iduser+'</h1><h1>'+ut.rows[0].name+' '+ut. rows[0].surname+'</h1>';
    //console.log(ut.rows);
    var u = await query('SELECT name FROM "former" f, "group" g WHERE iduser=\''+id+'\' AND f.idgroup = g.idgroup;');
    //AGGIUNGERE ESAMI E CAVOLI VARI
    for (var i in u.rows){
        t += '<h1>'+u.rows[i].name+'</h1>';
    }
    t+= '</body></html>';
  }
  return t;

}

async function getUser(id){
  var u = await query('SELECT * FROM "user" WHERE iduser = \''+id+'\'');
  var t = "";
  if (u.rows[0].iduser != undefined){
    t = '<HTML><head></head><body><h1>'+u.rows[0].iduser+'</h1></body></HTML>';
  }
  return t;

}

async function delUt(id){
  await query('DELETE FROM "user" WHERE iduser = \''+id+'\'');
}

// ========================================================== USERS FUNCTION END ================================================================

var logged = true;

app.get('/', (req, res) => {
    //main()
    //res.json(user.rows[0].iduser);
  res.write('<html><head></head><body>')
  res.write( '<b><h1>CARTA BIANCA SE2</h1></b>Welcome to our website<br>'+
                ' '+'<a href="/users/">List of Users</a>'+"<br>"+
                ' '+'<a href="/exams/">List of Exams</a>'+"<br>"+
                ' '+'<a href="/groups/">List of Groups</a>'+"<br>"+
                ' '+'<a href="/tasks/">List of Tasks</a>'+"<br>")
  res.end('</body></html>');
});

// ---------------- USER PAGES ----------------

app.get('/users', async(req, res, next) => {
  try{
    var t = (logged) ? await userIn() : await userOut();
    res.write(t);
    res.end('</body></html>');
  }catch (e){
    next(e);
  }
});

app.post('/users/', async (req, res, next) => {
  var a = req.body;
  try{
    await insUt(a);
    res.redirect('/users');
  }catch(e){
    next(e);
  }

});

app.get('/users/:id', async (req, res, next) => {
  try{
    var id = req.params.id;
    var t = (logged) ? await checkUt(id, 171935) : await getUser(id);
    if(t != ""){
      res.end(t);
    }else{
      res.sendStatus(404);
    }
  }catch (e){
    next(e);
  }
});

app.post('/users/:id', async (req, res, next) => {
  try{
    await delUt(req.params.id);
    res.redirect('/users');
  }catch (e){
    next(e);
  }
});









app.listen(4000, () => console.log('App is online on port 4000'))
