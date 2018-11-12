/*const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
 
var courses_offered = [{id: 21, name: 'HCI'},
{id: 28, name:'sweng'}]

app.get('/', (req, res) => res.send('Hello World - Check!'))
 
app.get('/courses', (req, res) => {
   res.json(courses_offered)
})
 
app.listen(PORT, () => console.log('Example app listening on port'+ PORT))*/

const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var indexexam = -1;
var indextask = -1;

var users = [ {id: 185010, name: 'Andrea', surname: 'Balasso'},
              {id: 123456, name:'Davide', surname:'Finnerty'},
              {id: 567890, name:'Ilaria', surname:'Sardella'},
              {id: 100001, name:'Laila', surname:'Marangon'},
              {id: 100002, name:'Elena', surname:'Cumerlato'},
              {id: 100003, name:'Filippo', surname:'Tognato'},
              {id: 100004, name:'Cesare', surname:'Raffaello'}]

var exams = [ {id: 0, name:'HCI', ex1:0, ex2:1, ex3:2, ex4:3, ex5:4},
              {id: 1, name:'SE2', ex1:0, ex2:1, ex3:2, ex4:3, ex5:5},
              {id: 2, name:'LFC', ex1:0, ex2:1, ex3:2, ex4:3, ex5:6},
              {id: 3, name:'Analisi1', ex1:0, ex2:1, ex3:2, ex4:4, ex5:5},
              {id: 4, name:'Prog1', ex1:0, ex2:1, ex3:2, ex4:4, ex5:6},
              {id: 5, name:'Prog2', ex1:0, ex2:1, ex3:3, ex4:4, ex5:5},
              {id: 6, name:'GeomAlgLin', ex1:0, ex2:1, ex3:3, ex4:4, ex5:6},
              {id: 7, name:'ProbStat', ex1:0, ex2:1, ex3:4, ex4:5, ex5:6},
              {id: 8, name:'Calcolatori', ex1:0, ex2:2, ex3:3, ex4:4, ex5:5},
              {id: 9, name:'FMI', ex1:0, ex2:2, ex3:3, ex4:4, ex5:6},
              {id: 10, name:'Reti', ex1:0, ex2:2, ex3:4, ex4:5, ex5:6}]

var groups = [{id:0, name:'1st grade', member1:185010, member2:123456},
              {id:1, name:'2nd grade', member1:567890, member2:123456},
              {id:2, name:'3rd grade', member1:185010, member2:100001},
              {id:3, name:'4th grade', member1:100002, member2:100004}]

var assignment = [{idgroup:0, idexam:4},
                  {idgroup:0, idexam:1},
                  {idgroup:2, idexam:1},
                  {idgroup:1, idexam:7},
                  {idgroup:3, idexam:5}]

var tasks = [ {id:0, name:'a1ex1', description:'Triangle with base length 6 and height 5, calculate area'},
              {id:1, name:'a1ex2', description:'Circle with radius length 5, calculate circumference'},
              {id:2, name:'a1ex3', description:'Circle with radius length 4, calculate area'},
              {id:3, name:'a1ex4', description:'Square with side length 5, calculate perimeter'},
              {id:4, name:'a1ex5', description:'Rectangle with base length 5 and height 8, calculate perimeter'},
              {id:5, name:'a1ex6', description:'Rectangle with base length 3 and height 9, calculate area'},
              {id:6, name:'a1ex7', description:'Square with side length 5, calculate area'},]

//------------------------------------------------------------------------------

//localhost:3000/
app.get('/', (req, res) => {
  res.send( '<b><h1>CARTA BIANCA SE2</h1></b>Welcome to our website<br>'+
            ' '+'<a href="/user/">List of Users</a>'+"<br>"+
            ' '+'<a href="/exam/">List of Exams</a>'+"<br>"+
            ' '+'<a href="/group/">List of Groups</a>'+"<br>"+
            ' '+'<a href="/task/">List of Tasks</a>'+"<br>")
})

//localhost:3000/user
app.get('/user', (req, res) => {
  //res.json(users);
  res.write('<b>LIST OF ALL USERS:</b><br>')
  var i;
  for(i=0; i<users.length; i++) {
    res.write(' '+'<a href="/user/'+users[i].id+'">'+users[i].id+'</a>'+" "+users[i].name+" "+users[i].surname+"<br>")
  }
  res.end()
})

app.get('/user/:id', (req, res) => {
  var count;
  count = -1;
  var stud = req.params.id;
  var argh;
  for (argh=0; argh<users.length; argh++) {
    if (stud == users[argh].id) {
      count = argh;
    }
  }

  if (count == -1) {
    res.status(404).send();
    return;
  }

  res.send('<b>'+users[count].id+'</b><br>'+" "+users[count].name+" "+users[count].surname)
})

//localhost:3000/exam
app.get('/exam', (req, res) => {
   //res.json(exams)
   res.write('<b>LIST OF ALL EXAMS:</b><br>')
   var i;
   for(i=0; i<exams.length; i++) {
     res.write(' '+'<a href="/exam/'+exams[i].name+'">'+exams[i].name+'</a>'+"<br>")
   }
   res.end();
})

