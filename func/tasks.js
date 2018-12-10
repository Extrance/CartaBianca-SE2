const db = require('./dbconnect.js')

exports.getTasks = async(logged) =>{
  var t = '<html><head></head><body><h1>Lista Tasks:</h1>';
  var g = await db.query('SELECT * FROM "task";');
  for (var i in g.rows){
    //t += '<h2>'+g.rows[i].name+'</h2>';
    t +=' '+'<a href="/tasks/'+g.rows[i].idtask+'"'+'>'+g.rows[i].name+'</a>'+'<br>';
  }

  if (logged) {
    t+='<br>';
    t+='<h3>Crea Task</h3>';
    t+='<form action="/tasks/" method="post">';
    //t+='<input type ="text" name="name">Nome task<br />';
    //t+='<input type ="text" name="desc">Descrizione task<br />';
    t+='<input type="radio" name="type" value="open">Domanda Aperta<br />';
    t+='<input type="radio" name="type" value="single">Scelta singola<br />';
    t+='<input type="radio" name="type" value="multi">Scelta multipla<br />';
    t+='<button>Avanti</button></form>';
    //t += '<input type ="text" name="risp">Risposta<br /><button>Crea task!</button></form>';
    //t += '<form action="/tasks/" method="post"><input type ="text" name="name">Nome task<br /><input type ="text" name="desc">Descrizione task<br /><input type ="text" name="risp">Risposta<br /><button>Crea task!</button></form>';
  }
  return {status:200,text:t};
}

exports.optionsTaskOpen = async(logged) => {
  var t = '<html><head></head><body>';
  if(logged) {
    t+='<br>';
    t+='<h3>Crea Task</h3>';
    t+='<form action="/tasks/open" method="post">';
    t+='<input type ="text" name="name">Nome task<br />';
    t+='<input type ="text" name="desc">Descrizione task<br />';
    t +='<input type ="text" name="risp">Risposta<br /><button>Crea task!</button></form>';
  }
  return {status:200,text:t};
}

exports.optionsTaskSingle = async(logged) => {
  var t = '<html><head></head><body>';
  if(logged) {
    t+='<br>';
    t+='<h3>Crea Task</h3>';
    t+='<form action="/tasks/single" method="post">';
    t+='<input type ="text" name="name">Nome task<br />';
    t+='<input type ="text" name="desc">Descrizione task<br />';
    t+='<input type ="text" name="opt1">Opzione 1<br />'
    t+='<input type ="text" name="opt2">Opzione 2<br />'
    t+='<input type ="text" name="opt3">Opzione 3<br />'
    t+='<input type ="text" name="opt4">Opzione 4<br />'
    t+='<input type ="text" name="opt5">Opzione 5<br /><br>'
    t+='<h4>Seleziona opzione corretta</h4>';
    t+='<input type="radio" name="risp" value="1">Opzione 1<br />';
    t+='<input type="radio" name="risp" value="2">Opzione 2<br />';
    t+='<input type="radio" name="risp" value="3">Opzione 3<br />';
    t+='<input type="radio" name="risp" value="4">Opzione 4<br />';
    t+='<input type="radio" name="risp" value="5">Opzione 5<br />';
    t+='<button>Crea Task!</button></form>';
  }
  return {status:200,text:t};
}

