/** получить ид элемента справочника со значеним name
	* dictionary название словаря
	* name - название искомого элемента словаря
	* success - обработчик успешного выполнения
	* error - обработчик ошибки
*/
function getDictionaryItemIdByName(dictionary, name, success, error) {
    $.ajax({
        url: getAbsoluteUrl("Dictionary/GetDataIdByName"),
        type: "POST",
        data: { dictionaryName: dictionary, name: name },
        success: function (data) {
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown);
            error(errorThrown);
        }
    });
}

/** для выбранного словарного поля получить ид записи с таким же названием из другого словаря и записать его в поле, которое используется для фильтрации при выборе из уровня ниже
	* 
	* sourceDictionaryField - поле, значение из которого ищется в другом словаре
	* targetDictionaryField - поле, в которое необходимо записать найденное ид
*/
function copyDictionaryValue(sourceDictionaryField, targetDictionaryField) {
    var sourceValue = sourceDictionaryField.val();              // искомое значение
    var dictionaryName = $("#" + targetDictionaryField.attr('name')).attr("data-dict-name");    // словарь, в котором ищем

    var button = $("button[parent-id=" + targetDictionaryField.attr("name") + "]");

    button.prop("disabled", true);
    getDictionaryItemIdByName(dictionaryName, sourceValue,
        function (data) {
            var targetField = targetDictionaryField.next(); // поле, куда надо записывать полученное ид
            if (data.error !== undefined) {     // ошибка при получении ид из словаря
                console.error(data.error);

                targetField.val("-1");          // записываем заведомо несуществующее id, чтобы при выборе из следующего уровня в другом поле не было значений для выбора
            } else {
                targetField.val(data.data);
            }

            button.prop("disabled", false);
        },
        function (data) {
            console.log(data);
            button.prop("disabled", false);
        });

    targetDictionaryField.change();
}


function findDictionaryItemByKey(dictionaryName, name, level, success, error) {
    $.ajax({
        url: getAbsoluteUrl("Dictionary/FindDictionaryItemByKey"),
        type: "POST",
        data: { dictionaryName: dictionaryName, name: name, level: level },
        success: function (data) {
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            error(errorThrown);
        }
    });
}

function findDictionaryItemByAttribute(dictionaryName, attributeName, attributeValue, level, success, error) {
    $.ajax({
        url: getAbsoluteUrl("Dictionary/FindDictionaryItemByAttribute"),
        type: "POST",
        data: { dictionaryName: dictionaryName, attributeName: attributeName, attributeValue: attributeValue, level: level },
        success: function (data) {
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            error(errorThrown);
        }
    });
}

function findDictionaryItemsByAttribute(dictionaryName, attributeName, attributeValue, level, success, error) {
    $.ajax({
        url: getAbsoluteUrl("Dictionary/FindDictionaryItemsByAttribute"),
        type: "POST",
        data: { dictionaryName: dictionaryName, attributeName: attributeName, attributeValue: attributeValue, level: level },
        success: function (data) {
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            error(errorThrown);
        }
    });
}

/* получить элементы словаря
	* dictionaryName название словаря
	* subDicName название подсловаря
	* parentItemId - родительский элемент
	* level - уровень
	* fields - какие поля грузить
	* successCallback - обработчик успешного выполнения
	* errorCalback - обработчик ошибки
*/

