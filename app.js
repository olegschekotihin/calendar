'use strict';

/* Calendar */

var arrEvent = [];

function Calendar() {

    /* Add new event*/
    this.addEvent = function (event, date) {
        var newEvent = {date: date, event: event};
        arrEvent.push(newEvent);
    };

    /* Remov event*/
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

calendar.addEvent('1', '12-05-2014');
calendar.addEvent('2', '12-05-2012');
calendar.addEvent('3', '12-05-2015');
calendar.addEvent('4', '12-05-2017');
calendar.addEvent('5', '12-05-2011');

