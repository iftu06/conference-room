$(document).ready(function(){

    deliverySearchBar();


     var orderMode = $("#orderMode").val();
     if(orderMode){
        if(orderMode == 'delivery'){
            deliverySearchBar();
            $("#pills-delivery-tab-store").addClass('active');
            $("#pills-delivery-store").addClass('show active');
            $("#pick_up_btn").removeClass('active');
            $("#pills-pickup-store").removeClass('show active');
        }else{
            pickupSearchBar();
            $("#pick_up_btn").addClass('active');
            $("#pills-pickup-store").addClass('show active');
            $("#pills-delivery-tab-store").removeClass('active');
            $("#pills-delivery-store").removeClass('show active');
        }
     }

})



function getPickupSubType(businessId) {
    return new Promise(function(resolve,reject){
         var url = "/webstore-v2/"+businessId+"/store/pickupSubType";
                $.ajax({
                    url: url,
                    type: 'GET',
                    beforeSend: function (xhr) {
                        $('#overlay').show();
                    },
                    success: function (data) {
                        resolve(data);
                         $('#overlay').hide();
                    }, error: function (error) {

                    }
                });
            })
}

function getPickupSubTypeOrRedirectToHome(businessId,pickUpSubTypeAvailable) {
        if(pickUpSubTypeAvailable == true){
            getPickupSubType(businessId).then(function(data){
                $("#pickupSubTypeModalContainer").modal('toggle');
                $("#pickupSubTypeModal").html('');
                $("#pickupSubTypeModal").html(data);
            })
        }else{
             //var queryParam = '?pickUpDelivery=PICK_UP'+'&collectionType=PICK_UP';
             changeModeThenRedirectToHome(businessId,"PICK_UP","PICK_UP","NONE").then(function(data){
                window.location = data;
             });
        }
}

function setPickUpSubType(businessId,elem){
    var divId = '#'+elem.id;
    var radioElem = $(divId +'> input:radio');
    radioElem.prop('checked',true);
    changeMode(businessId,"PICK_UP",radioElem.attr("value"),radioElem.attr("value"),'true');
}

function changeModeToDeliveryThenRedirectToHome(businessId,collectionType){
     var queryParam = "?pickUpDelivery="+collectionType+"&collectionType="+collectionType;
     var url = "/webstore-v2/"+businessId+"/change-mode"+queryParam;

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: url,
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
           window.location = "/webstore-v2/"+businessId;
        },
        error: function (e) {

        }
    });
}

function changeModeThenRedirectToHome(businessId,pickUpDelivery,collectionType,pickupSubType) {
   return new Promise(function(resolve,reject){
         var queryParam = "?pickUpDelivery="+pickUpDelivery+"&collectionType="+collectionType+"&pickupSubType="+pickupSubType;
         var url = "/webstore-v2/"+businessId+"/change-mode"+queryParam;

            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url,
                beforeSend: function (xhr) {
                    $('#overlay').show();
                },
                success: function (data) {
                    //$("#overlay").hide();
                    resolve("/webstore-v2/"+businessId);

                },
                error: function (e) {

                }
            });
   })
}

function checkIfPickupSubTypeSelectedAndRedirectToHome(businessId){
    if (!$("input[name='pickUpSubTypeRadio']:checked").val()) {
      $("#pickupModalErrorDiv").removeClass("hide");
      //$("#selectErrMsg").text("Please select at least one option");
      return false;
    }
    else {
      window.location = "/webstore-v2/"+businessId;
      $("#overlay").show();
    }
}


function showAllStore(){

        if($("#pills-delivery-tab-store").hasClass('active')){
            $("#deliveryStoreList li").each(function(idx, li) {
                $(this).removeClass('hide');

            });

        }else{
            $("#pickupStoreList li").each(function(idx, li) {
                $(this).removeClass('hide');
            });

        }

}

