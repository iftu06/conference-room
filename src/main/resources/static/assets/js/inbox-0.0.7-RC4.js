
function popupInbox(){

        getNotification();
}


function getNotification() {
    const notificationUrl = "/webstore-v2/"+businessId+"/notification";

    $.ajax({
        type: "GET",
        url: notificationUrl,
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
           $('#overlay').hide();
           $("#side_bar").empty();
           $("#side_bar").html(data);
            $("#toggle-inbox").on("click",function(){
                var hasActiveClass = $("#side_bar").hasClass("active");
                if(hasActiveClass){
                    $(".mini-cart").removeClass('active');
                }
            })

            $("#toggle-inbox-back-btn").on("click",function(){
                var hasActiveClass = $("#side_bar").hasClass("active");
                if(hasActiveClass){
                    $(".mini-cart").removeClass('active');
                }
            })

            var notifications = JSON.parse($("#notificationsStr").val());

            for(var i in notifications){
                var notification = notifications[i];
                var purchaseDate = notification.receivedDate;
                var messageId = notification.messageId;
                var formattedDate = moment(purchaseDate).
                                format($('#date-time-format-notification-inbox').val());
                $("#"+messageId).text(formattedDate);
            }

           $(".mini-cart").toggleClass('active');
           $('#navbar-notification-alert').hide();
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function viewNotification(notification) {

    var event = notification.event;

    var transactionId = notification.correlationId;

    var purchaseHistoryUrl = "/webstore-v2/"+businessId+"/purchase-history?correlationId="+transactionId;

    var categoryUrl = "/webstore-v2/"+businessId+"/categories/"+notification.correlationId+
                                "/products";

    var productUrl = "/webstore-v2/"+businessId+"/products/"+notification.correlationId+"/?category=Promo";

    $('#notification-action-button').removeClass('hide');

    if (event == "SALES_ORDER_READY") {
        $('#notification-title').text("Order is Ready");
        $('#notification-action-button').text("View Order");
        $('#notification-action-button').attr("href", purchaseHistoryUrl);
    } else if (event == "SALES_ORDER_REJECTED") {
        $('#notification-title').text("Order is Rejected");
        $('#notification-action-button').text("View Order");
        $('#notification-action-button').attr("href", purchaseHistoryUrl);
    } else if (event == "SALES_ORDER_COMPLETED") {
        $('#notification-title').text("Order is Completed");
        $('#notification-action-button').text("View Order");
        $('#notification-action-button').attr("href", purchaseHistoryUrl);
    } else if (event == "SALES_ORDER_ACCEPTED") {
        $('#notification-title').text("Order is Accepted");
        $('#notification-action-button').text("View Order");
        isItCurbsideOrder(transactionId)
        .then(function(response){
            console.log(response);
            if(response.isCurbSidePickUp && response.isCustomerHere){
                $(".mini-cart").toggleClass('active');
                purchaseViewModal(businessId, transactionId);
            }else{
                $('#notification-action-button').attr("href", purchaseHistoryUrl);
                showNotificationModal(notification)
            }
        })

    } else if (event == "SALES_ORDER_VOID") {
        $('#notification-title').text("Order is Void");
        $('#notification-action-button').text("View Order");
        $('#notification-action-button').attr("href", purchaseHistoryUrl);
        showNotificationModal(notification);
    } else if (event == "PRODUCT_PROMO") {
        $('#notification-title').text("Product Promo");
        $('#notification-action-button').text("View Product");
        $('#notification-action-button').attr("href", productUrl);
        showNotificationModal(notification)
    } else if (event == "CATEGORY_PROMO") {
        $('#notification-title').text("Category Promo");
        $('#notification-action-button').text("View Category");
        $('#notification-action-button').attr("href", categoryUrl);
        showNotificationModal(notification)
    } else {
        $('#notification-title').text("Announcement");
        $('#notification-action-button').addClass('hide');
        showNotificationModal(notification)
    }

}

function showNotificationModal(notification){
    $('#notification-message').text(notification.message);
    $('#notification-modal').modal('show');
}

function isItCurbsideOrder(transactionId){
    var curbUrl = "/webstore-v2/"+businessId+"/"+transactionId+"/isCurbSide";
    return new Promise(function(resolve,reject){
            $.ajax({
               type: "POST",
               contentType: "application/json",
               url: curbUrl,
               beforeSend: function (xhr) {
                   $('#overlay').show();
               },
               success: function (data) {
                   $('#overlay').hide();
                   resolve(data.response);
               },
               error: function (e) {

               }
            });

        });
}






