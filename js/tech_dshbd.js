var opened_Tickets;
var _div_card_holder;

$(document).ready(function () {
    refresh();
    $('#modalTickets').on('show.bs.modal', function (e) {
        var invoker = $(e.relatedTarget);
        if (invoker !== undefined)
        {
            var jsonData = $(invoker).attr("jsondata");
            var ticketType = $(invoker).attr("ticket_type");

            create_ticket_table(parseInt(ticketType), JSON.parse(jsonData));
        }
    });
});

//window.setInterval(function () {
//    refresh();
//}, 300000);

//#region Refresh
function refresh()
{
    _div_card_holder = document.getElementById('div_card_holder');
    _div_card_holder.innerHTML = "";

    $('#lbl_refresh_time').text(new Date().toLocaleString());

    for (var i = 0; i < 9; i++) {
        get_all_tickets(i);
    }
}
//#endregion

//#region Fetch Tickets
function get_all_tickets(type)
{
    try {
        var data = { flag: type };
        AjaxCall('../Tickets/Get_tickets_by_flag', JSON.stringify(data), 'POST', '#wait').done(function (response) {

            if(response.status===1)
            {

                opened_Tickets = response.ticket_code;
                //create summary
                create_cards_for_tickets(type, opened_Tickets);

                // success

                //create_open_ticket_table(response.ticket_code);
            }
        }).fail(function (error) {
            alert(error.StatusText);
        });

    } catch (e) {

    }
}

//#endregion

//#region TICKET TABLE
function create_ticket_table(type,data) {
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
        if (type === 0)
        {
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
                     '<td><a href="'+refernce + value.Id + '" style="color: lime;" title="get more details of jobs">more>></a></td>' +
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
function create_cards_for_tickets(type,card_data)
{
    try {
        var card_str = "";
        if(card_data!==null || card_data!==undefined)
        {

            var jsondata = JSON.stringify(card_data);
            card_str = '<div class="card ' + get_class_for_card_by_ticket_status(type) + '">' +
                            '<div class="card-header text-center"><h5 >' + get_header_for_card_by_ticket_status(type) + '</h5></div>' +
                            '<div class="card-body text-center"><a href="#" ticket_type='+type+' jsondata=\''+jsondata+'\' data-toggle="modal" data-target="#modalTickets" title="click to view more details" style="color: white; font-size: xx-large;cursor: pointer;">' + card_data.length + '</a></div>' +
                            '</div>';
        }
        else {
            card_str = '<div class="card ' + get_class_for_card_by_ticket_status(type) + '">' +
                            '<div class="card-header text-center"><h5>' + get_header_for_card_by_ticket_status(type) + '</h5></div>' +
                            '<div class="card-body text-center"><label style="color: white; font-size: xx-large;">0</label></div>' +
                            '</div>';
        }
        _div_card_holder.innerHTML += card_str;


    } catch (e) {

    }
}
//#endregion

//#region MODEL

//#endregion

//#region AJAX Call
function AjaxCall(url, data, type, loader) {
    return $.ajax({
        url: url,
        type: type ? type : 'GET',
        data: data,
        contentType: 'application/json',
        dataType: "json",
        async: true,
        cache: false,
        beforeSend: function () { $(loader).show(); },
        complete: function () { $(loader).hide(); }

    });
}
//#endregion