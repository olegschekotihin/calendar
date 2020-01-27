var Repeat = (function (Calendar) {

    var repeatedEventList = [];
    var ARRAY_IS_EMPTY = 'days array is empty';
    var DAY_IS_NOT_ARRAY = 'The days must be in array!';
    var MAX_LENGTH_IS_NOT_CORRECT = 'Max length of days array is 7 and values from 0 to 7!';

    var nativeCreateEvent = Calendar.createEvent;

    /* Create repeat event */
    Calendar.createEvent = function (eventName, eventDate, callback, days) {
        if (!days || !Array.isArray(days)) {
            return nativeCreateEvent(eventName, eventDate, callback);
        }

        checkArrayDays(days);

        var date = Calendar.parseEventDate(eventDate);
        if (!date) {
            throw 'e';
        }
        var nextEventDate = getNextRepeatedEventDate(eventDate, days);

        var repeatEvent = nativeCreateEvent(eventName, nextEventDate, callback);

        var repeatedEventAndDays = Object.assign({}, {
            daysToRepeat: [days]
        }, repeatEvent); // TODO

        repeatedEventList.push(repeatedEventAndDays);
        return repeatEvent;
    };

    /* Check array of days */
    function checkArrayDays(days) { // TODO
        if (!Array.isArray(days)) {
            throw DAY_IS_NOT_ARRAY;
        }

        if (!days.length) {
            throw ARRAY_IS_EMPTY;
        }

        days.forEach(function (days) {
            if (days > 6 || days < 0 || days > 7) {
                throw MAX_LENGTH_IS_NOT_CORRECT;
            }
        });

        return true;
    }

    /* Remove event */
    function removeRepitedEvent(id) {
        repeatedEventList = repeatedEventList.filter(function (event) {
            return event.id !== id
        });
    }

    function searchClosestDay(day, currentDay, closestDay) {
        var daysDifference = day - currentDay;

        if (daysDifference < 0) {
            closestDay = daysDifference + 7;
        }

        if(daysDifference > 0 && daysDifference < closestDay) {
            closestDay = daysDifference
        }

        return closestDay;
    }

    function getNextRepeatedEventDate(eventDate, days, done) {
        var currentDate = new Date();
        var parsedEventDate = new Date(Date.parse(eventDate));
        var currentDay = currentDate.getDay();

        // var closestDay = getClosestDay(eventDate, days);
        // TODO use reduce
        var closestDay = 6;
        days.forEach(function (day) {
            if ((day === currentDay && currentDate > parsedEventDate) || (day !== currentDay) || (done && done === true)) {
                closestDay = searchClosestDay(day, currentDay, closestDay);
            }

            if(day === currentDay && currentDate <= parsedEventDate) {
                closestDay = day
            }
        });

        var isUnderstandableName = currentDay === closestDay && currentDate <= parsedEventDate;

        return eventTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), (isUnderstandableName ? currentDate.getDate() : currentDate.getDate() + closestDay),
            parsedEventDate.getHours(), parsedEventDate.getMinutes(), parsedEventDate.getSeconds());
    }

    /* Callback for repeat event */
    Calendar.observable.subscribe(function (data) {
        var repeatEvent = findRepeatEvent(data.id);

        if (!repeatEvent.daysToRepeat) { // TODO add condition
            return;
        }

        var eventTime = getNextRepeatedEventDate(data.eventDate, repeatEvent.daysToRepeat[0], data.done);
        var newRepeatedEvent = nativeCreateEvent(data.eventName, eventTime, data.callback);

        var repeatedEventAndDays = Object.assign({}, {
            daysToRepeat: repeatEvent.daysToRepeat,
            id: newRepeatedEvent.id
        });

        Calendar.removeEvent(data.id);
        removeRepitedEvent(repeatEvent.id);
        repeatedEventList.push(repeatedEventAndDays);
        return newRepeatedEvent;
    });

    /* Find repeat event for id */
    function findRepeatEvent(id) {
        var repeatEventForId = repeatedEventList.find(function (repeatedEvent) {
            return (repeatedEvent.id === id);
        });

        return repeatEventForId;
    }


    return Calendar;
})(Calendar);