function getDictionaryItems(dictionaryName, subDicName, parentItemId, level, fields, successCallback, errorCalback) {
    if (!dictionaryName) {
        console.info("не задано имя словаря, getDictionaryItemChildren");
        return;
    }

    if (!Array.isArray(fields) || fields.length == 0) {
        console.info("не заданы поля, getDictionaryItemChildren");
        return;
    }

    var dicFields = [],
        l = fields.length;

    for (var i = 0; i < l; i++) {
        var current = fields[i];
        dicFields.push({
            DictColumnName: current,
            EditName: i
        });
    }

    var postData = {
        DictionaryFieldInfoList: dicFields
    };

    var encodedFields = encodeURI("&dictFieldsInfo=" + JSON.stringify(postData));

    var url = "Dictionary/GetJson?dictionaryName=" + dictionaryName
        + "&showCodeColumn=False" + "&subDictionaries=" + subDicName
        + "&selectionLevel=" + level + "&parentId=" + parentItemId
        + "&selectionStartLevel=";

    url = encodeURI(url);

    $.ajax({
        url: getAbsoluteUrl(url),
        type: "POST",
        data: encodedFields,
        success: function (repsonse) {
            if (repsonse.data) {
                var data = JSON.parse(repsonse.data);
                if (successCallback)
                    successCallback(data);



            } else if (repsonse.error) {
                console.log(repsonse);
                if (errorCalback)
                    errorCalback(repsonse.error)
            } else {
                console.log(repsonse);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            showCommonErrors(errorThrown);
            if (errorCalback)
                errorCalback(textStatus);
        }
    });
}

/* получить дочерние элементы  элементов словаря
	* dictionaryName название словаря
	* subDicName название подсловаря
	* dicItemIds - массив id'шников для кого получаем детей
	* childLevel - уровень
	* fields - какие поля грузить
	* successCallback - обработчик успешного выполнения
	* errorCalback - обработчик ошибки
*/
function getDictionaryItemsChildren(dictionaryName, subDicName, dicItemIds, childLevel, fields, successCallback, errorCalback) {
    if (!dictionaryName) {
        console.info("не задано имя словаря, getDictionaryItemsChildren");
        return;
    }

    if (!Array.isArray(dicItemIds) || dicItemIds.length == 0) {
        console.info("не задан идентификаторы элементов словаря, getDictionaryItemsChildren");
        return;
    }

    if (!childLevel) {
        console.info("не задан уровень вложености, getDictionaryItemsChildren");
        return;
    }

    if (!Array.isArray(fields) || fields.length == 0) {
        console.info("не заданы поля, getDictionaryItemsChildren");
        return;
    }

    var result = {};

    var getDictionaryItemsPromise = function (dictionaryName, subDicName, dicItemId, childLevel, fields) {
        var dfd = jQuery.Deferred();
        getDictionaryItems(dictionaryName, subDicName, dicItemId, childLevel, fields, function (response) {
            result[dicItemId] = response;
            dfd.resolve();
        }, function (error) {
            dfd.reject(errorThrown);
        });
        return dfd.promise();
    };

    var promises = [];
    var l = dicItemIds.length;
    for (var i = 0; i < l; i++) {
        var current = dicItemIds[i];
        promises.push(getDictionaryItemsPromise(dictionaryName, subDicName, current, childLevel, fields));
    }

    $.when.apply($, promises).then(function () {
        successCallback(result);
    }, function (error) {
        errorCalback(error);
    });
}

function getParentFor(dictionaryName, itemId) {

    var url = getRelativeUrl("/Dictionary/GetParentFor");
    url += "?dictionaryName=" + encodeURIComponent(dictionaryName) + "&itemId=" + itemId;

    var defer = jQuery.Deferred();
    $.ajax({
        url: url,
        type: 'GET',
        contentType: false,
        cache: false,
        processData: false,
    }).then(function (response) {
        var data = JSON.parse(response);
        if (data.status === "OK") {
            var data = JSON.parse(data.responseMessage);
            defer.resolve(data);
        } else {
            showCommonErrors([data.responseMessage]);
            defer.reject(data.responseMessage);
        }
    }, function (error) {
        console.log(response);
    });

    return defer.promise();
}

//модуль для упрощения работы с псевдосправочниками
var FormDictionaryHelperModule = (function () {

    function getFormDictionaryItemsIds(formdataDictKey, dictFieldsInfo, formValues, success, error) {
        var docIdObj = parseInt(window.location.pathname.split('/').pop());
        var docIdStr = isNaN(docIdObj) ? '' : docIdObj;

        $.ajax({
            url: getAbsoluteUrl("FormdataDict/GetJson"),
            type: "POST",
            data: { formdataDictKey: formdataDictKey, formValues: formValues, dictFieldsInfo: dictFieldsInfo, documentKey : docIdStr },
            success: function (data) {
                success(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //console.log(errorThrown);
                error(errorThrown);
            }
        });
    }

    function getIdArrayFromFormDictionary(dictName, idColumnName, dictFieldsInfo, formValues, success, error) {
        getFormDictionaryItemsIds(dictName,
            dictFieldsInfo,
            formValues,
            function (data) {
                try {
                    var parsedResponseChildren = JSON.parse(data.data).children;
                    var ids = [];
                    for (var i = 0; i < parsedResponseChildren.length; i++) {
                        ids.push(parsedResponseChildren[i][idColumnName]);
                    }
                    success(ids);
                }
                catch (e) {
                    error(e);
                }
            },
            error);
    }

    return {
        getFormDictionaryItemsIds: getFormDictionaryItemsIds,
        getIdArrayFromFormDictionary: getIdArrayFromFormDictionary,
    }
})();