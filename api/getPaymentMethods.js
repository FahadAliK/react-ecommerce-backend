const getCustomer = require('../helpers/getCustomer');
const stripeAPI = require('../stripe');

async function getCards(req, res) {
	const { currentUser } = req;
	const customer = await getCustomer(currentUser.uid);
	let cards;
	try {
		cards = await stripeAPI.paymentMethods.list({
			customer: customer.id,
			type: 'card',
		});
		res.status(200).json(cards.data);
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'An error occured, unable to get cards.' });
	}
}

module.exports = getCards;
