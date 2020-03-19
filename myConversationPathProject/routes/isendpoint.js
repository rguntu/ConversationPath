var express = require('express');
var router = express.Router();
const path = require("path");
const fs = require('fs');

/* enter the route */
router.get('/', function (req, res, next) {
    var lesson = req.query.lesson;
    var pathid = req.query.pathid;
    let paths = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../res/" + lesson + ".json")));

    let mappedArr = {}
    ret = compute(pathid, paths, mappedArr)
    if (ret) res.send(ret)
    else {
        ret = compute_(pathid, mappedArr)
        res.send(ret)
    }
});

/*
compute if endpoint is in one of the parent hirarchy.
*/
function compute_(pathId, retMap) {
    if (!pathId) return false
    parents = retMap[pathId]
    //"stage" = "endpoint"
    if (!parents)
        return false
    for (index in parents) {
        parent_ = parents[index]
        if (parent_.stage == 'endpoint') {
            return true
        }
        else return compute_(parent_.id, retMap)

    }
    return false
}

/*
return if current pathid is endpoint.
compute map of the paths with possible parents as values.
*/
function compute(pathid_, paths, mappedArr) {
    console.log("pathid")
    console.log(pathid_)

    for (let pathid in paths) {
        if (pathid_ == pathid && paths[pathid].stage == 'endpoint') {
            return true
        }
        pathObj = paths[pathid]
        routesArr = pathObj.routes.split("|")
        routesArr.forEach(function (route) {
            if (!mappedArr[route]) {
                mappedArr[route] = []
            }
            mappedArr[route].push(paths[pathid])
        });
    }
    return false
}


module.exports = router;
