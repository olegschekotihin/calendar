'use strict';

/* Calendar */
var currentTime = Date.now();
var arrEvent = [];
var timer;

function Calendar() {

    /* Create new event */

    this.createEvent = function (event, dateEvent) {
        if (event === undefined || event.length <= 0) {
            console.log('Please set an correct event');
        }
        if (dateEvent === undefined || dateEvent.length <= 0) {
            console.log('Please set a correct date');
        }

        var newDate = new Date(Date.parse(dateEvent));
        var newEvent = {
            dateEvent: dateEvent,
            event: event,
            id: arrEvent.length,
            date: newDate.getTime()
        };

        arrEvent.push(newEvent);
        this.findNearestEventAndShow();
    };

    /* Remove event */

    this.removeEvent = function (id) {
        if (id === undefined || id.length < 0) {
            console.log('Enter the correct id');
        }

        var timeToNearestEvent = this.findTimeToNearestEvent();
        var index = arrEvent.findIndex(function (e) {
            return e.id === id;
        });

        var isClosestEvent = function () {
            if ((arrEvent[index].date) === timeToNearestEvent) {
                return true;
            }
        }();

        if (index !== -1) arrEvent.splice(index, 1);

        if (isClosestEvent) {
            this.findTimeToNearestEvent();
        }
    };

    /* Find nearest event */

    this.findTimeToNearestEvent = function () {
        var timeToCallEvent = null;

        arrEvent.forEach(function (el) {
            if (timeToCallEvent === null && currentTime < el.date) {
                timeToCallEvent = el.date;
            }
            if (currentTime < el.date && timeToCallEvent > el.date) {
                timeToCallEvent = el.date
            }
        });
        return timeToCallEvent;
    };

    /* Show Event */
    //TODO
    this.findNearestEventAndShow = function () {
        var timeToCallEvent = this.findTimeToNearestEvent() || null;
        var delay = timeToCallEvent - currentTime;

        timer = setInterval(function () {
            arrEvent.forEach(function (el) {
                if (el.date === timeToCallEvent) {
                    var isTimerShowEvent = true;
                    console.log(el.id);
                    console.log('событие ' + el.event);
                }
                if (isTimerShowEvent) {
                    clearInterval(timer);
                }
            });
        }, delay);

        timeToCallEvent;
    };

    /* Edit event */

    this.editEvent = function (id, newEvent) {
        if (id === undefined || id <= 0) {
            console.log('Enter the correct id');
        }
        if (newEvent === undefined || newEvent.length <= 0) {
            console.log('Please set an correct event');
        }

        arrEvent.forEach(function (el) {
            if (el.id === id) {
                el.event = newEvent
            }
        });
    };

    /* Edit date */

    this.editDate = function (id, newDate) {
        if (id === undefined || id <= 0) {
            console.log('Enter the correct id');
        }
        if (newEvent === undefined || newDate.length <= 0) {
            console.log('Please set an correct date');
        }

        arrEvent.forEach(function (el) {
            if (el.id === id) {
                el.dateEvent = newDate
            }
        });

        this.findNearestEventAndShow();
    };

    //TODO
    this.returnEventsList = function (dateToStart, dateToStop) {
        if (dateToStop === undefined) {
            dateToStop = dateToStart;
        }

        var newDateStart = new Date(Date.parse(dateToStart));
        var newDateStop = new Date(Date.parse(dateToStop));

        arrEvent.forEach(function (e) {

            var dateEvent = new Date(Date.parse(e.dateEvent));

            if ((dateEvent >= newDateStart) && (dateEvent <= newDateStop)) {
                console.log(e.event);
            }
        });
    };
}

var calendar = new Calendar();

calendar.createEvent('test11', '2019-10-16');
calendar.createEvent('test12', '2019-10-17');
calendar.createEvent('test13', '2019-10-18');
