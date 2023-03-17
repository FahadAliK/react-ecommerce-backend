require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const createCheckoutSession = require('./api/checkout');
const webhook = require('./api/webhook');
const paymentIntent = require('./api/paymentIntent');
const decodeJWT = require('./auth/decodeJWT');
const validateUser = require('./auth/validateUser');
const setupIntent = require('./api/setupIntent');
const getCards = require('./api/getPaymentMethods');
const updatePaymentIntent = require('./api/updatePaymentIntent');

const app = express();
const port = 8080;

// app.use(cors({ origin: true }));
app.use(cors());

app.use(
	express.json({ verify: (req, res, buffer) => (req['rawBody'] = buffer) })
);

app.use(decodeJWT);

app.get('/', (req, res) => {
	res.send('Hello world.!');
});

app.post('/create-checkout-session', createCheckoutSession);

app.post('/create-payment-intent', paymentIntent);

app.put('/update-payment-intent', validateUser, updatePaymentIntent);

app.post('/save-payment-method', validateUser, setupIntent);

app.get('/get-payment-methods', validateUser, getCards);

app.post('/webhook', webhook);

app.listen(port, () => {
	console.log('Server listening on port ', port);
});
