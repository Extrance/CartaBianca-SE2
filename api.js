const 	express 	= require('express');
const 	pg      	= require('pg');
var 	sha1 	  	= require('sha1');
const 	app 		= express();
const 	bodyParser 	= require('body-parser');

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

var logged = false;
var logId;

// ---------------- MAIN ----------------

app.get('/', async (req, res) => {
  var statusss = {status:200, text:""}
  statusss = getMain();
  console.log(statusss.status);
  res.send(statusss.text);
});


// ---------------- USER PAGES ----------------

app.get('/users/', async(req, res, next) => {
  try{
    var t = (logged) ? await userIn() : await userOut();
    res.write(t.text);
    console.log(t.status);
    res.end('</body></html>');
  }catch (e){
    next(e);
  }
});

app.post('/users/', async (req, res, next) => {
  var a = req.body;
  try{
    var a = await insUt(a);
    if(a==201)
      res.redirect('/users');
	   if(a==406 || a == 400)
      res.write('Wrong typo, user not registered. <br /> <a href="/users/>Go back</a>"');
  }catch(e){
    next(e);
  }
});

app.get('/users/:id', async (req, res, next) => {
  var id = req.params.id;
  var t = await getUserByIdTest(id);
  if(t.status == 404) {
    res.sendStatus(404);
  }
  else {
    if(t.text != ""){
      res.end(t.text);
    }else{
      //res.sendStatus(404);
    }
  }
});

app.post('/users/:id', async (req, res, next) => {
  try{
    var t = await delUt(req.params.id);
    if(t==200)
      res.redirect('/users');
	   if(t==400)
     res.write('Wrong typo, user not deleted. <br /> <a href="/users/'+req.params.id+'>Go back</a>"');
  }catch (e){
    next(e);
  }
});

app.post('/lin/', async (req, res, next) => {
  try{
    var t = await linFunc(req.body);
    if(t==200)
      res.redirect('/users');
	   if(t==400)
     res.write('Wrong typo, user not loggedIn. <br /> <a href="/users/">Go back</a>"');
  }catch (e){
    next(e);
  }
});

app.post('/slog/', async (req, res, next) => {
  try{
    var a = await slog();
	console.log(a);
	if(a==200){
		res.redirect('/users/');
	}else{
		res.write('Errore in slogphase.');
	}
  }catch (e){
	  console.log(e);
    next(e);
  }
});


// ---------------- EXAM PAGES ----------------

app.get('/exams/', async (req, res, next) => {
  try{
    var t = await getExams();
    res.write(t.text);
    res.end('</body></html>')
  }catch (e){
    next(e);
  }
});

app.post('/exams/', async (req, res, next) => {
  try{
    var n = req.body.nome;
    await createEx(n, logId);
    res.redirect('/exams/');
  }catch(e){
    next(e);
  }
});

app.post('/exams/delete', async (req, res, next) => {
  try{
    var n = req.body.exs;
	var t = await delEx(n);
	if(t == 200) res.redirect('/exams/');
	if(t==400) res.write('Wrong typo, exam not deleted. <br /> <a href="/exams/'+n+'>Go back</a>"');
  }catch(e){
    next(e);
  }
});

app.get('/exams/:id', async (req, res, next) => {
    var t = await getExamByIdTest(req.params.id);
    if(t.status == 200) {
      res.write(t.text);
      res.end('</body></html>')
    }
});

app.post('/exams/:id', async (req, res, next) => {
  try{
    var id = req.params.id;
    var task = req.body.nome;
	var t = await insEx(id, task);
	if( t == 200 ) res.redirect('/exams/'+id);
	if(t==400) res.write('Wrong typo, exam not updated. <br /> <a href="/exams/'+id+'>Go back</a>"');
  }catch(e){
    next(e);
  }
});

// ---------------- GROUP PAGES ----------------

