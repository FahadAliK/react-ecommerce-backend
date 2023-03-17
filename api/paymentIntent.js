const stripeAPI = require('../stripe');

function calculateOrderAmount(cartItems) {
	return cartItems.reduce(
		(total, product) => total + product.price * product.quantity,
		0
	);
}

async function paymentIntent(req, res) {
	const { cartItems, description, receipt_email, shipping } = req.body;
	let paymentIntent;

	try {
		paymentIntent = await stripeAPI.paymentIntents.create({
			amount: calculateOrderAmount(cartItems),
			currency: 'usd',
			description,
			payment_method_types: ['card'],
			receipt_email,
			shipping,
		});
		const { client_secret, id } = paymentIntent;
		res.status(200).json({ clientSecret: client_secret, paymentIntentId: id });
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'An error occured, unable to create payment intent.',
		});
	}
}

module.exports = paymentIntent;
