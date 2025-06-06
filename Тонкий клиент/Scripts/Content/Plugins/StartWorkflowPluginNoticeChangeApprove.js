(function () {
    $(".checkbox-label-right").css("width","auto")
	$(".checkbox-label-right").css("margin-left","0px")
	$(".modal-body .form-group label").css("margin-top","3px")
	let ApproveCommission = $("input[data-field-name='ApproveCommission']");
	let ApproveLeader = $("input[data-field-name='ApproveLeader']");
	ApproveCommission.prop("checked", true)
	ApproveLeader.prop("checked", true)
	function ckeckFullApprove(obj){
		let ApproveCommission = $("input[data-field-name='ApproveCommission']");
		let ApproveLeader = $("input[data-field-name='ApproveLeader']");
		
		if ( !ApproveCommission.is(":checked") && !ApproveLeader.is(":checked")){
			$(obj).prop("checked", true)
			showCommonErrors('Для запуска маршрута согласования должен быть заполнен как минимум один чекбокс');
		}
	}
	$(document).on('change', "input[data-field-name='ApproveCommission']", function (e) {
		ckeckFullApprove(this)
	})
	$(document).on('change', "input[data-field-name='ApproveLeader']", function (e) {
		ckeckFullApprove(this)
	})
}());