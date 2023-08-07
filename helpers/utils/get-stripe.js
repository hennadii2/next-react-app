import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null

const getStripePromise = (stripePublicKey) => {
	if (!stripePublicKey) {
		return null;
	}

	if (!stripePromise) {
		stripePromise = loadStripe(stripePublicKey)
	}
	return stripePromise
}

export default getStripePromise