app.get('/exam/:id', (req, res) => {
  var count;
  count = -1;
  var stud = req.params.id;
  var argh;
  for (argh=0; argh<exams.length; argh++) {
    if (stud == exams[argh].name) {
      count = argh;
    }
  }
  indexexam = count;
  if (count == -1) {
    res.status(404).send();
    return;
  }

  res.send( '<b>'+exams[count].name+'</b><br>'+
            ' '+'<a href="/task/'+tasks[exams[count].ex1].id+'">'+tasks[exams[count].ex1].name+'</a>'+"<br>"+
            ' '+'<a href="/task/'+tasks[exams[count].ex2].id+'">'+tasks[exams[count].ex2].name+'</a>'+"<br>"+
            ' '+'<a href="/task/'+tasks[exams[count].ex3].id+'">'+tasks[exams[count].ex3].name+'</a>'+"<br>"+
            ' '+'<a href="/task/'+tasks[exams[count].ex4].id+'">'+tasks[exams[count].ex4].name+'</a>'+"<br>"+
            ' '+'<a href="/task/'+tasks[exams[count].ex5].id+'">'+tasks[exams[count].ex5].name+'</a>'+"<br>")
})

//localhost:3000/group
app.get('/group', (req, res) => {
   //res.json(groups)
   res.write('<b>LIST OF ALL GROUPS:</b><br>')
   var h;
   for(h=0; h<groups.length; h++) {
     res.write(' '+'<a href="/group/'+groups[h].id+'">'+groups[h].name+'</a>'+'<br>')
   }
   res.end();
})

app.get('/group/:id', (req, res) => {
  var count;
  count = -1;
  var stud = req.params.id;
  var argh;
  for (argh=0; argh<groups.length; argh++) {
    if (stud == groups[argh].id) {
      count = argh;
    }
  }

  if (count == -1) {
    res.status(404).send();
    return;
  }

  var mem1 = -1;
  var mem2 = -1;
  var orco;
  for(orco=0; orco<users.length; orco++) {
    if(groups[count].member1 == users[orco].id) {
      mem1 = orco;
    }
    else if(groups[count].member2 == users[orco].id) {
      mem2 = orco;
    }
  }

  if (mem1 == -1 || mem2 == -1) {
    if(mem1 == -1) {
      res.write("User "+groups[count].member1+" not found");
    }
    else if(mem2 == -1) {
      res.write("User "+groups[count].member2+" not found");
    }
    res.end()
    return;
  }

  res.write("<b>"+groups[count].name+"</b><br>"+
            " - "+'<a href="/user/'+groups[count].member1+'">'+groups[count].member1+'</a>'+" "+users[mem1].name+" "+users[mem1].surname+"<br>"+
            " - "+'<a href="/user/'+groups[count].member2+'">'+groups[count].member2+'</a>'+" "+users[mem2].name+" "+users[mem2].surname+"<br><br>"+
            "Exams to do<br>")

  var a;
  for(a=0; a<assignment.length; a++) {
    if(assignment[a].idgroup == groups[count].id) {
      res.write(" - "+'<a href="/exam/'+exams[assignment[a].idexam].name+'">'+exams[assignment[a].idexam].name+'</a>'+"<br>")
      //res.write(" - "+exams[assignment[a].idexam].id+" "+exams[assignment[a].idexam].name+"<br>")
    }
  }
  res.end();
})

//localhost:3000/task
app.get('/task', (req, res) => {
  //res.json(tasks);
  res.write('<b>LIST OF ALL TASKS:</b><br>')
  var h;
  for(h=0; h<tasks.length; h++) {
    res.write(' '+'<a href="/task/'+tasks[h].id+'">'+"<b>"+tasks[h].name+"</b>"+'</a>'+'<br>'+" - "+tasks[h].description+"<br>")
  }
  res.write('<br>'+' '+'<a href="/task/'+tasks.length+'">'+"<b>"+"New Task"+"</b>"+'</a>');
  res.end();
})

app.get('/task/:id', (req, res) => {
  var stud = req.params.id;
  if(stud == tasks.length) {
    res.end(`
          <!doctype html>
          <html>
          <body>
              <form action="/task/`+tasks.length+`" method="post">
                  <input type="text" name="def" /><br />
                  <input type="text" name="question" /><br />
                  <button>Submit</button>
              </form>
          </body>
          </html>
      `);
  }
  else {
    var count;
    count = -1;
    var argh;
    for (argh=0; argh<tasks.length; argh++) {
      if (stud == tasks[argh].id) {
        count = argh;
      }
    }
    indextask = count

    if (count == -1) {
      res.status(404).send();
      return;
    }
    else {
      res.write("<b>"+tasks[count].name+"</b><br>"+" - "+tasks[count].description)

      res.end(`
            <!doctype html>
            <html>
            <body>
                <form action="/task" method="post">
                    <input type="number" name="answer" step=".01"/><br />
                    <button>Submit</button>
                </form>
            </body>
            </html>
        `);
    }
  }
})

app.post('/task', function (req, res) {
  response = {answer : req.body.answer};
  console.log(response);
  //res.send('POST request to the task page');
  if(indexexam == -1) {
    res.redirect('/task/');
    return;
  }
  else {
    if(indextask == exams[indexexam].ex1) {
      indextask = exams[indexexam].ex2
    }
    else if(indextask == exams[indexexam].ex2) {
      indextask = exams[indexexam].ex3
    }
    else if(indextask == exams[indexexam].ex3) {
      indextask = exams[indexexam].ex4
    }
    else if(indextask == exams[indexexam].ex4) {
      indextask = exams[indexexam].ex5
    }
    else if(indextask == exams[indexexam].ex5) {
      indextask = -1;
    }
  }

  if(indextask == -1) {
    res.redirect('/exam/'+exams[indexexam].name);
    return;
  }
  else {
    res.redirect('/task/'+indextask);
    return;
  }
});

app.post('/task/'+tasks.length, function (req, res) {
  name = req.body.def;
  question = req.body.question;
  //var in = tasks.length;
  tasks.push({id:tasks.length, name: name, description: question});
  console.log(name+" "+question);
  //res.send('POST request to the task page');
  res.redirect('/task');
});

app.listen(PORT, () => console.log('Example app listening on port'+ PORT))

