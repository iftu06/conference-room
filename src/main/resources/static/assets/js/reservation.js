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
    return ["09:00 AM","09:05 AM","09:10 AM","09:15 AM"];
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
    console.log(reservation);

    sendRequestToReserveRoom(reservation)
    .then(function(data){

        if(data.status == 'success'){
            getReservationFragView()
            .then(function(data){
                $("#reserveRoomFragment").replaceWith(data);
                initializeDateAndTime();
            });
        }
    })

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

