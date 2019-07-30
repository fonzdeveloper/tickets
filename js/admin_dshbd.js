var _ticket_data;
var _div_ticket_summary;
var _top_jobs;
var _month_summary;
var refreshpage;
var month = new Array();
$(document).ready(function () {
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    refresh();
    $('#modalTickets').on('show.bs.modal', function (e) {
        var invoker = $(e.relatedTarget);
        if (invoker !== undefined) {
            var jsonData = $(invoker).attr("jsondata");
            var ticketType = $(invoker).attr("ticket_type");

            create_ticket_table(parseInt(ticketType), JSON.parse(jsonData));
        }
    });

    $('#example').breakingNews({
        source: {
            type:'json',
            url: '../ticket_log/Get_WorkFlags',
            limit:20,
            showingField:'title',
            linkEnabled: false,
            target:'_blank',
            seperator: '<span class="bn-seperator" style="background-image:url(../Content/images/login/book.svg);"></span>',
            errorMsg: 'Json file not loaded. Please check the settings.'
        },
        position: "fixed-bottom"

    });

    $('#check_autoRefresh').change(function () {
        if ($(this).is(":checked")) {
            var returnVal = confirm("Are you sure to refresh data at interval?");
            $(this).attr("checked", returnVal);

            if (returnVal)
                refreshpage = setInterval(refresh, 300000);
            else
                stop_refresh();

        } else {
            stop_refresh();
        }
    });
});



//var set_Refresh_interval = window.setInterval(function () {
//    refresh();
//}, 300000);

function stop_refresh()
{
    clearInterval(refreshpage);
}






//#region Refresh
function refresh() {
    _div_ticket_summary = document.getElementById('div_ticket_summary');
    _div_ticket_summary.innerHTML = "";

    $('#lbl_refresh_time').text(new Date().toLocaleString());

    for (var i = 0; i < 9; i++) {
        get_all_tickets(i);
    }

    get_top_jobs(5);
    get_top_location(5);
    get_monthly_Summary();
}
//#endregion

//#region Fetch Tickets
function get_all_tickets(type) {
    try {
        var data = { flag: type };
        AjaxCall('../Tickets/Get_tickets_by_flag', JSON.stringify(data), 'POST', '#wait').done(function (response) {

            if (response.status === 1) {

                _ticket_data = response.ticket_code;
                //create summary
                show_TicketSummary(type, _ticket_data);
                //create_cards_for_tickets(type, _ticket_data);

            }
        }).fail(function (error) {
            alert(error.StatusText);
        });

    } catch (e) {

    }
}

//#endregion

//#region TICKET TABLE
function create_ticket_table(type, data) {
    try {

        console.log(data);
        var ticket_table_holder = document.getElementById('div_table_holder');
        ticket_table_holder.innerHTML = "";

        // create border/card
        var _card = document.createElement('div');
        _card.classList.add("card");

        var _hr = document.createElement('hr');

        var _header = document.createElement('label');
        _header.innerHTML = get_header_for_card_by_ticket_status(type);//"Opened Tickets";

        var _card_body = document.createElement('div');
        _card_body.classList.add("card-body");

        var _table = document.createElement('table');
        _table.classList.add("display", "responsive", "nowrap", "table-sm", "table-hover", "table-dark", "table-bordered");
        _table.id = "grid";
        _table.style.width = "100%";

        var refernce = "#";
        if (type === 0) {
            refernce = "../Tickets/Accept_Tickets/";
        } else {
            refernce = "../Tickets/Change_Flag/";
        }

        var table_body = "";
        var counter = 0;
        $.each(data, function (index, value) {
            counter++;
            table_body += "<tr>" +
                "<td>" + counter + "</td>" +
                "<td>" + value.ticket_code + "</td>" +
                 "<td>" + value.Sector.sector_name + "</td>" +
                  "<td>" + value.ticket_type1.ticket_name + "</td>" +
                   "<td>" + value.Location.NameEn + "</td>" +
                    "<td>" + value.issued_on + "</td>" +
                     //'<td><a href="../Tickets/Accept_Tickets/'+value.Id+'" style="color: lime;" title="get more details of jobs">more>></a></td>' +
                     '<td><a href="' + refernce + value.Id + '" style="color: lime;" title="get more details of jobs">more>></a></td>' +
                "</tr>";


        });

        var _table_header = '<thead class="bg-Deep-Purple">' +
            '<tr>' +
                '<td>Sr No</td>' +
                '<td>Code</td>' +
                '<td>Sector</td>' +
                '<td>Type</td>' +
                '<td>Location</td>' +
                '<td>Opened On</td>' +
                "<td>details</td>" +
            '</tr>' +
            '</thead>';

        _table.innerHTML = _table_header + table_body;
        _card_body.appendChild(_header);
        _card_body.appendChild(_hr);
        _card_body.appendChild(_table);
        _card.appendChild(_card_body);


        ticket_table_holder.appendChild(_card);


        $(_table).DataTable({
            fixedHeader: true
        });
    } catch (e) {

    }
}
//#endregion

