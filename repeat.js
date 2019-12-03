var Repeat = (function (Calendar) {

    var repeatedEventList = [];
    var dayMileseconds = 86400000;
    var NOT_CORRECT_ID = 'Enter the correct id';
    var ARRAY_IS_EMPTY = 'days array is empty';
    var EVENT_NOT_FOUND = 'event not found';
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';
    var DAY_IS_NOT_ARRAY = 'The days must be in array!';
    var MAX_LENGTH_IS_NOT_CORRECT = 'Max length of days array is 7 and values from 0 to 7!';

    /* Run callback events */

    var runCallbacksRepeatsEvents = function (callbackList) {
        console.log("callbackList", callbackList);
        callbackList.forEach(function (callbackItem) {
            console.log("callbackItem", callbackItem);
            callbackItem();
        });
    };

    /* Check array of days */

    function checkArrayDays(days) {
        if (!Array.isArray(days)) {
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

    /* Remove event */

    function removeRepitedEvent(id) {
        repeatedEventList = repeatedEventList.filter(function (event) {
            return event.id !== id
        });
    };

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

    function findRepeatEvent(id) {
        var repeatEventId = repeatedEventList.find(function (repeatedEvent) {
            return (repeatedEvent.id === id);
        });

        return repeatEventId;
    }

    /* New repeat callback */
    
    function callbackRepeatEvent() {
        Calendar.observable.subscribe(function (data) {
            var repeatEvent = findRepeatEvent(data.id);

            if(repeatEvent.id === data.id) {
                if(repeatEvent.id.length) {
                    console.log('ATATA');
                }
                var dateInMilleseconds = data.eventDate.getTime() + dayMileseconds;
                var parsedDate = new Date(dateInMilleseconds);
                var newRepeatedEvent = Calendar.__proto__.createEvent(data.eventName, parsedDate, data.callback);

                removeRepitedEvent(repeatEvent.id);
                repeatedEventList.push(newRepeatedEvent);

                return newRepeatedEvent;
            }
        });
    };

    function newRepeatCallback(days, newRepeatEvent, callbackList) {
        //return callbackRepeatEvent();

                // if (data.id === newRepeatEvent.id) {
                //     console.log(data.eventDate.getTime());
                //     var dateInMilleseconds = data.eventDate.getTime() + dayMileseconds;
                //     var parsedDate = new Date(dateInMilleseconds);
                //     console.log(parseDate);
                //     return Calendar.createEvent(data.eventName, parsedDate, data.callback);
                // }


        //     if (days) {
        //         return function () {
        //             var stringDate = new Date(findClosestDay(days)).toISOString();
        //             return Calendar.createEvent(repeatEvent.eventName, stringDate,  function() {
        //                 return runCallbacksRepeatsEvents(callbackList);
        //             });
        //         };
        //     }
        //
        //     return function () {
        //         Calendar.observable.subscribe(function (data) {
        //             if( obs === Object && obs.id === newRepeatEvent.id) {
        //                 var parseDate = new Date(Date.parse(eventDate)) + dayMileseconds;
        //                 return Calendar.createEvent(data.eventName, parseDate, data.callback);
        //             }
        //         });
        //
        //         console.log('obs is', obs);
        //         console.log('obs id is', obs.id);
        //
        //         if( obs === Object && obs.id === newRepeatEvent.id) {
        //             var repeatEvent = obs
        //         } else {
        //             var repeatEvent = newRepeatEvent;
        //         }
        //         var stringDate = new Date(Date.now() + dayMileseconds).toISOString();
        //         return Calendar.createEvent(repeatEvent.eventName, stringDate,  function() {
        //             return runCallbacksRepeatsEvents(callbackList);
        //         });
        //     };
        // }

        // const oldOne = Calendar.__proto__.eventTriggered;
        // Calendar.__proto__.eventTriggered = function (event) {
        //
        //     console.log('event triggered', event);
        //     oldOne();
    };

    /* Create repeat event */

    Calendar.createEvent = function (eventName, eventDate, callback, days) {

        if (days && Array.isArray(days)) {
            var repeatEvent = Calendar.__proto__.createEvent(eventName, eventDate, callback);
            console.log(repeatEvent);
            //var repeatEventId = repeatEvent.id;

            //console.log('repeatEventId', repeatEventId);

            //var callbackList = [];

            // callbackList.push(callback, newRepeatCallback(days, repeatEvent, callbackList));
            //callbackList.push(callback);
            //console.log('callbackList is ', callbackList);


            repeatedEventList.push(repeatEvent);

            repeatedEventList.map(function (repeatedevent) {

            });

            console.log('repeatedEvents', repeatedEventList);

            callbackRepeatEvent();
            return repeatEvent;
        }

        Calendar.__proto__.createEvent(eventName, eventDate, callback);
    };

    return Calendar;
})(Calendar);