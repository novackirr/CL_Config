"use strict";

window.Parsley.addValidator("okpo",
{
    validateString: function(value) {
        // Это не ОКПО
        if (value.length !== 8 && value.length !== 10) {
            return false;
        }
        return true;
        /*

        var lastchar = value.length - 1;

        var calcChecksum = function(start) {
            var sum = null;

            for (var i = 0; i < lastchar; i++) {
                sum += (i + start) * value.charAt(i);
            }

            return sum % 11;
        };
        var checksum = null;
        checksum = calcChecksum(1);

        if (checksum != 10) {
            if (checksum == value.charAt(lastchar)) {
                return true;
            } else {
                return false;
            }
        }

        // Если контрольная цифра равна 10 
        // то нужно сдвинуть точку отсчета на 2 и пересчитать сумму
        checksum = calcChecksum(3);

        // Если второй раз получилось 10, то контрольное число - 0
        if (checksum == 10) {
            checksum = 0;
        }

        if (checksum == charAt(lastchar)) {
            return true;
        } else {
            return false;
        }*/
    },
    messages: {
        ru: "Введенное значение не является корректным ОКПО"
    }
});

window.Parsley.addValidator("okopf",
{
    validateString: function(value) {
        return /^[0-9]{2,5}$/.test(value);
    },
    messages: {
        ru: "Введенное значение не является корректным ОКОПФ"
    }
});

window.Parsley.addValidator("kpp",
{
    validateString: function(value) {
        return /^[0-9]{4}[0-9]{2}[0-9]{3}$/.test(value);
    },
    messages: {
        ru: "Введенное значение не является корректным КПП"
    }
});
window.Parsley.addValidator("inn",
{
    validateString: function (value) {
        var withoutLowDash = value.replace(/_*/g, '');
        // ИНН 10 знаков, ЮЛ
        if (withoutLowDash.length === 10) {
            // Формула расчета контрольной цифры ИНН для 10 знаков 
            /*var n1 =
                ((2 * value.charAt(0) +
                  4 * value.charAt(1) +
                 10 * value.charAt(2) +
                  3 * value.charAt(3) +
                  5 * value.charAt(4) +
                  9 * value.charAt(5) +
                  4 * value.charAt(6) +
                  6 * value.charAt(7) +
                  8 * value.charAt(8)) % 11) % 10;

            if (value.charAt(9) != n1) {
                return false;
            }*/
            return true;

            // ИНН 12 знаков, ИП
        } else if (withoutLowDash.length === 12) {
            // Формула расчета контрольной цифры ИНН для 12 знаков
            // Первое контрольное число
            /*var n2 =
                ((7 * value.charAt(0) +
                  2 * value.charAt(1) +
                  4 * value.charAt(2) +
                 10 * value.charAt(3) +
                  3 * value.charAt(4) +
                  5 * value.charAt(5) +
                  9 * value.charAt(6) +
                  4 * value.charAt(7) +
                  6 * value.charAt(8) +
                  8 * value.charAt(9)) % 11) % 10;

            // Второе контрольное число
            var n1 =
                ((3 * value.charAt(0) +
                  7 * value.charAt(1) +
                  2 * value.charAt(2) +
                  4 * value.charAt(3) +
                 10 * value.charAt(4) +
                  3 * value.charAt(5) +
                  5 * value.charAt(6) +
                  9 * value.charAt(7) +
                  4 * value.charAt(8) +
                  6 * value.charAt(9) +
                  8 * value.charAt(10)) % 11) % 10;

            if (value.charAt(10) != n2 && value.charAt(11) != n1) {
                return false;
            }*/

            return true;

            // Это не ИНН
        } else {
            return false;
        }
    },
    messages: {
        ru: "Введенное значение не является корректным ИНН юридического лица"
    }
});

