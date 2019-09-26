'use strict';

/* Calendar */
var date = new Date();
var currentDate = date.getTime();
var arrEvent = [];

function Calendar() {

    /* Create new event*/
    this.createEvent = function (event, dateEvent) {
        var newEvent = {dateEvent: dateEvent, event: event};
        arrEvent.push(newEvent);
        //TODO
        var newDate = new Date( Date.parse(dateEvent));
        var callDate  = newDate - currentDate;
        setTimeout(console.log(event), callDate);
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
    this.editDate = function (dateEvent, value) {
        for (var key in arrEvent) {
            if (arrEvent[key].dateEvent == dateEvent) {
                arrEvent[key].date = value;
            }
        }
    };

    //TODO
    this.editTest = function (event, dateEvent, value) {
        for (var key in arrEvent) {
            if (event.length == 0 && arrEvent[key].dateEvent == dateEvent) {
                arrEvent[key].dateEvent = value;
            } else if (dateEvent.length == 0 && arrEvent[key].event == event) {
                arrEvent[key].event = value;
            } else if(arrEvent[key].event == event && arrEvent[key].date == dateEvent) {
                var splitValue = value.split(',');
                arrEvent[key].event = splitValue[0];
                arrEvent[key].dateEvent = splitValue[1];
            } else {
                console.log('error');
            }
            break;
        }
    }
}

var calendar = new Calendar();

calendar.createEvent('1', '2019-09-27');
calendar.createEvent('2', '2017-01-26');
calendar.createEvent('3', '2017-01-26');
calendar.createEvent('4', '2017-01-26');
calendar.createEvent('5', '2017-01-26');

