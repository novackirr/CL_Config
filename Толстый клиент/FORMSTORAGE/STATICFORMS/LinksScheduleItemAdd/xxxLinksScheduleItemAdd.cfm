<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LinksScheduleItemAdd" LinkPath="|Связки" Script="Sub subdostup

' Кнопка Добавить позицию 
' Статус  &quot;Черновик&quot; или &quot;Доработка извещения&quot;  
if  Status.text=&quot;Черновик&quot; or Status.text=&quot;Доработка лота&quot;  then 
AddScheduleItemToTheLotFrmbutControl.Enabled=1 
else 
AddScheduleItemToTheLotFrmbutControl.Enabled=0
end if 

End Sub 

Sub Status_Changed 
   'Вызов фунции доступа к кнопкам
  subdostup
End Sub 

' Сделать неактивной после нажатия кнопки &quot;На согласование&quot;
Sub Form_NamedEvent( evt )
    if evt = &quot;runRoute&amp;forApproval&quot; then 
        AddItemToTheLotFrmbutControl.Enabled=0 
   end if
End Sub 


Sub Form_Load
   on error resume next
    Set Document = Form.Context(&quot;DOCUMENT&quot;)     
   Set ServerConn= Form.Context(&quot;SERVER_CONNECTION&quot;) 
    AXDocumentLinksControl.InitDocument ServerConn,Document
   AXDocumentAttachmentsControl.InitDocument ServerConn,Document
   'Вызов фунции доступа к кнопкам
    subdostup
End Sub 

Sub AXDocumentLinksControl_AddLink
	Form.DropNamedEvent (&quot;AddLink&quot;)
End Sub

Sub AXDocumentLinksControl_Refresh
	Form.DropNamedEvent (&quot;RefreshLink&quot;)
End Sub

Sub AXDocumentLinksControl_ViewLink(DocumentLinkId)
	Form.DropNamedEvent (&quot;ViewLink@&quot; + DocumentLinkId)
End Sub

Sub AXDocumentLinksControl_RemoveLink(DocumentLinkId)
	Form.DropNamedEvent (&quot;RemoveLink@&quot; + DocumentLinkId)
End Sub

Sub AXDocumentAttachmentsControl_AddAttachment
            Form.DropNamedEvent (&quot;AddAttachment&quot;)
End Sub

Sub AXDocumentAttachmentsControl_ScanAttachment
            Form.DropNamedEvent (&quot;ScanAttachment&quot;)
End Sub

Sub AXDocumentAttachmentsControl_ViewAttachment(AttachmentId)
            Form.DropNamedEvent (&quot;ViewAttachment@&quot; + AttachmentId)
End Sub

Sub AXDocumentAttachmentsControl_RemoveAttachment(AttachmentId)
            Form.DropNamedEvent (&quot;RemoveAttachment@&quot; +AttachmentId )
End Sub

   Sub Form_NamedEvent( evt )

    if evt = &quot;recalculateall&quot; then

   'Вызов фунции доступа к кнопкам
  subdostup
    End If

    End Sub
" position="0,0,607,180" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="AXDocumentLinksControl" LinkPath="#nodatalink#" controltype="C_ACTIVEX" ProgID="AXDOCUMENTLINKS.AXDocumentLinksCtrl.1" position="8,26,599,172" StaticTextFont="propid=1;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ButtonTextFont="propid=3;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" EditeTextFont="propid=4;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ReadOnly="propid=5;Нет" IsExtended="propid=6;Нет" Flow="propid=7;" Columns="propid=8;Num;№;30;Num;;True;False|/Document/Наименование_объекта_закупки;Наименование объекта закупки;300;String|/Document/НМЦК;НМЦК;100;String|/Document/Способ_определения_поставщика;Способ определения поставщика;200;String|/Document/Планируемый_срок_размещения;Срок размещения;100;Date|/Document/Планируемый_срок_исполнения;Срок исполнения;150;Date|/Document/Совместные торги;Совместные торги;150;Bool|/Document/Организатор_совместных_торгов/Организатор_совместных_торгов_наименование;Организатор совместных торгов;200;String|" SettingsFunkNameName="propid=9;" SettingsNewLinkName="propid=10;" FilterFlow="propid=11;Позиции плана-графика" ShowHeaders="propid=12;Нет" SettingsDeleteLinkName="propid=13;" AddButtonText="propid=14;-"/><CONTROL name="RefreshLinkFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="533,4,599,24" Style="propid=1;1" Caption="propid=-518;Обновить" Action="propid=2;RefreshLink" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="AddScheduleItemToTheLotFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="463,4,528,24" Style="propid=1;1" Caption="propid=-518;Добавить позицию ПГ" Action="propid=2;LinkAddEvent/AddScheduleItemToTheLot" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Status" LinkPath="|..|Document|Статус" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="486,13,488,17" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;856186" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM>
<?BinaryFile xxxLinksScheduleItemAdd.fbin?>
