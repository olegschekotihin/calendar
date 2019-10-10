'use strict';

/* Calendar */
var date = new Date();
var currentDate = date.getTime();
var arrEvent = [];

function Calendar() {

    /* Create new event */

    this.createEvent = function (event, dateEvent) {
        var newDate = new Date(Date.parse(dateEvent));
        var dateCall = newDate.getTime();
        var newEvent = {
            dateEvent: dateEvent,
            event: event,
            id: arrEvent.length,
            date: newDate.getTime()
        };
        arrEvent.push(newEvent);

        var nearestEvent = this.findNearestEvent();
        var dateToCall = nearestEvent - currentDate;

        if (dateCall === nearestEvent) {
            setTimeout(this.showEvent(), dateToCall);
        }
    };

    /* Remove event */

    this.removeEvent = function (id) {
        var nearestEvent = this.findNearestEvent();
        var index = arrEvent.findIndex(function (e) {
            return e.id === id;
        });

        var isClosestEvent = function () {
            if ((arrEvent[index].date) === nearestEvent) {
                return true;
            }
        }();

        if (index !== -1) arrEvent.splice(index, 1);

        if (isClosestEvent) {
            this.findNearestEvent();
        }
    };

    /* Find nearest event */

    this.findNearestEvent = function () {
        console.log(arrEvent);
        var currentTime = Date.now();
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

    this.showEvent = function () {
        console.log('currentEvent ' + event);

        if (nearestEvent === dateToCall) {
            setTimeout(this.findNearestEvent(), 300)
        } else {
            this.findNearestEvent();
        }
    };

    /* Edit event */

    this.editEvent = function (id, newEvent) {
        arrEvent.forEach(function (el) {
            if (el.id === id) {
                el.event = newEvent
            }
        });
    };

    /* Edit date */
    this.editDate = function (id, newDate) {
        arrEvent.forEach(function (el) {
            if (el.id === id) {
                el.dateEvent = newDate
            }
        });
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

calendar.createEvent('test11', '2019-10-11');
calendar.createEvent('test12', '2019-10-10');
calendar.createEvent('test13', '2019-10-13');
