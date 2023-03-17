const getCustomer = require('../helpers/getCustomer');
const stripeAPI = require('../stripe');

async function updatePaymentIntent(req, res) {
	const {
		currentUser,
		body: { paymentIntentId },
	} = req;
	const customer = await getCustomer(currentUser.uid);
	let paymentIntent;
	try {
		paymentIntent = await stripeAPI.paymentIntents.update(paymentIntentId, {
			customer: customer.id,
		});
		res.status(200).json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'Unable to update payment intent' });
	}
}

module.exports = updatePaymentIntent;