function getSearchValue() {
    var inputValue = $("#searchBar").val();
    inputValue=inputValue.toLowerCase()
    var trimInputValue = inputValue.split(' ').join('');


    $("#deliveryStateList").addClass('hide');
    $("#deliveryStoreList").removeClass('hide');

    $("#pickupStateList").addClass('hide');
    $("#pickupStoreList").removeClass('hide');

    if (!inputValue || inputValue===null || inputValue==="") {

        $("#deliveryUnavailable").addClass('hide');
        $("#pickupUnavailable").addClass('hide');

        var numberOfDeliveryStores = $("#numberOfDeliveryStores").val();
        if(Number(numberOfDeliveryStores) > 0){
            $("#pills-delivery-store").removeClass("hide");
            $("#numOfDeliveryAvailableStore").text("Available Stores ("+numberOfDeliveryStores+")");
        }else{
            $("#pills-delivery-store").addClass("hide");
        }
        var numberOfPickupStores = $("#numberOfPickupStores").val();

        if(Number(numberOfPickupStores) > 0){
            $("#pills-pickup-store").removeClass("hide");
            $("#numOfPickupAvailableStore").text("Available Stores ("+numberOfPickupStores+")");
        }else{
            $("#pills-pickup-store").addClass("hide");
        }
        var isStoreListingEnable = false;
        isStoreListingEnable = $("#isStoreListingEnable").val();
        var storeListingKey = $("#storeListingKey").val();

        if (isStoreListingEnable  && (storeListingKey === "STATE_BASED" || storeListingKey === "ALPHABETICAL,STATE_BASED") ) {


            $("#deliveryStateList").removeClass('hide');

            $("#deliveryStoreList").addClass('hide');

            $("#pickupStateList").removeClass('hide');

            $("#pickupStoreList").addClass('hide');

        } else {
            showAllStore();
        }
    } else {

        if($("#pills-delivery-tab-store").hasClass('active')){
            var isDeliveryStoreExist = false ;
            var numOfDeliveryAvailableStore = 0 ;

            $(".searchDeliveryStoreNameAndAddress").each(function (inputField) {
                var fieldValue = $(this).val();
                var trimFieldValue = fieldValue.split(' ').join('');

                if (!trimFieldValue.toLowerCase().includes(trimInputValue)) {
                    $(this).parent().addClass('hide');

                } else {
                    $(this).parent().removeClass('hide');
                    isDeliveryStoreExist = true ;
                    numOfDeliveryAvailableStore = numOfDeliveryAvailableStore + 1;
                }

            })

            $("#numOfDeliveryAvailableStore").text("Available Stores ("+numOfDeliveryAvailableStore+")");


            if (!isDeliveryStoreExist) {
                 $("#pills-delivery-store").removeClass("hide");
                 $("#deliveryUnavailable").removeClass('hide');
                 $("#deliveryUnavailableMessage").text("No results for '"+ inputValue.trim()+"' was found for Delivery")
            } else {
                 $("#pills-delivery-store").removeClass("hide");
                 $("#deliveryUnavailable").addClass('hide');
            }

        }

        if($("#pick_up_btn").hasClass('active')){
            var isPickupStoreExit = false ;
            var numOfPickupAvailableStore = 0 ;
            $(".searchPickUpStoreNameAndAddress").each(function (inputField) {

                var fieldValue = $(this).val();
                var trimFieldValue = fieldValue.split(' ').join('');

                if (!trimFieldValue.toLowerCase().includes(trimInputValue)) {
                    $(this).parent().addClass('hide');

                } else {
                    $(this).parent().removeClass('hide');
                    isPickupStoreExit = true ;
                    numOfPickupAvailableStore = numOfPickupAvailableStore + 1 ;
                }

            })

            $("#numOfPickupAvailableStore").text("Available Stores ("+numOfPickupAvailableStore+")")

            if (!isPickupStoreExit) {
                $("#pills-pickup-store").removeClass("hide");
                $("#pickupUnavailable").removeClass('hide');
                $("#pickupUnavailableMessage").text("No results for '"+ inputValue.trim()+"' was found for Pick up")
            } else {
                $("#pills-pickup-store").removeClass("hide");
                $("#pickupUnavailable").addClass('hide');
            }
        }

    }
}


function deliverySearchBar() {
    var numberOfDeliveryStores = $("#numberOfDeliveryStores").val();

    var deliveryStoresStr = $("#deliveryStoreInitial").val();

    $("#numOfDeliveryAvailableStore").text("Available Stores ("+numberOfDeliveryStores+")")


    if (numberOfDeliveryStores >= 4) {
        $("#deliveryUnavailable").addClass("hide");
        $("#searchBar").removeClass('hide');
        $("#searchBar").val('');

    } else {
        $("#deliveryUnavailable").removeClass("hide");
        $("#searchBar").addClass('hide');
    }

    var storeListingKey = $("#storeListingKey").val();


    if ((storeListingKey === "STATE_BASED" || storeListingKey === "ALPHABETICAL,STATE_BASED") && !$("#deliveryStateList").hasClass('hide')){
        $("#searchBar").removeClass('hide');
        $("#searchBar").val('');
    }


    if(numberOfDeliveryStores > 0){
        //$("#deliveryUnavailable").addClass("hide");
      //  $("#pills-delivery-store").addClass("show active");
    }else{
       // $("#deliveryUnavailable").removeClass("hide");
       //$("#pills-delivery-store").addClass("hide");
    }

    var deliveryStoreIds = JSON.parse(deliveryStoresStr);

    $("#deliveryStoreList li").each(function(idx, li) {
        var deliverId = $(this).attr("id");
        var deliveryIdDl = deliverId.substring(0,deliverId.length - 3);
        if(!deliveryStoreIds.includes(deliveryIdDl)){
            $("#"+deliverId).addClass('hide');
        }else{
            $("#"+deliverId).removeClass('hide');
        }
    });

}

function pickupSearchBar() {
   // $("#pills-delivery-store").removeClass("show active");
    var numberOfPickupStores = $("#numberOfPickupStores").val();

    var pickupStoresStr = $("#pickupStoreInitial").val();


    $("#numOfPickupAvailableStore").text("Available Stores ("+numberOfPickupStores+")")

    if (numberOfPickupStores >= 4) {
        $("#searchBar").removeClass('hide');
        $("#searchBar").val('');
    } else {
        $("#searchBar").addClass('hide');
    }

    var storeListingKey = $("#storeListingKey").val();


    if ((storeListingKey === "STATE_BASED" || storeListingKey === "ALPHABETICAL,STATE_BASED") && !$("#pickupStateList").hasClass('hide')){

        $("#searchBar").removeClass('hide');
        $("#searchBar").val('');
    }

    if(numberOfPickupStores > 0){
       // $("#pills-pickup-store").addClass("show active");
       $("#pickupUnavailable").addClass('hide');
    }else{
        $("#pickupUnavailable").removeClass('hide');
       // $("#pills-pickup-store").addClass("hide");
    }

    var pickupStoreIds = JSON.parse(pickupStoresStr);

    $("#pickupStoreList li").each(function(idx, li) {
        var pickupId = $(this).attr("id");
        var pickupIdPL = pickupId.substring(0,pickupId.length - 3);
        if(!pickupStoreIds.includes(pickupIdPL)){
            $("#"+pickupId).addClass('hide');
        }else{
            $("#"+pickupId).removeClass('hide');
        }

    });


}