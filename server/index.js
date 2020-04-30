import express from 'express';
import sockjs  from 'sockjs';
import bodyParser from 'body-parser';
import path from 'path';


const app = express();
app.use(bodyParser.json());

let clients = [];

const messages = [];




let connection;
const echo = sockjs.createServer({ prefix:'/echo' });
echo.on('connection', function(conn) {
    connection = conn;
   clients.push(conn);
    conn.on('close', function() {
        clients = clients.filter(cl => cl !== conn);
    });
});
const isProd = !!process.env.PORT;
app.get('*', (req, res, next) => {
    if (isProd && req.headers['x-forwarded-proto'] === 'http') {
        res.redirect('https://' + req.headers.host + req.url);
    } else {
        next();
    }
})


app.use('/largeFiles', (req, res) => {
    console.log('largeFile', req.url);
    res.sendFile(`${path.resolve('.')}/largeFiles/${req.url}`);
});

app.use('/images', express.static('images'));

app.post('/api/message', (req, res) => {
    const message = req.body;
    message.timeStamp = Date.now();
    messages.push(message);
    if (clients) {
        clients.forEach(client => client.write(JSON.stringify(message)))
    }
    res.status(200).send(message);
});

app.post('/api/clear', (req, res) => {
    messages.length = 0;
    res.status(200).send(messages);

})

app.get('/api/messages', (req, res) => {
    res.status(200).send(messages);
})


app.use('/node_modules', express.static('node_modules'));

app.use('/', express.static('client'))

const port = process.env.PORT || 8080
const server  = app.listen(port, () => {
    console.log('I am listening on port', port)
})

echo.installHandlers(server, {prefix:'/echo'});

