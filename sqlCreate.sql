CREATE TABLE user (
    idUser INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE "group" (
    idGroup SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE "former" (
    idF SERIAL PRIMARY KEY,
    idGroup INTEGER REFERENCES "group"(idgroup) ON UPDATE CASCADE,
    idUser INTEGER REFERENCES "user"(iduser) ON UPDATE CASCADE,
    grado INTEGER NOT NULL
);

CREATE TABLE "task" (
    idTask SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT  NOT NULL,
	tipo INTEGER  NOT NULL,
    answer TEXT NOT NULL
);

CREATE TABLE "taskAw" (
    idAw SERIAL PRIMARY KEY,
    idUser INTEGER REFERENCES "user"(iduser) ON UPDATE CASCADE,
	idGroup INTEGER REFERENCES "group"(idgroup) ON UPDATE CASCADE,
    idTask INTEGER REFERENCES "task"(idTask) ON UPDATE CASCADE,
    answer TEXT NOT NULL,
    mark INTEGER
);

CREATE TABLE "exam" (
    idExam SERIAL PRIMARY KEY,
    name TEXT  NOT NULL UNIQUE,
    idCreatore INTEGER NOT NULL REFERENCES "user"(idUser) ON UPDATE CASCADE
);

CREATE TABLE "examFormer" (
    idF SERIAL PRIMARY KEY,
    idExam INTEGER NOT NULL REFERENCES "exam"(idExam) ON UPDATE CASCADE,
    idTask INTEGER NOT NULL REFERENCES "task"(idTask) ON UPDATE CASCADE
);

CREATE TABLE "assignment" (
    idAssignment SERIAL PRIMARY KEY,
    idGroup INTEGER NOT NULL REFERENCES "group"(idGroup) ON UPDATE CASCADE,
    idExam INTEGER NOT NULL REFERENCES "exam"(idExam) ON UPDATE CASCADE,
	deadLine DATE NOT NULL,
    mark INTEGER
);
