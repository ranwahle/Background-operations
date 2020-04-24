import express from 'express';
import sockjs  from 'sockjs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

let clients = [];

let connection;
const echo = sockjs.createServer({ prefix:'/echo' });
echo.on('connection', function(conn) {
    connection = conn;
   clients.push(conn);
    conn.on('close', function() {
        clients = clients.filter(cl => cl !== conn);
    });
});

app.use('/images', express.static('images'));

app.post('/api/message', (req, res) => {
    if (clients) {
        clients.forEach(client => client.write(JSON.stringify(req.body)))

    }
    res.status(200).send(req.body);
})
app.use('/node_modules', express.static('node_modules'));

app.use('/', express.static('client'))




const server  = app.listen('8080', () => {
    console.log('I am listening')
})

echo.installHandlers(server, {prefix:'/echo'});

