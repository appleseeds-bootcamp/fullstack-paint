A simple paint app

## Tech Stack

JS - React<br>
Python - Bottle<br>
DB - pymysql (MySQL)<br>

## Build App and Install Depedencies
### Back End:
```
$ cd paint-

Install the DB (located in paintDb.sql)

// Create VENV 
$ python -m venv venv

// Activate VENV
$ . venv/Scripts/activate

// Install depedencies
$ pip install -r requirments.txt
```
### Front End:
```
$ cd paint-fe

// Install depedencies
$ npm install

// Run the build
$ npm run build
```

### Launch app
```
$ cd paint-be
$ python main.py

// visit http://localhost:8080 on your nearest browser
```
