var addOn = {};
var variant = {};

function getQuantityId(){
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        return "#prodQntMob";
    }else{
         return "#prodQnt";
    }

}

function initializeProductModal() {
    $('#product_loaded_view').html('');
    $("#productModalContainer").modal("show");
    $('#overlay').show();
    $('#product_loaded_view').hide();
}

function initializeUpSellCressSellProductModal() {
    $('#upselling_crossSelling_loaded_view').html('');
    $("#upsellingCrossSellingModalContainer").modal("show");
    $('#overlay').show();
    $('#upselling_crossSelling_loaded_view').hide();
}

function getProductForCrossSell(upCrossProductId,productId,variantKey) {
    var productUrl = "/webstore-v2/rest/business/" + businessId + "/cross-products/"+'/'+upCrossProductId+'/' + productId+"/"+variantKey;
    initializeProductModal();

    addOn = {};

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: productUrl,
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $("#overlay").hide();
            $('#product_loaded_view').html(data);
            $('#product_loaded_view').show();



        },
        error: function (e) {

        }
    });
}


function getProductForUpSellCrossSell(productId,variantId,sourceVariantId,sourceProductId,isUpsell) {
    var sourceProduct = $("#upsellPurchase").val();
    var productUrl = "/webstore-v2/" + businessId + "/products/" + productId+"/variants/"+variantId;
    initializeProductModal();

    addOn = {};

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: productUrl,
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $("#overlay").hide();
            $('#product_loaded_view').html(data);
            $('#product_loaded_view').show();

            var variantName = $("#variant_name").val();
            if (variantName == '[base]') {
                $("#product_variant").hide();
            }
            if ($('#upsellingCrossSellingModalContainer').hasClass('show')) {
                $('#upselling_crossSelling_loaded_view').hide();
                $('#upsellingCrossSellingModalContainer').modal('hide');
            }

            if(isUpsell){
                $("#isUpsell").val('true');
                $("#upsellVariantId").val(sourceVariantId);
                $("#upsellProductId").val(sourceProductId);
                $("#upsellProduct").val(sourceProduct);

            }



        },
        error: function (e) {

        }
    });
}



function getProduct(productId) {
    var productUrl = "/webstore-v2/rest/business/" + businessId + "/products/" + productId;
    initializeProductModal();

    addOn = {};

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: productUrl,
        beforeSend: function (xhr) {
            $('#overlay').show();
        },
        success: function (data) {
            $("#overlay").hide();
            $('#product_loaded_view').html(data);
            $('#product_loaded_view').show();

            var variantName = $("#variant_name").val();
            if (variantName == '[base]') {
                $("#product_variant").hide();
            }
            if ($('#upsellingCrossSellingModalContainer').hasClass('show')) {
                $('#upselling_crossSelling_loaded_view').hide();
            }



        },
        error: function (e) {

        }
    });
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


function showMinSelectionRequired(addonId, minSelectionsRequired) {
    var addOnType = {};
    if (addOn[addonId]) {
        addOnType = addOn[addonId]['type'];
    }


    var selectedAddOnLength = getSelectedAddOn(addonId);
    var addOnRequiredLabelId = "#addOn_required_span_" + addonId;
    var addOnSelectedLabelId = "#addOn_selected_span_" + addonId;

    if (selectedAddOnLength < minSelectionsRequired) {
            makeLabelRequired(addonId)
    } else if (selectedAddOnLength >= minSelectionsRequired && minSelectionsRequired > 0) {
            makeLabelSelected(addonId);
    } else if (minSelectionsRequired == 0 && selectedAddOnLength > 0) {
        makeLabelSelected(addonId);
    }else if(minSelectionsRequired == 0 && selectedAddOnLength == 0){
         makeLabelOptional(addonId)
    }
}


function getSelectedAddOn(addonId) {

    var totalSelectedAddOn = 0;

    var addOnType = addOn[addonId]['type'];

    for (var key in addOnType) {
        var qnt = addOnType[key]['qnt'];
        totalSelectedAddOn += qnt;
    }
    return totalSelectedAddOn;
}


