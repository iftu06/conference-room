
$(document).ready(function(){
    fetchCountryCode();

})


function changeTab(element, selection) {
    $('#tablist li').each(function (i) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
        }
    });
    element.classList.add('active');
    $('#setting-tabs .tab-content-card').each(function (i) {
        if (!$(this).hasClass('hide')) {
            $(this).addClass('hide');
        }
    });
    $(selection).removeClass('hide');
    if(selection == '#email-notifications'){
        $("#email-notifications .tab-content-card").removeClass("hide");
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        var lastChildId = $("#tablist li:last-child").attr("id");
        console.log(lastChildId);
        scrollToError(lastChildId);

    }

}

function showAccountSetings(selection){
    $(selection + '-btn-div').removeClass('hide');
    $(selection + '-btn').hide();
    $(selection + '-body').removeClass("disabled");

    var customerMobileNumberDisabled = $('#customerMobileNumberDisabled').val();
    var birthDate = $('#birthDate').val();
    if(customerMobileNumberDisabled != null && customerMobileNumberDisabled != "" && customerMobileNumberDisabled == 'true') {
        $('#account-msisdn').addClass("disabled");
    }

    if(birthDate && birthDate != ''){
        $("#account-birthday").addClass('disabled');
    }else{
        $("#account-birthday").removeClass('disabled');
    }

}

function showSettingBtns(selection) {
    $(selection + '-btn-div').removeClass('hide');
    $(selection + '-btn').hide();
    $(selection + '-body').removeClass("disabled");
}

function hideSettingbtn(selection) {
    $(selection + '-btn-div').addClass('hide');
    $(selection + '-btn').show();
    $(selection + '-body').addClass("disabled");
}

function validateBirthdayFields(){
    if($('#birth-year').val() != undefined && $('#birth-month').val() != undefined && $('#birth-date').val() != undefined){
        return true;
    }else if($('#birth-year').val() == undefined && $('#birth-month').val() == undefined && $('#birth-date').val() == undefined){
        return true;
    }else if($('#birth-year').val() == undefined || $('#birth-month').val() == undefined || $('#birth-date').val() == undefined){
       return false;
    }

}

function setBirthDateIfEnable(userUpdate){
    var isBirthDayEnabled = $("#isBirthDayEnabled").val();
    var birthDate = $('#birthDate').val();

    if(isBirthDayEnabled == 'true' && !birthDate){
        var isValidBirthDate = validateBirthdayFields();
        if(!isValidBirthDate){
            $('#invalid-birthdate').removeClass('d-none');
            return false;
        }else{
            $('#invalid-birthdate').addClass('d-none');
            var birthYear = $('#birth-year').val();
            var dayOfBirth = $('#birth-date').val();

            if(birthYear && birthYear != ''){
                var birthMonth = Number($('#birth-month').val()) + 1;
                var userBirthDate = birthYear + "-" + birthMonth + "-" + dayOfBirth;
                userUpdate["birthday"] = userBirthDate;
            }
        }
    }

    return userUpdate;

}

function updateUserDetails() {
    let url = "/webstore-v2/" + businessId + "/update-account-details";
    let name = $("#firstName").val().trim();
    var msisdn = $("#msisdn").val().trim();
    var isBirthDayEnabled = $("#isBirthDayEnabled").val();


    if (name == "") {
        $('#account-name-error-empty').removeClass('d-none');
        return false;
    }else{
        $('#account-name-error-empty').addClass('d-none');
    }
    if (msisdn == "") {
        $('#empty-msisdn-error').removeClass('d-none');
        return false;
    }else{
        $('#empty-msisdn-error').addClass('d-none');
    }
    let userUpdate = {
        firstName: name,
        msisdn: msisdn,
    };

    userUpdate = setBirthDateIfEnable(userUpdate);

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: url,
        data: JSON.stringify(userUpdate),
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $("#overlay").hide();
            if (data['status'] == "success") {
                openSnackBar("success", data.response);

                if(isBirthDayEnabled == 'true' && userUpdate.birthday && userUpdate.birthday != ''){
                    $('#birthDate').val(userUpdate.birthday);
                }

                $('#account-edit-body').addClass("disabled");
                $('#account-edit-btn-div').addClass('hide');
                $('#account-edit-btn').show();
            } else if (data['status'] == 'error') {
                if(data.response && data.response.code && data.response.code == 'E1114'){
                    openSnackBar("error", data.response.message);
                }else{
                    openSnackBar("error", data.response);
                }

            }
        },
        error: function (e) {
            let msg = $('#snackbar-error-msg').val();
            $("#overlay").hide();
            openSnackBar("error", msg);
        }
    });

}

