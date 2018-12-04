const db = require('./dbconnect.js')

exports.getGroups = async(logged) => {
  var t = '<html><head></head><body><h1>List of Groups</h1>';
  var g = await db.query('SELECT * FROM "group";');
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

exports.insGr = async(name, logId) =>{
	try{
		await db.query('INSERT INTO "group" (name) VALUES (\''+name+'\')');
		var t = await db.query('SELECT * FROM "group" ORDER BY idgroup DESC LIMIT 1;');
		await db.query('INSERT INTO "former" (idgroup, iduser, grado) VALUES (\''+t.rows[0].idgroup+'\', \''+logId+'\', \''+2+'\');');
		return 200;
	}catch(e){
		return 400;
	}
}

exports.getGroupByIdTest = async(id, logged, logId) =>{
  var t = {status:200,text:""}
  try{
    var t = await getGroup(id, logged, logId);
    return t;
  }
  catch(e) {
	  console.log(e);
    console.log('404');
    t.status = 404;
    t.text = "";
    return t;
  }
}

exports.insertGroupById = async(id,membro) =>{
  try{
    await db.query('INSERT INTO "former" (idgroup, iduser, grado) VALUES (\''+id+'\', \''+membro+'\', \'1\');');
    return 200;
  }catch(e){
    return 400;
  }
}

exports.delGr = async(id) =>{
  try{
    await db.query('DELETE FROM "former" WHERE idgroup = \''+id+'\'');
    await db.query('DELETE FROM "group" WHERE idgroup = \''+id+'\'');
    return 200;
  }catch(e){
	  console.warn(e);
    return 400;
  }
}

async function getGroup(id, logged, logId) {
  var g = await db.query('SELECT g.name as name, u.name as nome, u.surname as surn, u.iduser as iduser  FROM "group" g, "former" f, "user" u WHERE g.idgroup = \''+id+'\' AND g.idgroup = f.idgroup AND f.iduser = u.iduser;');
  if(g.rows[0].name != undefined) {
    var t = '<html><head></head><body><h1>Group: '+g.rows[0].name+'</h1>';
	var check = false;
    for (var j in g.rows){
		if (parseInt(g.rows[j].iduser,10) == parseInt(logId, 10)) check = true;
      t+='<b>'+g.rows[j].iduser+'</b> - '+g.rows[j].surn+' '+g.rows[j].nome +'<br>';
    }
    if (logged && check) {
      var x = await db.query ('SELECT * FROM "former" WHERE idgroup = \''+id+'\' AND iduser = \''+logId+'\'');
      if(parseInt(x.rows[0].grado, 10) == 2) {
        var u = await db.query('SELECT iduser, name, surname FROM "user" WHERE iduser <>'+logId);
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
