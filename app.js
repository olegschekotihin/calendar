'use strict';

/* Calendar */

function Calendar() {
    var currentTime = Date.now();
    var arrEvent = [];
    var timer;
    //
    // Calendar.prototype.timer = function() {
    //     var timeToCallEvent = this.findTimeToNearestEvent() || null;
    //     var delay = timeToCallEvent - currentTime;
    //
    //     setInterval(function () {
    //         arrEvent.forEach(function (el) {
    //             if (el.date === timeToCallEvent) {
    //                 var isTimerShowEvent = true;
    //                 console.log(el.id);
    //                 console.log('событие ' + el.event);
    //             }
    //             if (isTimerShowEvent) {
    //                 clearInterval(timer);
    //             }
    //         });
    //     }, delay);
    // } ();

    /* Create new event */

    Calendar.prototype.createEvent = function (eventName, eventDate) {
        if (!eventName) {
            console.log('Please set an correct event');
        }
        if (!eventDate) {
            console.log('Please set a correct date');
        }

        var newDate = new Date(Date.parse(eventDate));
        var newEvent = {
            eventDate: eventDate,
            eventName: eventName,
            id: arrEvent.length,
            date: newDate.getTime()
        };

        arrEvent.push(newEvent);
        this.findNearestEventAndShow();
    };

    /* Remove event */

    Calendar.prototype.removeEvent = function (id) {
        if (!id) {
            console.log('Enter the correct id');
        }

        var timeToNearestEvent = this.findTimeToNearestEvent();
        var index = arrEvent.findIndex(function (e) {
            return e.id === id;
        });

        var isClosestEvent = function () {
            if ((arrEvent[index].eventDate) === timeToNearestEvent) {
                return true;
            }
        }();

        if (index !== -1) arrEvent.splice(index, 1);

        if (isClosestEvent) {
            this.findNearestEventAndShow();
        }
    };

    /* Find time to nearest event */

    Calendar.prototype.findTimeToNearestEvent = function () {
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

    /* Show nearest event */
    //TODO
    Calendar.prototype.findNearestEventAndShow = function () {

        //
        // if (timer) {
        //     clearInterval(timer);
        // }
    };

    /* Edit event */

    Calendar.prototype.editEvent = function (id, newEvent) {
        if (!id) {
            console.log('Enter the correct id');
        }
        if (!newEvent) {
            console.log('Please set an correct event');
        }

        arrEvent.forEach(function (el) {
            if (el.id === id) {
                el.eventName = newEvent
            }
        });
    };

    /* Edit date */

    Calendar.prototype.editDate = function (id, newDate) {
        if (!id) {
            console.log('Enter the correct id');
        }
        if (!newDate) {
            console.log('Please set an correct date');
        }

        arrEvent.forEach(function (el) {
            if (el.id === id) {
                el.eventDate = newDate
            }
        });

        this.findNearestEventAndShow();
    };

    /* Show event list*/

    Calendar.prototype.showEventsList = function (dateToStart, dateToStop) {
        if (dateToStop === undefined) {
            dateToStop = dateToStart;
        }

        var newDateStart = new Date(Date.parse(dateToStart));
        var newDateStop = new Date(Date.parse(dateToStop));

        arrEvent.map(function (value) {
            var eventDate = new Date(Date.parse(value.eventDate));

            if ((eventDate >= newDateStart) && (eventDate <= newDateStop)) {
                console.group();
                console.log('Event ID - ' + value.id);
                console.log('Event - ' + value.eventName);
                console.log('Event date - ' + value.eventDate);
                console.groupEnd();
            }
        });
    };
}

var calendar = new Calendar();

calendar.createEvent('test11', '2019-10-16');
calendar.createEvent('test12', '2019-10-17');
calendar.createEvent('test13', '2019-10-18');
