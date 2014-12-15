var express = require('express')
var mongoose = require('mongoose')
var router = express.Router()

var QUERIES = [
  "course_id", "code", "department", "division", "campus", "term", "section",
  "term", "postrequisite", "tutorials", "breadth", "time", "instructor",
  "location", "size", "rating", "testq"
]

var KEYMAP = {
  "id": "course_id",
  "code": "code",
  "name": "name",
  "description": "description",
  "division": "division",
  "department": "department",
  "prerequisites": "prerequisites",
  "exclusions": "exclusions",
  "course_level": "course_level",
  "breadth": "breadth",
  "campus": "campus",
  "term": "term",
  "apsc_elec": "apsc_elec",
  "meeting_code": "meeting_sections.code",
  "instructors": "meeting_sections.instructors",
  "day": "meeting_sections.times.day",
  "start": "meeting_sections.times.start",
  "end": "meeting_sections.times.end",
  "location": "meeting_sections.times.location",
}

var timesSchema = new mongoose.Schema({
  day: String,
  start: String,
  end: String,
  location: String
})

var meetingSchema = new mongoose.Schema({
  code: String,
  instructors: [String],
  times: [timesSchema]
})

var courseSchema = new mongoose.Schema({
  course_id: String,
  code: String,
  name: String,
  description: String,
  division: String,
  prerequisites: String,
  exlusions: String,
  course_level: String,
  breadth: [Number],
  campus: String,
  term: String,
  apsc_elec: String,
  meeting_sections: [meetingSchema]
})

var courses = mongoose.model("courses", courseSchema)

router.get('/:id', function(req, res) {
  if (req.params.id != undefined && req.params.id != "") {
    var search = {}
    search['course_id'] = req.params.id;
    courses.find(search, function(err, docs) {
      res.json(docs)
    })
  } else {
    res.send(403)
  }
})

router.get('/', function(req, res) {

  var search = {}

  var query = req.query
  var clean = true

  queries = 0

  for (var key in query) {

    key = key.toLowerCase()

    if (QUERIES.indexOf(key) > 0) {

      queries++

      search[KEYMAP[key]] = {
        $regex: "(?i).*" + query[key] + ".*"
      }

    } else {
      res.send(403)
    }

  }

  if(queries > 0) {
    courses.find(search, function(err, docs) {
      res.json(docs)
    })
  } else {
    res.send(403)
  }

})

/**
 * Do fancy things
 * :)
 */
var testFunc = function() {
  res.send(200)
}



module.exports = router
