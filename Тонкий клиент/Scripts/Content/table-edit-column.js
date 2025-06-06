var TableEditRowsByColumn = function (buttonElement, js) {

    String.prototype.replaceAll = function (search, replace) {
        return this.split(search).join(replace);
    }

    var deferred = $.Deferred();
    var itemForm;
    var searchInExternalSystemForm;
    var win;

    var $columnButton = $(buttonElement);
    var jsSrc = js;
    var columnName = $columnButton.closest(".table-edit-column").attr("data-colName");

    var columnMain = $columnButton.closest(".table-edit").find("[name^='" + columnName + "-']").last().closest(".table-edit-column");
    var tblName = $columnButton.closest(".table-edit").attr("data-name");
    var isCheckBox = $(columnMain).find("input[type='checkbox']:not([hidden-ctl])").length > 0;
    var model;
    var treeWidth = 779;
    var panelWidth = 400;
    var panelHeight = 700;

    var uniqId;

    var formContent = [];
    var isButtonExternalSystemClick = false;
    var selectedItemPayload = null;


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
            //formContent.push('<script src="' + js + '"></script>');
            $.getScript(js);
        }

        var style = 'margin-bottom:0px;';
        if (isCheckBox) {
            style = "argin-bottom:0px;margin-top: 30px;";
        }

        formContent.push('<div class="panel panel-default" style="' + style + '">',
            '<div class="panel-body column-container"  style="padding-bottom:0px;">');
        var collRelField = [];
        var collDict = $(columnMain).find("input[dictionary-edit-name]");
        if (collDict.length > 0) {
            var nameDictField = $(collDict[0]).attr("dictionary-edit-name");
            $(columnMain).parent().find("[dictionary-edit-name=" + nameDictField + "]")
                .closest(".table-edit-column").each(function (index, relColl) {
                    if (relColl != columnMain[0]) {
                        collRelField.push(relColl);
                    }
                });
        }

        prepareColumn(formContent, columnMain);
        formContent.push('<div style="display:none;">');
        for (var i = 0; i < collRelField.length; i++) {
            prepareColumn(formContent, collRelField[i]);
        }

        formContent.push('</div>', '</div>',
            '</div>');


        showModalWindow();

    }

    function prepareColumn(formContent, column) {
        var isCheckBox = $(column).find("input[type='checkbox']:not([hidden-ctl])").length > 0;
        var titleControl = $(column).children("span");
        var titleDataRelatedField = titleControl.attr("data-related-field");
        var subId = titleDataRelatedField.substring(0, titleDataRelatedField.lastIndexOf("-"));
        if ($(column).children(".documentView-field-value").length > 0) {

            var field = null;
            if ($(column).children(".documentView-field-value").length > 0) {

                field = $(column).children(".documentView-field-value")[0].innerHTML.replaceAll(titleDataRelatedField,
                    "form" + subId);

                var inputCtlVal = $(column).find("input").attr("value");

                field = field.replaceAll('value="' + inputCtlVal + '"', 'value=""');

                if ($(column)[0].outerHTML.indexOf("button") > -1) {
                    var inputCtl = $(column).find("input").first();
                    var buttonCtl = $(column).find("button").last();
                    var idButtonCtl = "";
                    if (buttonCtl.length > 0) {
                        if (buttonCtl[0].hasAttribute("id")) {
                            idButtonCtl = buttonCtl.attr("id");
                            field = field.replaceAll('data-dicttablename="' + idButtonCtl + '"',
                                'data-dicttablename="' +
                                inputCtl.attr("data-field-name").replaceAll(titleDataRelatedField,
                                    "form" + subId) +
                                '"');
                        }
                    }

                }

            }

            if (isCheckBox) {

                formContent.push('<div class="noborder nomargin nopadding">',
                    '<div class="checkbox-wrapper" >',
                    field,
                    '</div>');
                formContent.push(
                    '<div class="documentView-field-label form-group checkbox-label checkbox-label-right" data-related-field="form' +
                    titleDataRelatedField +
                    ' data-label-name="' +
                    titleControl.text() +
                    '" style="padding-left: 40px; padding-top: 3px;">',
                    ' <label class="control-label"  readonly="readonly" style="cursor: not-allowed;">' +
                    titleControl.text() +
                    '</label>',
                    '</div>',
                    '</div>');
            } else {
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
            }
        } else {
            var field = null;
            if ($(column).children("input").length > 0) {

                field = $(column)[0].innerHTML.replaceAll(titleDataRelatedField,
                    "form" + subId);

                var inputCtlVal = $(column).find("input").attr("value");

                field = field.replaceAll('value="' + inputCtlVal + '"', 'value=""');

                if ($(column)[0].outerHTML.indexOf("button") > -1) {
                    var inputCtl = $(column).find("input").first();
                    var buttonCtl = $(column).find("button").last();
                    var idButtonCtl = "";
                    if (buttonCtl.length > 0) {
                        if (buttonCtl[0].hasAttribute("id")) {
                            idButtonCtl = buttonCtl.attr("id");
                            field = field.replaceAll('data-dicttablename="' + idButtonCtl + '"',
                                'data-dicttablename="' +
                                inputCtl.attr("data-field-name").replaceAll(titleDataRelatedField,
                                    "form" + subId) +
                                '"');
                        }
                    }

                }

            }


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

        }
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
        $("[id^=itemTableFormPanel]").find(".show-dict-btn").on("DicItemSelected", function (event, payload) {
            selectedItemPayload = payload;
        });
    }

    function closeWin() {
        win.close();

        if ($columnButton.parents(".modal").length > 0) {
            $("body").addClass("modal-open");
        } else {
            $("body").removeClass("modal-open");
        }
    }
    function saveForm() {

        $columnButton.closest(".table-content").find(".selector-all-row").each(function (index, checkbox) {

            if ($(checkbox).is(':checked')) {
                var selectKey = $(checkbox).attr("data-id").replace("selector-id-row-", "");
                var formdata = $("[id^=itemTableFormPanel]").find("[name^=form" + tblName + "-]");
                formdata.each(function (index, control) {
                    var name = $(control).attr("name").replace("form" + tblName, tblName) + "-" + selectKey;
                    var valCtl = $(control).val();
                    var isCheckBox = $(control).parent().hasClass("checkbox-wrapper");
                    if (isCheckBox && (valCtl == "" || valCtl == undefined || valCtl == null || !$(control).is(':checked'))) {
                        valCtl = "off";
                    }
                    $("[name=" + name + "]").attr("value", valCtl);
                    if ($("[name=" + name + "]")[0].hasAttribute("readonly")) {
                        $("[name=" + name + "]").removeAttr("readonly").val(valCtl).attr("readonly", true);
                    } else {
                        $("[name=" + name + "]").val(valCtl);
                        if ($(control).attr("type") == "checkbox") {
                            var checked = $(control).is(':checked');
                            if (checked) {
                                $("[name=" + name + "]").prop("checked", true);;
                            } else {
                                $("[name=" + name + "]").prop("checked", false);;
                            }

                        }
                        if ($("[name=" + name + "]").hasClass("money") || $("[name=" + name + "]")[0].hasAttribute("data-number-type")) {
                            var vall = $(control).val().replaceAll(' ', '');
                            $("[name=" + name + "]").autoNumeric('set', vall);
                        }

                    }
                    $("[name=" + name + "]").change();
                });
                var formdataFields = $("[id^=itemTableFormPanel]").find("[data-field-name^=form" + tblName + "-]");
                formdataFields.each(function (index, control) {
                    var name = $(control).attr("data-field-name").replace("form" + tblName, tblName) + "-" + selectKey;
                    var valCtl = $(control).val();
                    var isCheckBox = $(control).parent().hasClass("checkbox-wrapper");
                    if (isCheckBox && (valCtl == "" || valCtl == undefined || valCtl == null || !$(control).is(':checked'))) {
                        valCtl = "off";
                    }
                    if ($("[data-field-name=" + name + "]").length > 0) {
                        $("[data-field-name=" + name + "]").attr("value", valCtl);
                        if ($("[data-field-name=" + name + "]")[0].hasAttribute("readonly")) {
                            $("[data-field-name=" + name + "]").removeAttr("readonly").val(valCtl)
                                .attr("readonly", true);
                        } else {
                            if ($("[data-field-name=" + name + "]").hasClass("money") || $("[data-field-name=" + name + "]")[0].hasAttribute("data-number-type")) {
                                var vall = $(control).val().replaceAll(' ', '');
                                $("[data-field-name=" + name + "]").autoNumeric('set', vall);
                            }
                            $("[data-field-name=" + name + "]").val(valCtl);
                        }
                        $("[data-field-name=" + name + "]").parent().find(".show-dict-btn").trigger("DicItemSelected", selectedItemPayload);
                        $("[data-field-name=" + name + "]").change();
                    }
                });


            }

        });


        //var formdataUls = $("[id^=itemTableFormPanel]").find("ul[name^=form" + tblName+"-]");
        //formdataUls.each(function (index, control) {
        //    var name = $(control).attr("name").replace("form" + tblName, tblName);
        //    if ($("ul[name^=" + name + "]").length > 0) {
        //        $("ul[name^=" + name + "]")[0].outerHTML = $(control)[0].outerHTML.replaceAll("form" + tblName, tblName);
        //    }
        //});
        closeWin();

    }

    function showModalWindow() {

        itemForm = Ext.create('Ext.panel.Panel',
            {
                id: 'itemTableFormPanel' + uniqId,
                minHeight: 160,
                maxHeight: 160,
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


        var windowDefaultMinWidth = 350;
        var windowDefaultMinHeight = 750;

        win = Ext.create('widget.window',
            {
                title: 'Редактирование таблицы',
                header: {
                    titleAlign: 'center'
                },
                closable: false,
                id: 'TableWind' + uniqId,
                closeAction: 'destroy',
                maximizable: false,
                width: panelWidth,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                monitorResize: false,
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
