const fetch = require('node-fetch')

import API from '../API'

const STRIPE_TESTING_CARD = '4242424242424242'
const STRIPE_TOKEN = 'tok_visa'

beforeAll(() => {
    jest.setTimeout(20000)
    API.url = "https://1quzdoxmh3.execute-api.us-east-1.amazonaws.com/dev"
})
// afterAll(() => {API.clear()})

describe('url as env var', () => {
    it('imported process.env[\'API_URL\']', () => {
        console.log(`url is`, API.url)
        expect(process.env['API_URL']).toBeDefined()
    })
})

describe('API imported', () => {
    it('API functions all present', () => {
        expect(API.getScooters).toBeDefined()
        expect(API.startRide).toBeDefined()
        expect(API.stopRide).toBeDefined()
        expect(API.clear).toBeDefined()
    })
})


// describe('add scooters', () => {
//     it('try one scooter', async () => {
//         await API.create()
//             .then(r => expect(r).toBeDefined())
//             .catch(e => fail(e))
//     })
// })
// get scooters
describe('get scooters', () => {
    it('get scooter list', async () => {
        let res = await API.getScooters()
        // let json = await res.json()
        for(let i of res){
            i.a = 1
            console.log(i)
            
        }
        expect(res).toBeDefined()

    })
})


// stripe testing
describe('get card token', () => {
    it('try getting a token', async () => {
        let res = await API.createStripeToken()
        let json = await res.json()
        expect(json).toBeDefined()
        const token = json['id']
        expect(token).toBeDefined()
        expect(token.startsWith('tok_')).toBe(true)
    })
})


// stop ride