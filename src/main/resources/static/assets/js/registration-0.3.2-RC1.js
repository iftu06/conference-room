
$(document).ready(function(){
    var stockError = localStorage.getItem("stockError");
    if(stockError){
        stockOutView();
        localStorage.removeItem("stockError");
    }
})

function hideLogin() {
    $('#loginModal').modal('hide');
}

function hideLoginAndFetchCountryCode() {
    $('#loginModal').modal('hide');
    var assignUrl = "/webstore-v2/" + businessId + "/getCountryCode";

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: assignUrl,
        dataType: 'json',
        success: function (data) {
            $("#countryCodeId").text(data.dialCode);
            $("#countryCodeIdGuest").text(data.dialCode);
        },
        error: function (e) {

        }
    });
}

function hideRegister() {
    $('#registerModal').modal('hide');
}

function signUp() {
        var newAccount = {};
        var isValidCredential = validateSignUp();
        if(!isValidCredential){
            return false;
        }
        $("#sign_up").find(":input").each(function () {
                newAccount[this.name] = $(this).val().trim();
        });

        var isBirthDayEnabled = $("#isBirthDayEnabled").val();
        if(isBirthDayEnabled && isBirthDayEnabled == 'true'){
            var birthMonth = Number($('#birth-month').val()) + 1;
            var birthday = $('#birth-year').val() + "-" + birthMonth + "-" + $('#birth-date').val();
            newAccount["birthday"] = birthday;
        }

        var registrationUrl = '/webstore-v2/' + businessId + '/sign-up';
        $("#reg-password-span").addClass("hide");
        var emailPromotionsCheck = $("#email-promotions-checkBox").is(":checked");
        newAccount["isAgreedToEmailPromotions"] =  emailPromotionsCheck;
        var rewardsEnrollmentCheck = $("#rewards-enrollment-checkBox").is(":checked");
        newAccount["isAgreedForRewardsEnrollment"] = rewardsEnrollmentCheck;

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: registrationUrl,
            data: JSON.stringify(newAccount),
            dataType: 'json',
            beforeSend: function (xhr) {
                $('#overlay').show();
            },
            success: function (data) {
                //$('#overlay').remove();
                let responseData = data['response'];
                if (data['status'] == 'success') {
                    localStorage.removeItem("active");
                    localStorage.setItem("userDetails", JSON.stringify(data['response']));
                    var cartId = localStorage.getItem("cartId");
                    if (cartId) {
                        assignCartToUser(businessId);
                        localStorage.removeItem("cartId");
                    }
                    if (data['response']['redirectUrl'] == 'verifyaccount') {
                        $('#overlay').hide();
                        $('#verify-token').text(responseData.loginSuccess.token);
                        $('#verification-type').text("email");
                        $('#verify-type').text("Email");
                        $('#verify-msg-type').text("an email");
                        $('#verify-first-name').text(responseData.loginSuccess.account.firstName);
                        $('#verify-sub-title').text('Account Created Successfully!');
                        $( ".verify-name" ).each( function () {
                            $(this).text(responseData.loginSuccess.account.email);
                        });
                        hideRegister();
                        $('#verify_your_account_modal').modal('show');
                    } else if (data['response']['redirectUrl'] == 'msisdnVerifyaccount') {
                        $('#overlay').hide();
                        $('#verify-token').text(responseData.loginSuccess.token);
                        $('#verification-type').text("msisdn");
                        $('#verify-type').text("Mobile Number");
                        $('#verify-msg-type').text("a sms");
                        $('#verify-first-name').text(responseData.loginSuccess.account.firstName);
                        $('#verify-sub-title').text('Account Created Successfully!');
                        $( ".verify-name" ).each( function () {
                            $(this).text(responseData.loginSuccess.account.msisdn);
                        });
                        hideRegister();
                        $('#verify_your_account_modal').modal('show');
                    } else {
                        var redirectView = localStorage.getItem("redirectView");
                        if (redirectView) {
                            checkStockAvailableThenChckout(data);
                        } else {
                            window.location = "/webstore-v2/" + businessId;
                        }
                    }
                } else if (data['status'] == 'error') {
                    $('#overlay').hide();
                    var errors = data['response'];
                    if (Array.isArray(errors)) {
                        errors.forEach(function (error) {
                            var field = error['field'];
                            var spanId = '#reg-' + field + '-' + 'span';
                            $(spanId).html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + error['code']);
                            $("#reg-password-span").css('color', 'red');
                        })
                    } else {
                        $('#overlay').hide();
                        var message = data.response.message;
                        if (message) {
                            $("#reg-password-span").removeClass("hide");
                            if(data.response.code == 'E1102'){
                                $('#reg-password-span > span:not(#consumer_exist)').hide();
                                $("#consumer_exist").show();
                                //$("#consumer_exist").html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + message);
                            }else if(data.response.code == 'E1103'){
                                $('#reg-password-span > span:not(#mobile_number_exist)').hide();
                                $("#mobile_number_exist").show();
                            }else if(data.response.code == 'E1114'){
                                $('#reg-password-span > span:not(#mobile_number_invalid)').hide();
                                $("#mobile_number_invalid").show();
                            }else{
                                $('#reg-password-span > span:not(#sign_in_erro_common)').hide();
                                $("#sign_in_erro_common").show();
                            }
                            $("#reg-password-span").css('color', 'red');
                        }
                    }
                }
            },
            error: function (e) {
                console.log(e);
            }
        });

        }

