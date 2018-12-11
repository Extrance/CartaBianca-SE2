<h1>EXAMS CONTROL SYSTEM</h1>

<h4>Partecipanti:</h4>
Andrea Balasso<br>
Jari Sciampi<br>
Francesco Giacomazzi<br>
Francesco Bonomi<br>
<br><br>
Heroku<br>
https://cartabiancase2-automatic.herokuapp.com

Apiary<br>
https://se2proj.docs.apiary.io/
<br>
<h3>Concept</h3>
Project for the SE2 uniTn course<br>
Develop a system for manage exams submission and review<br>
The main categories that we identified are: users, exams, groups (classrooms), tasks (exercises)<br>
<br>
<h3>Resources</h3>

<h4>/user</h4>
Page with the list of all users, possible to open the single page of a user through the link on every user's badge number, or by searching /user/{id}

<h4>/user/{id}</h4>
Page of the specific user, so far there are the basic informations, but it should be possible to the user to see votes and comments that he received (necessary to implement a login method

<h4>/exam</h4>
Page with the list of all exams, possible to open the single page of an exam through the link on every exam's name, or by searching /exam/{id}

<h4>/exam/{id}</h4>
Page of the specific exam, possible to open the specific exercises of an exam

<h4>/group</h4>
Page with the list of all groups, possible to open the single page of a group through the link on every group's id, or by searching /group/{id}

<h4>/group/{id}</h4>
Page of the specific group, so far it's possible to see the list of the components of the group and the exams that the group have to do

<h4>/task</h4>
Page with the list of all tasks, possible to open the single page of a task through the link on every task's name, or by searching /task/{id}, also possible to add tasks

<h4>/task/{id}</h4>
Page of the specific task, where the user can answer the question and submit the answer. Methods to be implemented
<br>
<h2>Methods</h2>
We choose to develop the following methods for each resource<br>
<h3>Mainpage and /users/ resources</h3>
<h4>GET /</h4>
Main page of the website
<h4>GET /users/</h4>
In this page it's displayed the list of all users, and anyone can log in or sign up
<h4>POST /users/</h4>
This method allows the user to sing up in the website
<h4>GET /users/:id</h4>
In this page it's displayed the page of a specific user, what is shown depends on whether who is using the website is logged or not and, if he's logged, whether the page belongs to him or not
<h4>POST /users/:id</h4>
With this method an user can unsubscribe from the website and delete his account
<h4>POST /lin/</h4>
This method allows the user to log in, providing his correct matricola (id) and password (chosen when first signed up
<h4>POST /slog/</h4>
This method allows the user to log off
<h4>POST /slog/</h4>
<h3>/exams/ resources</h3>
<h4>GET /exams/</h4>
In this page it's displayed the list of all exams, and who's logged in can create new exams or delete exams that he created
<h4>POST /exams/</h4>
This method allows the user to create a new exam
<h4>POST /exams/delete</h4>
This method allows the user to delete an exam that he owns
<h4>GET /exams/:id</h4>
In this page it's displayed the page of a specific exam, what is shown depends on whether who is using the website is logged or not and, if he's logged, whether the exam belongs to him or not
<h4>POST /exams/:id</h4>
This method allows the user to add tasks to the exam
<h3>/groups/ resources</h3>
<h4>GET /exams/</h4>
In this page it's displayed the list of all groups, and who's logged in can create new groups
<h4>POST /exams/</h4>
This method allows the user to create a new group
<h4>GET /groups/:id</h4>
In this page it's displayed the page of a specific group, what is shown depends on whether who is using the website is logged or not and, if he's logged, whether he's part of the group or not
<h4>POST /groups/:id</h4>
This method allows the user to add users to the group
<h4>POST /groups/del/:id</h4>
This method allows the owner of a group to delete the group
<h3>/tasks/ resources</h3>
<h4>GET /tasks/</h4>
In this page it's displayed the list of all tasks, and who's logged in can create new tasks
<h4>POST /tasks/</h4>
This method allows the user to decide the type of the task he wants to create
<h4>GET /tasks/open</h4>
This method allows the user to choose the parameters of the open task he wants to create
<h4>POST /tasks/open</h4>
This method allows the user to create an open answer task
<h4>GET /tasks/single</h4>
This method allows the user to choose the parameters of the single choice task he wants to create
<h4>POST /tasks/single</h4>
This method allows the user to create a single choice task
<h4>GET /tasks/multi</h4>
This method allows the user to choose the parameters of the multiple choice task he wants to create
<h4>POST /tasks/multi</h4>
This method allows the user to create a multiple choice task
<h4>GET /tasks/:id</h4>
Display a specific task
<h4>POST /tasks/:id</h4>
This method allows the user to answer to the task
