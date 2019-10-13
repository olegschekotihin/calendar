'use strict';

/* Calendar */
var date = new Date();
var currentTime = date.getTime();
var arrEvent = [];
var timer;

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

        var timeToNearestEvent = this.findTimeToNearestEvent();
        var dateToCall = timeToNearestEvent - currentTime;

        if (dateCall === timeToNearestEvent) {
            setTimeout(this.showEvent(), dateToCall);
        }
    };

    /* Remove event */

    this.removeEvent = function (id) {
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
    //TODO
    this.findNearestEventAndShow = function () {
        var currentTime = Date.now();
        var timeToCallEvent =  findTimeToNearestEvent() || null;
        var delay = timeToCallEvent - currentTime;

        timer = setInterval(function () {
            arrEvent.forEach(function (el) {
                if(dateCall === timeToCallEvent){
                    console.log(el.event);
                }
            });
        }, delay)
    };

    this.showEvent = function () {
        console.log('currentEvent ' + event);

        if (nearestEvent === dateToCall) {
            setTimeout(this.findTimeToNearestEvent(), 300)
        } else {
            this.findTimeToNearestEvent();
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
