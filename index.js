const { response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')

let morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))


let people = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(people)
})

app.post('/api/persons', (req, res) => {
    person = req.body

    if (!person.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    } else if (!person.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    } else if (people.length !== people.filter(obj => obj.name !== person.name).length) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const personObject = {
        id: Math.floor(Math.random() * 1000000),
        name: person.name,
        number: person.number,
    }

    people = people.concat(personObject)

    res.json(people)
})

app.get('/info', (req, res) => {
    res.write(`Phonebook has info for ${people.length} people \n`)
    res.write(Date())
    res.end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = people.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    people = people.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})