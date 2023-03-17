const { db } = require('../firebase');
const stripeAPI = require('../stripe');

async function createCustomer(userId) {
	const userSnapshot = await db.collection('users').doc(userId).get();
	const { email } = userSnapshot.data();
	const customer = await stripeAPI.customers.create({
		email,
		metadata: { firebaseUID: userId },
	});
	await userSnapshot.ref.update({ stripeCustomerId: customer.id });
	return customer;
}

async function getCustomer(userId) {
	const userSnapshot = await db.collection('users').doc(userId).get();
	const { stripeCustomerId } = userSnapshot.data();
	if (!stripeCustomerId) {
		return createCustomer(userId);
	} else {
		customer = await stripeAPI.customers.retrieve(stripeCustomerId);
		return customer;
	}
}

module.exports = getCustomer;