function verifyCustomerAccount(attempt){
    let token= $('#verify-token').text();
    let url = "/webstore-v2/verify?"+"businessId="+businessId+"&token="+token+"&verifyType=";

    if ($('#verification-type').text() === "email"){
        url = url + "email";
    }else{
        url = url + "msisdn";
    }

    if(attempt=="send"){
        $("#verify-now-btn").html("<i class='fa fa-spinner fa-spin'></i> Sending ");
        $("#verify-now-btn").prop('disabled', true);
    }else{
        $("#resend-code").html("<i class='fa fa-spinner fa-spin'></i><b>Sending</b>")
        $("#resend-code").prop('disabled', true);
    }

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: url,
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $('#overlay').hide();
            if (data.code==undefined) {
                if (attempt == "send") {
                    $("#verify-modal-title").text('Check Your Inbox');
                    $('#verify-retry-attempt').text(data.remainingVerifyEmailRequestCount);
                    $('#verify-now-content').addClass('hide');
                    $("#verify-now-btn").html("Verify");
                    $("#verify-now-btn").prop('disabled', false);
                    $('#verify-email-error-text').text("");
                    $('#verify-code-content').removeClass('hide');
                } else {
                    $("#verify-code-error-text").text('');
                    $("#resend-code").html("<b>Resend</b>")
                    $("#resend-code").prop('disabled', false);
                }
            } else{
                if (attempt == "send") {
                    $('#verify-error-text').html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + 'Verification Failed : ' + data.message);
                    $("#verify-now-btn").html("Verify");
                    $("#verify-now-btn").prop('disabled', false);
                } else {
                    $("#verify-code-error-text").html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + 'Verification Failed : ' + data.message);
                    $("#resend-code").html("<b>Resend</b>")
                    $("#resend-code").prop('disabled', false);
                }
            }
        },
        error: function (e) {
            $("#verify-now-btn").html("Verify");
            $("#verify-now-btn").prop('disabled', false);
        }
    });
}

function onCodeVerification(){
    let token= $('#verify-token').text();
    let firstName= $('#verify-first-name').text();
    let code = $("#verification-code").val().trim();
    let url = "/webstore-v2/verify?businessId="+businessId+"&token="+token+"&code="+code+"&firstName="+firstName+"&verifyType=";
    if ($('#verification-type').text() === "email"){
        url = url + "email";
    }else{
        url = url + "msisdn";
    }

    if(validateVerifyCodeField()){
        $("#verify-btn").html("<i class='fa fa-spinner fa-spin'></i> Verifying ");
        $("#verify-btn").prop('disabled', true);
        $.ajax({
            url:url,
            dataType: 'json',
            type: 'GET',
            contentType: "application/json",
            success: function (data) {
                if (data.code == undefined) {
                    var redirectView = localStorage.getItem("redirectView");
                    if (redirectView) {
                        window.location = redirectView;
                        localStorage.removeItem("redirectView");
                    } else {
                        window.location = "/webstore-v2/" + businessId;
                    }
                }
                else{
                    $("#verify-code-error-text").html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + 'Verification Failed : ' + data.message);
                    $("#verify-btn").html("Verify");
                    $("#verify-btn").prop('disabled', false);
                }

            }, error: function (jqXHR, exception) {
                $("#verify-btn").html("Verify");
                $("#verify-btn").prop('disabled', false);
            }, complete: function () {
            }
        });
    }
}

