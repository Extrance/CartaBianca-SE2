const express = require('express');
const pg      = require('pg');
const app = express();
const bodyParser = require('body-parser');
var sha1 	= require('sha1');
const usersfunctions = require('../func/users.js')
const examsfunctions = require('../func/exams.js')
const groupsfunctions = require('../func/groups.js')
const tasksfunctions = require('../func/tasks.js')
const db = require('../func/dbconnect.js')

var logged = false;
var logId;


describe('GET /exams/', async() => {
  it('should return 200', async() => {
    var t = await examsfunctions.getExams();
    expect(t.status).toBe(200);
  })
})


describe('POST /exams/ OK', async() => {
  it('should return 200', async() => {
    var t = await examsfunctions.createEx('TESTnome', 185011);
    expect(t).toBe(200);
  })
})

describe('GET /exams/existingID', async() => {
  it('should return 200', async() => {
    var exam = await db.query('SELECT * FROM "exam" WHERE name = \'TESTnome\';')
    var t = await examsfunctions.getExamByIdTest(exam.rows[0].idexam,true,185011);
    expect(t.status).toBe(200);
  })
})

/*
describe('GET /exams/nonexistingID', async() => {
  it('should return 404', async() => {
    var t = await examsfunctions.getExamByIdTest(-1,true,185011);
    expect(t.status).toBe(404);
  })
})*/

describe('DELETE /exam/delete NO', async() => {
  it('should return 400', async() => {
    var t = await examsfunctions.delEx();
    expect(t).toBe(400);
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
    var t = await examsfunctions.insEx(-1, -1);
    expect(t).toBe(400);
  })
})

describe('DELETE /exam/delete OK', async() => {
  it('should return 200', async() => {
    var exam = await db.query('SELECT * FROM "exam" WHERE name = \'TESTnome\';')
    var t = await examsfunctions.delEx(exam.rows[0].idexam); //worked when first tested
    expect(t).toBe(200);
  })
})
