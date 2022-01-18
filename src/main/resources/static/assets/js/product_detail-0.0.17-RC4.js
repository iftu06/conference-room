var addOn = {};
var variant = {};


function getQuantityIdProdDet(){
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        return "#prodQntDetMob";
    }else{
         return "#prodQntDet";
    }
}

function mapNumber(input) {
    if (input == 1) {
        return "One";
    } else if (input == 2) {
        return "Two";
    } else if (input == 3) {
        return "Three";
    }

}


function showMinSelectionRequiredDet(addonId, minSelectionsRequired) {
      var addOnType = {};
       if (addOn[addonId]) {
           addOnType = addOn[addonId]['type'];
       }

       var selectedAddOnLength = getSelectedAddOnDet(addonId);

       if (selectedAddOnLength < minSelectionsRequired) {
               makeLabelRequiredDet(addonId)
       } else if (selectedAddOnLength == minSelectionsRequired && minSelectionsRequired > 0) {
               makeLabelSelectedDet(addonId);
       } else if (minSelectionsRequired == 0 && selectedAddOnLength > 0) {
           makeLabelSelectedDet(addonId);
       }else if(minSelectionsRequired == 0 && selectedAddOnLength == 0){
            makeLabelOptionalDet(addonId)
       }
}

function getSelectedAddOnDet(addonId) {

    var totalSelectedAddOn = 0;

    var addOnType = addOn[addonId]['type'];

    for (var key in addOnType) {
        var qnt = addOnType[key]['qnt'];
        totalSelectedAddOn += qnt;
    }
    return totalSelectedAddOn;
}


function makeLabelSelectedDet(addonId){
    var addOnRequiredLabelId = "#addOn_det_required_span_" + addonId;
    var addOnSelectedLabelId = "#addOn_det_selected_span_" + addonId;
    var addOnOptinalLabelId = "#addOn_det_optional_span_" + addonId;

    $(addOnRequiredLabelId).hide();
    $(addOnSelectedLabelId).removeClass("d-none");
    $(addOnOptinalLabelId).hide();
}

function makeLabelRequiredDet(addonId){
    var addOnRequiredLabelId = "#addOn_det_required_span_" + addonId;
    var addOnSelectedLabelId = "#addOn_det_selected_span_" + addonId;
    var addOnOptinalLabelId = "#addOn_det_optional_span_" + addonId;

    $(addOnRequiredLabelId).show();
    $(addOnSelectedLabelId).addClass("d-none");
    $(addOnOptinalLabelId).hide();
    //$(addOnSelectedLabelId).hide();
}

function makeLabelOptionalDet(addonId){
    var addOnRequiredLabelId = "#addOn_det_required_span_" + addonId;
    var addOnSelectedLabelId = "#addOn_det_selected_span_" + addonId;
    var addOnOptinalLabelId = "#addOn_det_optional_span_" + addonId;
    $(addOnRequiredLabelId).hide();
    $(addOnSelectedLabelId).addClass("d-none");
    $(addOnOptinalLabelId).show();
}


function makeCheckboxDisabledDet(addonId){
    var addOnClass = addonId.replace(" ", "_") + "_det_class";
    $('.'+addOnClass+':checkbox:not(:checked)').each(function(){
        $(this).attr('disabled',true);
    });
}

function makeCheckboxEnabledDet(addonId){
    var addOnClass = addonId + "_det_class";
    $('.'+addOnClass+':checkbox:not(:checked)').each(function(){
        $(this).removeAttr('disabled');
    });
}