window.Parsley.addValidator("ogrn",
{
    validateString: function(value) {
        // Длина ОГРН - всегда 13 символов
        if (value.length !== 13) {
            return false;
        }
        /*
        // Первая цифра ОГРН всегда 1 или 5
        var char0 = value.charAt(0);
        if (char0 != 1 && char0 != 5) {
            return false;
        }

        // Две последние цифры года могут быть от 00 до 99
        var char1and2 = value.charAt(1) + value.charAt(2);
        if (char1and2 < 0 || char1and2 > 99) {
            return false;
        }

        // Контрольное число, младший разряд остатка от деления
        // предыдущего 12-значного числа на 11, если остаток от деления равен 10,
        // то контрольное число равно 0.
        var char12 = value.charAt(12);
        var char0to11 = value.substring(0, 12);
        var checksum = char0to11 % 11;

        if (checksum == 10) {
            if (char12 != 0) {
                return false;
            } else {
                return true;
            }
        }

        if (checksum != char12) {
            return false;
        }
        */
        return true;
    },
    messages: {
        ru: "Введенное значение не является корректным ОГРН"
    }
});

window.Parsley.addValidator('time', {
    validateString: function (value) {
        var date = new Date();
        var time = value.split(":");
        var fDate = new Date(date.getFullYear(), date.getMonth(), date.getUTCDate(), time[0], time[1], time[2]);
        return !isNaN(fDate.getDate());
    },
    messages: {
        en: 'This string is not a date',
        ru: "Некорректный формат даты"
    }
});

window.Parsley.addValidator('datetime', {
    validateString: function (value) {
        var dateTime = value.split(" ");
        var date = dateTime[0].split(".");

        //Обработка случая с пустым временем. Такие случаи есть и должны обрабатываться корректно
        var time = [0, 0, 0];
        if (dateTime[1]) {
            time = dateTime[1].split(":");
        }

        var fDate = new Date(date[2], date[1] - 1, date[0], time[0], time[1], time[2]);
        return !isNaN(fDate.getDate());
    },
    messages: {
        en: 'This string is not a date',
        ru: "Некорректный формат даты"
    }
});

window.Parsley.addValidator('nosecdatetime', {
    validateString: function (value) {
        var dateTime = value.split(" ");
        var date = dateTime[0].split(".");

        //Обработка случая с пустым временем. 
        var time = [0, 0, 0];
        if (dateTime[1]) {
            var timeParsed = dateTime[1].split(":");
            time[0] = timeParsed[0];
            time[1] = timeParsed[1];
        }

        var fDate = new Date(date[2], date[1] - 1, date[0], time[0], time[1], time[2]);
        return !isNaN(fDate.getDate());
    },
    messages: {
        en: 'This string is not a date',
        ru: "Некорректный формат даты"
    }
});

window.Parsley.addValidator('date', {
    validateString: function (value) {
        var from = value.split(".");
        var fDate = new Date(from[2], from[1] - 1, from[0]);
        return !isNaN(fDate.getDate());
    },
    messages: {
        en: 'This string is not a date',
        ru: "Некорректный формат даты"
    }
});

window.Parsley.addValidator("phone",
{
    validateString: function(value) {
        return /^[0-9]{5,18}$/.test(value);
    },
    messages: {
        ru: "Введенное значение не является корректным телефонным номером"
    }
});

window.Parsley.addValidator('autocomplete', {
    validateString: function(value, requirement) {
        var datalist = $("datalist[id='" + requirement + "']");
        var values = $.map(datalist.children(), function(v) {
            return $(v).attr("value");
        });

        return $.inArray(value, values) !== -1;
    },
    messages:
        {
            ru: "Выбранное значение отсутствует в словаре"
        }
});

window.Parsley.addValidator('multiselect', {
    validateMultiple: function (values) {
        return values && values.length > 0 && values[values.length - 1].length > 0;
    },
    messages:
    {
        ru: "Выберите минимум одно значение"
    }
});

window.Parsley.addValidator('extension', {
    validateString: function (value, requirement, el) {

        if (requirement) {

            var elm = el.$element;
            var origVal = elm.data("original-value");
            var origExt = "";
            if (origVal)
                origExt = origVal.substring(origVal.lastIndexOf('.') + 1, origVal.length);

            var ext = "";
            if (value)
                ext = value.substring(value.lastIndexOf('.') + 1, value.length);            

            if ((origExt && !ext) || (origExt && ext && origExt.toLowerCase() !== ext.toLowerCase())) {

                var parent = elm.parent();                
                if (!parent.hasClass("visible-validator"))
                    parent.addClass("visible-validator");
                
                return false;
            }
        }

        return true;   
    },
    messages:
    {
        ru: "Введите корректное расширение файла"
    }
});