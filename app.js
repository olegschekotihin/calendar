'use strict';

/* Calendar */
var date = new Date();
var currentDate = date.getTime();
var arrEvent = [];

function Calendar() {

    /* Create new event*/
    this.createEvent = function (event, dateEvent) {
        var newDate = new Date(Date.parse(dateEvent));
        var callDate = newDate - currentDate;
        var newEvent = {dateEvent: dateEvent, event: event, id: arrEvent.length, timeToCall: callDate, date: newDate.getTime()};
        arrEvent.push(newEvent);
        //TODO
        setTimeout(console.log(event), callDate);
    };

    /* Remove event*/
    this.removeEvent = function (event) {
        var index = arrEvent.findIndex(function (e) {
            return e.event === event;
        });
        if (index !== -1) arrEvent.splice(index, 1);
    };

    this.findNearestEvent = function () {

    };

    //TODO
    this.editTest = function (event, dateEvent, value) {


        for (var key in arrEvent) {
            if (event.length == 0 && arrEvent[key].dateEvent == dateEvent) {
                arrEvent[key].dateEvent = value;
            } else if (dateEvent.length == 0 && arrEvent[key].event == event) {
                arrEvent[key].event = value;
            } else if (arrEvent[key].event == event && arrEvent[key].date == dateEvent) {
                var splitValue = value.split(',');
                arrEvent[key].event = splitValue[0];
                arrEvent[key].dateEvent = splitValue[1];
            } else {
                console.log('error');
            }
            break;
        }
    };

    //TODO
    this.returnEventsList = function (dateToStart, dateToStop) {
        if (dateToStop === undefined) {
            dateToStop = dateToStart;
        }

        var newDateStart = new Date(Date.parse(dateToStart));
        var newDateStop = new Date(Date.parse(dateToStop));

        arrEvent.forEach(function (e) {

            var dateEvent = new Date(Date.parse(e.dateEvent));

            if ((dateEvent >= newDateStart) && (dateEvent <= newDateStop)) {
                console.log(e.event);
            }
        });

    }
}

var calendar = new Calendar();

calendar.createEvent('1', '2019-09-27');
calendar.createEvent('2', '2017-01-26');
calendar.createEvent('3', '2017-01-26');
calendar.createEvent('4', '2017-01-26');
calendar.createEvent('5', '2017-01-26');

