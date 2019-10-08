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
        //TODO
        var nearestEvent = this.findNearestEvent();
        var dateToCall = nearestEvent - currentDate;

        if (dateCall === nearestEvent) {
            setTimeout( function (){console.log('currentEvent ' + event)}, dateToCall);
        }
    };

    /* Remove event */

    this.removeEvent = function (id) {
        var nearestEvent = this.findNearestEvent();

        var index = arrEvent.findIndex(function (e) {
            return e.id === id;
        });

        // console.log(arrEvent[index]);

        // if(arrEvent[index].dateCall === nearestEvent) {
        //     console.log(arrEvent[index].dateCall);
        // }
        //TODO
        var removedEventIndex = arrEvent.forEach(function (el) {
            if(el.id === id) {
                if(el.date === nearestEvent) {
                    this.findNearestEvent();
                }
                return el.id;
            }
        });

        if (removedEventIndex !== -1) arrEvent.splice(removedEventIndex, 1);
    };

    /* Find nearest event */

    this.findNearestEvent = function () {

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

calendar.createEvent('test13', '2019-10-09');
calendar.createEvent('test12', '2019-10-09');
calendar.createEvent('test13', '2019-10-10');
