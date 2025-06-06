var TableEditForm = function (buttonElement, js) {

    String.prototype.replaceAll = function (search, replace) {
        return this.split(search).join(replace);
    }

    var deferred = $.Deferred();
    var itemForm;
    var searchInExternalSystemForm;
    var win;

    var $tableButton = $(buttonElement);
    var jsSrc = js;
	
    var columns = $tableButton.closest(".table-edit-row").children(".table-edit-columns").children(".table-edit-column");
    var tblName = $tableButton.closest(".table-edit").attr("data-name");

    var model;
    var treeWidth = 779;
    var panelWidth = 800;
    var panelHeight = 700;

    var uniqId;

    var formContent = [];
    var isButtonExternalSystemClick = false;



    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function init() {
        sortable = true;
        localize();
        uniqId = makeid();
        Ext.define('OverrideHeaderResizer',
            {
                override: 'Ext.grid.plugin.HeaderResizer',
                maxColWidth: 9999
            });
		if (jsSrc != undefined && jsSrc != "") {
			 $.getScript(js).done(function() {
				 if (typeof customWidth !== "undefined")
					panelWidth = customWidth;
				
				 if (typeof getCustomLayout !== "undefined") {
					var customLayout = getCustomLayout();
					buildCustomForm(customLayout);
				 } 
				 else buildDefaultForm();

			 });
		}
		else buildDefaultForm();
		
    }
	
    function buildCustomForm(customLayout) {

        formContent.push('<div class="panel panel-default">',
            '<div class="panel-body column-container">');

        customLayout.forEach(function (row) {

            formContent.push('<div class="row row-container clearfix col-xs-12">');

            var columnWidth = 12;
            var actualColumnCount = row.visibleColumnsCount;

            columnWidth = columnWidth / actualColumnCount;

            row.columns.forEach(function (layoutColumn) {

                var column;

                columns.each(function (index, col) {

                    var colControl = $(col).children("span");
                    var titleDataRelatedField = colControl.attr("data-related-field");

                    if (titleDataRelatedField != undefined && titleDataRelatedField.indexOf(layoutColumn) != -1) {
                        column = col;
                        return false;
                    }

                });

                var titleControl = $(column).children("span");
                var titleDataRelatedField = titleControl.attr("data-related-field");

                if ($(column).css('display') == 'none' && !$(column).hasClass("view-in-form")) {
                    var fieldHidden = null;
                    fieldHidden = $(column)[0].innerHTML.replaceAll(tblName + "-",
                        "form" + tblName + "-");
                    formContent.push('<div class="column-container col-xs-' + columnWidth + '" style="display:none;">',

                        '<div class="documentView-field-value form-group without-overflow" data-name="" data-field-name="">',
                        fieldHidden,
                        '</div>',

                        '</div>');
                } else {

                    if ($(column).children(".documentView-field-value").length > 0 || $(column).hasClass("view-in-form")) {

                        formContent.push('<div class="column-container col-xs-' + columnWidth + '">');

                        var field = createField(column);

                        if (field.indexOf("checkbox-wrapper") === -1) {

                            formContent.push('<div class="documentView-field-label" data-related-field="form' +
                                titleDataRelatedField + '" data-label-name="' + titleControl.text() + '">',
                                '<label class="control-label">' + titleControl.text() + '</label>',
                                '</div>');
                            formContent.push(
                                '<div class="documentView-field-value form-group without-overflow" data-name="" data-field-name="">',
                                field,
                                '</div>');

                        } else {

                            formContent.push(
                                '<div class="documentView-field-value form-group without-overflow" data-name="" data-field-name="">',
                                field,
                                '<div class="checkbox-label documentView-field-label"><label for="' + titleDataRelatedField + '" class="control-label" style="cursor: default;">' + titleControl.text() + '</label></div>',
                                '</div>');

                        }

                        formContent.push('</div>');

                    }
                }


            });

            formContent.push('</div>');

        });

        formContent.push('</div>',
            '</div>');

        showModalWindow();

    }
	
	
	function buildDefaultForm () {
		
		
		formContent.push('<div class="panel panel-default">',
				'<div class="panel-body column-container">');

		columns.each(function (index, column) {
			
			var titleControl = $(column).children("span");
			var titleDataRelatedField = titleControl.attr("data-related-field");
			if ($(column).children(".documentView-field-value").length > 0 || $(column).hasClass("view-in-form")) {
				
				var field = createField(column);

				formContent.push('<div class="row row-container clearfix">',
					'<div class= "col-xs-12 ">',
					'<div class="documentView-field-label" data-related-field="form' +
					titleDataRelatedField +
					'" data-label-name="' +
					titleControl.text() +
					'">',
					'<label class="control-label">' + titleControl.text() + '</label>',
					'</div>',
					'</div>',
					'</div>');
				formContent.push('<div class="row row-container clearfix">',
					'<div class= "col-xs-12">',
					'<div class="documentView-field-value form-group without-overflow" data-name="" data-field-name="">',
					field,
					'</div>',
					'</div>',
					'</div>');
			} else {
				if ($(column).css('display') == 'none') {
					var fieldHidden = null;
					fieldHidden = $(column)[0].innerHTML.replaceAll(tblName + "-",
						"form" + tblName + "-");
					formContent.push('<div class="row row-container clearfix" style="display:none;">',
						'<div class= "col-xs-12 ">',
						'<div class="documentView-field-value form-group without-overflow" data-name="" data-field-name="">',
						fieldHidden,
						'</div>',
						'</div>',
						'</div>');
				}
			}

		});

		formContent.push('</div>',
			'</div>');
		
		showModalWindow();
	}
	
	var createField = function(column) {
			
		var field = null;
		if ($(column).children(".documentView-field-value").length > 0) {

			field = $(column).children(".documentView-field-value")[0].innerHTML.replaceAll(tblName + "-",
				"form" + tblName + "-");
			if ($(column)[0].outerHTML.indexOf("button") > -1) {
				var inputCtl = $(column).find("input").first();
				var buttonCtl = $(column).find("button").last();
				var idButtonCtl = "";
				if (buttonCtl.length > 0) {
					if (buttonCtl[0].hasAttribute("id")) {
						idButtonCtl = buttonCtl.attr("id");
						field = field.replaceAll("show-dict-btn", "show-dict-btn table-form-button");
						field = field.replaceAll('data-dicttablename="' + idButtonCtl + '"',
							'data-dicttablename="' +
							inputCtl.attr("data-field-name").replaceAll(tblName + "-", "form" + tblName + "-") +
							'"');
					}
				}

				var selectedVal = $(column).children(".documentView-field-value")
					.find(".dict-display-field,.mult-dict-display").val();
				if (selectedVal != undefined) {
					selectedVal = selectedVal.replace(/"/g, "&quot;");
					field = field.replaceAll('input type="text"',
						'input type="text" value="' + selectedVal + '"');
				}

			}

		}
		var inputCtl = $(column).find("input[type='text']");
		if (inputCtl.length > 0) {
			if (inputCtl.attr("value") == undefined || inputCtl.attr("value") == "") {
				if (field.indexOf("value=") == -1) {
					if (field.indexOf("value") == -1) {
						field = field.replaceAll('type="text"', 'type="text" value="' + inputCtl.val() + '"');
					} else {
						field = field.replaceAll("value", 'value="' + inputCtl.val() + '"');
					}
				} else {
					field = field.replaceAll('value=""', 'value="' + inputCtl.val() + '"');
				}
			} else {
				field = field.replaceAll('value="' + inputCtl.attr("value") + '"',
					'value="' + inputCtl.val() + '"');
			}
		}

		var textareaCtl = $(column).find("textarea");
		if (textareaCtl.length > 0) {
			if (textareaCtl[0].textContent == "") {
				field = field.replaceAll("</textarea>", textareaCtl.val() + "</textarea>");
			} else {
				field = field.replaceAll(textareaCtl[0].textContent, textareaCtl.val());
			}
		}
		if ($(column)[0].outerHTML.indexOf("longtext") > -1 && $(column)[0].outerHTML.indexOf("button") == -1) {
			var inputCtl = $(column).find("input");
			var dataFieldName = "";
			if (inputCtl.length > 0) {

				if (inputCtl[0].hasAttribute("data-field-name")) {
					dataFieldName = inputCtl.attr("data-field-name")
						.replaceAll(tblName + "-", "form" + tblName + "-");;
				}

				var nameCtl = inputCtl.attr("name").replaceAll(tblName + "-", "form" + tblName + "-");
				var val = $(column).find("input").attr("value");
				field = '<textarea rows="8" class="form-control" data-field-name="' +
					dataFieldName +
					'" name="' +
					nameCtl +
					'" >' +
					val +
					'</textarea>';

			}
		}

        var checkboxCtl = $(column).find("input[type='checkbox']");
        if (checkboxCtl.length > 0) {
            if (checkboxCtl[0].checked && field.indexOf("checked") === -1) {
                field = field.replaceAll('type="checkbox"', 'type="checkbox" checked')
            }

        }

		return field;
	}	
	

    function initAutonumericEditForm() {
        updateDatepickers();
        $("[id^=itemTableFormPanel]").find(".form-control.money:not([data-edit-required])").each(
            function (index, value) {
                var item = $(value);
                item.val(item.val().replaceAll(' ', ''));
                item.autoNumeric('init',
                    {
                        aSep: ' ',
                        aDec: '.',
                        vMin: '0.00',
                        vMax: "99999999999999999999999999999999999999999.99",
                        wEmpty: '',
                        mRound: 'B',
                        mDec: window.moneyPrecision
                    });
            });

        $("[id^=itemTableFormPanel]").find(".form-control[data-number-type='integer']:not([data-edit-required])").autoNumeric('init', {
            aSep: '',
            aDec: '.',
            vMin: '0',
            vMax: "99999999999999999999999999999999999999999",
            wEmpty: 'zero',
            lZero: 'keep',
            mRound: 'B'
        });

        $("[id^=itemTableFormPanel]").find(".form-control[data-number-type='double']:not([data-edit-required])").each(function (index, value) {
            var item = $(value);
            item.autoNumeric('init', {
                aSep: '',
                aDec: '.',
                vMin: '0.00',
                vMax: "99999999999999999999999999999999999999999.99",
                mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '2',
                wEmpty: '',
                mRound: 'B'
            });
        });

        $("[id^=itemTableFormPanel]").find("input[type='checkbox'][readonly]").readonly();

    }

    function closeWin() {
        win.close();

        if ($tableButton.parents(".modal").length > 0) {
            $("body").addClass("modal-open");
        } else {
            $("body").removeClass("modal-open");
        }
    }
    function saveForm() {
        var isValid = true;
        var formdata = $("[id^=itemTableFormPanel]").find("[name^=form" + tblName + "-]");
        formdata.each(function (index, control) {
            var name = $(control).attr("name").replace("form" + tblName, tblName);
            if ($(control)[0].hasAttribute("required")) {
                if ($(control).val() == "") {
                    $(control).parent().addClass("has-error");
                    isValid = false;
                } else {
                    $(control).parent().removeClass("has-error");
                }
            }

        });
        var formdataFields = $("[id^=itemTableFormPanel]").find("[data-field-name^=form" + tblName + "-]");
        formdataFields.each(function (index, control) {
            var name = $(control).attr("data-field-name").replace("form" + tblName, tblName);
            if ($("[data-field-name=" + name + "]").length > 0) {
                if ($(control)[0].hasAttribute("required")) {
                    if ($(control).val() == "") {
                        $(control).parent().addClass("has-error");
                        isValid = false;
                    } else {
                        $(control).parent().removeClass("has-error");
                    }
                }
            }
        });
        if (isValid) {

            var formdata = $("[id^=itemTableFormPanel]").find("[name^=form" + tblName + "-]");

            formdata.each(function (index, control) {
                if ($(control).is(":checkbox")) {
                    return;
                }
                var name = $(control).attr("name").replace("form" + tblName, tblName);

                $("[name=" + name + "]").attr("value", $(control).val());
                if ($("[name=" + name + "]")[0].hasAttribute("readonly")) {
                    $("[name=" + name + "]").removeAttr("readonly").val($(control).val()).attr("readonly", true);
                } else {
                    if ($("[name=" + name + "]").hasClass("money") || $("[name=" + name + "]")[0].hasAttribute("data-number-type")) {
                        var vall = $(control).val().replaceAll(' ', '');
                        $("[name=" + name + "]").autoNumeric('set', vall);
                    }
                    $("[name=" + name + "]").val($(control).val());
                }
                $("[name=" + name + "]").change();



            });
            var formdataFields = $("[id^=itemTableFormPanel]").find("[data-field-name^=form" + tblName + "-]");
            formdataFields.each(function (index, control) {

                var name = $(control).attr("data-field-name").replace("form" + tblName, tblName);
                if ($(control).is(":checkbox")) {
                    $("[name=" + name + "]").prop("checked", $(control).prop("checked") === true ? true : false).change();
                }
                if ($("[data-field-name=" + name + "]").length > 0) {
                    $("[data-field-name=" + name + "]").attr("value", $(control).val());
                    if ($("[data-field-name=" + name + "]")[0].hasAttribute("readonly")) {
                        $("[data-field-name=" + name + "]").removeAttr("readonly").val($(control).val())
                            .attr("readonly", true);
                    } else {
                        if ($("[data-field-name=" + name + "]").hasClass("money") || $("[data-field-name=" + name + "]")[0].hasAttribute("data-number-type")) {
                            var vall = $(control).val().replaceAll(' ', '');
                            $("[data-field-name=" + name + "]").autoNumeric('set', vall);
                        }
                        $("[data-field-name=" + name + "]").val($(control).val());
                    }
                    $("[data-field-name=" + name + "]").change();
                }
            });



            var formdataUls = $("[id^=itemTableFormPanel]").find("ul[name^=form" + tblName + "-]");
            formdataUls.each(function (index, control) {
                var name = $(control).attr("name").replace("form" + tblName, tblName);
                if ($("ul[name=" + name + "]").length > 0) {
                    $("ul[name=" + name + "]")[0].outerHTML = $(control)[0].outerHTML.replaceAll("form" + tblName, tblName);
                }
            });
            closeWin();
        }
    }

    function showModalWindow() {

        itemForm = Ext.create('Ext.panel.Panel',
            {
                id: 'itemTableFormPanel' + uniqId,
                minHeight: (typeof customMinHeight === "undefined") ? 555 : customMinHeight,
                maxHeight: 600,
                rootVisible: true,
                hideHeaders: false,
                hidden: false,
                html: formContent,
                layout: 'container',
                bodyCls: "x-body x-webkit x-chrome",
                buttons: [
                    {
                        text: 'Ок',
                        handler: saveForm
                    },
                    {
                        text: 'Отмена',
                        handler: closeWin
                    }
                ],
                autoScroll: true
            });


        //var windowDefaultMinWidth = 350;
        //var windowDefaultMinHeight = 550;

        win = Ext.create('widget.window',
            {
                title: 'Редактирование таблицы',
                header: {
                    titleAlign: 'center'
                },
                closable: false,
                id: 'TableWind' + uniqId,
                closeAction: 'destroy',
                maximizable: true,
                width: panelWidth,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                monitorResize: true,
                //layout: 'fit',
                modal: true,
                items: [itemForm],
                autoDestroy: false,
                listeners: {
                    //close: enableDictButton,
                    resize: function (el, newWidth, newHeight, oldWidth, oldHeight) {
                        if ($('#editView').length > 0 || $('#registerView').length > 0 || $('#address-book-container').length > 0
                            || $('#build-report-form').length > 0) {

                            newWidth = Math.min(newWidth, ct.common.calc.getMinClientWidth());

                            el.setWidth(newWidth);
                            el.setHeight(newHeight);

                            var treePanelHeight = isButtonExternalSystemClick
                                ? newHeight - searchInExternalSystemForm.height - 45
                                : el.height - 45
                            itemForm.setHeight(treePanelHeight);
                        }
                    },
                    maximize: function (window, opts) {
                        window.anchorTo('TableWind' + uniqId, 'bl-bl?', [0, 0], true, 50, function () {
                        });
                    },
                    restore: function (window, opts) {
                        window.anchorTo(Ext.getBody(), 'c-c', [0, 0], true, 50, function () {
                        });
                    }
                },
            });

        /* hierar.win = win;
         hierar.treePanel = treePanel;
         hierar.store = store;*/
		 
        win.show();
		if (typeof setFormLogic !== "undefined") setFormLogic();

        setTimeout(initAutonumericEditForm, 1000);
        //} else {
        //    win = cmp;
        //    win.items.add(treePanel);
        //    win.show();
        //}

    }


    function localize() {
        Ext.define('Ext.grid.header.Container',
            {
                override: 'Ext.grid.header.Container',
                sortAscText: 'Сортировать по возрастанию',
                sortDescText: 'Сортировать по убыванию'
            });
    }

    init();
    /*return {
        treePanel: treePanel,
        win: win,
        store: store
    }*/
    return deferred;
};
