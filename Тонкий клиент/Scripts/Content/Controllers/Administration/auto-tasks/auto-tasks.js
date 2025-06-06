; (function () { }(window.ct = window.ct || {}));

; (function (control, $) {
    var baseUrl = $("#auto-tasks").attr("data-base-url");
    var autoTaskApiService = ct.api.AutoTaskApiService.create(baseUrl);
    createControl($("#auto-tasks-export"), "export");
    createControl($("#auto-tasks-import"), "import");


    function createControl($container, taskType) {
        function onSelectAutoTaskSource(e) {
            var taskDataSource = {
                load: function () {
                    return autoTaskApiService.getAutoTasks(taskType, e.selectedItem.name);
                }
            };
            autoTaskSelectBox.option({ disabled: false, dataSource: taskDataSource });
            autoTaskSelectBox.reset();
        }

        function onSelectAutoTask(e) {
            var disabled = !autoTaskSelectBox.option("value");
            autoTaskRunButton.option("disabled", disabled);
        }

        function runSelectedAutoTask() {
            autoTaskApiService.runAutoTask(autoTaskSelectBox.option("value")).then(
                function (response) {
                    console.log(response);
                    ct.ui.alert("Уведомление", response.statusMessage);
                });
        }


        var $autoTaskSourceSelectBox = $("<div>").dxSelectBox({
            dataSource: {
                load: function() {
                    return autoTaskApiService.getAutoTaskSources(taskType);
                }
            },
            displayExpr: "name",
            placeholder: "Выберите плагин...",
            noDataText: "Нет плагинов для отображения",
            onSelectionChanged: onSelectAutoTaskSource
        });

        var $autoTaskSelectBox = $("<div>").dxSelectBox({
            disabled: true,
            displayExpr: "name",
            placeholder: "Выберите задание...",
            noDataText: "Нет заданий для отображения",
            onSelectionChanged: onSelectAutoTask
        });

        var $autoTaskRunButton = $("<div>").dxButton({
            text: "Запустить задание",
            disabled: true,
            onClick: runSelectedAutoTask
        });

        var autoTaskSelectBox = $autoTaskSelectBox.dxSelectBox("instance");
        var autoTaskRunButton = $autoTaskRunButton.dxButton("instance");

        var $autoTaskSourceField = createField($autoTaskSourceSelectBox, "Плагин:");
        var $autoTaskField = createField($autoTaskSelectBox, "Задание:");
        var $autoTaskRunButtonField = createField($autoTaskRunButton);

        $container.addClass("dx-fieldset").append(
            $("<div>").addClass("dx-fieldset-header").html(getHeader(taskType)),
            $autoTaskSourceField, $autoTaskField, $autoTaskRunButtonField);
    }

    function createField($value, label) {
        var $labelContainer = label ? $("<div>").addClass("dx-field-label ct-field-label-20").html(label) : null;
        var $valueContainer = $("<div>").addClass("dx-field-value ct-field-value-80").append($value);
        return $("<div>").addClass("dx-field").append($labelContainer, $valueContainer);
    }

    function getHeader(type) {
        if (type === "import") return "Задания автоимпорта";
        if (type === "export") return "Задания автоэкспорта";
        return "";
    }
}((window.ct = window.ct || {}, window.ct.autoTasks= window.ct.autoTasks || {}), $));