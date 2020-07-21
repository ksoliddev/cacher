import express from 'express';
import redis from 'redis';
import cacher from '../lib';

const app = express();

const cacherOptions = {
    redis : redis.createClient()
};

cacher.config(cacherOptions);

app.get('/express', cacher.handle.bind(cacher), (req : any, res : any)=>{
    res.json(true);
});

app.get('/express/:id', cacher.handle.bind(cacher), (req : any, res : any)=>{
    res.json(true);
});

app.post('/express', cacher.handle.bind(cacher), (req : any, res : any)=>{
    res.json(true);
});

app.listen(3333, ()=>console.log("Express: Running Server"));