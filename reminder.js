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

    /* Find event for id */

    function findEventForId(id) {
        var allEvent = Calendar.getAllEvent();

        var searchEventForId = allEvent.find(function (event) {
            if (event.id === id) {
                return Object.assign({}, event);
            }
        });

        return searchEventForId;
    }

    /* Find parent remind event for id */

    function searchRemindParentEventById(id) {
        var resultEventSearch = remindEventList.find(function (event) {
            if (event.parentEventToAllRemind === id) {
                return Object.assign({}, event);
            }
        });

        return resultEventSearch;
    }

    /* Find remind event for id */

    function searchRemindEventById1(id) {
        var resultEventSearch = remindEventList.find(function (event) {
            return (event.parentId === id);
        });

        return resultEventSearch;
    }

    /* Find parent remind event for id */

    function searchRemindEventById(id) {
        var resultEventSearch = remindEventList.find(function (event) {
            return (event.id === id);
        });

        return resultEventSearch;
    }

    /* Remove event */

    function removeParentRepeatEvent(id) {
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
        if (id) {
            removeParentRepeatEvent(id);
            closestEvent = undefined;
        }

        allEventsList.filter(function (event) {
            if (closestEvent === undefined) {
                closestEvent = event;
            }

            if (event.done === false && new Date(event.eventDate) < new Date(closestEvent.eventDate) && event.isRemindToAllEvent !== true) {
                return closestEvent = event;
            }
        });
        //console.log(closestEvent);
        return closestEvent;
    }

    /* Remind to all event */

    function runRemindToAllEvent(valueTime, timeFlag, id) {
        var closestEvent = findClosestEvent(id);

        if (closestEvent === undefined) {
            return console.log('Event list is empty');
        }

        var timeToEvent = (closestEvent.eventDate).getTime();
        var remindTimeToAllEvents = getTimeToRemind(valueTime, timeFlag);
        var parseTimeToEvent = new Date(timeToEvent - remindTimeToAllEvents);
        var timeToRemind = parseTimeToEvent.toString();

        if (closestEvent.done === false) {
            var remindEvent = Calendar.createEvent('Remind to event: ' + closestEvent.eventName, timeToRemind, remindCallback);
            var dataToRemindForAllEvent = {
                isRemindToAllEvent: true,
                parentEventName: closestEvent.eventName,
                parentEventToAllRemind: closestEvent.id,
                valueTime: valueTime,
                timeFlag: timeFlag
            };

            var remindEventForAll = Object.assign({}, dataToRemindForAllEvent, remindEvent);
            remindEventList.push(remindEventForAll);
            return remindEvent;
        }
    }

    /* Create remind event for id */

    Calendar.createRemindEvent = function (id, valueTime, timeFlag) {
        if (!id || !valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        var eventForId = findEventForId(id);
        console.log('eventForId is', eventForId);
        var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
        var parsedTimeToRemind = timeToRemind.toString();

        var parentEvent = {
            parentId: id,
            parentEventName: eventForId.eventName
        };

        var remindEvent = Calendar.__proto__.createEvent('Remind to event: ' + eventForId.eventName, parsedTimeToRemind, remindCallback);
        var remindEventAndParentId = Object.assign({}, parentEvent, remindEvent);

        var remindEventforList = Object.assign({}, parentEvent, remindEvent);
        console.log('remindEventforList', remindEventforList);
        remindEventList.push(remindEventforList);
        return remindEventforList;
    };


    /* Remind callback */

    function remindCallback() {
        return console.log(this.eventName);
    }

    /* Create remind event for all event */

    Calendar.createRemindToAllEvent = function (valueTime, timeFlag, id) {
        if (!valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        allEventsList = Calendar.getAllEvent();
        runRemindToAllEvent(valueTime, timeFlag, id);
    };

    /* Check remind event if date event was edit */

    function checkRemindDateToAllEvent(id) {
        if (allEventsList) {
            var findedEditedEvent = allEventsList.filter(function (event) {
                return event.id === id
            });
            var remindEventForId = searchRemindParentEventById(id);
            if (findedEditedEvent && remindEventForId) {
                Calendar.removeEvent(remindEventForId.id);
                runRemindToAllEvent(remindEventForId.valueTime, remindEventForId.timeFlag, remindEventForId.parentEventToAllRemind);
            }
        }
    }

    function checkRemindDateToEvent(id, newEventDate) {
        var remindEventForId = searchRemindEventById1(id);
        var parsedNewEventDay = new Date(Date.parse(newEventDate));
        checkEditRemindEvent(id, newEventDate, parsedNewEventDay);

        if (remindEventForId && remindEventForId.parentId === id && remindEventList !== 0) {
            var newTimeToRemindEvent = newTimeToRemind(id, newEventDate);
            var remindEventId = searchRemindEventById1(id);

            Calendar.editEventDate(remindEventId.id, newTimeToRemindEvent);
        }
    }


    function checkRemindNameToAllEvent(id, newEventName) {
        if(allEventsList) {
            var findedEditedEvent = allEventsList.filter(function (event) {
                return event.id === id
            });
            var remindEventForId = searchRemindParentEventById(id);
            if (findedEditedEvent && remindEventForId) {
                Calendar.editEventCallback(remindEventForId.id, function(){console.log('Remind to ' + newEventName)});
                return Calendar.editEventName(remindEventForId.id,'Remind to ' + newEventName);
            }
        }
    }


    function checkRemindNameToEvent(id, newEventName) {
        if(remindEventList) {
            var remindEventForId = searchRemindEventById1(id);
            if (remindEventForId) {
                Calendar.editEventCallback(remindEventForId.id, function () {
                    console.log('Remind to ' + newEventName)
                });
                return Calendar.editEventName(remindEventForId.id, 'Remind to ' + newEventName);
            }
        }
    }

    function newEventCallback(newEventName) {
        return console.log(newEventName);
    }

    /* Edit event date */

    Calendar.editEventDate = function (id, newEventDate) {
        checkRemindDateToAllEvent(id);
        checkRemindDateToEvent(id, newEventDate);
        return Calendar.__proto__.editEventDate(id, newEventDate);
    };

    /* Edit event name */

    Calendar.editEventName = function (id, newEventName) {
        checkRemindNameToAllEvent(id, newEventName);
        checkRemindNameToEvent(id,newEventName);
        return Calendar.__proto__.editEventName(id, newEventName);
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

        if (remindEvent && remindEvent.id === data.id && remindEvent.isRemindToAllEvent === true && data.done === true) {
            Calendar.removeEvent(data.id);
            return runRemindToAllEvent(remindEvent.valueTime, remindEvent.timeFlag, remindEvent.parentEventToAllRemind);
        }
    });

    return Calendar;
})(Calendar);