function validateVerifyCodeField(){
    try {
        $("#verify-code-error").removeClass("hide");
        var fields = ["#verification-code"];
        var invalidFields = [];

        for (i = 0; i < fields.length; i++) {
            if ($(fields[i]).val().trim() == "") {
                $("#verify-code-error").removeClass("hide");
                $("#verify-code-error-text").text('');
                break;
            } else {
                $("#verify-code-error").addClass("hide");
                $("#verification-code-input-status").addClass("hide");
            }
        }
        for (i = 0; i < fields.length; i++) {
            if ($(fields[i]).val().trim() == "") {
                invalidFields.push(fields[i]);
            }
        }
        for (i = 0; i < invalidFields.length; i++) {
            $(invalidFields[i] + "-input-status").removeClass("hide");
        }
        if (invalidFields.length == 0) {
            $("#verify-code-error").addClass("hide");
            $("#verification-code-input-status").addClass("hide");
            return true;
        }
        return false;
    } catch (err) {
        return true;

    }
}

function requestForChangePassword(userDetails){
    var warnings = userDetails['loginSuccess']['warnings'];
    if(warnings && warnings[0].code == 'WARN_1105'){
        return true;
    }else{
        return false
    }
}


function logoutAndPromptTerms() {
  logOut(false);
  showTermsModal();
}


function showTermsModal() {
        $('#terms-conditions').modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
        $('#terms-modal-header').text($('#newTermsAndConditionLabel').val());
        $('#terms-error').removeAttr("hidden");
        $('#terms-error').addClass("show");
        $('#terms-iframe').height(300);
        $('#terms-conditions .close').css('display', 'none');
        $('#terms-form').removeAttr("hidden");
        $('#terms-form').addClass("show");
        $('#termsAndCondCheckBox').click(function () {
             $('#terms-submit-btn').attr("disabled", !this.checked);
        });
        $('#terms-submit-btn').click(function() {
             $('#terms-conditions').modal('hide');
             $('#loginModal').modal('hide');
             signIn(true);
        });
        $('#terms-disagree-btn').click(function () {
            $("#signin_username").val('').end();
            $("#signin_password").val('').end();
            $("#signin-password-div").addClass('hide');
            $("#sign-in-spin-button").addClass("hide");
            $("#sign-in-button").removeClass("hide");
            //$('#sign-in-button').prop('disabled', false);
            $('#terms-form').removeClass("show");
            $('#terms-error').removeClass("show");
            $('#terms-form').attr('hidden', true);
            $('#terms-iframe').height(450);
            $('#terms-conditions .close').css('display', '');
            $('#termsAndCondCheckBox').prop('checked', false);
            $('#loginModal').modal('hide');
            $('#terms-conditions').modal('hide');
            $('#terms-submit-btn').attr("disabled", true);
        });
}





