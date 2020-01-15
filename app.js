'use strict';
var Calendar = (function () {
    var eventList = [];
    var sec = 1000;
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';
    var CALLBACK_IS_EMPTY = 'Callback is empty';
    var NOT_CORRECT_CALLBACK = 'Callback must be a function';
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';
    var idInterval = 10000000;
    var date;

    /* Generate random id*/

    function generateId() {
        return Math.floor((Math.random() * idInterval) + 1);
        //new Date().getMilliseconds();
    }

    function Calendar() {
        setInterval(function () {
            /* Find and run closest event */
            runClosestEvent();
        }, sec);
    }

    function findClosestEvent() {
        var currentTime = new Date();
        var currentYear = currentTime.getFullYear();
        var currentMonth = currentTime.getMonth();
        var currentDay = currentTime.getDay();
        var currentHour = currentTime.getHours();
        var currentMinutes = currentTime.getMinutes();
        var currentSeconds = currentTime.getSeconds();

        var closestEventList = eventList.filter(function (event) {
            var eventYear = event.eventDate.getFullYear();
            var eventMonth = event.eventDate.getMonth();
            var eventDay = event.eventDate.getDay();
            var eventHour = event.eventDate.getHours();
            var eventMinutes = event.eventDate.getMinutes();
            var eventSeconds = event.eventDate.getSeconds();

            if (currentYear === eventYear && currentMonth === eventMonth
                && currentDay === eventDay && currentHour === eventHour && currentMinutes >= eventMinutes
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
                event.done = true;
                event.callback();
                return Calendar.prototype.observable.broadcast(Object.assign({}, event));
            })
        }
    }

    function checkEventDate(eventDate) {
        if(typeof eventDate === "string") {
            date = new Date(Date.parse(eventDate));
            if (isNaN(date)) {
                throw NOT_CORRECT_DATE;
            }
        }
        if(typeof eventDate === "number") {
            date = new Date(eventDate);
        }

        if(typeof eventDate === "object") {
            date = eventDate;
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

        checkEventDate(eventDate);

        if (typeof callback !== "function" || !callback) {
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

        checkById(id);

        eventList = eventList.filter(function (event) {
            return event.id !== id
        });
    };

    /* Edit event*/

    // Calendar.prototype.editEvent = function (id, eventName, eventDate, eventCallback) {
    //     if (!id) {
    //         throw NOT_CORRECT_ID;
    //     }
    //
    //     var parsedNewEventDay = new Date(Date.parse(eventDate));
    //     // if (!newEventDate || isNaN(parsedNewEventDay)) {
    //     //     throw NOT_CORRECT_DATE;
    //     // }
    //     console.log(parsedNewEventDay);
    //     if(!eventName && !eventDate || isNaN(parsedNewEventDay) && !eventCallback) {
    //         throw INPUT_DATA_IS_NOT_VALID;
    //     }
    //     if(eventName) {
    //         eventList = eventList.map(function (event) {
    //             if (event.id === id) {
    //                 return Object.assign({}, event, {eventName: eventName});
    //             }
    //             return event;
    //         });
    //     }
    //     if(eventDate) {
    //         eventList = eventList.map(function (event) {
    //             if (event.id === id) {
    //                 return Object.assign({}, event, {eventDate: parsedNewEventDay});
    //             }
    //             return event;
    //         });
    //     }
    //     if(typeof callback === "function" && eventCallback) {
    //         eventList = eventList.map(function (event) {
    //             if (event.id === id) {
    //                 return Object.assign({}, event, {callback: eventCallback});
    //             }
    //             return event;
    //         });
    //     }
    // };

    /* Edit event */

    Calendar.prototype.editEventName = function (id, newEventName) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }

        checkById(id);

        if (!newEventName) {
            throw NOT_CORRECT_EVENT;
        }

        eventList = eventList.map(function (event) {
            if (event.id === id) {
                return Object.assign({}, event, {eventName: newEventName});
            }
            return event;
        });
    };

    /* Edit date */

    Calendar.prototype.editEventDate = function (id, newEventDate) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }

        checkById(id);
        checkEventDate(newEventDate);
        var parsedNewEventDay = new Date(Date.parse(newEventDate));

        if (!newEventDate || isNaN(parsedNewEventDay)) {
            throw NOT_CORRECT_DATE;
        }

        eventList = eventList.map(function (event) {
            if (event.id === id) {
                return Object.assign({}, event, {eventDate: date});
            }
            return event;
        });
    };

    /* Edit callback */

    Calendar.prototype.editEventCallback = function (id, newCallback) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }
        if (!newCallback) {
            throw CALLBACK_IS_EMPTY;
        }
        if(typeof newCallback !== "function") {
            throw NOT_CORRECT_CALLBACK;
        }

        checkById(id);

        eventList = eventList.map(function (event) {
            if (event.id === id) {
                return Object.assign({}, event, {callback: newCallback});
            }
            return event;
        });
    };

    /* Check event by id */

    function checkById(id) {
        var eventListId = eventList.find(function (event) {
            return (event.id === id);
        });

        if(!eventListId) {
            throw NOT_CORRECT_ID;
        }
    };

    /* Get all event */

    Calendar.prototype.getAllEvent = function() {
        return eventList.map(function (event) {
            return Object.assign({}, event);
        });
    };

    /* Get event list for period*/

    Calendar.prototype.getEventsListForPeriod = function (startDate, stopDate) {
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

    /* Get event list for month*/

    Calendar.prototype.getEventsListForMonth = function () {
        var currentDate = new Date();
        var eventListsByMonth = eventList.filter(function (event) {
            if ((event.eventDate.getMonth() === currentDate.getMonth() &&
                event.eventDate.getFullYear() === currentDate.getFullYear())) {
                return Object.assign({}, event);
            }
        });
        return eventListsByMonth;
    };

    /* Get event list for week*/

    Calendar.prototype.getEventsListForWeek = function () {
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

    /* Get event list for day*/

    Calendar.prototype.getEventsListForDay = function () {
        var currentDate = new Date();
        var evenListForDay =  eventList.filter(function (event) {
            if ((event.eventDate.getDate() === currentDate.getDate() &&
                event.eventDate.getMonth() === currentDate.getMonth() &&
                event.eventDate.getFullYear() === currentDate.getFullYear())) {
                return Object.assign({}, event);
            }
        });

        return evenListForDay;
    };

    /* Observer */

    function Observable() {
        this.events = [];

        this.subscribe = function(fn) {
            this.events.push(fn);
        };
        
        this.unsubscribe = function (fn) {
            this.events = this.events.filter(function (subscriber) {
                return (subscriber !== fn);
            })
        };

        this.broadcast = function (data) {
            this.events.forEach(function (subscriber) {
                return subscriber(data);
            })
        }
    }

    Calendar.prototype.observable = new Observable();

    return new Calendar();
})();