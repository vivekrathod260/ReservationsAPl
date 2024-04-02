const express = require('express');
const app = express();
const cors = require('cors');

///////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//////////////////////////////////////////////////////

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err)=>{ if(err) console.log(err); else console.log('Connected'); });

db.run(`
    CREATE TABLE IF NOT EXISTS data (
        id INTEGER,
        checkInDate VARCHAR(50) NOT NULL,
        checkOutDate VARCHAR(50) NOT NULL,
        guestName VARCHAR(50) NOT NULL,
        guestEmail VARCHAR(50) NOT NULL,
        roomNumber INTEGER
    )
`);


////////////////////

app.get('/', (req, res) => {   
    res.send("Hello home");
});

app.get('/reservations', (req, res) => {

    db.all('SELECT * FROM data',[], (err, rows)=>{
        if(err)
        {
            res.status(401).send('error !');
            console.log(err);
            return;
        }
        else
        {
            res.send(rows);
        }
    })
});

app.get('/reservation/:id', (req, res) => {

    db.all('SELECT * FROM data where id=?',[req.params.id], (err, rows)=>{
        if(err)
        {
            res.status(401).send('error !');
            console.log(err);
            return;
        }
        else
        {
            console.log(rows);
            res.send(rows[0]);
        }
    })
});
app.post('/reservation', (req, res) => {

    db.all('INSERT INTO data VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.id, req.body.checkInDate, req.body.checkOutDate, req.body.guestName, req.body.guestEmail, req.body.roomNumber], 
        (err, rows)=>{
            if(err)
            {
                res.status(401).send('error !');
                console.log(err);
                return;
            }
            else
            {
                console.log(rows);
                res.send(null);
            }
        }
    );

});

app.put('/reservation/:id', (req, res) => {

    db.run('UPDATE data SET checkInDate=?, checkOutDate=?, guestName=?, guestEmail=?, roomNumber=? where id=?',
        [req.body.checkInDate, req.body.checkOutDate, req.body.guestName, req.body.guestEmail, req.body.roomNumber, req.params.id], 
        (err, rows)=>{
            if(err)
            {
                res.status(401).send('error !');
                console.log(err);
                return;
            }
            else
            {
                console.log(rows);
                res.send(null);
            }
        }
    );
});

app.delete('/reservation/:id', (req, res) => {
    db.run('DELETE FROM data where id=?',[req.params.id], (err, rows)=>{
        if(err)
        {
            res.status(401).send('error !');
            console.log(err);
            return;
        }
        else
        {
            res.send(null);
        }
    })
});

app.get('/insertreservations', (req, res) => {

    db.run('INSERT INTO data VALUES (2, "2024-02-07", "2024-03-12", "anand", "a@r.com", 2)',[], (err)=>{
        if(err)
        {
            res.status(401).send('error !');
            console.log(err);
            return;
        }
        
        res.send(null);
        console.log("Inserted");
    })

});


app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