function signIn(isTermChecked) {
    var credentials = {};

    var isValidCredential = validateSignIn();
    if(!isValidCredential){
        return false;
    }

    $("#sign_in").find(":input").each(function () {
            credentials[this.name] = $(this).val().trim();
    });

    $("#signin-password-div").addClass('hide');
    $("#sign-in-button").toggleClass("hide");
    $("#sign-in-spin-button").toggleClass("hide");

    $("#reset_password_sent_div").hide();
    var loginUrl = '/webstore-v2/' + businessId + '/sign-in?isTermChecked='+isTermChecked;


    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: loginUrl,
        data: JSON.stringify(credentials),
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {

            if (data['status'] == "success") {
                localStorage.removeItem("active");
                var userDetails = data['response'];
                localStorage.setItem("userDetails", JSON.stringify(userDetails));
                var cartId = localStorage.getItem("cartId");
                if (cartId) {
                    assignCartToUser(businessId);
                    localStorage.removeItem("cartId");
                }
                if (userDetails['redirectUrl'] == 'verifyaccount') {
                    $('#verify-token').text(userDetails.loginSuccess.token);
                    $('#verification-type').text("email");
                    $('#verify-type').text("Email");
                    $('#verify-msg-type').text("an email");
                    $('#verify-first-name').text(userDetails.loginSuccess.account.firstName);
                    $('#verify-sub-title').text('Email Not Verified!');
                    $( ".verify-name" ).each( function () {
                        $(this).text(userDetails.loginSuccess.account.email);
                    });
                    hideLogin();
                    $('#verify_your_account_modal').modal('show');
                    $('#overlay').hide();
                } else if (userDetails['redirectUrl'] == 'msisdnVerifyaccount') {
                    $('#verify-token').text(userDetails.loginSuccess.token);
                    $('#verification-type').text("msisdn");
                    $('#verify-type').text("Mobile Number");
                    $('#verify-msg-type').text("a sms");
                    $('#verify-first-name').text(userDetails.loginSuccess.account.firstName);
                    $('#verify-sub-title').text('Mobile Number Not Verified!');
                    $( ".verify-name" ).each( function () {
                        $(this).text(userDetails.loginSuccess.account.msisdn);
                    });
                    hideLogin();
                    $('#verify_your_account_modal').modal('show');
                    $('#overlay').hide();
                } else {
                    var isThisReqForChangePassword = requestForChangePassword(userDetails);

                    if (!isThisReqForChangePassword) {

                        if(!data.response.loginSuccess.account.agreedToLatestTerms){
                            $('#overlay').hide();
                            logoutAndPromptTerms();
                        }else{
                            var checkoutView = localStorage.getItem("redirectView");
                            if(checkoutView){
                                checkStockAvailableThenChckout();
                            }else{
                                window.location = userDetails.redirectUrl;
                            }
                        }

                    } else {
                        $('#overlay').hide();
                        $("#loginModal").modal('toggle');
                        $("#reset_password_modal").modal('toggle');
                    }
                }

            } else if (data['status'] == 'error') {
                $('#overlay').hide();
                $("#signin-password-div").removeClass('hide');
                $("#sign-in-button").toggleClass("hide");
                $("#sign-in-spin-button").toggleClass("hide");

                if(data.response.code == 'E1101'){
                    $('#signin-password-div > span:not(#consumer_not_found)').hide();
                    $("#consumer_not_found").show();
                }else{
                    $('#signin-password-div > span:not(#sign_in_falied_reason)').hide();
                    $("#sign_in_falied_reason").show();
                }

                $("#signin-password-div").css('color', 'red');

            }
        },
        error: function (e) {
              $('#overlay').hide();
        }
    });

}

function checkStockAvailableThenChckout(){
    var redirectView = localStorage.getItem("redirectView");
    isItemOutOfStock().then(function(data){
        if(data.response == false){
            window.location = redirectView;
            localStorage.removeItem("redirectView");
        }else{
            $('#loginModal').modal('hide');
            $('#registerModal').modal('hide');
            window.location = "/webstore-v2/" + businessId;
            localStorage.setItem("stockError",true);
        }
    })

}


function logOut(isRedirectToHome) {
    var logoutUrl = '/webstore-v2/' + businessId + '/sign-out';

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: logoutUrl,
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            if (data['status'] == "success") {
                var response = data["response"];
                localStorage.removeItem("active");
                localStorage.removeItem("cartId");
                clearStorage();
                if(isRedirectToHome == true){
                    window.location = response.redirectUrl;
                }else{
                     $('#overlay').hide();
                }
            } else if (data['status'] == 'error') {
                $("#overlay").hide();
                var errors = data['response'];
                var message = data.response.message;
            }
        },
        error: function (e) {
            $("#overlay").hide();
        }
    });

}


function assignCartToUser(businessId) {
    var assignUrl = "/webstore-v2/" + businessId + "/cart/assign";

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: assignUrl,
        dataType: 'json',
        success: function (data) {

            if (data['status'] == "success") {
                var purchases = data.response.purchases;
                $(".mini-cart").toggleClass('active');
                getCart();
            } else if (data['status'] == 'error') {

            }
        },
        error: function (e) {

        }
    });

}


const green = '#4CAF50';
const red = '#F44336';

function isEmpty(value) {
    if (value === '') return true;
    return false;
}

function isValidEmail(fieldValue) {
    fieldValue = fieldValue.trim();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return fieldValue.match(mailformat) ? true : false;

}

function isValidPassWord(fieldValue) {
    var passwordformat = "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
    return fieldValue.match(passwordformat) ? true : false;
}

