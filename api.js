const 	express 	= require('express');
const 	pg      	= require('pg');
const 	app 		= express();
const 	bodyParser 	= require('body-parser');
const usersfunctions = require('./func/users.js')
const examsfunctions = require('./func/exams.js')
const groupsfunctions = require('./func/groups.js')
const tasksfunctions = require('./func/tasks.js')
const db = require('./func/dbconnect.js')

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
    var t = (logged) ? await usersfunctions.userIn(logId) : await usersfunctions.userOut();
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
	console.log('A: ' +a);
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
  var t = await usersfunctions.getUserByIdTest(logged, id, logId);
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
      res.redirect('/users/');
	   if(t==400)
     res.write('Wrong typo, user not deleted. <br /> <a href="/users/'+req.params.id+'>Go back</a>"');
  }catch (e){
    next(e);
  }
});



app.post('/lin/', async (req, res, next) => {
  try{
    var t = await usersfunctions.linFunc(req.body);
    if(t==200) {
      logged = true;
  		logId = req.body.matr;
  		res.redirect('/users/');
    }
	  if(t==400)
     res.send('Wrong typo, user not loggedIn. <br /> <a href="/users/">Go back</a>"');
  }catch (e){
    next(e);
    res.send('Wrong typo, user not loggedIn. <br /> <a href="/users/">Go back</a>"');
  }
});

