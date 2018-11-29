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

//AGGIUNGERE A ASSIGNMENT CAMPO ASSEGNAZIONE USER TASK E ESAME(CHE ORA MANCA)

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

// ---------------- MAIN ----------------

app.get('/', async (req, res) => {
  var statusss = {status:200, text:""}
  statusss = getMain();
  console.log(statusss.status);
  res.send(statusss.text);
});

// ---------------- TASK PAGES ----------------

app.get('/tasks/', async (req, res, next) => {
  try{
    var t = await getTasks();
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/tasks/', async (req, res, next) => {
  try{
	   var t = await insTask(req.body.name,req.body.desc,req.body.risp);
	   if (t==200) res.redirect('/tasks/');
	   if (t==400) res.write('Wrong typo, task not created. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

app.get('/tasks/:id', async (req, res, next) => {
  try{
    var t = await getTask(req.params.id);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/tasks/:id', async (req, res, next) => {
  try{
    var t = await insertTaskById(req.params.id,req.body.ans)
    if (t==200) res.redirect('/tasks/');
    if (t==400) res.write('Wrong typo, not inserted. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

//------------------- FUNCTIONS -------------------

function getMain() {
  var t =""
  t+='<html><head></head><body>'
  t+='<b><h1>CARTA BIANCA SE2</h1></b><b>Welcome to our website</b><br><br>'+
                ' '+'<a href="/users/">List of Users</a>'+"<br>"+
                ' '+'<a href="/exams/">List of Exams</a>'+"<br>"+
                ' '+'<a href="/groups/">List of Groups</a>'+"<br>"+
                ' '+'<a href="/tasks/">List of Tasks</a>'+"<br>"+
                ' '+'<a href="/assignments/">List of Assignments</a>'+"<br>"
  t+='</body></html>'
  return {status:200,text:t};
}

//TASKS
async function getTasks(){
  var t = '<html><head></head><body><h1>Lista Tasks:</h1>';
  var g = await query('SELECT * FROM "task";');
  for (var i in g.rows){
    //t += '<h2>'+g.rows[i].name+'</h2>';
    t +=' '+'<a href="/tasks/'+g.rows[i].idtask+'"'+'>'+g.rows[i].name+'</a>'+'<br>';
  }
  if (logged) {
    t+='<br>';
    t+='<h3>Crea Task</h3>';
    t += '<form action="/tasks/" method="post"><input type ="text" name="name">Nome task<br /><input type ="text" name="desc">Descrizione task<br /><input type ="text" name="risp">Risposta<br /><button>Crea task!</button></form>';
  }
  return {status:200,text:t};
}

async function getTaskByIdTest(id) {
  var t = {status:200,text:""}
  try{
    var t = await getTask(id);
    return t;
  }catch(e){
    console.log('404');
    t.status = 404;
    t.text = "";
    return t;
  }
}

async function getTask(id){
  var g = await query('SELECT * FROM "task" WHERE idtask = \''+id+'\';');
  if(g.rows[0] != undefined) {
    var t = '<html><head></head><body><h1>Task: '+g.rows[0].name+'</h1>';
    t += '<h3>'+g.rows[0].description+'</h3>';

    if (logged){
      t += '<form action="/tasks/'+id+'" method="post">Rispondi:<input type ="number" name="ans"><button>Rispondi al task!</button></form>';
    }
    return {status:200,text:t};
  }
  return {status:404,text:""};
}

async function insTask(name,desc,risp) {
  try{
    await query('INSERT INTO "task" (name, description, answer) VALUES (\''+name+'\', \''+desc+'\', \''+risp+'\')');
    return 200;
  }catch(e){
    return 400;
  }
}

async function insertTaskById(id,ans) {
  try{
    var voto = 10;
    await query('INSERT INTO "taskAw" (iduser, idtask, answer, mark) VALUES (\''+logId+'\', \''+id+'\', \''+ans+'\', \''+voto+'\')');
    return 200;
  }catch(e){
    return 400;
  }
}

app.listen(process.env.PORT || 4000, () => console.log('App is online on port 4000'))
//app.listen(4000, () => console.log('App is online on port 4000'))
