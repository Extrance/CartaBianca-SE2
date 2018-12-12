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

describe('GET /groups/', async() => {
  it('should return 200', async() => {
    var t = await groupsfunctions.getGroups(true);
    expect(t.status).toBe(200);
  })
})

describe('GET /groups/existingID', async() => {
  it('should return 200', async() => {
    var t = await groupsfunctions.getGroupByIdTest(27);
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
    var t = await groupsfunctions.insGr('grouptest',185011);
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
    var t = await groupsfunctions.delGr(33);  //worked when tested
    expect(t).toBe(200);
  })
})

describe('POST /groups/:id', async() => {
  it('should return 400', async() => {
    var t = await groupsfunctions.insertGroupById(27, -1);
    expect(t).toBe(400);
  })
})

describe('POST /groups/:id', async() => {
  it('should return 200', async() => {
    var t = await groupsfunctions.insertGroupById(27, 185010);  //worked when tested
    expect(t).toBe(200);
  })
})
