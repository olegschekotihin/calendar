(function () {
    var Calendar = (function () {
        var eventList = [];
        var timer = null;

        /* Generate random id*/

        function generateId() {
            return Math.random().toString(36).substr(2, 9);
        }

        function Calendar() {
            timerToRunClosestEvent();
        }

        /* Find and run closest event */

        function timerToRunClosestEvent() {
            var sec = 10000;

            if (timer) {
                clearInterval(timer);
            }

            if (!eventList.length) {
                return console.log('events list is empty');
            }

            var currentTime = Date.now();

            var closestTimeToEvent = findTimeToNearestEvent();

            if (!closestTimeToEvent) {
                return console.log('date is empty');
            }

            var closestEventList = findNearestEvent(closestTimeToEvent);
            var delay = (closestTimeToEvent - currentTime);
            var isStartEvent = delay < sec && delay >= 0;
            var timeToDelayTimer = isStartEvent ? delay : sec;
            timer = setInterval(function () {
                if (isStartEvent) {
                    closestEventList.forEach(function (event) {
                        console.log(event);
                        if (event.done === false) {
                            event.callback();
                            event.done = true;
                        } else {
                            timerToRunClosestEvent();
                        }
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
            var currentTime = Date.now();
            eventList.forEach(function (el) {
                if (timeToCallEvent === null && currentTime < el.time) {
                    timeToCallEvent = el.time;
                }
                if (currentTime < el.time && timeToCallEvent > el.time) {
                    timeToCallEvent = el.time
                }
            });
            return timeToCallEvent;
        }

        /* Find nearest event */

        function findNearestEvent(closestTime) {
            console.log(eventList);
            var nearestEventList = eventList.filter(function (event) {
                return closestTime === event.time;
            });
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

            if(isNaN(newDate)) {
                return console.log('date is wrong');
            }

            var newEvent = {
                eventDate: eventDate,
                eventName: eventName,
                id: generateId(),
                date: newDate,
                time: newDate.getTime(),
                done: false,
                callback: callback
            };

            eventList.push(newEvent);
            timerToRunClosestEvent();
        };

        /* Remove event */

        Calendar.prototype.removeEvent = function (id) {
            if (!id) {
                return console.log('Enter the correct id');
            }

            var index = eventList.findIndex(function (e) {
                return e.id === id;
            });

            if (index !== -1) eventList.splice(index, 1);
        };

        /* Edit event */

        Calendar.prototype.editEvent = function (id, newEvent) {
            if (!id) {
                return console.log('Enter the correct id');
            }
            if (!newEvent) {
                return console.log('Please set an correct event');
            }

            eventList.map(function (el) {
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

            eventList.forEach(function (el) {
                if (el.id === id) {
                    el.eventDate = newDate
                }
            });
        };

        /* Show event list for period*/

        Calendar.prototype.showEventsListForPeriod = function (startDate, stopDate) {
            if (stopDate === undefined) {
                stopDate = startDate;
            }

            var newDateStart = new Date(Date.parse(startDate));
            var newDateStop = new Date(Date.parse(stopDate));

            var eventListForPeriod = eventList.filter(function (value) {
                var eventDate = new Date(Date.parse(value.eventDate));

                if ((eventDate >= newDateStart) && (eventDate <= newDateStop)) {
                    return value.eventName;
                }
            });

            return eventListForPeriod;
        };

        /* Show event list for month*/

        Calendar.prototype.showEventsListForMonth = function () {
            var currentDate = new Date();
            var eventsByMonth = eventList.filter(function (event) {
                if (event.date.getMonth() === currentDate.getMonth() &&
                    event.date.getFullYear() === currentDate.getFullYear()) {
                    return event;
                }
            });
            return eventsByMonth;
        };

        /* Show event list for day*/

        Calendar.prototype.showEventsListForDay = function () {
            var currentDate = new Date();
            var eventsByDay = eventList.filter(function (event) {
                if (event.date.getDate() === currentDate.getDate() &&
                    event.date.getMonth() === currentDate.getMonth() &&
                    event.date.getFullYear() === currentDate.getFullYear()) {
                    return event;
                }
            });
            return eventsByDay;
        };

        /* Show event list for week*/

        Calendar.prototype.showEventsListForWeek = function () {
            var currentDate = new Date();
            var startDayOfAWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                currentDate.getDate() - currentDate.getDay() + 1);
            var endDayOfAWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                currentDate.getDate() - currentDate.getDay() + 7, 23, 59, 59, 999);

            var eventsByWeek = eventList.filter(function (event) {
                if (event.date >= startDayOfAWeek && event.date <= endDayOfAWeek) {
                   return event;
                }
            });
            return eventsByWeek;
        };

        return new Calendar();
    })();

    window.Calendar = Calendar;
})();

