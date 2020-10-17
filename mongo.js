const mongoose = require('mongoose')

if (process.argv.length > 6) {
    console.log('Please provide the password, name, and number')
    process.exit(1)
}

const url =
  `mongodb+srv://phonebook:phonebook@cluster0.n3skz.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })
    
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}


// const note = new Note({
//   content: 'Callback-functions suck',
//   date: new Date(),
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })