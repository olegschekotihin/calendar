var Reminder = (function (Calendar) {
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';
    var INPUT_DATA_IS_NOT_VALID = 'input data is not valid';
    
    /*Find by id*/
    
    function searchEventByID(id) {
        console.log(Calendar.findById(id)[0]);
        return Calendar.findById(id)[0];
    }

    /*Remind event for id*/

    function remindCallback(id, remindCallback) {
        var callbackList = [];
        var eventForId = searchEventByID(id);

        callbackList.push(eventForId.callback, remindCallback);
        return function () {
            callbackList.forEach(callbackItem){
                callbackItem();
            }
        }
    }
    
    Calendar.remindEvent = function (id, timeToRemind, remindCallback) {
        if (!id || !timeToRemind || !remindCallback) {
            return console.log(INPUT_DATA_IS_NOT_VALID);
        }

        var eventForId = searchEventByID(id);

        Calendar.createEvent(eventForId.event, eventForId.eventDate + timeToRemind, remindCallback());
    };

    return Calendar;
})(Calendar);