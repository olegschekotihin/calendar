'use strict';
var Calendar = (function () {
    var eventList = [];
    var sec = 1000;
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';
    var NOT_CORRECT_CALLBACK = 'Callback must be a function';

    /* Generate random id*/

    function generateId() {
        return new Date().getMilliseconds();
    }

    function Calendar() {
        setInterval(function () {
            /* Find and run closest event */
            runClosestEvent();
        }, sec);
    }

    /* Check array */

    function isValidArray(arr) {
        return Array.isArray(arr);
    }

    Calendar.prototype.eventTriggered = function (event) {
        console.log(event);
    };

    function findClosestEvent() {
        var currentTime = new Date();
        var currentYear = currentTime.getFullYear();
        var currentMonth = currentTime.getMonth();
        var currentDay = currentTime.getDay();
        var currentMinutes = currentTime.getMinutes();
        var currentSeconds = currentTime.getSeconds();

        var closestEventList = eventList.filter(function (event) {
            var eventYear = event.eventDate.getFullYear();
            var eventMonth = event.eventDate.getMonth();
            var eventDay = event.eventDate.getDay();
            var eventMinutes = event.eventDate.getMinutes();
            var eventSeconds = event.eventDate.getSeconds();

            if (currentYear === eventYear && currentMonth === eventMonth
                && currentDay === eventDay && currentMinutes >= eventMinutes
                && event.done === false) {
                return event;
            }
        });

        return closestEventList;
    }

    function runClosestEvent() {
        var closestEventList = findClosestEvent();

        if (closestEventList.length) {
            closestEventList.forEach(function (event) {
                Calendar.prototype.eventTriggered(Object.assign({}, event));
                event.done = true;
                return event.callback();
            })
        }
    }

    /* Create new event */

    Calendar.prototype.createEvent = function (eventName, eventDate, callback) {
        if (!eventName) {
            throw NOT_CORRECT_EVENT;
        }
        if (!eventDate) {
            throw NOT_CORRECT_DATE;
        }

        var date = new Date(Date.parse(eventDate));

        if (isNaN(date)) {
            throw NOT_CORRECT_DATE;
        }

        if (typeof callback !== "function") {
            throw NOT_CORRECT_CALLBACK;
        }

        var newEvent = {
            eventDate: date,
            eventName: eventName,
            id: generateId(),
            done: false,
            callback: callback
        };

        eventList.push(newEvent);
        return newEvent;
    };

    /* Remove event */

    Calendar.prototype.removeEvent = function (id) {
        if (!id || isNaN(id)) {
            throw NOT_CORRECT_ID;
        }

        eventList = eventList.filter(function (event) {
            return event.id !== id
        });
    };

    /* Edit event */

    Calendar.prototype.editEvent = function (id, newEvent) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }
        if (!newEvent) {
            throw NOT_CORRECT_EVENT;
        }

        eventList = eventList.map(function (event) {
            if (event.id === id) {
                return Object.assign({}, event, {eventName: newEvent});
            }
            return event;
        });
    };

    /* Edit date */

    Calendar.prototype.editDate = function (id, newEventDate) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }
        var parsedNewEventDay = new Date(Date.parse(newEventDate));

        if (!newEventDate || isNaN(parsedNewEventDay)) {
            throw NOT_CORRECT_DATE;
        }

        eventList = eventList.map(function (event) {
            if (event.id === id) {
                return Object.assign({}, event, {eventDate: parsedNewEventDay});
            }
            return event;
        });
    };

    /* Find event by id */

    Calendar.prototype.findById = function (id) {
        var eventListId = eventList.find(function (event) {
            return (event.id === id);
        });

        return eventListId;
    };

    /* Show all event */

    Calendar.prototype.showAllEvent = function showAllEvent() {
        return eventList.map(function(event) {
            return Object.assign({}, event);
        });
    };

    /* Show event list for period*/

    Calendar.prototype.showEventsListForPeriod = function (startDate, stopDate) {
        if (!stopDate) {
            stopDate = startDate;
        }

        var newDateStart = new Date(Date.parse(startDate));
        var newDateStop = new Date(Date.parse(stopDate));

        if (!newDateStart) {
            throw NOT_CORRECT_DATE;
        }

        var eventListForPeriod = eventList.filter(function (event) {
            if ((event.eventDate >= newDateStart) && (event.eventDate <= newDateStop)) {
                return Object.assign({}, event)
            }
        });

        return eventListForPeriod;
    };

    /* Show event list for month*/

    Calendar.prototype.showEventsListForMonth = function () {
        var currentDate = new Date();
        var eventListsByMonth = eventList.filter(function (event) {
            if ((event.eventDate.getMonth() === currentDate.getMonth() &&
                event.eventDate.getFullYear() === currentDate.getFullYear())) {
                return Object.assign({}, event);
            }
        });
        return eventListsByMonth;
    };

    /* Show event list for week*/

    Calendar.prototype.showEventsListForWeek = function () {
        var currentDate = new Date();
        var startDayOfAWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay() + 1);
        var endDayOfAWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay() + 7, 23, 59, 59, 999);

        var eventListByWeek = eventList.filter(function (event) {
            if ((event.eventDate >= startDayOfAWeek && event.eventDate <= endDayOfAWeek)) {
                return Object.assign({}, event)
            }
        });

        return eventListByWeek;
    };

    /* Show event list for day*/

    Calendar.prototype.showEventsListForDay = function () {
        var currentDate = new Date();
        return eventList.map(function (event) {
            if ((event.eventDate.getDate() === currentDate.getDate() &&
                event.eventDate.getMonth() === currentDate.getMonth() &&
                event.eventDate.getFullYear() === currentDate.getFullYear())) {
                return Object.assign({}, event);
            }
        });
    };

    return new Calendar();
})();
