const fs = require('fs');

module.exports = function(){
    this.writeJson = function(obj, nomeFile){
        var str = JSON.stringify(obj);

        fs.writeFile(nomeFile, str, (err) => {  
            if (err) throw err;
        });

    }
    
    this.readJsonFF = function(nomeFile){
        let raw = fs.readFileSync(nomeFile);
        console.log(raw);
        let finale = JSON.parse(raw);
        console.log(finale);
        return finale;
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
