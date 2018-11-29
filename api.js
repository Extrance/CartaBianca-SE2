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

app.listen(process.env.PORT || 4000, () => console.log('App is online on port 4000'))
//app.listen(4000, () => console.log('App is online on port 4000'))