function validateSignUp(){
   var isValidName = validateName(document.getElementById("signup_firstName"),'firstName_empty_span');
   var isValidEmail = validateUserName(document.getElementById("signup_email"),'username_empty_span','username_invalid_span');
   var isValidMobileNo = validateMobileNo(document.getElementById("msisdn"),'msisdn_empty_span', 'reg-msisdn-div');
   var isValidPassWord = validatePassword(document.getElementById("signup_password"),'password_empty_span','invalid_password_span');
   var isValidBirthDate = validateBirthDate();

   if(isValidName && isValidEmail && isValidPassWord && isValidMobileNo){
        if(!isValidBirthDate){
            $("#reg-birthday-div").removeClass("hide");
            return false;
        }else{
            $("#reg-birthday-div").addClass("hide");
        }
        return true;
   }else{
        return false;
   }
}


function validateSignIn(){
   var isValidEmail = validateUserName(document.getElementById("signin_username"),'email_empty_span','invalid_email_span');
//   var isValidPassWord = validatePassword(document.getElementById("signin_password"),
//   'signin_password_empty_span','signin_invalid_password_span');

   if(isValidEmail){
        return true;
   }else{
        return false;
   }
}

function openGot(){
    $("#curbside_order_confirm").modal("show");
}



function validateName(field,errorLabelSpan) {
    var fieldValue = field.value;
    var errorDivId = '#'+field.nextElementSibling.id;
    $(errorDivId).removeClass("hide");

    if (isEmpty(fieldValue)) {
        //setInvalid(field, ` Name can not be empty`);
        hideAllExcepError(errorDivId,errorLabelSpan);
        return false;
    } else {
        //setValid(field);
        $(errorDivId).addClass("hide");
        return true;
    }
}

function hideAllExcepError(divId,errorId){
    //$(fieldId+' > span:not(#email_empty_span)').hide();
    //$("#email_empty_span").show();
    errorId = '#'+errorId;
    $(divId+' > span:not('+errorId+')').hide();
    $(errorId).show();
}

function validateUserName(field,emailEmptySpan,inValidEmailSpan) {
    var fieldValue = field.value;
    var errorDivId = '#'+field.nextElementSibling.id;
    $(errorDivId).removeClass("hide");
    if (isEmpty(fieldValue)) {
       // setInvalid(field, `Email address can not be empty`);
        hideAllExcepError(errorDivId,emailEmptySpan);
        return false;
    } else if (!isValidEmail(fieldValue)) {
         hideAllExcepError(errorDivId,inValidEmailSpan);
        //setInvalid(field, `Email address is not valid`);
         return false;
    } else {
         $(errorDivId).addClass("hide");
        //setValid(field);
        return true;
    }
}

function validateUserNameInReg(field) {
    var fieldValue = field.value;
    var errorDivId = '#'+field.nextElementSibling.id;
    $(errorDivId).removeClass("hide");
    if (isEmpty(fieldValue)) {
       // setInvalid(field, `Email address can not be empty`);
        hideAllExcepError(errorDivId,'username_empty_span');
        return false;
    } else if (!isValidEmail(fieldValue)) {
         hideAllExcepError(errorDivId,'username_invalid_span');
        //setInvalid(field, `Email address is not valid`);
         return false;
    } else {
         $(errorDivId).addClass("hide");
        //setValid(field);
        return true;
    }
}



function validatePassword(field,passwordEmptySpan,invalidPassWordSpan) {
    //var field = $("#email");
    var fieldValue = field.value;
    var errorDivId = '#'+field.nextElementSibling.id;
    $(errorDivId).removeClass("hide");
    if (isEmpty(fieldValue)) {
        hideAllExcepError(errorDivId,passwordEmptySpan);
        return false;
    } else if (!isValidPassWord(fieldValue)) {
        hideAllExcepError(errorDivId,invalidPassWordSpan);
        return false;
    } else {
        $(errorDivId).addClass("hide");
        return true;
    }
}





function setInvalid(field) {
    // field.className = 'invalid';
    var fieldId = field.nextElementSibling.id;
    $('#' + fieldId).removeClass("hide");
    //field.nextElementSibling.innerHTML = '<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + message;
}

function setValid(field) {
    var fieldId = field.nextElementSibling.id;
    $('#' + fieldId).addClass("hide");
}

function setValidMobile(field, mobileDivId) {
    var fieldId = '#' + mobileDivId;
    $(fieldId).addClass("hide");
}

