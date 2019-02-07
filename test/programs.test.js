const request = require('supertest')
const Program = require('../models/program')
const User = require('../models/user')

let server

const user = {
    "email": "gumnuts1@mail.com",
    "password": "user123",
    "name": {
      "firstname": "Gumnuts 1",
      "lastname": "user",
      "guidename": "user"
    },
    "membershipNo": "22222222",
    "phone": "2965248485",
    "unit": {
      "_id": "5c4a6dc84440e10bbdbf6041",
      "name": "Gumnuts 1"
    }
  }

const programs = [{
    "_id": "5c4fcefae0662217728facbf",
    "name": "Brownies 1 Program",
    "description": "Brownies 1 Program Description",
    "date": "2019-01-20",
    "unit": {
        "_id": "5c4a6dc83ba8ccb52f30c0fd",
        "name": "Brownies 1"
    },
    "length": 120,
    "user": {
        "name": {
            "firstname": "Brownie 1",
            "lastname": "user",
            "guidename": "user"
        },
        "_id": "5c4ab72434ce0d1446585281"
    },
    "activities": [
        {
            "_id": "5c4fc7f8e0662217728fac96"
        },
        {
            "_id": "5c4fcceee0662217728facb7"
        }
    ]
  },
  {
    "_id": "5c4fd9de1f2c532030e8f877",
    "name": "Gumnuts 1 Program 1",
    "description": "Gumnuts 1 Program 1 Description 1",
    "date": "2019-01-10",
    "unit": {
        "_id": "5c4a6dc84440e10bbdbf6041",
        "name": "Gumnuts 1"
    },
    "length": 120,
    "user": {
        "name": {
            "firstname": "Gumnuts 1",
            "lastname": "user",
            "guidename": "user"
        },
        "_id": "5c4fcb9ae0662217728faca0"
    },
    "activities": [
        {
            "_id": "5c4fcc11e0662217728facb1"
        },
        {
            "_id": "5c4fcbe4e0662217728faca5"
        }
    ]
  }]

describe('/programs', () => {
  beforeEach(() => { 
    server = require('../app')
  })
  afterEach(async() => { 
    server.close() 
    await Program.remove({})
    await User.remove({})
    // clears db after assertions
  })
  describe('GET /', () => {

  it ('should return an array of programs', async()=>{
      await Program.collection.insertMany(programs)
      let res = await request(server).get('/programs')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      for (i in res.body) {
        res.body[i]._id = res.body[i]._id.toString()
        expect(res.body[i]).toMatchObject(programs[i])
      }      
    })
  })

  describe('GET /:id', () => {
    it('should return an activity if a valid id is passed', async() => {
      const program = new Program(programs[0])
      await program.save()

      let res = await request(server).get('/programs/' + program._id)
      expect(res.status).toBe(200)
      expect(res.body.program._id).toEqual(program._id.toString())
    })
  })

  describe('POST /', () => {
    let program
    let token
    beforeEach( async()=> {
      const auth = await request(server) //register user
      .post('/auth/register')
      .send(user)
      token = JSON.parse(auth.text).token //gets token
      program = {
        "_id": "5c4fcefae0662217728facbf",
        "name": "Brownies 1 Program",
        "description": "Brownies 1 Program Description",
        "date": "2019-01-20",
        "unit": {
            "_id": "5c4a6dc83ba8ccb52f30c0fd",
            "name": "Brownies 1"
        },
        "length": 120,
        "activities": [
            {
                "_id": "5c4fc7f8e0662217728fac96"
            },
            {
                "_id": "5c4fcceee0662217728facb7"
            }
        ]
      }
    })

    const exec = () => {
      return request(server).post('/programs')
      .set('Authorization', 'Bearer ' + token)
      .send(program)
    }
    it('should return 401 if client is not logged in', async() => {
        token = ''  //no auth
        const res = await exec()
        expect(res.status).toBe(401)
    })

    it('should return 200 with valid token along with posted program ', async() => {  
        const res = await exec()
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('name', program.name)
    })
  
    it('should be able to find posted program ', async() => {  
      await exec()
      const findProgram = await Program.find({name:"Brownies 1 Program"})
      expect(findProgram).not.toBeNull()
    })


  })
  

  
})