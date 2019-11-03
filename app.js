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
        return new Date().getMilliseconds();
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
        var currentYear = currentTime.getFullYear();
        var currentMonth = currentTime.getMonth();
        var currentDay = currentTime.getDay();
        var currentMinutes = currentTime.getMinutes();
        var currentSeconds = currentTime.getSeconds();

        eventList.forEach(function (event) {
            if (currentYear === event.eventDate.getFullYear() && currentMonth === event.eventDate.getMonth()
                && currentDay === event.eventDate.getDay() && currentMinutes === event.eventDate.getMinutes()
                && currentSeconds === event.eventDate.getSeconds() && event.done === false) {
                event.done = true;
                return event.callback();
            }
        });
    }

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
    };

    /* Remove event */

    Calendar.prototype.removeEvent = function (id) {
        if (!id || isNaN(id)) {
            return console.log(NOT_CORRECT_ID);
        }

        eventList = eventList.filter(function (event) {
            return event.id !== id
        });
    };

    /* Edit event */

    Calendar.prototype.editEvent = function (id, newEvent) {
        if (!id) {
            return console.log(NOT_CORRECT_ID);
        }
        if (!newEvent) {
            return console.log(NOT_CORRECT_EVENT);
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
            return console.log(NOT_CORRECT_ID);
        }
        var parseNewEventDay = new Date(Date.parse(newEventDate));

        if (!newEventDate || isNaN(parseNewEventDay)) {
            return console.log(NOT_CORRECT_DATE);
        }

        eventList = eventList.map(function (event) {
            if (event.id === id) {
                return Object.assign({}, event, {eventDate: parseNewEventDay});
            }
            return event;
        });
    };

    /* Find event by id */

    Calendar.prototype.findById = function (id) {
      var eventListId = eventList.filter(function (event) {
          return (event.id === id);
      });

      return eventListId;
    };

    /* Show all event */

    Calendar.prototype.showAllEvent = function showAllEvent() {
        return eventList;
    };

    /* Show event list for period*/

    Calendar.prototype.showEventsListForPeriod = function (startDate, stopDate) {
        if (!stopDate) {
            stopDate = startDate;
        }

        var newDateStart = new Date(Date.parse(startDate));
        var newDateStop = new Date(Date.parse(stopDate));

        if (!newDateStart) {
            return console.log(NOT_CORRECT_DATE);
        }

        var eventListForPeriod = eventList.filter(function (event) {
            return (event.eventDate >= newDateStart) && (event.eventDate <= newDateStop);
        });

        return eventListForPeriod;
    };

    /* Show event list for month*/

    Calendar.prototype.showEventsListForMonth = function () {
        var currentDate = new Date();
        var eventListsByMonth = eventList.filter(function (event) {
            return (event.eventDate.getMonth() === currentDate.getMonth() &&
                event.eventDate.getFullYear() === currentDate.getFullYear());
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
            return (event.eventDate >= startDayOfAWeek && event.eventDate <= endDayOfAWeek);
        });
        return eventListByWeek;
    };

    /* Show event list for day*/

    Calendar.prototype.showEventsListForDay = function () {
        var currentDate = new Date();
        var eventListByDay = eventList.filter(function (event) {
            return (event.eventDate.getDate() === currentDate.getDate() &&
                event.eventDate.getMonth() === currentDate.getMonth() &&
                event.eventDate.getFullYear() === currentDate.getFullYear());
        });
        return eventListByDay;
    };

    return new Calendar();
})();



