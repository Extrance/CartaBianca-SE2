const express = require('express');
const pg      = require('pg');
const app = express();
const bodyParser = require('body-parser');
var sha1 	= require('sha1');
const usersfunctions = require('../func/users.js')
const examsfunctions = require('../func/exams.js')
const groupsfunctions = require('../func/groups.js')
const tasksfunctions = require('../func/tasks.js')

var logged = false;
var logId;

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
