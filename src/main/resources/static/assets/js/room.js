
function isNotEmpty(field){
    return field && field != '';
}

function newRoom(){
    var room = {};
    var room_id = $("#room_id").val();
    var room_name = $("#room_name").val();
    var room_num = $("#room_num").val();
    room['roomName'] = room_name;
    room['roomNum'] = room_num;
    if(isNotEmpty(room_id)){
        room['roomId'] = room_id;
    }
    return room;

}

function intiaLizeRoom(room){
    $("#room_name").val(room.roomName);
    $("#room_num").val(room.roomNum);
    $("#room_id").val(room.roomId);
}

function getRoom(id){

        return new Promise(function(resolve,reject){
            var url = "/reservation/rooms/"+id;

           $.ajax({
               type: "GET",
               contentType: "application/json",
               url: url,
               beforeSend: function (xhr) {
                   $('#overlay').show();
               },
               success: function (data) {
                   $("#overlay").hide();
                   if(data.status == 'success'){
                        intiaLizeRoom(data.response);
                   }

               },
               error: function (e) {

               }
           });

        })
}


function getRoomList(rooms){

        return new Promise(function(resolve,reject){
            var url = "/reservation/rooms";

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

function sendRequestToSaveRoom(room){

        return new Promise(function(resolve,reject){
            var url = "/reservation/room";

           $.ajax({
               type: "POST",
               contentType: "application/json",
               url: url,
               data: JSON.stringify(room),
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

function setEmptyValAfterSave(){
    $("#room_name").val('');
    $("#room_num").val('');
}

function saveRoom(){
    var room = newRoom();

    sendRequestToSaveRoom(room)
        .then(function(response){
            var status = response.status;

            if(status == 'success'){
                setEmptyValAfterSave();
                getRoomList()
                .then(function(data){
                    $("#roomList").replaceWith(data);
                })
            }else if(status == 'error'){
                console.log("error");
            }

            })

}