app.get('/groups/', async (req, res, next) => {
  try{
    var t = await getGroups();
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/groups/', async (req, res, next) => {
  try{
	   var t = await insGr(req.body.name);
	   if (t==200) res.redirect('/groups/');
	   if (t==400) res.write('Wrong typo, group not created. <br /> <a href="/groups/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

app.get('/groups/:id', async (req, res, next) => {
  try{
    var t = await getGroupByIdTest(req.params.id);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/groups/:id', async (req, res, next) => {
  try{
    var t = await insertGroupById(req.params.id,req.body.membro);
    if (t==200) res.redirect('/groups/');
    if (t==400) res.write('Wrong typo, not inserted. <br /> <a href="/groups/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

app.post('/groups/del/:id', async (req, res, next) => {
  try{
    var t = await delGr(req.params.id);
    if (t==200) res.redirect('/groups/');
    if (t==400) res.write('Wrong typo, group not deleted. <br /> <a href="/groups/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

// ---------------- TASK PAGES -----------------

app.get('/tasks/', async (req, res, next) => {
  try{
    var t = await getTasks();
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//========================DONE========================
app.post('/tasks/', async (req, res, next) => {
  try{
	   var t = await insTask(req.body.name,req.body.desc,req.body.risp);
	   if (t==200) res.redirect('/tasks/');
	   if (t==400) res.write('Wrong typo, task not created. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

//========================DONE========================
app.get('/tasks/:id', async (req, res, next) => {
  try{
    var t = await getTask(req.params.id);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//========================DONE========================
app.post('/tasks/:id', async (req, res, next) => {
  try{
    var t = await insertTaskById(req.params.id,req.body.ans)
    if (t==200) res.redirect('/tasks/');
    if (t==400) res.write('Wrong typo, not inserted. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

// ---------------- ASSIGNMENT PAGES ----------------

app.get('/assignments/', async (req, res, next) => {
  try{
    res.json((await query('SELECT * FROM "assignment";')).rows);
    //res.json((await query('SELECT * FROM "taskAw";')).rows);
  }catch(e){
    next(e);
  }
});

app.get('/assignments/:id', async (req, res, next) => {
  try{
    var t = await getAssignment(req.params.id);
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//------------------- FUNCTIONS -------------------

//USERS
function getMain() {
  var t =""
  t+='<html><head></head><body>';
  t+='<b><h1>CARTA BIANCA SE2</h1></b><b>Welcome to our website</b><br><br>'+
                ' '+'<a href="/users/">List of Users</a>'+"<br>"+
                ' '+'<a href="/exams/">List of Exams</a>'+"<br>"+
                ' '+'<a href="/groups/">List of Groups</a>'+"<br>"+
                ' '+'<a href="/tasks/">List of Tasks</a>'+"<br>"+
                ' '+'<a href="/assignments/">List of Assignments</a>'+"<br>";
  t+='</body></html>';
  return {status:200,text:t};
}

async function userOut(){
  var plot = '<html><head></head><body>';
  plot += '<h1>Lista Utenti</h1><br>';
  var user = await query('SELECT * FROM "user"');
  for(var i in user.rows){
    var u = user.rows[i];
    plot +=' '+'<a href="/users/'+u.iduser+'"'+'>'+u.iduser+'</a>'+' - ' + u.name + ' ' + u.surname +'<br>';
  }
  plot +='<br>'	
  plot += '<form action="/users/" method="post">REGISTRATI<br />Matricola: <input type="number" name="matr" min="100000" max="199999" placeholder="100000"/><br />Nome: <input type="text" name="name" placeholder="name"/><br />'+
		'Cognome: <input type="text" name="surname" placeholder="surname"/><br />Password: <input type="password" name="password" /><br /><button>Registrati!</button></form>';
  plot += '<form action="/lin/" method="post">LOGIN<br />Matricola: <input type="number" name="matr" min="100000" max="199999" placeholder="100000"/><br />Password: <input type="password" name="password" /><br /><button>LogIn!</button></form>';
	
  return {status:200,text:plot};
}
async function userIn(){
  var plot = '<html><head></head><body>';
  plot += '<h1>Lista Utenti</h1><br>';
  var user = await query('SELECT * FROM "user"');
  for(var i in user.rows){
    var u = user.rows[i];
    plot +=' '+'<a href="/users/'+u.iduser+'"'+'>'+u.iduser+'</a>'+' - ' + u.name + ' ' + u.surname +'<br>';
  }
  plot +='<br>'
  plot+='<h3>Esci come utente '+logId+'</h3>';
  plot += '<form action="/slog/" method="post"><button>Slogga!</button></form>';
  return {status:200,text:plot};
}

async function linFunc(b){
	console.log(b);
	var mat = b.matr;
	var pass = sha1(b.password);
	var stato = 400;
	var utente = await query('SELECT * FROM "user" WHERE iduser = \''+mat+'\' AND password = \''+pass+'\';');
	if(utente.rows[0].iduser !=  undefined){
		logId = utente.rows[0].iduser;
		logged = true;
		console.log(logId);
		stato = 200;
	}
	return stato;
}

async function slog(){
	var s = 200;
	try{
		logged = false;
		logId = "";
	}catch(e){
		next(e)
		s = 400;
	}
	return s;
}

async function insUt(b){
  var mat = b.matr;  //need to make matricola automatic by the system
  var name = b.name;
  var surn = b.surname;
  var pass = b.password;
  pass = sha1(pass);
  var stato = 201;
  if(mat<=99999 || mat>=1000000)
    stato = 406 //not acceptable
  else {
    try{
		console.log("Pass: " + pass);
		await query ('INSERT INTO "user" VALUES ('+mat+', \''+name+'\', \''+surn+'\', \''+pass+'\');');
    }catch(e) {
		stato = 400;
    }
  }
  return stato;
}

async function getUserByIdTest(id) {
  var t = {status:200,text:""}
  try{
    t = (logged) ? await checkUt(id, logId) : await getUser(id);
    return t;
  }
  catch (e) {
    console.log('404');
    t.status = 404;
    t.text = "";
    return t;
  }
}

async function checkUt(id, idMine) {
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
  return {status:200, text:t};
}

async function getUser(id){
  var u = await query('SELECT * FROM "user" WHERE iduser = \''+id+'\'');
  var t = "";
  if (u.rows[0].iduser != undefined){
    t = '<HTML><head></head><body><h1>'+u.rows[0].iduser+'</h1>';
    t+="<br><br><i>Per vedere i dati di un utente, iscriviti o fai login</i>"
    t+='</body></HTML>';
    return {status:200,text:t};
  }
  return {status:400,text:""};
}

async function delUt(id){
	try{
		await query('DELETE FROM "former" WHERE iduser = \''+id+'\'');
		await query('DELETE FROM "user" WHERE iduser = \''+id+'\'');
		return 200;
	}catch(e){
		return 400;
	}
}

//EXAMS
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
  return {status:200,text:t};
}

async function getExamByIdTest(id) {
  var t = {status:200,text:""}
  try{
    t = await getExam(id);
    return t;
  }
  catch (e) {
    console.log('404');
    t.status = 404;
    t.text = "";
    return t;
  }
}

async function getExam(id) {
  var u = await query('SELECT * FROM "exam" WHERE idexam = \''+id+'\';');
  if (u.rows[0].idexam != undefined) {
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
    return {status:200,text:t};
  }
  return {status:404,text:""};
}

async function delEx(n){
	try{
		await query('DELETE FROM "examFormer" WHERE idexam =\''+n+'\';');
		await query('DELETE FROM "exam" WHERE idexam =\''+n+'\';');
		return 200;
	}catch(e){
		return 400;
	}
}

async function createEx(n, m) {
	try{
		await query('INSERT INTO "exam" (name, idcreatore) VALUES (\''+ n +'\', \''+m+'\');');
		return 200;
	}catch(e){
		return 400;
	}
}

async function insEx(id, task){
	try{
		await query('INSERT INTO "examFormer" (idexam, idtask) VALUES (\''+id+'\', \''+task+'\');');
		return 200;
	}catch(e){
		return 400;
	}
}

//GROUPS
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
  return {status:200,text:t};
}

async function getGroupByIdTest(id) {
  var t = {status:200,text:""}
  try{
    var t = await getGroup(id);
    return t;
  }
  catch(e) {
    console.log('404');
    t.status = 404;
    t.text = "";
    return t;
  }
}

async function getGroup(id) {
  var g = await query('SELECT g.name as name, u.name as nome, u.surname as surn, u.iduser as iduser  FROM "group" g, "former" f, "user" u WHERE g.idgroup = \''+id+'\' AND g.idgroup = f.idgroup AND f.iduser = u.iduser;');
  if(g.rows[0].name != undefined) {
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
    return {status:200,text:t};
  }
  return {status:404,text:""};
}

async function insGr(name){
	try{
		await query('INSERT INTO "group" (name) VALUES (\''+name+'\')');
		var t = await query('SELECT * FROM "group" ORDER BY idgroup DESC LIMIT 1;');
		await query('INSERT INTO "former" (idgroup, iduser, grado) VALUES (\''+t.rows[0].idgroup+'\', \''+logId+'\', \''+2+'\');');
		return 200;
	}catch(e){
		return 400;
	}
}

async function delGr(id) {
  try{
    await query('DELETE FROM "former" WHERE idgroup = \''+req.params.id+'\'');
    await query('DELETE FROM "group" WHERE idgroup = \''+req.params.id+'\'');
    return 200;
  }catch(e){
    return 400;
  }
}

async function insertGroupById(id,membro) {
  try{
    await query('INSERT INTO "former" (idgroup, iduser, grado) VALUES (\''+id+'\', \''+membro+'\', \'1\');');
    return 200;
  }catch(e){
    return 400;
  }
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
