(function(window, $) {
  'use strict';

  const FIELD_NAME_NUMBER = "extra_fields[custom_field_84jkabeLeFFtMAsO]";
  const FIELD_NAME_WILAYA = "extra_fields[custom_field_3agUPExC44UfKM1w]";
  const FIELD_NAME_COMMUNE = "extra_fields[custom_field_kulVp2EJ92pCpjn3]";
  const FIELD_NAME_STOPPDESK = "extra_fields[custom_field_bpkPl7rvjZIKmEaY]";
  const FIELD_NAME_DELIVERY_PRICE = "extra_fields[custom_field_fxYCOTcrDrflGANv]";

  let phoneInput, wilayaSelect, communeSelect, deliveryOptionSelect,
      deliveryPriceInput, submitButtons, quantityInput,
      productPriceDisplayDiv, deliveryInfoDisplayDiv;

  const TEXT_PRODUCT_PRICE_LABEL = "<h5>💰 سعر الوحدة:</h5>";
  const TEXT_QUANTITY_PRICE_LABEL = "<h5>📦 سعر المنتجات:</h5>";
  const TEXT_DELIVERY_PRICE_LABEL = "<h5>🚚 تكلفة التوصيل:</h5>";
  const TEXT_TOTAL_PRICE_LABEL = "<h5>🧾 إجمالي الطلب:</h5>";

  function validatePhone() {
    if (!phoneInput || !submitButtons || submitButtons.length === 0) return;
    const value = phoneInput.value;
    const regex = /^(05|06|07)[0-9]{8}$/;
    const isValid = regex.test(value);

    phoneInput.style.backgroundColor = isValid ? "white" : "#f8d7da";
    phoneInput.style.color = "black";

    for (let i = 0; i < submitButtons.length; i++) {
      submitButtons[i].disabled = !isValid;
    }
  }

  function addWilayaOptions() {
    if (!wilayaSelect || typeof window.wilaya === 'undefined') return;
    wilayaSelect.innerHTML = '<option value="">-- اختر الولاية --</option>';
    window.wilaya.forEach(function (text) {
      const opt = document.createElement("option");
      opt.value = text;
      opt.innerHTML = text;
      wilayaSelect.appendChild(opt);
    });
  }

  function populateCommunes() {
    if (!communeSelect || !wilayaSelect || typeof window.communesMapping === 'undefined') return;
    const selectedWilaya = wilayaSelect.value;
    communeSelect.innerHTML = "<option value=''>-- اختر البلدية --</option>";
    const communes = window.communesMapping[selectedWilaya] || [];
    communes.forEach(function (commune) {
      const opt = document.createElement("option");
      opt.value = commune;
      opt.innerHTML = commune;
      communeSelect.appendChild(opt);
    });
    communeSelect.disabled = communes.length === 0;
    if (communes.length > 0) communeSelect.value = "";
  }

  function getCurrentBaseProductPrice() {
    if (!$) return { price: 0, currency: "دج" };
    const priceText = $("div.product-section.price-section h2 span.after.currency-value span.value").text().trim();
    const currency = $("div.product-section.price-section h2 span.after.currency-value span.currency").text().trim() || "دج";
    return {
      price: parseInt(priceText.replace(/\D/g, ''), 10) || 0,
      currency: currency
    };
  }

  function updateDisplayedProductPrice() {
    if (!productPriceDisplayDiv || !quantityInput || !$) return;
    const baseProductInfo = getCurrentBaseProductPrice();
    const currentQuantity = parseInt(quantityInput.val(), 10) || 1;

    let html;
    if (currentQuantity > 1) {
      const totalProductPrice = baseProductInfo.price * currentQuantity;
      html = `${TEXT_QUANTITY_PRICE_LABEL}<h6>${totalProductPrice} ${baseProductInfo.currency}</h6>`;
    } else {
      html = `${TEXT_PRODUCT_PRICE_LABEL}<h6>${baseProductInfo.price} ${baseProductInfo.currency}</h6>`;
    }
    productPriceDisplayDiv.html(html);
  }

  function updateDeliveryAndTotalDisplay() {
    if (!deliveryInfoDisplayDiv || !wilayaSelect || typeof window.prices === 'undefined' || !quantityInput || !$) return;

    const wilayaVal = wilayaSelect.value;
    const stopdeskVal = deliveryOptionSelect ? deliveryOptionSelect.value : null;
    const priceData = window.prices[wilayaVal] || { default: "0", stopdesk: "0" };
    let finalDeliveryPriceStr = priceData.default;

    if (deliveryOptionSelect && stopdeskVal === "التوصيل الى المكتب" && priceData.stopdesk) {
      finalDeliveryPriceStr = priceData.stopdesk;
    }
    const calculatedDeliveryPrice = parseInt(finalDeliveryPriceStr, 10) || 0;

    if (deliveryPriceInput) {
      deliveryPriceInput.value = calculatedDeliveryPrice;
    }

    const deliveryHtml = `${TEXT_DELIVERY_PRICE_LABEL}<h6>${calculatedDeliveryPrice} دج</h6>`;
    const baseProductInfo = getCurrentBaseProductPrice();
    const currentQuantity = parseInt(quantityInput.val(), 10) || 1;
    const totalProductPrice = baseProductInfo.price * currentQuantity;
    const totalPrice = totalProductPrice + calculatedDeliveryPrice;

    const totalHtml = `${deliveryHtml}${TEXT_TOTAL_PRICE_LABEL}<h6>${totalPrice} ${baseProductInfo.currency}</h6>`;
    deliveryInfoDisplayDiv.html(totalHtml);
  }

  function refreshAllPrices() {
    updateDisplayedProductPrice();
    updateDeliveryAndTotalDisplay();
  }

  function togglePriceSummary() {
    if (!productPriceDisplayDiv || !deliveryInfoDisplayDiv || !$) return;
    const summaryButtonTextDiv = document.getElementById('molakhas');
    const isHidden = productPriceDisplayDiv.is(':hidden');

    if (isHidden) {
      productPriceDisplayDiv.show();
      deliveryInfoDisplayDiv.show();
      if(summaryButtonTextDiv) summaryButtonTextDiv.innerHTML = "🛒️ ملخص الطلبية ⬇";
    } else {
      productPriceDisplayDiv.hide();
      deliveryInfoDisplayDiv.hide();
      if(summaryButtonTextDiv) summaryButtonTextDiv.innerHTML = "🛒️ إخفاء الملخص ⬆";
    }
  }

  function initialize() {
    phoneInput = document.querySelector(`input[name='${FIELD_NAME_NUMBER}']`);
    wilayaSelect = document.querySelector(`select[name='${FIELD_NAME_WILAYA}']`);
    communeSelect = document.querySelector(`select[name='${FIELD_NAME_COMMUNE}']`);
    deliveryOptionSelect = document.querySelector(`select[name='${FIELD_NAME_STOPPDESK}']`);
    deliveryPriceInput = document.querySelector(`input[name='${FIELD_NAME_DELIVERY_PRICE}']`);
    submitButtons = document.getElementsByClassName("single-submit");
    quantityInput = $(".single-quantity");

    const toggleBtn = document.getElementById('toggleSummaryBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', togglePriceSummary);
    }

    if (phoneInput) {
      phoneInput.setAttribute("pattern", "(05|06|07)[0-9]{8}");
      phoneInput.addEventListener('input', validatePhone);
      validatePhone();
    }

    if (wilayaSelect) {
      wilayaSelect.setAttribute("id", "countrySelect");
      addWilayaOptions();
      wilayaSelect.addEventListener("change", function () {
        if(communeSelect) populateCommunes();
        refreshAllPrices();
      });
    }

    if (communeSelect) {
      communeSelect.setAttribute("id", "citySelect");
      populateCommunes();
    }

    if ($ && $("#express-checkout-form").length) {
      productPriceDisplayDiv = $("#express-checkout-form").find("#productprice");
      if (!productPriceDisplayDiv.length) {
        $("#express-checkout-form").append("<div id='productprice'></div>");
        productPriceDisplayDiv = $("#productprice");
      }

      deliveryInfoDisplayDiv = $("#express-checkout-form").find("#tarifWilayaContainer");
      if (!deliveryInfoDisplayDiv.length) {
        $("#express-checkout-form").append("<div id='tarifWilayaContainer'></div>");
        deliveryInfoDisplayDiv = $("#tarifWilayaContainer");
      }

      refreshAllPrices();

      if (deliveryOptionSelect) {
        $(deliveryOptionSelect).on("change", refreshAllPrices);
      }

      if (quantityInput.length) {
        quantityInput.on("input change", function() {
          refreshAllPrices();
        });

        // ✅ دعم أزرار الزيادة والنقصان
        $(".quantity-handler-left, .quantity-handler-right").on("click", function () {
          setTimeout(refreshAllPrices, 50);
        });
      }

    } else {
      console.warn("jQuery or '#express-checkout-form' not found. Price display features will be limited.");
    }

    console.log("Checkout enhancements initialized.");
  }

  let dependencyCheckInterval = setInterval(function() {
    const dependenciesMet = typeof window.wilaya !== 'undefined' &&
                            typeof window.prices !== 'undefined' &&
                            typeof window.communesMapping !== 'undefined';
    const jQueryAvailable = typeof $ !== 'undefined';
    const jQueryRequired = document.querySelector(".single-quantity") || document.getElementById("express-checkout-form");

    if (dependenciesMet && (jQueryAvailable || !jQueryRequired)) {
      clearInterval(dependencyCheckInterval);
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
      } else {
        initialize();
      }
    }
  }, 100);

})(window, window.jQuery);
