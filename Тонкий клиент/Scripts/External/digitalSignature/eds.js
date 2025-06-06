EDS = (function () {
    var CERTIFICATES = [];
    var CADESCOM_CADES_BES = 1;
    var CAPICOM_CURRENT_USER_STORE = 2;
    var CAPICOM_MY_STORE = "My";
    var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
    var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
    var CADESCOM_BASE64_TO_BINARY = 1;
    var CADESCOM_CADES_X_LONG_TYPE_1 = 0x5d;
    var CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100;
    var CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 = 101;
    var CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512 = 102;
    var CADESCOM_HASH_ALGORITHM_SHA1 = 0;

    var isAttachEDS = $('[name="isAttachEDS"]').is(':checked');
    var cleandataUrl = $("[data-name='documentHashUrl']").val();
    var activitySignUrl = $("[data-name='activitySignature']").val();
    var documentHashUrl;
    var targetUrl;
    var isSignAllAttachment;
    var signatures = [];
    var hashAlg;
    var hashAlgorithm;

    //Сервисные функции
	
	function chunkSubstr(str, size){
		var numChunks = Math.ceil(str.length/size);
		var chunks = new Array(numChunks);
		
		for(var i = 0, o = 0; i < numChunks; ++i, o += size){
			chunks[i] = str.substr(o,size);
		}
		return chunks;
	}


    function isChromiumBased() {
        var retVal_chrome = navigator.userAgent.match(/chrome/i);
        //некоторых версиях IE8 с подключенным плагином chromeframe он определяется как
        //Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; chromeframe/29.0.1547.67;
        // и может попадать в ветку Chrome
        var retVal_chromeframe = navigator.userAgent.match(/chromeframe/i);
        isOpera = navigator.userAgent.match(/opr/i);
        isYaBrowser = navigator.userAgent.match(/YaBrowser/i);

        if (retVal_chrome == null) // В Firefox и IE работаем через NPAPI
            return false;
        else {
            // В Chrome и Opera работаем через асинхронную версию
            if (retVal_chrome.length > 0 || isOpera != null) {
                return true;
            }
        }
        return false;
    }

    if (isChromiumBased()) {
        var d = new Date();
        var ver = "?v=" + d.getDate() + "" +  d.getMonth() + "" + d.getFullYear();
        var scriptUrl = "<script language=\"javascript\" src=\"" + $("[name = 'digitalSignatureChromeUrl']").val() + ver + "\"></scr" + "ipt>";
        document.write(scriptUrl);
    }

    $(document).ready(function () {
        if (isChromiumBased()) {
            EDS = EDS_async;
        } 
    });

    var SignDocumentWithAtachments = function (callbackFn, messageFn, hideResultDialog, onFinish) {

        if (!onFinish) {
            onFinish = function () {
                if (callbackFn !== undefined) {
                    callbackFn();
                }
            };
        }


        activitySignUrl = $("[data-name='activitySignature']").val();

        var onMessage = function (message, isError) {
            if (messageFn !== undefined) {
                messageFn(message, isError);
            }
            else if (isError) {
                $('[name="signInfo"]').html("<FONT color='red'>" + message + "</FONT>");
            }
            else {
                $('[name="signInfo"]').html("<FONT color='green'>" + message + "</FONT>");
            }
        }

        //$('[name="edsProgressbar"]').removeAttr('hidden');

        cleandataUrl = $("[data-name='documentHashUrl']").val();

        InitCertHashAlgorithm();

        documentHashUrl = 'GetDocumentHashCode';
        var getSignTypeUrl = cleandataUrl.replace(documentHashUrl, 'GetSignType');

        var signType;
        //Получаем тип подписи
        $.ajax({
            url: getSignTypeUrl,
            type: "get",
            async: false,
            data: { edsSend: false },
            success: function (type) {
                signType = type;
            },
            error: function () {

            }
        });

        //Получаем Хэш документа и подписываем его
        $.ajax({
            url: cleandataUrl,
            type: "GET",
            cache: false,
            async: false,
            data: { edsSend: false },
            success: function (dataToSign) {
                Sign(dataToSign, signType, callbackFn, messageFn);
            },
            error: function () {

            }
        });

        documentHashUrl = 'GetAttachmentHashes';

        //n.volosatov: костыля, если есть activitySignUrl, ибо cleandataUrl перезаписывается в Sign методе
        if (activitySignUrl) {
            cleandataUrl = $("[data-name='documentHashUrl']").val();
            InitCertHashAlgorithm();
            activitySignUrl = undefined;
            $("[data-name='activitySignature']").remove();
        }

        cleandataUrl = cleandataUrl.replace('GetDocumentHashCode', documentHashUrl);

        isAttachEDS = true;
        isSignAllAttachment = true;
        //Получаем Хэши файлов и подписываем их
        $.ajax({
            url: cleandataUrl,
            type: "get",
            async: false,
            cache: false,
            data: { edsSend: false },
            success: function (dataToSign) {
                $.each(dataToSign, function (key, signsParam) {
                    var sign = {
                        Hash: signsParam.Hash,
                        AttachmentKey: signsParam.AttachmentKey
                    }
                    signatures.push(sign);
                    Sign(signsParam.Hash, signType, callbackFn, messageFn);
                });

                if (signatures.length > 0) {
                    var targetUrl = cleandataUrl.replace(documentHashUrl, "SignAllAttachmentHandler");
                    targetUrl = targetUrl.replace("ContextAction", "Attachment");

                    $.post(targetUrl, { sign: JSON.stringify(signatures) }, function (feedback) {
                        try {


                            feedback = JSON.parse(feedback);
                            if (feedback.status == "ERROR") {
                                onMessage(feedback.responseMessage, true);
                                return;
                            }

                            //$('[name="edsProgressbar"]').attr('hidden', 'true');

                            onFinish();

                            var isExport = $('[name="isEisExport"]').is(':checked');
                            if (isExport) {
                                return;
                            }

                            onMessage("Документ/файлы подписаны успешно", false);

                            isAttachEDS = false;
                            isSignAllAttachment = false;

                            var url = cleandataUrl.replace("GetAttachmentHashes", "DocumentAttachmentSignConfirmation");
                            url = url.replace("ContextAction", "Attachment");
                            url = url.split('?')[0];
                            url += "?documentId=" + feedback.documentId + '&type=2';

                            if (!hideResultDialog) {
                                ModalHelper({
                                    dialog: '#modalInfo',
                                    url: url,
                                    isTargetBlank: false,
                                    beforeSubmit: undefined,
                                    useDefaultSubmit: false
                                }).openWindow();
                            }
                        }
                        catch (ex) {
                            onMessage("Ошибка подписания", true);
                        }
                    });
                } else {

                    onFinish();

                    var isExport = $('[name="isEisExport"]').is(':checked');
                    if (isExport) {
                        return;
                    }

                    var url = cleandataUrl.replace("GetAttachmentHashes", "DocumentAttachmentSignConfirmation");
                    url = url.replace("ContextAction", "Attachment");
                    url += '&type=0';
                    if (!hideResultDialog) {
                        ModalHelper({
                            dialog: '#modalInfo',
                            url: url,
                            isTargetBlank: false,
                            beforeSubmit: undefined,
                            useDefaultSubmit: false
                        }).openWindow();
                    }
                }
            },
            error: function () {

            }
        });
    }

    var SignAttachments = function (callbackFn, messageFn, hideResultDialog, onFinish) {

        if (!onFinish) {
            var onFinish = function() {
                if (callbackFn !== undefined) {
                    callbackFn();
                }
            }
        }

        activitySignUrl = $("[data-name='activitySignature']").val();

        var onMessage = function (message, isError) {
            if (messageFn !== undefined) {
                messageFn(message, isError);
            }
            else if (isError) {
                $('[name="signInfo"]').html("<FONT color='red'>" + message + "</FONT>");
            }
            else {
                $('[name="signInfo"]').html("<FONT color='green'>" + message + "</FONT>");
            }
        }
         
        //$('[name="edsProgressbar"]').removeAttr('hidden');
        cleandataUrl = $("[data-name='documentHashUrl']").val();

        InitCertHashAlgorithm();

        documentHashUrl = 'GetAttachmentKeys';
        //n.volosatov: костыля, если есть activitySignUrl, ибо cleandataUrl перезаписывается в Sign методе
        if (activitySignUrl) {
            cleandataUrl = $("[data-name='documentHashUrl']").val();
            InitCertHashAlgorithm();
            activitySignUrl = undefined;
            $("[data-name='activitySignature']").remove();
        }



        cleandataUrl = cleandataUrl.replace('GetDocumentHashCode', documentHashUrl);
        isAttachEDS = $('[name="isAttachEDS"]').is(':checked');
        activitySignUrl = $("[data-name='activitySignature']").val();
        isSignAllAttachment = $('[data-name="isSignAllAttachment"]').val();

        targetUrl = cleandataUrl.replace(documentHashUrl, "SignDocument");
        isAttachEDS = $('[name="isAttachEDS"]').is(':checked');
        var getSignTypeUrl = cleandataUrl.replace(documentHashUrl, 'GetSignType');


        if (targetUrl.indexOf('&attachKey=') != -1) {
            isAttachEDS = true;
            isSignAllAttachment = true;
        }

        //$.get(getSignTypeUrl, { edsSend: false }, function (signType) {
        $.ajax({
            url: getSignTypeUrl,
            cache: false,
            data: { edsSend: false },
            success: function(signType) {
                //GetAttachmentKeys
                $.ajax({
                    url: cleandataUrl,
                    cache: false,
                    success: function(keysAttach) {
                        if (keysAttach.length == 0) {
                            onMessage("У подписываемого документа отсутствует документация.", true);
                            return;
                        }
                        cleandataUrl = cleandataUrl.replace(documentHashUrl, 'GetAttachmentHashCode');
                        $.each(keysAttach,
                            function(key, keyAttach) {
                                    try {
                                            $.ajax({
                                                url: cleandataUrl.replace('&attachKey=', '&attachKey=' + keyAttach),
                                                cache: false,
                                                async: false,
                                                error: function (error) {
                                                    onMessage("Ошибка подписания: " + error.statusText, true);
                                                    return;
                                                },
                                                success: function (dataToSign) {
                                                    console.info("Документ с ключом " + keyAttach + " объем:" + dataToSign.length);
                                            
                                                            var sign = {
                                                                AttachmentKey: keyAttach
                                                            }
                                                            signatures.push(sign);
                                                                Sign(dataToSign,
                                                                signType,
                                                                callbackFn,
                                                                messageFn,
                                                                null,
                                                                keyAttach);
                                                       
                                          
                                                }
                                            });
                                                                        
                                    } catch (e) {
                                        onMessage("Ошибка подписания"+ e.message, true);
                                        return;
                                    } 
                                });
                        if (signatures.length > 0 && keysAttach.length == signatures.length) {
                            var targetUrl = cleandataUrl.replace('GetAttachmentHashCode',
                                "SignAllAttachmentHandler");
                            targetUrl = targetUrl.replace("ContextAction", "Attachment");

                            $.post(targetUrl,
                                { sign: JSON.stringify(signatures) },
                                function (feedback) {
                                    try {
                                        //feedback = JSON.parse(feedback);
                                        //$('[name="edsProgressbar"]').attr('hidden', 'true');

                                        feedback = JSON.parse(feedback);
                                        if (feedback.status == "ERROR") {
                                            onMessage(feedback.responseMessage, true);
                                            return;
                                        }

                                        //$('[name="signInfo"]').html("<FONT color='green'>" + feedback.message + "</FONT>"); //.append(sSignedMessage);
                                        onMessage("Документ/файлы подписаны успешно", false);
                                        onFinish();
                                        //if (callbackFn !== undefined)
                                        //    callbackFn();
                                        isAttachEDS = false;
                                        isSignAllAttachment = false;
                                        var url = cleandataUrl.replace("GetAttachmentHashes",
                                            "DocumentAttachmentSignConfirmation");
                                        url = url.replace("ContextAction", "Attachment");

                                        url = url.split('?')[0];
                                        url += "?documentId=" + feedback.documentId + '&type=1';
                                        if (!hideResultDialog) {
                                            ModalHelper({
                                                dialog: '#modalInfo',
                                                url: url,
                                                isTargetBlank: false,
                                                beforeSubmit: undefined,
                                                useDefaultSubmit: false
                                            }).openWindow();
                                        }
                                    } catch (ex) {
                                        //$('[name="signInfo"]').html("<FONT color='red'>Ошибка подписания</FONT>"); 
                                        onMessage("Ошибка подписания", true);
                                    }
                                });
                        }
                    }
                });
            }
        });
    }

    function AddHashAlgorithmToUrl(url) {
        var hashAlgorithmParam = "&hashAlgorithm=";
        if (url && url.indexOf(hashAlgorithmParam) === -1) {
            url += hashAlgorithmParam + encodeURIComponent(hashAlgorithm);
        }
        return url;
    }

    var SignCreate = function (callbackFn, messageFn, hideResultDialog, container) {

        if (!container || !container.jquery)
            container = $(document);


        cleandataUrl = container.find("[data-name='documentHashUrl']").val();

        isAttachEDS = container.find('[name="isAttachEDS"]').is(':checked');
        activitySignUrl = container.find("[data-name='activitySignature']").val();
        if (isAttachEDS) {
            documentHashUrl = 'GetAttachmentHashCode';
            cleandataUrl = container.find("[data-name='documentAttachHashUrl']").val();
        } else {
            documentHashUrl = 'GetDocumentHashCode';
        }

        InitCertHashAlgorithm(container);

        isAttachEDS = container.find('[name="isAttachEDS"]').is(':checked');
        var getSignTypeUrl = cleandataUrl.replace(documentHashUrl, 'GetSignType');

        $.get(getSignTypeUrl, { edsSend: false }, function (signType) {
            $.ajax({
                url: cleandataUrl,
                cache: false,
                success: function (dataToSign) {
                    Sign(dataToSign,
                        signType,
                        function (data) {
                            callbackFn();

                            var isExport = container.find('[name="isEisExport"]').is(':checked');
                            if (isExport) {
                                return;
                            }


                            var isContext = container.find('[name="isContext"]').is(':checked');
                            if (isContext) {
                                return;
                            }

                            var url = cleandataUrl.replace("GetDocumentHashCode", "DocumentAttachmentSignConfirmation");
                            url = url.replace("ContextAction", "Attachment");
                            url += '&type=0';

                            if (!hideResultDialog) {

                                ModalHelper({
                                    dialog: '#modalInfo',
                                    url: url,
                                    isTargetBlank: false,
                                    beforeSubmit: undefined,
                                    useDefaultSubmit: false
                                }).openWindow();

                            }

                        },
                        messageFn, container);
                }
            });
        });
    }

    function InitCertHashAlgorithm(container) {

        if (!container || !container.jquery)
            container = $(document);

        var cerNum = container.find('[name="certificateList"]').find("input:checked").val();
        if (cerNum != undefined) {
            var cert = CERTIFICATES.Item(cerNum);
            //Сопоставление ProviderName/ProviderType -> хэш-алгоритм берем здесь https://www.cryptopro.ru/certsrv/certrqma.asp
            //Можно использовать ProviderType или ProviderName
            //var providerType = cert.PrivateKey.ProviderType;
            var providerName = cert.PrivateKey.ProviderName;

            switch (providerName) {
                case "Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider": //"75"
                    hashAlgorithm = "GOST3411";
                    hashAlg = CADESCOM_HASH_ALGORITHM_CP_GOST_3411;
                    break;
                case "Crypto-Pro GOST R 34.10-2012 Cryptographic Service Provider": //"80":
                    hashAlgorithm = "Gost3411_2012_256";
                    hashAlg = CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256;
                    break;
                case "Crypto-Pro GOST R 34.10-2012 Strong Cryptographic Service Provider": //"81":
                    hashAlgorithm = "Gost3411_2012_512";
                    hashAlg = CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512;
                    break;
                case "eToken Base Cryptographic Provider": //"81":
                    hashAlgorithm = "Base64";
                    break;
                case "Microsoft Enhanced Cryptographic Provider v1.0": //1
                case "Microsoft Base Smart Card Crypto Provider": //1
                case "Aktiv ruToken CSP v1.0":
                    hashAlgorithm = "CADESCOM_HASH_ALGORITHM_SHA_256"; //CADESCOM_HASH_ALGORITHM_SHA1
                    break;
                default:
                    //alert(err);
                    console.log("Крипто провайдер указанный в сертификате не поддерживается. " + providerName);
                    hashAlgorithm = "CADESCOM_HASH_ALGORITHM_SHA_256"; //CADESCOM_HASH_ALGORITHM_SHA1                    
                    //throw (err);
                    break;
            }

            cleandataUrl = AddHashAlgorithmToUrl(cleandataUrl);
        }
    }

    var SignAuthentication = function (callbackFn, messageFn) {

        dataToSign = $("#edsGuid").val();
        var tspServerUrl = $("#tspServerUrl").val();
        signType = { SignType: tspServerUrl ? 1 : 0, IsAuthentication: true, EdsAccessGroupTemplate: { TsaAddress: tspServerUrl } };

        Sign(dataToSign, signType, function () {
            callbackFn();
            $("#content-login-form").submit();
            waitingDialog.showWaiting();
        }, messageFn);
    }

    var SignForEis = function (callbackFn, messageFn) {
        var onFinish = function () {
            if (callbackFn !== undefined) {
                callbackFn();
            }
        }

        var onMessage = function (message, isError) {
            if (messageFn !== undefined) {
                messageFn(message, isError);
            }
            else if (isError) {
                $('[name="signInfo"]').html("<FONT color='red'>" + message + "</FONT>");
            }
            else {
                $('[name="signInfo"]').html("<FONT color='green'>" + message + "</FONT>");
            }
        }

        //$('[name="edsProgressbar"]').removeAttr('hidden');

        var cerNum = $('[name="certificateList"]').find("input:checked").val();
        if (cerNum != undefined) {
            var cert = CERTIFICATES.Item(cerNum);
            var providerName = cert.PrivateKey.ProviderName;
            switch (providerName) {
                case "Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider": //"75"  
                    //vipnet
                    //case "Infotecs Cryptographic Service Provider": //"2":
                    break;
                default:
                    var err = "Крипто провайдер указанный в сертификате не поддерживается. " + providerName;
                    alert(err);
                    throw (err);
            }

            try {
                var oSigner = cadesplugin.CreateObject("CAdESCOM.CPSigner");
                oSigner.Certificate = cert;

                var hashData = $("[name='signature-hash']").val();
                var oHashedData = InitializeHashedData(CADESCOM_HASH_ALGORITHM_CP_GOST_3411, hashData);
                var oSignedData = cadesplugin.CreateObject("CAdESCOM.CadesSignedData");
                oSigner.Options = 1;
                var message = oSignedData.SignHash(oHashedData, oSigner, CADESCOM_CADES_BES, true);
                $("[name='signature']").val(message);
                onFinish();
                return true;
            } catch (err) {
                //$('[name="edsProgressbar"]').attr('hidden', 'false');
                onMessage("Ошибка создания подписи. Ошибка: " + cadesplugin.getLastError(err), true);
                return false;
            }
        } else {
            onMessage("Выберите сертификат для создания подписи", true);
            return false;
        }
    }

    function InitializeHashedData(hashAlg, sHashValue) {

        // Создаем объект CAdESCOM.HashedData
        var oHashedData = cadesplugin.CreateObject("CAdESCOM.HashedData");

        // Инициализируем объект заранее вычисленным хэш-значением
        // Алгоритм хэширования нужно указать до того, как будет передано хэш-значение
        oHashedData.Algorithm = hashAlg;
        oHashedData.SetHashValue(sHashValue);

        return oHashedData;
    }
	
	 function Sign(dataToSign, signType, callbackFn, messageFn, container) {
		 Sign(dataToSign, signType, callbackFn, messageFn, container, null)
	 }
	 
    function Sign(dataToSign, signType, callbackFn, messageFn, container, key) {

        if (!container || !container.jquery)
            container = $("body");

        var onFinish = function () {
            if (callbackFn !== undefined) {
                callbackFn();
            }
        }

        var onMessage = function (message, isError) {
            if (messageFn !== undefined) {
                messageFn(message, isError);
            }
            else if (isError) {
                container.find('[name="signInfo"]').html("<FONT color='red'>" + message + "</FONT>");
            }
            else {
                container.find('[name="signInfo"]').html("<FONT color='green'>" + message + "</FONT>");
            }
        }
        try {
            var oSigner = cadesplugin.CreateObject("CAdESCOM.CPSigner");
            var cerNum = container.find('[name="certificateList"]').find("input:checked").val();
            if (cerNum != undefined) {
                var cert = CERTIFICATES.Item(cerNum);

                if (window.top.ExpectedEdsCert) {
                    //TODO: Сделать отдельный метод для получения сертификата в js. Вынести заполнение формы регистрации пользователя в callback.
                    var subject = cert.SubjectName;
                    var adjuster = new CertificateAdjuster();
                    var inn = adjuster.GetInn(subject);
                    var kpp = adjuster.GetKpp(subject);
                    var lastName = adjuster.GetLastName(subject);
                    var name = adjuster.GetName(subject);
                    var middleName = adjuster.GetMiddleName(subject);
                    var position = adjuster.GetPosition(subject);
                    var email = adjuster.GetEmail(subject);
                    var thumbprint = cert.Thumbprint;
                    var login = email ? email.split("@")[0] : "";

                    var organizations = register.organizations;
                    //TODO: Ждем от аналитиков правило, по которому мы получаем организацию
                    //var orgs = $.grep(organizations, function (e) { return e.Inn === inn && e.Kpp === kpp; });
                    var orgs = $.grep(organizations, function(e) { return e.Inn === inn; });
                    var orgInn = "";
                    var orgKpp = "";
                    var chief = "";
                    var orgVal = 0;
                    if (orgs.length === 1) {
                        var idx = organizations.indexOf(orgs[0]);
                        var orgItem = organizations[idx];
                        orgInn = orgItem.Inn;
                        orgKpp = orgItem.Kpp;
                        chief = orgItem.Chief;
                        orgVal = idx + 1;
                    }

                    container.find('#Organization option:eq(' + orgVal + ')').prop("selected", true);
                    container.find('#Organization').trigger("chosen:updated");
                    container.find('#Organization').trigger("change");
                    container.find("#Inn").val(orgInn);
                    container.find("#Kpp").val(orgKpp);
                    container.find("#Chief").val(chief);
                    container.find("#LastName").val(lastName);
                    container.find("#FirstName").val(name);
                    container.find("#MiddleName").val(middleName);
                    container.find("#Position").val(position);
                    container.find("#Email").val(email);
                    container.find("#EdsThumbprint").val(thumbprint);
                    container.find("#EdsThumbprintBlock").show();
                    container.find("#Login").val(login);

                    container.find('#actionDialog').modal('hide');
                    return false;
                }

                var isLong = signType.SignType;
                var tspService = "";
                var accessGroupTemplate = signType.EdsAccessGroupTemplate;

                if (accessGroupTemplate) {
                    tspService = accessGroupTemplate.TsaAddress;
                }
                oSigner.Certificate = cert;

                var oSignedData = cadesplugin.CreateObject("CAPICOM.SignedData");
                var oHashedData;

                if (hashAlg) {
                    oSignedData = cadesplugin.CreateObject("CAdESCOM.CadesSignedData");
                    oSigner.Options = 1;
                    oHashedData = InitializeHashedData(hashAlg, dataToSign);
                } else {
                    if (hashAlgorithm != "Base64") {
                        oSignedData.ContentEncoding = CADESCOM_BASE64_TO_BINARY;
                    }
                    // Создаем объект CAdESCOM.HashedData
                    var oHashedData = cadesplugin.CreateObject("CAdESCOM.HashedData");

                    // Алгоритм хэширования нужно указать до того, как будут переданы данные
                    oHashedData.Algorithm = CADESCOM_HASH_ALGORITHM_CP_GOST_3411;

                    // Указываем кодировку данных
                    // Кодировка должна быть указана до того, как будут переданы сами данные
                    oHashedData.DataEncoding = CADESCOM_BASE64_TO_BINARY;

                    // Предварительно закодированные в BASE64 бинарные данные
                    // В данном случае закодирован файл со строкой "Some Data."
                    // Передаем данные
                    //	if(dataToSign.length>1000000){

                    //	var coll = chunkSubstr(dataToSign, 1000000);
                    //	for (var iColl = 0; iColl < coll.length; iColl++) {
                    //			oHashedData.Hash(coll[iColl]);
                    //		}
                    //	
                    //}else{
                    oHashedData.Hash(dataToSign);
                    //}


                    var sHashValue = oHashedData.Value;
                    oSignedData.Content = sHashValue;
                }

                var sSignedMessage = "";
                var timeStamp = "";

                var detached = false;

                if (isLong == 1) {
                    oSigner.Options = 1;
                    oSigner.TSAAddress = tspService;

                    if (hashAlg) {
                        sSignedMessage =
                            oSignedData.SignHash(oHashedData, oSigner, CADESCOM_CADES_X_LONG_TYPE_1, detached);
                        timeStamp = GetTimeStamp(oHashedData, sSignedMessage);
                    } else {
                        sSignedMessage = oSignedData.SignCades(oSigner, CADESCOM_CADES_X_LONG_TYPE_1, detached, 0);
                    }

                } else {
                    //oSigner.Options = 1;

                    if (hashAlg) {
                        sSignedMessage = oSignedData.SignHash(oHashedData, oSigner, CADESCOM_CADES_BES, detached);
                    } else {
                        sSignedMessage = oSignedData.Sign(oSigner, true, 0);
                    }
                }

                if (signType.IsAuthentication === true) {
                    container.find("#edsValue").val(sSignedMessage);
                    onFinish();
                    return;
                }

                //Вынести в функции под созданию конкретныъх типов подписи
                var targetUrl = cleandataUrl.replace(documentHashUrl, "SignDocument");
                if (activitySignUrl != undefined) {
                    cleandataUrl = activitySignUrl;
                    var targetUrl = cleandataUrl.replace(documentHashUrl, "SignDocumentActivity");
                }

                if (isAttachEDS) {
                    if (isSignAllAttachment) { //isSignAllAttachment
                        signatures = signatures.map(function(signParam) {
                            if (signParam.AttachmentKey === key) {
                                signParam.Sign = sSignedMessage;
                                signParam.TimeStamp = timeStamp;
                            }
                            return signParam;
                        });
                    } else {
                        cleandataUrl = container.find("[data-name='documentActionUrl']").val();
                        cleandataUrl += container.find("[name='uniqueIds']").val();
                        cleandataUrl = AddHashAlgorithmToUrl(cleandataUrl);

                        container.find('[name="DigitalSignature"]').val(sSignedMessage);
                        $.post(cleandataUrl,
                            { DigitalSignature: sSignedMessage, TimeStamp: timeStamp },
                            function(feedback) {
                                //$('[name="edsProgressbar"]').attr('hidden', 'true');
                                try {

                                    feedback = JSON.parse(feedback);
                                    if (feedback.status == "ERROR") {
                                        onMessage(feedback.responseMessage, true);
                                        return;
                                    }

                                    onMessage("Документ/файлы подписаны успешно", false);
                                    onFinish();

                                    var isExport = container.find('[name="isEisExport"]').is(':checked');
                                    if (isExport) {
                                        return;
                                    }

                                    var isApprovePlugin = container.find("[name='hfApproveSettings']").length > 0 ||
                                        container.find("[name='hfCompleteActivityPlugin']").length > 0;
                                    if (isApprovePlugin)
                                        return;

                                    //$('[name="signInfo"]').html("<FONT color='green'>" + feedback.message + "</FONT>"); //.append(sSignedMessage);
                                    //if (callbackFn !== undefined) {
                                    //    callbackFn();
                                    //}

                                    var url = cleandataUrl.replace("SignAttachmentHandler",
                                        "AttachmentSignConfirmation");
                                    url = url.split('?')[0];
                                    url += "?documentId=" +
                                        feedback.documentId +
                                        "&attachmentKey=" +
                                        feedback.attachmentKey;
                                    //openActionUrlAsModal('#modalInfo', url, false, undefined, false);
                                    ModalHelper({
                                        dialog: '#modalInfo',
                                        url: url,
                                        isTargetBlank: false,
                                        beforeSubmit: undefined,
                                        useDefaultSubmit: false
                                    }).openWindow();
                                } catch (ex) {
                                    onMessage("Ошибка подписания", true);
                                    //$('[name="signInfo"]').html("<FONT color='red'>Ошибка подписания</FONT>");
                                }
                            });
                    }
                } else {
                    $.post(targetUrl,
                        { sign: sSignedMessage, TimeStamp: timeStamp },
                        function(feedback) {
                            //$('[name="edsProgressbar"]').attr('hidden', 'true');

                            var jsonExtract = JSON.parse(feedback);
                            if (jsonExtract.status == "ERROR") {
                                onMessage(jsonExtract.responseMessage, true);
                            }
                            if (jsonExtract.status == "OK") {
                                onFinish();
                            }
                        });
                }
            } else {
                //$('[name="signInfo"]').html("<FONT color='red'>Выберите сертификат для создания подписи!</FONT>");
                onMessage("Выберите сертификат для создания подписи", true);
                return false;
            }
        } catch (err) {
            //$('[name="edsProgressbar"]').attr('hidden', 'true');
            //$('[name="signInfo"]').html("<FONT color='red'>" + "Ошибка создания подписи. Ошибка: " + cadesplugin.getLastError(err) + "</FONT>");
            onMessage("Ошибка создания подписи. Ошибка: " + cadesplugin.getLastError(err), true);

            return false;
        }

    }

    var GetCertificates = function (container, certificatesListName) {

        if (!isChromiumBased()) {
            var infoBlock = $("#actionDialog").find(".modal-info-wrapper");
            infoBlock.text("При подписании документации в браузере Internet Explorer, максимальный размер файла не должен превышать 20 мб, при необходимости подписания файлов больших размеров, необходимо воспользоваться браузером Google Chrome")
            infoBlock.show();
        }

        var defer = jQuery.Deferred();

        var oStore = cadesplugin.CreateObject("CAPICOM.Store");
        oStore.Open();
        CERTIFICATES = oStore.Certificates;

        var certificateListWrapper = $('[name="certificateList"]');
        if (container && container.jquery)
            certificateListWrapper = container.find('[name="certificateList"]');

        certificateListWrapper.html("");
        var spinner = "<div class='modal-loading-wrapper' style='background-color:white'><div class='loading-image loading-image-shown'>&nbsp;</div></div>";
        certificateListWrapper.append(spinner);

        var promises = [];

        var l = CERTIFICATES.count;

        for (var i = 1; i < l + 1; i++) {
            var current = CERTIFICATES.Item(i);
            promises.push(tryAddCertificateToList(current, i, certificateListWrapper, certificatesListName));
        }

        $.when.apply($, promises).then(function () {
            oStore.Close();
            certificateListWrapper.find(".modal-loading-wrapper").remove();
            var elements = arguments;
            $.each(elements, function (i, element) {
                if (element != null) {
                    if ($(element).find("input").length > 0) {
                       certificateListWrapper.append($(element)); 
                    }
                }
            });
            //если сертификат один то выбераем его сразу
            var inputs = certificateListWrapper.find("input");
            if (inputs.length == 1) {
                inputs.first().attr("checked", "checked");
            }

            defer.resolve();
        }, function (error) {
            defer.reject(error);
        });
        return defer.promise();
    }

    function tryAddCertificateToList(cert, index, certificateListWrapper, certificatesListName) {
        var defer = jQuery.Deferred();

        verifySignature(cert).then(function (response) {
            var element = null;
            if (response.status === "ERROR") {
                element = createCertInfoElement(cert, index, certificateListWrapper, certificatesListName, false, function () {
                    var errors = response.responseMessage.split('\r\n');
                    errors.pop();
                    showCommonErrors(errors);
                });
            } else {
                var isValid = true;
                if (!disableCertificateValidation) {
                    try {
                        isValid = cert.IsValid().Result;
                    } catch (error) {
                        console.log(error);
                    }
                } else isValid = true;

                if (isValid) {
                    var hasPrivateKey = typeof cert.PrivateKey !== "unknown";
                    if(hasPrivateKey)
                        element = createCertInfoElement(cert, index, certificateListWrapper, certificatesListName, true, null);
                    else
                        element = createCertInfoElement(cert, index, certificateListWrapper, certificatesListName, false, function(){
                            showCommonErrors("Ошибка подписи. Не найден закрытый ключ.");
                        });
                }       
                else
                    element = createCertInfoElement(cert, index, certificateListWrapper, certificatesListName, false, function () {
                        cert.Display();
                    });

            }

            defer.resolve(element);

        }, function (error) {
            showCommonErrors(error);
            defer.resolve();
        });

        return defer.promise();
    }

    var createCertInfoElement = function (cert, count, certificateListWrapper, certificatesListName, isValid, clickHandler) {

        if (cert.SubjectName == "" || cert.SubjectName == null) {
            isValid = false;
        }

        var Adjust = new CertificateAdjuster();
        var CertificateOwner = "<span class=\"search-result-cell-value\"><b>" + "Владелец сертификата" + ": " + "</b>" + Adjust.GetCertName(cert.SubjectName) + "</span><br/>";
        var CertificateProducer = "<span class=\"search-result-cell-value\"><b>" + "Центр выдачи сертификата" + ": " + "</b>" + Adjust.GetCertName(cert.IssuerName) + "</span><br/>";
        var CertificateValidFrom = "<span class=\"search-result-cell-value\"><b>" + "Действителен с" + ": " + "</b>" + Adjust.GetCertDate(cert.ValidFromDate) + "</span><br/>";
        var CertificateValidTo = "<span class=\"search-result-cell-value\"><b>" + "Действителен по" + ": " + "</b>" + Adjust.GetCertDate(cert.ValidToDate) + "</span>";
        // var CertificateValidTodate = Date.parse(Adjust.GetCertDateUSLocale(cert.ValidToDate));//.replace(/\./g, "/")
        // var currentDate = new Date();

        var radioInputName = "certificatelist" + certificatesListName ? certificatesListName : "";
        var input = isValid ? "<input type='radio' name='" + radioInputName + "'  value='" + count + "' />" : "";
        var errorLable = isValid ? "" : "<span class='certificate-error-text'>Некорректный сертификат</span>";
        var certElement = $("<li class=\"certificate " + (isValid ? "" : "invalid") + "\">"
            + input
            + CertificateOwner
            + CertificateProducer
            + CertificateValidFrom
            + CertificateValidTo
            + errorLable
            + "</li>")
        //certificateListWrapper.append(certElement);

        if (!isValid && clickHandler) {
            certElement.click(clickHandler);
        }

        return certElement;

    }

    function verifySignature(cert) {

        var defer = jQuery.Deferred();

        var base = $("base").attr("href") === "/" ? "" : $("base").attr("href");
        var url = base + "/Eds/VerifySignature";

        var formData = new FormData();
        formData.append("publicCertificate", cert.Export());

        $.ajax({
            url: url,
            type: 'POST',
            mimeType: "multipart/form-data",
            cache: false,
            data: formData,
            contentType: false,
            cache: false,
            processData: false
        }).then(function (data) {
            var response = JSON.parse(data);
            defer.resolve(response);
        }, function (error) {
            console.error(error);
            defer.reject();
        });

        return defer.promise();
    }

    var TryToSelectDefaultCertificate = function (container) {
        var certificateListWrapper = $('[name="certificateList"]');
        if (container && container.jquery)
            certificateListWrapper = container.find('[name="certificateList"]');


        var inputs = certificateListWrapper.find("input");
        if (inputs.length > 0) {
            inputs.first().attr("checked", "checked");
        }

        return inputs.length > 0;
    }

    function CertificateAdjuster() {
    }

    CertificateAdjuster.prototype.extract = function (from, what) {
        var certName = "";

        var begin = from.indexOf(what);

        if (begin >= 0) {
            var end = from.indexOf(', ', begin);
            certName = (end < 0) ? from.substr(begin) : from.substr(begin, end - begin);
        }

        return certName;
    }

    CertificateAdjuster.prototype.Print2Digit = function (digit) {
        return (digit < 10) ? "0" + digit : digit;
    }

    CertificateAdjuster.prototype.GetCertDate = function (paramDate) {
        var certDate = new Date(paramDate);
        return this.Print2Digit(certDate.getUTCDate()) + "." + this.Print2Digit(certDate.getMonth() + 1) + "." + certDate.getFullYear() + " " +
            this.Print2Digit(certDate.getUTCHours()) + ":" + this.Print2Digit(certDate.getUTCMinutes()) + ":" + this.Print2Digit(certDate.getUTCSeconds());
    }

    CertificateAdjuster.prototype.GetCertDateUSLocale = function (paramDate) {
        var certDate = new Date(paramDate);
        return this.Print2Digit(certDate.getMonth() + 1) + "/" + this.Print2Digit(certDate.getUTCDate()) + "/" + certDate.getFullYear() + " " +
            this.Print2Digit(certDate.getUTCHours()) + ":" + this.Print2Digit(certDate.getUTCMinutes()) + ":" + this.Print2Digit(certDate.getUTCSeconds());
    }

    CertificateAdjuster.prototype.GetCertName = function (certSubjectName) {
        return this.extract(certSubjectName, 'CN=').replace("CN=", "");
    }

    CertificateAdjuster.prototype.GetPosition = function (certSubjectName) {
        return this.extract(certSubjectName, ' T=').replace(" T=", "");
    }

    CertificateAdjuster.prototype.GetOrganization = function (certSubjectName) {
        return this.extract(certSubjectName, 'O=').replace("O=", "");
    }

    CertificateAdjuster.prototype.GetInn = function (certSubjectName) {
        return this.extract(certSubjectName, 'ИНН=').replace("ИНН=", "");
    }

    CertificateAdjuster.prototype.GetKpp = function (certSubjectName) {
        var s = this.extract(certSubjectName, 'OID.1.2.840.113549.1.9.2=').replace("OID.1.2.840.113549.1.9.2=", "");
        var kppToken = "KPP=";
        s = s.substring(s.indexOf(kppToken) + kppToken.length);
        if (s.indexOf("/") !== -1) {
            s = s.split("/")[0];
        }
        return s;
    }

    CertificateAdjuster.prototype.GetEmail = function (certSubjectName) {
        return this.extract(certSubjectName, 'E=').replace("E=", "");
    }

    CertificateAdjuster.prototype.GetLastName = function (certSubjectName) {
        return this.extract(certSubjectName, 'SN=').replace("SN=", "");
    }

    CertificateAdjuster.prototype.GetName = function (certSubjectName) {
        return this.extract(certSubjectName, 'G=').replace("G=", "").split(" ")[0];
    }

    CertificateAdjuster.prototype.GetMiddleName = function (certSubjectName) {
        return this.extract(certSubjectName, 'G=').replace("G=", "").split(" ")[1];
    }

    CertificateAdjuster.prototype.GetIssuer = function (certIssuerName) {
        return this.extract(certIssuerName, 'CN=').replace("CN=", "");
    }

    CertificateAdjuster.prototype.GetCertInfoString = function (certSubjectName, certFromDate) {
        return this.extract(certSubjectName, 'CN=') + "; Выдан: " + this.GetCertDate(certFromDate);
    }

    function VerifyDocumentSign(messageFn) {
        var cleandataUrl = $("[data-name='documentHashUrl']").val();
        cleandataUrl = cleandataUrl.replace("GetDocumentHashCode", "GetDocumentSign");
        $.post(cleandataUrl, function (sign) {
            Verify(sign, messageFn);
        });
    }

    function VerifyAttachmentSign(docKey, attachKey, serialNumber) {
        var onMessage = function (message, isError) {
            alert(message);
            //messageFn(message, isError);
        }
        var cleandataUrl = $("[name='documentHashUrl']").val();
        var url = cleandataUrl + "?documentId=" + docKey + "&attachKey=" + attachKey + "&edsKey=" + serialNumber;
        var urlLog = cleandataUrl.replace("GetAttachmentHashCodeVerify", "LogVerifySign") + "?documentId=" + docKey + "&attachKey=" + attachKey + "&isValid=";
        $.get(url, function (dataToVerify) {
            if (dataToVerify.Sign == "empty") {
                //$('[name="signInfo"]').html("<FONT color='red'>Документ не имеет подписи.</FONT>");
                onMessage("Документ не имеет подписи.", true);

            } else {

                var oSignedData = cadesplugin.CreateObject("CAPICOM.SignedData");
                try {
                    // Значение свойства ContentEncoding должно быть задано
                    // до заполнения свойства Content
                    // Создаем объект CAdESCOM.HashedData
                    var oHashedData = cadesplugin.CreateObject("CAdESCOM.HashedData");

                    // Алгоритм хэширования нужно указать до того, как будут переданы данные
                    oHashedData.Algorithm = CADESCOM_HASH_ALGORITHM_CP_GOST_3411;

                    // Указываем кодировку данных
                    // Кодировка должна быть указана до того, как будут переданы сами данные
                    oHashedData.DataEncoding = CADESCOM_BASE64_TO_BINARY;

                    // Предварительно закодированные в BASE64 бинарные данные
                    // В данном случае закодирован файл со строкой "Some Data."
                    // Передаем данные
                    oHashedData.Hash(dataToVerify.Data);
                    var sHashValue = oHashedData.Value;

                    //oSignedData.ContentEncoding = CADESCOM_BASE64_TO_BINARY;
                    oSignedData.Content = sHashValue;
                    oSignedData.Verify(dataToVerify.Sign, true, 0);

                    var certOwner;
                    if (oSignedData.Signers != undefined) {
                        certOwner = oSignedData.Signers.Item(1).Certificate.SubjectName;
                    }
                    var message = "Документ имеет подпись, подпись успешно верифицирована.";
                    message += " " + "Документ подписал: " + Sign.Person;
                    if (certOwner != undefined) {
                        message += " " + "Владелец сертификата:" + certOwner;
                    }
                    onMessage(message, false);
                    urlLog = urlLog + "true";
                    $.get(urlLog, function (dataToVerify) { });

                } catch (err) {
                    onMessage("Ошибка проверки подписи." + err.message, true);
                    urlLog = urlLog + "false";
                    $.get(urlLog, function (dataToVerify) { });
                }
            }
        });
        

    }

    function GetTimeStamp(oHashedData, sSignedMessage) {
        try {
            var oSignedData = cadesplugin.CreateObject("CAdESCOM.CadesSignedData");
            oSignedData.VerifyHash(oHashedData, sSignedMessage, CADESCOM_CADES_X_LONG_TYPE_1);
            var signerItem = oSignedData.Signers.Item(1);
            var signingTime = signerItem.SigningTime;
            var signatureTimeStampTime = signerItem.SignatureTimeStampTime;
            var isoDate = new Date(signatureTimeStampTime).toISOString();

            return isoDate;
        }
        catch (err) {
            throw "Не удалось извлечь штамп времени из подписи. Ошибка: " + cadesplugin.getLastError(err);
        }
    }

    var Verify = function (Sign, messageFn) {

        var onMessage = function (message, isError) {
            if (messageFn !== undefined) {
                messageFn(message, isError);
            }
            else if (isError) {
                $('[name="signInfo"]').html("<FONT color='red'>" + message + "</FONT>");
            }
            else {
                $('[name="signInfo"]').html("<FONT color='green'>" + message + "</FONT>");
            }
        }

        var cleandataUrl = $("[data-name='documentHashUrl']").val();
        //cleandataUrl = AddHashAlgorithmToUrl(cleandataUrl);

        var getSignTypeUrl = cleandataUrl.replace('GetDocumentHashCode', 'GetSignType');
        $.get(getSignTypeUrl, function (signType) {
            $.get(cleandataUrl, function (dataToVerify) {
                sSignedMessage = Sign.Sign;
                if (sSignedMessage == "empty") {
                    //$('[name="signInfo"]').html("<FONT color='red'>Документ не имеет подписи.</FONT>");
                    onMessage("Документ не имеет подписи.", true);

                } else {

                    var oHashedData = cadesplugin.CreateObject("CAdESCOM.HashedData");
                    oHashedData.Algorithm = CADESCOM_HASH_ALGORITHM_CP_GOST_3411;
                    oHashedData.Hash(dataToVerify);
                    dataToVerify = oHashedData.Value;
                    var isLong = signType.SignType;

                    var oSignedData = cadesplugin.CreateObject("CAdESCOM.CadesSignedData");
                    try {
                        // Значение свойства ContentEncoding должно быть задано
                        // до заполнения свойства Content
                        oSignedData.ContentEncoding = CADESCOM_BASE64_TO_BINARY;
                        oSignedData.Content = dataToVerify;
                        if (isLong == 1) {
                            oSignedData.VerifyCades(sSignedMessage, CADESCOM_CADES_X_LONG_TYPE_1);
                        } else {
                            oSignedData.VerifyCades(sSignedMessage, CADESCOM_CADES_BES, true);
                        }
                        /*$("#signInfo").html("<FONT color='green'>" + feedback + "</FONT>");*/
                        var certOwner;
                        if (oSignedData.Signers != undefined) {
                            certOwner = oSignedData.Signers.Item(1).Certificate.SubjectName;
                        }

                        //$('[name="signInfo"]').html("<FONT color='green'>Документ имеет подпись, подпись успешно верифицирована. </FONT>");
                        //$('#getSignFilebutton').prop('disabled', false);//Скачать файл подписи 
                        //$('[name="signInfo"]').append("<FONT color='green'> Документ подписал:" + Sign.Person + "</FONT>");
                        //if (certOwner != undefined) {
                        //    $('[name="signInfo"]').append("<FONT color='green'>Владелец сертификата:" + certOwner + "</FONT>");
                        //}

                        var message = "Документ имеет подпись, подпись успешно верифицирована.";
                        message += " " + "Документ подписал: " + Sign.Person;
                        if (certOwner != undefined) {
                            message += " " + "Владелец сертификата:" + certOwner;
                        }
                        onMessage(message, false);

                    } catch (err) {
                        //errormes = "<FONT color='red'>Ошибка проверки подписи.</FONT>";// Ошибка: " + cadesplugin.getLastError(err) + "
                        //$('[name="signInfo"]').html(errormes);
                        onMessage("Ошибка проверки подписи.", true);
                    }
                }

            });
        });
    }

    return {
        SignCreate: SignCreate,
        SignForEis: SignForEis,
        SignAuthentication: SignAuthentication,
        SignAttachments: SignAttachments,
        SignDocumentWithAtachments: SignDocumentWithAtachments,

        GetCertificates: GetCertificates,
        VerifyDocumentSign: VerifyDocumentSign,
        VerifyAttachmentSign: VerifyAttachmentSign,
        ClearCache: function ClearCache() {
            signatures = [];
        },
        TryToSelectDefaultCertificate: TryToSelectDefaultCertificate
    }
})();