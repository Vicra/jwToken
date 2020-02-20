const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const config = require('./config/config')
const dbManager = require('./app/db/dbmanager')

const dbService = new dbManager("wepapi");

// otro comentario
const userService = require('./app/services/userService')

app.set('llave', config.llave);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const validarToken = express.Router();
validarToken.use((req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, app.get('llave'), (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            mensaje: 'Token no proveída.'
        });
    }
});

app.get('/', validarToken, getProductos)

app.post('/login', login)

async function login(req, res) {
    let response = {
        success: true,
        message: 'success',
        code: 200,
        data: []
    }

    if (await userService.isValidUser(req.body)) {
        const payload = {
            check: true
        };
        const token = jwt.sign(payload, app.get('llave'), {
            expiresIn: "12h"
        });

        response.data = token;
        res.status(response.code).send(response);
    }
    else {
        response.code = 401;
        res.status(response.code).send(response);
    }
}
async function getProductos(req, res) {
    const SQL = `select * from productos`;
    const response = await dbService.execute('wepapi', SQL);
    // console.log(response);
    res.send(response);
}

// getProductos();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`)
})