function updateEmailNotificationPreferences() {
    let agreedToEmailPromotions = $("#email-promotions-preference").is(":checked");
    let url = "/webstore-v2/" + businessId + "/update-account-email-preferences";
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: url,
        data: JSON.stringify(agreedToEmailPromotions),
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $("#overlay").hide();
            if (data['status'] == "success") {
                openSnackBar("success", data.response);
                $('#email-notification-edit-body').addClass("disabled");
                $('#email-notification-edit-btn-div').addClass('hide');
                $('#email-notification-edit-btn').show();
            } else if (data['status'] == 'error') {
                openSnackBar("error", data.response);
            }
        },
        error: function (e) {
            let msg = $('#snackbar-error-msg').val();
            $("#overlay").hide();
            openSnackBar("error", msg);
        }
    });
}

function openDeactivateAccountModal() {
    $("#accountDeactivation").modal('show');
}

function deactivateAccount() {
    let password = $("#current-password").val();
    if (password === "") {
        $('#deactivation-password-error-empty').removeClass('d-none');
        return false;
    }
    let deactivateRequest = {
        password: password
    };
    let url = "/webstore-v2/" + businessId + "/account-deactivate";
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: url,
        data: JSON.stringify(deactivateRequest),
        dataType: 'json',
        success: function (data) {
            if (data['status'] === "success") {
                let response = data["response"];
                localStorage.removeItem("active");
                localStorage.removeItem("cartId");
                window.location = response.redirectUrl;
            } else if (data['status'] === "error") {
                openSnackBar("error", data.response);
            } else if (data['status'] === "password not match") {
                $('#deactivation-password-error-invalid').removeClass('d-none');
                return false;
            }
        },
        error: function (e) {
            let msg = $('#snackbar-error-msg').val();
            $("#overlay").hide();
            openSnackBar("error", msg);
        }
    });
}


function openChangePasswordModal() {
    $("#changePassword").modal('show');
}

function changePasswordForSetting() {
    let currentPassword = $("#change-current-password").val();
    let newPassword = $("#change-new-password").val();
    let rePassword = $("#change-re-password").val();
    if (!validatePassword(currentPassword, newPassword, rePassword)) {
        return false;
    }

    let changePasswordRequest = {
        newPassword: newPassword,
        existingPassword: currentPassword
    };

    let url = "/webstore-v2/" + businessId + "/update-account-password";
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: url,
        data: JSON.stringify(changePasswordRequest),
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $("#overlay").hide();
            if (data['status'] === "success") {
                $("#change-current-password").val('');
                $("#change-new-password").val('');
                $("#change-re-password").val('');
                $("#changePassword").modal('hide');
                setTimeout(function () {
                    openSnackBar("success", data.response);
                }, 1000);
            } else if (data['status'] === "error") {
                openSnackBar("error", data.response);
            } else if (data['status'] === "password not match") {
                $('#current-password-error-invalid').removeClass('d-none');
                openSnackBar("error", data.response);
                return false;
            }
        },
        error: function (e) {
            let msg = $('#snackbar-error-msg').val();
            $("#overlay").hide();
            openSnackBar("error", msg);
        }
    });
}

