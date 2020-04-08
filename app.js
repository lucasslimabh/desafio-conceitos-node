const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error : "Invalid id"});
  }

  next();
}

app.use('/repositories/:id', validateId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {
    id : uuid(), 
    title, 
    url, 
    techs, 
    likes: 0
  }


  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(204).json({error : 'repository not found'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes : repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
  
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(204).json({error : "Repository not found "});
  }

  repositories.splice(repositoryIndex,1);

  return response.json({});

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error : "Invalid id"});
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex  < 0) {
    return response.status(400).json({error : "Repository not found"})
  }

  repositories[repositoryIndex].likes =  repositories[repositoryIndex].likes + 1;
  let likes = repositories[repositoryIndex].likes
  
  return response.json({"likes" : likes});
});

module.exports = app;
