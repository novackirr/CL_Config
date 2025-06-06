$(document).ready(function () {

    var signatureBlock = $("#signature-block");
    var credentialsBlock = $("#credentials-block");

    var useSignature = signatureBlock && signatureBlock.length !== 0;
    var useCredentials = credentialsBlock && credentialsBlock.length !== 0;
    
    var enableCredentials = function() {
        $("#credentials-block").show();
        
        $("#login").attr('required', 'true');
        $("#password").attr('required', 'true');

        $('[name="authType"]').val('credentials');
    }

    var disableCredentials = function() {
        $("#credentials-block").hide();

        $("#login").removeAttr('required');
        $("#password").removeAttr('required');
    }

    var enableSignature = function() {
        $("#signature-block").show();

        $("#signAttachments").prop('checked', true);
        $('[name="isSignEDS"]').prop('checked', true);
        $('[name="isEisExport"]').prop('checked', true);

        $('[name="authType"]').val('signature');
    }

    var disableSignature = function() {
        $("#signature-block").hide();
        $("#signAttachments").prop('checked', false);
        $('[name="isSignEDS"]').prop('checked', false);
        $('[name="isEisExport"]').prop('checked', false);
    }

    // если электронная подпись доступна
    if (useSignature) {

        // загружаем список сертификатов
        EDS.GetCertificates();

        // подписываемся на чекбокс с вкл/выкл подписи
        $("#use-signature").change(function () {
            if (this.checked) {
                disableCredentials();
                enableSignature();
            } else {
                enableCredentials();
                disableSignature();
            }
        });
    }

    // скрываем-показываем нужные блоки.
    // при прочих равных приоритет у авторизации по логину и паролю
    if (useCredentials) {
        $("#credentials-block").show();
        $("#signature-block").hide();
    }
    else if (useSignature) {
        $("#use-signature").prop('checked', true);
        $("#credentials-block").hide();
        $("#signature-block").show();
    }
});
