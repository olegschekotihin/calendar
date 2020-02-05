var Reminder = (function (Calendar) {
    var NOT_CORRECT_TIMEVALUE = 'Time value must be number'
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';
    var NOT_CORRECT_TIMEFLAG = 'time flag is not correct, please use "d" or "h" or "m"';
    var EVENT_LIST_IS_EMPTY = 'vent list is empty';

    var remindEventList = [];

    var dayTimeFlag = 'd';
    var hourTimeFlag = 'h';
    var minuteTimeFlag = 'm';

    var dayMileseconds = 86400000;
    var hourMileseconds = 3600000;
    var minuteMileseconds = 60000;

    var closestEvent;
    var allEventsList;

    /* Create remind event for id */

    Calendar.createRemindEvent = function (id, valueTime, timeFlag) {
        if (!id || !valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }
        var eventForId = findEventForId(id);
        var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
        var parsedTimeToRemind = timeToRemind.toString();

        // var parentEvent = {
        //     parentId: id,
        //     parentEventName: eventForId.eventName,
        // };

        var remindEvent = Calendar.createEvent('Remind to event: ' + eventForId.eventName, parsedTimeToRemind, remindCallback);
        var remindEventforList = Object.assign({}, {
            parentId: id,
            parentEventName: eventForId.eventName,
            id: remindEvent.id
        });
        //var remindEventforList = Object.assign({}, parentEvent, remindEvent.id);
        remindEventList.push(remindEventforList);
        return remindEventforList;
    };

    /**
     *
     * @param id
     */
    function findEventForId(id) {
        var allEvent = Calendar.getAllEvent();

        var searchEventForId = allEvent.find(function (event) {
            if (event.id === id) {
                return Object.assign({}, event);
            }
        });

        return searchEventForId;
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


    /* Remind callback */

    function remindCallback() {
        console.log(this.eventName);
    }

    /* Create remind event for all event */

    Calendar.createRemindToAllEvent = function (valueTime, timeFlag) {
        if (!valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        allEventsList = Calendar.getAllEvent();
        runRemindToAllEvent(valueTime, timeFlag);
    };

    /* Remind to all event */

    function runRemindToAllEvent(valueTime, timeFlag, id) {
        var closestEvent = findClosestEvent(id);

        if (closestEvent === undefined) {
            throw EVENT_LIST_IS_EMPTY;
        }

        var timeToEvent = (closestEvent.eventDate).getTime();
        var remindTimeToAllEvents = getTimeToRemind(valueTime, timeFlag);
        var parseTimeToEvent = new Date(timeToEvent - remindTimeToAllEvents);
        var timeToRemind = parseTimeToEvent.toString();

        if (closestEvent.done === false) {
            var remindEvent = Calendar.createEvent('Remind to event: ' + closestEvent.eventName, timeToRemind, remindCallback);
            // var dataToRemindForAllEvent = {
            //     isRemindToAllEvent: true,
            //     parentEventName: closestEvent.eventName,
            //     parentEventToAllRemind: closestEvent.id,
            //     valueTime: valueTime,
            //     timeFlag: timeFlag
            // };
            var remindEventForAll = Object.assign({},{
                isRemindToAllEvent: true,
                parentEventName: closestEvent.eventName,
                parentEventToAllRemind: closestEvent.id,
                valueTime: valueTime,
                timeFlag: timeFlag,
                id: remindEvent.id
            });
            //var remindEventForAll = Object.assign({}, dataToRemindForAllEvent, remindEvent);
            remindEventList.push(remindEventForAll);
            return remindEvent;
        }
    }

    /* Find closest event*/

    function findClosestEvent(id) {
        if (id) {
            removeParentRepeatEvent(id);
            closestEvent = undefined;
        }

        allEventsList.forEach(function (event) {
            if (closestEvent === undefined) {
                closestEvent = event;
            }

            if (event.done === false && new Date(event.eventDate) < new Date(closestEvent.eventDate) && event.isRemindToAllEvent !== true) {
                closestEvent = event;
            }
        });

        return closestEvent;
    }

    /* Remove event */

    function removeParentRepeatEvent(id) {
        if (!id || isNaN(id)) {
            throw NOT_CORRECT_ID;
        }

        allEventsList = allEventsList.filter(function (event) {
            return event.id !== id
        });
    }

    /* Get time to remind*/

    function getTimeToRemind(valueTime, timeFlag) {
        if (isNaN(valueTime)) {
            throw NOT_CORRECT_TIMEVALUE;
        }

        if (timeFlag === dayTimeFlag) {
            return valueTime * dayMileseconds;
        }
        if (timeFlag === hourTimeFlag) {
            return valueTime * hourMileseconds;
        }
        if (timeFlag === minuteTimeFlag) {
            return valueTime * minuteMileseconds;
        }

        throw INPUT_DATA_IS_NOT_VALID;
    }

    /* Find event for id */

    function findRemindEvent(id, propName) {
        var resultEventSearch = remindEventList.find(function (event) {
            if (event[propName] === id) {
                return Object.assign({}, event);
            }
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


    /* Edit event date */
    var nativeEditEventDate = Calendar.__proto__.editEventDate;
    Calendar.editEventDate = function (id, newEventDate) {
        checkRemindDateToAllEvent(id);
        checkRemindDateToEvent(id, newEventDate);
        return nativeEditEventDate(id, newEventDate);
    };

    /* Check remind event if date event was edit */

    function checkRemindDateToAllEvent(id) {
        if (allEventsList) {
            var findedEditedEvent = allEventsList.find(function (event) {
                return event.id === id
            });
            var remindEventForId = findRemindEvent(id, ['parentEventToAllRemind']);
            if (findedEditedEvent && remindEventForId) {
                Calendar.removeEvent(remindEventForId.id);
                runRemindToAllEvent(remindEventForId.valueTime, remindEventForId.timeFlag, remindEventForId.parentEventToAllRemind);
            }
        }
    }

    function checkRemindDateToEvent(id, newEventDate) {
        var remindEventForId = findRemindEvent(id, ['parentId']);
        var parsedNewEventDay = new Date(Date.parse(newEventDate));
        checkEditRemindEvent(id, newEventDate, parsedNewEventDay);

        if (remindEventForId && remindEventForId.parentId === id && remindEventList !== 0) {
            var newTimeToRemindEvent = newTimeToRemind(id, newEventDate);
            var remindEventId = findRemindEvent(id, ['parentId']);

            Calendar.editEventDate(remindEventId.id, newTimeToRemindEvent);
        }
    }

    function newTimeToRemind(id, newEventDate) {
        var oldEvent = findEventForId(id);
        var parsedOldEventTime = Date.parse(oldEvent.eventDate);
        var parsedNewEventTime = Date.parse(newEventDate);
        var remindEvent = findRemindEvent(id, ['parentEventToAllRemind']);
        var parsedTimeToRemind = Date.parse(remindEvent.eventDate);
        var newTimeToEvent = parsedNewEventTime - parsedOldEventTime;
        var parsedNewTimeToRemindEvent = parsedTimeToRemind + newTimeToEvent;
        var newTimeToRemindEvent = new Date(parsedNewTimeToRemindEvent);

        return newTimeToRemindEvent;
    }

    /* Edit event name */

    var nativeEditEventName = Calendar.__proto__.editEventName;
    Calendar.editEventName = function (id, newEventName) {
        checkRemindNameToAllEvent(id, newEventName);
        checkRemindNameToEvent(id,newEventName);
        return nativeEditEventName(id, newEventName);
    };

    function checkRemindNameToAllEvent(id, newEventName) {
        if(allEventsList) {
            var findedEditedEvent = allEventsList.find(function (event) {
                return event.id === id
            });
            var remindEventForId = findRemindEvent(id, ['parentEventToAllRemind']);
            if (findedEditedEvent && remindEventForId) {
                Calendar.editEventCallback(remindEventForId.id, function(){console.log('Remind to ' + newEventName)});
                return Calendar.editEventName(remindEventForId.id,'Remind to ' + newEventName);
            }
        }
    }

    function checkRemindNameToEvent(id, newEventName) {
        if(remindEventList) {
            var remindEventForId = findRemindEvent(id, ['parentId']);
            if (remindEventForId) {
                Calendar.editEventCallback(remindEventForId.id, function () {
                    console.log('Remind to ' + newEventName)
                });
                return Calendar.editEventName(remindEventForId.id, 'Remind to ' + newEventName);
            }
        }
    }

    Calendar.observable.subscribe(function (data) {
        var remindEvent = findRemindEvent(data.id, ['id']);

        if (remindEvent && remindEvent.id === data.id && remindEvent.isRemindToAllEvent === true && data.done === true) {
            Calendar.removeEvent(data.id);
            return runRemindToAllEvent(remindEvent.valueTime, remindEvent.timeFlag, remindEvent.parentEventToAllRemind);
        }
    });

    return Calendar;
})(Calendar);