"use strict";

var MultiplicationFields = function () 
{	
    var firstFieldValue = parseFloat($("input[data-field-name='price']").val()) || 0; // поле1
    var secondFieldValue = parseFloat($("input[data-field-name='tax']").val()) || 0; // поле2
    var targetFieldValue = $("input[data-field-name='int4']"); // Числовое поле 4


    targetFieldValue.val(firstFieldValue * secondFieldValue);
};

var CheckBoolFields = function () {
    var ValidateBooleans = function () {
        var bool2 = $("input[data-field-name='bool2']").is(':checked'); // логическое поле 2, проверка
        var bool3 = $("input[data-field-name='bool3']").is(':checked'); // логическое поле 3, проверка 
        var result = true;

        if (!bool2 && !bool3) {
            result = false;
        };
        return result;
    };

    var form = $("form");
    form.on("beforeSubmit", function (args) {
        $(".loading-image.loading-image-shown").show(); // на время вычисления визуализировать ожидание
        if(ValidateBooleans()) return; // вызов функции проверки суммы полей на соответствие 100
        var errorMessage = "Должно быть выбрано одно из логических полей: логическое поле 2 или логическое поле 3."
        showCommonErrors(errorMessage); // вывод сообщения об ошибке
        $(".loading-image.loading-image-shown").hide(); // скрыть визуальный эффект ожидания
        $(".btn-toolbar > .btn").attr("disabled", false); // деактивировать кнопку
        form.find("[type='submit']").attr("disabled", false); 
        throw new Error("beforeSave"); // обработать исключение
    });
};

// Функция  выбора только одно из полей ЛП2 или ЛП3
var MarkOnlyOneBool = function () {
    var bool2 = $("input[data-field-name='bool2']"); // логическое поле 2
    var bool3 = $("input[data-field-name='bool3']"); // логическое поле 3

    // Взаимное исключение
    bool2.on('change', function () {
        if ($(this).is(':checked')) {
            bool3.prop('checked', false);
        }
    });

    bool3.on('change', function () {
        if ($(this).is(':checked')) {
            bool2.prop('checked', false);
        } else if (!bool2.is(':checked')) {
            $(this).prop('checked', true);
        }
    });
};

var RedactFieldValue = function () {
    var bool2 = $("input[data-field-name='bool2']"); // логическое поле 2
    var bool3 = $("input[data-field-name='bool3']"); // логическое поле 3
    var targetRedactField = $("input[data-field-name='text5']"); // текстовое поле 5
    
    bool2.on('change', function () {
        if ($(this).is(':checked')) {
            targetRedactField.val('Значение 1');
        }
    });

    bool3.on('change', function () {
        if ($(this).is(':checked')) {
            targetRedactField.val('Значение 2');
        } else if (!bool2.is(':checked')) {
            targetRedactField.val('Значение 1');
        }
    });
};

var ShowHideAddressFields = function () {
    var bool2 = $("input[data-field-name='bool2']"); // логическое поле 2
    var bool3 = $("input[data-field-name='bool3']"); // логическое поле 3
    var targetField = $("input[data-field-name='сoncordant']"); // поле с выбором из адресной книги "Согласующий"
    var targetButton = $("button[name='сoncordant']");

    var ShowTargetField = function (target, button) {
        target.show();
        button.show();
        target.prop("required", true);	// сделать поле обязательным
        $("[data-related-field=otherTreb]").addClass("label-required");	// отображаем красную * для заголовка поля, чтобы сделать его визуально обязательным
    };
    
    var HideTargetField = function (target, button) {
        target.hide();
        button.hide();
        target.val('');	// очистить поле
        target.prop("required", false); // снять обязательность поле, иначе документ не сохранится (будет скрытое обязательное поле)
        $("[data-related-field=otherTreb]").removeClass("label-required");	// скрываем красную * для заголовка поля, чтобы убрать визуально обязательность
    };

    bool2.on('change', function () {
        if ($(this).is(':checked')) {
            ShowTargetField(targetField, targetButton);
        }
    });

    bool3.on('change', function () {
        if ($(this).is(':checked')) {
            HideTargetField(targetField, targetButton);
        } else if (!bool2.is(':checked')) {
            ShowTargetField(targetField, targetButton);
        }
    });
};

