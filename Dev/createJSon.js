require('./jsonFunction.js')();


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

writeJson(users, 'users.json');
writeJson(exams, 'exams.json');
writeJson(groups, 'groups.json');
writeJson(assignment, 'assignment.json');
writeJson(tasks, 'tasks.json');