function validateMobileNo(field, errorLabelSpan, mobileDivId) {
    var fieldValue = field.value;
    var errorDivId = '#' + mobileDivId;
    $(errorDivId).removeClass("hide");
    if (isEmpty(fieldValue)) {
        hideAllExcepError(errorDivId,errorLabelSpan);
        return false;
    }else {
        setValidMobile(field, mobileDivId);
        return true;
    }
}

function resetPassword() {
    var email = $("#recover_email").val();
    var isValidEmail = validateUserName(document.getElementById("recover_email"));
    if(!isValidEmail){
        return;
    }
    var passRequest = {
        'email': email
    };

    var forgetPassUrl = '/webstore-v2/' + businessId + '/forgot-password';
    $("#forget_password_button").toggleClass("hide");
    $("#forget-password-spin-button").toggleClass("hide");

    $("#forget_password_button").prop('disabled', true);
    $.ajax({
        url: forgetPassUrl,
        type: 'post',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(passRequest),
        success: function (data) {
            $("#forget_password_button").toggleClass("hide");
            $("#forget-password-spin-button").toggleClass("hide");

            if (data['status'] == "success") {
                $("#reset_password_sent_div").removeClass('hide');
                $("#signin_username").val("");
                $("#signin_password").val("");
                $('#forget_password_modal').modal('hide');
                $('#loginModal').modal('show');
            } else if (data['status'] == 'error') {
                var error = data['response'];
                $("#recover_email_span").html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + error.message);
                $("#recover_email_span").css('color', 'red');
                $("#forget_password_button").html("Reset Password");
                $("#forget_password_button").prop('disabled', false);



            }
        }, error: function (jqXHR, exception) {
        }, complete: function () {
            $("#forget-password-button").html("Reset Password");
            $("#forget-password-button").prop('disabled', false);
        }
    });

}


function changePassword() {
    var changePassUrl = '/webstore-v2/' + businessId + '/reset-password';

    $("#reset_password_button").html("<i class='fa fa-spinner fa-spin'></i> Requesting for change password ");
    $("#reset_password_button").prop('disabled', true);

    var newPassword = $("#recover_password").val();
    var changePasswordRequest = {
        newPassword: newPassword
    };

    $.ajax({
        url: changePassUrl,
        type: 'post',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(changePasswordRequest),
        success: function (data) {
            if (data['status'] == "success") {
                $('#reset_password_modal').modal('hide');
                window.location = "/webstore-v2/" + businessId;
            } else if (data['status'] == 'error') {
                var error = data['response'];
                $("#recover_email_span").html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + 'Password reset failed because : ' + error.message);
            }
        }, error: function (jqXHR, exception) {

        }
    });

}

function validateGuestSignUp(){

   var isGuestNameOptional = $("#isGuestNameOptional").val();
   var isGuestEmailOptional = $("#isGuestEmailOptional").val();
   var isGuestMobileNoOptional = $("#isGuestMobileNoOptional").val();
   var isValidName = true;
   var isValidEmail = true;
   var isValidMobileNo = true;

   if(isGuestNameOptional==false || isGuestNameOptional == "false"){
        isValidName = validateName(document.getElementById("guest-name"),'guestName_empty_span');
   }

   if(isGuestEmailOptional==false || isGuestEmailOptional == "false"){
       isValidEmail = validateUserName(document.getElementById("guest-email"),'guest_email_empty_span','guest_invalid_email_span');
   }

   if(isGuestMobileNoOptional==false || isGuestMobileNoOptional == "false"){
       isValidMobileNo = validateMobileNo(document.getElementById("guest-mobile"),'guest_msisdn_empty_span','guest-msisdn-span');
      }

   if(isValidName && isValidEmail && isValidMobileNo){
        return true;
   }else{
        return false;
   }
}


