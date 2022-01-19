var datePickObj = {
        todayHighlight: true,
        minDate: new Date(),
        dateFormat: 'yy-mm-dd',
        defaultDate : new Date(),
        onSelect: function (date) {
           // $('#overlay').show();

         }
}

function getHours(){
    return ["09:00 AM","09:05 AM","09:10 AM","09:15 AM","09:20 AM","09:25 AM","09:30 AM","09:35 AM",
            "09:40 AM","09:45 AM","09:50 AM","09:55 AM","10:00 AM"];
}

function isNotEmpty(field){
    return field && field != '';
}

function getOptions(){
    var options = [];
    getHours().forEach(function(hour){
        var opt = "<option>" +hour+"</option>";
        options.push(opt);
    })
    return options;
}


function disablePrevDate(dateItr){
    var today = new Date();
    //var date = new DatedateItr
    dateItr.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    var t = dateItr <= today ?  [false] : [true];
    return t;
}

$(document).ready(function(){
    initializeDateAndTime();
})

function initializeDateAndTime(){
    $("#reservationDate").datepicker(datePickObj);
    $("#startHour").append(getOptions());
    $("#endHour").append(getOptions());

}

function newReservation(){

    var reservation = {};
    var meetingRoom = {};
    var event = {};
    reservation["meetingRoom"] = {};
    reservation["event"] = {};
    var reservationId = $("#reservationId").val();
    var eventTitle = $("#eventTitle").val();
    var hostBy = $("#hostBy").val();
    var roomId = $("#rooms option:selected").val();
    var reservationDate = $("#reservationDate").val();
    var startHour = $("#startHour").val();
    var endHour = $("#endHour").val();
    var participants = $("#participants").val();
    reservation['reservationDate'] = reservationDate;
    reservation['startHour'] = startHour;
    reservation['endHour'] = endHour;
    reservation['meetingRoom']['roomId'] = roomId;
    reservation['event']['eventTitle'] = eventTitle;
    reservation['event']['hostBy'] = hostBy;
    reservation['event']['participants'] = participants;
    if(isNotEmpty(reservationId)){
        reservation['reservationId'] = reservationId;
    }
    return reservation;

}

function hideErrorMsgInitially(){
    $("#eventTitleErr").addClass("hide");
    $("#preSidedByErr").addClass("hide");
    $("#reservationDateErr").addClass("hide");
    $("#participantErr").addClass("hide");
    $("#roomIdErr").addClass("hide");
}

function sendRequestToReserveRoom(reservation){

        return new Promise(function(resolve,reject){
            var url = "/reservation/reserve";
            $.ajax({
               type: "POST",
               contentType: "application/json",
               url: url,
               data: JSON.stringify(reservation),
               dataType: 'json',
               beforeSend: function (xhr) {
                   $('#overlay').show();
               },
               success: function (data) {
                   $("#overlay").hide();
                   resolve(data);

               },
               error: function (e) {

               }
            });

        })
}

function saveReservation(){
    var reservation = newReservation();
    hideErrorMsgInitially();

    sendRequestToReserveRoom(reservation)
    .then(function(data){

        if(data.status == 'success'){
            getReservationFragView()
            .then(function(data){
                $("#reserveRoomFragment").replaceWith(data);
                initializeDateAndTime();


            });
        }else{
            var errors = data.response;
            console.log(errors);
            errors.forEach(function(error){
                showError(error);
            })
        }
    })
}

function showErrMsg(fieldId,msg){
    $(fieldId).text(msg);
    $(fieldId).removeClass("hide");
}

function showError(error){
    var field = error.field;
    var msg = error.message;
    if(field.includes("eventTitle")){
        showErrMsg("#eventTitleErr",msg);
    }

    if(field.includes("participants")){
        showErrMsg("#participantErr",msg);
    }

    if(field.includes("hostBy")){
       showErrMsg("#preSidedByErr",msg);
    }

    if(field.includes("reservationDate")){
       showErrMsg("#reservationDateErr",msg);
    }

    if(field.includes("roomId")){
       showErrMsg("#roomIdErr",msg);
    }

}

function getReservationFragView(){

        return new Promise(function(resolve,reject){
            var url = "/reservation/reservation-room-frag";

           $.ajax({
               type: "GET",
               contentType: "application/json",
               url: url,
               beforeSend: function (xhr) {
                   $('#overlay').show();
               },
               success: function (data) {
                   $("#overlay").hide();
                   resolve(data);

               },
               error: function (e) {

               }
           });

        })
}


function getReservationList(){

        return new Promise(function(resolve,reject){
            var url = "/reservation/reservation-room-frag";

           $.ajax({
               type: "GET",
               contentType: "application/json",
               url: url,
               beforeSend: function (xhr) {
                   $('#overlay').show();
               },
               success: function (data) {
                   $("#overlay").hide();
                   resolve(data);

               },
               error: function (e) {

               }
           });

        })
}

