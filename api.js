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
    var u = await query('SELECT f.idgroup, name FROM "former" f, "group" g WHERE iduser=\''+id+'\' AND f.idgroup = g.idgroup;');
    var tx = "";
    for (var i in u.rows){
      var x = await query('SELECT e.name FROM "exam" e, "assignment" a WHERE a.idgroup =\''+u.rows[i].idgroup+'\' AND e.idexam = a.idexam;')
      for(var j in x.rows)
        tx += '<h3>'+x.rows[j].name+'</h3>';
      t += '<h1>'+u.rows[i].name+'</h1>';
    }
    t += tx;


    t+= '<form action="/users/'+id+'" method="post"><button>Cancella account</button></form></body></html>';
  }else{
    var ut = await query('SELECT * FROM "user" WHERE iduser = \''+id+'\';');
    t = '<HTML><head></head><body><h1>'+ut.rows[0].iduser+'</h1><h1>'+ut.rows[0].name+' '+ut. rows[0].surname+'</h1>';
    //console.log(ut.rows);
    var u = await query('SELECT name FROM "former" f, "group" g WHERE iduser=\''+id+'\' AND f.idgroup = g.idgroup;');
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
  await query('DELETE FROM "former" WHERE iduser = \''+id+'\'');
  await query('DELETE FROM "user" WHERE iduser = \''+id+'\'');
}

// ========================================================== USERS FUNCTION END ================================================================
// =========================================================== FUNCT EXAM BEGIN =================================================================

async function getExam(id){
  var u = await query('SELECT * FROM "exam" WHERE idexam = \''+id+'\';');
  var t = '<html><head></head><body><h1>'+ u.rows[0].name+'</h1>';
  var k = await query('SELECT idtask FROM "examFormer" WHERE idexam = \''+id+'\';');
  for (var i in k.rows){
    var s = await query('SELECT * FROM task WHERE idtask=\''+k.rows[i].idtask+'\'');
    t+= '<h2>'+s.rows[0].name+': '+s.rows[0].description+'</h2>';
  }
  if (logged){
    if (parseInt(logId, 10) == parseInt(u.rows[0].idcreatore, 10)){
      t+= '<form action="/exams/'+id+'" method="post">Nome task: <select name="nome">';
      var a = await query('SELECT * FROM "task";');
      for(var j in a.rows){
        t += '<option value ="'+a.rows[j].idtask+'">'+a.rows[j].name+'</option>';
      }
      t += '</select><button>Aggiungi task</button></form>';
    }
  }
  return t;
}

async function getExams(){
  var u = await query('SELECT * FROM "exam"');
  var t = '<html><head></head><body>';
  var x = '';
  if(logged){
    for (var i in u.rows){
      if (parseInt(logId, 10) == parseInt(u.rows[i].idcreatore, 10)) x+= '<option value="'+u.rows[i].idexam+'">'+u.rows[i].name+'</option>';
      t+= '<h1>'+u.rows[i].name+'</h1>';
    }
    t+= '<form action="/exams/" method="post">Nome esame: <input type="text" name="nome"><br /><button>Crea esame</button></form>';
    t+= '<form action="/exams/delete" method="post">Nome esame:  <select name="exs">';
    t+= x;
    t+='</select> <button>Elimina esame</button></form>';
  }else{
    for (var i in u.rows){
      t += '<h1>'+u.rows[i].name+'</h1>';
    }
  }
  return t;
}

async function createEx(n){
  console.log('INSERT INTO "exam" (name, idcreatore) VALUES (\''+ n +' \', \''+logId+'\')');
  await query('INSERT INTO "exam" (name, idcreatore) VALUES (\''+ n +'\', \''+logId+'\');');
}

// ============================================================ FUNCT EXAM END ==================================================================
// ========================================================== FUNCT GROUP BEGIN =================================================================

