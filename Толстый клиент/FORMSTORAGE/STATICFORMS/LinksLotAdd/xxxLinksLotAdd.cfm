<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LinksLotAdd" LinkPath="#nodatalink#" Script="Sub subdostup

' ������ �������� ������� 
' ������  &quot;���������� ���������&quot; 
if  Status.text=&quot;���������� � ���&quot; or   Sposob.text=&quot;ZP44&quot;  or  Sposob.text=&quot;ZK44&quot; or Sposob.text=&quot;ZKB44&quot; or  Sposob.text=&quot;PO44&quot; or  Sposob.text=&quot;EA44&quot; or Sposob.text=&quot;EP44&quot;  then
AddLotToTheNoticetFrmbutControl.Enabled=0 
else  
AddLotToTheNoticetFrmbutControl.Enabled=1
end if 

End Sub 

Sub Status_Changed 
   '����� ������ ������� � �������
  subdostup
End Sub 


Sub Form_Load
   on error resume next
    Set Document = Form.Context(&quot;DOCUMENT&quot;)     
   Set ServerConn= Form.Context(&quot;SERVER_CONNECTION&quot;) 
    AXDocumentLinksControl.InitDocument ServerConn,Document
   AXDocumentAttachmentsControl.InitDocument ServerConn,Document
   '����� ������ ������� � �������
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
   '����� ������ ������� � �������
       subdostup
    End If

End Sub
" position="0,0,607,180" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="AXDocumentLinksControl" LinkPath="#nodatalink#" controltype="C_ACTIVEX" ProgID="AXDOCUMENTLINKS.AXDocumentLinksCtrl.1" position="8,26,599,172" StaticTextFont="propid=1;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ButtonTextFont="propid=3;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" EditeTextFont="propid=4;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ReadOnly="propid=5;���" IsExtended="propid=6;���" Flow="propid=7;" Columns="propid=8;/Document/�����_����_�_���������;����� ����;80;String||/Document/������_�����������_����������;������ ����������� ����������;300;String|/Document/����;����;100;String|" SettingsFunkNameName="propid=9;" DeleteLinkSettings="propid=10;" FilterFlow="propid=11;����" ShowHeaders="propid=12;���" DeleteAllLinksSettings="propid=13;" AddButtonText="propid=14;-"/><CONTROL name="RefreshLinkFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="533,4,599,24" Style="propid=1;1" Caption="propid=-518;��������" Action="propid=2;RefreshLink" RadioKey="propid=3;" Check="propid=5;���" EventName="propid=4;" Enabled="propid=-514;��" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="AddLotToTheNoticetFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="460,4,525,24" Style="propid=1;1" Caption="propid=-518;�������� ���" Action="propid=2;LinkAddEvent/AddLotToTheNotice" RadioKey="propid=3;" Check="propid=5;���" EventName="propid=4;" Enabled="propid=-514;��" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Status" LinkPath="|..|Document|������" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="524,20,524,20" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;790402" BackColor="propid=-501;16777215" Multiline="propid=1;���" Mask="propid=2;" ReadOnly="propid=3;���" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Sposob" LinkPath="|..|Document|������_�����������_����������_���" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="416,24,416,24" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;790424" BackColor="propid=-501;16777215" Multiline="propid=1;���" Mask="propid=2;" ReadOnly="propid=3;���" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM>
<?BinaryFile xxxLinksLotAdd.fbin?>
