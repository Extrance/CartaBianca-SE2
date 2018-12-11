const	db 		= require('./dbconnect.js')
var 	sha1 	= require('sha1');

exports.getAssignments = async(l, id) => {
	var stato;
	var testo = '<html><head></head><body>';
	if(!l){
		stato = 403;
		testo += 'Devi <a href="/users/">loggare</a> per vedere gli assignments';
	}else{
		stato = 200;
		testo += '<h3>Assignment da eseguire: </h3>';
		var q = await db.query('SELECT idexam as ide, deadline as ded FROM "assignment" a, "former" f WHERE a.idgroup = f.idgroup AND f.iduser = \''+id+'\' AND GRADO <> 2;');
		//console.warn(q);
		for(var i in q.rows){
			var s = await db.query('SELECT name FROM "exam" WHERE idexam = \''+q.rows[i].ide+'\';');
			testo += '<h4><a href="'+q.rows[i].ide+'">'+s.rows[0].name+'</a> - '+q.rows[i].ded+'</h4>';
		}
		testo += '<h3>Assignment proprietario: </h3>';
		var a = await db.query('SELECT idexam as ide, deadline as ded, a.iduser as id FROM "assignment" a, "former" f WHERE a.idgroup = f.idgroup AND f.iduser = \''+id+'\' AND GRADO = 2;');
		console.warn(a.rows);
		for(var j in a.rows){
			var e = await db.query('SELECT name FROM "exam" WHERE idexam = \''+a.rows[j].ide+'\';');
			testo += '<h4><a href="'+a.rows[j].ide+'">'+e.rows[0].name+'</a> - '+a.rows[j].ded+' sostenuto dall\'utente '+a.rows[j].id+'</h4>';
		}
		testo += '<hr />';
		var esami = await db.query('SELECT * FROM "exam"');
		var gruppi = await db.query('SELECT g.idgroup, name FROM "group" g, "former" f WHERE g.idgroup = f.idgroup AND f.iduser = \''+id+'\' AND grado = 2'); 
		var listaEsami = '<select name="esame">';
		for(var r in esami.rows)
			listaEsami += '<option value="'+esami.rows[r].idexam+'">'+esami.rows[r].name+'</option>';
		listaEsami += '</select>';
		var listaGruppi = '<select name="gruppo">';
		for(var t in gruppi.rows)
			listaGruppi += '<option value="'+gruppi.rows[t].idgroup+'">'+gruppi.rows[t].name+'</option>';
		listaGruppi += '</select>';		
		testo += '<form action ="/assignments/" method="POST">';
		testo += 'Assegna l\'esame ' + listaEsami + ' al gruppo ' + listaGruppi +' con deadline '+'<input type="date" name="inputDate" id="inputDate"/>';
		testo += ' <button>Assegna!</button></form>';
		testo += '<script>document.getElementById("inputDate").min = new Date().toISOString().split("T")[0];document.getElementById("inputDate").value = new Date().toISOString().split("T")[0];</script>';

	}
	testo += '</body></html>';
	
	return {t: testo, s:stato};
}


exports.setAssignment = async(l, id, form) => {
	//TUTTI ID
	var esame = form.esame;
	var gruppo = form.gruppo;
	var data = form.inputDate;
	var user = await db.query('SELECT iduser FROM "former" WHERE idgroup = \''+gruppo+'\' AND grado <> 2');
	var stato = 200;
	try{
		for(var i in user.rows)
			await db.query('INSERT INTO "assignment" (idgroup, iduser, idexam, deadline) VALUES (\''+gruppo+'\', \''+user.rows[i].iduser+'\', \''+esame+'\', \''+data+'\');');
	}catch(e){
		console.warn(e);
		stato = 400;
	}
	
	return stato;
}