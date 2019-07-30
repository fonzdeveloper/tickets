var problem_source;
var problem_details;
var added_problem_list;
var jobCount=0;

$(function () {
    $("#issued_on").datepicker({ maxDate: '0', dateFormat: "dd/mm/yy" }).datepicker("setDate", new Date());
});

$(document).ready(function () {


    added_problem_list = [];
    //#region Open Job Model
    $("#btn_openModel").click(function () {
        $("#jobModal").modal({
            backdrop: 'static',
            keyboard: false
        });
    });
    //#endregion

    //#region populate problem source

    function populate_sources(ticketType)
    {
        $('#txt_remarks').val('');
        var data = { ticket_type: ticketType };
        AjaxCall('../Problem_Source/Get_Problem_Sources', JSON.stringify(data), 'POST', '#wait').done(function (response) {

            if (response.length > 0) {

                problem_source = response;
                //-- clear all values.
                $('#dd_problem_source').html('');
                var options = '';
                options += '<option value="Select">Select</option>';



                for (var i = 0; i < problem_source.length; i++) {
                    options += '<option value="' + problem_source[i].id + '">' + problem_source[i].source_name + '</option>';
                }
                $('#dd_problem_source').append(options);
            }
        }).fail(function (error) {
            alert(error.StatusText);
        });
    }

    //#endregion

    //#region populate problem details
    $('#dd_problem_source').change(function () {
        //-- clear all values.
        $('#dd_problem_details').html('');

        var selected_problem_source = $(this).children("option:selected").val();
        if(selected_problem_source>0)
        {
            var data={source:selected_problem_source};
            AjaxCall('../Problem_Details/Get_Problem_Details', JSON.stringify(data), 'POST', '#wait')
            .done(function (response) {

                if (response.length > 0) {

                    problem_details = response;

                    var options = '';
                    options += '<option value="Select">Select</option>';



                    for (var i = 0; i < problem_details.length; i++) {
                        options += '<option value="' + problem_details[i].Id + '">' + problem_details[i].detail_name + '</option>';
                    }
                    $('#dd_problem_details').append(options);
                }
            }).fail(function (error) {
                alert(error.StatusText);
            });
        }
    });
    //#endregion

    //#region Create New Job
    $('#btn_add_job').click(function () {

        var selected_detailsvalue = $('#dd_problem_details').children("option:selected").val();
        if (selected_detailsvalue > 0) {

            var selected_problem = problem_details.filter(function (o) {
                return o.Id == selected_detailsvalue;
            }).pop();

            create_jobList(selected_problem);
        } else {
            $('#lbl_message_job_details').text("** No Problem details found.");
        }

    });
    //#endregion

    //#region Ticket type
    $('#ticket_type_id').change(function () {
        //-- clear all values.
        $('#div_joblist').html('');
        jobCount = 0;
        added_problem_list = [];

        var selected_problem_source = $(this).children("option:selected").val();
        if (selected_problem_source > 0) {
            document.getElementById('btn_openModel').style.visibility = "visible";
            populate_sources(selected_problem_source);
            switch(selected_problem_source)
            {
                case "1":
                    //  problem
                    $('#lbl_detail_header').text('Jobs');
                    break;
                case "2":
                    //  Transfer
                    $('#lbl_detail_header').text('Transfer');
                    break;
                case "3":
                    //  New Location
                    $('#lbl_detail_header').text('New Location');
                    break;
                case "4":
                    //  New/Update Application
                    $('#lbl_detail_header').text('New/Update Application');
                    break;
                default:
                    //  Others
                    $('#lbl_detail_header').text('Others');
                    break;
            }

        } else {
            document.getElementById('btn_openModel').style.visibility = "hidden";
        }
    });
    //#endregion
});

