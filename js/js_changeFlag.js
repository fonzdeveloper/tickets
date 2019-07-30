var _current_job = "";

$(document).ready(function () {


    //#endregion
});



//#region Open Job Model
function open_model(caller) {

    var data_reference=caller.getAttribute("data-reference");
    if (data_reference !== undefined)
    {
        var job_data = JSON.parse(data_reference);
        _current_job = job_data;
        $('#model_job_code').text(job_data.job_code);
        $('#model_job_problem').text(job_data.detail_name);
        $('#model_job_remarks').text(job_data.remarks);
        $('#model_job_solution').val(job_data.pr_solution);
    }




    $("#jobModal").modal({
        backdrop: 'static',
        keyboard: false
    });
}

function make_job_completed()
{
    try {
        if (_current_job !== undefined)
        {
            _current_job.pr_solution = $('#model_job_solution').val();

            console.log(_current_job);

            var data = { "refid": _current_job.Id, "solution": _current_job.pr_solution };

            AjaxCall('../Jobs/make_job_completed', JSON.stringify(data), 'POST', '#wait')
           .done(function (response) {
               console.log(response);
               if (response !== undefined) {
                   if (response.status === 1) {
                       //ticket_code
                       //message
                       $('#lbl_message_ticket').text(response.message + " , Ticket Code :" + response.ticket_code);
                       $("#jobModal").modal("hide");
                   }
                   else {
                       $('#lbl_model_message').text(response.message + " , Ticket Code :" + response.ticket_code);
                       $('#lbl_message_ticket').text(response.message + " , Ticket Code :" + response.ticket_code);
                   }
               }
           }).fail(function (error) {
               $('#lbl_model_message').text("ERROR!");
               $('#lbl_message_ticket').text("ERROR!");
           });
        }

    } catch (e) {
        $('#lbl_model_message').text("ERROR! " + e.message);
        $('#lbl_message_ticket').text("ERROR! " + e.message);
    }
}
