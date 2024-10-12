// Create web server 

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all comments
app.get('/comments', (req, res) => {
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            res.status(500).send('Could not read comments file');
            return;
        }
        const comments = JSON.parse(data);
        res.status(200).send(comments);
    });
});

// Add a comment
app.post('/comments', (req, res) => {
    const comment = req.body;
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            res.status(500).send('Could not read comments file');
            return;
        }
        const comments = JSON.parse(data);
        comment.id = uuidv4();
        comments.push(comment);
        fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
            if (err) {
                res.status(500).send('Could not write to comments file');
                return;
            }
            res.status(201).send(comment);
        });
    });
});

// Update a comment
app.put('/comments/:id', (req, res) => {
    const commentId = req.params.id;
    const comment = req.body;
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            res.status(500).send('Could not read comments file');
            return;
        }
        const comments = JSON.parse(data);
        const commentIndex = comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) {
            res.status(404).send('Comment not found');
            return;
        }
        comments[commentIndex] = comment;
        fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
            if (err) {
                res.status(500).send('Could not write to comments file');
                return;
            }
            res.status(200).send(comment);
        });
    });
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
    const comment