function openLocationAddModal() {
    $("#overlay").show();
    $("#localityId").val('');
    $("#zipCodeAreaId").val('');
    $("#addressLineTwo").val('');
    $("#addressLineOne").val('');
    $('#operation-type').val('add');

    if (($('#address-modal-add-head').hasClass('hide'))) {
        $('#address-modal-add-head').removeClass('hide');
    }
    if (!($('#address-modal-edit-head').hasClass('hide'))) {
        $('#address-modal-edit-head').addClass('hide');
    }

    $('#locationModal').modal('show');

    const loadStateListUrl = '/webstore-v2/business/' + businessId + '/get-state-list?deliverySubTotal=0'
    getStateList(loadStateListUrl, true);
}


function getCountriesOptionForEdit(){
        var optionArr = [];
        var deliveryCountriesStr = $("#deliveryCountriesJsonStr").val();
        var deliveryCharge = 0;
        if(deliveryCountriesStr){
            var deliveryCountries = JSON.parse(deliveryCountriesStr);
            for(var key in deliveryCountries){
                var deliveryCountry = deliveryCountries[key];
                var currentCountry = deliveryCountry['country'];
                var deliveryCharge = deliveryCountry['deliveryCharge'];
                var minOrderAmount = deliveryCountry['minOrderAmount'];
                var optionCountry = '<option data-delivery-charge="'+deliveryCharge+'" data-min-order-amount="'+minOrderAmount+'" data-default='+'"not-default"'+'>'+currentCountry+'</option>' ;
                optionArr.push(optionCountry);
            }

        }

    return optionArr;
}

function openLocationEditModal(line1, line2, city, state, country, zip, id, label) {
    $("#overlay").show();
    let localityId = $("#localityId");
    let zipCodeAreaId = $("#zipCodeAreaId");
    const deliverySupportedRange = $("#deliverySupportedRange").val();

    if (deliverySupportedRange === "RADIUS_BASED" || deliverySupportedRange === "POLYGON_BASED"
            || deliverySupportedRange === "COUNTRY_SPECIFIC") {
        $("#stateId").val(state);
    } else {
        $("#stateId").empty();
        $("#stateId").append('<option selected>' + state + '</option>');
    }

    if (deliverySupportedRange === 'CITY_SPECIFIC') {
        localityId.empty();
        localityId.append('<option selected>' + city + '</option>');
    } else {
        localityId.val(city);
    }
    if (deliverySupportedRange === 'ZIPCODE_SPECIFIC') {
        zipCodeAreaId.empty();
        zipCodeAreaId.append('<option selected>' + zip + '</option>');
    } else {
        zipCodeAreaId.val(zip);
    }

    if(deliverySupportedRange === 'COUNTRY_SPECIFIC'){
        var countryOptionSelected = getOptionForCountry(country);
        var countryOption = getCountriesOptionForEdit();
        if(countryOptionSelected && countryOptionSelected != ''){
            countryOption.unshift(countryOptionSelected);
        }

        $('#countryspecificId')
            .find('option')
            .remove()
            .end()
            .append(countryOption);

    }

    $("#addressLineTwo").val(line2);
    $("#addressLineOne").val(line1);
    $("#addressInputId").val(label);
    $("#addressId").val(id);
    $('#operation-type').val('edit');

    if (($('#address-modal-edit-head').hasClass('hide'))) {
        $('#address-modal-edit-head').removeClass('hide');
    }
    if (!($('#address-modal-add-head').hasClass('hide'))) {
        $('#address-modal-add-head').addClass('hide');
    }

    $('#locationModal').modal('show');

    if (deliverySupportedRange !== "RADIUS_BASED" &&
        deliverySupportedRange !== "POLYGON_BASED" &&
        deliverySupportedRange != 'COUNTRY_SPECIFIC') {
        getStates().then(function(data){
           $("#overlay").hide();
            var addressObj = {
               "address1" : line1,
               "address2" : line2,
               "city" : city,
               "stateProvince" : state,
               "zipCode" : zip,
               "country" : country
            };
           setStateToAddressModal(data,false,addressObj);
          // if(deliverySupportedRange == 'CITY_SPECIFIC'){
           loadCitiesForStateInConsumer(addressObj);
         //  }
        }).catch(function(err){
           console.log(err);
        });

    } else {
        $("#overlay").hide();
    }
}