function makeLabelSelected(addonId){
    var addOnRequiredLabelId = "#addOn_required_span_" + addonId;
    var addOnSelectedLabelId = "#addOn_selected_span_" + addonId;
    var addOnOptinalLabelId = "#addOn_optional_span_" + addonId;

    $(addOnRequiredLabelId).hide();
    $(addOnSelectedLabelId).removeClass("d-none");
    $(addOnOptinalLabelId).hide();
}

function makeLabelRequired(addonId){
    var addOnRequiredLabelId = "#addOn_required_span_" + addonId;
    var addOnSelectedLabelId = "#addOn_selected_span_" + addonId;
    var addOnOptinalLabelId = "#addOn_optional_span_" + addonId;

    $(addOnRequiredLabelId).show();
    $(addOnSelectedLabelId).addClass("d-none");
    $(addOnOptinalLabelId).hide();
    //$(addOnSelectedLabelId).hide();
}

function makeLabelOptional(addonId){
    var addOnRequiredLabelId = "#addOn_required_span_" + addonId;
    var addOnSelectedLabelId = "#addOn_selected_span_" + addonId;
    var addOnOptinalLabelId = "#addOn_optional_span_" + addonId;
    $(addOnRequiredLabelId).hide();
    $(addOnSelectedLabelId).addClass("d-none");
    $(addOnOptinalLabelId).show();
}


function makeCheckboxDisabled(addonId){
    var addOnClass = addonId + "_class";
    $('.'+addOnClass+':checkbox:not(:checked)').each(function(){
        $(this).attr('disabled',true);
    });
}

function makeCheckboxEnabled(addonId){
    var addOnClass = addonId + "_class";
    $('.'+addOnClass+':checkbox:not(:checked)').each(function(){
        $(this).removeAttr('disabled');
    });
}

function increaseAddOnSubTypeQnt(addonId,addOnSubTypeId,price,actionType,defaultSelection,maxSelectionsAllowed,minSelectionsRequired){

    var subTypeInputId = '#'+addOnSubTypeId + '_multi';
    var isAddOnExist = addonId in addOn ? true : false;
    var qnt;
    var increaseAddOn = countAddOnSubType(addonId,maxSelectionsAllowed);

    var addOn_quantity_button_id = '#addOn_quantity_'+addOnSubTypeId;


    if (defaultSelection) {
        qnt = 1;
    } else {
        qnt = 0;
    }


    if (increaseAddOn || actionType == 'DECREASE') {
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

        showMinSelectionRequired(addonId, minSelectionsRequired);
        calculateTotal();
    }

}

function countAddOnSubType(addonId,maxSelectionsAllowed){
    var totalSelectedAddOn = 0;
    var addOnType = {};

    var increaseAddOn = false ;

    addOnType = addOn[addonId]['type'];

    for (var key in addOnType) {

        var qnt = addOnType[key]['qnt'];
        totalSelectedAddOn += qnt;
    }

    if (maxSelectionsAllowed > totalSelectedAddOn) {
        increaseAddOn = true;
    } else if (maxSelectionsAllowed <= totalSelectedAddOn) {
        increaseAddOn = false;
    }


    return increaseAddOn;

}