function insertAddOnDet(addonId, subType, maxSelectionsAllowed, minSelectionsRequired) {
    var addOnSubTypeId = subType.sku;
    var checkBoxId = "#check_det_" + addOnSubTypeId;

    var addOnPrice = subType.price.amount;
    var defaultSelection = subType.defaultSelection;

    var addOnType = {};
    var isAddOnExist = addonId in addOn ? true : false;
    if (isAddOnExist) {
        addOnType = addOn[addonId]["type"];
    } else {
        addOn[addonId] = {};
        addOn[addonId]["type"] = {};
        addOn[addonId]["type"][addOnSubTypeId] = {};
    }
    var isAddOnTypeExist = addOnSubTypeId in addOnType ? true : false;
    var addOnTypeLength = Object.keys(addOnType).length;

    if (isAddOnTypeExist) {
        delete addOnType[addOnSubTypeId];
        addOnTypeLength = addOnTypeLength - 1;
        makeCheckboxEnabledDet(addonId);
    } else {
        addOnType[addOnSubTypeId] = {};
        if (addOnTypeLength < maxSelectionsAllowed) {
            addOnType[addOnSubTypeId]['price'] = addOnPrice;
            addOnType[addOnSubTypeId]['qnt'] = 1;
            addOnTypeLength = addOnTypeLength + 1;
            addOn[addonId]["minSelectionsRequired"] = minSelectionsRequired;
            if(addOnTypeLength == maxSelectionsAllowed){
               makeCheckboxDisabledDet(addonId);
            }else{
               makeCheckboxEnabledDet(addonId);
            }
        } else {
            makeLabelSelectedDet(addonId);
            return;
        }

    }

    if (!addOnTypeLength) {
        addOnTypeLength = 0;
    }

    addOn[addonId]["type"] = addOnType;
    showMinSelectionRequiredDet(addonId, minSelectionsRequired)
    calculateTotalDet();

}


function getVariantIdInDetailsPage(){

    var variantId = $("input[name='product_det_variant_radio']:checked").val();
    if (!variantId){
        variantId = $("#baseVariantDet").val();
    }
    return variantId;
}



function calculateTotalDet() {
    var qntId = getQuantityIdProdDet();
    var totalAddOnPrice = 0;
    var variantPrice = 0;
    var itemCountStr = $(qntId).val();

    var variantKey = getVariantIdInDetailsPage();

    var variantPrice = variantKey ? Number(variant[variantKey]) : 0;

    //var variantPrice = Number(variant[variantKey]);

    if(!isNaN(variantPrice)){
        totalAddOnPrice = getTotAddOnPriceDet();

        var totalPrice = (totalAddOnPrice + variantPrice) * Number(itemCountStr);
        totalPrice = (Math.round(totalPrice * 100) / 100).toFixed(2);
        totalPrice = totalPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var totPriceWithCurrency = currency + totalPrice;
        $("#modal_product_price_st_det").text(totPriceWithCurrency);
        $("#productPrice").val(totPriceWithCurrency);
    }
}

function getTotAddOnPriceDet() {
    var totalAddOnPrice = 0;
    var addOnType = {};
    var qnt = 0 ;
    var addOnPrice = 0;
    for (var addonId in addOn) {
        addOnType = addOn[addonId]['type'];
        for (var key in addOnType) {
            addOnPrice = addOnType[key]['price'];
            qnt = addOnType[key]['qnt'];
            totalAddOnPrice += Number(addOnPrice) * qnt;
        }
    }
    return totalAddOnPrice;
}

function increaseQuantityDet() {
    var qntId = getQuantityIdProdDet();
    var currentQnt = $(qntId).val();

    var updatedQnt = Number(currentQnt) + 1;
    $(qntId).val(updatedQnt);
    calculateTotalDet();
}


function decreaseQuantityDet() {
    var qntId = getQuantityIdProdDet();
    var currentQnt = $(qntId).val();

    if (currentQnt > 1) {
        var updatedQnt = Number(currentQnt) - 1;
        $(qntId).val(updatedQnt);
        calculateTotalDet();
    }
}

function getAddOnTypes() {
    var addOnTypes = [];
    var quantity = 1;
    for (var addonId in addOn) {
        addOnType = addOn[addonId]['type'];
        for (var key in addOnType) {
            quantity = addOnType[key]['qnt'];

            for (var i = 0; i < quantity ; i++) {
                addOnTypes.push(key);
            }
        }
    }
    return addOnTypes;
}

