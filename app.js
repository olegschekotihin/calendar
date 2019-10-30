'use strict';
var Calendar = (function () {
    var eventList = [];
    var sec = 1000;
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';

    /* Generate random id*/
    //TODO
    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    function Calendar() {
        timerToRunClosestEvent();
    }

    /* Find and run closest event */

    function timerToRunClosestEvent() {
        setInterval(function () {
            runClosestEvent();
        }, sec);
    }

    function runClosestEvent() {
        var currentTime = new Date();
        // var closestTimeToEvent = findTimeToNearestEvent();
        // var closestEventList = findNearestEvent(closestTimeToEvent);

        eventList.forEach(function (event) {
            if (currentTime.getFullYear() === event.eventDate.getFullYear() && currentTime.getMonth() === event.eventDate.getMonth()
                && currentTime.getDay() === event.eventDate.getDay() && currentTime.getMinutes() === event.eventDate.getMinutes()
                && currentTime.getSeconds() === event.eventDate.getSeconds()) {
                return event.callback();
            }
        });
    }

    /* Find time to nearest event */

    // function findTimeToNearestEvent() {
    //     var timeToCallEvent = null;
    //     var currentTime = Date.now();
    //     eventList.forEach(function (event) {
    //         if (timeToCallEvent === null && currentTime < event.eventDate.getTime()) {
    //             timeToCallEvent = event.eventDate.getTime();
    //         }
    //         if (currentTime < event.eventDate.getTime() && timeToCallEvent > event.eventDate.getTime()) {
    //             timeToCallEvent = event.eventDate.getTime();
    //         }
    //     });
    //     return timeToCallEvent;
    // }

    /* Find nearest event */

    // function findNearestEvent(closestTime) {
    //     var nearestEventList = eventList.filter(function (event) {
    //         return closestTime === event.eventDate.getTime();
    //     });
    //     return nearestEventList;
    // }

    /* Create new event */

    Calendar.prototype.createEvent = function (eventName, eventDate, callback) {
        if (!eventName) {
            return console.log(NOT_CORRECT_EVENT);
        }
        if (!eventDate) {
            return console.log(NOT_CORRECT_DATE);
        }

        var date = new Date(Date.parse(eventDate));

        if (isNaN(date)) {
            return console.log(NOT_CORRECT_DATE);
        }

        var newEvent = {
            eventDate: date,
            eventName: eventName,
            id: generateId(),
            done: false,
            callback: callback
        };

        eventList.push(newEvent);
        timerToRunClosestEvent();
    };

    /* Remove event */

    Calendar.prototype.removeEvent = function (id) {
        if (!id) {
            return console.log(NOT_CORRECT_ID);
        }

        var index = eventList.findIndex(function (event) {
            return event.id === id;
        });

        if (index !== -1) eventList.splice(index, 1);
    };

    /* Edit event */

    Calendar.prototype.editEvent = function (id, newEvent) {
        if (!id) {
            return console.log(NOT_CORRECT_ID);
        }
        if (!newEvent) {
            return console.log(NOT_CORRECT_EVENT);
        }
        //TODO
        eventList.forEach(function (event) {
            if (event.id === id) {
                event.eventName = newEvent
            }
        });
    };

    /* Edit date */

    Calendar.prototype.editDate = function (id, newEventDate) {
        if (!id) {
            return console.log(NOT_CORRECT_ID);
        }
        var parseNewEventDay = new Date(Date.parse(newEventDate));

        if (!newEventDate || isNaN(parseNewEventDay)) {
            return console.log(NOT_CORRECT_DATE);
        }

        eventList.forEach(function (event) {
            if (event.id === id) {
                event.eventDate = parseNewEventDay
            }
        });
    };

    /* Show event list for period*/

    Calendar.prototype.showEventsListForPeriod = function (startDate, stopDate) {
        if (!stopDate) {
            stopDate = startDate;
        }

        var newDateStart = new Date(Date.parse(startDate));
        var newDateStop = new Date(Date.parse(stopDate));

        if (isNaN(newDateStart && newDateStop)) {
            return console.log(NOT_CORRECT_DATE);
        }

        var eventListForPeriod = eventList.filter(function (event) {
            if ((event.eventDate >= newDateStart) && (event.eventDate <= newDateStop)) {
                return event.eventName;
            }
        });

        return eventListForPeriod;
    };

    /* Show event list for month*/

    Calendar.prototype.showEventsListForMonth = function () {
        var currentDate = new Date();
        var eventsByMonth = eventList.filter(function (event) {
            if (event.eventDate.getMonth() === currentDate.getMonth() &&
                event.eventDate.getFullYear() === currentDate.getFullYear()) {
                return event;
            }
        });
        return eventsByMonth;
    };

    /* Show event list for day*/

    Calendar.prototype.showEventsListForDay = function () {
        var currentDate = new Date();
        var eventsByDay = eventList.filter(function (event) {
            if (event.eventDate.getDate() === currentDate.getDate() &&
                event.eventDate.getMonth() === currentDate.getMonth() &&
                event.eventDate.getFullYear() === currentDate.getFullYear()) {
                return event;
            }
        });
        return eventsByDay;
    };

    /* Show event list for week*/

    Calendar.prototype.showEventsListForWeek = function () {
        var currentDate = new Date();
        var startDayOfAWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay() + 1);
        var endDayOfAWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay() + 7, 23, 59, 59, 999);

        var eventsByWeek = eventList.filter(function (event) {
            if (event.eventDate >= startDayOfAWeek && event.eventDate <= endDayOfAWeek) {
                return event;
            }
        });
        return eventsByWeek;
    };

    return new Calendar();
})();