async function getGroups(){
  var t = '<html><head></head><body><h1>Group</h1>';
  var g = await query('SELECT * FROM "group";');
  for (var i in g.rows){
    t += '<h3>('+g.rows[i].idgroup+') - '+g.rows[i].name+'</h3>';
  }
  if (logged){
    t += '<form action="/groups/" method="post">Nome gruppo:<input type ="text" name="name"><br /><button>Crea gruppo!</button></form>';
  }
  return t;
}

async function getGroup(id){
  var g = await query('SELECT g.name as name, u.name as nome, u.surname as surn, u.iduser as iduser  FROM "group" g, "former" f, "user" u WHERE g.idgroup = \''+id+'\' AND g.idgroup = f.idgroup AND f.iduser = u.iduser;');
  var t = '<html><head></head><body><h1>Group: '+g.rows[0].name+'</h1>';
  for (var j in g.rows){
    t+= '<h3>'+g.rows[j].iduser+' '+g.rows[j].surn+' '+g.rows[j].nome +'</h3>';
  }
  if (logged){
    var x = await query ('SELECT * FROM "former" WHERE idgroup = \''+id+'\' AND iduser = \''+logId+'\'');
    if(parseInt(x.rows[0].grado, 10) == 2)
      var u = await query('SELECT iduser, name, surname FROM "user" WHERE iduser <>'+logId);
      var s = '';
      for(var i in u.rows){
        s += '<option value="'+u.rows[i].iduser+'">'+u.rows[i].name +' '+u.rows[i].surname+'</option>';
      }
      t += '<form action="/groups/'+id+'" method="post">Aggiungi:<select name="membro">'+s+'</select><button>Aggiungi al gruppo!</button></form>';
      t += '<form action=/groups/del/'+id+' method="post"><button>Cancella gruppo</button></form>';
  }
  return t;
}

// =========================================================== FUNCT GROUP END ==================================================================
// ========================================================== FUNCT TASK BEGIN ==================================================================

async function getTasks(){
  var t = '<html><head></head><body><h1>Tasks:</h1>';
  var g = await query('SELECT * FROM "task";');
  for (var i in g.rows){
    t += '<h3>'+g.rows[i].name+'</h3>';
  }
  if (logged){
    t += '<form action="/tasks/" method="post">Nome task:<input type ="text" name="name"><br />Descrizione task:<input type ="text" name="desc"><br />Risposta:<input type ="text" name="risp"><br /><button>Crea task!</button></form>';
  }
  return t;
}

async function getTask(id){
  var g = await query('SELECT * FROM "task" WHERE idtask = \''+id+'\';');
  var t = '<html><head></head><body><h1>Task: '+g.rows[0].name+'</h1>';
  t += '<h3>'+g.rows[0].description+'</h3>';

  if (logged){
    t += '<form action="/tasks/'+id+'" method="post">Rispondi:<input type ="number" name="ans"><button>Rispondi al task!</button></form>';
  }
  return t;
}

// =========================================================== FUNCT TASK END ===================================================================

var logged = true;
var logId = 171935;

app.get('/', (req, res) => {
    //main()
    //res.json(user.rows[0].iduser);
  res.write('<html><head></head><body>')
  res.write( '<b><h1>CARTA BIANCA SE2</h1></b>Welcome to our website<br>'+
                ' '+'<a href="/users/">List of Users</a>'+"<br>"+
                ' '+'<a href="/exams/">List of Exams</a>'+"<br>"+
                ' '+'<a href="/groups/">List of Groups</a>'+"<br>"+
                ' '+'<a href="/tasks/">List of Tasks</a>'+"<br>"+
                ' '+'<a href="/assignments/">List of Assignments</a>'+"<br>")
  res.end('</body></html>');
});

// ---------------- USER PAGES ----------------

