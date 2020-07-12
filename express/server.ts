import express from 'express';
import cacher from '../lib';

const app = express();

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