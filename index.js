const express = require('express');
const app = express();

function isPrime(num) {
    for (let i = 2; i < num; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

function getRandomInt() {
    let max = 1000;
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomPrimeNumber() {
    let x = getRandomInt();
    while (!isPrime(x)) {
        x = getRandomInt();
    }
    return x;
}

const p = getRandomPrimeNumber();
const g = getRandomPrimeNumber();
console.log({
    P: p,
    G: g
});

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/getPublicKeys', (req, res) => {
    console.log({
        P: p,
        G: g
    });
    res.json({ P: p, G: g });
});

let server = app.listen(process.env.PORT || 3000);

console.log(server);

const io = require('socket.io')(server);

let key = [];

io.on('connection', (socket) => {
    console.log('someone connected');
    socket.on('key', (res) => {
        key.push(res);
        io.emit('exc', key);
    });
    socket.on('disconnect', () => {
        console.log('someone disconnected');
    });
});