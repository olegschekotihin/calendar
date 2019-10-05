'use strict';

/* Calendar */
var date = new Date();
var currentDate = date.getTime();
var arrEvent = [];

function Calendar() {

    /* Create new event */
    this.createEvent = function (event, dateEvent) {
        var newDate = new Date(Date.parse(dateEvent));
        var callDate = newDate - currentDate;
        var newEvent = {
            dateEvent: dateEvent,
            event: event,
            id: arrEvent.length,
            timeToCall: callDate,
            date: newDate.getTime()
        };
        arrEvent.push(newEvent);
        //TODO
        //setTimeout(console.log(event), callDate);
    };

    /* Remove event */
    this.removeEvent = function (event) {
        var index = arrEvent.findIndex(function (e) {
            return e.event === event;
        });
        if (index !== -1) arrEvent.splice(index, 1);
    };

    /* Find nearest event */
    this.findNearestEvent = function () {

        var currentTime = Date.now();
        var timeToCallEvent = null;

        arrEvent.forEach( function (el) {
            if(timeToCallEvent === null && currentTime < el.date) {
                timeToCallEvent = el.date;
            }
            if(currentTime < el.date && timeToCallEvent > el.date) {
                timeToCallEvent = el.date
            }
        });
        return timeToCallEvent;
        console.log(timeToCallEvent);
    };

    /* Edit event */
    this.editEvent = function(id, newEvent) {
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
    }
}

var calendar = new Calendar();

calendar.createEvent('test1', '2019-10-05');
calendar.createEvent('test12', '2017-01-26');
calendar.createEvent('test13', '2017-01-26');
calendar.createEvent('test13', '2017-01-26');
calendar.createEvent('test14', '2017-01-26');
calendar.createEvent('test15', '2017-01-26');

