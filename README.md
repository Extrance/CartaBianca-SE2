# CartaBianca-SE2
Project group for SE2 course (uniTn)


MEMBERS:
Andrea Balasso
Jari Sciampi
Francesco Giacomazzi
Francesco Bonomi


HEROKU:
https://cartabiancase2-automatic.herokuapp.com

APIARY:
https://se2proj.docs.apiary.io/


CONCEPT:
Project for the SE2 uniTn course
Develop a system for manage exams submission and review
The main categories that we identified are: users, exams, groups (classrooms), tasks (exercises)


RESOURCES:

/user
Page with the list of all users, possible to open the single page of a user through the link on every user's badge number, or by searching /user/{id}

/user/{id}
Page of the specific user, so far there are the basic informations, but it should be possible to the user to see votes and comments that he received (necessary to implement a login method

/exam
Page with the list of all exams, possible to open the single page of an exam through the link on every exam's name, or by searching /exam/{id}

/exam/{id}
Page of the specific exam, possible to open the specific exercises of an exam

/group
Page with the list of all groups, possible to open the single page of a group through the link on every group's id, or by searching /group/{id}

/group/{id}
Page of the specific group, so far it's possible to see the list of the components of the group and the exams that the group have to do

/task
Page with the list of all tasks, possible to open the single page of a task through the link on every task's name, or by searching /task/{id}, also possible to add tasks

/task/{id}
Page of the specific task, where the user can answer the question and submit the answer. Methods to be implemented

METHODS:

We choose to develop the following methods for each resource

Mainpage and /users/ resources

GET /
Main page of the website

GET /users/
In this page it's displayed the list of all users, and anyone can log in or sign up

POST /users/
This method allows the user to sing up in the website

GET /users/:id
In this page it's displayed the page of a specific user, what is shown depends on whether who is using the website is logged or not and, if he's logged, whether the page belongs to him or not

POST /users/:id
With this method an user can unsubscribe from the website and delete his account

POST /lin/
This method allows the user to log in, providing his correct matricola (id) and password (chosen when first signed up

POST /slog/
This method allows the user to log off

/exams/ resources

GET /exams/
In this page it's displayed the list of all exams, and who's logged in can create new exams or delete exams that he created

POST /exams/
This method allows the user to create a new exam

POST /exams/delete
This method allows the user to delete an exam that he owns

GET /exams/:id
In this page it's displayed the page of a specific exam, what is shown depends on whether who is using the website is logged or not and, if he's logged, whether the exam belongs to him or not

POST /exams/:id
This method allows the user to add tasks to the exam

/groups/ resources

GET /exams/
In this page it's displayed the list of all groups, and who's logged in can create new groups

POST /exams/
This method allows the user to create a new group

GET /groups/:id
In this page it's displayed the page of a specific group, what is shown depends on whether who is using the website is logged or not and, if he's logged, whether he's part of the group or not

POST /groups/:id
This method allows the user to add users to the group

POST /groups/del/:id
This method allows the owner of a group to delete the group

/tasks/ resources

GET /tasks/
In this page it's displayed the list of all tasks, and who's logged in can create new tasks

POST /tasks/
This method allows the user to decide the type of the task he wants to create

GET /tasks/open
This method allows the user to choose the parameters of the open task he wants to create

POST /tasks/open
This method allows the user to create an open answer task

GET /tasks/single
This method allows the user to choose the parameters of the single choice task he wants to create

POST /tasks/single
This method allows the user to create a single choice task

GET /tasks/multi
This method allows the user to choose the parameters of the multiple choice task he wants to create

POST /tasks/multi
This method allows the user to create a multiple choice task

GET /tasks/:id
Display a specific task

POST /tasks/:id
This method allows the user to answer to the task
