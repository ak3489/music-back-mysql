var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Music = mongoose.model('Music');

router.post('/addMusic', function (req, res, next) {
    const musicName = req.body.musicName;
    const createDate = Date.now();

    var music = new Music({
        musicName: musicName,
        createDate: createDate
    });
    console.log(`Adding a new music ${musicName} - createDate ${createDate}`)

    music.save()
        .then(() => {
            console.log(`Added new music ${musicName} - createDate ${createDate}`)
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
            res.send('Sorry! Something went wrong.');
        });
});

module.exports = router;
