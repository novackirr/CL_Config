// радиобаттон предыдущий год скрывается во всех проектах, кроме Россетей
function subscripeCreatePlanOnChange() {

    function hideCreatePlanPreviousYearRadioButton() {
        $("input[data-name='prevYear']").closest("div.radio").remove();
        if (LawSwitcher.Is44Law()) {
            $("input[name='planInnovative']").closest("div.checkbox").hide();
        }
		$("input[name='planExtended']").closest("div.checkbox").hide();
    }

    $(document)
        .on('onDocumentModalWindowLoaded',
            hideCreatePlanPreviousYearRadioButton);
}

scopes.onSearch(subscripeCreatePlanOnChange);