function loadCitiesForStateInConsumer(addressObj,isNew) {

    removeRequiredMessage(addressObj.stateProvince);

    getCities()
    .then(function(data){
        setCitiesInProfile(data,false,addressObj.city);
    }).catch(function(err){
          console.log(err);
      });

}

function setCitiesInProfile(data,fromSelection,selectedCity){

    let localityId = $("#localityId");
    let zipCodeAreaId = $("#zipCodeAreaId");
    let stateId = $('#stateId');
    let deliverySupportedRange = $("#deliverySupportedRange").val();
    let deliverySupportSpecificMessage = '';

    $("#zipCOdeDiv").show();

    if(deliverySupportedRange === 'CITY_SPECIFIC'){
        localityId.empty();
        var citiesOptions = getCitiesOption(data);
        var selectedCityOpt = getSelectedCityOption(data,selectedCity);
        localityId.append(selectedCityOpt);
        localityId.append(citiesOptions);
        deliverySupportSpecificMessage = data[0].city;

    }else if(deliverySupportedRange === 'ZIPCODE_SPECIFIC'){
        zipCodeAreaId.empty();
        var citiesOptions = getCitiesOption(data);
        zipCodeAreaId.append(citiesOptions);
        deliverySupportSpecificMessage = data[0].city;
    }else{
        deliverySupportSpecificMessage = stateId.val();
    }

    if (fromSelection) {
        changeDeliveryRestrictionsCheckout(data, deliverySupportSpecificMessage,
            parseFloat(data[0].deliveryCharge),
            parseFloat(data[0].minOrderAmount),
            data[0].maxDeliveryTimeInMinutes,
            data[0].deliveryTimeReadableFormat,
            data[0].deliveryErrorMessage,
            data[0].deliveryNote);

    } else {
        changeDeliveryRestrictionsCheckout(data, deliverySupportSpecificMessage,
            parseFloat(stateId.find(':selected').data('delivery-charge')),
            parseFloat(stateId.find(':selected').data('min-order-amount')),
            stateId.find(':selected').data('delivery-time-in-mins'),
            stateId.find(':selected').data('delivery-time-in-readable-format'),
            stateId.find(':selected').data('delivery-error-message'),
            stateId.find(':selected').data('delivery-note'));
    }
}



//function getStateListForSetting(url, isNew) {
//    $.get(url,
//        function (data) {
//            $("#overlay").hide();
//            var arrayLength = data.length;
//            let stateId = $('#stateId');
//            if (isNew) {
//                stateId.empty();
//            }
//
//            for (i = 0; i < arrayLength; i++) {
//                if (i == 0 && isNew == true) {
//                    let selectProvinceLabel = $("#select-province-label").val();
//                    stateId.append('<option value="" selected disabled hidden>' + selectProvinceLabel + '</option>');
//                }
//
//                const state = $("#stateId option:selected").text();
//                let selectedState = data[i].city;
//
//                if (state != selectedState) {
//                    stateId.append('<option>' + data[i].city + '</option>');
//                }
//            }
//        });
//}


function loadDeliveryLocationForStateDetailsForSetting() {
    const loadLocalityDetailsUrl = '/webstore-v2/business/' + businessId + '/get-locality-list?deliverySubTotal=0';
    getLocalityList(loadLocalityDetailsUrl);
}

//function getLocalityListForSetting(stateSelect, url) {
//    $.get(url, {state: stateSelect},
//        function (data) {
//            let localityId = $("#localityId");
//            let zipCodeAreaId = $("#zipCodeAreaId");
//            localityId.empty();
//            zipCodeAreaId.empty();
//            $("#zipCOdeDiv").show();
//
//            const arrayLength = data.length;
//            const deliverySupportedRange = $("#deliverySupportedRange").val();
//
//            if (deliverySupportedRange === 'CITY_SPECIFIC') {
//                for (i = 0; i < arrayLength; i++) {
//                    localityId.append('<option>' + data[i].city + '</option>');
//                }
//            }
//
//            if (deliverySupportedRange === 'ZIPCODE_SPECIFIC') {
//                for (i = 0; i < arrayLength; i++) {
//                    zipCodeAreaId.append('<option>' + data[i].city + '</option>');
//                }
//            }
//        });
//}

