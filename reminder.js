var Reminder = (function (Calendar) {
    var NOT_CORRECT_TIMEVALUE = 'Time value must be number'
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';
    var NOT_CORRECT_TIMEFLAG = 'time flag is not correct, please use "d" or "h" or "m"';

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
        var eventList = Calendar.showAllEvent();

        eventList.forEach(function (event) {
            var timeToEvent = (event.eventDate).getTime();
            var remindTimeToAllEvents = getTimeToRemind(valueTime, timeFlag);
            var parseTimeToEvent = new Date(timeToEvent - remindTimeToAllEvents);
            var timeToRemind = parseTimeToEvent.toString();

            if(event.done === false) {
                return Calendar.createEvent('Remind to event: ' + event.eventName, timeToRemind, remindCallback)
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

        Calendar.createEvent('Remind to event: ' + eventForId.eventName, parseTimeToRemind, remindCallback);
    };

    /* Remind for all event */

    Calendar.remindToAllEvent = function (valueTime, timeFlag) {
        if (!valueTime || !timeFlag) {
            throw INPUT_DATA_IS_NOT_VALID;
        }

        runRemindToAllEvent(valueTime, timeFlag);
    };

    Calendar.observable.subscribe(function (data) {

    });

    return Calendar;
})(Calendar);