var Repeat = (function (Calendar) {
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';

    Calendar.repeatEventEveryday = function(id) {
        var repeatEventId = Calendar.findById(id);
        var day = 86400000;

        if(!repeatEventId) {
            return console.log(NOT_CORRECT_ID);
        }

        repeatEventId.forEach(function (event) {
            if(event) {
                console.log(event);
                Calendar.removeEvent(event.id);

                var eventNewRepeatDate = new Date(event.eventDate.getTime() + day);

                return Calendar.createEvent(event.eventName, eventNewRepeatDate, event.callback);
            }
        });
    };

    return Calendar;
})(Calendar);