function getProductSummaryDet() {
    var qntId = getQuantityIdProdDet();
    var productId = $("#productIdDet").val();
    var variantId = $("input[name='product_det_variant_radio']:checked").val();
    var lineItemNoteDet = $("#lineItemNoteDet").val();

    if(!variantId){
        variantId = $("#baseVariantDet").val();
    }
    var quantity = $(qntId).val();


    var purchase = {
        "productId": productId,
        "variantId": variantId,
        "addOnSubTypeIds": getAddOnTypes(),
        "quantity": quantity,
        "note" : lineItemNoteDet
    };

    return purchase;

}


function checkProductRecommendationInDetailsPage(productId) {

    isProductRecommended(productId).then(function(data){
        $('#overlay').hide();
        $("#upsellCrossSellProduct").val(data.productStr);
        var product = JSON.parse(data.productStr);
        var upSellCrossSellUrl = getUpSellCrossSellUrl(product.upSellEnabled,product.crossSellEnabled);
        var isMinAdOnSelected = checkIfMinAddOnIsSelectedDet();

        if(isMinAdOnSelected){
            addItemToCartDet();
        }else{
            return false;
        }

        if(product.upSellEnabled || product.crossSellEnabled){
            if(isMinAdOnSelected){
                var productUpSellCrossSell = {
                    "productId" : product.productId,
                    "upsellEnabled" : product.upSellEnabled,
                    "crossSellEnabled" : product.crossSellEnabled,
                    "upSellCrossSellUrl" : upSellCrossSellUrl
                }
                localStorage.setItem("productUpSellCrossSell", JSON.stringify(productUpSellCrossSell));
                if(product.upSellEnabled){
                    var purchase = getProductSummaryDet();
                    localStorage.setItem("sourceProductForUpsell", JSON.stringify(purchase));
                }
            }
        }

    })

}



function checkIfMinAddOnIsSelectedDet() {
    var isSelected = true;
    var msg = '';
    for (var addonId in addOn) {
        var minSelectionsRequired = addOn[addonId]["minSelectionsRequired"];
        var addOnType = addOn[addonId]["type"];

        var selectedAddOnLength = getSelectedAddOnDet(addonId);
        if (selectedAddOnLength < minSelectionsRequired) {
            isSelected = false;
            msg = 'You must select at least ' + minSelectionsRequired + ' add ons from ' + addOnLabel[addonId]  + ' to add the product to cart.'
            $("#min_require_addon_warning").text(msg);
            $("#snackbar-addons").addClass('show');
            return false;
        }

    }

    $('#min_require_addon_warning').text('');
    return true;

    //addItemToCartDet();

}


function addItemToCartDet() {
    var cartUrl = "/webstore-v2/"+businessId+"/cart/add";
    var purchase = getProductSummaryDet();

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: cartUrl,
        data: JSON.stringify(purchase),
        dataType: 'json',
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            if (data['status'] == "success") {
                addOn = {};
                variant = {};
                var isProductDetailsPage = $("#isProductDetailsPage").val();
                var content = data.response;
                localStorage.setItem("cartId", content.cartId);
                var cart = {"cartId": content.cartId, "cartQnt": content.purchases.length};
                localStorage.setItem("cart", JSON.stringify(cart));
                localStorage.setItem("toggleCart", true);
                var productId = $("#productIdDet").val();
                addGoogleAnalyticsForAddItems();
                window.location = "/webstore-v2/" + businessId+"/products/"+productId ;

            } else if (data['status'] == 'error') {
                 $('#overlay').hide();
                 var errCode = data.response.code;
                 showErrorModal(errCode);


            }
        },
        error: function (e) {
        }
    });
}

