import Base64 from 'Base64'
// const fetch = require('node-fetch')

const btoa = (s) => {
    return Base64.btoa(s)
    // return Buffer.from(s).toString('base64')
}

class API {

    static url = process.env['API_URL'] || 'http://localhost:3000'
    static stripeKey = process.env['STRIPE_KEY'] || ''

    static async findById(id) {
        const response = await fetch(`${this.url}/scooters/${id}`)
        if (response.ok) return response.json()
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
        let encodedKey = btoa(this.stripeKey)
        let body = []

        let details = req

        for (var property in details) {
            var ek = encodeURIComponent(property);
            var ev = encodeURIComponent(details[property]);
            body.push(ek + "=" + ev);
        }
        body = body.join("&")
        console.log(body)
        let res = await fetch('https://api.stripe.com/v1/tokens',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Authorization': `Basic ${encodedKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body
            }
        )
        console.log(res)
        if(res.ok) return res
        throw new Error(res)
    }

    static async getStripeToken(token_id) {
        let encodedKey = btoa(this.stripeKey)

        let res = await fetch(`https://api.stripe.com/v1/tokens/${token_id}`,
            {
                headers: {
                    'Authorization': `Basic ${encodedKey}`,
                }
            }
        )
        if(res.ok) return res
        throw new Error(res)
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

    static async stopRide(transactionId) {
        if (!transactionId) throw new Error('`transactionId` is required to stop a ride')

        let res = await fetch(`${this.url}/transactions/${transactionId}`, {
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