app.post('/slog/', async (req, res, next) => {
  try{
	var s = 200;
	try{
		logged = false;
		logId = "";
	}catch(e){
		next(e)
		s = 400;
	}
	if(s==200){
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
    var t = await examsfunctions.getExams(logged, logId);
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
    var t = await examsfunctions.getExamByIdTest(req.params.id, logged, logId);
    if(t.status == 200) {
      res.write(t.text);
      res.end('</body></html>')
    }
    else {
      res.send('Esame non esistente');
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
    var t = await groupsfunctions.getGroups(logged);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//OK
app.post('/groups/', async (req, res, next) => {
  try{
	   var t = await groupsfunctions.insGr(req.body.name, logId);
	   if (t==200) res.redirect('/groups/');
	   if (t==400) res.write('Wrong typo, group not created. <br /> <a href="/groups/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

//OK
app.get('/groups/:id', async (req, res, next) => {
  try{
    var t = await groupsfunctions.getGroupByIdTest(req.params.id, logged, logId);
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
    if (t==200) res.redirect('/groups/'+req.params.id);
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
    var t = await tasksfunctions.getTasks(logged);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});


app.post('/tasks/', async (req, res, next) => {
  try{
    if(req.body.type == "open") {
      res.redirect('/tasks/open');
    }
    else if(req.body.type == "single") {
      res.redirect('/tasks/single');
    }
    else if(req.body.type == "multi") {
      res.redirect('/tasks/multi');
    }
    //var a = await tasksfunctions.optionsTask(req.body.name,req.body.desc,req.body.type);
	   //var t = await tasksfunctions.insTask(req.body.name,req.body.desc,req.body.risp);
	   //if (t==200) res.redirect('/tasks/');
	   //if (t==400) res.write('Wrong typo, task not created. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});



//==============================================================================
app.get('/tasks/open', async (req, res, next) => {
  try{
    var t = await tasksfunctions.optionsTaskOpen(logged);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/tasks/open', async (req, res, next) => {
  try{
    //var a = await tasksfunctions.optionsTask(req.body.name,req.body.desc,req.body.type);

	   var t = await tasksfunctions.insTask(req.body.name,req.body.desc,0,req.body.risp);  //0 = open
	   if (t==200) res.redirect('/tasks/');
	   if (t==400) res.write('Wrong typo, task not created. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});


app.get('/tasks/single', async (req, res, next) => {
  try{
    var t = await tasksfunctions.optionsTaskSingle(logged);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/tasks/single', async (req, res, next) => {
  try{
    //var a = await tasksfunctions.optionsTask(req.body.name,req.body.desc,req.body.type);
    //var optrisp = '{'req.body.opt1+';'+req.body.opt2+';'+req.body.opt3+';'+req.body.opt4+';'++req.body.opt5+';'   +'}'
    var risposta = req.body.risp;

    var optrisp = ''+req.body.opt1+';'+req.body.opt2+';'+req.body.opt3+';'+req.body.opt4+';'+req.body.opt5+';'+risposta+'';
    //var stringoptrisp = JSON.stringify(optrisp);

    var t = await tasksfunctions.insTask(req.body.name,req.body.desc,1,optrisp);  //1 = single

	   //var t = await tasksfunctions.insTask(req.body.name,req.body.desc,0,req.body.risp);  //0 = open
	   if (t==200) res.redirect('/tasks/');
	   if (t==400) res.write('Wrong typo, task not created. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});

app.get('/tasks/multi', async (req, res, next) => {
  try{
    var t = await tasksfunctions.optionsTaskMulti(logged);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

app.post('/tasks/multi', async (req, res, next) => {
  try{
    console.log(req.body);
    var risposte='';

    if(req.body.option1 != undefined) {
      risposte+='1-';
      //console.log("option1 checked");
    }
    if(req.body.option2 != undefined) {
      risposte+='2-';
      //console.log("option2 checked");
    }
    if(req.body.option3 != undefined) {
      risposte+='3-';
      //console.log("option3 checked");
    }
    if(req.body.option4 != undefined) {
      risposte+='4-';
      //console.log("option4 checked");
    }
    if(req.body.option5 != undefined) {
      risposte+='5-';
      //console.log("option5 checked");
    }
    //var risposta = req.body.risp;

    var optrisp = ''+req.body.opt1+';'+req.body.opt2+';'+req.body.opt3+';'+req.body.opt4+';'+req.body.opt5+';'+risposte+'';

    var t = await tasksfunctions.insTask(req.body.name,req.body.desc,2,optrisp);  //2 = multi

	   if (t==200) res.redirect('/tasks/');
	   if (t==400) res.write('Wrong typo, task not created. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    next(e);
  }
});


//==============================================================================

//OK

app.get('/tasks/:id', async (req, res, next) => {
  try{
    var t = await tasksfunctions.getTask(req.params.id, logged);
    res.write(t.text);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});

//
app.post('/tasks/:id', async (req, res, next) => {
  try{
    var g = await db.query('SELECT * FROM "task" WHERE idtask = \''+req.params.id+'\';');
    if(g.rows[0] != undefined) {
      console.log('nome: '+g.rows[0].name)
      console.log('descrizione: '+g.rows[0].description)
      console.log('tipo: '+g.rows[0].tipo)
      if(g.rows[0].tipo == 0) {
        var t = await tasksfunctions.insertTaskById(req.params.id,req.body.ans, logId)
      }
      else if(g.rows[0].tipo == 1) {
        var answer = req.body.risp;
        var t = await tasksfunctions.insertTaskById(req.params.id,answer, logId)
      }
      else if(g.rows[0].tipo == 2) {
        var answer = '';
        if(req.body.option1 != undefined) {
          answer+='1-'
        }
        if(req.body.option2 != undefined) {
          answer+='2-'
        }
        if(req.body.option3 != undefined) {
          answer+='3-'
        }
        if(req.body.option4 != undefined) {
          answer+='4-'
        }
        if(req.body.option5 != undefined) {
          answer+='5-'
        }
        var t = await tasksfunctions.insertTaskById(req.params.id,answer, logId)
      }
    }
    //var t = await tasksfunctions.insertTaskById(req.params.id,req.body.ans, logId)
    if (t==200) res.redirect('/tasks/');
    if (t==400) res.send('Wrong typo, not inserted. <br /> <a href="/tasks/">Go back</a>"');
  }catch(e){
    //next(e);
    res.send("ERROR");
  }
});

// ---------------- ASSIGNMENT PAGES ----------------

app.get('/assignments/', async (req, res, next) => {
  try{
    res.json((await db.query('SELECT * FROM "taskAw";')).rows);
    //res.json((await query('SELECT * FROM "taskAw";')).rows);
  }catch(e){
    next(e);
  }
});

/*
app.get('/assignments/:id', async (req, res, next) => {
  try{
    var t = await getAssignment(req.params.id);
    res.write(t);
    res.end('</body></html>');
  }catch(e){
    next(e);
  }
});*/


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



//---------------Easter_Egg_SEssion_XD---------------

app.get('/makecoffee/', (req, res, next) => {
  res.sendStatus(418);
});


app.get('/cat/', (req, res, next) => {
  res.redirect('https://http.cat/100')
});


app.get('/sub2pewds/', (req, res, next) => {
  res.redirect('https://www.youtube.com/user/PewDiePie')
});


app.listen(process.env.PORT || 4000, () => console.log('App is online on port 4000'))
//app.listen(4000, () => console.log('App is online on port 4000'))
