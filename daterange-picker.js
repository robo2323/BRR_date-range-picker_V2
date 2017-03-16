function makeDatepicker(numberOfCals, id) {

    var monthNames = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    };

    //change seperator for date formating in input box here
    var separator = "/";

    var divId = "#" + id;

    var calendars = {};

    var date1, date2;

    var oldDate = $(divId + " .datepicker-input").val().split(" ");

    if (oldDate.length === 3) {
        var oldDate1 = oldDate[0].split(separator),
            oldDate2 = oldDate[2].split(separator);
        date1 = new Date(oldDate1[2], oldDate1[1] - 1, oldDate1[0]);
        date2 = new Date(oldDate2[2], oldDate2[1] - 1, oldDate2[0]);

    } else {
        date1 = null;
        date2 = null;
    }


    var currentDate = new Date();

    //change date formating/order for input box here
    function formatDate(dateObj) {
        var dd = (dateObj.getDate() > 9) ? dateObj.getDate() : "0" + dateObj.getDate();
        var mm = (dateObj.getMonth() > 9) ? dateObj.getMonth() + 1 : "0" + (dateObj.getMonth() + 1);
        return dd + separator + mm + separator + dateObj.getFullYear();
    }

    function initCalDates(calId) {

        calendars[calId] = {};
        calendars[calId].year = currentDate.getFullYear();
        calendars[calId].month = currentDate.getMonth() - calId;
        calendars[calId].firstDay = new Date(calendars[calId].year, calendars[calId].month).getDay();

        if (calendars[calId].firstDay !== 0) {
            calendars[calId].firstDay = -1 * (calendars[calId].firstDay - 2);
        } else {
            calendars[calId].firstDay = -1 * (7 - 2);
        }

    }

    function updateCalDates(calId) {

        calendars[calId].firstDay = new Date(calendars[calId].year, calendars[calId].month).getDay();
        if (calendars[calId].firstDay !== 0) {
            calendars[calId].firstDay = -1 * (calendars[calId].firstDay - 2);
        } else {
            calendars[calId].firstDay = -1 * (7 - 2);
        }
    }

    function prevButton(e) {
        e.stopPropagation();

        for (var i = 0; i < numberOfCals; i++) {
            calendars[i].month -= 1;
            if (calendars[i].month == -1) {
                calendars[i].month = 11;
                calendars[i].year -= 1;
            }
            updateCalDates(i);
        }
        buildEachCal();
    }

    function nextButton(e) {
        e.stopPropagation();

        for (var i = 0; i < numberOfCals; i++) {
            calendars[i].month += 1;
            if (calendars[i].month == 12) {
                calendars[i].month = 0;
                calendars[i].year += 1;
            }
            updateCalDates(i);
        }
        buildEachCal();
    }

    function generateCals() {

        $(divId + ".datepicker-container").css("padding", "5px");

        //make skeleton including today and close buttons, they can be changed or more buttons added here
        $(divId + " .datepicker-container").html('<table><tbody><tr></tr></tbody></table><div><button class="btn-today">Today</button><button class="btn-close">X</button></div>');

        for (var i = numberOfCals - 1; i > -1; i--) {

            //build table/calendar headers
            $(divId + " .datepicker-container table tbody > tr").append('<td class="datepicker-cal-table"> <table> <thead> <tr> <th colspan="7"> <a class="datepicker-cal-' + i + '-prev" href="#"><span class="datepicker-prev">◀</span></a> <a href="#"><span class="datepicker-cal-' + i + '-head"></span></a> <a class="datepicker-cal-' + i + '-next" href="#"><span class="datepicker-next">▶</span></a> </th> </tr> <tr> <th><span>M</span></th> <th><span>T</span></th> <th><span>W</span></th> <th><span>T</span></th> <th><span>F</span></th> <th><span>S</span></th> <th><span>S</span></th> </tr> </thead> <tbody class="datepicker-cal-' + i + '-days datepicker-days"> </tbody> </table> </td>');

            initCalDates(i);

            $(divId + " .datepicker-cal-" + i + "-prev").click(prevButton);

            $(divId + " .datepicker-cal-" + i + "-next").click(nextButton);

        }
        buildEachCal();
    }

    function buildEachCal() {

        //generate each calendar-days
        for (var calCount = 0; calCount < numberOfCals; calCount++) {

            var cellNum = 0;

            $(divId + ' .datepicker-cal-' + calCount + '-head').text(monthNames[calendars[calCount].month] + " " + calendars[calCount].year);

            $(divId + ' .datepicker-cal-' + calCount + '-days').html("");

            for (var i = 0; i < 6; i++) {

                $(divId + ' .datepicker-cal-' + calCount + '-days').append("<tr></tr>");

                for (var j = 0; j < 7; j++) {

                    var dayDate = new Date(calendars[calCount].year, calendars[calCount].month, calendars[calCount].firstDay + cellNum),
                        dayDateStr = dayDate.toDateString(),
                        dayNum = dayDate.getDate();

                    var highlightClass;

                    if (date1 !== null && date2 !== null && dayDate >= date1 && dayDate <= date2) {
                        highlightClass = "cell-highlight";
                    } else if (date1 !== null && date1.toDateString() === dayDateStr) {
                        highlightClass = "cell-highlight";
                    } else if (dayDateStr === currentDate.toDateString()) {
                        highlightClass = "cell-today";
                    } else {
                        highlightClass = "cell-clear";
                    }

                    if (dayDate < new Date(calendars[calCount].year, calendars[calCount].month) ||
                        dayDate > new Date(calendars[calCount].year, calendars[calCount].month + 1, 0) ||
                        dayDate > currentDate) {
                        highlightClass = "cell-not-in-month";
                    }

                    $(divId + ' .datepicker-cal-' + calCount + '-days tr:nth-child(' + (i + 1) + ')').append('<td><a class="' + highlightClass + '" href="#" data-date="' + new Date(calendars[calCount].year, calendars[calCount].month, dayNum).toDateString() + '"><span class="cal-one-cell-' + cellNum + '">' + dayNum + '</span></a></td>');
                    cellNum++;
                }
            }
        }

        $(divId + " .datepicker-days a").click(function (e) {
            e.stopPropagation();


            if (!$(this).hasClass("cell-not-in-month")) {

                if (date1 === null) {
                    date1 = new Date($(this).attr("data-date"));
                    $(divId + " .datepicker-input").val(formatDate(date1));
                } else if (date1 !== null && date2 === null) {
                    date2 = new Date($(this).attr("data-date"));
                    $(divId + " .datepicker-input").val($(divId + " .datepicker-input").val() + " - " + formatDate(date2));

                } else if (date1 !== null && date2 !== null) {
                    date2 = null;
                    date1 = new Date($(this).attr("data-date"));
                    $(divId + " .datepicker-input").val(formatDate(date1));

                }

                if (date2 !== null && date2 < date1) {
                    var temp = date1;
                    date1 = date2;
                    date2 = temp;
                }
                buildEachCal();
            }
        });

        $(divId + " .btn-today").click(function (e) {
            e.stopPropagation();


            if (date1 === null) {
                date1 = currentDate;
                $(divId + " .datepicker-input").val(formatDate(date1));
            } else if (date1 !== null) {
                date2 = currentDate;
                $(divId + " .datepicker-input").val(formatDate(date1) + " - " + formatDate(date2));
            } else if (date1 !== null && date2 !== null) {
                alert
                date2 = null;
                date1 = currentDate;
                $(divId + " .datepicker-input").val(formatDate(date1));
            }


            generateCals();
        });

        $(divId + " .btn-close").click(function (e) {
            e.stopPropagation();
            $(divId + " .datepicker-container").html("");
            $(divId + " .datepicker-container").css("padding", "0");
        });

    }
    generateCals();

    //if date input field left position is more than half the screen width then aligns datepicker right to date field right
    if ($(divId + ' .datepicker-input').offset().left > $(document).width() / 2) {
        var $offsetWidth = $(divId + ' .datepicker-container').width() - $(divId + ' .datepicker-input').width();
        $(divId + ' .datepicker-container').css('transform', 'translateX(-'+$offsetWidth+'px)');
    }

}

//change the number in the first argument of makeDatepicker() to chnage how many calendars are displayed per datepicker
$(".date-select").click(function (e) {
    e.stopPropagation();
    makeDatepicker(2, $(this).attr("id"));
});
