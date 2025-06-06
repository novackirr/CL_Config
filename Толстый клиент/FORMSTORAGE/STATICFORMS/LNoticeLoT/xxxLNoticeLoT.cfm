<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LNoticeLoT" LinkPath="|Лот" Script="
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
End Sub" position="0,0,603,250" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="AXDocumentLinksControl" LinkPath="#nodatalink#" controltype="C_ACTIVEX" ProgID="AXDOCUMENTLINKS.AXDocumentLinksCtrl.1" position="8,3,595,243" StaticTextFont="propid=1;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ButtonTextFont="propid=3;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" EditeTextFont="propid=4;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ReadOnly="propid=5;Нет" IsExtended="propid=6;Нет" Flow="propid=7;" Columns="propid=8;Num;№;30;Num;;True;False|/Document/Способ_определения_поставщика;Способ определения поставщика;300;String|/Document/НМЦ;НМЦ;100;String|/Document/Валюта;Валюта;120;String|/Document/Планируемый_год_размещения;Планируемый год размещения;180;Int|" SettingsFunkNameName="propid=9;" SettingsNewLinkName="propid=10;" FilterFlow="propid=11;Лоты" ShowHeaders="propid=12;Да" SettingsDeleteLinkName="propid=13;" AddButtonText="propid=14;-"/></FORM>
<?BinaryFile xxxLNoticeLoT.fbin?>
