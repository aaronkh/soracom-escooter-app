class API {

    static url = process.env['API_URL'] || 'http://localhost:3000'

    static getScooters(cb){
        fetch(`${url}/scooters`)
        .then((res) => res.json())
        .then((responseJson) => {
            cb(null, responseJson)
        })
        .catch((err) => {
            cb(err, null)
        })
    }

    static startRide(req, cb){
        if(!req.token) throw new Error('Stripe credit card `token` is required to start a ride')
        if(!req.mac) throw new Error('`scooterId` is required to start a ride')

        fetch(`${url}/transactions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        })
        .then((res) => res.json())
        .then((responseJson) => {
            cb(null, responseJson)
        })
        .catch((err) => {
            cb(err, null)
        })
    }

    static stopRide(req, cb){
        if(!req.transactionId) throw new Error('`transactionId` is required to stop a ride')

        fetch(`${url}/transactions/${req.transactionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((responseJson) => {
            cb(null, responseJson)
        })
        .catch((err) => {
            cb(err, null)
        })
    }
}
