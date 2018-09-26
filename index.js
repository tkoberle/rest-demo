let Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const bikes = [
    {id:1,model:'Zaskar',make:'GT',year:'1998',type:'mtb'},
    {id:2,model:'Stumpjumper',make:'S-Works',year:'2008',type:'mtb'},
    {id:3,model:'Cross Pro',make:'Cube',year:'2017',type:'cross'}
];

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

/****************************************
 *              GETS
 */
app.get('/',(req,res) => {
    res.send('Hello world');
});

app.get('/api/bikes',(req,res) => {
    res.send(bikes);
});

app.get('/api/bikes/:id',(req,res) => {
    const bike = bikes.find(bike => bike.id===parseInt(req.params.id));

    if(bike)
        res.send(bike);
    else
        res.status(404).send(`Bike with id ${req.params.id} was not found`);
});

/****************************************
 *              POSTS
 */

app.post('/api/bikes',(req,res) => {
    const {error} = ValidateBike(req.body);
    if(error){
        // let msg = `Body of the request has errors: ${validationResult.error.details[0].message}`;
        let msg = `Body of the request has errors: ${error}`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    const newBike = {
        id:bikes.length+1,
        model:req.body.model,
        make:req.body.make,
        year:req.body.yeah,
        type:req.body.type};
    
    bikes.push(newBike);
    res.send(newBike);
    console.log('Added new bike '+newBike);
});

/****************************************
 *              PUTS
 */

 app.put('/api/bikes/:id',(req,res) => {
    console.log('Looking up bike with id = '+req.params.id);
    const bike = bikes.find(bike => bike.id===parseInt(req.params.id));
    if(!bike){
        return res.status(404).send('Unable to find bike with id = '+ req.params.id);
    }

    const {error} = ValidateBike(req.body);
    if(error){
        return res.status(440).send(error.message);
    }

    bike.make = req.body.make;
    bike.model = req.body.model;
    bike.year = req.body.year;
    bike.type = req.body.type;
    res.send(bike);
 })

/****************************************
 *              DELETES
 */

app.delete('/api/bikes/:id',(req,res) => {
    const bike = bikes.find(bike => bike.id===parseInt(req.params.id));
    if(!bike){
        return res.status(404).send('Unable to find bike with id = '+ req.params.id);
    }

    const index = bikes.indexOf(bike);
    console.log(`Removing bike index ${bike} @ index ${index}`)
    bikes.splice(index,1);

    res.send(bike);
})

function ValidateBike(bikeBody)
{
    const bikeSchema = {
        model: Joi.string().min(3).required(),
        make: Joi.string().min(3).required(),
        year: Joi.string().min(4).max(4).required(),
        type: Joi.string().min(3).required() 
    };

    return Joi.validate(bikeBody,bikeSchema);
}
