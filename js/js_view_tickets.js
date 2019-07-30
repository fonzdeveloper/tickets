var _Tickets;

$(document).ready(function () {

    $("#btn_search_tickets").click(function () {

        $('#card_holder').html('');
        var _getSelectedFlag = $('#dd_flags').children("option:selected").val();
        if(_getSelectedFlag>=0)
        {
            // get the Ticket by selected Flag
            load_tickets_by_flag(parseInt(_getSelectedFlag));
        }
    });
});

function load_tickets_by_flag(selected_flag)
{
    try {

        var data = { flag: selected_flag };
        AjaxCall('../Tickets/Get_tickets_by_flag', JSON.stringify(data), 'POST', '#wait').done(function (response) {

            if (response.status === 1) {

                _Tickets = response.ticket_code;
                create_ticket_table(selected_flag, _Tickets);
            } else {
                $('#card_holder').html('<label>No Tickets Found</label>');
            }
        }).fail(function (error) {
            alert(error.StatusText);
        });


    } catch (e) {
        alert("Error occured due to " + e.message);
    }
}

//#region TICKET TABLE
function create_ticket_table(type, data) {
    try {

        console.log(data);
        var ticket_table_holder = document.getElementById('card_holder');
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
function get_class_for_card_by_ticket_status(type) {
    switch (type) {
        case 0:
            return "bg-Indigo";
            break;
        case 1:
            return "bg-Green";
            break;
        case 2:
            return "bg-warning";
            break;
        case 3:
            return "bg-PaleGreen";
            break;
        case 4:
            return "bg-Red";
            break;
        case 5:
            return "bg-Purple";
            break;
        case 6:
            return "bg-Lime";
            break;
        case 6:
            return "bg-Pink";
            break;
        default: return "bg-primary";
            break;
    }
}
function get_header_for_card_by_ticket_status(type) {
    switch (type) {
        case 0:
            return "Opened Tickets";
            break;
        case 1:
            return "Completed Tickets";
            break;
        case 2:
            return "Pending Tickets";
            break;
        case 3:
            return "Travelling";
            break;
        case 4:
            return "Incomplete Tickets";
            break;
        case 5:
            return "Transfered Tickets";
            break;
        case 6:
            return "Accepted Tickets";
            break;
        case 6:
            return "Inprogress Tickets";
            break;
        default: return "Unknown Tickets";
            break;
    }
}
//#endregion