function insertAddOn(addonId, subType, maxSelectionsAllowed, minSelectionsRequired) {
    var addOnSubTypeId = subType.sku;
    var checkBoxId = "#check_" + addOnSubTypeId;
    //var labelElem = $("#lab_" + addOnId);
    $("#lab_" + addOnSubTypeId).unbind('click');

   // var currentClasses = labelElem.prop("class");
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
       // appendClass(labelElem, "addOnRem", "addOnIns", false);
        delete addOnType[addOnSubTypeId];
        addOnTypeLength = addOnTypeLength - 1;
        makeCheckboxEnabled(addonId);
    } else {
        addOnType[addOnSubTypeId] = {};
        if (addOnTypeLength < maxSelectionsAllowed) {
            addOnType[addOnSubTypeId]['price'] = addOnPrice;
            addOnType[addOnSubTypeId]['qnt'] = 1;
            addOnTypeLength = addOnTypeLength + 1;
            //appendClass(labelElem, "addOnIns", "addOnRem", true);
            addOn[addonId]["minSelectionsRequired"] = minSelectionsRequired;

            if(addOnTypeLength == maxSelectionsAllowed){
                 //makeLabelSelected(addOnName);
                makeCheckboxDisabled(addonId);
            }else{
                makeCheckboxEnabled(addonId);
            }
        } else {
            makeLabelSelected(addonId);
           // appendClass(labelElem, "addOnRem", "addOnIns", false);
            return;
        }

    }


    if (!addOnTypeLength) {
        addOnTypeLength = 0;
    }

    addOn[addonId]["type"] = addOnType;
    showMinSelectionRequired(addonId, minSelectionsRequired)
    calculateTotal();

}


function calculateTotal() {
    var qntId = getQuantityId();
    var totalAddOnPrice = 0;
    var variantPrice = 0;
    var itemCountStr = $(qntId).val();

    //var variantKey = $("#product_variant option:selected").val();
    var variantKey = $("input[name='product_variant_radio']:checked").val();

    if(!variantKey){
        variantKey = $("#baseVariant").val();
    }

    var variantPrice = variantKey ? Number(variant[variantKey]) : 0;


    totalAddOnPrice = getTotAddOnPrice();

    var totalPrice = (totalAddOnPrice + variantPrice) * Number(itemCountStr);
    totalPrice = (Math.round(totalPrice * 100) / 100).toFixed(2);

    totalPrice = totalPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var totPriceWithCurrency = currency  + totalPrice;
    $("#modal_product_price_st").text(totPriceWithCurrency);
    $("#productPrice").val(totPriceWithCurrency);
}

function getTotAddOnPrice() {
    var totalAddOnPrice = 0;
    var addOnType = {};
    var qnt = 0;
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

function increaseQuantity() {
    var qntId = getQuantityId();
    var currentQnt = $(qntId).val();

    var updatedQnt = Number(currentQnt) + 1;
    $(qntId).val(updatedQnt);
    calculateTotal();
}


function changeItemQuantity(event) {
    var qntId = getQuantityId();
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

    calculateTotal();
}

function checkQntValidity(){
    var qntId = getQuantityId();
    var currentQnt = $(qntId).val();

    if(!currentQnt){
      $(qntId).val(1);
      calculateTotal();
    }
}

function allowOnlyNumber(evt,elem)
{
  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)){
    return false;
  }

  if(evt.which == 13){
     evt.preventDefault();
     $("#prodQnt").blur();
     $("#prodQntMob").blur();
  }

  return true;
}

function decreaseQuantity() {
    var qntId = getQuantityId();
    var currentQnt = $(qntId).val();

    if (currentQnt > 1) {
        var updatedQnt = Number(currentQnt) - 1;
        $(qntId).val(updatedQnt);
        calculateTotal();
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

function getProductSummary() {
    var qntId = getQuantityId();

    var productId = $("#productId").val();
    var variantId = $("input[name='product_variant_radio']:checked").val();
    var lineItemNote = $("#lineItemNote").val();
    if(lineItemNote){
        lineItemNote = lineItemNote.trim();
    }

    if(!variantId){
     variantId = $("#baseVariant").val();
    }

    var quantity = $(qntId).val();

    var purchase = {
        "productId": productId,
        "variantId": variantId,
        "addOnSubTypeIds": getAddOnTypes(),
        "quantity": quantity,
        "note": lineItemNote
    };

    return purchase;

}

function getVariantId(){

    var variantId = $("input[name='product_variant_radio']:checked").val();
    if (!variantId){
        variantId = $("#baseVariant").val();
    }
    return variantId;
}

function isProductRecommended(productId){

    var isProductDetailsPage = $("#isProductDetailsPage").val();
    var variantId = isProductDetailsPage != 'true' ? getVariantId() : getVariantIdInDetailsPage();
    var productUrl = "/webstore-v2/rest/business/" + businessId + "/checkProductRecommendation/" + productId + "/" + variantId;

    return new Promise(function(resolve,reject){
        $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: productUrl,
                    beforeSend: function (xhr) {
                        $('#overlay').show();
                    },

                    success: function (data) {
                      resolve(data);
                    },
                    error: function (e) {

                    }
                });


    })

}

