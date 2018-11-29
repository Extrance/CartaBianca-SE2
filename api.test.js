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

describe('GET /exams/', async() => {
  it('should return 200', async() => {
    var t = await getExams();
    expect(t.status).toBe(200);
  })
})

describe('GET /exams/existingID', async() => {
  it('should return 200', async() => {
    var t = await getExamByIdTest(6);
    expect(t.status).toBe(200);
  })
})

describe('GET /exams/nonexistingID', async() => {
  it('should return 404', async() => {
    var t = await getExamByIdTest(-1);
    expect(t.status).toBe(404);
  })
})

describe('DELETE /exam/delete OK', async() => {
  it('should return 200', async() => {
    var t = await delEx(16);
    expect(t).toBe(200);
  })
})

describe('DELETE /exam/delete NO', async() => {
  it('should return 400', async() => {
    var t = await delEx();
    expect(t).toBe(400);
  })
})

describe('POST /exams/ OK', async() => {
  it('should return 200', async() => {
    var t = await createEx('nome', logId);
    expect(t).toBe(200);
  })
})

describe('POST /exams/ NO', async() => {
  it('should return 400', async() => {
    var t = await createEx('nome', 10);
    expect(t).toBe(400);
  })
})

describe('POST /exams/nonExistingID', async() => {
  it('should return 400', async() => {
    var t = await insEx(17, 3);
    expect(t).toBe(400);
  })
})

describe('POST /exams/existingID NO', async() => {
  it('should return 400', async() => {
    var t = await insEx(6, -1);
    expect(t).toBe(400);
  })
})

describe('POST /exams/existingID', async() => {
  it('should return 200', async() => {
    var t = await insEx(6, 6);  //worked before adding the task
    expect(t).toBe(200);
  })
})

//==================================== FUNCTIONS ====================================

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
