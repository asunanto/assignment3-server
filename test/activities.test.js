const request = require('supertest')
const Activity = require('../models/activity')
const User = require('../models/user')

let server
let token

describe('/activities', () => {
  beforeEach(() => { 
  server = require('../app')
  })
  afterEach(async() => { 
    server.close() 
    await Activity.remove({})
    await User.remove({})
    // clears db after assertions
  })
  
 

  describe('GET /', () => {

    it('should return all activities', async() => {
      await Activity.collection.insertMany([
        {
          "_id": "5c4fc7f8e0662217728fac96",
          "title": "campfire brownies",
          "description": "campfire brownies activity description",
          "ageLevel": {
              "_id": "5c490e484ec6471df76bdc94",
              "name": "Brownies"
          },
          "user": {
              "name": {
                  "firstname": "Brownie 1",
                  "lastname": "user",
                  "guidename": "user"
              },
              "_id": "5c4ab72434ce0d1446585281"
          },
          "category": "category 1",
          "length": "20"
        },
        {
          "_id": "5c4fd80f8f9f8f1778cd3449",
          "title": "brownies science activity",
          "description": "brownies science activity description",
          "ageLevel": {
              "_id": "5c490e484ec6471df76bdc94",
              "name": "Brownies"
          },
          "user": {
              "name": {
                  "firstname": "Brownie 1",
                  "lastname": "user",
                  "guidename": "user"
              },
              "_id": "5c4ab72434ce0d1446585281"
          },
          "category": "category 2",
          "length": "30"
        }

      ])
      const res = await request(server).get('/activities')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      // some() method tests whether at least one element in the array passes the test 
      expect(res.body.some(activity => activity.title === 'campfire brownies')).toBeTruthy()
      expect(res.body.some(activity => activity.title === 'brownies science activity')).toBeTruthy()
    })
  })
  
  describe('GET /:id', () => {
    it('should return an activity if a valid id is passed', async() => {
      const activity = new Activity({
        "_id": "5c4fc7f8e0662217728fac96",
          "title": "campfire brownies",
          "description": "campfire brownies activity description",
          "ageLevel": {
              "_id": "5c490e484ec6471df76bdc94",
              "name": "Brownies"
          },
          "user": {
              "name": {
                  "firstname": "Brownie 1",
                  "lastname": "user",
                  "guidename": "user"
              },
              "_id": "5c4ab72434ce0d1446585281"
          },
          "category": "category 1",
          "length": "20"
      })
      await activity.save()

      const res = await request(server).get('/activities/' + activity._id)
      expect(res.status).toBe(200)
      // expect(res.body).toMatchObject(activity)
      expect(res.body).toHaveProperty('title', activity.title)
    })
  })

  describe('GET /:id', () => {
    it('should return 404 if an invalid id is passed', async() => {
      const res = await request(server).get('/activities/1')
      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
     // sub-routine to parse request
    let activity

    beforeEach( async()=> {
      const auth = await request(server)
      .post('/auth/register')
      .send({
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
      })
      token = JSON.parse(auth.text).token
      activity = {
        "title": "campfire brownies",
        "description": "campfire brownies activity description",
        "ageLevel": {
            "_id": "5c490e484ec6471df76bdc94",
            "name": "Brownies"
        },
        "category": "category 1",
        "length": "20"
      }
    })

    const exec = async() => {
      return await request(server).post('/activities')
      .set('Authorization', 'Bearer ' + token)
      .send(activity)
    }

    it('should return 401 if client is not logged in', async() => {
      token = ''  //no auth
      const res = await exec()
      expect(res.status).toBe(401)
    })

    
    it('should return 200 with valid token along with posted activity ', async() => {  
      const res = await exec()
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('title', activity.title)
    })

    it('should be able to find posted activity ', async() => {  
      await exec()
      const findActivity = await Activity.find({title:"campfire brownies"})
      expect(findActivity).not.toBeNull()
    })

    it('should return 400(BAD REQ) with invalid length property in activity ', async() => {  
      activity.length = "sjaojaso" //non -numeric input
      const res = await exec()
      expect(res.status).toBe(400)
    })
  })
  
})

