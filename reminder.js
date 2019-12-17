var Reminder = (function (Calendar) {
    var NOT_CORRECT_TIMEVALUE = 'Time value must be number'
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';
    var NOT_CORRECT_TIMEFLAG = 'time flag is not correct, please use "d" or "h" or "m"';

    var remindEventList = [];

    var dayTimeFlag = 'd';
    var hourTimeFlag = 'h';
    var minuteTimeFlag = 'm';

    var dayMileseconds = 86400000;
    var hourMileseconds = 3600000;
    var minuteMileseconds = 60000;

    /* Find event for id */

    function findEventForId(id) {
        var allEvent = Calendar.showAllEvent();

        var searchEventForId = allEvent.find(function (event) {
            if (event.id === id) {
                return Object.assign({}, event);
            }
        });
        return searchEventForId;
    }

    /* Find remind event for id */

    function searchRemindEventById(id) {
        console.log('remindEventList', remindEventList);
        var resultEventSearch = remindEventList.find(function (event) {
            return (event.parentId === id);
        });

        return resultEventSearch;
    }

    /* Check param of edit remind event */

    function checkEditRemindEvent(id, newEventDate, parsedNewEventDay) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }

        if (!newEventDate || isNaN(parsedNewEventDay)) {
            throw NOT_CORRECT_DATE;
        }
    }

    /* End of check of edit remind event */

    /* Get time to remind*/

    function getTimeToRemind(valueTime, timeFlag) {
        if (isNaN(valueTime)) {
            throw NOT_CORRECT_TIMEVALUE;
        }

        if (timeFlag === dayTimeFlag) {
            return valueTime * dayMileseconds;
        } else if (timeFlag === hourTimeFlag) {
            return valueTime * hourMileseconds;
        } else if (timeFlag === minuteTimeFlag) {
            return valueTime * minuteMileseconds;
        }

        throw INPUT_DATA_IS_NOT_VALID;
    }

    /* Find time to remind */

    function findTimeToRemind(id, valueTime, timeFlag) {
        var eventForId = findEventForId(id);
        var parsEventForIdTime = (eventForId.eventDate).getTime();

        var timeToRemindToEvent = getTimeToRemind(valueTime, timeFlag);

        console.log(getTimeToRemind(valueTime, timeFlag));

        if (timeFlag === dayTimeFlag) {
            return parsEventForIdTime - timeToRemindToEvent;
        } else if (timeFlag === hourTimeFlag) {
            return parsEventForIdTime - timeToRemindToEvent;
        } else if (timeFlag === minuteTimeFlag) {
            return parsEventForIdTime - timeToRemindToEvent;
        }

        throw NOT_CORRECT_TIMEFLAG;
    }

    /* Find closest event*/

    function findClosestEvent() {
        var currentTime = new Date();
        var currentYear = currentTime.getFullYear();
        var currentMonth = currentTime.getMonth();
        var currentDay = currentTime.getDay();
        var currentMinutes = currentTime.getMinutes();
        var currentSeconds = currentTime.getSeconds();

        var allEventsList = Calendar.showAllEvent();

        var closestEventList = allEventsList.filter(function (event) {
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

    /* Remind to all event */

    function runRemindToAllEvent(valueTime, timeFlag) {
        var eventList = findClosestEvent();

        var closestEvent = findClosestEvent();

        console.log('closestEvent', closestEvent);

        // eventList.forEach(function (event) {
        //     var timeToEvent = (event.eventDate).getTime();
        //     var remindTimeToAllEvents = getTimeToRemind(valueTime, timeFlag);
        //     var parseTimeToEvent = new Date(timeToEvent - remindTimeToAllEvents);
        //     var timeToRemind = parseTimeToEvent.toString();
        //
        //     if(event.done === false) {
        //         var remindEvent = Calendar.createEvent('Remind to event: ' + event.eventName, timeToRemind, remindCallback);
        //         remindEventList.push(remindEvent);
        //         return remindEvent;
        //     }
        // })
    }

    /* Remind callback */

    function remindCallback() {
        return console.log('Remind to ' + this.eventName);
    }
    //
    // /* Remind event for id */
    //
    // Calendar.remindEvent = function (id, valueTime, timeFlag) {
    //     if (!id || !valueTime || !timeFlag) {
    //         throw INPUT_DATA_IS_NOT_VALID;
    //     }
    //
    //     var eventForId = findEventForId(id);
    //     var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
    //     var parseTimeToRemind = timeToRemind.toString();
    //     var remindEvent = Calendar.createEvent('Remind to event: ' + eventForId.eventName, parseTimeToRemind, remindCallback);
    //
    //     remindEventList.push(remindEvent);
    //
    //
    //     // Calendar.observable.subscribe(function (data) {
    //     //     var remindEventForId = searchRemindEventById(data);
    //     //
    //     //     if(remindEventForId && data) {
    //     //         var eventForId = searchEventByID(id);
    //     //         var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
    //     //         var parseTimeToRemind = timeToRemind.toString();
    //     //         var remindEvent = Calendar.createEvent('Remind to event: ' + eventForId.eventName, parseTimeToRemind, remindCallback);
    //     //         return remindEvent;
    //     //     }
    //     // });
    //
    //     return remindEvent;
    //
    // };

    /* Create remind event for id */

    Calendar.createRemindEvent = function (id, valueTime, timeFlag) {
        if (!id || !valueTime || !timeFlag) {
            return console.log(INPUT_DATA_IS_NOT_VALID);
        }

        var eventForId = findEventForId(id);
        var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
        var parseTimeToRemind = timeToRemind.toString();

        var parentEvent = {
          parentId: id
        };

        var remindEvent = Calendar.__proto__.createEvent('Remind to event: ' + eventForId.eventName, parseTimeToRemind, remindCallback);
        var remindEventAndParentId = Object.assign({}, parentEvent, remindEvent);

        var remindEventforList = Object.assign({}, parentEvent, remindEvent);

        remindEventList.push(remindEventforList);
        return remindEventAndParentId;
    };

    /* Create remind event for all event */

    Calendar.createRemindToAllEvent = function (valueTime, timeFlag) {
        if (!valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        //console.log(getAllEvent());

        runRemindToAllEvent(valueTime, timeFlag);
    };

    //TODO Name
    var changeEvent = Calendar.__proto__.editEventDate;

    Calendar.__proto__.editEventDate = function(id, newEventDate) {
        var remindEventForId = searchRemindEventById(id);
        console.log(remindEventForId);
        var parsedNewEventDay = new Date(Date.parse(newEventDate));
        checkEditRemindEvent(id, newEventDate, parsedNewEventDay);

        if(remindEventForId && remindEventForId.parentId === id && remindEventList !== 0) {
            var newTimeToRemindEvent = newTimeToRemind(id, newEventDate);
            var remindEventId = searchRemindEventById(id);

           Calendar.editEventDate(remindEventId.id, newTimeToRemindEvent);
        }

        console.log('Reminder event is event id', id, newEventDate);
        return changeEvent(id, newEventDate);
    };

    function newTimeToRemind(id, newEventDate) {
        var oldEvent = findEventForId(id);
        var parsedOldEventTime = Date.parse(oldEvent.eventDate);
        var parsedNewEventTime = Date.parse(newEventDate);
        var remindEvent = searchRemindEventById(id);
        var parsedTimeToRemind = Date.parse(remindEvent.eventDate);
        var newTimeToEvent = parsedNewEventTime - parsedOldEventTime;
        var parsedNewTimeToRemindEvent = parsedTimeToRemind + newTimeToEvent;
        var newTimeToRemindEvent = new Date(parsedNewTimeToRemindEvent);

        return newTimeToRemindEvent;
    }

    return Calendar;
})(Calendar);