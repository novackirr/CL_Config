<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LinkGPDPosition" LinkPath="|Лот" Script="Sub Form_Load
   on error resume next
    Set Document = Form.Context(&quot;DOCUMENT&quot;)     
   Set ServerConn= Form.Context(&quot;SERVER_CONNECTION&quot;) 
    AXDocumentLinksControl.InitDocument ServerConn,Document
   AXDocumentAttachmentsControl.InitDocument ServerConn,Document

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

Sub AXDocumentAttachmentsControl_AddAttachment(Category)
            Form.DropNamedEvent (&quot;AddAttachment@&quot; + Category)
End Sub

Sub AXDocumentAttachmentsControl_ScanAttachment(Category)
            Form.DropNamedEvent (&quot;ScanAttachment@&quot; + Category)
End Sub 

Sub AXDocumentAttachmentsControl_ViewAttachment(AttachmentId)
            Form.DropNamedEvent (&quot;ViewAttachment@&quot; + AttachmentId)
End Sub

Sub AXDocumentAttachmentsControl_RemoveAttachment(AttachmentId)
            Form.DropNamedEvent (&quot;RemoveAttachment@&quot; +AttachmentId )
End Sub" position="0,0,603,244" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="AXDocumentLinksControl" LinkPath="#nodatalink#" controltype="C_ACTIVEX" ProgID="AXDOCUMENTLINKS.AXDocumentLinksCtrl.1" position="8,23,595,235" StaticTextFont="propid=1;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ButtonTextFont="propid=3;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" EditeTextFont="propid=4;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ReadOnly="propid=5;Нет" IsExtended="propid=6;Нет" Flow="propid=7;" Columns="propid=8;Num;№;30;Num;;True;False|/Document/Наименование_позиции;Наименование позиции;350;String|/Document/ОКПД2;ОКПД2;110;String|/Document/Сумма_выплат_всего;Сумма выплат;150;String|/Document/Количество_всего;Количество;100;String|/Document/Статус;Статус;180;String|" SettingsFunkNameName="propid=9;" DeleteLinkSettings="propid=10;" FilterFlow="propid=11;Позиции" ShowHeaders="propid=12;Нет" DeleteAllLinksSettings="propid=13;" AddButtonText="propid=14;-"/><CONTROL name="RefreshLinkFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="529,2,595,22" Style="propid=1;1" Caption="propid=-518;Обновить" Action="propid=2;RefreshLink" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Status" LinkPath="|..|Document|Статус" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="1,1,1,1" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;3543972" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM>
<?BinaryFile xxxLinkGPDPosition.fbin?>
