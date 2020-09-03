import express from 'express';
import redis from 'redis';
import cacher from '../lib';

const app = express();

const cacherMidlleWare = cacher({
    redis : redis.createClient()
});

app.get('/express', cacherMidlleWare.handle, (req : any, res : any)=>{
    res.json({'resultado' : ['laranja', 'banana', 'tamara']});
});

app.get('/express/:id', cacherMidlleWare.handle, (req : any, res : any)=>{
    res.json(true);
});

app.post('/express', cacherMidlleWare.handle, (req : any, res : any)=>{
    res.json(true);
});

app.listen(3333, ()=>console.log("Express: Running Server"));