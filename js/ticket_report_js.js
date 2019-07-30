//#region VARIABLES
var _technicans;
var _ticket_type;
var _workFlag;
var _sectors;
var _fromData;
var _toDate;
var _selected_Technican;
var _selected_Ticket_Type;
var _selected_Flag;
var _selected_Sector;
//#endregion

$(function () {
    $("#dtp_from").datepicker({ dateFormat: "dd/mm/yy", timeFormat: "hh:mm:ss" }).datepicker("setDate", new Date());
    $("#dtp_to").datepicker({ dateFormat: "dd/mm/yy", timeFormat: "hh:mm:ss" }).datepicker("setDate", new Date());
});

$(document).ready(function () {
    get_Technicans();
    get_TicketType();
    get_WorkFlag();
    get_sectors();

    $("#btn_search_for_data").click(function () {
        get_Ticket_Data();
    });
});

//#region DROPDOWNLIST
function get_Technicans() {
    try {
        //-- get the technicans list.
        //$('#dd_technican').find('option').not(':first').remove();
        $('#dd_technican').html('');
        var data = { "refid": 1 };
        AjaxCall('../Employees/Get_Technicans', JSON.stringify(data), 'GET', '#wait')
          .done(function (response) {
              console.log(response);
              if (response !== undefined) {
                  if (response.code === 1) {
                      _technicans = JSON.parse(response.data);

                      var options = '';
                      options += '<option value="Select">--Select--</option>';

                      for (var i = 0; i < _technicans.length; i++) {
                          options += '<option value="' + _technicans[i].Id + '">' + _technicans[i].Name + '</option>';
                      }
                      $('#dd_technican').append(options);

                      $('#dd_technican').trigger("chosen:updated");
                  }
                  else {
                      console.log("failed");
                  }
              }
          }).fail(function (error) {
              console.log("failed");
          });

    } catch (e) {
        console.log("exception");
    }
}

function get_TicketType() {
    try {
        //-- get the technicans list.
        //$('#dd_technican').find('option').not(':first').remove();
        $('#dd_ticket_type').html('');
        var data = { "refid": 1 };
        AjaxCall('../ticket_type/Get_TicketType', JSON.stringify(data), 'GET', '#wait')
          .done(function (response) {
              console.log(response);
              if (response !== undefined) {
                  if (response.code === 1) {
                      _ticket_type = JSON.parse(response.data);

                      var options = '';
                      options += '<option value="Select">--Select--</option>';

                      for (var i = 0; i < _ticket_type.length; i++) {
                          options += '<option value="' + _ticket_type[i].id + '">' + _ticket_type[i].ticket_name + '</option>';
                      }
                      $('#dd_ticket_type').append(options);

                      $('#dd_ticket_type').trigger("chosen:updated");
                  }
                  else {
                      console.log("failed");
                  }
              }
          }).fail(function (error) {
              console.log("failed");
          });

    } catch (e) {
        console.log("exception");
    }
}

function get_WorkFlag() {
    try {
        $('#dd_work_flag').html('');
        var data = { "refid": 1 };
        AjaxCall('../work_flags/Get_WorkFlags', JSON.stringify(data), 'GET', '#wait')
          .done(function (response) {
              console.log(response);
              if (response !== undefined) {
                  if (response.code === 1) {
                      _workFlag = JSON.parse(response.data);

                      var options = '';
                      options += '<option value="Select">--Select--</option>';

                      for (var i = 0; i < _workFlag.length; i++) {
                          options += '<option value="' + _workFlag[i].flag_value + '">' + _workFlag[i].flag_name + '</option>';
                      }
                      $('#dd_work_flag').append(options);

                      $('#dd_work_flag').trigger("chosen:updated");
                  }
                  else {
                      console.log("failed");
                  }
              }
          }).fail(function (error) {
              console.log("failed");
          });

    } catch (e) {
        console.log("exception");
    }
}

function get_sectors() {
    try {
        $('#dd_sector').html('');
        var data = { "refid": 1 };
        AjaxCall('../Sectors/Get_Sectors', JSON.stringify(data), 'GET', '#wait')
          .done(function (response) {
              console.log(response);
              if (response !== undefined) {
                  if (response.code === 1) {
                      _sectors = JSON.parse(response.data);

                      var options = '';
                      options += '<option value="Select">--Select--</option>';

                      for (var i = 0; i < _sectors.length; i++) {
                          options += '<option value="' + _sectors[i].id + '">' + _sectors[i].sector_name + '</option>';
                      }
                      $('#dd_sector').append(options);

                      $('#dd_sector').trigger("chosen:updated");
                  }
                  else {
                      console.log("failed");
                  }
              }
          }).fail(function (error) {
              console.log("failed");
          });

    } catch (e) {
        console.log("exception");
    }
}
//#endregion


//#region Filter data
function get_Ticket_Data()
{
    try {
        _fromData = $('#dtp_from').datepicker().val();
        _toDate = $('#dtp_to').datepicker().val();
        _selected_Technican = $('#dd_technican').children("option:selected").val();
        _selected_Ticket_Type = $('#dd_ticket_type').children("option:selected").val();
        _selected_Flag = $('#dd_work_flag').children("option:selected").val();
        _selected_Sector = $('#dd_sector').children("option:selected").val();

        var data = {
            technican: _selected_Technican > 0 ? true : false,
            ticket_Type: _selected_Technican > 0 ? true : false,
            sector: _selected_Technican > 0 ? true : false,
            flag: _selected_Technican >= 0 ? true : false,
            from: _fromData,
            to: _toDate
        };

        AjaxCall('../Reports/Get_Ticket_Report', JSON.stringify(data), 'POST', '#wait')
           .done(function (response) {
               console.log(response);
               if (response !== undefined) {
                   console.log("Success");
               }
           }).fail(function (error) {
              console.log(error)
           });
    } catch (e) {
        console.log(e)
    }
}
//#endregion