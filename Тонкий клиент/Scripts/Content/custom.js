; (function () { }(window.ct = window.ct || {}));
; (function (custom) {

    /**
     * Показываем диалоговое окно с информацией о технической поддержке.     
     */
    custom.showSupportDialog = function () {
        ct.ui.alert('Техническая поддержка', '1. <a href="http://cspp.vtb24.ru/ess/ess.do?ctx=docEngine&file=hpctplincidents&query=tpl.id%3D%2263839297913%22&action=&title=&queryHash=66446abb" target="_blank">Портал службы поддержки пользователей</a> <br />2. <a href="mailto:SPP3@vtb.ru?subject=Письмо в Техническую поддержку (iProc)">Письмо в Техническую поддержку (iProc)</a> <br />3. ЦСПП - тел.: <a href="tel:555555">55-55-55</a>');
    };
	
	/**
     * Показывает waitingDialog и потом перезагружает страницу.     
     */
	custom.wait5Sec = function (f) {

        setTimeout(function () {
            waitingDialog.showWaiting();
        }, 500);

        setTimeout(function () {

            if (f && typeof (f) === "function") {
                f();
            } else {
                window.location.reload();
            }

        }, 3500);
    };

    custom.wait10Sec = function (f) {

        setTimeout(function () {
            waitingDialog.showWaiting();
        }, 500);

        setTimeout(function () {

            if (f && typeof (f) === "function") {
                f();
            } else {
                window.location.reload();
            }

        }, 8500);
    };

    custom.wait15Sec = function (f) {

        setTimeout(function () {
            waitingDialog.showWaiting();
        }, 500);

        setTimeout(function () {

            if (f && typeof (f) === "function") {
                f();
            } else {
                window.location.reload();
            }

        }, 14500);
    };
	
	custom.wait20Sec = function (f) {

        setTimeout(function () {
            waitingDialog.showWaiting();
        }, 500);

        setTimeout(function () {

            if (f && typeof (f) === "function") {
                f();
            } else {
                window.location.reload();
            }

        }, 20500);
    };

}((window.ct = window.ct || {}, window.ct.custom = window.ct.custom || {})));