app.get('/users/', async(req, res, next) => {
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
    var t = (logged) ? await checkUt(id, logId) : await getUser(id);
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


// ---------------- EXAM PAGES ----------------

app.get('/exams/', async (req, res, next) => {
  try{
    var t = await getExams();
    res.write(t);
    res.end('</body></html>')
  }catch (e){
    next(e);
  }
});

app.post('/exams/', async (req, res, next) => {
  try{
    var n = req.body.nome;
    await createEx(n);
    res.redirect('/exams/');
  }catch(e){
    next(e);
  }
});

app.post('/exams/delete', async (req, res, next) => {
  try{
    var n = req.body.exs;
    await query('DELETE FROM "examFormer" WHERE idexam =\''+n+'\';');
    await query('DELETE FROM "exam" WHERE idexam =\''+n+'\';');
    res.redirect('/exams/');
  }catch(e){
    next(e);
  }
});

app.get('/exams/:id', async (req, res, next) => {
  try{
    var t = await getExam(req.params.id);
    res.write(t);
    res.end('</body></html>')
  }catch(e){
    next(e);
  }
});

app.post('/exams/:id', async (req, res, next) => {
  try{
    var id = req.params.id;
    var task = req.body.nome;
    await query('INSERT INTO "examFormer" (idexam, idtask) VALUES (\''+id+'\', \''+task+'\');');
    res.redirect('/exams/'+id);
  }catch(e){
    next(e);
  }
});


// ---------------- GROUP PAGES ----------------

app.get('/groups/', async (req, res, next) => {
  try{
    var t = await getGroups();
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/groups/', async (req, res, next) => {
  try{
    await query('INSERT INTO "group" (name) VALUES (\''+req.body.name+'\')');
    var t = await query('SELECT * FROM "group" ORDER BY idgroup DESC LIMIT 1;');
    await query('INSERT INTO "former" (idgroup, iduser, grado) VALUES (\''+t.rows[0].idgroup+'\', \''+logId+'\', \''+2+'\');');
    res.redirect('/groups/');
  }catch(e){
    next(e);
  }
});

app.get('/groups/:id', async (req, res, next) => {
  try{
    var t = await getGroup(req.params.id);
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/groups/:id', async (req, res, next) => {
  try{
    await query('INSERT INTO "former" (idgroup, iduser, grado) VALUES (\''+req.params.id+'\', \''+req.body.membro+'\', \'1\');');
    res.redirect('/groups/'+req.params.id);
  }catch(e){
    next(e);
  }
});

app.post('/groups/del/:id', async (req, res, next) => {
  try{
    await query('DELETE FROM "former" WHERE idgroup = \''+req.params.id+'\'');
    await query('DELETE FROM "group" WHERE idgroup = \''+req.params.id+'\'');
    res.redirect('/groups/');
  }catch(e){
    next(e);
  }
});

// ---------------- TASK PAGES ----------------

app.get('/tasks/', async (req, res, next) => {
  try{
    var t = await getTasks();
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/tasks/', async (req, res, next) => {
  try{
    await query('INSERT INTO "task" (name, description, answer) VALUES (\''+req.body.name+'\', \''+req.body.desc+'\', \''+req.body.risp+'\')');
    res.redirect('/tasks/')
  }catch(e){
    next(e);
  }
});

app.get('/tasks/:id', async (req, res, next) => {
  try{
    var t = await getTask(req.params.id);
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/tasks/:id', async (req, res, next) => {
  try{
    //var voto = calcolaVoto(req.params.id, req.body.ans);
    var voto = 10;
    await query('INSERT INTO "taskAw" (iduser, idtask, answer, mark) VALUES (\''+logId+'\', \''+req.params.id+'\', \''+req.body.ans+'\', \''+voto+'\')');
    res.redirect('/tasks/')
  }catch(e){
    next(e);
  }
});

// ---------------- ASSIGNMENT PAGES ----------------

app.get('/assignments/', async (req, res, next) => {
  try{
    res.json((await query('SELECT * FROM "assignment";')).rows);
  }catch(e){
    next(e);
  }
});

app.listen(process.env.PORT || 4000, () => console.log('App is online on port 4000'))
