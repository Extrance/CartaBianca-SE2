const express = require('express');
const pg      = require('pg');
const app = express();
const bodyParser = require('body-parser');
var sha1 	= require('sha1');
const usersfunctions = require('./func/users.js')
const examsfunctions = require('./func/exams.js')
const groupsfunctions = require('./func/groups.js')
const tasksfunctions = require('./func/tasks.js')

var logged = false;
var logId;

//==================================== TEST CASES ====================================

//-------------------- USERS + MAIN --------------------


describe('GET /', () => {
  it('should return 200', () => {
    expect(usersfunctions.getMain().status).toBe(200);
  })
})

describe('POST /lin OK', async() => {
  it('should return 200', async() => {
    b = {matr:185011, password:'SalviniPremier'}
    var t = await usersfunctions.linFunc(b);
    expect(t).toBe(200);
  })
})

describe('POST /lin NOT', async() => {
  it('should return 400', async() => {
    b = {matr:185011, password:'ARGH'}
    var t = await usersfunctions.linFunc(b);
    expect(t).toBe(400);
  })
})

describe('GET /users/', async() => {
  it('should return 200', async() => {
    var t = await usersfunctions.userIn(185011);
    expect(t.status).toBe(200);
  })
})

describe('POST /users/', async() => {
  it('should return 201', async() => {
	var b = {
		matr: 399880,
		name: 'nome1',
		surname: 'surname1',
		password: 'ppp1'
	};
    var t = await usersfunctions.insUt(b);
    expect(t).toBe(201);    //worked when first tested, of course user was added
  })
})

describe('POST /users/ existing id', async() => {
  it('should return 400', async() => {
	var b = {
		matr: 185010,
		name: 'nome',
		surname: 'surname',
		password: 'ppp'
	};
    var t = await usersfunctions.insUt(b);
    expect(t).toBe(400);
  })
})

describe('GET /users/existingID', async() => {
  it('should return 200', async() => {
    var t = await usersfunctions.getUserByIdTest(true,185011,185011)
    expect(t.status).toBe(200);
  })
})

describe('GET /users/nonexistingID', async() => {
  it('should return 404', async() => {
    var t = await usersfunctions.getUserByIdTest(false,987699,185011)
    expect(t.status).toBe(404);
  })
})

describe('DELETE /users/existingID', async() => {
  it('should return 200', async() => {
    var t = await usersfunctions.delUt(100302); //worked when tested, of course it deleted that user
    expect(t).toBe(200);
  })
})

describe('/users/nonexistingID', async() => {
  it('should return 400', async() => {
    var t = await usersfunctions.delUt(999999999999);
    expect(t).toBe(400);
  })
})

describe('POST /users/', async() => {
  it('should return 406', async() => {
	var b = {
		matr: 999999999999999,
		name: 'nome1',
		surname: 'surname1',
		password: 'ppp1'
	};
    var t = await usersfunctions.insUt(b);
    expect(t).toBe(406);
  })
})

describe('POST /users/', async() => {
  it('should return 406', async() => {
	var b = {
		matr: 111,
		name: 'nome1',
		surname: 'surname1',
		password: 'ppp1'
	};
    var t = await usersfunctions.insUt(b);
    expect(t).toBe(406);
  })
})

//------------------------ EXAMS ------------------------

describe('GET /exams/', async() => {
  it('should return 200', async() => {
    var t = await examsfunctions.getExams();
    expect(t.status).toBe(200);
  })
})

describe('GET /exams/existingID', async() => {
  it('should return 200', async() => {
    var t = await examsfunctions.getExamByIdTest(1,true,185011);
    expect(t.status).toBe(200);
  })
})

describe('GET /exams/nonexistingID', async() => {
  it('should return 404', async() => {
    var t = await examsfunctions.getExamByIdTest(-1,true,185011);
    expect(t.status).toBe(404);
  })
})

describe('DELETE /exam/delete NO', async() => {
  it('should return 400', async() => {
    var t = await examsfunctions.delEx();
    expect(t).toBe(400);
  })
})

