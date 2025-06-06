$("#documentView-controlCard-accordion").hide();
$("#registerView-controlCard-accordion").hide();

var EditReg = function () {

	$("li:has(:contains('Скрытые поля'))").hide();

}

var Soglas = function () {
	//объявляю переменные
	var trebSogl = $("input[name='trebSogl']");
	var Sogl = $("input[name='Sogl']");
	//по умолчанию скрываю поле "Согласующий"
	Sogl.closest(".column-container").hide();
	$("[data-related-field-name=Sogl]").hide();
	
	trebSogl.change(function () {
		if ($(trebSogl).is(":checked")) {
			Sogl.closest(".column-container").show();
			$("[data-related-field=Sogl").show();
			Sogl.prop("required", true);
			Sogl.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=Sogl]").addClass("label-required");

		} else {
			Sogl.val("");
			Sogl.prop("required", false);
			Sogl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=Sogl]").removeClass("label-required");

			Sogl.closest(".column-container").hide();
			$("[data-related-field=Sogl").hide();
			Sogl.closest(".clearfix").removeClass("label-required");
			Sogl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=Sogl]").removeClass("label-required");

		}
	});
	trebSogl.change();
}
//Требуется согласование , просмотр
var SoglasovView = function () {
	var Soglasov = $("div[data-name='Согласующий']");
	var flag = $("div[data-name='Требуется согласование']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		Soglasov.show();
		/* $("div[data-name='Требуется согласование']").hide(); */

	} else {
		Soglasov.hide();

	}
};

scopes.onView(SoglasovView);

scopes.onRegister(Soglas);
scopes.onEdit(Soglas);
scopes.onEdit(EditReg);
scopes.onRegister(EditReg);
