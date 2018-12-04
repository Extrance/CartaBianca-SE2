const db = require('./dbconnect.js')

exports.getTasks = async() =>{
  var t = '<html><head></head><body><h1>Lista Tasks:</h1>';
  var g = await db.query('SELECT * FROM "task";');
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

exports.insTask = async(name,desc,risp) =>{
  try{
    await db.query('INSERT INTO "task" (name, description, answer) VALUES (\''+name+'\', \''+desc+'\', \''+risp+'\')');
    return 200;
  }catch(e){
    return 400;
  }
}

exports.getTask = async(id) =>{
  var g = await db.query('SELECT * FROM "task" WHERE idtask = \''+id+'\';');
  if(g.rows[0] != undefined) {
    var t = '<html><head></head><body><h1>Task: '+g.rows[0].name+'</h1>';
    t += '<h3>'+g.rows[0].description+'</h3>';

    if (logged){  //fix the logged
      t += '<form action="/tasks/'+id+'" method="post">Rispondi:<input type ="number" name="ans"><button>Rispondi al task!</button></form>';
    }
    return {status:200,text:t};
  }
  return {status:404,text:""};
}

exports.insertTaskById = async(id,ans) =>{
  try{
    var voto = 10;
    await db.query('INSERT INTO "taskAw" (iduser, idtask, answer, mark) VALUES (\''+logId+'\', \''+id+'\', \''+ans+'\', \''+voto+'\')');
    return 200;
  }catch(e){
    return 400;
  }
}
