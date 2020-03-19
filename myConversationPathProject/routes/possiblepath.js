var express = require('express');
var router = express.Router();
const path = require("path");
const fs = require('fs');
/*
 "id": "LUU",
    "text": "Can I tell you something?",
    "replies": "sure",
    "payloads": "",
    "routes": "PGG",
    "tag": "labels-start",
    "lesson": "labels",
    "stage": ""
*/
pathFolder = path.resolve(__dirname, "../res/")
let computedPaths = {}
/*
Pre-compute paths for performance reasons. Better way to implement.
*/
// preComputePaths()
// console.log(computedPaths)
//cache
function preComputePaths() {
    console.log("in preComputePaths ")
    var lessons = fs.readdirSync(path.resolve(__dirname, "../res/"))
    console.log(lessons)
    lessons.forEach(function (lesson) {
        let paths = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../res/" + lesson)));
        lesson = lesson.split(".json")[0]
        let start = lesson + "-start"
        // console.log(compute(paths, start))
        computedPaths[lesson] = compute(paths, start)
    })
}

/*
compute the map with possible routes as values.
*/
function compute(paths, start) {
    let mappedArr = {}
    console.log(start)
    //  let pathObjRoot
    for (let pathId in paths) {
        pathObj = paths[pathId]
        mappedArr[pathId] = pathObj
        if (pathObj.tag == start) {
            pathObjRoot = pathObj
        }
    }
    console.log(pathObjRoot)

    // compute_(pathObjRoot, mappedArr, result, flow)
    //  console.log(result)
    return [pathObjRoot, mappedArr]
}

/*
recursive function to compute possible paths
*/
function compute_(pathObj, mappedArr, result, flow) {

    if (!pathObj) {
        result.push(flow)
        return
    } else {
        flow.push(pathObj.id)
    }
    routesArr = pathObj.routes.split("|")
    // console.log(pathObj.id)
    console.log(routesArr)
    routesArr.forEach(function (route) {

        pathObj = mappedArr[route]
        // console.log(pathObj)
        compute_(pathObj, mappedArr, result, flow)
    });
}

/* enter the route */
router.get('/', function (req, res, next) {
    let lesson = req.query.lesson;
    console.log(lesson)

    let paths = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../res/" + lesson + ".json")));
    let start = lesson + "-start"
    //tag=bye
    retVal = compute(paths, start)
    let result = []
    let flow = []
    compute_(retVal[0], retVal[1], result, flow)
    res.send(result)
});


// POST http://localhost:8080/api/users
// parameters sent with 


module.exports = router;