exports.optionsTaskMulti = async(logged) => {
  var t = '<html><head></head><body>';
  if(logged) {
    t+='<br>';
    t+='<h3>Crea Task</h3>';
    t+='<form action="/tasks/multi" method="post">';
    t+='<input type ="text" name="name">Nome task<br />';
    t+='<input type ="text" name="desc">Descrizione task<br />';
    t+='<input type ="text" name="opt1">Opzione 1<br />'
    t+='<input type ="text" name="opt2">Opzione 2<br />'
    t+='<input type ="text" name="opt3">Opzione 3<br />'
    t+='<input type ="text" name="opt4">Opzione 4<br />'
    t+='<input type ="text" name="opt5">Opzione 5<br /><br>'
    t+='<h4>Seleziona opzione corretta</h4>';

    t+='<input type="checkbox" name="option1">Option 1<br>';
    t+='<input type="checkbox" name="option2">Option 2<br>';
    t+='<input type="checkbox" name="option3">Option 3<br>';
    t+='<input type="checkbox" name="option4">Option 4<br>';
    t+='<input type="checkbox" name="option5">Option 5<br>';
    /*t+='<input type="radio" name="risp" value="1">Opzione 1<br />';
    t+='<input type="radio" name="risp" value="2">Opzione 2<br />';
    t+='<input type="radio" name="risp" value="3">Opzione 3<br />';
    t+='<input type="radio" name="risp" value="4">Opzione 4<br />';
    t+='<input type="radio" name="risp" value="5">Opzione 5<br />';*/
    t+='<button>Crea Task!</button></form>';
  }
  return {status:200,text:t};
}


exports.insTask = async(name,desc,type,risp) =>{
  try{
    if(name!= '' && desc != '' && risp != '') {
      await db.query('INSERT INTO "task" (name, description, tipo, answer) VALUES (\''+name+'\', \''+desc+'\', \''+type+'\', \''+risp+'\')');
      return 200;
    }
    else {
      return 400;
    }
  }catch(e){
    return 400;
  }
}

exports.getTask = async(id, logged) =>{
  var g = await db.query('SELECT * FROM "task" WHERE idtask = \''+id+'\';');
  if(g.rows[0] != undefined) {
    var t = '<html><head></head><body><h1>Task: '+g.rows[0].name+'</h1>';
    t += '<h3>'+g.rows[0].description+'</h3>';

    if (logged) {  //fix the logged
      if(g.rows[0].tipo == 0) {
        t += '<form action="/tasks/'+id+'" method="post">Rispondi:<input type ="number" name="ans"><button>Rispondi al task!</button></form>';
      }
      else if(g.rows[0].tipo == 1) {

        var b = g.rows[0].answer.split(';');
        //console.log(b[5]);
        //var a = g.rows[0].risp;
        t+='<form action="/tasks/'+id+'" method="post">Rispondi:<br>'
        t+='<input type="radio" name="risp" value="1">'+b[0]+'<br />';
        t+='<input type="radio" name="risp" value="2">'+b[1]+'<br />';
        t+='<input type="radio" name="risp" value="3">'+b[2]+'<br />';
        t+='<input type="radio" name="risp" value="4">'+b[3]+'<br />';
        t+='<input type="radio" name="risp" value="5">'+b[4]+'<br />';
        t+='<button>Rispondi al task!</button></form>';
      }
      else if(g.rows[0].tipo == 2) {
        var b = g.rows[0].answer.split(';');
        //console.log(b[5]);

        t+='<form action="/tasks/'+id+'" method="post">Rispondi:<br>'
        t+='<input type="checkbox" name="option1">'+b[0]+'<br>';
        t+='<input type="checkbox" name="option2">'+b[1]+'<br>';
        t+='<input type="checkbox" name="option3">'+b[2]+'<br>';
        t+='<input type="checkbox" name="option4">'+b[3]+'<br>';
        t+='<input type="checkbox" name="option5">'+b[4]+'<br>';
        t+='<button>Rispondi al task!</button></form>';
      }
      //t += '<form action="/tasks/'+id+'" method="post">Rispondi:<input type ="number" name="ans"><button>Rispondi al task!</button></form>';
    }
    return {status:200,text:t};
  }
  return {status:404,text:""};
}

exports.insertTaskById = async(id,ans, logId) =>{
  try{
    var voto = 10;
    await db.query('INSERT INTO "taskAw" (iduser, idtask, answer, mark) VALUES (\''+logId+'\', \''+id+'\', \''+ans+'\', \''+voto+'\')');
    return 200;
  }catch(e){
    return 400;
  }
}