function addGoogleAnalyticsForAddItems() {
    var isGoogleAnalyticsEnabled = document.getElementById("isGoogleAnalyticsEnabled").value;

    if (isGoogleAnalyticsEnabled === "true") {
        var productName = $("#modal_product_name").val();
        var categoryName = $("#categoryId").val();
        var isProductDetailsPage = $("#isProductDetailsPage").val();
        var totalPrice = $("#productPrice").val();

        var itemCountStr, productId;

        if (isProductDetailsPage == true) {
            productId = $("#productIdDet").val()
            var qntId = getQuantityIdProdDet();
            itemCountStr = $(qntId).val();
        } else {
            productId = $("#productId").val()
            var qntId = getQuantityId();
            itemCountStr = $(qntId).val();
        }

        var products = {
            item_id: productId,
            item_name: productName,
            item_category:categoryName,
            //item_variant:variantName,
            quantity:itemCountStr,
            totalPrice:totalPrice,
            currency:currency
        };

        //Prepare ecommerce event params
        var ecommerce_products = {
            currency: currency,
            value: totalPrice,
            items: [products]
        };

        if (productId != null && productName != null && categoryName != null
                && totalPrice != null && itemCountStr != null) {
                //alert("Products:" + totalPrice + ":" + productName);
            firebase.analytics().logEvent(firebase.analytics.EventName.ADD_TO_CART, ecommerce_products);
        }
    }
}

$(document).ready(function () {

    var toggleCart = localStorage.getItem("toggleCart");
    if(toggleCart){
        getCart();
        localStorage.removeItem("toggleCart");
    }

    var productUpSellCrossSellStr = localStorage.getItem("productUpSellCrossSell");
    var productUpSellCrossSell = JSON.parse(productUpSellCrossSellStr);
    var productId = $("#productIdDet").val();
    if(productUpSellCrossSell && productId == productUpSellCrossSell.productId){
        loadUpSellCrossSellModalInDetailsPage(productUpSellCrossSell.upSellCrossSellUrl);

    }
    localStorage.removeItem("productUpSellCrossSell");


})


function loadUpSellCrossSellModalInDetailsPage(upSellCrossSellUrl) {

    var product = getProducToLoadUpSellCrossSellModal();
    var productRequestString = JSON.stringify(product);

    if ($('#productModalContainer').hasClass('show')) {
        $('#productModalContainer').modal('hide');
    }

    var sourceProductForUpsellStr = localStorage.getItem("sourceProductForUpsell");
    if(sourceProductForUpsellStr && sourceProductForUpsellStr != ''){
        $("#upsellPurchase").val(sourceProductForUpsellStr);
    }
    localStorage.removeItem("sourceProductForUpsell");

    initializeUpSellCressSellProductModal();

    $.ajax({
            type: "GET",
            contentType: "application/json",
            url: upSellCrossSellUrl,
            data: {
                productStr : productRequestString
            },
            beforeSend: function (xhr) {
                $('#overlay').show();
            },
            success: function (data) {
                $("#overlay").hide();
                $('#upselling_crossSelling_loaded_view').html(data);
                var isRecommendedProductsEmpty = $("#isRecommendedProductsEmpty").val();
                if(isRecommendedProductsEmpty == 'false'){
                    $("#upsellPurchase").val(sourceProductForUpsellStr);
                    $('#upselling_crossSelling_loaded_view').show();
                }else{
                    $('#upsellingCrossSellingModalContainer').modal('hide');
                    //$('#upselling_crossSelling_loaded_view').hide();
                }
            },
            error: function (e) {
            }
        });

}





function checkQntValidityDet(){
    var qntId = getQuantityIdProdDet();
    var currentQnt = $(qntId).val();

    if(!currentQnt){
      $(qntId).val(1);
      calculateTotalDet();
    }
}


