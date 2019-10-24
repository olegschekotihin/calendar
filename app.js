'use strict';

/* Calendar */

function Calendar() {
    var currentTime = Date.now();
    var arrEvent = [];
    var timer;
    var generateId = function () {
        return Math.random().toString(36).substr(2, 9);
    };

    /* Find and run closest event */

    (function findAndRunClosestEvent() {
        var sec = 1000;

        if (timer) {
            clearInterval(timer);
        }

        if (!arrEvent.length) {
            console.log('events list is empty');
        }

        var currentTime = Date.now();
        var closestTimeToEvent = this.Calendar.findTimeToNearestEvent() || null;

        if (!closestTimeToEvent) {
            console.log('date is empty');
        }

        var closestEventList = this.Calendar.findNearestEvent(closestTimeToEvent);

        //calculate the delay and start timer
        var delay = (closestTimeToEvent - currentTime);
        var isStartEvent = delay < sec;
        var timeToDelayTimer = isStartEvent ?  delay : sec;
        timer = setInterval(function () {
            if (isStartEvent) {
                closestEventList.forEach(function (event) {
                    event.callback();
                });
                findAndRunClosestEvent();
            } else {
                findAndRunClosestEvent();
            }
        }, timeToDelayTimer);
    }());

    /* Create new event */

    Calendar.prototype.createEvent = function (eventName, eventDate, callback) {
        if (!eventName) {
            return console.log('Please set an correct event');
        }
        if (!eventDate) {
            return console.log('Please set a correct date');
        }

        var newDate = new Date(Date.parse(eventDate));
        var newEvent = {
            eventDate: eventDate,
            eventName: eventName,
            id: generateId(),
            date: newDate.getTime(),
            callback: callback
        };

        arrEvent.push(newEvent);
    };

    /* Remove event */

    Calendar.prototype.removeEvent = function (id) {
        if (!id) {
            return console.log('Enter the correct id');
        }

        var index = arrEvent.findIndex(function (e) {
            return e.id === id;
        });

        if (index !== -1) arrEvent.splice(index, 1);
    };

    /* Find time to nearest event */

    var findTimeToNearestEvent = function () {
        var timeToCallEvent = null;

        arrEvent.forEach(function (el) {
            if (timeToCallEvent === null && currentTime < el.eventDate) {
                timeToCallEvent = el.eventDate;
            }
            if (currentTime < el.eventDate && timeToCallEvent > el.eventDate) {
                timeToCallEvent = el.eventDate
            }
        });
        return timeToCallEvent;
    };

    /* Find nearest event */

    var findNearestEvent = function (closestTime) {
        var nearestEventList = arrEvent.map(function (event) {
            if(closestTime === event.eventDate) {
                return event.eventDate;
            }
        });
        console.log(nearestEventList);
    };

    /* Edit event */

    Calendar.prototype.editEvent = function (id, newEvent) {
        if (!id) {
            return console.log('Enter the correct id');
        }
        if (!newEvent) {
            return console.log('Please set an correct event');
        }

        arrEvent.map(function (el) {
            if (el.id === id) {
                el.eventName = newEvent
            }
        });
    };

    /* Edit date */

    Calendar.prototype.editDate = function (id, newDate) {
        if (!id) {
            return console.log('Enter the correct id');
        }
        if (!newDate) {
            return console.log('Please set an correct date');
        }

        arrEvent.forEach(function (el) {
            if (el.id === id) {
                el.eventDate = newDate
            }
        });
    };

    /* Show event list*/

    Calendar.prototype.showEventsListForPeriod = function (startDate, stopDate) {
        if (stopDate === undefined) {
            stopDate = startDate;
        }

        var newDateStart = new Date(Date.parse(startDate));
        var newDateStop = new Date(Date.parse(stopDate));

        var eventList = arrEvent.filter(function (value) {
            var eventDate = new Date(Date.parse(value.eventDate));

            if ((eventDate >= newDateStart) && (eventDate <= newDateStop)) {
                return value.eventName;
            }
        });

        console.log(eventList);
    };

//TODO
    Calendar.prototype.showEventsListForDay = function (searchEventForDay) {
        var searchDay = searchEventForDay
    };

}

var calendar = new Calendar();

calendar.createEvent('test11', '2019-10-26');
calendar.createEvent('test12', '2019-10-27');
calendar.createEvent('test13', '2019-10-28');