describe('POST /exams/ OK', async() => {
  it('should return 200', async() => {
    var t = await examsfunctions.createEx('nome4', 185011);
    expect(t).toBe(200);
  })
})

describe('DELETE /exam/delete OK', async() => {
  it('should return 200', async() => {
    var t = await examsfunctions.delEx(12); //worked when first tested
    expect(t).toBe(200);
  })
})

describe('POST /exams/ NO', async() => {
  it('should return 400', async() => {
    var t = await examsfunctions.createEx('nome', -1);
    expect(t).toBe(400);
  })
})

describe('POST /exams/nonExistingID', async() => {
  it('should return 400', async() => {
    var t = await examsfunctions.insEx(17, 3);
    expect(t).toBe(400);
  })
})

describe('POST /exams/existingID NO', async() => {
  it('should return 400', async() => {
    var t = await examsfunctions.insEx(12, -1);
    expect(t).toBe(400);
  })
})

describe('POST /exams/existingID', async() => {
  it('should return 200', async() => {
    var t = await examsfunctions.insEx(12, 14);  //worked before adding the task
    expect(t).toBe(200);
  })
})


//----------------------- GROUPS -----------------------

describe('GET /groups/', async() => {
  it('should return 200', async() => {
    var t = await groupsfunctions.getGroups(true);
    expect(t.status).toBe(200);
  })
})

describe('GET /groups/existingID', async() => {
  it('should return 200', async() => {
    var t = await groupsfunctions.getGroupByIdTest(1);
    expect(t.status).toBe(200);
  })
})

describe('GET /groups/nonexistingID', async() => {
  it('should return 404', async() => {
    var t = await groupsfunctions.getGroupByIdTest(-1);
    expect(t.status).toBe(404);
  })
})

describe('POST /groups/', async() => {
  it('should return 200', async() => {
    var t = await groupsfunctions.insGr('test',185011);
    expect(t).toBe(200);
  })
})

describe('POST /groups/del/nonexistingId', async() => {
  it('should return 400', async() => {
    var t = await groupsfunctions.delGr();
    expect(t).toBe(400);
  })
})

describe('POST /groups/del/existingId', async() => {
  it('should return 200', async() => {
    var t = await groupsfunctions.delGr(10);  //worked when tested
    expect(t).toBe(200);
  })
})

describe('POST /groups/:id', async() => {
  it('should return 400', async() => {
    var t = await groupsfunctions.insertGroupById(17, -1);
    expect(t).toBe(400);
  })
})

describe('POST /groups/:id', async() => {
  it('should return 200', async() => {
    var t = await groupsfunctions.insertGroupById(5, 185011);  //worked when tested
    expect(t).toBe(200);
  })
})

/*
//------------------------ TASKS ------------------------

describe('GET /tasks/', async() => {
  it('should return 200', async() => {
    var t = await tasksfunctions.getTasks(true);
    expect(t.status).toBe(200);
  })
})

describe('GET /tasks/existingID', async() => {
  it('should return 200', async() => {
    var t = await tasksfunctions.getTask(14,true);
    expect(t.status).toBe(200);
  })
})

describe('GET /tasks/nonexistingID', async() => {
  it('should return 404', async() => {
    var t = await tasksfunctions.getTask(-1,true);
    expect(t.status).toBe(404);
  })
})

/*
describe('POST /tasks/', async() => {
  it('should return 400', async() => {
    var t = await tasksfunctions.insTask();
    expect(t).toBe(400);
  })
})*/


describe('POST /tasks/', async() => {
  it('should return 200', async() => {
    var t = await tasksfunctions.insTask('provainsert2','prova_insert','42');
    expect(t).toBe(200);
  })
})

describe('POST /tasks/:id', async() => {
  it('should return 200', async() => {
    var t = await tasksfunctions.insertTaskById(14,'15',185011);
    expect(t).toBe(200);
  })
})

describe('POST /tasks/:id', async() => {
  it('should return 400', async() => {
    var t = await tasksfunctions.insertTaskById();
    expect(t).toBe(400);
  })
})
