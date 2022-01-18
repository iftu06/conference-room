


function enrollCustomerToRewards() {
    var rewardUrl = "/webstore-v2/"+businessId+"/rewards/customer/enroll"
    $("#rewards-enroll-btn").addClass('hide');
    $('#rewards-enroll-loading-spinner').removeClass('hide');
    $("#rewards-enroll-loading").removeClass('hide');

    $.ajax({
        url: rewardUrl,
        type: 'post',
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (data.status == "SUCCESS"){
                 console.log("User successfully enrolled with rewards service");
                 window.location = "/webstore-v2/"+businessId+"/rewards";
             } else {
                 if (data.status == "FAILED" && data.response == "INVALID_MSISDN") {
                       //$('#generic-rewards-error-message-container').addClass('hide');
                       //$('#mobile-number-rewards-error-message-container').removeClass('hide');
                       $("#invalid_mobile").show();
                       $("#customer_exist").hide();
                       $("#reward_error_modal").modal("show");
                 } else if(data.status == "FAILED") {
                      $("#invalid_mobile").hide();
                      $("#customer_exist").show();
                      $("#reward_error_modal").modal("show");
                 }
                //$('#rewards-v2-user-enroll-error-modal').modal("show");
                //$("#rewards-enroll-btn-text").text(enrollNowText);
                //$('#rewards-enroll-loading-spinner').addClass('hide');
             }

              $("#rewards-enroll-btn").removeClass('hide');
              $('#rewards-enroll-loading-spinner').addClass('hide');
              $("#rewards-enroll-loading").addClass('hide');

          }, error: function (error) {
             $('#rewards-v2-user-enroll-error-modal').modal("show");
             $('#rewards-enroll-loading-spinner').addClass('hide');
             $("#rewards-enroll-btn-text").text(enrollNowText);
             $('#rewards-enroll-loading-spinner').addClass('hide');
          }
    });
}


function addRedeemItem(ruleId, externalThirdPartId, ruleName, rewardPoints,minOrderValue,
                        isDisclaimerTextAvailable, disclaimerText){
    console.log(isDisclaimerTextAvailable);
    console.log(disclaimerText);
    var minOrderValueLabel = "Over "+currency+minOrderValue
    var rewardPointsLabel = rewardPoints+" Points";
    var campaign_img = $("#"+ruleId+"_img").css('background-image');
    $('#campaign_img').css('background-image',campaign_img);
    $('#redeem-item-name').text(ruleName);
    $('#redeem-item-points').text(rewardPointsLabel);
    $('#points-btn').text(rewardPointsLabel);
    $('#min-order-value').html(minOrderValueLabel);
    $('#rewardsRuleId').val(ruleId);
    $('#external-third-party-id').val(externalThirdPartId);
    $('#rewards-rule-name').val(ruleName);
    $('#minOrderValue').val(minOrderValue);
    if(isDisclaimerTextAvailable === true) {
        $('#disclaimerCard').removeClass('hide');
        $('#disclaimerText').text(disclaimerText)
    } else {
        $('#disclaimerCard').addClass('hide');
    }

    $('#rewards-redeem-modal').modal("show");
}



function addRewardsToCart(){
    var rewardsUrl = '/webstore-v2/'+businessId+'/add-rewards-item';

    var rewardsId = $('#rewardsRuleId').val();
    $("#redeem_now_"+rewardsId).addClass('hide');
    $("#cancel_redeem_"+rewardsId).removeClass('hide');
    $('#add_redeem_btn').addClass('hide');
    $('#redeem_process_btn').removeClass('hide');
    console.log(rewardsId);

    $.ajax({
        type: 'GET',
        url: rewardsUrl + "?rewardsId=" + rewardsId,
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $('#overlay').hide();
            var status =  data.status;
            $("#rewards-redeem-modal").modal('hide');
            $('#add_redeem_btn').removeClass('hide');
            $('#redeem_process_btn').addClass('hide');

            if (status == "FAILED") {
                $('#rewards-add-common-error').modal('show');
                $("#add-rewards-redeeming-item-to-cart-button-"+rewardsId).addClass('hide');
                $("#add-rewards-item-to-cart-button-"+rewardsId).removeClass('hide');
                $('#rewards-v2-redeem-add-modal-footer').removeClass('hide');
                $('#rewards-v2-redeeming-add-modal-footer').addClass('hide');

            } else {
                $(".cancel_reward").addClass("hide");
                $(".rewards-applied-text").addClass("hide");
                $(".redeem_now").removeClass("hide");
                //$("#add-rewards-redeeming-item-to-cart-button-"+rewardsId).addClass('hide');
               // $("#add-rewards-item-to-cart-button-"+rewardsId).removeClass('hide');
                //$('#rewards-v2-redeem-add-modal-footer').removeClass('hide');
                $('#rewards-applied-text-'+rewardsId).removeClass('hide');
                $('#redeem_now_'+rewardsId).addClass('hide');
                $('#cancel_redeem_'+rewardsId).removeClass('hide');
                getCart();
            }
        },
        error: function (e) {
            $('#rewards-add-common-error').modal('show');
            $("#add-rewards-redeeming-item-to-cart-button-"+rewardsId).addClass('hide');
            $("#add-rewards-item-to-cart-button-"+rewardsId).removeClass('hide');
            $("#rewards-v2-redeem-add-modal").modal('hide');
            $('#rewards-v2-redeem-add-modal-footer').removeClass('hide');
            $('#rewards-v2-redeeming-add-modal-footer').addClass('hide');
        }

    });

}

$(document).ready(function () {
    var rewardsPointsRetrievalWaitTime = $('#rewardsPointsRetrievalWaitTime').val();
    setTimeout(loadRewardListView, rewardsPointsRetrievalWaitTime);
})

function loadRewardListView() {
    $('#rewards-list-loading').addClass('hide');
    $('#rewardList').removeClass('hide');
}



