const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("build"));
app.use(cors());
app.use(morgan("tiny"));

const Person = require("./models/phonebook");

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) =>
      response.send(`<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date().toString()}</p>`)
    )
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({}).then((people) => response.json(people));
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        return response.json(person);
      } else {
        return response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  const person = {
    number: body.number,
  };
  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const person = request.body;

  if (!person.name) {
    return response.status(400).json({ error: "no name spicified" });
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });
  newPerson
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));

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

const errorHandler = (error, request, response, next) => {
  // console.log({...error});
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
