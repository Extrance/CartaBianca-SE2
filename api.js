const 	express 	= require('express');
const 	pg      	= require('pg');
var 	sha1 	  	= require('sha1');
const 	app 		= express();
const 	bodyParser 	= require('body-parser');
const usersfunctions = require('./func/users.js')
const examsfunctions = require('./func/exams.js')
const groupsfunctions = require('./func/groups.js')
const tasksfunctions = require('./func/tasks.js')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//AGGIUNGERE A ASSIGNMENT CAMPO ASSEGNAZIONE USER TASK E ESAME(CHE ORA MANCA)

var logged = false;
var logId;

// ---------------- MAIN ----------------

//OK
app.get('/', async (req, res) => {
  var statusss = {status:200, text:""}
  statusss = usersfunctions.getMain();
  console.log(statusss.status);
  res.send(statusss.text);
});

// ---------------- USER PAGES ----------------

//OK
app.get('/users/', async(req, res, next) => {
  try{
    var t = (logged) ? await usersfunctions.userIn() : await usersfunctions.userOut();
    res.write(t.text);
    console.log(t.status);
    res.end('</body></html>');
  }catch (e){
    next(e);
  }
});

//OK
app.post('/users/', async (req, res, next) => {
  var a = req.body;
  try{
    var a = await usersfunctions.insUt(a);
    if(a==201)
      res.redirect('/users');
	   if(a==406 || a == 400)
      res.write('Wrong typo, user not registered. <br /> <a href="/users/>Go back</a>"');
  }catch(e){
    next(e);
  }
});

//OK
app.get('/users/:id', async (req, res, next) => {
  var id = req.params.id;
  var t = await usersfunctions.getUserByIdTest(id);
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

//OK
app.post('/users/:id', async (req, res, next) => {
  try{
    var t = await usersfunctions.delUt(req.params.id);
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

//OK
app.get('/exams/', async (req, res, next) => {
  try{
    var t = await examsfunctions.getExams();
    res.write(t.text);
    res.end('</body></html>')
  }catch (e){
    next(e);
  }
});

//OK
app.post('/exams/', async (req, res, next) => {
  try{
    var n = req.body.nome;
    await examsfunctions.createEx(n, logId);
    res.redirect('/exams/');
  }catch(e){
    next(e);
  }
});

//OK
app.post('/exams/delete', async (req, res, next) => {
  try{
    var n = req.body.exs;
	var t = await examsfunctions.delEx(n);
	if(t == 200) res.redirect('/exams/');
	if(t==400) res.write('Wrong typo, exam not deleted. <br /> <a href="/exams/'+n+'>Go back</a>"');
  }catch(e){
    next(e);
  }
});

//OK
app.get('/exams/:id', async (req, res, next) => {
    var t = await examsfunctions.getExamByIdTest(req.params.id);
    if(t.status == 200) {
      res.write(t.text);
      res.end('</body></html>')
    }
});

//OK
app.post('/exams/:id', async (req, res, next) => {
  try{
    var id = req.params.id;
    var task = req.body.nome;
	var t = await examsfunctions.insEx(id, task);
	if( t == 200 ) res.redirect('/exams/'+id);
	if(t==400) res.write('Wrong typo, exam not updated. <br /> <a href="/exams/'+id+'>Go back</a>"');
  }catch(e){
    next(e);
  }
});

// ---------------- GROUP PAGES ----------------

//OK
app.get('/groups/', async (req, res, next) => {
  try{
    var t = await groupsfunctions.getGroups();
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//OK
app.post('/groups/', async (req, res, next) => {
  try{
	   var t = await groupsfunctions.insGr(req.body.name);
	   if (t==200) res.redirect('/groups/');
	   if (t==400) res.write('Wrong typo, group not created. <br /> <a href="/groups/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

//OK
app.get('/groups/:id', async (req, res, next) => {
  try{
    var t = await groupsfunctions.getGroupByIdTest(req.params.id);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//OK
app.post('/groups/:id', async (req, res, next) => {
  try{
    var t = await groupsfunctions.insertGroupById(req.params.id,req.body.membro);
    if (t==200) res.redirect('/groups/');
    if (t==400) res.write('Wrong typo, not inserted. <br /> <a href="/groups/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

//OK
app.post('/groups/del/:id', async (req, res, next) => {
  try{
    var t = await groupsfunctions.delGr(req.params.id);
    if (t==200) res.redirect('/groups/');
    if (t==400) res.write('Wrong typo, group not deleted. <br /> <a href="/groups/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

// ---------------- TASK PAGES ----------------

//OK
app.get('/tasks/', async (req, res, next) => {
  try{
    var t = await tasksfunctions.getTasks();
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});


app.post('/tasks/', async (req, res, next) => {
  try{
	   var t = await tasksfunctions.insTask(req.body.name,req.body.desc,req.body.risp);
	   if (t==200) res.redirect('/tasks/');
	   if (t==400) res.write('Wrong typo, task not created. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

//OK
app.get('/tasks/:id', async (req, res, next) => {
  try{
    var t = await tasksfunctions.getTask(req.params.id);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//
app.post('/tasks/:id', async (req, res, next) => {
  try{
    var t = await tasksfunctions.insertTaskById(req.params.id,req.body.ans)
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

//TASKS
/* NON SERVE
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
}*/

app.listen(process.env.PORT || 4000, () => console.log('App is online on port 4000'))
//app.listen(4000, () => console.log('App is online on port 4000'))
