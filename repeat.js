var Repeat = (function (Calendar) {

    var repeatedEventList = [];
    var dayMileseconds = 86400000;
    var NOT_CORRECT_ID = 'Enter the correct id';
    var ARRAY_IS_EMPTY = 'days array is empty';
    var EVENT_NOT_FOUND = 'event not found';
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';
    var DAY_IS_NOT_ARRAY = 'The days must be in array!';
    var MAX_LENGTH_IS_NOT_CORRECT = 'Max length of days array is 7 and values from 0 to 7!';
    var eventTime;

    /* Check array of days */

    function checkArrayDays(days) {
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
    };

    /* Find closest day on number */

    function findClosestDay(days) {
        console.log('days', days);
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

    /* Find repeat event for id */

    function findRepeatEvent(id) {
        var repeatEventForId = repeatedEventList.find(function (repeatedEvent) {
            return (repeatedEvent.id === id);
        });

        return repeatEventForId;
    }

    /* Callback for repeat event */

    Calendar.observable.subscribe(function (data) {
        var repeatEvent = findRepeatEvent(data.id);

        if (repeatEvent && repeatEvent.id === data.id && repeatEvent.daysToRepeat !== 0) {
            var currentDate = new Date();
            var currentDay = currentDate.getDay();
            var repeatEventDay = repeatEvent.daysToRepeat.find(function (el) {
                return (el === currentDay)
            });
            if (!repeatEventDay) {

            }
            parseEventDate(data.eventDate, repeatEvent.daysToRepeat, data.done);
            var newRepeatedEvent = Calendar.createEvent(data.eventName, eventTime, data.callback);

            var daysToRepeat = {
                daysToRepeat: repeatEvent.daysToRepeat
            };

            var repeatedEventAndDays = Object.assign({}, daysToRepeat, newRepeatedEvent);

            removeRepitedEvent(repeatEvent.id);
            repeatedEventList.push(repeatedEventAndDays);
            return newRepeatedEvent;
        }
        ;

        if (repeatEvent && repeatEvent.id === data.id) {
            var dateInMilleseconds = data.eventDate.getTime() + dayMileseconds;
            var parsedDate = new Date(dateInMilleseconds);
            var newRepeatedEvent = Calendar.createEvent(data.eventName, parsedDate, data.callback);

            removeRepitedEvent(repeatEvent.id);
            repeatedEventList.push(newRepeatedEvent);

            return newRepeatedEvent;
        }
    });

    /* Create repeat event */

    Calendar.createEvent = function (eventName, eventDate, callback, days) {
        if (days && Array.isArray(days)) {
            checkArrayDays(days);
            parseEventDate(eventDate, days);
            var repeatEvent = Calendar.createEvent(eventName, eventTime, callback);

            var daysToRepeat = {
                daysToRepeat: [days]
            };

            var repeatedEventAndDays = Object.assign({}, daysToRepeat, repeatEvent);

            repeatedEventList.push(repeatedEventAndDays);
            return repeatEvent;
        }

        return Calendar.__proto__.createEvent(eventName, eventDate, callback);
    };

    /* Parse event date */

    function parseEventDate(eventDate, days, done) {
        var currentDate = new Date();
        var currentDay = currentDate.getDay();

        if (typeof eventDate === "string" || typeof eventDate === "number" && Date.parse(eventDate)) {
            var parsedStringDate = new Date(Date.parse(eventDate));
            var eventHour = parsedStringDate.getHours();
            var eventMinutes = parsedStringDate.getMinutes();
            var eventSeconds = parsedStringDate.getSeconds();

            if (parsedStringDate < currentDate) {
                parsedStringDate = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                    currentDate.getDate(), eventHour, eventMinutes, eventSeconds)
            }

            var isTryDay = days.find(function (day) {
                return (currentDay === day)
            });

            var sortDay = days.sort();
            var minDay = days.length > 1 ? sortDay[0] : days[0];

            if (!isTryDay && minDay > currentDay) {
                return eventTime = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                    currentDate.getDate() - currentDate.getDay() + minDay, eventHour, eventMinutes, eventSeconds);
            }

            if (!isTryDay && minDay < currentDay) {
                return eventTime = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                    currentDate.getDate() + (7 - currentDate.getDay()) + minDay, eventHour, eventMinutes, eventSeconds);
            }

            return eventTime = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                currentDate.getDate(), eventHour, eventMinutes, eventSeconds);
        }
        // if(typeof eventDate === "number" && new Date(eventDate)) {
        //     var parsedNumberDate = new Date(eventDate);
        //
        //     var eventHour = parsedNumberDate.getHours();
        //     var eventMinutes = parsedNumberDate.getMinutes();
        //     var eventSeconds = parsedNumberDate.getSeconds();
        //
        //     var isTryDay = days.find(function (day) {
        //         return (currentDay === day)
        //     });
        //
        //     var sortDay = days.sort();
        //     var minDay = days.length > 1 ? sortDay[0] : days[0];
        //
        //     if(!isTryDay) {
        //         return eventTime = new Date(currentDate.getFullYear(), currentDate.getMonth(),
        //             currentDate.getDate() - currentDate.getDay() + minDay, eventHour, eventMinutes, eventSeconds);
        //     }
        //
        //     return eventTime = new Date(currentDate.getFullYear(), currentDate.getMonth(),
        //         currentDate.getDate(), eventHour, eventMinutes, eventSeconds);
        // }
        if (typeof eventDate === "object" && eventDate.getTime()) {
            var eventHour = eventDate.getHours();
            var eventMinutes = eventDate.getMinutes();
            var eventSeconds = eventDate.getSeconds();

            if (done === true) {
                var tryDay = days[0].find(function (day) {
                    if (day !== currentDay) {
                        return day;
                    }
                });

                return eventTime = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                    currentDate.getDate() - currentDate.getDay() + tryDay, eventHour, eventMinutes, eventSeconds);
            }

            return eventTime = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                currentDate.getDate(), eventHour, eventMinutes, eventSeconds);
        }
    }

    function searchClosestDay(eventDate, days, currentDate) {
        var closestDay;
        var parsedEventDate = new Date(Date.parse(eventDate));
        var currentDay = currentDate.getDay();

        var daysList = days.filter(function (day) {
            if (day === currentDay && currentDate >= parsedEventDate) {
                return day;
            }
            if (day !== currentDay) {
                var x = day - currentDay;

                if (x < 0) {
                    return x = x + 7;
                }

                return x;
            }
        });

        return closestDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay() + x,
            parsedEventDate.getHours(), parsedEventDate.getMinutes(), parsedEventDate.getSeconds());
    }

    return Calendar;
})(Calendar);