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



// ========================================================== USERS FUNCTION BEGIN ==============================================================

//========================DONE========================
async function userIn(){
  var plot = '<html><head></head><body>';
  plot += '<h1>Lista Utenti</h1><br>';
  var user = await query('SELECT * FROM "user"');
  for(var i in user.rows){
    var u = user.rows[i];
    plot +=' '+'<a href="/users/'+u.iduser+'"'+'>'+u.iduser+'</a>'+' - ' + u.name + ' ' + u.surname +'<br>';
  }
  plot +='<br>'
  plot+='<h3>Aggiungi utente</h3>';
  plot += '<form action="/users/" method="post"><input type="text" name="mat" />MATRICOLA<br /><input type="text" name="name" />NOME<br /><input type="text" name="surname" />COGNOME<br /><input type="password" name="password" />PASSWORD<br /><button>Submit</button></form>';
  return plot;
}

//========================DONE========================
async function insUt(b){
  var mat = b.mat;  //need to make matricola automatic by the system
  var name = b.name;
  var surn = b.surname;
  var pass = b.password;
  await query ('INSERT INTO "user" VALUES ('+mat+', \''+name+'\', \''+surn+'\', \''+pass+'\');');
}

//========================DONE========================
async function userOut(){
  console.log("im here");
  var plot = '<html><head></head><body>';
  plot += '<h1>Users</h1><br>';
  var user = await query('SELECT * FROM "user";');
  for(var i in user.rows){
    var u = user.rows[i];
    plot += u.iduser +'<br>';
  }
  plot+="<br><br><i>Per un'esperienza migliore, iscriviti o fai login</i>"
  return plot;
}

//========================DONE========================
async function checkUt(id, idMine){
  var t = "";
  if(parseInt(id, 10) == parseInt(idMine, 10)) {
    var ut = await query('SELECT * FROM "user" WHERE iduser = \''+id+'\';');
    t = '<HTML><head></head><body><h1>'+ut.rows[0].iduser+' - '+ut.rows[0].name+' '+ut. rows[0].surname+'</h1>';
    //console.log(ut.rows);
    var u = await query('SELECT f.idgroup, name FROM "former" f, "group" g WHERE iduser=\''+id+'\' AND f.idgroup = g.idgroup;');
    var tx = "";
    for (var i in u.rows) {
      var tx = "";
      var x = await query('SELECT e.name FROM "exam" e, "assignment" a WHERE a.idgroup =\''+u.rows[i].idgroup+'\' AND e.idexam = a.idexam;')
      for(var j in x.rows) {
        tx += ' - '+x.rows[j].name+'<br>';
      }
      t += '<b>'+u.rows[i].name+'</b><br>';
      t += tx;
    }
    //t += tx;
    t+= '<form action="/users/'+id+'" method="post"><button>Cancella account</button></form></body></html>';
  }
  else {
    var ut = await query('SELECT * FROM "user" WHERE iduser = \''+id+'\';');
    t = '<HTML><head></head><body><h1>'+ut.rows[0].iduser+' - '+ut.rows[0].name+' '+ut. rows[0].surname+'</h1>';
    //console.log(ut.rows);
    var u = await query('SELECT name FROM "former" f, "group" g WHERE iduser=\''+id+'\' AND f.idgroup = g.idgroup;');
    for (var i in u.rows){
        t += '<b>Group:</b> '+u.rows[i].name+'<br>';
    }
    t+= '</body></html>';
  }
  return t;
}

//========================DONE========================
async function getUser(id){
  var u = await query('SELECT * FROM "user" WHERE iduser = \''+id+'\'');
  var t = "";
  if (u.rows[0].iduser != undefined){
    t = '<HTML><head></head><body><h1>'+u.rows[0].iduser+'</h1>';
    t+="<br><br><i>Per vedere i dati di un utente, iscriviti o fai login</i>"
    t+='</body></HTML>';
  }
  return t;
}

//========================DONE========================
async function delUt(id){
  await query('DELETE FROM "former" WHERE iduser = \''+id+'\'');
  await query('DELETE FROM "user" WHERE iduser = \''+id+'\'');
}

// ========================================================== USERS FUNCTION END ================================================================
// =========================================================== FUNCT EXAM BEGIN =================================================================

