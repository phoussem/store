(function (window, $) {
  'use strict';

  /* =======================
     ثوابت الحقول
  ======================= */
  const FIELDS = {
    phone: "extra_fields[custom_field_84jkabeLeFFtMAsO]",
    wilaya: "extra_fields[custom_field_3agUPExC44UfKM1w]",
    commune: "extra_fields[custom_field_kulVp2EJ92pCpjn3]",
    deliveryType: "extra_fields[custom_field_bpkPl7rvjZIKmEaY]",
    deliveryPrice: "extra_fields[custom_field_fxYCOTcrDrflGANv]"
  };

  /* =======================
     النصوص
  ======================= */
  const LABELS = {
    unit: "<h5>💰 سعر الوحدة:</h5>",
    products: "<h5>📦 سعر المنتجات:</h5>",
    delivery: "<h5>🚚 تكلفة التوصيل:</h5>",
    total: "<h5>🧾 إجمالي الطلب:</h5>",
    chooseWilaya: "<h6 style='color:#999'>اختر الولاية لحساب التوصيل</h6>"
  };

  /* =======================
     عناصر DOM
  ======================= */
  let $qty, $form, $productBox, $deliveryBox;
  let phoneInput, wilayaSelect, communeSelect, deliverySelect, deliveryPriceInput;

  /* =======================
     أدوات مساعدة
  ======================= */
  const qs = name => document.querySelector(`[name='${name}']`);

  function getBasePrice() {
    if (!$) return { price: 0, currency: "دج" };

    const $price = $(".price-section .currency-value .value");
    const $currency = $(".price-section .currency-value .currency");

    return {
      price: Number($price.text().replace(/[^\d]/g, '')) || 0,
      currency: $currency.text() || "دج"
    };
  }

  function getQuantity() {
    return Number($qty.val()) || 1;
  }

  /* =======================
     التحقق من الهاتف
  ======================= */
  function validatePhone() {
    const valid = /^(05|06|07)\d{8}$/.test(phoneInput.value);
    phoneInput.style.backgroundColor = valid ? "" : "#f8d7da";
    $(".single-submit", $form).prop("disabled", !valid);
  }

  /* =======================
     الولايات والبلديات
  ======================= */
  function fillWilayas() {
    wilayaSelect.innerHTML = "<option value=''>-- اختر الولاية --</option>";
    window.wilaya.forEach(w => {
      wilayaSelect.add(new Option(w, w));
    });
  }

  function fillCommunes() {
    const list = window.communesMapping[wilayaSelect.value] || [];
    communeSelect.innerHTML = "<option value=''>-- اختر البلدية --</option>";
    list.forEach(c => communeSelect.add(new Option(c, c)));
    communeSelect.disabled = !list.length;
  }

  /* =======================
     حساب الأسعار
  ======================= */
  function renderPrices() {
    if (!wilayaSelect.value) {
      $deliveryBox.html(LABELS.chooseWilaya);
      $productBox.html("");
      return;
    }

    const { price, currency } = getBasePrice();
    const qty = getQuantity();
    const productTotal = price * qty;

    const deliveryData = window.prices[wilayaSelect.value] || {};
    const deliveryType = deliverySelect?.value;
    const deliveryCost = Number(
      deliveryType === "stopdesk"
        ? deliveryData.stopdesk
        : deliveryData.default
    ) || 0;

    deliveryPriceInput.value = deliveryCost;

    $productBox.html(
      (qty > 1 ? LABELS.products : LABELS.unit) +
      `<h6>${productTotal} ${currency}</h6>`
    );

    $deliveryBox.html(
      LABELS.delivery + `<h6>${deliveryCost} دج</h6>` +
      LABELS.total + `<h6>${productTotal + deliveryCost} ${currency}</h6>`
    );
  }

  /* =======================
     إظهار / إخفاء الملخص
  ======================= */
  function toggleSummary() {
    const visible = $productBox.is(":visible");
    $productBox.toggle(!visible);
    $deliveryBox.toggle(!visible);
    $("#molakhas").text(visible ? "🛒 عرض ملخص الطلبية ⬇" : "🛒 إخفاء الملخص ⬆");
  }

  /* =======================
     التهيئة
  ======================= */
  function init() {
    $form = $("#express-checkout-form");
    if (!$form.length) return;

    phoneInput = qs(FIELDS.phone);
    wilayaSelect = qs(FIELDS.wilaya);
    communeSelect = qs(FIELDS.commune);
    deliverySelect = qs(FIELDS.deliveryType);
    deliveryPriceInput = qs(FIELDS.deliveryPrice);
    $qty = $(".single-quantity");

    $productBox = $("#productprice").length
      ? $("#productprice")
      : $("<div id='productprice'/>").appendTo($form);

    $deliveryBox = $("#tarifWilayaContainer").length
      ? $("#tarifWilayaContainer")
      : $("<div id='tarifWilayaContainer'/>").appendTo($form);

    phoneInput?.addEventListener("input", validatePhone);

    fillWilayas();
    wilayaSelect.addEventListener("change", () => {
      fillCommunes();
      renderPrices();
    });

    deliverySelect && deliverySelect.addEventListener("change", renderPrices);
    $qty.on("input change", renderPrices);

    $("#toggleSummaryBtn").on("click", toggleSummary);

    renderPrices();
    validatePhone();
  }

  /* =======================
     انتظار المتطلبات
  ======================= */
  const wait = setInterval(() => {
    if (window.wilaya && window.prices && window.communesMapping && $) {
      clearInterval(wait);
      document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", init)
        : init();
    }
  }, 100);

})(window, window.jQuery);
