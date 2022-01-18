
function login(){
    var loginReq = getLoginRequest();
    sendRequestToLogin(loginReq)
    .then(function(data){


    })
}


function getLoginRequest(){
    var loginReq = {};
    var email = $("#email").val();
    var password = $("#password").val();
    loginReq['email'] = email;
    loginReq['password'] = password;
    return loginReq;

}



function sendRequestToLogin(room){

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