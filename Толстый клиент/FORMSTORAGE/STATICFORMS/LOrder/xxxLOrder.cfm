<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LOrder" LinkPath="|РКК" Script="Sub ClearElem(elem)
	Set frm = Form.DataRoot
	Set obj = frm(elem)
	obj.Value = &quot;&quot;
End Sub

Sub Form_Load
    on error resume next
    Set Document = Form.Context(&quot;DOCUMENT&quot;)
   Set ServerConn= Form.Context(&quot;SERVER_CONNECTION&quot;)  
   AXDocumentControlControl.InitData ServerConn,Document
End Sub

Sub FrmbutCreateControl_Pressed
  FrmbutCreateControl.Enabled = False

  i = ResolutionsTable.RowData(ResolutionsTable.Row)
  Dim sevent
  if CStr(i) = &quot;&quot; then
    Form.MsgBox &quot;Щелкните мышью на ячейку таблицы с резолюцией&quot;
  else 
    sevent = &quot;ApproveResolution@&quot; + CStr(i)
    Form.DropNamedEvent sevent
  end if
 FrmbutCreateControl.Enabled = True
End Sub" position="0,0,606,340" ScriptLang="VBScript" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204"><FORM name="форма" LinkPath="#nodatalink#" Script="Sub subdostup 

Set ctx = CreateObject(&quot;Form.ExecutionContext&quot;)
set abitem = ctx.GetItem(ctx.CurrentUser.id)

dostup=0 
dostupUz=0 

For each p in abitem.parents 
   
  ' Текущий пользователь входит в группу доступа &quot;Инициаторы закупки&quot;
  if p.type= 5 and  p.name = &quot;Инициаторы закупки&quot; then  
        dostup=1
  end if

  ' Текущий пользователь входит в группу доступа &quot;Закупающее подразделение&quot;
  if p.type= 5 and  p.name = &quot;Закупающее подразделение&quot; then  
        dostupUz=1
  end if
 


next            


' Кнопки Загрузить позиции, 
' Текущий пользователь входит в группу доступа &quot;Инициаторы закупки&quot; и Статус заявки = &quot;Черновик&quot;
if     dostup=1 and (Status.text=&quot;Черновик&quot;  or  Status.text=&quot;Доработка  заявки&quot; )  then 
LoadFrmbutControl.Enabled=1 
CopyLOrderFrmbutControl.Enabled=1
else 
LoadFrmbutControl.Enabled=0 
end if


' Кнопка Добавить позицию
' Текущий пользователь входит в группу доступа &quot;Инициаторы закупки&quot; и Статус заявки=&quot;Черновик&quot; или &quot;Доработка новой заявки&quot;
 if      dostup=1 and  ( Status.text=&quot;Черновик&quot;  or  Status.text=&quot;Доработка  заявки&quot;   )then 
CreatePositionFrmbutControl.Enabled=1 
 else 
 CreatePositionFrmbutControl.Enabled=0 
 end if 


' Кнопка На согласование
' Текущий пользователь входит в группу доступа &quot;Инициаторы закупки&quot; и Статус заявки=&quot;Черновик&quot; 
 if      dostup=1 and Status.text=&quot;Черновик&quot;   and SumPoz.text&lt;&gt;&quot;&quot;and  SumPoz.text &lt;&gt; &quot;0,00&quot;  then 
SoglFrmbutControl.Enabled=1 
 else 
 SoglFrmbutControl.Enabled=0 
 end if 

End Sub



' Сделать кнопку &quot;На согласование&quot; неактивной после нажатия
Sub SoglFrmbutControl_Click
SoglFrmbutControl.Enabled=0 
LoadFrmbutControl.Enabled=0 
CreatePositionFrmbutControl.Enabled=0 
End Sub 


' Сделать кнопку &quot;Создать позицию ПЗ&quot; 
'Sub CreateItemFrmbutControl_Click
'Form.DropNamedEvent &quot;CreateShowDocEvent/CreateItem&quot;
'CreateItemFrmbutControl.Enabled=1 
'End Sub 

' Сделать кнопку &quot;Изменение плана&quot; неактивной после нажатия
'Sub EditlFrmbutControl_Click
'EditlFrmbutControl.Enabled=0 
'End Sub 
    

Sub Form_Load

   'Вызов фунции доступа к кнопкам
  subdostup

End Sub

Sub Status_Changed 
   'Вызов фунции доступа к кнопкам
  subdostup