function initiateCrossSellUpSell(productId){


    isProductRecommended(productId).then(function(data){
     var product = JSON.parse(data.productStr);
     $("#productStr").val(data.productStr);
     if(product.upSellEnabled || product.crossSellEnabled){
        var upSellCrossSellUrl = getUpSellCrossSellUrl(product.upSellEnabled,product.crossSellEnabled);
        var isProductDetailsPage = $("#isProductDetailsPage").val();
        if(isProductDetailsPage != 'true'){
            loadUpSellCrossSellModal(upSellCrossSellUrl);
            }
        }
    })

}

function checkProductRecommendation(productId,businessId,isAddOrEdit) {

   // isProductRecommended(productId).then(function(data){
       // $('#overlay').hide();
       // $("#productStr").val(data.productStr);
     //   var product = JSON.parse(data.productStr);
      //  var upSellCrossSellUrl = getUpSellCrossSellUrl(product.upSellEnabled,product.crossSellEnabled);
        var isMinAdOnSelected = checkIfMinAddOnIsSelected();

        if(isMinAdOnSelected){
            if(isAddOrEdit == 'add'){
                addItemToCart();
            }else{
                updateCart();
            }
        }else{
            return false;
        }

//        if(product.upSellEnabled || product.crossSellEnabled){
//            var isProductDetailsPage = $("#isProductDetailsPage").val();
//            if(isMinAdOnSelected && isProductDetailsPage != 'true'){
//                loadUpSellCrossSellModal(upSellCrossSellUrl);
//            }
//        }
 //   })
}



function checkProductRecommendationOld(productId,businessId,isAddOrEdit) {

    isProductRecommended(productId).then(function(data){
        $('#overlay').hide();
        $("#productStr").val(data.productStr);
        var product = JSON.parse(data.productStr);
        var upSellCrossSellUrl = getUpSellCrossSellUrl(product.upSellEnabled,product.crossSellEnabled);
        var isMinAdOnSelected = checkIfMinAddOnIsSelected();

        if(isMinAdOnSelected){
            if(isAddOrEdit == 'add'){
                addItemToCart();
            }else{
                updateCart();
            }
        }else{
            return false;
        }

        if(product.upSellEnabled || product.crossSellEnabled){
            var isProductDetailsPage = $("#isProductDetailsPage").val();
            if(isMinAdOnSelected && isProductDetailsPage != 'true'){
                loadUpSellCrossSellModal(upSellCrossSellUrl);
            }
        }
    })
}

function getUpSellCrossSellUrl(upSellEnabled,crossSellEnabled){

    var isProductDetailsPage = $("#isProductDetailsPage").val();
    var variantId = isProductDetailsPage != 'true' ? getVariantId() : getVariantIdInDetailsPage();

    if (!variantId){
        variantId = isProductDetailsPage != 'true' ?  $("#baseVariant").val() : $("#baseVariantDet").val();
    }

    var upCrossSellUrl = crossSellEnabled ? "productsInAddToCartForCrossSell" : "productsInAddToCartForUpSell";

    return  "/webstore-v2/rest/business/" + businessId
                + "/"+ upCrossSellUrl +"/"+ variantId;

}

function getProducToLoadUpSellCrossSellModal(){

    var isProductDetailsPage = $("#isProductDetailsPage").val();
    var productStr = isProductDetailsPage != 'true' ? $("#productStr").val()
                        : localStorage.getItem("productUpSellCrossSell");

    var product = {};

    if(productStr && productStr != ''){
        product = JSON.parse(productStr);

        var product = {
            "productId" : product.productId,
            "upSellEnabled" : product.upSellEnabled,
            "crossSellEnabled" : product.crossSellEnabled
        };
    }

    return product;

}


