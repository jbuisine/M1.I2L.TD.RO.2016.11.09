/**
 * Created by jbuisine on 09/02/17.
 */

var app = require('./../../app');
var io = app.io;

var express = require('express');
var router = express.Router();
var utilities = require('./../utilities');
const spawn = require('child_process').spawn;

const albumsPath = './views/albums/';

const solsPath = './../resources/solutions/';
const albumsTypePath = './../resources/data/albums-type/';
const buildAlbumFile = './../utilities/buildAlbum.py';
const classPathUtils = './../utilities/compile:./../utilities/lib/json-simple-1.1.1.jar';

router.get('/solution', function (req, res) {
    res.render('index', {
        page: "solution",
        albums: utilities.getDirectories(albumsPath),
        albumsType: utilities.getFiles(albumsTypePath)
    });
});


router.post('/create-solution', function (req, res) {

    console.log(req.body)


    var solutionScript = spawn('scala', ['-cp', classPathUtils, 'MainWebApp', JSON.stringify(req.body)]);

    solutionScript.stdout.on('data', function (data) {
        io.sockets.emit('generationProgress', { solFile: req.body.solutionFile, percent: data.toString() });
        console.log('stdout: ' + data.toString());
    });

    solutionScript.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
    });

    solutionScript.on('close', function(code) {
        io.sockets.emit('generationFinished', { solFile: req.body.solutionFile });
        res.contentType('text/html');
        res.send('Finished');
    });
});

router.post('/solution-ILS', function (req, res) {

});

router.post('/solution-EA', function (req, res) {

});

router.post('/solution-PLS', function (req, res) {

});

router.post('/solution-MOEAD', function (req, res) {

});

module.exports = router;