function openDeleteAddressModal(addressId, addressLabel) {
    $('#operation-type').val('delete');
    $('#addressIdForDelete').val(addressId);
    $('#address-label').text(addressLabel);
    $('#remove_account_address').modal('show');
}

function deleteAddress() {
    let addressId = $("#addressIdForDelete").val();
    let address = {
        id: addressId
    };
    let url = "/webstore-v2/" + businessId + "/update-account-address?operation=delete";
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: url,
        data: JSON.stringify(address),
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $("#overlay").hide();
            if (data['status'] === "success") {
                updateAddressContainer(data.response.addressList);
                setTimeout(function () {
                    openSnackBar("success", data.response.message);
                }, 1000);
            } else if (data['status'] === "error") {
                openSnackBar("error", data.response);
            }
        },
        error: function (e) {
            let msg = $('#snackbar-error-msg').val();
            $("#overlay").hide();
            openSnackBar("error", msg);
        }
    });
}

function updateAddressesForSetting() {
    if (isValidAddress()) {
        $('#confirm-delivery-button').attr("disabled", false);
    }else{
        $('#confirm-delivery-button').attr("disabled", true);
        return false;
    }

    var deliverySupportedRange = $("#deliverySupportedRange").val()
    var country = '';
    const selectedCity = $("#localityId").val();
    const selectedState = $("#stateId").val();
    const postalCode = $("#zipCodeAreaId").val();
    const addressLineTwo = $("#addressLineTwo").val();
    const addressLineOne = $("#addressLineOne").val();
    const addressLabel = $("#addressInputId").val();
    const operation = $('#operation-type').val();
    let addressId = $("#addressId").val();
   // $("#addressLineOne").css("border-color", "#ced4da");
    //$("#stateId").css("border-color", "#ced4da");

    if (deliverySupportedRange === 'COUNTRY_SPECIFIC') {
      country =  $("#countryspecificId option:selected").text();
    }

    if (selectedState == null || selectedState == "") {
       // $("#stateId").css("border-color", "red");
        showErrorMessageForLocation();
        return (false);
    } else if (selectedCity == null || selectedCity == "") {
        showErrorMessageForLocation();
        return (false);
    } else if (addressLineOne == null || addressLineOne == "") {
        //$("#addressLineOne").css("border-color", "red");
        showErrorMessageForLocation();
        return (false);
        }
//    } else if (addressLabel == null || addressLabel == "") {
//        showErrorMessageForLocation();
//        return (false);
//    }

    else {
        $('#confirm-delivery-button').attr("disabled", false);
    }

    if (addressId === '') {
        addressId = null;
    }
    let accountAddress = {
        line1: addressLineOne,
        line2: addressLineTwo,
        city: selectedCity,
        state: selectedState,
        zip: postalCode,
        label: addressLabel,
        id: addressId,
        country : country
    };

    let url = "/webstore-v2/" + businessId + "/update-account-address?operation=" + operation;
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: url,
        data: JSON.stringify(accountAddress),
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $("#overlay").hide();
            if (data['status'] === "success") {
                $('#locationModal').modal('hide');
                updateAddressContainer(data.response.addressList);
                setTimeout(function () {
                    openSnackBar("success", data.response.message);
                }, 1000);
            } else if (data['status'] === "error") {
                openSnackBar("error", data.response);
            }
        },
        error: function (e) {
            let msg = $('#snackbar-error-msg').val();
            $("#overlay").hide();
            openSnackBar("error", msg);
        }
    });
}

function showErrorMessageForLocation() {
    $("#error-delivery-view").removeClass("hide");
    $('#confirm-delivery-button').attr("disabled", true);
}