function loginAsGuest() {
    var isValidGuest = validateGuestSignUp();
    if(!isValidGuest){
        return;
    }

    var credentials = {};
    $("#guest-sign_up").find(":input").each(function () {
            credentials[this.name] = $(this).val();
    });

    var loginUrl = "/webstore-v2/"+businessId+"/guest-sign-up";
    $("#guest-msisdn-span").addClass('hide');
    $("#continue-as-guest-btn").toggleClass("hide");
    $("#guest-sign-up-spin-button").toggleClass("hide");

    $.ajax({
        type: 'POST',
        url: loginUrl,
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(credentials),
        success: function (data) {
            if (data['status'] == 'success') {
                var redirectView = localStorage.getItem("redirectView");
                var isPickupSubTypesSupported = localStorage.getItem("isPickupSubTypesSupported");

                if(isPickupSubTypesSupported){
                    $("#pickup-subtype-method").modal("toggle");
                    localStorage.removeItem("isPickupSubTypesSupported");
                }else if(redirectView){
                    checkStockAvailableThenChckout(data);
                    //window.location = redirectView;
                    //localStorage.removeItem("redirectView");
                }else{
                    window.location = data.response.redirectUrl;
                }
            } else if (data['status'] == 'error') {
                var errors = data['response'];
                if (Array.isArray(errors)) {
                    $("#continue-as-guest-btn").html("Continue to Checkout");
                    $("#continue-as-guest-btn").prop('disabled', false);
                    errors.forEach(function (error) {
                        var field = error['field'];
                        var spanId = '#guest-' + field + '-' + 'span';
                        $(spanId).html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + error['defaultMessage']);
                        $(spanId).css('color', 'red');
                    })
                }else{

                    $('#overlay').hide();
                    $("#continue-as-guest-btn").toggleClass("hide");
                    $("#guest-sign-up-spin-button").toggleClass("hide");
                    var message = data.response.message;
                    if (message) {
                        $("#guest-msisdn-span").removeClass("hide");
                        if(data.response.code == 'E1102'){
                            $('#guest-msisdn-span > span:not(#guest_consumer_exist)').hide();
                            $("#guest_consumer_exist").show();
                            //$("#consumer_exist").html('<i class="fa fa-exclamation-circle fa-lg mr-2"></i>' + message);
                        }else if(data.response.code == 'E1103'){
                            $('#guest-msisdn-span > span:not(#guest_mobile_number_exist)').hide();
                            $("#guest_mobile_number_exist").show();
                        }else if(data.response.code == 'E1114'){
                            $('#guest-msisdn-span > span:not(#guest_mobile_number_invalid)').hide();
                            $("#guest_mobile_number_invalid").show();
                        }else{
                            $('#guest-msisdn-span > span:not(#guest_sign_in_erro_common)').hide();
                            $("#guest_sign_in_erro_common").show();
                        }
                        $("#guest-msisdn-span").css('color', 'red');
                    }


                }
            }

        }
    });

}

function openGuestOrSignIn(openModal){
    $("#guest_signup_or_signin").hide();
    if(openModal == 'SIGN_IN'){
        $("#loginModal").modal('toggle');
    } else if(openModal == 'GUEST') {
        showGuest();
    }
}

function showGuest(){
    var assignUrl = "/webstore-v2/" + businessId + "/getCountryCode";

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: assignUrl,
            dataType: 'json',
            success: function (data) {
                $("#countryCodeIdGuest").text(data.dialCode);
                $("#guestModeModal").modal('toggle');
            },
            error: function (e) {

            }
        });

}

function onTextInputFocus(textInput) {
    $("#" + textInput).addClass("hide");

}

function updateNumberOfDays(){

    var birthDay = $("#birthDate").val();
    if(!birthDay || birthDay == ''){
        $('#birth-date').html('');
        var dayLabel = $('#day-label').val();
        $('#birth-date').append($('<option disabled selected />').val(i).html(dayLabel));
    }
    var month=$('#birth-month').val();
    if(month){
        month = Number(month) + 1;
    }
    var year=$('#birth-year').val();
    var days=daysInMonth(month, year);

    for(var i=1; i < days+1 ; i++){
        $('#birth-date').append($('<option />').val(i).html(i));
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

$(document).ready(function(){
    var monthNames = ['January','February','March','April','May','June','July',
                        'August','September','October','November','December'];

    for (var i = new Date().getFullYear(); i > 1944; i--){
        $('#birth-year').append($('<option />').val(i).html(i));
    }

    for (var i = 0; i < 12; i++){
        $('#birth-month').append($('<option />').val(i).html(monthNames[i]));
    }

    updateNumberOfDays();

    $('#birth-year, #birth-month').on("change", function(){
        updateNumberOfDays();
    });

})

function validateBirthDate(){
    var isBirthDayEnabled = $("#isBirthDayEnabled").val();
    if(isBirthDayEnabled && isBirthDayEnabled == 'true'){
        var year = $("#birth-year").val();
        var month = $("#birth-month").val();
        var day = $("#birth-date").val();
        if(year && month && day){
            return true;
        }else{
            return false;
        }
    }else{
        return true;
    }
}