'use strict';
var Calendar = (function () {
    var eventList = [];
    var sec = 1000;
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';

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

    const oldOne = Calendar.prototype.eventTriggered;
    Calendar.prototype.eventTriggered = function() {
        /////
        oldOne();
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
                && currentDay === eventDay && currentMinutes === eventMinutes
                && currentSeconds === eventSeconds && event.done === false) {
                event.done = true;
                return event;
            }
        });

        return closestEventList;
    }

    function runClosestEvent() {
        var closestEventList = findClosestEvent();

        if(closestEventList.length) {
            //console.log(closestEventList);
            closestEventList.forEach(function (event) {
                //console.log('event is', event);
                //console.log('event.callback is ', event.callback)
                return event.callback();
            })
        }
        // if(isValidArray(closestEventList)) {
        //
        // }
        //
        // eventList.forEach(function (event) {
        //     var eventYear = event.eventDate.getFullYear();
        //     var eventMonth = event.eventDate.getMonth();
        //     var eventDay = event.eventDate.getDay();
        //     var eventMinutes = event.eventDate.getMinutes();
        //     var eventSeconds = event.eventDate.getSeconds();
        //
        //     if (currentYear === eventYear && currentMonth === eventMonth
        //         && currentDay === eventDay && currentMinutes === eventMinutes
        //         && currentSeconds === eventSeconds && event.done === false) {
        //         event.done = true;
        //         Calendar.prototype.eventTriggered(event);
        //         return event.callback();
        //     }
        // });
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
        return eventList.map(event => {
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