var ShowHideBlock = function () {
    var bool1 = $("input[data-field-name='bool1']"); // логическое поле 1
    var targetTableBlock = $("div[data-name='ItemTab']"); // блок с таблицей 1

    // Скрываем при загрузке страницы
    if (!bool1.is(':checked')) {
            targetTableBlock.closest(".field-group-view").hide();
        };

    bool1.on('change', function () {
        if ($(this).is(':checked')) {
            targetTableBlock.closest(".field-group-view").show();
        } else {
            targetTableBlock.closest(".field-group-view").hide();
        }
    });
};

var UpdateCategoryByPrice = function () {
    var priceField = $("input[data-field-name='price']");
    var categoryField = $("input[data-field-name='category']");

    var updateCategory = function () {
        var priceValue = parseFloat(priceField.val()) || 0;

        if (priceValue < 100000) {
            categoryField.val("Категория 1");
        } else if (priceValue <= 500000) {
            categoryField.val("Категория 2");
        } else {
            categoryField.val("Категория 3");
        }
    };

    // Обновлять при изменении стоимости
    priceField.on('input change', updateCategory);

    // Вызов при загрузке, чтобы сразу проставить значение
    updateCategory();
};

var CreateCategoryField = function () {
    var intField = $("input[data-field-name='price']"); // числовое поле Стоимость
    var targetCategory = $("input[data-field-name='category']"); // текстовое поле Категория

    var updateCategory = function () {
        var intValue = parseInt(intField.val(), 10);
        if (isNaN(intValue)) {
            targetCategory.val(''); // Если значение не число, очистить категорию
            return;
        }

        if (intValue < 100000) {
            targetCategory.val("Категория 1");
        } else if (intValue <= 500000) {
            targetCategory.val("Категория 2");
        } else {
            targetCategory.val("Категория 3");
        }
    };

    // Обновление при изменении стоимости
    intField.on('change', updateCategory);

    // Вызов при загрузке формы (в случаях если автоматически подтягиваются значения)
    updateCategory();
};

var EditReg = function() {
    $("li:has(:contains('Скрытые поля'))").hide();	 
};


scopes.onRegister(EditReg);
scopes.onEdit(EditReg);

// Функция вывода "Стоимость * Налог" в "Числовое поле 4"
$(document).on('change', "input[data-field-name='price'], input[data-field-name='tax']", function () {
    MultiplicationFields();
});

// Функция  выбора только одно из полей ЛП2 или ЛП3
$(document).ready(function () {
    var bool2 = $("input[data-field-name='bool2']"); // логическое поле 2
    var bool3 = $("input[data-field-name='bool3']"); // логическое поле 3

    // Взаимное исключение
    bool2.on('change', function () {
        if ($(this).is(':checked')) {
            bool3.prop('checked', false);
        }
    });

    bool3.on('change', function () {
        if ($(this).is(':checked')) {
            bool2.prop('checked', false);
        } else if (!bool2.is(':checked')) {
            $(this).prop('checked', true);
        }
    });
});


// ЛП - логическое поле, ЧП - числовое поле, ТП = текстовое поле, ПВАК - поля с выбором из адресной книги, 

// Функция проверки выбрано ли хотя бы одно из полей ЛП2 или ЛП3, выдача ошибки при ином
$(document).ready(CheckBoolFields);
// Функция отметки только одного из двух возможных ЛП
$(document).ready(MarkOnlyOneBool);

// Функция заполнения ТП 5 в зависимости от состояния ЛП 2 и ЛП 3
$(document).ready(RedactFieldValue);

// Функция отображения и скрытия ПВАК "Согласующий" в зависимости от состояния ЛП3
$(document).ready(ShowHideAddressFields);

// Функция отображения и скрытия блока в зависимости от состояния ЛП1
$(document).ready(ShowHideBlock);

// Функция заполнения ТП6 категориями в зависимости от ЧП 2 "Стоимость"
$(document).ready(CreateCategoryField);


/* scopes.onView(ConvertTableColumnName); */


