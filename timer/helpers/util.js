const { MS_PER_MINUTE, TIMER_TYPES, TIMER_OFFSETS } = require('./constants');
const { cancelTimer } = require('./worker');
const { sendSafe, sendDanger } = require('./notify');
const { getEventWithRecipients } = require('../../server/db/controllers/eventCtrl');
const {
  createTimer,
  getTimersByEvent,
  makeTimerInactive
} = require('../../server/db/controllers/timersCtrl');

const offsetMinutes = function(offset, date) {
  return new Date(date - (offset * MS_PER_MINUTE));
};

exports.populateTimers = function(eventId, end) {
  let insertTimers = TIMER_TYPES
    // create each timer to insert into db
    .map(type => {
      return {
        'event_id': eventId,
        'type': type,
        'time': offsetMinutes(TIMER_OFFSETS[type], new Date(end))
      };
    })
    // wrap timers with db insert Promises
    .map(timer => {
      return createTimer(timer);
    });

  return Promise.all(insertTimers);
};

exports.endEvent = function(eventId, safe) {
  return getTimersByEvent(eventId)
    // map to array of timer ids
    .then(timers => timers.map(({ id }) => id))
    .then(ids => {
      // cancel each timer in memory
      ids.forEach(id => cancelTimer(id));
      // mark each timer inactive in database
      return Promise.all(ids.map(id => makeTimerInactive(id)));
    })
    // get event info
    .then(() => getEventWithRecipients(eventId))
    // send notifications
    .then(event => safe ? sendSafe(event) : sendDanger(event))
    .catch(console.log);
};
