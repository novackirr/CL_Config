<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LinksPositionAdd" LinkPath="|Связки" Script="Sub subdostup
 
' Кнопка Добавить позицию 
' Статус  &quot;Черновик&quot; или &quot;Доработка извещения&quot;  
if  ( Status.text=&quot;Черновик&quot; or Status.text=&quot;Доработка&quot;  or Status.text=&quot;Внесение изменений&quot;  ) or ( Status.text=&quot;Включена в опубликованный план закупок&quot; and DisregardPosition.check = true )   then 
AddItemToTheLotFrmbutControl.Enabled=1  
else 
AddItemToTheLotFrmbutControl.Enabled=0
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

' Генерация именованного события кнопки &quot;Добавить позицию&quot;, в зависимоти от заполнения поля ОКПД
 Sub AddItemToTheLotFrmbutControl_Click
     if  OKPD2.text = &quot;&quot; then 
        Form.DropNamedEvent (&quot;LinkAddEvent/AddPositionToTheItemWithOutOKPD&quot;)
    else
        Form.DropNamedEvent (&quot;LinkAddEvent/AddPositionToTheItem&quot;)
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
" position="0,0,611,180" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="RefreshLinkFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="533,4,599,24" Style="propid=1;1" Caption="propid=-518;Обновить" Action="propid=2;RefreshLink" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="AddItemToTheLotFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="463,4,528,24" Style="propid=1;1" Caption="propid=-518;Добавить позицию" Action="propid=2;" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Status" LinkPath="|..|Document|Статус" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="484,12,484,12" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1771334" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="AXDocumentLinksControl" LinkPath="#nodatalink#" controltype="C_ACTIVEX" ProgID="AXDOCUMENTLINKS.AXDocumentLinksCtrl.1" position="8,26,599,172" StaticTextFont="propid=1;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ButtonTextFont="propid=3;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" EditeTextFont="propid=4;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ReadOnly="propid=5;Нет" IsExtended="propid=6;Нет" Flow="propid=7;" Columns="propid=8;Num;№;30;Num;;True;False|/Document/Наименование_позиции;Наименование позиции;300;String|/Document/ОКПД2;ОКПД2;100;String|/Document/Сумма_выплат_всего;Сумма выплат всего;180;String|/Document/Сумма_выплат_текущего_года;Сумма выплат текущего года;180;String|/Document/Сумма_выплат_первого_года;Сумма выплат первого года;180;String|/Document/Сумма_выплат_второго_года;Сумма выплат второго года;180;String|/Document/Сумма_выплат_последующих_годов;Сумма выплат последующих годов;185;String|/Document/Количество_всего;Количество;180;String|/Document/Статус;Статус;180;String" SettingsFunkNameName="propid=9;" DeleteLinkSettings="propid=10;" FilterFlow="propid=11;Позиции" ShowHeaders="propid=12;Нет" DeleteAllLinksSettings="propid=13;" AddButtonText="propid=14;-"/><CONTROL name="DisregardPosition" LinkPath="|..|Document|Позиции_не_учитывать" controltype="C_CHECK" ProgID="FRMBUT.FrmbutCtrl.1" position="1,1,1,1" Style="propid=1;3" Caption="propid=-518;Позиции_не_учитывать" Action="propid=2;" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;16777215"/><CONTROL name="Balance" LinkPath="|..|Document|Остаток_финансового_обеспечения_ППЗ" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="11,11,11,11" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1377716" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Totalamount" LinkPath="|..|Document|Сумма_всего" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="11,11,11,11" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;2363756" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="OKPD2" LinkPath="|..|Document|ОКПД2" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="1,1,1,1" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1512636" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM>
<?BinaryFile xxxLinksPositionAdd.fbin?>
