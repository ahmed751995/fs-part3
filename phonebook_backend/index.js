const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('build'));
app.use(cors());
app.use(morgan('tiny'));

const Person = require('./models/phonebook');



app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${phonebook.length} people</p>
<p>${new Date().toString()}</p>`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(people => response.json(people));
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => response.json(person));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((p) => p.id === id);
  if (person) {
    phonebook = phonebook.filter((p) => p.id !== id);
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if(!person.name) {
    response.status(400).json({"error": "no name spicified"});
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number
  });
  newPerson.save().then(savedPerson => response.json(savedPerson));

  // const find_person = (name) =>
  //   phonebook.find((p) => p.name.toLowerCase() === name.toLowerCase());

  // if (!person.name || !person.number) {
  //   response.status(500).json({ error: "name or number is missing" });
  // } else if (find_person(person.name)) {
  //   response.status(500).json({ error: "name already exist" });
  // } else {
  //   let new_person = {
  //     name: person.name,
  //     number: person.number,
  //     id: Math.floor(Math.random() * 10000000),
  //   };
  //   phonebook = phonebook.concat(new_person);
  //   response.status(200).json(new_person);
  // }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
