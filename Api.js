import base64 from 'react-native-base64'
import stripe from 'tipsi-stripe'

class API {

    static url = process.env['API_URL'] || 'http://localhost:3000'
    static stripeKey = process.env['STRIPE_KEY'] || ''

    static async findById(id) {
        const response = await fetch(`${this.url}/scooters/${id}`)
        if (response.ok) return response
        throw new Error(response)
    }

    static async clear() {
        const response = await fetch(`${this.url}/clear`)
        if (response.ok) return response
        throw new Error(response)
    }

    // static async create(scooter) {
    //     scooter = Object.assign({
    //         mac: Math.round(Math.random() * 999999),
    //         coords: {
    //             lat: 37.74 + Math.random() * 0.02 - 0.01,
    //             lng: -122.415 + Math.random() * 0.02 - 0.01
    //         },
    //         battery: 60,
    //         speed: 0
    //     }, scooter)
    //     const response = await fetch(`${this.url}/scooters`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(scooter)
    //         })
    //     if (response.ok) return response
    //     throw new Error(response)
    // }

    static async getScooters() {
        let res = await fetch(`${this.url}/scooters`)
        if (res.ok) return res.json()
        throw new Error(res)
    }

    static async createStripeToken(req) {
        stripe.setOptions({
            publishableKey: this.stripeKey,
        })
        try {
            return await stripe.createTokenWithCard({
                number: req.number,
                expMonth: req.month,
                expYear: req.year,
                cvc: req.cvc
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    static async startRide(req) {
        if (!req.token) throw new Error('Stripe credit card `token` is required to start a ride')
        if (!req.mac) throw new Error('`scooterId` is required to start a ride')

        let res = await fetch(`${this.url}/transactions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        })
        if (res.ok) return res.json()
        throw new Error(res)
    }

    static async stopRide(req) {
        if (!req.transactionId) throw new Error('`transactionId` is required to stop a ride')

        let res = await fetch(`${this.url}/transactions/${req.transactionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (res.ok) return res.json()
        throw new Error(res)
    }
}
export default API