var ExtContractorManager = function (store, treePanel, win) {

    var findExternalContractor = function() {

        var orgFilterPanel = $('#itemFormPanel-suppliers-body');
        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];
        baseUrl += '/ExtContractor/GetFilteredContractor';

        var filter = {
            orgName: orgFilterPanel.find('[data-field-name="fullOrgName"]').val(),
            orgType: orgFilterPanel.find('[dictionary-edit-name="TipUrLico"]').val(),
            isNoResident: orgFilterPanel.find('[data-field-name="nerez"]:checked').length > 0,
            isIndividEnterp: orgFilterPanel.find('[data-field-name="ip"]:checked').length > 0,
            code: orgFilterPanel.find('[data-field-name="idNonres"]').val(),
            inn: orgFilterPanel.find('[data-field-name="inn"]').val(),
            kpp: orgFilterPanel.find('[data-field-name="kpp"]').val(),

            lastName: orgFilterPanel.find('[data-field-name="lastName"]').val(),
            firstName: orgFilterPanel.find('[data-field-name="firstName"]').val(),
            middleName: orgFilterPanel.find('[data-field-name="middleName"]').val()
        };

        if (!filter.orgType) {
            Ext.Msg.alert('Ошибка', 'Выберите тип контрагента');
            return;
        }
        
        if(filter.orgType==='U' && (!filter.inn || !filter.kpp))
        {
            Ext.Msg.alert('Ошибка','Необходимо указать ИНН и КПП');
            return;
        }


        if ((filter.orgType === 'U' && (!filter.inn || !filter.kpp)) ||
            ((filter.orgType === 'UF' || filter.orgType === 'PF') && !filter.orgName && !filter.code) ||
            ((filter.orgType === 'IP') && !filter.orgName && !filter.inn) ||
            ((filter.orgType === 'P') && !filter.inn && !filter.firstName && !filter.lastName && !filter.middleName)
            ) {
                Ext.Msg.alert('Ошибка', 'Невозможно отправить пустой запрос');
                return;
        }
        win.mask("Поиск в смежных системах");
        $.ajax(
                {
                    type: "POST",
                    dataType: "json",
                    url: baseUrl,
                    data: filter
                })
            .done(function(response) {
				$('.x-component.x-border-box.x-mask.x-component-default[id^="loadmask-"]').hide();
                store.clearData();
                treePanel.view.refresh();

                if (response.data) {
                    var newItems = [];

                    response.data.forEach(function(client) {
                        var rec = {
                            id: client.Id,
                            code: client.Id,
                            "Наименование": client.Name,
                            "ИНН": client.Inn,
                            "КПП": client.Kpp,
                            leaf: true,
                            enabled: true,
                            parentid: null,
                            children: null,
                            expanded: false,
                            source: client.Source
                        };
                        newItems.push(rec);
                    });

                    var newStore = Ext.create('Ext.data.Store',
                        {
                            model: 'Dictionary',
                            data: newItems
                        });

                    treePanel.reconfigure(newStore);
                    treePanel.view.refresh();
                } else {
                    var errorTitle = 'Произошла ошибка';
                    var errorMessage = response.error || response.responseMessage;

                    if (errorMessage === 'Внешние контрагенты не найдены') {
                        errorTitle = 'Внешние контрагенты не найдены';

                        if ((filter.orgType === 'U' || filter.orgType === 'UF' || filter.isIndividEnterp)) {
                            errorMessage = 'По указанным реквизитам в ПКБ контрагента не найдено';
                        } else {
                            errorMessage = 'Необходимо проверить параметры поискового запроса либо инициировать заведение нового контрагента через группу НСИ';
                        }

                    } 

                    Ext.Msg.alert(errorTitle, errorMessage);
                }
            }).always(function () {
                win.unmask();
            });
        
    }

    var saveChoosenContractor = function (selectedContractorId, selectedRowsDebug, fillSelected, inn, name, loadDictionaryDataRow, callbackFunc, doneFunc, failFunc) {
       
		var contractorRow = selectedRowsDebug[0];
		var getUrl = window.location;
		var baseUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];
		baseUrl += '/ExtContractor/SaveContractor';

		var contractorType = contractorRow.get('source');

		var selectedOrgType = '';
		var orgFilterPanel = $('#itemFormPanel-suppliers-body');
		var filter = {
			orgType: orgFilterPanel.find('[dictionary-edit-name="TipUrLico"]').val(),
			isIndividEnterp: orgFilterPanel.find('[data-field-name="ip"]:checked').length > 0
		};

		if (filter.orgType === 'P' || filter.orgType === 'PF') {
			selectedOrgType = '1';
		} else if (filter.orgType === 'U' || filter.orgType === 'UF' || filter.isIndividEnterp) {
			selectedOrgType = '2';
		}
		
		if(contractorType == 'sap'){
			if(selectedOrgType == '1'){
				selectedOrgType = 'ФЛ';
			}else{
				selectedOrgType = 'ЮЛ';
			}
			selectedContractorId = selectedContractorId.replace('SAP','')
		}else{
			if(filter.isIndividEnterp){
				  selectedOrgType = '3';
			}
		}

        callbackFunc();

        setTimeout(function () {

		    waitingDialog.show("Добавление контрагента...");
			
		    $.ajax(
				    {
					    type: "POST",
					    dataType: "json",
					    url: baseUrl,
					    data: {
						    contractorId: selectedContractorId,
						    contractorType: contractorType,
						    orgType: selectedOrgType,
						    inn: inn,
						    name: name
					    }
				    })
			    .done(function (response) {                

				    if (response.data) {
                        if (fillSelected) {
                            var code = response.data;
                            contractorRow.set('code', code);

                            doneFunc();

                            loadDictionaryDataRow(code).done(function (resp) {

                                var rows = JSON.parse(resp.data);
                                var rowData = rows.children[0];

                                if (rowData["Код клиента в SAP"] == "") {

                                    Ext.Msg.show({
                                        title: 'Внимание',
                                        msg: 'Контрагент отсутствует в SAP УВХД.<br/>1. Оформите запрос на группу НСИ на добавление контрагента. Шаблон письма и печатной формы запроса доступны на карточке контрагента по кнопке "Запрос в НСИ".<br/>2. После добавления контрагента в SAP УВХД, убедитесь, что на карточке контрагента заполнено поле "Код SAP", после чего перевыберите контрагента на карточке документа.',
                                        width: 700,
                                        closable: false,
                                        buttons: Ext.Msg.YESCANCEL,
                                        buttonText:
                                        {
                                            yes: 'Запрос в НСИ',
                                            cancel: 'Вернуться к заполнению'
                                        },
                                        multiline: false,
                                        fn: function (buttonValue, inputText, showConfig) {
                                            if (buttonValue == "yes") {
                                                var id = contractorRow.data.ИД_контрагента;
                                                var getUrl = window.location;
                                                var baseUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];

                                                var urle = baseUrl + '/ContextAction/HandleDocumentAction?uniqueIds=' + id + '&actionName=%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%20%D0%B2%20%D0%9D%D0%A1%D0%98&location=DocumentView&viewSourceType=SearchView&returnUrl=' + encodeURIComponent(baseUrl) + '%2FSearch%2FDocumentView%2F' + id + '%3FsearchTemplateName%3DOrganizationsMenu%23regcard-view-tlcInfo';
                                                window.open(urle, '_blank');
                                            }
                                        }
                                    });
                                }

                                contractorRow.data = rowData;
                                contractorRow.raw = rowData;

                                fillSelected(selectedRowsDebug);
                                waitingDialog.hide();
                            }).fail(function (e) {
                                waitingDialog.hide();
                                Ext.Msg.alert('Произошла ошибка при сохранении выбранного контрагента', e);
                            });

                        } else {
                            failFunc();
                        }
                    } else {
                        failFunc();
					    waitingDialog.hide();
					    Ext.Msg.alert('Произошла ошибка при сохранении выбранного контрагента', response.error || response.responseMessage);
				    }
			    })
                .fail(function (e) {
                    failFunc();
				    waitingDialog.hide();
				    Ext.Msg.alert('Произошла ошибка при сохранении выбранного контрагента', e);
                });

        }, 50);
    }

    return{
        findExternalContractor: findExternalContractor,
        saveChoosenContractor: saveChoosenContractor
    }
};


