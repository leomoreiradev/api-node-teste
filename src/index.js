const express = require('express');

const { uuid } = require('uuidv4');
const { request } = require('express');

const app = express();

/*Para poder retornar json */
app.use(express.json())

/*
Metodos http:
* GET:Buscar informações do back-end
* POST:Criar informação no bakc-end
* PUT/PACH: Alterar uma informação no back-end
* DELETE: Deletar informação no back-end
*/

/**
 * Tipos de parametros:
 * Query params: filtros e paginação
 * Route params: Identificar recursos(Atualizar/Deletar)
 * Request Body: Conteudo para criar ou editar um recurso(JSON)
 */

 /*
 * Middleware
 * Interceptador de requisiçoes (pode interromper areuisição)
   ou  alerar dados da  requisição
 */


const projects = [];

function logRequests(req, res, next){
  const { method, url } = req;
  const logLabel = `[${ method.toUpperCase() }] ${ url }`;

  console.time(logLabel);
  next(); //proximo middleware
  console.timeEnd(logLabel);
}

app.use(logRequests);


app.get('/projects', (req, res)=>{
    const { title } = req.query;
    
    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

    return res.json(results);
});

app.post('/projects',(req,res)=>{
  const {title, owner} = req.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);
  return res.json(project);
});

app.put('/projects/:id',(req,res)=>{
  const { id } = req.params;
  const {title, owner} = req.body;
  const projectIndex = projects.findIndex(project => project.id === id)
 //Se não encontrar ele retorna -1
  if(projectIndex < 0){
    return res.status(400).json({error:'Project not found.'})
  }

  const project = {
      id,
      title,
      owner,
  }

  projects[projectIndex] = project;

  return res.json(project);
});

app.delete('/projects/:id',(req,res)=>{
  const { id } = req.params

  const projectIndex = projects.findIndex(project => project.id === id)
 //Se não encontrar ele retorna -1
  if(projectIndex < 0){
    return res.status(400).json({error:'Project not found.'})
  }

  // indice, e posicao apartir dele
  projects.splice(projectIndex, 1);
  //retornando em branco 
  return res.status(204).send();
})

app.listen(3333,()=>{
  console.log("Back-end Started!");
})
