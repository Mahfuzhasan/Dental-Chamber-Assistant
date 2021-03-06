$("#date").datepicker({
    todayHighlight: true,
    startDate: new Date(),
    autoclose: true
});


var dentistlist = null;

$("#date").on('changeDate', function() {
    $("#appointmentFormError").html("");
    var date = $("#date").val();
    var branch = $("input:radio[name='branch']:checked").val();
    console.log(branch);
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekday = new Date(date).getDay();
    var day = weekdays[weekday];
    $("#dentist").empty();
    $("#dentist").append($("<option>", { 'value': '', 'disabled': true, 'text': 'Select A Dentist', 'selected': true }));
    $("#schedule").empty();
    $("#schedule").append($("<option>", { 'value': '', 'text': "Select A Dentist First", 'disabled': true, 'selected': true }));


    $.post("/appointment/dentist_schedules/", { "day": day, 'branch': branch }, function(response) {

        dentistlist = response.data;

        for (var i = 0; i < dentistlist.length; i++) {
            $("#dentist").append($("<option>", { 'value': dentistlist[i].id, 'data-idx': i, 'text': dentistlist[i].name }));
        }
    }).fail(function(response) {
        if (response.status == 404) {
            var errmsg = response.responseJSON.message;
            $("#appointmentFormError").append("<p>" + errmsg + "</p>");
        }
    });
});


$("#dentist").on("change", function() {
    var idx = $("#dentist").find('option:selected').attr('data-idx');
    var schedules = dentistlist[idx].schedules;
    for (var i = 0; i < schedules.length; i++) {
        $("#schedule").append($("<option>", { 'value': schedules[i].id, 'text': schedules[i].weekday + " From: " + schedules[i].start + " To: " + schedules[i].end }));
    }
});


$("#contact_number").inputmask({
    "mask": "+880 9999-999999"
});

$("#appointmentForm").validate();

$(document).ready(function() {
    $("#appointmentConfirmPrint").on('click', function() {
        $("#appointmentPrintable").printThis();
    })

});