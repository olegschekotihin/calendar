var Reminder = (function (Calendar) {
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';

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

    // function remindCallback(id, remindCallback) {
    //     var callbackList = [];
    //     var eventForId = searchEventByID(id);
    //
    //     callbackList.push(eventForId.callback, remindCallback);
    //     return function () {
    //         callbackList.forEach(callbackItem)
    //         {
    //             callbackItem();
    //         }
    //     }
    // }

    /*Remind event for id*/

    Calendar.remindEvent = function (id, timeToRemind, timeFlag, remindCallback) {
        if (!id || !timeToRemind || !remindCallback) {
            return console.log(INPUT_DATA_IS_NOT_VALID);
        }

        var eventForId = searchEventByID(id);

        Calendar.createEvent('Remind to ' + eventForId.eventName, eventForId.eventDate - timeToRemind, remindCallback);
    };

    // Calendar.remindEvent = function (id, timeToRemind, remindCallback) {
    //     if (!id || !timeToRemind || !remindCallback) {
    //         return console.log(INPUT_DATA_IS_NOT_VALID);
    //     }
    //
    //     var eventForId = searchEventByID(id);
    //
    //     Calendar.createEvent(eventForId.event, eventForId.eventDate + timeToRemind, remindCallback());
    // };

    return Calendar;
})(Calendar);