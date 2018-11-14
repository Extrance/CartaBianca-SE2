if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./DB');
}
module.exports = function(){
    this.writeJson = function(obj, nomeFile){
        localStorage.setItem(nomeFile, JSON.stringify(obj));
    }
    
    this.readJsonFF = function(nomeFile){
        return localStorage.getItem(nomeFile);
    }
    
    this.addUtente = function(o, mat, nome, cogn){
        var data = {
            id: mat,
            name: nome,
            surname: cogn
        };
        
        o.push(data);
    }

    this.addExam = function(o, mat, nome, es1, es2){
        var data = {
            id: mat,
            name: nome,
            ex1: es1,
            ex2: es2
        };
        o.push(data);
    }
    
    this.addGroup = function(o, mat, nome, es1, es2){
        var data = {
            id: mat,
            name: nome,
            member1: es1,
            member2: es2
        };
        o.push(data);
    }

    this.addAssig = function(o, idg, idx){
        var data = {
            idgroup: idg,
            idexam: idx
        };
        
        o.push(data);
    }

    this.addTask = function(o, mat, nome, desc){
        var data = {
            id: mat,
            name: nome,
            description: desc
        };
        
        o.push(data);
    }
}
