$(document).ready(function () {

    // Выдранный кусок кода из inputmask extensions datetime для маски года
    // Почему-то такой маски по-умочанию нет. https://github.com/RobinHerbots/Inputmask/blob/3.x/README_date.md
    // Возможно стоит вынести в другое место при инициализации inputmask, но пока нигде больше не нужно
    Inputmask.extendAliases({
        "yyyy": {
            mask: "y",
            placeholder: "ГГГГ",
            yearrange: {
                minyear: 1900,
                maxyear: 2099
            },
            isInYearRange: function (chrs, minyear, maxyear) {
                if (isNaN(chrs)) return false;
                var enteredyear = parseInt(chrs.concat(minyear.toString().slice(chrs.length)));
                var enteredyear2 = parseInt(chrs.concat(maxyear.toString().slice(chrs.length)));
                return (!isNaN(enteredyear) ? minyear <= enteredyear && enteredyear <= maxyear : false) ||
					(!isNaN(enteredyear2) ? minyear <= enteredyear2 && enteredyear2 <= maxyear : false);
            },
            determinebaseyear: function (minyear, maxyear, hint) {
                var currentyear = (new Date()).getFullYear();
                if (minyear > currentyear) return minyear;
                if (maxyear < currentyear) {
                    var maxYearPrefix = maxyear.toString().slice(0, 2);
                    var maxYearPostfix = maxyear.toString().slice(2, 4);
                    while (maxyear < maxYearPrefix + hint) {
                        maxYearPrefix--;
                    }
                    var maxxYear = maxYearPrefix + maxYearPostfix;
                    return minyear > maxxYear ? minyear : maxxYear;
                }
                if (minyear <= currentyear && currentyear <= maxyear) {
                    var currentYearPrefix = currentyear.toString().slice(0, 2);
                    while (maxyear < currentYearPrefix + hint) {
                        currentYearPrefix--;
                    }
                    var currentYearAndHint = currentYearPrefix + hint;
                    return currentYearAndHint < minyear ? minyear : currentYearAndHint;
                }
                return currentyear;
            },
            definitions: {
                "y": {
                    validator: function (chrs, maskset, pos, strict, opts) {
                        return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                    },
                    cardinality: 4,
                    prevalidator: [
                        {
                            validator: function (chrs, maskset, pos, strict, opts) {
                                var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                                if (!strict && !isValid) {
                                    var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 1);

                                    isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                                    if (isValid) {
                                        maskset.buffer[pos++] = yearPrefix.charAt(0);
                                        return {
                                            "pos": pos
                                        };
                                    }
                                    yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 2);

                                    isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                                    if (isValid) {
                                        maskset.buffer[pos++] = yearPrefix.charAt(0);
                                        maskset.buffer[pos++] = yearPrefix.charAt(1);
                                        return {
                                            "pos": pos
                                        };
                                    }
                                }
                                return isValid;
                            },
                            cardinality: 1
                        },
                        {
                            validator: function (chrs, maskset, pos, strict, opts) {
                                var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                                if (!strict && !isValid) {
                                    var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2);

                                    isValid = opts.isInYearRange(chrs[0] + yearPrefix[1] + chrs[1], opts.yearrange.minyear, opts.yearrange.maxyear);
                                    if (isValid) {
                                        maskset.buffer[pos++] = yearPrefix.charAt(1);
                                        return {
                                            "pos": pos
                                        };
                                    }

                                    yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2);
                                    isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                                    if (isValid) {
                                        maskset.buffer[pos - 1] = yearPrefix.charAt(0);
                                        maskset.buffer[pos++] = yearPrefix.charAt(1);
                                        maskset.buffer[pos++] = chrs.charAt(0);
                                        return {
                                            "refreshFromBuffer": {
                                                start: pos - 3,
                                                end: pos
                                            },
                                            "pos": pos
                                        };
                                    }
                                }
                                return isValid;
                            },
                            cardinality: 2
                        },
                        {
                            validator: function (chrs, maskset, pos, strict, opts) {
                                return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                            },
                            cardinality: 3
                        }]
                }
            },
            insertMode: false,
            autoUnmask: false
        }
    });
    
    var godzak = $("[name='godzak']");
    godzak.attr("data-parsley-range", "[1900, 2099]");
    $("[name='godzak']").inputmask("yyyy");
});