'use strict';

/* Calendar */

var arrEvent = [];

function Calendar() {

    /* Add new event*/
    this.addEvent = function (event, date) {
        this.event = event;
        this.date = date;
        var newEvent = {};
        newEvent.date = date;
        newEvent.event = event;
        arrEvent.push(newEvent);
    };

    /* Remov event*/
    this.removeEvent = function (event) {
        this.event = event;

        var index = arrEvent.findIndex(function(e){
            return e.event === event;
        });
        if (index !== -1) arrEvent.splice(index, 1);
    };

    /* Edit event */
    this.editEvent = function (event, date) {

    };
}

var calendar = new Calendar();

