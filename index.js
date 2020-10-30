require('dotenv').config()
const { response } = require('express')
const express = require('express')
const app = express()
const Person = require('./models/person')

const cors = require('cors')
const mongoose = require('mongoose')

let morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

// const url = process.env.MONGODB_URI

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body)

    if (!body.name) {
        console.log('error 1')
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        console.log('error 2')
        return response.status(400).json({
            error: 'number missing'
        })c
    } 
    // else if (body.length !== body.filter(obj => obj.name !== body.name).length) {
    //     console.log('error 3')
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    console.log('no error')

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.write(`Phonebook has info for ${persons.length} people \n`)
        res.write(Date())
        res.end()
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
    const body = request.body
    const updatePerson = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, updatePerson, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: 'expected name needs to be unique' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})