function validatePassword(currentPassword, newPassword, rePassword) {
    if (currentPassword === "") {
        $('#current-password-error-empty').removeClass('d-none');
    }
    if (newPassword === "") {
        $('#new-password-error-empty').removeClass('d-none');
    }
//    if (rePassword === "") {
//        $('#re-password-error-empty').removeClass('d-none');
//    }
    if (newPassword !== "" && !isValidPasswordForSetting(newPassword)) {
        $('#new-password-error-invalid').removeClass('d-none');
        return false;
    }
    if (currentPassword === "" || newPassword === "") {
        return false;
    }
    if (newPassword !== rePassword) {
        $('#re-password-error-invalid').removeClass('d-none');
        return false;
    }
    return true;
}

function isValidPasswordForSetting(fieldValue) {
    var passwordformat = "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
    return fieldValue.match(passwordformat) ? true : false;
}

function hideErrorMsg(selection) {
    if (!($(selection + '-invalid').hasClass('d-none'))) {
        $(selection + '-invalid').addClass('d-none');
    }
    if (!($(selection + '-empty').hasClass('d-none'))) {
        $(selection + '-empty').addClass('d-none');
    }
}

function updateAddressContainer(addressList) {
    let addressContainer = $("#address-edit-body");
    let addressListLength = addressList.length;
    let editText = $("#edit-btn-text").val();
    let deleteText = $("#delete-btn-text").val();

    addressContainer.empty();

    let addAddressDiv = "<div class = \"col-12 col-md-4\">\n" +
        "                  <a onclick=\"openLocationAddModal()\" class = \"address-container add\" data-toggle=\"modal\" data-target=\"#locationModal\">\n" +
        "                    <div class = \"row\">\n" +
        "                      <div class = \"col-12 text-center text-muted\">\n" +
        "                        <div class = \"icon-container mb-3\">\n" +
        "                          <i class=\"fas fa-plus-circle\"></i>\n" +
        "                        </div>\n" +
        "                        <h5 class = \"font-weight-600\">" + $('#add-btn-text').val() + "</h5>\n" +
        "                      </div>\n" +
        "                    </div>\n" +
        "                  </a>\n" +
        "                </div>";

    addressContainer.append(addAddressDiv);

    for (let i = 0; i < addressListLength; i++) {
        let address = addressList[i];
        let addressElement = "<div class = \"col-12 col-md-4\">\n" +
            "                  <div class = \"address-container\">\n" +
            "                    <div class = \"row address-row\">\n" +
            "                      <div class = \"col-12\">\n" +
            "                        <p class = \"font-weight-600 mb-1\">" + address.label + "</p>\n" +
            "                        <p class = \"text-muted font-size-medium\">" +
                                     address.line1 + ", " + address.line2 + ", " + address.city + ", " + address.state + ", " + address.zip +
            "                      </div>\n" +
            "                    </div>\n" +
            "                    <div class = \"row action-row\">\n" +
            "                      <div class = \"col-6 text-left\">\n" +
            "                        <a onclick=\"openDeleteAddressModal('"+ address.id +"', '" + address.label + "')\" class = \"btn btn-link text-danger p-0\">"+
            "                           <i class=\"far fa-trash-alt \" style=\"margin-right: 5px\"></i>" + deleteText+
            "                        </a>\n" +
            "                      </div>\n" +
            "                      <div class = \"col-6 text-right\">\n" +
            "                        <a onclick=\"openLocationEditModal('"+ address.line1 + "', '" + address.line2 + "', '" +  address.city + "', '" + address.state + "', '" + address.country + "', '" + address.zip + "', '" + address.id + "', '" + address.label +"')\" class = \"btn btn-link text-muted font-weight-600 p-0\">\n" +
            "                          <i class=\"far fa-edit\" style=\"margin-right: 5px\"></i>" + editText +
            "                        </a>\n" +
            "                      </div>\n" +
            "                    </div>\n" +
            "                  </div>\n" +
            "                </div>";

        addressContainer.append(addressElement);
    }
}

function removeRequiredMessage(valueAdded) {
    if (valueAdded != null || valueAdded != "") {
        $('#confirm-delivery-button').attr("disabled", false);
        $("#error-delivery-view").addClass('hide');
    }
}

function fetchCountryCode() {
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