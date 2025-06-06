; (function ($) {

    var chronoGroups = function () {
        var onSetDateGroupRestrict = false,
            dateGroups = [],
            timeGroups = [];

        chronoGroups.SetMaximum = setMaximum;
        chronoGroups.SetMinimum = setMinimum;

        chronoGroups.Init = function () {

            onSetDateGroupRestrict = true;

            try {
                this.Clear();
                initDateGroups();
                initTimeGroups();
            } finally {
                onSetDateGroupRestrict = false;
            }
        };

        chronoGroups.Clear = function () {
            var groupName;
            for (groupName in dateGroups)
                if (dateGroups.hasOwnProperty(groupName))
                    clearGroup(dateGroups[groupName]);

            dateGroups = [];

            for (groupName in timeGroups)
                if (timeGroups.hasOwnProperty(groupName))
                    clearGroup(timeGroups[groupName]);

            timeGroups = [];
        };

        chronoGroups.ResetPickers = function() {
            var groupName;
            for (groupName in dateGroups) {
                if (dateGroups.hasOwnProperty(groupName)) {
                    dateGroups[groupName].indexes.forEach(function(index) {
                        index.elements.forEach(function(element) {
                            var picker = getPicker(element);
                            picker.clear();
                        })
                    });
                }
            }
        };

        function clearGroup(group) {
            if (group.indexes) {
                group.indexes.forEach(clearIndex);
            }
            group.indexes = null;
            group = null;
        };

        function clearIndex(index) {
            if (index.elements) {
                index.elements.forEach(clearElement);
            }
            index.elements = null;
            index.group = null;
            index.id = null;
            index = null;
        };

        function clearElement(element) {
            setMaximum(element, false);
            setMinimum(element, false);
            element.off("dp.change", setDateGroupRestrict);
            element.removeData("ChronoDateGroups");
            element = null;
        };

        function initDateGroups() {
            var dateControls = $("div.input-group.date[data-dg-group][data-dg-index][data-type='date']")
                .add("div.input-group.date[data-dg-group][data-dg-index][data-type='datetime']")
                .add("div.input-group.date[data-dg-group][data-dg-index][data-type='nosecdatetime']");
            fillGroups(dateGroups, dateControls);
        };

        function initTimeGroups() {
            var timeControls = $("div.input-group.date[data-type='time'][data-dg-group][data-dg-index]");
            fillGroups(timeGroups, timeControls);
        };

        function fillGroups(groupList, controls) {
            controls.on("dp.change", setDateGroupRestrict);
            controls.each(function () {

                var groupId = attrGroupId(this);
                var indexId = attrIndexId(this);
                if (!groupId || !indexId)
                    return;

                var group = groupList[groupId];

                if (!group)
                    group = groupList[groupId] = {
                        indexes: []
                    };

                var index = group.indexes[indexId];
                if (!index)
                    index = group.indexes[indexId] = {
                        id: indexId,
                        group: group,
                        elements: [],
                        minRestrictElement: null,
                        maxRestrictElement: null,
                        elementForPrev: null,
                        elementForNext: null,
                        innerForPrev: null,
                        innerForNext: null,
                        prevIndex: null,
                        nextIndex: null,
                        needCalc: true,
                        CalcRestricts: calcIndexRestrict,
                        SetMinimum: setIndexMinimum,
                        SetMaximum: setIndexMaximum
                    };

                var jqEl = $(this);
                index.elements.push(jqEl);
                setDefaultChronoData(group, index, jqEl);
            });

            for (var groupId in groupList)
                if (groupList.hasOwnProperty(groupId))
                    initGroup(groupList[groupId]);
        };

        function setDefaultChronoData(group, index, jqEl) {
            jqEl.data("ChronoDateGroups",
                {
                    group: group,
                    index: index,
                    indexId: attrIndexId(jqEl),
                    isDateOnly: jqEl.attr("data-type") === "date",
                    beforeInterval: parseInterval(jqEl.attr("data-dg-before")),
                    afterInterval: parseInterval(jqEl.attr("data-dg-after"))
                });
        };

        function initGroup(group) {

            group.indexes.sort(function (a, b) {
                return a.id - b.id;
            });

            var first = null;
            var last = null;

            group.indexes.forEach(function (index) {

                if (!first)
                    first = index;

                //Создание двусвязного списка, чтобы прокидывать ограничения по цепочке без поиска и сортировки массива индексов группы
                index.prevIndex = last;
                if (last)
                    last.nextIndex = index;
                last = index;

                //Пересчет ограничений внутри индекса
                index.CalcRestricts();
            });

            var actualRestrict = false;

            while (first) {

                first.SetMinimum(actualRestrict);
                if (first.elementForNext)
                    actualRestrict = first.elementForNext;

                first = first.nextIndex;
            }

            actualRestrict = false;
            while (last) {

                last.SetMaximum(actualRestrict);
                if (last.elementForPrev)
                    actualRestrict = last.elementForPrev;

                last = last.prevIndex;
            }
        };

        function setDateGroupRestrict(args) {
            if (onSetDateGroupRestrict)
                return true;

            onSetDateGroupRestrict = true;

            var changedElement = this;
            var index = getIndex(this);
            //console.log(changedElement);
            if (!index) {
                onSetDateGroupRestrict = false;
                return;
            }

            index.needCalc = true;

            try {
                index.CalcRestricts(changedElement, args.date);

                if (index.prevIndex)
                    index.prevIndex.SetMaximum(index.elementForPrev);

                if (index.nextIndex)
                    index.nextIndex.SetMinimum(index.elementForNext);

            } finally {
                onSetDateGroupRestrict = false;
            }
            var picker = getPicker(changedElement);
        };

        function calcIndexRestrict(changedElement, newValue) {

            if (!this.needCalc)
                return;

            if (!newValue)
                newValue = false;

            var nextMinRestrictElement = !newValue ? null : $(changedElement);
            var prevMaxRestrictElement = !newValue ? null : $(changedElement);
            var minRestrict = newValue;
            var maxRestrict = newValue;

            this.elements.forEach(function (element) {

                var currDate = getDate(element);
                if (element[0] === changedElement || !currDate)
                    return;

                var after = getAfter(element);
                var before = getBefore(element);

                var currMinRestrict = after ? currDate.clone().add(after.value, after.key) : currDate;
                var currMaxRestrict = before ? currDate.clone().add(before.value, before.key) : currDate;

                if (!minRestrict || minRestrict.isBefore(currMinRestrict)) {
                    minRestrict = currMinRestrict;
                    nextMinRestrictElement = $(element);
                }

                if (!maxRestrict || maximumUpdateCondition(element, currMaxRestrict, prevMaxRestrictElement, maxRestrict)) {
                    maxRestrict = currMaxRestrict;
                    prevMaxRestrictElement = $(element);
                }
            });

            this.innerForPrev = prevMaxRestrictElement;
            this.innerForNext = nextMinRestrictElement;

            if (substituteCondition(nextMinRestrictElement, this.minRestrictElement)) {
                nextMinRestrictElement = this.minRestrictElement;
            }

            if (substituteCondition(prevMaxRestrictElement, this.maxRestrictElement)) {
                prevMaxRestrictElement = this.maxRestrictElement;
            }

            this.elementForPrev = prevMaxRestrictElement;
            this.elementForNext = nextMinRestrictElement;

            this.needCalc = false;
        };

        function setIndexMinimum(restrictElement) {

            this.minRestrictElement = restrictElement;
            var hasVal = false;

            this.elements.forEach(function (element) {
                hasVal |= getDate(element);
                chronoGroups.SetMinimum(element, restrictElement);
            });

            if (!this.nextIndex)
                return;

            if (!hasVal || substituteCondition(this.innerForNext, restrictElement)) {
                this.elementForNext = restrictElement;
                this.nextIndex.SetMinimum(restrictElement);
            } else if (this.innerForNext !== this.elementForNext) {
                this.elementForNext = this.innerForNext;
                this.nextIndex.SetMinimum(this.innerForNext);
            }
        };

        function setIndexMaximum(restrictElement) {

            this.maxRestrictElement = restrictElement;
            var hasVal = false;

            this.elements.forEach(function (element) {
                hasVal |= getDate(element);
                chronoGroups.SetMaximum(element, restrictElement);
            });

            if (!this.prevIndex)
                return;

            if (!hasVal || substituteCondition(this.innerForPrev, restrictElement)) {
                this.elementForPrev = restrictElement;
                this.prevIndex.SetMaximum(restrictElement);
            } else if (this.innerForPrev !== this.elementForPrev) {
                this.elementForPrev = this.innerForPrev;
                this.prevIndex.SetMaximum(this.innerForPrev);
            }
        };

        function setMinimum(jqElement, restrictElement) {
            var picker = getPicker(jqElement);

            if (!restrictElement) {
                if (picker) {
                    picker.minDate(false);
                }
                else {
                    //console.log(jqElement);
                }
                return;
            }

            var isEmpty = !picker.date();
            var restrictAfter = convertToDuration(getAfter(restrictElement));

            var additionalTime = convertToDuration(getBefore(jqElement));
            if (!additionalTime)
                additionalTime = restrictAfter;
            if (additionalTime && additionalTime < restrictAfter)
                additionalTime = restrictAfter;

            var restrictPicker = getPicker(restrictElement);
            var restrictDate = getIsDate(jqElement) ? restrictPicker.date().startOf("day") : restrictPicker.date();

            if (additionalTime && restrictDate)
                restrictDate.add(additionalTime);

            try {
                if(additionalTime == null){
                    restrictDate
                }
                picker.minDate(restrictDate);
            } catch (e) {
                console.log(jqElement[0]);
                console.log("Ошибка установки максимального значения! Подробности: " + e.message);
            }

            if (isEmpty){
                picker.clear();
            }
        };

        function setMaximum(jqElement, restrictElement) {
            var picker = getPicker(jqElement);

            if (!restrictElement) {
                if (picker) {
                    picker.maxDate(false);
                } else {
                    //console.log(jqElement);
                }
                return;
            }

            var isEmpty = !picker.date();
            var restrictBefore = convertToDuration(getBefore(restrictElement));

            var additionalTime = convertToDuration(getAfter(jqElement));
            if (!additionalTime)
                additionalTime = restrictBefore;
            if (additionalTime && additionalTime < restrictBefore)
                additionalTime = restrictBefore;

            var restrictPicker = getPicker(restrictElement);
            var restrictDate = getIsDate(jqElement)
                ? restrictPicker.date().endOf("day")
                : restrictPicker.date();

            if (additionalTime && restrictDate)
                restrictDate.subtract(additionalTime);

            try {
                picker.maxDate(restrictDate);
            } catch (e) {
                console.log(jqElement[0]);
                console.log("Ошибка установки максимального значения! Подробности: " + e.message);
            }

            if (isEmpty) {
                picker.clear();
            }

        };

        function maximumUpdateCondition(element, currentDate, nextElementValue, nextDate) {
            return !nextDate.isSame(currentDate, "day") && nextDate.isAfter(currentDate) ||
                !getIsDate(nextElementValue) && !getIsDate(element) && nextDate.isAfter(currentDate) ||
                nextDate.isSame(currentDate, "day") && !getIsDate(element);
        };

        function substituteCondition(element, substitute) {
            return !element
                || getIsEqualsDay(element, substitute)
                && getIsDate(element)
                && !getIsDate(substitute);
        }

        function attrGroupId(element) {
            return $(element).attr("data-dg-group");
        };

        function attrIndexId(element) {
            return parseInt($(element).attr("data-dg-index"));
        };

        function getPicker(element) {
            return $(element).data("DateTimePicker");
        };

        function getDate(element) {
            return getPicker(element).date();
        }

        function getIndex(element) {
            return getChronoData(element).index;
        };

        function getBefore(element) {
            return getChronoData(element).beforeInterval;
        };

        function getAfter(element) {
            return getChronoData(element).afterInterval;
        };

        function getIsDate(element) {
            return getChronoData(element).isDateOnly;
        };

        function parseInterval(strInterval) {
            if (!strInterval)
                return null;

            var key = strInterval.match(/[yQMwdhms]+/);
            key = key && key.length > 0 ? key[0] : null;

            var value = strInterval.match(/\d+/);
            value = value && value.length > 0 ? parseInt(value[0]) : null;

            if (!key && !value)
                return null;

            if (!key && value) { key = "d"; }
            if (key && !value) { value = 1; }

            return { key: key, value: value };
        };

        function convertToDuration(interval) {
            if (!interval || !interval.value || !interval.key)
                return null;

            return moment.duration(interval.value, interval.key);
        };

        function getIsEqualsDay(el1, el2) {
            if (!el1 || !el2)
                return false;

            var date1 = getDate(el1),
                date2 = getDate(el2);

            return date1 && date2 && date1.isSame(date2, "day");
        };

        function getChronoData(element) {
            return $(element).data("ChronoDateGroups");
        };
    };

    chronoGroups();
    window.ChronoGroups = chronoGroups;
})($);