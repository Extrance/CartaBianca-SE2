const	db 		= require('./dbconnect.js')
var 	sha1 	= require('sha1');

exports.getAssignments = async(l, id) => {
	var stato;
	var testo = '<html><head></head><body>';
	if(!l){
		stato = 403;
		testo += 'Devi <a href="/users/">loggare</a> per vedere gli assignments';
	}
	else {
		stato = 200;
		testo += '<h3>Assignment da eseguire: </h3>';
		var q = await db.query('SELECT idexam as ide, deadline as ded, idassignment as ida FROM "assignment" a, "former" f WHERE a.idgroup = f.idgroup AND f.iduser = \''+id+'\' AND GRADO <> 2;');

		//console.warn(q);
		for(var i in q.rows){
			var s = await db.query('SELECT name FROM "exam" WHERE idexam = \''+q.rows[i].ide+'\';');
			testo += '<h4><a href="/assignments/'+q.rows[i].ida+'">'+s.rows[0].name+'</a> - '+q.rows[i].ded+'</h4>';
		}

		testo += '<h3>Assignment proprietario: </h3>';
		var a = await db.query('SELECT idexam as ide, deadline as ded, idassignment as ida, a.iduser as id FROM "assignment" a, "former" f WHERE a.idgroup = f.idgroup AND f.iduser = \''+id+'\' AND GRADO = 2;');
		console.warn(a.rows);

		for(var j in a.rows){
			var e = await db.query('SELECT name FROM "exam" WHERE idexam = \''+a.rows[j].ide+'\';');
			testo += '<h4><a href="/assignments/sol/'+a.rows[j].ida+'">'+e.rows[0].name+'</a> - '+a.rows[j].ded+' sostenuto dall\'utente '+a.rows[j].id+'</h4>';
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

exports.previewAssignment = async(l, lId, aId) => {
	var s = 200;
	var t = '<html><head><title>Assingment '+aId+'</title></head><body>';
	try{
		var q = await db.query('SELECT e.name as n,f.idtask as idt, a.deadline as ded FROM "exam" e, "assignment" a, "examFormer" f WHERE idassignment = \''+aId+'\' AND a.idexam = e.idexam AND e.idexam = f.idexam;');
		//var deadlinecheck = await db.query('SELECT * FROM "assignment" a WHERE idassignment = \''+aId+';');
		var deadline = q.rows[0].ded;
		console.log(deadline);
		var dateded = new Date(deadline);
		var now = new Date();
		if(deadline < now) {	//deadline passata
			t+= 'Deadline passata';
		}
		else {
			t += '<h1>'+q.rows[0].n+'</h1> <a href="/assignments/res/'+aId+'">Solve!</a><hr />';
			for(var i in q.rows)
				t += await displayTask(q.rows[i].idt);
		}
		t += '</body></html>';
	}
	catch(e){
		console.warn(e);
	}
	return {status: s, text: t}
}

var displayTask = async(idt) => {
	var q = await db.query('SELECT name, description, tipo FROM "task" WHERE idtask = \''+idt+'\';');
	var s = q.rows[0];
	var x = ['Domanda aperta', 'Scelta singola', 'Scelta multipla'];
	var t = '<strong>'+s.name+' </strong> - <emph> '+x[s.tipo]+'</emph><h4>'+s.description+'</h4><hr />';
	return t;
}

exports.viewAssignment = async(logged, logId, asId) => {
	var t = '<html><head></head><body>';
	if(logged) {
		var q = await db.query('SELECT e.name as n, e.idexam as ide, f.idtask as idt FROM "exam" e, "assignment" a, "examFormer" f WHERE idassignment = \''+asId+'\' AND a.idexam = e.idexam AND e.idexam = f.idexam;');
		t+='<h1>'+q.rows[0].n+'</h1>'
		for(var i in q.rows) {
			t+=await showFullTask(q.rows[i].idt,asId, logId, q.rows[0].ide, logId);
		}
		t+='</body></html>'
		return {text:t, status:200}
	}
	else {
		t +='Fai login</body></html>'
		return {text:t, status:200};
	}
}

var showFullTask = async(idt,asId,ide) => {
	var t='';
	var q = await db.query('SELECT * FROM "task" WHERE idtask = \''+idt+'\';');
	//var s = q.rows[0];
	t+='<h3>'+q.rows[0].name+'</h3>';
	t+=' '+q.rows[0].description+'<br>'
	if(q.rows[0].tipo == 0) {
		t+='<form action="/assignments/res/'+asId+'/'+idt+'" method="post">';
		t +='<input type ="text" name="risp">Risposta<br /><button>Submit!</button></form>';
	}
	else if(q.rows[0].tipo == 1) {
		var b = q.rows[0].answer.split(';');
		t+='<form action="/assignments/res/'+asId+'/'+idt+'" method="post">';
		t+='<input type="radio" name="risp" value="1">'+b[0]+'<br />';
    t+='<input type="radio" name="risp" value="2">'+b[1]+'<br />';
    t+='<input type="radio" name="risp" value="3">'+b[2]+'<br />';
    t+='<input type="radio" name="risp" value="4">'+b[3]+'<br />';
    t+='<input type="radio" name="risp" value="5">'+b[4]+'<br />';
    t+='<button>Submit!</button></form>';
	}
	else if(q.rows[0].tipo == 2) {
		var b = q.rows[0].answer.split(';');
		t+='<form action="/assignments/res/'+asId+'/'+idt+'" method="post">';
		t+='<input type="checkbox" name="option1">'+b[0]+'<br>';
    t+='<input type="checkbox" name="option2">'+b[1]+'<br>';
    t+='<input type="checkbox" name="option3">'+b[2]+'<br>';
    t+='<input type="checkbox" name="option4">'+b[3]+'<br>';
    t+='<input type="checkbox" name="option5">'+b[4]+'<br>';
    t+='<button>Submit!</button></form>';
	}
	return t;
}

exports.addAnswer = async (logged, logId, idAss, idTask, group, user, exam, answer) => {
	/*for(var i in a.rows) {
		console.log(a.rows[i].idaw);
	}*/
	try{
		var a = await db.query('SELECT * FROM "taskAw" WHERE idassignment =\''+idAss+'\' AND idexam =\''+exam+'\' AND iduser =\''+logId+'\' AND idtaskf =\''+idTask+'\';');
		if(a.rows[0] != undefined) {
			console.log('updated');
			await db.query('UPDATE "taskAw" SET "answer" = \''+answer+'\' WHERE idaw =\''+a.rows[0].idaw+'\'');
		}
		else {
			console.log('added');
			await db.query('INSERT INTO "taskAw" (idassignment, idexam, iduser, idtaskf, answer) VALUES (\''+idAss+'\', \''+exam+'\', \''+logId+'\', \''+idTask+'\', \''+answer+'\')');
			console.log("OK");
		}
		return 201;
	}
	catch(e) {
		console.log('added');
		await db.query('INSERT INTO "taskAw" (idassignment, idexam, iduser, idtaskf, answer) VALUES (\''+idAss+'\', \''+exam+'\', \''+logId+'\', \''+idTask+'\', \''+answer+'\')');
		console.log("OK");
		return 201;
	}
}


exports.viewTaskAss = async(logged, logId, asId, taskId) => {
	/*var t = '<html><head></head>';
	if(logged) {
		var exam = await db.query('SELECT idexam FROM "assignment" WHERE idassignment = \''+asId+'\' AND iduser = \''+logId+'\'');
		var stato = 400;
		if(exam.rows[0].idexam != undefined) {
			var task = await db.query('SELECT idtask FROM "examFormer" WHERE idexam = \''+exam.rows[0].idexam+'\' AND idtask = \''+taskId+'\'');
			if(task.rows[0].idtask != undefined) {
				stato = 200;
				var s = await db.query('SELECT * FROM task WHERE idtask=\''+task.rows[0].idtask+'\'');
				t+='<b>'+s.rows[0].name+'<b><br>'
				t+=' - '+s.rows[0].description+'<br>'
				if(s.rows[0].tipo == 0) {
					t += '<form action="/assignments/'+asId+'/'+taskId+'" method="post">Rispondi:<input type ="text" name="ans"><button>Rispondi al task!</button></form>';
				}
				else if(s.rows[0].tipo == 1) {
					var b = g.rows[0].answer.split(';');
	        //console.log(b[5]);
	        //var a = g.rows[0].risp;
	        t+='<form action="/assignments/'+asId+'/'+taskId+'" method="post">Rispondi:<br>'
	        t+='<input type="radio" name="risp" value="1">'+b[0]+'<br />';
	        t+='<input type="radio" name="risp" value="2">'+b[1]+'<br />';
	        t+='<input type="radio" name="risp" value="3">'+b[2]+'<br />';
	        t+='<input type="radio" name="risp" value="4">'+b[3]+'<br />';
	        t+='<input type="radio" name="risp" value="5">'+b[4]+'<br />';
	        t+='<button>Rispondi al task!</button></form>';
				}
				else if(s.rows[0].tipo == 2) {
					var b = g.rows[0].answer.split(';');
	        //console.log(b[5]);
	        t+='<form action="/assignments/'+asId+'/'+taskId+'" method="post">Rispondi:<br>'
	        t+='<input type="checkbox" name="option1">'+b[0]+'<br>';
	        t+='<input type="checkbox" name="option2">'+b[1]+'<br>';
	        t+='<input type="checkbox" name="option3">'+b[2]+'<br>';
	        t+='<input type="checkbox" name="option4">'+b[3]+'<br>';
	        t+='<input type="checkbox" name="option5">'+b[4]+'<br>';
	        t+='<button>Rispondi al task!</button></form>';
				}
			}
		}
	}
	else {
		t+='<body>Fai login</body></html>'
	}
	return {status:stato,text:t};*/
}
