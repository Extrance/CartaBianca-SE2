const db = require('./dbconnect.js')

exports.getExams = async(logged, logId) =>{
  var u = await db.query('SELECT * FROM "exam"');
  var t = '<html><head></head><body>';
  var x = '';
  t+='<h1>Lista Esami</h1>';
  if(logged){ //fix the logged
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

exports.getExamByIdTest = async(id, logged, logId) =>{
  var t = {status:200,text:""}
  try{
    t = await getExam(id, logged, logId);
    return t;
  }
  catch (e) {
    console.log('404');
    t.status = 404;
    t.text = "";
    return t;
  }
}

exports.delEx = async(n) =>{
	try{
		await db.query('DELETE FROM "examFormer" WHERE idexam =\''+n+'\';');
		await db.query('DELETE FROM "exam" WHERE idexam =\''+n+'\';');
		return 200;
	}catch(e){
		return 400;
	}
}

exports.createEx = async(n, m) =>{
	try{
		await db.query('INSERT INTO "exam" (name, idcreatore) VALUES (\''+ n +'\', \''+m+'\');');
		return 200;
	}catch(e){
		return 400;
	}
}

exports.insEx = async(id, task) =>{
	try{
		await db.query('INSERT INTO "examFormer" (idexam, idtask) VALUES (\''+id+'\', \''+task+'\');');
		return 200;
	}catch(e){
		return 400;
	}
}

async function getExam(id, logged, logId) {
  var u = await db.query('SELECT * FROM "exam" WHERE idexam = \''+id+'\';');
  if (u.rows[0].idexam != undefined) {
    var t = '<html><head></head><body><h1>'+ u.rows[0].name+'</h1>';
    if (logged) {
      var k = await db.query('SELECT idtask FROM "examFormer" WHERE idexam = \''+id+'\';');
      for (var i in k.rows) {
        var s = await db.query('SELECT * FROM task WHERE idtask=\''+k.rows[i].idtask+'\'');
        t+= '<b>'+s.rows[0].name+': '+'</b><br>'+' - '+s.rows[0].description+'<br>';
      }
      if (parseInt(logId, 10) == parseInt(u.rows[0].idcreatore, 10)){
        t+='<br><br>'
        t+= '<form action="/exams/'+id+'" method="post">Nome task: <select name="nome">';
        var a = await db.query('SELECT * FROM "task";');
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
