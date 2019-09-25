'use strict';

/* Calendar */

var date = new Date();
var arrEvent = [];

function Calendar() {

    /* Create new event*/
    this.createEvent = function (event, date) {
        var newEvent = {date: date, event: event};
        arrEvent.push(newEvent);
    };

    /* Remove event*/
    this.removeEvent = function (event) {
        var index = arrEvent.findIndex(function (e) {
            return e.event === event;
        });
        if (index !== -1) arrEvent.splice(index, 1);
    };

    /* Edit event */
    this.editEvent = function (event, value) {
        for (var key in arrEvent) {
            if (arrEvent[key].event == event) {
                arrEvent[key].value = value;
                break;
            }
        }
    };

    /* Edit event date */
    this.editDate = function (date, value) {
        for (var key in arrEvent) {
            if (arrEvent[key].date == date) {
                arrEvent[key].date = value;
            }
        }
    };

    //TODO
    this.editTest = function (event, date, value) {
        for (var key in arrEvent) {
            if (event.length == 0 && arrEvent[key].date == date) {
                arrEvent[key].date = value;
            } else if (date.length == 0 && arrEvent[key].event == event) {
                arrEvent[key].event = value;
            } else if(arrEvent[key].event == event && arrEvent[key].date == date) {
                var splitValue = value.split(',');
                arrEvent[key].event = splitValue[0];
                arrEvent[key].date = splitValue[1];
            } else {
                console.log('error');
            }
            break;
        }
    }
}

var calendar = new Calendar();

calendar.createEvent('1', '12-05-2014');
calendar.createEvent('2', '12-05-2012');
calendar.createEvent('3', '12-05-2015');
calendar.createEvent('4', '12-05-2017');
calendar.createEvent('5', '12-05-2011');

