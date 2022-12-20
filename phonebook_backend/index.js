const express = require("express");
// const morgan = require("morgan");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.static('build'));
app.use(cors());
// morgan.token('data', function(req, resp) {
//   return JSON.stringify(req.body);
// });

// const customMorgan = morgan(':method :url :status :res[content-length] - :response-time ms - :data');
// app.use(customMorgan);


let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];


app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${phonebook.length} people</p>
<p>${new Date().toString()}</p>`);
});

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  let person = phonebook.find((p) => p.id === id);
  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
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

  const find_person = (name) =>
    phonebook.find((p) => p.name.toLowerCase() === name.toLowerCase());

  if (!person.name || !person.number) {
    response.status(500).json({ error: "name or number is missing" });
  } else if (find_person(person.name)) {
    response.status(500).json({ error: "name already exist" });
  } else {
    let new_person = {
      name: person.name,
      number: person.number,
      id: Math.floor(Math.random() * 10000000),
    };
    phonebook = phonebook.concat(new_person);
    response.status(200).json(new_person);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
