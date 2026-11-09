function onlyDigits(text) {
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) < '0' || text.charAt(i) > '9') {
            return false;
        }
    }
    return true;
}

// دالة تتأكد أن الاسم أحرف عربية ومسافات فقط
function arabicOnly(text) {
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if (c !== ' ' && (c < '\u0621' || c > '\u064A')) {
            return false;
        }
    }
    return true;
}

$(document).ready(function () {

    // إظهار وإخفاء تفاصيل السيارة
    $('.details-btn').click(function () {
        var row = $(this).closest('tr').next();

        if (row.is(':visible')) {
            row.hide();
            $(this).text('إظهار').removeClass('open');
        } else {
            row.show();
            $(this).text('إخفاء').addClass('open');
        }
    });

    // زر المتابعة
    $('#nextBtn').click(function () {
        if ($('.carCheck:checked').length === 0) {
            alert("الرجاء اختيار سيارة واحدة على الأقل.");
            return;
        }

        $('#rentalForm').show();
        $('html, body').animate({ scrollTop: $('#rentalForm').offset().top - 20 }, 500);
    });

    // إرسال النموذج
    $('#rentalForm').submit(function (event) {
        event.preventDefault();

        var name = $('#fullName').val().trim();
        var nid = $('#nationalId').val().trim();
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        var email = $('#email').val().trim();
        var phone = $('#phone').val().trim();

        // 1) الرقم الوطني (11 رقم - أول رقمين من 01 إلى 14)
        if (nid === "") {
            alert("الرجاء إدخال الرقم الوطني.");
            $('#nationalId').focus();
            return;
        }

        if (nid.length !== 11 || !onlyDigits(nid)) {
            alert("الرقم الوطني يجب أن يتكون من 11 رقماً.");
            $('#nationalId').focus();
            return;
        }

        var province = parseInt(nid.substring(0, 2), 10);
        if (province < 1 || province > 14) {
            alert("أول رقمين من الرقم الوطني يجب أن يكونا بين 01 و 14.");
            $('#nationalId').focus();
            return;
        }

        // 2) الاسم (أحرف عربية فقط)
        if (name === "") {
            alert("الرجاء إدخال الاسم الكامل.");
            $('#fullName').focus();
            return;
        }

        if (!arabicOnly(name)) {
            alert("الاسم يجب أن يكون بالأحرف العربية فقط.");
            $('#fullName').focus();
            return;
        }

        // 3) التواريخ (النهاية بعد البداية)
        if (startDate === "") {
            alert("الرجاء إدخال تاريخ بداية التأجير.");
            $('#startDate').focus();
            return;
        }

        if (endDate === "") {
            alert("الرجاء إدخال تاريخ نهاية التأجير.");
            $('#endDate').focus();
            return;
        }

        if (startDate >= endDate) {
            alert("تاريخ النهاية يجب أن يكون بعد تاريخ البداية.");
            $('#endDate').focus();
            return;
        }

        // 4) رقم الموبايل (10 أرقام - يبدأ 093 أو 094)
        if (phone === "") {
            alert("الرجاء إدخال رقم الموبايل.");
            $('#phone').focus();
            return;
        }

        var prefix = phone.substring(0, 3);
        if (phone.length !== 10 || !onlyDigits(phone) || (prefix !== "093" && prefix !== "094")) {
            alert("رقم الموبايل يجب أن يتكون من 10 أرقام ويبدأ بـ 093 أو 094.");
            $('#phone').focus();
            return;
        }

        // 5) البريد الإلكتروني
        if (email === "") {
            alert("الرجاء إدخال البريد الإلكتروني.");
            $('#email').focus();
            return;
        }

        var at = email.indexOf("@");
        var dot = email.lastIndexOf(".");
        if (at < 1 || dot < at + 2 || dot === email.length - 1) {
            alert("صيغة البريد الإلكتروني غير صحيحة.");
            $('#email').focus();
            return;
        }

        // حساب عدد الأيام
        var d1 = new Date(startDate);
        var d2 = new Date(endDate);
        var days = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

        // حساب المبلغ
        var total = 0;
        var carsText = "";

        $('.carCheck:checked').each(function () {
            var row = $(this).closest('tr');
            var model = row.find('.model').text();
            var price = parseInt(row.find('.price').text());
            var carTotal = price * days;

            total = total + carTotal;
            carsText += "- " + model + " (" + days + " أيام) = " + carTotal + " ل.س\n";
        });

        // خصم 10% إذا أكثر من 7 أيام
        var discount = 0;
        if (days > 7) {
            discount = total * 0.1;
        }
        var finalTotal = total - discount;

        var msg = "تم الحجز بنجاح!\n\n";
        msg += "الاسم: " + name + "\n\n";
        msg += "السيارات المختارة:\n" + carsText + "\n";
        msg += "المجموع قبل الخصم: " + total + " ل.س\n";

        if (discount > 0) {
            msg += "الخصم (10%): " + discount + " ل.س\n";
        }

        msg += "-------------------------\n";
        msg += "المبلغ النهائي: " + finalTotal + " ل.س";

        alert(msg);
    });
 });