async function getExam(id) {
  var u = await query('SELECT * FROM "exam" WHERE idexam = \''+id+'\';');
  var t = '<html><head></head><body><h1>'+ u.rows[0].name+'</h1>';
  if (logged) {
    var k = await query('SELECT idtask FROM "examFormer" WHERE idexam = \''+id+'\';');
    for (var i in k.rows) {
      var s = await query('SELECT * FROM task WHERE idtask=\''+k.rows[i].idtask+'\'');
      t+= '<b>'+s.rows[0].name+': '+'</b><br>'+' - '+s.rows[0].description+'<br>';
    }
    if (parseInt(logId, 10) == parseInt(u.rows[0].idcreatore, 10)){
      t+='<br><br>'
      t+= '<form action="/exams/'+id+'" method="post">Nome task: <select name="nome">';
      var a = await query('SELECT * FROM "task";');
      for(var j in a.rows){
        t += '<option value ="'+a.rows[j].idtask+'">'+a.rows[j].name+'</option>';
      }
      t += '</select><button>Aggiungi task</button></form>';
    }
  }
  else {
    t+="<br><br><i>Per visualizzare dettagli dell'esame, iscriviti o fai login</i>"
  }
  return t;
}

async function getExams() {
  var u = await query('SELECT * FROM "exam"');
  var t = '<html><head></head><body>';
  var x = '';
  t+='<h1>Lista Esami</h1>';
  if(logged){
    for (var i in u.rows) {
      if (parseInt(logId, 10) == parseInt(u.rows[i].idcreatore, 10)) {
        x+= '<option value="'+u.rows[i].idexam+'">'+u.rows[i].name+'</option>';
      }
      t +=' '+'<a href="/exams/'+u.rows[i].idexam+'"'+'>'+u.rows[i].name+'</a>'+'<br>';
    }
    t+='<br>';
    t+='<h3>Crea Esame</h3>';
    t+= '<form action="/exams/" method="post">Nome esame: <input type="text" name="nome">'+' '+'<button>Crea esame</button></form>';
    t+='<br>';
    t+='<h3>Elimina Esame</h3>';
    t+= '<form action="/exams/delete" method="post">Nome esame:  <select name="exs">';
    t+= x;
    t+='</select>'+' '+'<button>Elimina esame</button></form>';
  }
  else {
    for (var i in u.rows){
      t += u.rows[i].name+'<br>';
      //t +=' '+'<a href="/exams/'+u.rows[i].idexam+'"'+'>'+u.rows[i].name+'</a>'+'<br>';
    }
    t+="<br><br><i>Per un'esperienza migliore, iscriviti o fai login</i>"
  }
  return t;
}

async function createEx(n) {
  console.log('INSERT INTO "exam" (name, idcreatore) VALUES (\''+ n +' \', \''+logId+'\')');
  await query('INSERT INTO "exam" (name, idcreatore) VALUES (\''+ n +'\', \''+logId+'\');');
}

// ============================================================ FUNCT EXAM END ==================================================================
// ========================================================== FUNCT GROUP BEGIN =================================================================

async function getGroups(){
  var t = '<html><head></head><body><h1>List of Groups</h1>';
  var g = await query('SELECT * FROM "group";');
  if(logged) {
    for (var i in g.rows){
      //t += '<b>('+g.rows[i].idgroup+')</b> - '+g.rows[i].name+'<br>';
      t +='<b>('+g.rows[i].idgroup+')</b> - '+'<a href="/groups/'+g.rows[i].idgroup+'"'+'>'+g.rows[i].name+'</a><br>';
    }
    t+='<br><br>'
    t += '<form action="/groups/" method="post">Nome gruppo:<input type ="text" name="name"><br /><button>Crea gruppo!</button></form>';
  }
  else {
    for (var i in g.rows){
      t += '<b>('+g.rows[i].idgroup+')</b> - '+g.rows[i].name+'<br>';
    }
    t+="<br><br><i>Per un'esperienza migliore, iscriviti o fai login</i>"
  }
  return t;
}

async function getGroup(id) {
  var g = await query('SELECT g.name as name, u.name as nome, u.surname as surn, u.iduser as iduser  FROM "group" g, "former" f, "user" u WHERE g.idgroup = \''+id+'\' AND g.idgroup = f.idgroup AND f.iduser = u.iduser;');
  var t = '<html><head></head><body><h1>Group: '+g.rows[0].name+'</h1>';
  for (var j in g.rows){
    t+='<b>'+g.rows[j].iduser+'</b> - '+g.rows[j].surn+' '+g.rows[j].nome +'<br>';
  }
  if (logged) {
    var x = await query ('SELECT * FROM "former" WHERE idgroup = \''+id+'\' AND iduser = \''+logId+'\'');
    if(parseInt(x.rows[0].grado, 10) == 2) {
      var u = await query('SELECT iduser, name, surname FROM "user" WHERE iduser <>'+logId);
      var s = '';
      for(var i in u.rows){
        s += '<option value="'+u.rows[i].iduser+'">'+u.rows[i].name +' '+u.rows[i].surname+'</option>';
      }
      t += '<br>'
      t += '<form action="/groups/'+id+'" method="post">Aggiungi:<select name="membro">'+s+'</select><button>Aggiungi al gruppo!</button></form>';
      t += '<form action=/groups/del/'+id+' method="post"><button>Cancella gruppo</button></form>';
    }
  }
  return t;
}

