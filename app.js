(function () {
    var Calendar = (function () {
        var currentTime = Date.now();
        var arrEvent = [];
        var timer = null;

        function generateId() {
            return Math.random().toString(36).substr(2, 9);
        }

        function Calendar() {
            timerToRunClosestEvent();
        }

        /* Find and run closest event */

        function timerToRunClosestEvent() {
            var sec = 1000;

            if (timer) {
                clearInterval(timer);
            }

            if (!arrEvent.length) {
                return console.log('events list is empty');
            }

            var currentTime = Date.now();

            console.log(findTimeToNearestEvent());
            var closestTimeToEvent = findTimeToNearestEvent();

            console.log('closestTimeToEvent is ' + closestTimeToEvent);

            if (!closestTimeToEvent) {
                return console.log('date is empty');
            }

            var closestEventList = findNearestEvent(closestTimeToEvent);
            console.log('closestEventList is ' + closestEventList);

            //calculate the delay and start timer
            var delay = (closestTimeToEvent - currentTime);
            var isStartEvent = delay < sec;
            var timeToDelayTimer = isStartEvent ? delay : sec;
            timer = setInterval(function () {
                if (isStartEvent) {
                    closestEventList.forEach(function (event) {
                        event.callback();
                    });
                    timerToRunClosestEvent();
                } else {
                    timerToRunClosestEvent();
                }
            }, timeToDelayTimer);
        }

        /* Find time to nearest event */

        function findTimeToNearestEvent() {
            var timeToCallEvent = null;

            arrEvent.forEach(function (el) {
                if (timeToCallEvent === null && currentTime < el.date) {
                    timeToCallEvent = el.date;
                }
                if (currentTime < el.date && timeToCallEvent > el.date) {
                    timeToCallEvent = el.date
                }
            });
            return timeToCallEvent;
        }

        /* Find nearest event */

        function findNearestEvent(closestTime) {
            var nearestEventList = arrEvent.map(function (event) {
                if (closestTime === event.date) {
                    console.log(event);
                    return event;
                }
            });
            console.log(nearestEventList);
            return nearestEventList;
        }

        /* Create new event */

        Calendar.prototype.createEvent = function (eventName, eventDate, callback) {
            if (!eventName) {
                return console.log('Please set an correct event');
            }
            if (!eventDate) {
                return console.log('Please set a correct date');
            }

            var newDate = new Date(Date.parse(eventDate));
            var newEvent = {
                eventDate: eventDate,
                eventName: eventName,
                id: generateId(),
                date: newDate.getTime(),
                callback: callback
            };

            arrEvent.push(newEvent);
            timerToRunClosestEvent();
        };

        /* Remove event */

        Calendar.prototype.removeEvent = function (id) {
            if (!id) {
                return console.log('Enter the correct id');
            }

            var index = arrEvent.findIndex(function (e) {
                return e.id === id;
            });

            if (index !== -1) arrEvent.splice(index, 1);
        };

        /* Edit event */

        Calendar.prototype.editEvent = function (id, newEvent) {
            if (!id) {
                return console.log('Enter the correct id');
            }
            if (!newEvent) {
                return console.log('Please set an correct event');
            }

            arrEvent.map(function (el) {
                if (el.id === id) {
                    el.eventName = newEvent
                }
            });
        };

        /* Edit date */

        Calendar.prototype.editDate = function (id, newDate) {
            if (!id) {
                return console.log('Enter the correct id');
            }
            if (!newDate) {
                return console.log('Please set an correct date');
            }

            arrEvent.forEach(function (el) {
                if (el.id === id) {
                    el.eventDate = newDate
                }
            });
        };

        /* Show event list*/

        Calendar.prototype.showEventsListForPeriod = function (startDate, stopDate) {
            if (stopDate === undefined) {
                stopDate = startDate;
            }

            var newDateStart = new Date(Date.parse(startDate));
            var newDateStop = new Date(Date.parse(stopDate));

            var eventList = arrEvent.filter(function (value) {
                var eventDate = new Date(Date.parse(value.eventDate));

                if ((eventDate >= newDateStart) && (eventDate <= newDateStop)) {
                    return value.eventName;
                }
            });

            console.log(eventList);
        };

        return new Calendar();
    })();

    window.Calendar = Calendar;
})();