//#region JOB List
function create_jobList(problem_data)
{
    try {

        // check content of problem data
        if(problem_data!==undefined)
        {
            var source = problem_source.filter(function (o) {
                return o.id == problem_data.source_id;
            }).pop();

            var _found_problem_details = added_problem_list.filter(function (o) {
                return o.Id == problem_data.Id;
            }).pop();

            if (_found_problem_details === undefined)
            {
                $('#lbl_message_job_details').text("");
                problem_data.remarks = $('#txt_remarks').val();

                jobCount++;
                var data = '<div id="div_'+problem_data.Id+'" class="col-lg-4 col-md-6 col-sm-12">' +
            '<div class="card shadow">' +
                        '<div class="card-header bg-warning">' + '<div class="text-center"><h3>JOB - ' + jobCount + '</h3></div>' +
                        ' <button type="button" close_div="div_' + problem_data.Id + '" close_attrib="' + problem_data.Id + '" onclick="remove_jobList(this);" class="close float-right" style=" margin-top: -12%; color: white; background: transparent;">&times;</button>' +
                        '</div>' +
                        '<div class="card-body">' +
                        '<div class="row">' +
                            '<div class="col-lg-4 col-md-6 col-sm-12">source: </div>' +
                            '<div class="col-lg-8 col-md-6 col-sm-12"><label class="color-Indigo">' + source.source_name + '</label></div>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="col-lg-4 col-md-6 col-sm-12">problem: </div>' +
                            '<div class="col-lg-8 col-md-6 col-sm-12"><label class="color-Indigo">' + problem_data.detail_name + '</label></div>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="col-lg-4 col-md-6 col-sm-12">detail: </div>' +
                            '<div class="col-lg-8 col-md-6 col-sm-12"><label class="color-Indigo">' + problem_data.remarks + '</label></div>' +
                        '</div>' +
                        '</div>' +

                '</div>';
                '</div>';

                added_problem_list.push(problem_data);
                $('#div_joblist').append(data);
                $("#jobModal").modal("hide");
            } else {
                $('#lbl_message_job_details').text("** Job already added!.");
            }


        }

    } catch (e) {
        alert("Error occured due to " + e.message);
    }

}

function remove_jobList(remove_job)
{
    try {
        var selected_job_to_remove = remove_job.getAttribute("close_attrib");
        var selected_div_to_remove = remove_job.getAttribute("close_div");

        var _found_problem_details = added_problem_list.filter(function (o) {
            return o.Id == selected_job_to_remove;
        }).pop();
        if (_found_problem_details !== undefined)
        {
            added_problem_list.pop(_found_problem_details);
            // remove job from HTML
            var div_to_remove = document.getElementById(selected_div_to_remove);
            div_to_remove.parentNode.removeChild(div_to_remove);

        }

    } catch (e) {
        alert("Error occured due to " + e.message);
    }
}
//#endregion

//#region TICKET

function create_Ticket()
{
    try {

        var _location = $('#location_id').children("option:selected").val();
        var _salesman = $('#salesman_id').children("option:selected").val();
        var _issue_on = $('#issued_on').datepicker().val();
        var _sector = $('#sector_id').children("option:selected").val();
        var _ticket_type = $('#ticket_type_id').children("option:selected").val();

        var validate_msg = validateRequest(_location, _salesman, _issue_on, _sector, _ticket_type);
        if(validate_msg==="")
        {
            //-- validation success
            var ticket = {
                location_id: parseInt(_location),
                salesman_id: parseInt(_salesman),
                issued_by: 1,
                issued_on: _issue_on.toString(),
                sector_id: parseInt(_sector),
                ticket_type: parseInt(_ticket_type),
                parent_ticket: 0,
                status: true,
                jobs: added_problem_list
            };

            console.log(JSON.stringify(ticket));

            var data = { _tickets_Jobs: ticket };
            AjaxCall('../Tickets/Create_New_Ticket', JSON.stringify(data), 'POST', '#wait')
            .done(function (response) {
                console.log(response);
                if (response!==undefined) {
                    if (response.status === 1)
                    {
                        //ticket_code
                        //message
                        $('#lbl_message_ticket').text(response.message + " , Ticket Code :" + response.ticket_code);
                        $('#btn_create_new_ticket').attr("disabled", "disabled");
                    }
                    else
                    {
                        $('#lbl_message_ticket').text(response.message + " , Ticket Code :" + response.ticket_code);
                    }
                }
            }).fail(function (error) {
                alert(error.StatusText);
            });

        } else {
            $('#lbl_message_ticket').text(validate_msg);
        }

    } catch (e) {
        $('#lbl_message_ticket').text("failed to create ticket due to " + e.message);
        alert("Ticket Creation failed");
    }
}

function validateRequest(location,salesman,issue_date,sector,issue_type)
{
    try {
        var validation_message="";
        if (location === undefined || location ==="")
            validation_message = "Location can't be empty!";
        else if (salesman === undefined || salesman === "")
            validation_message = "salesman can't be empty!";
        else if (issue_date === undefined || issue_date === "")
            validation_message = "Issue date can't be empty!";
        else if (sector === undefined || sector === "")
            validation_message = "sector can't be empty!";
        else if (issue_type === undefined || issue_type === "")
            validation_message = "issue_type can't be empty!";

        return validation_message;


    } catch (e) {
        $('#lbl_message_ticket').text("failed to validation ticket due to " + e.message);
        alert("Ticket Validation failed");
    }
}

//#endregion




