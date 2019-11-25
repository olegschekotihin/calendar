var Repeat = (function (Calendar) {

    var dayMileseconds = 86400000;
    var NOT_CORRECT_ID = 'Enter the correct id';
    var ARRAY_IS_EMPTY = 'days array is empty';
    var EVENT_NOT_FOUND = 'event not found';
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';
    var DAY_IS_NOT_ARRAY = 'The days must be in array!';
    var MAX_LENGTH_IS_NOT_CORRECT = 'Max length of days array is 7 and values from 0 to 7!';

    /* Run callback events */

    var runCallbacksRepeatsEvents = function (callbackList) {
        callbackList.forEach(function (callbackItem) {
            callbackItem();
        });
    };

    /* Check array */

    function isValidArray(arr) {
        return Array.isArray(arr);
    }

    /* Check array of days */

    function checkArrayDays(days) {
        if (!isValidArray(days)) {
            console.log(DAY_IS_NOT_ARRAY);
            return false;
        }

        if (!days.length) {
            console.log(ARRAY_IS_EMPTY);
            return false;
        }

        days.forEach(function (days) {
            if (days > 6 || days < 0 || days > 7) {
                console.log(MAX_LENGTH_IS_NOT_CORRECT);
                return false;
            }
        });

        return true;
    }

    /* Find closest day on number */

    function findClosestDay(days) {
        var currentDate = new Date();
        var currentDay = new Date().getDay();
        var closestEventDay = null;
        currentDay = currentDay === 0 ? 7 : currentDay;
        days.sort();

        days.forEach(function (day) {
            if (!closestEventDay && currentDay < day) {
                closestEventDay = day;
            }
        });

        if (closestEventDay) {
            return currentDate.setDate(currentDate.getDate() + (closestEventDay - currentDay));
        }
        closestEventDay = days[0];

        return currentDate.setDate(currentDate.getDate() - currentDay + closestEventDay + 7);
    }

    /* New repeat callback */

    function newRepeatCallback(days, eventName, repeatEventId, callbackList) {

        if (days) {
            return function () {
                var stringDate = new Date(findClosestDay(days)).toISOString();
                return Calendar.createEvent(eventName, stringDate,  function() {
                    return runCallbacksRepeatsEvents(callbackList);
                });
            };
        }

        return function () {
            var currentEvent = Calendar.observer.broadcast(repeatEventId);
            console.log('currentEvent broadcast', currentEvent);
            var stringDate = new Date(Date.now() + dayMileseconds).toISOString();
            return Calendar.createEvent(eventName, stringDate,  function() {
                return runCallbacksRepeatsEvents(callbackList);
            });
        };
    }

    const oldOne = Calendar.__proto__.eventTriggered;
    Calendar.__proto__.eventTriggered = function (event) {

        console.log('event triggered', event);
        oldOne();
    };

    /* Create repeat event */

    Calendar.createRepeatEvent = function (eventName, eventDate, callback, days) {

        if (!eventName || !eventDate || !callback) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        if (days && !checkArrayDays(days)) {
            throw MAX_LENGTH_IS_NOT_CORRECT;
        }

        var newRepeatEvent = Calendar.createEvent(eventName, eventDate,function() {
            return runCallbacksRepeatsEvents(callbackList);
        });

        var repeatEventId = newRepeatEvent.id;

        console.log('repeatEventId', repeatEventId);

        var callbackList = [];
        callbackList.push(callback, newRepeatCallback(days, eventName, repeatEventId, callbackList));

        console.log('callbackList is ', callbackList);

        return newRepeatEvent;
    };

    return Calendar;
})(Calendar);