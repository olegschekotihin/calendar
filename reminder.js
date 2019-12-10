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

    /*Find by id*/

    function searchEventByID(id) {
        console.log(Calendar.findById(id)[0]);
        return Calendar.findById(id)[0];
    }

    /* Find remind event for id */

    function searchRemindEventById(id) {
        var resultEventSearch = remindEventList.find(function (event) {
            return (event.id === id);
        });

        return resultEventSearch
    }

    /* End find remind event for id */

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
        var eventForId = searchEventByID(id);
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

    function runRemindToAllEvent(valueTime, timeFlag) {
        var eventList = Calendar.__proto__.showAllEvent();

        eventList.forEach(function (event) {
            var timeToEvent = (event.eventDate).getTime();
            var remindTimeToAllEvents = getTimeToRemind(valueTime, timeFlag);
            var parseTimeToEvent = new Date(timeToEvent - remindTimeToAllEvents);
            var timeToRemind = parseTimeToEvent.toString();

            if(event.done === false) {
                var remindEvent = Calendar.createEvent('Remind to event: ' + event.eventName, timeToRemind, remindCallback);
                remindEventList.push(remindEvent);
                return remindEvent;
            }
        })
    }

    /* Remind callback */

    function remindCallback() {
        return console.log('Remind to ' + this.eventName);
    }

    /* Remind event for id */

    Calendar.remindEvent = function (id, valueTime, timeFlag) {
        if (!id || !valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        var eventForId = searchEventByID(id);
        var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
        var parseTimeToRemind = timeToRemind.toString();
        var remindEvent = Calendar.createEvent('Remind to event: ' + eventForId.eventName, parseTimeToRemind, remindCallback);

        remindEventList.push(remindEvent);


        Calendar.observable.subscribe(function (data) {
            var remindEventForId = searchRemindEventById(data);

            if(remindEventForId && data) {
                var eventForId = searchEventByID(id);
                var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
                var parseTimeToRemind = timeToRemind.toString();
                var remindEvent = Calendar.createEvent('Remind to event: ' + eventForId.eventName, parseTimeToRemind, remindCallback);
                return remindEvent;
            }
        });

        return remindEvent;

    };

    /* Create remind event for id */

    Calendar.createRemindEvent = function (id, valueTime, timeFlag) {
        if (!id || !valueTime || !timeFlag) {
            return console.log(INPUT_DATA_IS_NOT_VALID);
        }

        var eventForId = searchEventByID(id);
        var timeToRemind = new Date(findTimeToRemind(id, valueTime, timeFlag));
        var parseTimeToRemind = timeToRemind.toString();

        var remindEvent = Calendar.createEvent('Remind to event: ' + eventForId.eventName, parseTimeToRemind, remindCallback);

        remindEventList.push(remindEvent);
        return remindEvent;
    };

    /* Create remind event for all event */

    Calendar.createRemindToAllEvent = function (valueTime, timeFlag) {
        if (!valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        console.log(getAllEvent());

        runRemindToAllEvent(valueTime, timeFlag);
    };



    Calendar.observable.subscribe(function (data) {
        if(data) {

        }
    });

    var changedRemindEvent = Calendar.__proto__.editEventDate;

    Calendar.__proto__.editEventDate = function(id, newEventDate) {
        var remindEventForId = searchRemindEventById(id);

        if(remindEventForId && remindEventForId.id === data.id && remindEventList !== 0) {
            console.log('Remind event is TRUE');
        }

        console.log('Reminder event is event id', id, newEventDate);
        return changedRemindEvent(id, newEventDate);
    };

    return Calendar;
})(Calendar);