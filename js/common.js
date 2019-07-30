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

function get_class_for_card_by_ticket_status(type) {
    switch (type) {
        case 0:
            return "bg-Indigo";
        case 1:
            return "bg-Green";
        case 2:
            return "bg-Cyan";
        case 3:
            return "bg-PaleGreen";
        case 4:
            return "bg-Red";
        case 5:
            return "bg-Purple";
        case 6:
            return "bg-Lime";
        case 7:
            return "bg-Pink";
        case 8:
            return "bg-Brown";

        default: return "bg-primary";
    }
}
function get_header_for_card_by_ticket_status(type) {
    switch (type) {
        case 0:
            return "Open Tickets";
        case 1:
            return "Closed Tickets";
        case 2:
            return "Pending Tickets";
        case 3:
            return "Travelling";
        case 4:
            return "Incomplete Tickets";
        case 5:
            return "Transfered Tickets";
        case 6:
            return "Accepted Tickets";
        case 7:
            return "Inprogress Tickets";
        case 8:
            return "Canceled Tickets";
        default: return "Unknown Tickets";
    }
}
function get_class_for_Label_by_ticket_status(type) {
    switch (type) {
        case 0:
            return "text-Indigo";
        case 1:
            return "text-Green";
        case 2:
            return "text-Cyan";
        case 3:
            return "text-PaleGreen";
        case 4:
            return "text-Red";
        case 5:
            return "text-Purple";
        case 6:
            return "text-Lime";
        case 7:
            return "text-Pink";
        case 8:
            return "text-Brown";

        default: return "text-primary";
    }
}
function get_icon_for_ticket_by_ticket_status(type) {
    switch (type) {
        case 0:
            return "fa-shuttle-van";
        case 1:
            return "fa-clipboard-check";
        case 2:
            return "fa-battery-three-quarters";
        case 3:
            return "fa-luggage-cart";
        case 4:
            return "fa-walking";
        case 5:
            return "fa-random";
        case 6:
            return "fa-user-check";
        case 7:
            return "fa-tasks";
        case 8:
            return "fa-ban";

        default: return "fa-clipboard-list";
    }
}