function changeItemQuantityDet(event) {
    var qntId = getQuantityIdProdDet();
    var currentQnt = $(qntId).val();

    if(!currentQnt){
       // return;
    }else{
        currentQnt = Number(currentQnt);
        if(currentQnt == 0){
            $(qntId).val(1);
        }else{
            $(qntId).val(currentQnt);
        }
    }
    calculateTotalDet();
}


function allowOnlyNumberDet(evt,elem)
{

  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)){
    return false;
  }

  if(evt.which == 13){
       evt.preventDefault();
       $("#prodQntDet").blur();
       $("#prodQntDetMob").blur();
    }

  return true;
}

function increaseAddOnSubTypeQntDet(addonId,addOnSubTypeId,price,actionType,defaultSelection,maxSelectionsAllowed,minSelectionsRequired){

    var subTypeInputId = '#'+addOnSubTypeId + '_multi';
    var isAddOnExist = addonId in addOn ? true : false;
    var qnt;
    var increaseAddOn = countAddOnSubTypeDet(addonId,maxSelectionsAllowed);

    var addOn_quantity_button_id = '#addOn_quantity_'+addOnSubTypeId;


    if (defaultSelection) {
        qnt = 1;
    } else {
        qnt = 0;
    }


    if (increaseAddOn || actionType == 'DECREASE' ) {
        if (isAddOnExist) {
            var addOnType = addOn[addonId]["type"];
            var isAddOnTypeExist = addOnSubTypeId in addOnType ? true : false;
            if (isAddOnTypeExist) {
                qnt = addOnType[addOnSubTypeId]['qnt'];
                if (actionType == 'INCREASE' && increaseAddOn) {
                    qnt = qnt + 1;
                    addOnType[addOnSubTypeId]['qnt'] = qnt;
                } else if (actionType == 'DECREASE' && qnt > 0) {
                    qnt = qnt - 1;
                    addOnType[addOnSubTypeId]['qnt'] = qnt;
                }
            } else {

                // addOn[addonId]["type"] = {};
                addOn[addonId]["type"][addOnSubTypeId] = {};
                if (actionType == 'INCREASE' && increaseAddOn) {
                    qnt = qnt + 1;
                    addOn[addonId]["type"][addOnSubTypeId]['qnt'] = qnt;
                    addOn[addonId]["type"][addOnSubTypeId]['price'] = price;
                } else if (actionType == 'DECREASE' && qnt > 0) {
                    qnt = qnt - 1;
                    addOn[addonId]["type"][addOnSubTypeId]['qnt'] = qnt;
                    addOn[addonId]["type"][addOnSubTypeId]['price'] = price;
                } else if (actionType == 'DECREASE' && qnt ==0){
                    addOn[addonId]["type"][addOnSubTypeId]['qnt'] = 0;
                    addOn[addonId]["type"][addOnSubTypeId]['price'] = price;
                }


            }
        } else {
            addOn[addonId] = {};
            addOn[addonId]["type"] = {};
            addOn[addonId]["type"][addOnSubTypeId] = {};
            if (actionType == 'INCREASE' && increaseAddOn) {
                addOn[addonId]["type"][addOnSubTypeId]['qnt'] = qnt;
            } else if (actionType == 'DECREASE' && qnt > 0) {
                qnt = qnt - 1;
                addOn[addonId]["type"][addOnSubTypeId]['qnt'] = qnt;
            }
        }

        $(subTypeInputId).val(qnt);

        showMinSelectionRequiredDet(addonId, minSelectionsRequired);
        calculateTotalDet();
    }

}

function countAddOnSubTypeDet(addonId,maxSelectionsAllowed){
    var totalSelectedAddOn = 0;

    var addOnType = addOn[addonId]['type'];

    for (var key in addOnType) {
        var qnt = addOnType[key]['qnt'];
        totalSelectedAddOn += qnt;
    }

    if (maxSelectionsAllowed > totalSelectedAddOn) {
        return true;
    } else if (maxSelectionsAllowed <= totalSelectedAddOn) {
        return false;
    }


}
