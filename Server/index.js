const express = require('express')
const app = express()
const port = 3001

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*--------------------------------------------------------------*/
var fs = require('fs');
const bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const fileName = 'thankYous.json';

app.get("/load", (req, res) => {
    console.log('Loading...');   
    res.status(200).json(fs.readFileSync(fileName, 'utf8'));
});

app.post("/save", (req, res) => {
    console.log('Saving...', req.body);
    fs.writeFileSync(fileName, JSON.stringify(req.body), 'utf8'), (result) => {
        req.send(result);
        console.log('Saving complete!');
    };
});