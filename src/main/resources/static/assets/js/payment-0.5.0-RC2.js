$(document).ready(function () {
    loadRewardsView();
});

function loadRewardsView() {
    //$('#reward-point-div').addClass("hide");
    var checkoutStatus = $('#checkoutStatus').val();
    var rewardsIntegrationEnabled = $('#rewardsIntegrationEnabled').val();
    var isLoggedIn = $('#isLoggedIn').val();
    if (rewardsIntegrationEnabled === 'true' && isLoggedIn === 'true' && checkoutStatus === 'SUCCESS') {
        var rewardsPointsRetrievalWaitTime = $('#rewardsPointsRetrievalWaitTime').val();
        $('#error-rewards-content').addClass("hide");
        $("#loding-reward-content").removeClass("hide");
        var delay = rewardsPointsRetrievalWaitTime;
        setTimeout(loadPayNowPointSection, delay);
    }
}


function loadPayNowPointSection() {
    var pointsUrl = '/webstore-v2/'+businessId+'/get-points';
    var transactionId = $("#transactionId").val();

    $.ajax({
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        url: pointsUrl,
        data: {transactionId: transactionId},
        success: function (data) {
            $("#loding-reward-content").addClass("hide");
            $('#reward-point-div').removeClass("hide");
            if(data.status === 'SUCCESS') {
                var rewardUrl = '/webstore-v2/'+businessId+'/rewards';
                var rewardAnchor = '<a class="reward-link" href="'+rewardUrl+'">'+'Rewards</a>';
                var rewardSuccessText = $('#rewardPara').text();
                if(rewardSuccessText){
                    rewardSuccessText = rewardSuccessText.replace("{0}", rewardAnchor);
                    $('#rewardPara').html(rewardSuccessText);
                }
                $('#reward-success-content').removeClass("hide");
                $("#subtype-instruction").removeClass("hide")
                $('#error-rewards-content').addClass("hide");

                var rewardsTitle = $('#rewardsTitleHidden').val();
                var points = data.awardedPoints.toString();
                points = points.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                rewardsTitle = rewardsTitle.replace("{0}", points);
                var rewardsProvider = $('#rewardsProvider').val();
                rewardsTitle = rewardsProvider === 'Fivestars'
                                ? rewardsTitle.replace("{1}",rewardsProvider) : rewardsTitle.replace("{1}","");

                $('#rewardsSuccessTitle').text(rewardsTitle)
            } else {
                $('#reward-success-content').addClass("hide");
                $('#error-rewards-content').removeClass("hide");
            }

        },
        error: function (e) {
             $('#reward-point-content').addClass("hide");
             $('#error-rewards-content').removeClass("hide");
        }
    });
}
