var Repeat = (function (Calendar) {
    var NOT_CORRECT_EVENT = 'Please set an correct event';
    var NOT_CORRECT_DATE = 'Please set a correct date';
    var NOT_CORRECT_ID = 'Enter the correct id';
    var callbackList = [];

    Calendar.repeatEventEveryday = function (id) {
        var day = 86400000;
        var repeatEventId = Calendar.findById(id);

        repeatEventId.forEach(function (event) {
            var eventNewRepeatDate = new Date(event.eventDate.getTime() + day);
            event.done = false;
            event.eventDate = eventNewRepeatDate;
        });
    };

    Calendar.callbackEventEveryDay = function () {
        this.callback();
        repeatEventEveryday();
    };

    Calendar.createRepeatEvent = function (id) {
        var currentDate = new Date();
        var day = 86400000;

        if (!id) {
            return console.log(NOT_CORRECT_ID);
        }
        var repeatEventId = Calendar.findById(id);

        if (!repeatEventId) {
            return console.log(NOT_CORRECT_ID);
        }

        repeatEventId.forEach(function (event) {
            if (event) {
                console.log(event);
                Calendar.removeEvent(event.id);

                return Calendar.createEvent(event.eventName, event.eventDate, Calendar.callbackEventEveryDay());
            }
        });
    };

    // Calendar.repeatEventByWeekDay = function (id, dayOfWeek) {
    //     var repeatEventId = Calendar.findById(id);
    //     var repeatDayOfWeek = dayOfWeek
    //
    //     if(!repeatEventId) {
    //         return console.log(NOT_CORRECT_ID);
    //     }
    //
    //     repeatEventId.forEach(function (event) {
    //         if(event) {
    //             console.log(event);
    //             Calendar.removeEvent(event.id);
    //
    //             var eventNewRepeatDate = new Date(event.eventDate.getTime() + day);
    //
    //             return Calendar.createEvent(event.eventName, eventNewRepeatDate, event.callback);
    //         }
    //     });
    // };

    function newDateRepeatEvent() {
        console.log('ads ' + this.repeatEventListById);
        var day = 86400000;
        return repeatEventListById.date = repeatEventListById.date + day
    };

    function newCallback() {
        this.callback = function () {
            this.callback;
            Calendar.createEvent(this.eventName, newDateRepeatEvent(), newCallback())
        }
    };

    Calendar.testF = function (id) {
        var currentDate = new Date();
        var repeatEventListById = Calendar.findById(id);

        if (currentDate > repeatEventListById.eventDate) {
            return Calendar.createEvent(repeatEventListById.eventName, newDateRepeatEvent(), newCallback())
        }

        return Calendar.createEvent(repeatEventListById.eventName, repeatEventListById.eventDate, newCallback())
    };



    Calendar.repeat = function (id) {
        var currentDate = new Date();
        var repeatEventListById = Calendar.findById(id);
        var day = 86400000;
        var eventDateById = repeatEventListById.forEach(function (event) {
            return event.eventDate;
        });
        console.log(repeatEventListById);
        console.log(eventDateById);

        var newCallback = function () {
            Calendar.removeEvent(this.id);
            return(repeatEventListById.callback, Calendar.createEvent(repeatEventListById.eventName, repeatEventListById.eventDate.getTime() + day, newCallback()))
        };

        if (currentDate.getTime() > eventDateById) {
            Calendar.removeEvent(id);
            return Calendar.createEvent(repeatEventListById.eventName, repeatEventListById.eventDate.getTime() + day, newCallback());
        }

        Calendar.removeEvent(id);
        return Calendar.createEvent(repeatEventListById.eventName, repeatEventListById.eventDate.getTime(), newCallback());
    };

    return Calendar;
})(Calendar);
