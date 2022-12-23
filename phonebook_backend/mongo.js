const mongoose = require('mongoose');


if(process.argv.length < 3) {
  console.log('enter password');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ahmed751995:${password}@cluster0.c4lwbwa.mongodb.net/noteApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

mongoose.connect(url);

if(process.argv.length < 5) {
  Person.find({}).then(result => {
    console.log('phonebooks:');
    result.forEach(person => console.log(`${person.name} : ${person.number}`));
  }).then(() => mongoose.connection.close());
} else {
  console.log('adding person');
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });
  newPerson.save().then(() =>
  {
    console.log('person added');
    mongoose.connection.close();
  });
}
