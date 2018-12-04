const db = require('./dbconnect.js')

exports.getMain = () => {
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

exports.userIn = async() => {
  var plot = '<html><head></head><body>';
  plot += '<h1>Lista Utenti</h1><br>';
  var user = await db.query('SELECT * FROM "user"');
  for(var i in user.rows){
    var u = user.rows[i];
    plot +=' '+'<a href="/users/'+u.iduser+'"'+'>'+u.iduser+'</a>'+' - ' + u.name + ' ' + u.surname +'<br>';
  }
  plot +='<br>'
  plot+='<h3>Esci come utente '+logId+'</h3>';
  plot += '<form action="/slog/" method="post"><button>Slogga!</button></form>';
  return {status:200,text:plot};
}

exports.userOut = async() => {
  var plot = '<html><head></head><body>';
  plot += '<h1>Lista Utenti</h1><br>';
  var user = await db.query('SELECT * FROM "user"');
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

exports.insUt = async(b)=>{
  var mat = b.matr;  //need to make matricola automatic by the system
  var name = b.name;
  var surn = b.surname;
  var pass = b.password;
  pass = sha1(pass);  //???
  var stato = 201;
  if(mat<=99999 || mat>=1000000)
    stato = 406 //not acceptable
  else {
    try{
		console.log("Pass: " + pass);
		await dq.query ('INSERT INTO "user" VALUES ('+mat+', \''+name+'\', \''+surn+'\', \''+pass+'\');');
    }catch(e) {
		stato = 400;
    }
  }
  return stato;
}

exports.getUserByIdTest = async(id) =>{
  var t = {status:200,text:""}
  try{
    t = (logged) ? await checkUt(id, logId) : await getUser(id);  //fix the logId
    return t;
  }
  catch (e) {
    console.log('404');
    t.status = 404;
    t.text = "";
    return t;
  }
}

exports.delUt = async(id) =>{
	try{
		await db.query('DELETE FROM "former" WHERE iduser = \''+id+'\'');
		await db.query('DELETE FROM "user" WHERE iduser = \''+id+'\'');
		return 200;
	}
  catch(e){
		return 400;
	}
}

async function checkUt(id, idMine) {
  var t = "";
  if(parseInt(id, 10) == parseInt(idMine, 10)) {
    var ut = await dq.query('SELECT * FROM "user" WHERE iduser = \''+id+'\';');
    t = '<HTML><head></head><body><h1>'+ut.rows[0].iduser+' - '+ut.rows[0].name+' '+ut. rows[0].surname+'</h1>';
    //console.log(ut.rows);
    var u = await dq.query('SELECT f.idgroup, name FROM "former" f, "group" g WHERE iduser=\''+id+'\' AND f.idgroup = g.idgroup;');
    var tx = "";
    for (var i in u.rows) {
      var tx = "";
      var x = await dq.query('SELECT e.name FROM "exam" e, "assignment" a WHERE a.idgroup =\''+u.rows[i].idgroup+'\' AND e.idexam = a.idexam;')
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
    var ut = await dq.query('SELECT * FROM "user" WHERE iduser = \''+id+'\';');
    t = '<HTML><head></head><body><h1>'+ut.rows[0].iduser+' - '+ut.rows[0].name+' '+ut. rows[0].surname+'</h1>';
    //console.log(ut.rows);
    var u = await dq.query('SELECT name FROM "former" f, "group" g WHERE iduser=\''+id+'\' AND f.idgroup = g.idgroup;');
    for (var i in u.rows){
        t += '<b>Group:</b> '+u.rows[i].name+'<br>';
    }
    t+= '</body></html>';
  }
  return {status:200, text:t};
} //fix the idMine

async function getUser(id) {
  var u = await db.query('SELECT * FROM "user" WHERE iduser = \''+id+'\'');
  var t = "";
  if (u.rows[0].iduser != undefined){
    t = '<HTML><head></head><body><h1>'+u.rows[0].iduser+'</h1>';
    t+="<br><br><i>Per vedere i dati di un utente, iscriviti o fai login</i>"
    t+='</body></HTML>';
    return {status:200,text:t};
  }
  return {status:400,text:""};
}
