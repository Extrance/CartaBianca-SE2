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

describe('GET /tasks/', async() => {
  it('should return 200', async() => {
    var t = await getTasks();
    expect(t.status).toBe(200);
  })
})

describe('GET /tasks/existingID', async() => {
  it('should return 200', async() => {
    var t = await getTaskByIdTest(4);
    expect(t.status).toBe(200);
  })
})

describe('GET /tasks/nonexistingID', async() => {
  it('should return 404', async() => {
    var t = await getTaskByIdTest(-1);
    expect(t.status).toBe(404);
  })
})

describe('POST /tasks/', async() => {
  it('should return 400', async() => {
    var t = await insTask();
    expect(t).toBe(400);
  })
})

describe('POST /tasks/', async() => {
  it('should return 200', async() => {
    var t = await insTask('provainsert2','prova_insert','42');
    expect(t).toBe(200);
  })
})

describe('POST /tasks/:id', async() => {
  it('should return 200', async() => {
    var t = await insertTaskById(4,'15');
    expect(t).toBe(200);
  })
})

describe('POST /tasks/:id', async() => {
  it('should return 400', async() => {
    var t = await insertTaskById();
    expect(t).toBe(400);
  })
})

//==================================== FUNCTIONS ====================================

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
