const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();
app.use(express.json())
const port = 5001;
app.use(cors());
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectslist'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});
app.post('/api/data', async (req, res) => {
    console.log("fsfsjkf",req.body)
    // console.log("sajdasdadas",req)  
    
    const { training_name, trainer, skill, description, domain, seats, startDate, endDate } = req.body;
    // console.log("server",req.body)
  // Rest of your code...

    const checkTrainingQuery = 'SELECT * FROM training_schedule WHERE training_name = ?';
    const insertTrainingQuery = 'INSERT INTO training_schedule (training_name, trainer, skill_title, description, domain, no_of_seats, startdate, enddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    // Check if the training name already exists
    connection.query(checkTrainingQuery, [training_name], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Failed to add training.' });
        } else if (results.length > 0) {
            res.status(400).json({ error: 'Training is already registered.' });
        } else {
            // Insert the new training
            connection.query(
                insertTrainingQuery,
                [training_name, trainer, skill, description, domain, seats, startDate, endDate],
                (err, results) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        res.status(500).json({ error: 'Failed to add training.' });
                    } else {
                        console.log('Training added successfully.');
                        res.status(200).json({ message: 'Training added successfully.' });
                    }
                },
            );
        }
    });
});

app.get('/api/training-data', (req, res) => {
    const query = 'SELECT * FROM projectdetails'; // Replace with your actual table name
    console.log(query);
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.json(results);
            console.log(results);
        }
    });
});































app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
