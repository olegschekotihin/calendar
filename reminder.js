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

    var closestEvent;
    var allEventsList;

    // var allEventsList = function () {
    //     return Calendar.showAllEvent();
    // };

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

    /* Find parent remind event for id */

    function searchRemindParentEventById(id) {
        console.log('remindEventList', remindEventList);
        var resultEventSearch = remindEventList.find(function (event) {
            return (event.parentId === id);
        });

        return resultEventSearch;
    }

    /* Find remind event for id */

    function searchRemindEventById(id) {
        console.log('remindEventList', remindEventList);
        var resultEventSearch = remindEventList.find(function (event) {
            return (event.id === id);
        });

        return resultEventSearch;
    }

    /* Remove event */

    function removeParentRepeatEvent(id) {
        console.log(id);
        if (!id || isNaN(id)) {
            throw ('alert');
        }

        allEventsList = allEventsList.filter(function (event) {
            return event.id !== id
        });
    };


    /* Check param of edit remind event */

    function checkEditRemindEvent(id, newEventDate, parsedNewEventDay) {
        if (!id) {
            throw NOT_CORRECT_ID;
        }

        if (!newEventDate || isNaN(parsedNewEventDay)) {
            throw NOT_CORRECT_DATE;
        }
    }

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

    function findClosestEvent(id) {
        console.log('allEventsList is', allEventsList);
        if(id) {
            removeParentRepeatEvent(id);
        }

        allEventsList.filter(function (event) {
            if(closestEvent === undefined) {
                closestEvent = event;
            }

            if(event.done === false && new Date(event.eventDate) < new Date(closestEvent.eventDate) && event.isRemindToAllEvent !== true) {
                closestEvent = event;
            }
        });
        console.log(closestEvent);
        return closestEvent;
    }

    /* Remind to all event */

    function runRemindToAllEvent(valueTime, timeFlag, id) {
        var closestEvent = findClosestEvent(id);

        console.log('closestEvent', closestEvent);

        var timeToEvent = (closestEvent.eventDate).getTime();
        var remindTimeToAllEvents = getTimeToRemind(valueTime, timeFlag);
        var parseTimeToEvent = new Date(timeToEvent - remindTimeToAllEvents);
        var timeToRemind = parseTimeToEvent.toString();

        if(closestEvent.done === false) {
            var remindEvent = Calendar.createEvent('Remind to event: ' + closestEvent.eventName, timeToRemind, remindCallback);
            var dataToRemindForAllEvent = {
              isRemindToAllEvent: true,
              parentEventToAllRemind: closestEvent.id,
              valueTime: valueTime,
              timeFlag: timeFlag
            };

            var remindEventForAll = Object.assign({}, dataToRemindForAllEvent , remindEvent);
            remindEventList.push(remindEventForAll);
            console.log('remindEventList for all event', remindEventList);
            return remindEvent;
        }
    }

    /* Remind callback */

    function remindCallback() {
        return console.log('Remind to ' + this.eventName);
    }

    /* Create remind event for id */

    Calendar.createRemindEvent = function (id, valueTime, timeFlag) {
        if (!id || !valueTime || !timeFlag) {
            return console.log(INPUT_DATA_IS_NOT_VALID);
        }

        var eventForId = findEventForId(id);
        var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
        var parsedTimeToRemind = timeToRemind.toString();

        var parentEvent = {
          parentId: id,
        };

        var remindEvent = Calendar.__proto__.createEvent('Remind to event: ' + eventForId.eventName, parsedTimeToRemind, remindCallback);
        var remindEventAndParentId = Object.assign({}, parentEvent, remindEvent);

        var remindEventforList = Object.assign({}, parentEvent, remindEvent);

        remindEventList.push(remindEventforList);
        return remindEventAndParentId;
    };

    /* Create remind event for all event */

    Calendar.createRemindToAllEvent = function (valueTime, timeFlag, id) {
        if (!valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        allEventsList = Calendar.showAllEvent();
        runRemindToAllEvent(valueTime, timeFlag, id);
    };

    //TODO Name
    var changeEvent = Calendar.__proto__.editEventDate;

    Calendar.__proto__.editEventDate = function(id, newEventDate) {
        var remindEventForId = searchRemindParentEventById(id);
        var parsedNewEventDay = new Date(Date.parse(newEventDate));
        checkEditRemindEvent(id, newEventDate, parsedNewEventDay);

        if(remindEventForId && remindEventForId.parentId === id && remindEventList !== 0) {
            var newTimeToRemindEvent = newTimeToRemind(id, newEventDate);
            var remindEventId = searchRemindParentEventById(id);

           Calendar.editEventDate(remindEventId.id, newTimeToRemindEvent);
        }

        return changeEvent(id, newEventDate);
    };

    function newTimeToRemind(id, newEventDate) {
        var oldEvent = findEventForId(id);
        var parsedOldEventTime = Date.parse(oldEvent.eventDate);
        var parsedNewEventTime = Date.parse(newEventDate);
        var remindEvent = searchRemindParentEventById(id);
        var parsedTimeToRemind = Date.parse(remindEvent.eventDate);
        var newTimeToEvent = parsedNewEventTime - parsedOldEventTime;
        var parsedNewTimeToRemindEvent = parsedTimeToRemind + newTimeToEvent;
        var newTimeToRemindEvent = new Date(parsedNewTimeToRemindEvent);

        return newTimeToRemindEvent;
    }


    Calendar.observable.subscribe(function (data) {
        var remindEvent = searchRemindEventById(data.id);

        if(remindEvent && remindEvent.id === data.id && remindEvent.isRemindToAllEvent === true && data.done === false) {
            console.log('observer remind ');
            console.log('eventToRemind', remindEvent);
            //removeParentRepeatEvent(remindEvent.parentEventToAllRemind);
            runRemindToAllEvent(remindEvent.valueTime, remindEvent.timeFlag, remindEvent.parentEventToAllRemind);
            return Calendar.removeEvent(data.id);
        }
    });

    return Calendar;
})(Calendar);