//#region CARD
function create_cards_for_tickets(type, card_data) {
    try {
        var card_str = "";
        if (card_data !== null || card_data !== undefined) {

            var jsondata = JSON.stringify(card_data);
            card_str = '<div class="card ' + get_class_for_card_by_ticket_status(type) + '">' +
                            '<div class="card-header text-center"><h5 >' + get_header_for_card_by_ticket_status(type) + '</h5></div>' +
                            '<div class="card-body text-center"><a href="#" ticket_type=' + type + ' jsondata=\'' + jsondata + '\' data-toggle="modal" data-target="#modalTickets" title="click to view more details" style="color: white; font-size: xx-large;cursor: pointer;">' + card_data.length + '</a></div>' +
                            '</div>';
        }
        else {
            card_str = '<div class="card ' + get_class_for_card_by_ticket_status(type) + '">' +
                            '<div class="card-header text-center"><h5>' + get_header_for_card_by_ticket_status(type) + '</h5></div>' +
                            '<div class="card-body text-center"><label style="color: white; font-size: xx-large;">0</label></div>' +
                            '</div>';
        }
        _div_ticket_summary.innerHTML += card_str;


    } catch (e) {

    }
}
//#endregion

//#region MODEL

//#endregion

//#region TICKET_SUMMARY
function show_TicketSummary(type, card_data)
{
    try {
        var jsondata = JSON.stringify(card_data);
        var div_item = '<div class="row no-gutters align-items-center">'+
                    '<div class="col mr-2">'+
                      '<div class="text-xs font-weight-bold ' + get_class_for_Label_by_ticket_status(type) + ' text-uppercase mb-1"><a href="#" class="' + get_class_for_Label_by_ticket_status(type) + '" ticket_type=' + type + ' jsondata=\'' + jsondata + '\' data-toggle="modal" data-target="#modalTickets" title="click to view more details">' + get_header_for_card_by_ticket_status(type) + '</a></div>' +
                      '<div class="h5 mb-0 font-weight-bold text-gray-800">' + card_data.length + '</div>' +
                    '</div>'+
                    '<div class="col-auto">'+
                      '<i class="fas ' + get_icon_for_ticket_by_ticket_status(type) + ' fa-2x text-gray-300"></i>' +
                    '</div>'+
                  '</div>';

        _div_ticket_summary.innerHTML += div_item;

    } catch (e) {

    }
}
//#endregion

function get_top_jobs(count)
{
    try {

        var data = { length: count };

        AjaxCall('../Jobs/Get_Top_Jobs_in_currentMonth', JSON.stringify(data), 'POST', '#wait').done(function (response) {

            var div_top_jobs = document.getElementById('div_top_jobs');
            if (response.code === 1) {

                div_top_jobs.innerHTML = "";
                _top_jobs = JSON.parse(response.data);

                var _table = document.createElement('table');
                _table.classList.add("table", "table-hover", "table-sm");

                var _bodydata = document.createElement('tbody');
                for (var i = 0; i < _top_jobs.length; i++) {

                    var _rowdata = document.createElement('tr');
                    _rowdata.innerHTML += '<td>' + _top_jobs[i].source + '</td>';
                    _rowdata.innerHTML += '<td>' + _top_jobs[i].details + '</td>';
                    _rowdata.innerHTML += '<td>' + _top_jobs[i].counts + '</td>';

                    _bodydata.appendChild(_rowdata);
                }

                _table.appendChild(_bodydata);
                div_top_jobs.appendChild(_table);

            }
        }).fail(function (error) {
            alert(error.StatusText);
        });
    } catch (e) {

    }
}

