class API {

	static url = process.env['API_URL'] || 'http://localhost:3000'

	static getScooters(cb){
		cb(fetch(`${url}/scooters`))
	}

	static startRide(req, cb){
		if(!req.token) throw new Error('Stripe credit card `token` is required to start a ride')
		if(!req.scooterId) throw new Error('`scooterId` is required to start a ride')

		cb(fetch(`${url}/transactions/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(req)
		}))
	}

	static stopRide(req, cb){
		if(!req.transactionId) throw new Error('`transactionId` is required to stop a ride')

		cb(fetch(`${url}/transactions/${req.transactionId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			}
		}))
	}
}