var ExpertsManager = function (store, tree) {

    var isExpert = function (docId, userLogin, resFunc) {
        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];
        baseUrl += '/Expert/IsExpertForDoc';

        $.ajax(
                {
                    type: "GET",
                    dataType: "json",
                    url: baseUrl,
                    data: {
                        docId: docId,
                        userLogin: userLogin
                    }
                })
            .done(function(response) {
                resFunc(response);
            });
    };

    var findExpert = function () {
        var orgFilterPanel = $('#itemFormPanel-expert-body');
        var searchVal = orgFilterPanel.find('[name="typedSearchField"]').val().trim();

        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];
        if (!searchVal) {
            Ext.Msg.alert('Ошибка', 'Введите данные эксперта');
            return;
        }
        if (store.storeId.indexOf('adrList') > -1) {
            baseUrl += '/Expert/GetFilteredExpertsLazy';
            baseUrl = baseUrl + "?filter=" + encodeURIComponent(searchVal);
            store.proxy.url = baseUrl;
            store.load();
        } else {
        baseUrl += '/Expert/GetFilteredExperts';
            $.ajax(
                    {
                        type: "POST",
                        dataType: "json",
                        url: baseUrl,
                        data: {
                            filter: searchVal
                        }
                    })
                .done(function(response) {
                    store.clearData();
                    tree.view.refresh();

                    if (response.data) {
                            //Удаляем ноды все дочерние для корневого

                            var rootNode = store.getRootNode();
                            var allChilds = rootNode.childNodes;
                            for (cs in allChilds) {
                                rootNode.removeChild(allChilds[cs]);
                            }

                            response.data.forEach(function(expert) {
                                var rec = {
                                    id: expert.VtbPersonNumber,
                                    key: expert.VtbPersonNumber,
                                    name: expert.FullName + ' (' + expert.DepartmentName + ')',
                                    leaf: true,
                                    enabled: true,
                                    parentid: null,
                                    children: null,
                                    expanded: false,
                                    selectable: "true"
                                };

                                rootNode.appendChild(rec);
                            });

                    } else {
                        Ext.Msg.alert('Произошла ошибка', response.error || response.responseMessage);
                    }
                });
        }
    }

    var saveChoosenExpert = function (storebookTpl, registerName, fillSelected) {

        var title = $(".modal-title:visible").text();

        var checkAccess =
            registerName === "expert" ||
            (registerName === "performerName" && (title === "Создать этап" || title === "Делегировать")) ||
            (registerName === "performerNames" && title === "Запрос дополнительного согласования") ||
            (registerName === "performerNames" && title === "Создать этап");

        if (!checkAccess) {
            return; //Пока просто тупая проверка - если кнопка по имени не соотвествет экспертам - ничего не делаем
        }

		//должен быть выбран только один эксперт
        if (storebookTpl.length !== 1){
			Ext.Msg.alert('Произошла ошибка', 'Должен быть выбран только один эксперт');
			return;
		}

        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];
        baseUrl += '/Expert/SaveExpert';
		waitingDialog.showWaiting(true);
		
        $.ajax(
                {
                    type: "POST",
                    dataType: "json",
                    url: baseUrl,
                    data: {
                        vtbPersonNumber: storebookTpl[0].key,
						curUserLogin: $(".header-menu-user-name").data("user-sid")       
                    }
                })
            .done(function (response) {
				waitingDialog.hide();
                if (response.data) {
                    if (fillSelected) {
                        storebookTpl[0].key = response.data;
                        fillSelected();
                    }
                } else {
                    Ext.Msg.alert('Произошла ошибка при сохранении выбранного контрагента', response.error || response.responseMessage);
                }
            });
    }

    return {
        findExpert: findExpert,
        saveChoosenExpert: saveChoosenExpert,
        isExpert: isExpert
    }
};

/*
(function () {

    if (!window.chrome) {

        $(document).ready(function () {

            setTimeout(function () {
                if ($(".dx-dialog-message:contains('Мы переходим на Google Chrome')").length === 0) {

                    showBrowserWarning();
                }
            }, 100);
			
			function showBrowserWarning() {
                var dlg = DevExpress.ui.dialog.custom({
                    title: "Информация",
                    message: "<p><b>Мы переходим на Google Chrome.</b></p><p>Пожалуйста, используйте браузер Google Chrome для доступа к системе управления закупками iProc (E1).</p><p>Google Chrome является целевым браузером для внутренних пользователей Банка.</p><p>В связи с этим будет ограничена поддержка браузера Internet Explorer.</p><p><b>Важно!</b></p><p>Для корректной работы подписания необходимо самостоятельно установить расширения КриптоПро для Chrome через Центр программного обеспечения.</p>",
                    buttons: [{
                        text: "OK",
                        onClick: function (e) {
                            showBrowserWarning();
                        }
                    }]
                });
                dlg.show();
            }
                 
        });        
    }

})();
*/