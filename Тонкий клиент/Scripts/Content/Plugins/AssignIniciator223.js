(function () {
    $("button[name=registerPodIn]").prop('disabled', true);
	$("button[name=RukInic]").prop('disabled', true);
	$("button[name=Upravl]").prop('disabled', true);
	$("button[name=RukUpr]").prop('disabled', true);
}());

$(document).on('change', "input[data-field-name='Upravl']", function (e) {
    checkDepartment();
});

var checkDepartment =function() {
	var Upravl = $("input[name='Upravl']").val();
	var listUpravl = [
           "ГК «Ватутинки»",
			"УСС по г. Москве и МО",
			"УСС по г. Санкт-Петербургу и ЛО",
			"УСС по Калужской области",
			"УСС по Нижегородской области",
			"УСС по Новосибирской области",
			"УСС по Новосибирской области",
			"УСС по Свердловской области",
			"УСС по Хабаровскому краю"
		];
		if (($.inArray(Upravl, listUpravl) != -1)) {
            $("input[name='VidZak']").val('Филиал');
			$("input[data-field-name='VidZak']").val('Филиал');
		} else{
            $("input[name='VidZak']").val('Центральный аппарат');
			$("input[data-field-name='VidZak']").val('Центральный аппарат');
		}
};