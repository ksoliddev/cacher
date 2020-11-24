# Cacher Pro

[![NPM Version][npm-image]][npm-url]
![NPM Downloads][downloads-image]
![Coverage Status][coverage-image]
![Dependecies][dependencies-image]

Middleware for intelligence cache system using memory, filesystem, redis or mongoDB with NodeJS Frameworks

* [How to install](#how-to-install)
* [How to use](#how-to-use)
* [Configuration Options](#configuration-options)
* [License](#license)
* [Authors](#authors)

## How to install
using `npm`
```bash
npm i cacher-pro
```
or using `yarn`
```bash
yarn add cacher-pro
```

## How to use

Very simple, only you need to:
- instance the cacher-pro passing a storage client (ex.: redis) as option
- and pass the handle function as a middleware in your routes

```js
import express from 'express';
import redis from 'redis';
import cacher from 'cacher-pro';

const app = express();

const cacherMidlleWare = cacher({
    redis : redis.createClient()
});

var fruits = ['orange', 'banana', 'apple'];
app.get('/fruits', cacherMidlleWare.handle, (req : any, res : any)=>{
    res.json({'result' : fruits});
});

app.get('/fruits/:id', cacherMidlleWare.handle, (req : any, res : any)=>{
    res.json({'result' : fruits[req.params.id]});
});

app.post('/fruits', cacherMidlleWare.handle, (req : any, res : any)=>{
    if(req.body.fruit){
        fruits.push(req.body.fruit);
        res.json("[POST] - Fruit inserted!");
    }
});

app.put('/fruits', cacherMidlleWare.handle, (req : any, res : any)=>{
    if(req.body.fruit){
        fruits.push(req.body.fruit);
    }
    res.json("[PUT] - Fruit updated!");
});

app.patch('/fruits', cacherMidlleWare.handle, (req : any, res : any)=>{
    if(req.body.fruit){
        fruits.push(req.body.fruit);
    }
    res.json("[PATCH] - Fruit inserted!");
});

app.delete('/fruits/:id', cacherMidlleWare.handle, (req : any, res : any)=>{
    fruits = fruits.filter((fr : any, idx : number) => idx !== parseInt(req.params.id) );
    res.json("[DELETE] - Fruit deleted!");
});

app.listen(3333, ()=>console.log("Express: Running Server"));
```

For development or testing environment you may not pass the `storage` client and it will use the `memory storage`. Its supports the following storages clients:
- Memory (or Local DB)
- Redis (recomended)
- MongoDB

## Configuration Options
```js
const options = {
    redis : redis.createClient()
}

const cacherMidlleWare = cacher(options);
```

 - `redis` - the `redis` storage client
 - `mongo` - the `mongodb` storage client

## License

[GNU Affero GPL](https://www.gnu.org/licenses/agpl-3.0.en.html)

## Authors

[Kissema Eduardo Rafael](https://github.com/kissema) ([kissema1@gmail.com](mailto:kissema1@gmail.com))

**Sponsored By**

![K SOLID](https://i.ibb.co/hdbG7t8/K-SOLID.png)

[downloads-image]: https://img.shields.io/npm/dt/cacher-pro.svg
[downloads-url]: https://npmjs.org/package/cacher-pro
[npm-image]: https://img.shields.io/npm/v/cacher-pro.svg
[npm-url]: https://npmjs.org/package/cacher-pro
[dependencies-image]: https://img.shields.io/david/ksoliddev/cacher-pro.svg
[coverage-image]: https://coveralls.io/repos/github/ksoliddev/cacher-pro/badge.svg?branch=master