// =========================================================== FUNCT GROUP END ==================================================================
// ========================================================== FUNCT TASK BEGIN ==================================================================

//========================DONE========================
async function getTasks(){
  var t = '<html><head></head><body><h1>Lista Tasks:</h1>';
  var g = await query('SELECT * FROM "task";');
  for (var i in g.rows){
    //t += '<h2>'+g.rows[i].name+'</h2>';
    t +=' '+'<a href="/tasks/'+g.rows[i].idtask+'"'+'>'+g.rows[i].name+'</a>'+'<br>';
  }
  if (logged){
    t+='<br>';
    t+='<h3>Crea Task</h3>';
    t += '<form action="/tasks/" method="post"><input type ="text" name="name">Nome task<br /><input type ="text" name="desc">Descrizione task<br /><input type ="text" name="risp">Risposta<br /><button>Crea task!</button></form>';
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

/*async function getAssignment(id) {

}*/

// =========================================================== FUNCT TASK END ===================================================================

var logged = true;
var logId = 185010;

//========================DONE========================
app.get('/', (req, res) => {
    //main()
    //res.json(user.rows[0].iduser);
  res.write('<html><head></head><body>')
  res.write( '<b><h1>CARTA BIANCA SE2</h1></b><b>Welcome to our website</b><br><br>'+
                ' '+'<a href="/users/">List of Users</a>'+"<br>"+
                ' '+'<a href="/exams/">List of Exams</a>'+"<br>"+
                ' '+'<a href="/groups/">List of Groups</a>'+"<br>"+
                ' '+'<a href="/tasks/">List of Tasks</a>'+"<br>"+
                ' '+'<a href="/assignments/">List of Assignments</a>'+"<br>")
  if(!logged) {
    res.write("<br><br><i>Per un'esperienza migliore, iscriviti o fai login</i>")
  }
  res.end('</body></html>');
});

// ---------------- USER PAGES ----------------

//========================DONE========================
app.get('/users/', async(req, res, next) => {
  try{
    var t = (logged) ? await userIn() : await userOut();
    res.write(t);
    res.end('</body></html>');
  }catch (e){
    next(e);
  }
});

//========================DONE========================
app.post('/users/', async (req, res, next) => {
  var a = req.body;
  try{
    await insUt(a);
    res.redirect('/users');
  }catch(e){
    next(e);
  }

});

//========================DONE========================
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

//========================DONE========================
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
  }catch(e){
    next(e);
  }
});




// ---------------- GROUP PAGES ----------------

//========================DONE========================
app.get('/groups/', async (req, res, next) => {
  try{

    var t = await getGroups();
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//========================DONE========================
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

//========================DONE========================
app.get('/groups/:id', async (req, res, next) => {
  try{
    var t = await getGroup(req.params.id);
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//========================DONE========================
app.post('/groups/:id', async (req, res, next) => {
  try{
    await query('INSERT INTO "former" (idgroup, iduser, grado) VALUES (\''+req.params.id+'\', \''+req.body.membro+'\', \'1\');');
    res.redirect('/groups/'+req.params.id);
  }catch(e){
    next(e);
  }
});

//========================DONE========================
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

//========================DONE========================
app.get('/tasks/', async (req, res, next) => {
  try{
    var t = await getTasks();
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//========================DONE========================
app.post('/tasks/', async (req, res, next) => {
  try{
    await query('INSERT INTO "task" (name, description, answer) VALUES (\''+req.body.name+'\', \''+req.body.desc+'\', \''+req.body.risp+'\')');
    res.redirect('/tasks/')
  }catch(e){
    next(e);
  }
});

//========================DONE========================
app.get('/tasks/:id', async (req, res, next) => {
  try{
    var t = await getTask(req.params.id);
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//========================DONE========================
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

/*app.get('/assignments/', async (req, res, next) => {
  try{
    res.json((await query('SELECT * FROM "assignment";')).rows);
    //res.json((await query('SELECT * FROM "taskAw";')).rows);
  }catch(e){
    next(e);
  }
});*/

app.get('/assignments/:id', async (req, res, next) => {
  try{
    var t = await getAssignment(req.params.id);
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.listen(process.env.PORT || 4000, () => console.log('App is online on port 4000'))
