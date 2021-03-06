var express = require('express');
var router = express.Router();
var events = require('../db/controllers/eventCtrl');
var auth = require('../authHelper');
var timerService = require('../../timer/client');

timerService.initialize();

//Get all events
router.get('/', auth.isAuth, (req, res, next) => {
  if (req.query.username) {
    events.getUserEvents(req.query.username)
      .then(results => res.json(results))
      .catch(err => {
        console.log(err);
        next(err);
      });
  } else {
    events.getEvents(req.user.username)
      .then(results => res.json(results))
      .catch(err => {
        console.log(err);
        next(err);
      });
  }
});

//Get an event by id
router.get('/:id', auth.isAuth, (req, res, next) => {
  events.getEventById(req.params.id)
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.post('/', auth.isAuth, (req, res, next) => {

  events.createEvent(req.user.id, req.body)
    .then(id => {
      // trigger creation of timers
      timerService.sendEvent({ id: id, end: req.body.end });
      res.status(201).json(id);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.put('/:id', (req, res, next) => {

  var eventId = req.params.id;

  if (req.query.safe) {

    timerService.alertSafe(eventId);
    res.json(eventId);

  } else if (req.query.danger) {

    timerService.alertDanger(eventId);
    res.json(eventId);

  } else {

    events.updateEventById(req.params.id, req.body)
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
      next(err);
    });
  }
});

router.delete('/:id', (req, res) => {
  events.deleteEventById(req.params.id)
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
