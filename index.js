const express = require('express');
const cors = require('cors');           
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());                       
app.use(express.json());               
app.use(express.urlencoded({ extended: false }));

let data = JSON.parse(fs.readFileSync('students.json', 'utf-8'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/students', (req, res) => {
    res.json(data);
});

app.get('/students/:id', (req, res) => {
    let id = req.params.id;
    let stud = data.find((s) => s.id === +id);
    res.json(stud || { error: 'Student not found' });
});

app.delete('/students/:id', (req, res) => {
    let id = req.params.id;
    let index = data.findIndex((s) => s.id === +id);
    if (index === -1) {
        res.json({ error: 'Invalid ID' });
    } else {
        data.splice(index, 1);
        fs.writeFileSync('students.json', JSON.stringify(data));
        res.json({ message: 'Data deleted' });
    }
});

app.post('/students', (req, res) => {
    let stud = req.body;
    data.push(stud);
    fs.writeFileSync('students.json', JSON.stringify(data));
    res.json({ message: 'Data saved' });
});

app.patch('/students/:id', (req, res) => {
    let id = +req.params.id;
    let stud_post = req.body;
    let stud_json = data.find((s) => s.id === id);

    if (!stud_json) {
        res.json({ error: 'Invalid ID' });
        return;
    }

    Object.assign(stud_json, stud_post);
    fs.writeFileSync('students.json', JSON.stringify(data));
    res.json({ message: 'Data updated' });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