End Sub 


Sub Form_NamedEvent( evt )

    if evt = &quot;recalculateall&quot; then

   'Вызов фунции доступа к кнопкам
  subdostup
    End If

    End Sub
" groupbox="true" position="8,12,596,82" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="CreatePositionFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="452,12,512,32" Style="propid=1;1" Caption="propid=-518;Создать позицию" Action="propid=2;CreateShowDocEvent/CreatePosition" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Число_регномера_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="16,16,69,32" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Рег. номер" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Дата_регистрации_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="79,16,144,36" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Дата регистрации" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Статус_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="152,16,217,36" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Статус" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Число_регномера" LinkPath="|Число_регномера" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="15,36,68,56" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;918454" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Дата_регистрации" LinkPath="|Дата_регистрации" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="77,36,142,56" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;4591038" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="SoglFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="452,36,512,56" Style="propid=1;1" Caption="propid=-518;На согласование" Action="propid=2;runRoute&amp;forApproval" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Year" LinkPath="|Year" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="176,40,177,40" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;852692" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="God" LinkPath="|God" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="204,40,205,41" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;2097962" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Год_закупки" LinkPath="|Год_закупки" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="244,36,304,56" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1180346" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Year_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="244,16,304,32" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Год закупки" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="LoadFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="520,12,580,32" Style="propid=1;1" Caption="propid=-518;Загрузить позиции" Action="propid=2;LoadExcelEvent/LoadLItem" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="CopyLOrderFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="520,36,580,56" Style="propid=1;1" Caption="propid=-518;Копировать заявку" Action="propid=2; CreateShowDocEvent/CopyLPurchaseOrder" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Status" LinkPath="|Статус" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="152,36,236,56" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;985386" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Sposob1" LinkPath="|Способ_закупки" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="260,36,261,36" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;659384" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Summa" LinkPath="|Сумма" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="392,40,392,40" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;790462" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="SumPoz" LinkPath="|Сумма_выплат_всего" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="316,16,316,16" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;790476" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM><FORM name="Форма" LinkPath="#nodatalink#" groupbox="true" position="8,156,596,333" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="Наименование_заявки_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="15,12,219,28" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Наименование заявки" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Наименование_заявки_S1" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="15,77,452,97" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Обоснование необходимости проведения закупки" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Обоснование" LinkPath="|Обоснование" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="15,97,452,163" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;465612" BackColor="propid=-501;16777215" Multiline="propid=1;Да" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Наименование_заявки" LinkPath="|Наименование_заявки" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="15,32,575,68" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1247830" BackColor="propid=-501;16777215" Multiline="propid=1;Да" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Сумма_выплат_всего" LinkPath="|Сумма_выплат_всего" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="464,97,576,117" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;793294" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Сумма_выплат_всего_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="464,77,568,97" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Сумма выплат всего" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Валюта_S1" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="464,123,576,143" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Валюта" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Валюта" LinkPath="|Валюта" EditTool="CallTools.DictionaryView" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="464,143,576,163" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;793290" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM><FORM name="Форма1" LinkPath="#nodatalink#" groupbox="true" position="8,84,596,156" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="Местонахождение_инициатора_S" LinkPath="|ИД_руководителя_инициатора" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="212,20,324,36" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Местонахождение" TextAlign="propid=1;0" Transparent="propid=2;Да"/><FORM name="Руководитель" LinkPath="|Руководитель" position="460,36,576,64" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="ФИО_руководителя_инициатора" LinkPath="|ФИО_руководителя_инициатора" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="4,4,112,24" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1183446" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM><CONTROL name="ФИО_руководителя_инициатора_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="464,20,552,36" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Руководитель" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="ФИО_инициатора_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="340,20,412,36" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Инициатор" TextAlign="propid=1;0" Transparent="propid=2;Да"/><FORM name="Инициатор" LinkPath="|Инициатор" position="336,36,452,64" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="ФИО_инициатора" LinkPath="|ФИО_инициатора" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="4,4,114,25" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1444278" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM><CONTROL name="Местонахождение_инициатора" LinkPath="|Местонахождение_инициатора" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="212,40,324,60" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1508968" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Подразделение_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="15,20,175,36" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Подразделение" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Подразделение_инициатора" LinkPath="|Подразделение_инициатора" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="15,40,204,60" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1443512" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM></FORM>
<?BinaryFile xxxLOrder.fbin?>
