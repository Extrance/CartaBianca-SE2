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
