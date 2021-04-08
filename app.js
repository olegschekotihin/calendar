'use strict';
var Calendar = (function () {
    var eventList = [];

    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';
    var CALLBACK_IS_EMPTY = 'Callback is empty';
    var NOT_CORRECT_CALLBACK = 'Callback must be a function';
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';

    /**
     * Generate random id*
     * @returns {number}
     */
    function generateId() {
        var idInterval = 10000000;
        return Math.floor((Math.random() * idInterval) + 1);
    }

    /**
     * Run calendar
     * @constructor
     */
    function Calendar() {
        var second = 1000 /*1000 * 60 - for prod*/;
        setInterval(function () {
            /* Find and run closest event */
            runClosestEvent();
        }, second);
    }

    /**
     * Run closest event
     */
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

    /**
     * Find closest event
     * @returns {Array.<*>}
     */
    function findClosestEvent() {
        var currentTime = new Date();
        var currentYear = currentTime.getFullYear();
        var currentMonth = currentTime.getMonth();
        var currentDay = currentTime.getDay();
        var currentHour = currentTime.getHours();
        var currentMinutes = currentTime.getMinutes();

        var closestEventList = eventList.filter(function (event) {
            var eventYear = event.eventDate.getFullYear();
            var eventMonth = event.eventDate.getMonth();
            var eventDay = event.eventDate.getDay();
            var eventHour = event.eventDate.getHours();
            var eventMinutes = event.eventDate.getMinutes();

            if (currentYear === eventYear && currentMonth === eventMonth
                && currentDay === eventDay && currentHour === eventHour && currentMinutes >= eventMinutes
                && event.done === false) {
                return event;
            }
        });

        return closestEventList;
    }

    /**
     * Create new event
     *
     * @param {String} eventName - new event name
     * @param eventDate - new event date
     * @param callback - new event callback
     * @returns {{eventName: *, callback: *, id: number, done: boolean, eventDate: *}}
     */
    Calendar.prototype.createEvent = function (eventName, eventDate, callback) {
        if (!eventName) {
            throw NOT_CORRECT_EVENT;
        }
        if (!eventDate) {
            throw NOT_CORRECT_DATE;
        }
        if (typeof callback !== "function" || !callback) {
            throw NOT_CORRECT_CALLBACK;
        }

        var date = parseEventDate(eventDate);

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

    /**
     * Parse event date
     * @param eventDate
     * @returns {*}
     */
    function parseEventDate(eventDate) {
        var date;
        if(typeof eventDate === "string" && Date.parse(eventDate)) {
            date = new Date(Date.parse(eventDate));
        }

        if(typeof eventDate === "number" && new Date(eventDate)) {
            date = new Date(eventDate);
        }

        if(typeof eventDate === "object" && eventDate.getTime) {
            date = eventDate;
        }

        return date;
    }

    /**
     * Remove event
     * @param id - event id
     */
    Calendar.prototype.removeEvent = function (id) {
        if (!id || isNaN(id)) {
            throw NOT_CORRECT_ID;
        }

        validateEventId(id);

        eventList = eventList.filter(function (event) {
            return event.id !== id
        });
    };

    /**
     * Edit event name
     * @param id - event id
     * @param newEventName - new event name
     */
    Calendar.prototype.editEventName = function (id, newEventName) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }

        validateEventId(id);

        if (!newEventName) {
            throw NOT_CORRECT_EVENT;
        }

        return editEvent(id, 'eventName', newEventName);
    };

    /**
     * Edit event
     * @param id - event id
     * @param propName - property name
     * @param newValue - new property value
     * @returns {*}
     */
    function editEvent(id, propName, newValue){
        var editedEvent;

        eventList = eventList.map(function (event) {
            if (event.id === id) {
                editedEvent = Object.assign({}, event, {[propName]: newValue});
                return editedEvent;
            }
            return event;
        });

        return editedEvent;
    }

    /**
     * Edit event date
     * @param id - event id
     * @param newEventDate - new event date
     * @returns {*}
     */
    Calendar.prototype.editEventDate = function (id, newEventDate) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }

        validateEventId(id);
        var date = parseEventDate(newEventDate);

        if (!date) {
            throw NOT_CORRECT_DATE;
        }

        return editEvent(id, 'eventDate', date);
    };

    /**
     * Edit event callback
     * @param id - event id
     * @param newCallback - new event callback
     * @returns {*}
     */
    Calendar.prototype.editEventCallback = function (id, newCallback) {
        var error = validateEventId(id);
        if (error) throw error;
        if (!newCallback) {
            throw CALLBACK_IS_EMPTY;
        }
        if(typeof newCallback !== "function") {
            throw NOT_CORRECT_CALLBACK;
        }

        var editedEvent;

        eventList = eventList.map(function (event) {
            if (event.id === id) {
                editedEvent = Object.assign({}, event, {callback: newCallback});
                return editedEvent;
            }
            return event;
        });

        return editedEvent;
    };

    /**
     * Check event by id
     * @param id - event id
     * @returns {*}
     */
    function validateEventId(id) {
        if (!id) {
            return NOT_CORRECT_ID;
        }

        var eventListId = eventList.find(function (event) {
            return (event.id === id);
        });

        if(!eventListId) {
            return NOT_CORRECT_ID;
        }

        return null;
    };

    /**
     * Get all event
     * @returns {Array}
     */
    Calendar.prototype.getAllEvent = function() {
        return eventList.map(function (event) {
            return Object.assign({}, event);
        });
    };

    /**
     * Get event list for period
     * @param startDate - start day of period
     * @param stopDate - end day of period
     * @returns {Array.<*>}
     */
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

    /**
     * Get event list for month
     * @returns {Array.<*>}
     */
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

    /**
     * Get event list for week
     * @returns {Array.<*>}
     */
    Calendar.prototype.getEventsListForWeek = function () {
        var currentDate = new Date();
        var startDayOfAWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay() + 1);
        var endDayOfAWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay() + 7, 23, 59, 59, 999);

        var eventListByWeek = eventList.filter(function (event) { // tODO
            if ((event.eventDate >= startDayOfAWeek && event.eventDate <= endDayOfAWeek)) {
                return Object.assign({}, event)
            }
        });

        return eventListByWeek;
    };

    /**
     * Get event list for day
     * @returns {Array.<*>}
     */
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

    /**
     * Observer
     * @constructor
     */
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
    Calendar.prototype.NOT_CORRECT_ID = NOT_CORRECT_ID;
    Calendar.prototype.NOT_CORRECT_DATE = NOT_CORRECT_DATE;
    Calendar.prototype.parseEventDate = parseEventDate;

    return new Calendar();
})();