function loadUpSellCrossSellModal(upSellCrossSellUrl) {

    var product = getProducToLoadUpSellCrossSellModal();

    if (Object.keys(product).length === 0) {
        return;
    }

    var productRequestString = JSON.stringify(product);

    if ($('#productModalContainer').hasClass('show')) {
        $('#productModalContainer').modal('hide');
    }

    var upsellSourceProduct = getProductSummary();

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
                    $("#upsellPurchase").val(JSON.stringify(upsellSourceProduct));
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

function skipRecommendation(productId,crossSellEnabled,businessId,isAddOrEdit) {
    var recommendedType = $("#recommendedType").val();

    var variantId = getVariantId();

    if (recommendedType=="UP_SELL" && crossSellEnabled) {
        var productUrl = "/webstore-v2/rest/business/" + businessId + "/productsInAddToCartForCrossSell/" + variantId;
        loadUpSellCrossSellModal(productUrl);
    } else {
         if ($('#upsellingCrossSellingModalContainer').hasClass('show')) {
            $('#upselling_crossSelling_loaded_view').hide();
            $('#upsellingCrossSellingModalContainer').modal("hide");
         }
        let isMinAdOnSelected = checkIfMinAddOnIsSelected();
        if(isMinAdOnSelected){
            if(isAddOrEdit == 'add'){
                addItemToCart();
            }else{
                updateCart();
            }
        }else{
            return false;
        }
    }
 }

function checkIfMinAddOnIsSelected() {
    $("#snackbar-addons").removeClass('show');
    var isSelected = true;
    var msg = '';
    for (var addonId in addOn) {
        var minSelectionsRequired = addOn[addonId]["minSelectionsRequired"];
        var addOnType = addOn[addonId]["type"];

        var selectedAddOnLength = getSelectedAddOn(addonId);
        if (selectedAddOnLength < minSelectionsRequired) {
            isSelected = false;
            msg = 'You must select at least ' + minSelectionsRequired + ' add ons from ' + addOnLabel[addonId] + ' to add the product to cart.';
            $("#min_require_addon_warning").text(msg);
            $("#snackbar-addons").addClass('show');
            return false;
        }

    }
    $('#min_require_addon_warning').text('');

    return true;

//    if(isAddOrEdit == 'add'){
//        addItemToCart();
//    }else{
//        updateCart();
//    }


}

function closeSnackBarAddOn(){
    $("#snackbar-addons").removeClass('show');
}

function setEditModalAddOnQuantity(addonId,subType,minSelectionsRequired) {
    var isAddOnExist = addonId in addOn ? true : false;
    var quantity = 0;
    var  addOnSubTypeId = subType["sku"];
    if (isAddOnExist) {
        var addOnObj = addOn[addonId];
        var addOnType = addOnObj["type"];
        var isAddOnTypeExist = addOnSubTypeId in addOnType ? true : false;
        if (isAddOnTypeExist) {
            quantity = addOnType[addOnSubTypeId]['qnt'];
            quantity = quantity + subType["selectedAddOnQuantity"];
            addOn[addonId]["type"][addOnSubTypeId]['qnt'] = quantity;
            addOn[addonId]["type"][subType["sku"]]['price'] = subType["price"]["amount"];
        } else {
            addOn[addonId]["type"][subType["sku"]] = {};
            addOn[addonId]["type"][addOnSubTypeId]['qnt'] = subType["selectedAddOnQuantity"];;
            addOn[addonId]["type"][subType["sku"]]['price'] = subType["price"]["amount"];
        }
    } else {
        addOn[addonId] = {};
        addOn[addonId]["type"] = {};
        addOn[addonId]["type"][subType["sku"]] = {};
        addOn[addonId]["type"][subType["sku"]]['qnt'] = subType["selectedAddOnQuantity"];
        addOn[addonId]["type"][subType["sku"]]['price'] = subType["price"]["amount"];
    }
    console.log(minSelectionsRequired);
    //showMinSelectionRequired(addonId, minSelectionsRequired);
    calculateTotal();
}


