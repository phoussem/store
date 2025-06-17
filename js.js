<!-- زر ملخص الطلبية -->
<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.querySelector(".checkout-form");
    if (checkoutForm) {
      const molakhasHTML = `
<span id="toggleSummaryBtn" style="display:inline-block; margin-bottom:10px;">
  <div id='molakhas'>
    🧾 عرض تفاصيل الطلب ⬇
  </div>
</span>`;

      checkoutForm.insertAdjacentHTML("afterbegin", molakhasHTML);
    } else {
      console.error("'.checkout-form' not found. Cannot add summary button.");
    }
  });
</script>

<!-- تحميل ملفات البيانات من CDN -->
<script src="https://cdn.jsdelivr.net/gh/phoussem/store@main/wilayasList.js"></script>
<script src="https://cdn.jsdelivr.net/gh/phoussem/store@main/deliveryPrices.js"></script>
<script src="https://cdn.jsdelivr.net/gh/phoussem/store@main/communesMapping.js"></script>
<script src="https://cdn.jsdelivr.net/gh/phoussem/store@refs/heads/main/scode.js"></script>
