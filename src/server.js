import http from 'node:http';

import { json } from './middlewares/json.js';
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// variável statefull pois guarda em memória no server.
//const users = [];


const server = http.createServer(async (req,res)=>{
  const { method, url } = req;

  // Middleware: um função que vai interceptar o req e res para fazer algo
  await json(req, res);

  const route = routes.find(route=>route.method === method && route.path.test(url));
  if(route){
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params
    req.query = query ? extractQueryParams(query) : {}
    console.log(query);
    return route.handler(req, res);
  }

  return res.writeHead(404).end('rota não encontrada')

});

server.listen(3333);