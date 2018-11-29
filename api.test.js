/*test('basic test', () => {
    expect(true).toBe(true);
});*/

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

var logged = true;
var logId = 185010;

//==================================== TEST CASES ====================================

describe('GET /', () => {
  it('should return 200', () => {
    expect(getMain().status).toBe(200);
  })
})

describe('GET /users/', async() => {
  it('should return 200', async() => {
    var t = await userIn();
    expect(t.status).toBe(200);
  })
})

describe('POST /users/', async() => {
  it('should return 200', async() => {
	var b = {
		mat: 1001,
		name: 'nome1',
		surname: 'surname1',
		password: 'ppp1'
	};
    var t = await insUt(b);
    expect(t).toBe(200);
  })
})

describe('POST /users/ existing id', async() => {
  it('should return 400', async() => {
	var b = {
		mat: 100,
		name: 'nome',
		surname: 'surname',
		password: 'ppp'
	};
    var t = await insUt(b);
    expect(t).toBe(400);
  })
})

describe('GET /users/existingID', async() => {
  it('should return 200', async() => {
    var t = await getUserByIdTest(185010)
    expect(t.status).toBe(200);
  })
})

describe('GET /users/nonexistingID', async() => {
  it('should return 404', async() => {
    var t = await getUserByIdTest(9876)
    expect(t.status).toBe(404);
  })
})

describe('DELETE /users/existingID', async() => {
  it('should return 200', async() => {
    var t = await delUt(122222);
    expect(t).toBe(200);
  })
})

describe('/users/nonexistingID', async() => {
  it('should return 400', async() => {
    var t = await delUt();
    expect(t).toBe(400);
  })
})

//==================================== FUNCTIONS ====================================

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
  return {status:200,text:plot};
}

async function insUt(b){
  var mat = b.mat;  //need to make matricola automatic by the system
  var name = b.name;
  var surn = b.surname;
  var pass = b.password;
  var stato = 200;
  try{
	await query ('INSERT INTO "user" VALUES ('+mat+', \''+name+'\', \''+surn+'\', \''+pass+'\');');
  }catch(e) {
	stato = 400;
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
