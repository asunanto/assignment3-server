const express = require('express');
const AgeLevel = require('../models/agelevel');
const router = express.Router();
const Activity = require('../models/activity')

// const {
//     requireJwt
// } = require('../middleware/auth')



// GET /bookmarks (R)
router.get('/', (req, res) => {
    AgeLevel.find().then(
        agelevels => res.json(agelevels)
    ).catch(
        error => res.status(500).json({
            error: error.message
        })
    )
})

router.get('/:id/activities',async (req,res) => {
    const agelevel = await AgeLevel.findById(req.params.id)
    if (!agelevel) res.json({error: "Age level id not found"})
    const activity = await Activity.find({"ageLevel":agelevel})
    if (!activity) res.json({error: "no activity found for this age level"})
    res.json(activity)
})
// Only allow registered users to post and delete bookmarks
// router.use(requireJwt)


// POST /bookmarks (C)
router.post('/', (req, res) => {
    // const bookmark = new Bookmark({ title: req.body.title, url: req.body.url })
    // bookmark.save()
    AgeLevel.create(req.body).then(
        agelevel => res.send(agelevel)
    ).catch(
        error => res.status(500).json({
            error: error.message
        })
    )
})

// DELETE /bookmarks/:id (D)
router.delete('/:id', (req, res) => {
    AgeLevel.findByIdAndRemove(req.params.id).then(
        () => res.send(204)
    ).catch(
        error => res.status(500).json({
            error: error.message
        })
    )
})



module.exports = router