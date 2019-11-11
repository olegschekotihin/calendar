var Reminder = (function (Calendar) {
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';
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
        if(isNaN(valueTime)) {
            return console.log(NOT_CORRECT_TIMEVALUE);
        }

        if(timeFlag === dayTimeFlag) {
            var timeToRemindDay;
            return timeToRemindDay = valueTime * dayMileseconds;
        } else if(timeFlag === hourTimeFlag) {
            var timeToRemindHour;
            return timeToRemindHour = valueTime * hourMileseconds;
        } else if(timeFlag === minuteTimeFlag) {
            var timeToRemindMinute;
            return timeToRemindMinute = valueTime * minuteMileseconds;
        }

        return console.log(INPUT_DATA_IS_NOT_VALID);
    }

    /* Find time to remind */

    function findTimeToRemind(id, timeFlag) {
        var eventForId = searchEventByID(id);
        var timeToRemind;
        var parsEeventForIdTime = (eventForId.eventDate).getTime();

        if(timeFlag === dayTimeFlag) {
            return timeToRemind = parsEeventForIdTime - timeToRemindDay;
        } else if(timeFlag === hourTimeFlag) {
            return timeToRemind = parsEeventForIdTime - timeToRemindHour;
        } else if(timeFlag === minuteTimeFlag) {
            return timeToRemind = parsEeventForIdTime - timeToRemindMinute;
        }

        return console.log(NOT_CORRECT_TIMEFLAG);
    }

    /* Remind callback */

    function remindCallback() {
        return console.log('Remind to ' + this.eventName);
    }

    /*Remind event for id*/

    Calendar.remindEvent = function (id, valueTime, timeFlag) {
        if (!id || !valueTime || !timeFlag || !remindCallback) {
            return console.log(INPUT_DATA_IS_NOT_VALID);
        }

        var eventForId = searchEventByID(id);
        var timeToRemind = new Date(findTimeToRemind());
        var parseTimeToRemind = timeToRemind.toString();

        Calendar.createEvent('Remind to event: ' + eventForId.eventName, parseTimeToRemind, remindCallback);
    };

    return Calendar;
})(Calendar);