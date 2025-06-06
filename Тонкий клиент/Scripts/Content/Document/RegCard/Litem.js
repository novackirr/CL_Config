
$("#documentView-controlCard-accordion").hide();

$("#registerView-controlCard-accordion").hide();
$("#registerView-documentLinks-accordion").hide();

$(document).ready(function() {
    $("input[name='registerCol'],[name='registerPrice']").live("input change paste", calculateSum);

    $("input[name='registerNoCol']").change(function () {
        if (this.checked)
            $("input[name='registerCol']").val(1);
    });

    $("input[name=registerDate]").change(function() {
        var date = new Date($(this).val());
        $("input[name=Year]").val(date.getFullYear());
    });

    $("select[name=registerCalen]").val("Единовременно");

    $("select[name=registerCalen]").change(function() {
        if ($(this).val() == "Сложный график") {
            Ext.create('widget.window', {
                title: '',
                html: '<div>При сложном графике поставки необходимо прикрепить файл с описанием графика поставки</div>',

                width: 400,
                autoHeight: true,

                maximizable: false,
                resizable: false,
                draggable: false,
                closable: false,

                modal: true,

                bodyPadding: '10px 5px 5px 5px',
                bodyStyle: "background-color:white",

                buttons: [
                    {
                        text: 'ОK',
                        handler: function() { this.up('window').close(); },
                    }
                ],

                autoShow: true,
            });

            //win.show();
        }
    });
});

function calculateSum() {
    var count = $("input[name='registerCol']").val();
    var price = $("input[name=registerPrice]").autoNumeric('get');

    var totalSum = Math.round(count * price);

    $("input[name='registerSum']").autoNumeric('set', totalSum);
}