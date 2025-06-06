EDS_async = (function() {
    var Certificates = [];

    var isAttachEDS = $('[name="isAttachEDS"]').is(':checked');
    var cleanDocumentHashUrl = $("[data-name='documentHashUrl']").val();
    var base64Url = $("[data-name='documentBase64Url']").val();
    var isServerCalcHash = $('[name="isServerCalcHash"]').is(':checked');
    var activitySignUrl = $("[data-name='activitySignature']").val();
    var documentHashUrl;
    var targetUrl;
    var isSignAllAttachment;
    var signatures = [];
    var hashAlg;
    var hashAlgorithm;

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

    function NotImplementedException() {
        var errorMsg = "Для работы с сертификатами используйте браузер Internet Explorer. Работа в текущем браузере в данный момент не поддерживается.";
        alert(errorMsg);
        throw { name: "NotImplementedError", message: errorMsg };
    }

    var ProviderSupport = [
        { FriendlyName: "sha256RSA", Value: "1.2.840.113549.1.1.11", algorithm: cadesplugin.CADESCOM_HASH_ALGORITHM_SHA_256 },
        { FriendlyName: "RSA", Value: "1.2.840.113549.1.1.1", algorithm: cadesplugin.CADESCOM_HASH_ALGORITHM_SHA1 },
        { FriendlyName: "sha512RSA", Value: "1.2.840.113549.1.1.13", algorithm: cadesplugin.CADESCOM_HASH_ALGORITHM_SHA_512 },
        { FriendlyName: "ГОСТ Р 34.10-2012 256 бит", Value: "1.2.643.7.1.1.1.1", algorithm: cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 },
        { FriendlyName: "ГОСТ Р 34.10-2012 512 бит", Value: "1.2.643.7.1.1.1.2", algorithm: cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512 },
        { FriendlyName: "ГОСТ Р 34.10-2001", Value: "1.2.643.2.2.19", algorithm: cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411 }];

    function InitCertHashAlgorithm(container) {

        if (!container || !container.jquery)
            container = $(document);
      return  cadesplugin.async_spawn(function*(arg) {
            var cerNum = container.find('[name="certificateList"]').find("input:checked").val();
          if (cerNum != undefined) {
              cerNum = cerNum * 1;
              var cert = yield Certificates.Item(cerNum);
              var providerKey = yield cert.PrivateKey;
              var certPublicKey = yield cert.PublicKey();
              var providerName = yield providerKey.ProviderName;
              var certAlgorithm = yield certPublicKey.Algorithm;
              var algorithmValue = yield certAlgorithm.Value;

              console.log(providerName);
              console.log(algorithmValue);

              var alg = ProviderSupport.find((value) => { return value.Value === algorithmValue });
              if (alg == null || alg == undefined) {
                  console.log("Крипто провайдер указанный в сертификате не поддерживается. " + providerName);
                  hashAlgorithm = ProviderSupport[0].Value;
                  hashAlg = ProviderSupport[0].algorithm;
              } else {
                  hashAlgorithm = alg.Value;
                  hashAlg = alg.algorithm;
              }
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

    function GetTimeStamp_async(oHashedData, sSignedMessage) {
        try {
            cadesplugin.async_spawn(function*(arg) {
                var oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                yield oSignedData.VerifyHash(oHashedData, sSignedMessage, cadesplugin.CADESCOM_CADES_X_LONG_TYPE_1);
                var signerItem = yield oSignedData.Signers.Item(1);
                var signingTime = yield signerItem.SigningTime;
                var signatureTimeStampTime = yield signerItem.SignatureTimeStampTime;
                var isoDate = new Date(signatureTimeStampTime).toISOString();

                return isoDate;
            });
        }
        catch (err) {
            throw "Не удалось извлечь штамп времени из подписи. Ошибка: " + cadesplugin.getLastError(err);
        }
    }
    function Sign(dataToSign, signType, callbackFn, messageFn, container) {
        Sign(dataToSign, signType, callbackFn, messageFn, container, null)
    }
    function Sign(dataToSign, signType, callbackFn, messageFn, container, key) {

        if (!container || !container.jquery)
            container = $("body");

        var onFinish = function() {
            if (callbackFn !== undefined) {
                callbackFn();
            }
        }

        var onMessage = function(message, isError) {
            if (messageFn !== undefined) {
                messageFn(message, isError);
            } else if (isError) {
                container.find('[name="signInfo"]').html("<FONT color='red'>" + message + "</FONT>");
            } else {
                container.find('[name="signInfo"]').html("<FONT color='green'>" + message + "</FONT>");
            }
        }

            return  cadesplugin.async_spawn(function*(arg) {
                try {
                    var oSigner;
                    var errormes = "";
                    try {
                        oSigner = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
                    } catch (err) {
                        errormes = "Не удалось создать объект плагина Крипто Про CAdESCOM.CPSigner. \n" + err.message;
                        throw errormes;
                    }

                    var cerNum = container.find('[name="certificateList"]').find("input:checked").val();
                    if (cerNum != undefined) {
                        cerNum = cerNum * 1;
                        var cert = yield Certificates.Item(cerNum);

                        if (window.top.ExpectedEdsCert) {
                            //TODO: Сделать отдельный метод для получения сертификата в js. Вынести заполнение формы регистрации пользователя в callback.
                            var subject = yield cert.SubjectName;
                            var adjuster = new CertificateAdjuster();
                            var inn = adjuster.GetInn(subject);
                            var kpp = adjuster.GetKpp(subject);
                            var lastName = adjuster.GetLastName(subject);
                            var name = adjuster.GetName(subject);
                            var middleName = adjuster.GetMiddleName(subject);
                            var position = adjuster.GetPosition(subject);
                            var email = adjuster.GetEmail(subject);
                            var thumbprint = yield cert.Thumbprint;
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
                        if (oSigner) {
                            yield oSigner.propset_Certificate(cert);
                        } else {
                            errormes = "Не удалось создать объект плагина Крипто Про CAdESCOM.CPSigner";
                            throw errormes;
                        }

                        var oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                        var oHashedData;

                        //if (hashAlg && !disableCertificateValidation) {
                        //    yield oSigner.propset_Options(1)
                        //    oHashedData = yield InitializeHashedData_async(hashAlg, dataToSign);
                        //} else {

                        yield oSignedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY)

                            // Создаем объект CAdESCOM.HashedData
                            var oHashedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.HashedData");
                            // Алгоритм хэширования нужно указать до того, как будут переданы данные
                            yield oHashedData.propset_Algorithm(hashAlg);
                            yield oHashedData.propset_DataEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);
                            if (isServerCalcHash) {
                                yield oHashedData.SetHashValue(dataToSign);
                            } else {
                                // Указываем кодировку данных
                                // Кодировка должна быть указана до того, как будут переданы сами данные
                                var chunkSize = 3 * 1024 * 1024; // 3MB
                                if (dataToSign.length > (chunkSize * 5)) {
                                    var chunkColl = chunkString(dataToSign, chunkSize);
                                    dataToSign = null;
                                    for (var i = 0; i < chunkColl.length; i++) {
                                        oHashedData.Hash(chunkColl[i]);
                                        chunkColl[i] = null;
                                    }
                                } else {
                                    oHashedData.Hash(dataToSign);
                                }
                            }
                        //}

                        var sSignedMessage = "";
                        var timeStamp = "";

                        var detached = false;

                        if (isLong == 1) {
                            oSigner.Options = 1;
                            oSigner.TSAAddress = tspService;

                            if (hashAlg && !disableCertificateValidation) {
                                sSignedMessage =
                                    yield oSignedData.SignHash(oHashedData,
                                        oSigner,
                                        cadesplugin.CADESCOM_CADES_X_LONG_TYPE_1,
                                        detached);
                                timeStamp = yield GetTimeStamp_async(oHashedData, sSignedMessage);
                            } else {
                                sSignedMessage =
                                    yield oSignedData.SignCades(oSigner, cadesplugin.CADESCOM_CADES_X_LONG_TYPE_1, detached, 0);
                            }

                        } else {
                            sSignedMessage = yield oSignedData.SignHash(oHashedData, oSigner, 1);
                        }

                        if (signType.IsAuthentication === true) {
                            container.find("#edsValue").val(sSignedMessage);
                            onFinish();
                            return;
                        }

                        //Вынести в функции под созданию конкретныъх типов подписи
                        var targetUrl = cleanDocumentHashUrl.replace(documentHashUrl, "SignDocument");
                        if (activitySignUrl != undefined) {
                            cleanDocumentHashUrl = activitySignUrl;
                            var targetUrl = cleanDocumentHashUrl.replace(documentHashUrl, "SignDocumentActivity");
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
                                cleanDocumentHashUrl = container.find("[data-name='documentActionUrl']").val();
                                cleanDocumentHashUrl += container.find("[name='uniqueIds']").val();
                                cleanDocumentHashUrl = AddHashAlgorithmToUrl(cleanDocumentHashUrl);

                                container.find('[name="DigitalSignature"]').val(sSignedMessage);
                                $.post(cleanDocumentHashUrl,
                                    { DigitalSignature: sSignedMessage, TimeStamp: timeStamp },
                                    function(feedback) {
                                        //$('[name="edsProgressbar"]').attr('hidden', 'true');
                                        try {

                                            feedback = JSON.parse(feedback);
                                            if (feedback.status == "ERROR") {
                                                onMessage(feedback.responseMessage, true);
                                                resolve(""); 
                                            }

                                            onMessage("Документ/файлы подписаны успешно", false);
                                            onFinish();

                                            var isExport = container.find('[name="isEisExport"]').is(':checked');
                                            if (isExport) {
                                                return;
                                            }

                                            var isApprovePlugin =
                                                container.find("[name='hfApproveSettings']").length > 0 ||
                                                    container.find("[name='hfCompleteActivityPlugin']").length > 0;
                                            if (isApprovePlugin)
                                                return;

                                            var url = cleanDocumentHashUrl.replace("SignAttachmentHandler",
                                                "AttachmentSignConfirmation");
                                            url = url.split('?')[0];
                                            url += "?documentId=" +
                                                feedback.documentId +
                                                "&attachmentKey=" +
                                                feedback.attachmentKey;

                                            ModalHelper({
                                                dialog: '#modalInfo',
                                                url: url,
                                                isTargetBlank: false,
                                                beforeSubmit: undefined,
                                                useDefaultSubmit: false
                                            }).openWindow();
                                        } catch (ex) {
                                            onMessage("Ошибка подписания", true);
                                        }
                                    });
                            }
                        } else {
                            $.post(targetUrl,
                                { sign: sSignedMessage, TimeStamp: timeStamp },
                                function(feedback) {
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
                        onMessage("Выберите сертификат для создания подписи", true);
                        return;
                    }
                } catch (err) {
                    onMessage("Ошибка создания подписи. Ошибка: " + cadesplugin.getLastError(err), true);
                    return;
                }
            });
       // });
    }

    function chunkString(str, len) {
        const size = Math.ceil(str.length / len)
        const r = Array(size)
        let offset = 0

        for (let i = 0; i < size; i++) {
            r[i] = str.substr(offset, len)
            offset += len
        }

        return r
    }

    function Verify(Sign, messageFn) {
  

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

            var cleanDocumentHashUrl = $("[data-name='documentHashUrl']").val();
            //cleanDocumentHashUrl = AddHashAlgorithmToUrl(cleanDocumentHashUrl);

            var getSignTypeUrl = cleanDocumentHashUrl.replace('GetDocumentHashCode', 'GetSignType');
            $.get(getSignTypeUrl, function (signType) {
                $.get(cleanDocumentHashUrl, function (dataToVerify) {
                    cadesplugin.async_spawn(function*(args) {
                        sSignedMessage = Sign.Sign;
                        if (sSignedMessage == "empty") {
                            //$('[name="signInfo"]').html("<FONT color='red'>Документ не имеет подписи.</FONT>");
                            onMessage("Документ не имеет подписи.", true);

                        } else {
                            //build
                            var oHashedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.HashedData");
                            yield oHashedData.propset_Algorithm(cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411);
                            yield oHashedData.Hash(dataToVerify);
                            dataToVerify = yield oHashedData.Value;
                            var isLong = signType.SignType;

                            var oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                            try {
                                // Значение свойства ContentEncoding должно быть задано
                                // до заполнения свойства Content
                                yield oSignedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);
                                yield oSignedData.propset_Content(dataToVerify);
                                if (isLong == 1) {
                                    yield oSignedData.VerifyCades(sSignedMessage, cadesplugin.CADESCOM_CADES_X_LONG_TYPE_1);
                                } else {
                                    yield oSignedData.VerifyCades(sSignedMessage, cadesplugin.CADESCOM_CADES_BES, true);
                                }
                                /*$("#signInfo").html("<FONT color='green'>" + feedback + "</FONT>");*/
                                var certOwner;
                                var signers = yield oSignedData.Signers;
                                if (signers != undefined) {
                                    var firstSigner = yield signers.Item(1);
                                    var certif = yield firstSigner.Certificate;
                                    certOwner = yield certif.SubjectName;
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
            });
      
    }
    function tryAddCertificateToList(cert, index, certificateListWrapper, certificatesListName) {
        var element = null;
            cadesplugin.async_spawn(function*(args) {
                try {
                    var isValid = false;
                    if (!disableCertificateValidation && !$('[name="onlyGOST"]').is(':checked')) {
                            try {
                                var isValidF = yield cert.IsValid();
                                isValid = yield isValidF.Result;
                            } catch (error) {
                                console.log(error);
                            }
                        } else isValid = true;

                    if (isValid) {
                        var hasPrivateKey = typeof (yield cert.PrivateKey) !== "unknown";
                        if (hasPrivateKey)
                            element = yield createCertInfoElement(cert,
                                index,
                                certificateListWrapper,
                                certificatesListName,
                                true,
                                null);
                        else
                            element = yield createCertInfoElement(cert,
                                index,
                                certificateListWrapper,
                                certificatesListName,
                                false,
                                function () {
                                    showCommonErrors("Ошибка подписи. Не найден закрытый ключ.");
                                });
                    } else {
                        element = yield createCertInfoElement(cert,
                            index,
                            certificateListWrapper,
                            certificatesListName,
                            false,
                            function () {
                                cert.Display();
                            });

                    }
                } catch (e) {

                }
                

                //return element;
            });

    }
    function createCertInfoElement(cert, count, certificateListWrapper, certificatesListName, isValid, clickHandler) {
        cadesplugin.async_spawn(function* (args) {
            try {
                var certPublicKey = yield cert.PublicKey();
                var certAlgorithm = yield certPublicKey.Algorithm;
                var algorithmValue = yield certAlgorithm.Value;
                var providerKey = yield cert.PrivateKey;
                var providerName = yield providerKey.ProviderName;

                console.log(algorithmValue);
                console.log(providerName);

                var alg = ProviderSupport.find((value) => { return value.Value === algorithmValue });
                if (alg == null || alg == undefined) {
                    isValid = false;
                    console.log("isnotValid");
                    return;
                }
                hashAlgorithm = alg.Value;
                hashAlg = alg.algorithm;
                hashAlgName = alg.FriendlyName;

                if ($('[name="onlyGOST"]').is(':checked')) {
                    if (hashAlgName.indexOf("ГОСТ") == -1) {
                        isValid = false;
                        return;
                    }
                } else {
                    if (hashAlgName.indexOf("ГОСТ") > -1) {
                        isValid = false;
                        return;
                    }
                }

                if ((yield cert.SubjectName) == "" || (yield cert.SubjectName) == null) {
                    isValid = false;
                }

            } catch (e) {
                isValid = false;
                return;
            }

            var Adjust = new CertificateAdjuster();
            var CertificateOwner = "<span class=\"search-result-cell-value\"><b>" +
                "Владелец сертификата" +
                ": " +
                "</b>" +
                Adjust.GetCertName(yield cert.SubjectName) +
                "</span><br/>";
            var CertificateProducer = "<span class=\"search-result-cell-value\"><b>" +
                "Центр выдачи сертификата" +
                ": " +
                "</b>" +
                Adjust.GetCertName(yield cert.IssuerName) +
                "</span><br/>";
            var CertificateValidFrom = "<span class=\"search-result-cell-value\"><b>" +
                "Действителен с" +
                ": " +
                "</b>" +
                Adjust.GetCertDate(yield cert.ValidFromDate) +
                "</span><br/>";
            var CertificateValidTo = "<span class=\"search-result-cell-value\"><b>" +
                "Действителен по" +
                ": " +
                "</b>" +
                Adjust.GetCertDate(yield cert.ValidToDate) +
                "</span>";
            // var CertificateValidTodate = Date.parse(Adjust.GetCertDateUSLocale(cert.ValidToDate));//.replace(/\./g, "/")
            // var currentDate = new Date();

            var radioInputName = "certificatelist" + (yield certificatesListName) ? (yield  certificatesListName) : "";
            var input = isValid ? "<input type='radio' name='" + radioInputName + "'  value='" + count + "' />" : "";
            var errorLable = isValid ? "" : "<span class='certificate-error-text'>Некорректный сертификат</span>";
            var certElement = $("<li class=\"certificate " +
                (isValid ? "" : "invalid") +
                "\">" +
                input +
                CertificateOwner +
                (yield  CertificateProducer) +
                (yield  CertificateValidFrom) +
                (yield  CertificateValidTo) +
                errorLable +
                "</li>")
            //certificateListWrapper.append(certElement);

            if (!isValid && clickHandler) {
                certElement.click(clickHandler);
            }

            
            if (certElement != undefined && $(certElement).find("input").length > 0) {
                certificateListWrapper.append($(certElement));
            }
        });
    }
    function verifySignature(certExportData) {
        cadesplugin.async_spawn(function*(args) {
            var defer = jQuery.Deferred();

            var base = $("base").attr("href") === "/" ? "" : $("base").attr("href");
            var url = base + "/Eds/VerifySignature";

            var formData = new FormData();
            formData.append("publicCertificate", certExportData);

            $.ajax({
                url: url,
                type: 'POST',
                mimeType: "multipart/form-data",
                cache: false,
                data: formData,
                contentType: false,
                cache: false,
                processData: false
            }).then(function(data) {
                    var response = JSON.parse(data);
                    defer.resolve(response);
                },
                function(error) {
                    console.error(error);
                    defer.reject();
                });

            return defer.promise();
        });
    }
    function VerifyAttachmentSign(docKey, attachKey, serialNumber) {
        var onMessage = function (message, isError) {
            alert(message);
            //messageFn(message, isError);
        }
        var cleanDocumentHashUrl = $("[name='documentHashUrl']").val();
        var urlLog = cleanDocumentHashUrl.replace("GetAttachmentHashCodeVerify", "LogVerifySign") + "?documentId=" + docKey + "&attachKey=" + attachKey + "&isValid=";

        if ($('[name="isServerCalcHash"]').is(':checked')) {
            cleanDocumentHashUrl = $("[name='documentBase64Url']").val();
            urlLog = cleanDocumentHashUrl.replace("GetAttachmentBase64Verify", "LogVerifySign") + "?documentId=" + docKey + "&attachKey=" + attachKey + "&isValid=";
        }
        var url = cleanDocumentHashUrl + "?documentId=" + docKey + "&attachKey=" + attachKey + "&edsKey=" + serialNumber;
      //  var urlLog = cleanDocumentHashUrl.replace("GetAttachmentHashCodeVerify", "LogVerifySign") + "?documentId=" + docKey + "&attachKey=" + attachKey + "&isValid=";

            $.get(url,
                function(dataToVerify) {
                    if (dataToVerify.Sign == "empty") {
                        //$('[name="signInfo"]').html("<FONT color='red'>Документ не имеет подписи.</FONT>");
                        onMessage("Документ не имеет подписи.", true);

                    } else {
                        cadesplugin.async_spawn(function* (args) {
                            try
                            {
                            var algorithmValue = dataToVerify.Comment;
                            var alg = ProviderSupport.find((value) => { return value.Value === algorithmValue });
                            if (alg == null || alg == undefined) {
                                isValid = false;
                                console.log("isnotValid");
                                return;
                            }
                            var  hashAlgorithm = alg.Value;
                            var  hashAlg = alg.algorithm;
                            var hashAlgName = alg.FriendlyName;


                            var oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                            // Значение свойства ContentEncoding должно быть задано
                            // до заполнения свойства Content
                            // Создаем объект CAdESCOM.HashedData
                            var oHashedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.HashedData");

                            // Алгоритм хэширования нужно указать до того, как будут переданы данные
                            yield oHashedData.propset_Algorithm(hashAlg);

                            // Указываем кодировку данных
                            // Кодировка должна быть указана до того, как будут переданы сами данные
                            yield oHashedData.propset_DataEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);

                            // Предварительно закодированные в BASE64 бинарные данные
                            // В данном случае закодирован файл со строкой "Some Data."
                            // Передаем данные
                            if (isServerCalcHash) {
                                yield oHashedData.SetHashValue(dataToVerify.Data);
                            } else {
                                // Указываем кодировку данных
                                // Кодировка должна быть указана до того, как будут переданы сами данные
                                var chunkSize = 3 * 1024 * 1024; // 3MB
                                if (dataToVerify.Data.length > (chunkSize * 5)) {
                                    var chunkColl = chunkString(dataToVerify.Data, chunkSize);
                                    dataToVerify.Data = null;
                                    for (var i = 0; i < chunkColl.length; i++) {
                                        oHashedData.Hash(chunkColl[i]);
                                        chunkColl[i] = null;
                                    }
                                } else {
                                    oHashedData.Hash(dataToVerify.Data);
                                }
                            }

                            yield    oSignedData.VerifyHash(oHashedData, dataToVerify.Sign, cadesplugin.CADESCOM_CADES_BES);

                                var certOwner;
                                var serialNumber;
                                var validFromDate;
                                var validToDate;
                                var signers = yield oSignedData.Signers;
                                if (signers != undefined) {
                                    var firstSigner = yield signers.Item(1);
                                    var certif = yield firstSigner.Certificate;
                                    certOwner = yield certif.SubjectName;
                                    serialNumber = yield certif.SerialNumber;
                                    validFromDate = yield certif.ValidFromDate;
                                    validToDate = yield certif.ValidToDate;
                                }

                                var messages = [];

                                if (certOwner != undefined) {
                                    messages.push("Владелец сертификата:" + certOwner);
                                    messages.push("Серийный номер: " + serialNumber);
                                    messages.push("Период действия: " + validFromDate.replace("T", " ").replace(".000Z", " ") + " - " + validToDate.replace("T", " ").replace(".000Z", " "));
                                    messages.push("Документ имеет подпись, подпись успешно верифицирована.");
                                    messages.push("Документ подписал: " + dataToVerify.Person);
                                    showNotification("Проверка подписи", messages);
                                }
                                urlLog = urlLog + "true";
                                $.get(urlLog, function(dataToVerify) {});

                            } catch (err) {
                                showNotification("Ошибка проверки подписи","Ошибка проверки подписи." + err.message);
                                urlLog = urlLog + "false";
                                $.get(urlLog, function(dataToVerify) {});
                            }
                        });
                    }
                });
      

    }   

    var SignCreate = function (callbackFn, messageFn, hideResultDialog, container) {
            if (!container || !container.jquery)
                container = $(document);


            cleanDocumentHashUrl = container.find("[data-name='documentHashUrl']").val();

            isAttachEDS = container.find('[name="isAttachEDS"]').is(':checked');
            activitySignUrl = container.find("[data-name='activitySignature']").val();
            if (isAttachEDS) {
                documentHashUrl = 'GetAttachmentHashCode';
                cleanDocumentHashUrl = container.find("[data-name='documentAttachHashUrl']").val();
            } else {
                documentHashUrl = 'GetDocumentHashCode';
            }

            InitCertHashAlgorithm(container).then(function() {

                cleanDocumentHashUrl = AddHashAlgorithmToUrl(cleanDocumentHashUrl);
                isAttachEDS = container.find('[name="isAttachEDS"]').is(':checked');
                var getSignTypeUrl = cleanDocumentHashUrl.replace(documentHashUrl, 'GetSignType');

                $.get(getSignTypeUrl,
                    { edsSend: false },
                    function(signType) {
                        $.ajax({
                            url: cleanDocumentHashUrl,
                            cache: false,
                            success: function(dataToSign) {

                                var clbkf = function(data) {
                                    callbackFn();

                                    var isExport = container.find('[name="isEisExport"]').is(':checked');
                                    if (isExport) {
                                        return;
                                    }


                                    var isContext = container.find('[name="isContext"]').is(':checked');
                                    if (isContext) {
                                        return;
                                    }

                                    var url = cleanDocumentHashUrl.replace("GetDocumentHashCode",
                                        "DocumentAttachmentSignConfirmation");
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

                                };


                                Sign(dataToSign, signType, clbkf, messageFn, container);
                            }
                        });
                    });
            });
    }
    var SignAuthentication = function(callbackFn, messageFn) {
        dataToSign = $("#edsGuid").val();
        var tspServerUrl = $("#tspServerUrl").val();
        signType = {
            SignType: tspServerUrl ? 1 : 0,
            IsAuthentication: true,
            EdsAccessGroupTemplate: { TsaAddress: tspServerUrl }
        };
        Sign(dataToSign,
            signType,
            function() {
                callbackFn();
                $("#content-login-form").submit();
                waitingDialog.showWaiting();
            },
            messageFn);

    }
    var VerifyDocumentSign = function(messageFn)  {

        var cleanDocumentHashUrl = $("[data-name='documentHashUrl']").val();
        cleanDocumentHashUrl = cleanDocumentHashUrl.replace("GetDocumentHashCode", "GetDocumentSign");
        $.post(cleanDocumentHashUrl,
                function(sign) {
                    Verify(sign, messageFn);
                });
    }
    var GetCertificates = function(container, certificatesListName) {
        cadesplugin.async_spawn(function*(arg) {

            var defer = jQuery.Deferred();

            try {
                var oStore = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
                yield oStore.Open();
            } catch (err) {
                alert('Не удалось создать объект плагина Крипто Про CAdESCOM.Store. \n' + err.message);
                return;
            }
            Certificates = yield oStore.Certificates;

            var certificateListWrapper = $('[name="certificateList"]');
            if (container && container.jquery)
                certificateListWrapper = container.find('[name="certificateList"]');

            certificateListWrapper.html("");
            var spinner =
                "<div class='modal-loading-wrapper' style='background-color:white'><div class='loading-image loading-image-shown'>&nbsp;</div></div>";
            certificateListWrapper.append(spinner);

            var promises = [];

            var l = yield Certificates.Count;

            for (var i = 1; i < l + 1; i++) {

                var current = yield Certificates.Item(i);
                //var certExportData = yield current.Export();
                var elemCert = yield tryAddCertificateToList(current, i, certificateListWrapper, certificatesListName);
                //if (elemCert != undefined) {
                //    promises.push(elemCert);
                //}
                
            }
            yield oStore.Close();
            // yield oStore.Close();
            certificateListWrapper.find(".modal-loading-wrapper").remove();
                //var elements = promises;
                //    $.each(elements,
                //        function(i, element) {
                //            if (element != null) {
                //                if ($(element).find("input").length > 0) {
                //                    certificateListWrapper.append($(element));
                //                }
                //            }
                //        });
                    //если сертификат один то выбераем его сразу
                    var inputs = certificateListWrapper.find("input");
                    if (inputs.length == 1) {
                        inputs.first().attr("checked", "checked");
                    }

                    defer.resolve();
               
            return defer.promise();
        });
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
        cadesplugin.async_spawn(function*(args) {
            var cerNum = $('[name="certificateList"]').find("input:checked").val();
            if (cerNum != undefined) {
                cerNum = cerNum * 1;
                var cert = yield Certificates.Item(cerNum);
                var providerKey = yield cert.PrivateKey;
                var providerName = yield providerKey.ProviderName;
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
                    var oSigner = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
                    yield oSigner.propset_Certificate(cert);

                    var hashData = $("[name='signature-hash']").val();
                    var oHashedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.HashedData");

                    // Инициализируем объект заранее вычисленным хэш-значением
                    // Алгоритм хэширования нужно указать до того, как будет передано хэш-значение
                    yield oHashedData.propset_Algorithm(cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411);
                    yield oHashedData.SetHashValue(hashData);

                    var oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                    yield oSigner.propset_Options(1);
                    var message = yield oSignedData.SignHash(oHashedData, oSigner, cadesplugin.CADESCOM_CADES_BES, true);
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
        });
    }
    var SignAttachments = function (callbackFn, messageFn, hideResultDialog, onFinish) {

        if (!onFinish) {
            var onFinish = function () {
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

        InitCertHashAlgorithm().then(function() {


            cadesplugin.async_spawn(function*(args) {
                //$('[name="edsProgressbar"]').removeAttr('hidden');
                cleanDocumentHashUrl = $("[data-name='documentHashUrl']").val();
                cleanDocumentHashUrl = AddHashAlgorithmToUrl(cleanDocumentHashUrl);


                //n.volosatov: костыля, если есть activitySignUrl, ибо cleanDocumentHashUrl перезаписывается в Sign методе
                if (activitySignUrl) {
                    activitySignUrl = undefined;
                    $("[data-name='activitySignature']").remove();
                }

                documentHashUrl = 'GetAttachmentKeys';
                cleanDocumentHashUrl = cleanDocumentHashUrl.replace('GetDocumentHashCode', documentHashUrl);

                isAttachEDS = $('[name="isAttachEDS"]').is(':checked');
                activitySignUrl = $("[data-name='activitySignature']").val();
                isSignAllAttachment = $('[data-name="isSignAllAttachment"]').val();

                targetUrl = cleanDocumentHashUrl.replace(documentHashUrl, "SignDocument");
                isAttachEDS = $('[name="isAttachEDS"]').is(':checked');
                var getSignTypeUrl = cleanDocumentHashUrl.replace(documentHashUrl, 'GetSignType');


                if (targetUrl.indexOf('&attachKey=') != -1) {
                    isAttachEDS = true;
                    isSignAllAttachment = true;
                }

                //$.get(getSignTypeUrl, { edsSend: false }, function (signType) {
                var promises = [];
                $.ajax({
                    url: getSignTypeUrl,
                    cache: false,
                    data: { edsSend: false },
                    success: function(signType) {
                        //GetAttachmentKeys
                        $.ajax({
                            url: cleanDocumentHashUrl,
                            cache: false,
                            success: function(keysAttach) {
                                if (keysAttach.length == 0) {
                                    onMessage("У подписываемого документа отсутствует документация.", true);
                                    return;
                                }
                                if (isServerCalcHash) {
                                    cleanDocumentHashUrl = cleanDocumentHashUrl.replace(documentHashUrl, 'GetAttachmentHashCode');
                                } else {
                                    cleanDocumentHashUrl = cleanDocumentHashUrl.replace(documentHashUrl, 'GetAttachmentBase64Code');
                                }
                                $.each(keysAttach,
                                    function(key, keyAttach) {
                                        try {
                                            $.ajax({
                                                url: cleanDocumentHashUrl.replace('&attachKey=', '&attachKey=' + keyAttach),
                                                cache: false,
                                                async: false,
                                                error: function(error) {
                                                    onMessage("Ошибка подписания: " + error.statusText, true);
                                                    return;
                                                },
                                                success: function(dataToSign) {
                                                    console.info("Документ с ключом " +
                                                        keyAttach +
                                                        " объем:" +
                                                        dataToSign.length);

                                                    var sign = {
                                                        AttachmentKey: keyAttach
                                                    }
                                                    signatures.push(sign);
                                                    promises.push(Sign(dataToSign,
                                                        signType,
                                                        callbackFn,
                                                        messageFn,
                                                        null,
                                                        keyAttach));


                                                }
                                            });

                                        } catch (e) {
                                            onMessage("Ошибка подписания" + e.message, true);
                                            return;
                                        }
                                    });

                                Promise.all(promises).then(function() {
                                    //var signatures = arguments;
                                    if (signatures.length > 0 && keysAttach.length == signatures.length) {
                                        var targetUrl = "";
                                        if (isServerCalcHash) {
                                            targetUrl = cleanDocumentHashUrl.replace('GetAttachmentHashCode',
                                                "SignAllAttachmentHandler");
                                        } else {
                                            targetUrl = cleanDocumentHashUrl.replace('GetAttachmentBase64Code',
                                                "SignAllAttachmentHandler");
                                        }
                                        targetUrl = targetUrl.replace("ContextAction", "Attachment");

                                        var uniqueIds = $("[name='uniqueIds']").val();

                                        $.post(targetUrl,
                                            { sign: JSON.stringify(signatures), uniqueIds: uniqueIds },
                                            function(feedback) {
                                                try {
                                                    //feedback = JSON.parse(feedback);
                                                    //$('[name="edsProgressbar"]').attr('hidden', 'true');

                                                    feedback = JSON.parse(feedback);
                                                    if (feedback.status == "ERROR") {
                                                        onMessage(feedback.responseMessage, true);
                                                        return;
                                                    }

                                                    //$('[name="signInfo"]').html("<FONT color='green'>" + feedback.message + "</FONT>"); //.append(sSignedMessage);
                                                 //   onMessage("Документ/файлы подписаны успешно", false);
                                                    if ($('[name="onlyGOST"]').is(':checked')) {
                                                        showConfirmEx("Подписание", "Документ подписан успешно", "OK", "", $("[name='uniqueIds']"))
                                                            .then(function () {
                                                                onFinish();
                                                            });
                                                    } else {
                                                        onFinish();
                                                    }


                                                //    onFinish();
                                                    //if (callbackFn !== undefined)
                                                    //    callbackFn();
                                                    isAttachEDS = false;
                                                    isSignAllAttachment = false;
                                                    var url = cleanDocumentHashUrl.replace("GetAttachmentHashes",
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
                                });
                            }
                        });
                    }
                });
            });
        });
    }
    var SignDocumentWithAtachments = function(callbackFn, messageFn, hideResultDialog, onFinish) {

        if (!onFinish) {
            onFinish = function() {
                if (callbackFn !== undefined) {
                    callbackFn();
                }
            };
        }


        activitySignUrl = $("[data-name='activitySignature']").val();

        var onMessage = function(message, isError) {
            if (messageFn !== undefined) {
                messageFn(message, isError);
            } else if (isError) {
                $('[name="signInfo"]').html("<FONT color='red'>" + message + "</FONT>");
            } else {
                $('[name="signInfo"]').html("<FONT color='green'>" + message + "</FONT>");
            }
        }
        InitCertHashAlgorithm().then(function() {
            cadesplugin.async_spawn(function*(args) {
                //$('[name="edsProgressbar"]').removeAttr('hidden');

                cleanDocumentHashUrl = $("[data-name='documentHashUrl']").val();

                documentHashUrl = 'GetDocumentHashCode';
                var getSignTypeUrl = cleanDocumentHashUrl.replace(documentHashUrl, 'GetSignType');

                var signType;
                //Получаем тип подписи
                $.ajax({
                    url: getSignTypeUrl,
                    type: "get",
                    async: false,
                    data: { edsSend: false },
                    success: function(type) {
                        signType = type;
                    },
                    error: function() {

                    }
                });

                //Получаем Хэш документа и подписываем его
                var fpromis;
                $.ajax({
                    url: cleanDocumentHashUrl,
                    type: "GET",
                    cache: false,
                    async: false,
                    data: { edsSend: false },
                    success: function(dataToSign) {
                        fpromis = Sign(dataToSign, signType, callbackFn, messageFn);
                    },
                    error: function() {

                    }
                });

                fpromis.then(function() {

                    documentHashUrl = 'GetAttachmentHashes';

                    //n.volosatov: костыля, если есть activitySignUrl, ибо cleanDocumentHashUrl перезаписывается в Sign методе
                    if (activitySignUrl) {
                        cleanDocumentHashUrl = $("[data-name='documentHashUrl']").val();
                        cleanDocumentHashUrl = AddHashAlgorithmToUrl(cleanDocumentHashUrl);
                        activitySignUrl = undefined;
                        $("[data-name='activitySignature']").remove();
                    }

                    cleanDocumentHashUrl = cleanDocumentHashUrl.replace('GetDocumentHashCode', documentHashUrl);

                    isAttachEDS = true;
                    isSignAllAttachment = true;

                    //Получаем Хэши файлов и подписываем их
                    var promises = [];

                    $.ajax({
                        url: cleanDocumentHashUrl,
                        type: "get",
                        async: false,
                        cache: false,
                        data: { edsSend: false },
                        success: function(dataToSign) {
                            $.each(dataToSign,
                                function(key, signsParam) {
                                    var sign = {
                                        Hash: signsParam.Hash,
                                        AttachmentKey: signsParam.AttachmentKey
                                    }
                                    signatures.push(sign);
                                    promises.push(Sign(signsParam.Hash, signType, callbackFn, messageFn));
                                });
                            Promise.all(promises).then(function() {
                                if (signatures.length > 0) {
                                    var targetUrl = cleanDocumentHashUrl.replace(documentHashUrl, "SignAllAttachmentHandler");
                                    targetUrl = targetUrl.replace("ContextAction", "Attachment");

                                    $.post(targetUrl,
                                        { sign: JSON.stringify(signatures) },
                                        function(feedback) {
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

                                                var url = cleanDocumentHashUrl.replace("GetAttachmentHashes",
                                                    "DocumentAttachmentSignConfirmation");
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
                                            } catch (ex) {
                                                onMessage("Ошибка подписания", true);
                                            }
                                        });
                                } else {

                                    onFinish();

                                    var isExport = $('[name="isEisExport"]').is(':checked');
                                    if (isExport) {
                                        return;
                                    }

                                    var url = cleanDocumentHashUrl.replace("GetAttachmentHashes",
                                        "DocumentAttachmentSignConfirmation");
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
                            });
                        },
                        error: function() {

                        }
                    });
                });
            });
        });
    }


    return {
                     SignCreate: SignCreate,
                     SignAuthentication: SignAuthentication,
                     VerifyDocumentSign: VerifyDocumentSign,
                     GetCertificates: GetCertificates,
                     SignForEis: SignForEis,
                     SignAttachments: SignAttachments,
                     SignDocumentWithAtachments: SignDocumentWithAtachments,
                     VerifyAttachmentSign: VerifyAttachmentSign,
                     ClearCache: function ClearCache() {
                         signatures = [];
                     },
                     TryToSelectDefaultCertificate: TryToSelectDefaultCertificate
                 }
             })();
