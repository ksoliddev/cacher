import express from 'express';
import redis from 'redis';
import cacher from '../lib';

const app = express();

const cacherMidlleWare = cacher({
    redis : redis.createClient()
});

var fruits = ['laranja', 'banana', 'tamara'];
app.get('/express', cacherMidlleWare.handle, (req : any, res : any)=>{
    res.json({'resultado' : fruits});
});

app.get('/express/:id', cacherMidlleWare.handle, (req : any, res : any)=>{
    res.json({'resultado' : fruits[req.params.id]});
});

app.post('/express', cacherMidlleWare.handle, (req : any, res : any)=>{
    if(req.body.fruit){
        fruits.push(req.body.fruit);
        res.json("INSERIDO COM SUCESSO!");
    }
});

app.put('/express', cacherMidlleWare.handle, (req : any, res : any)=>{
    if(req.body.fruit){
        fruits.push(req.body.fruit);
    }
    res.json("INSERIDO COM SUCESSO!");
});

app.patch('/express', cacherMidlleWare.handle, (req : any, res : any)=>{
    if(req.body.fruit){
        fruits.push(req.body.fruit);
    }
    res.json("INSERIDO COM SUCESSO!");
});

app.delete('/express/:id', cacherMidlleWare.handle, (req : any, res : any)=>{
    fruits = fruits.filter((fr : any, idx : number) => idx !== parseInt(req.params.id) );
    res.json("ELIMINADO COM SUCESSO!");
});

app.listen(3333, ()=>console.log("Express: Running Server"));