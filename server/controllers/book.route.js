const fs = require('fs');
const express = require('express');
const app = express();
const bookRoute = express.Router();

const { ObjectID } = require('mongodb');

let { Book } = require('../models/books');

bookRoute.get('/', ((req, res) => {
    Book.find()
        .select('name price isbn')
        .then(books => res.json({ books }))
        .catch(err => res.status(400).send(err));
}));

bookRoute.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send('Invalid ID');
        return;
    }
    Book.findOne({
        _id: id,
    })
        .select('name price isbn')
        .then((book) => {
            if (!book) {
                res.status(404).send('Book not found');
                return;
            }
            res.send({ book });
        }).catch(b => res.status(400).send(b));
});

bookRoute.put('/', ((req, res) => {
        let book = new Book({
            name: req.body.name,
            price: req.body.price,
            isbn: req.body.isbn,
        });
        book.save().select('name price isbn')
            .then(book => {
                res.status(200).json(book);
            })
            .catch(err => {
                res.status(400).send(err);
            });
}));

//To Update the Books using ID
bookRoute.post('/:id', ((req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send('Invalid ID');
        return;
    } else {
        Book.findOneAndUpdate({
            _id: id
        }, { $set: req.body }, { new: true })
            .then((book) => {
                if (!book) {
                    return res.status(404).send();
                }
                return res.send({ book });
            })
            .catch((err) => {
                res.status(400).send(err);
            });
    }
}));

// To Delete The Books
bookRoute.delete('/:id', ((req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send('Invalid ID');
        return;
    } else {
        Book.findByIdAndRemove({ _id: id })
            .then((book) => {
                if (!book) {
                    return res.status(404).send();
                }
                return res.send({ book });
            })
            .catch((err) => {
                res.status(400).send(err);
            });
    }
}));

module.exports = bookRoute;