function get_top_location(count) {
    try {

        var data = { length: count };

        AjaxCall('../Tickets/Get_Top_Location_in_currentMonth', JSON.stringify(data), 'POST', '#wait').done(function (response) {

            var div_top_location = document.getElementById('div_top_location');
            if (response.code === 1) {

                div_top_location.innerHTML = "";
                _top_jobs = JSON.parse(response.data);

                var _table = document.createElement('table');
                _table.classList.add("table", "table-hover", "table-sm");

                var _bodydata = document.createElement('tbody');
                for (var i = 0; i < _top_jobs.length; i++) {

                    var _rowdata = document.createElement('tr');
                    _rowdata.innerHTML += '<td>' + _top_jobs[i].sector + '</td>';
                    _rowdata.innerHTML += '<td>' + _top_jobs[i].location + '</td>';
                    _rowdata.innerHTML += '<td>' + _top_jobs[i].counts + '</td>';

                    _bodydata.appendChild(_rowdata);
                }

                _table.appendChild(_bodydata);
                div_top_location.appendChild(_table);

            }
        }).fail(function (error) {
            alert(error.StatusText);
        });
    } catch (e) {

    }
}

function get_monthly_Summary()
{
    try {
        var d = new Date();

        $('#hd_summary').text("Summary of " + month[d.getMonth()] + "," + d.getFullYear());

        var data = { length: 1 };

        AjaxCall('../Tickets/Get_Summary_Open_and_Close_Ticket', JSON.stringify(data), 'GET', '#wait').done(function (response) {

            var div_month_summary = document.getElementById('div_month_summary');
            if (response.code === 1) {

                div_month_summary.innerHTML = "";
                _month_summary = response;

                //#region Ticket
                var _tabledata = '<div class="row">' +
                                    '<div class="col-sm-6 col-md-6 col-lg-3 mt-2 ">' +
                                        '<div class="text-center bg-gradient-primary card_box shadow-lg">' +
                                            '<label>Open Tickets</label>' +
                                            '<hr />' +
                                            '<label>' + _month_summary.openedTickets + '</label>' +
                                        '</div>' +
                                     '</div>' +
                                     '<div class="col-sm-6 col-md-6 col-lg-3 mt-2">' +
                                        '<div class="text-center bg-gradient-success card_box">' +
                                            '<label>Closed Tickets</label>' +
                                            '<hr />' +
                                            '<label>' + _month_summary.closedTickets + '</label>' +
                                        '</div>' +
                                     '</div>' +
                                     '<div class="col-sm-6 col-md-6 col-lg-3 mt-2">' +
                                        '<div class="text-center bg-gradient-secondary card_box">' +
                                            '<label>Canceled Tickets</label>' +
                                            '<hr />' +
                                            '<label>' + _month_summary.canceledTickets + '</label>' +
                                        '</div>' +
                                     '</div>' +
                                     '<div class="col-sm-6 col-md-6 col-lg-3 mt-2">' +
                                        '<div class="text-center bg-gradient-info card_box">' +
                                            '<label>Transfered Tickets</label>' +
                                            '<hr />' +
                                            '<label>' + _month_summary.transferedTickets + '</label>' +
                                        '</div>' +
                                     '</div>' +
                                     '<div class="col-sm-6 col-md-6 col-lg-3 mt-2">' +
                                        '<div class="text-center bg-gradient-warning card_box">' +
                                            '<label>Avg Tickets</label>' +
                                            '<hr />' +
                                            '<label>' + _month_summary.avgTicketsinMonth + '</label>' +
                                        '</div>' +
                                     '</div>' +
                                     '<div class="col-sm-6 col-md-6 col-lg-3 mt-2">' +
                                        '<div class="text-center bg-gradient-danger card_box">' +
                                            '<label>Avg Time to Close</label>' +
                                            '<hr />' +
                                            '<label>' + _month_summary.avgTimeToComplete + '</label>' +
                                        '</div>' +
                                     '</div>' +
                                     '<div class="col-sm-6 col-md-6 col-lg-3 mt-2">' +
                                        '<div class="text-center bg-gradient-primary card_box">' +
                                            '<label>Compared Tickets</label>' +
                                            '<hr />' +
                                            '<label>' + _month_summary.ticketsTakenToCompare + '</label>' +
                                        '</div>' +
                                     '</div>' +
                                  '</div>';
                //#endregion

                div_month_summary.innerHTML = _tabledata;
            }
        }).fail(function (error) {
            alert(error.StatusText);
        });
    } catch (e) {

    }
}
