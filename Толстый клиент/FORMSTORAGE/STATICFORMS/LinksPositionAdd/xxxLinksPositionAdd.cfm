<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LinksPositionAdd" LinkPath="|������" Script="Sub subdostup
 
' ������ �������� ������� 
' ������  &quot;��������&quot; ��� &quot;��������� ���������&quot;  
if  ( Status.text=&quot;��������&quot; or Status.text=&quot;���������&quot;  or Status.text=&quot;�������� ���������&quot;  ) or ( Status.text=&quot;�������� � �������������� ���� �������&quot; and DisregardPosition.check = true )   then 
AddItemToTheLotFrmbutControl.Enabled=1  
else 
AddItemToTheLotFrmbutControl.Enabled=0
end if 

End Sub 

Sub Status_Changed 
   '����� ������ ������� � �������
  subdostup
End Sub 

' ������� ���������� ����� ������� ������ &quot;�� ������������&quot;
Sub Form_NamedEvent( evt )
    if evt = &quot;runRoute&amp;forApproval&quot; then 
        AddItemToTheLotFrmbutControl.Enabled=0 
   end if
End Sub 

' ��������� ������������ ������� ������ &quot;�������� �������&quot;, � ���������� �� ���������� ���� ����
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
" position="0,0,611,180" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="RefreshLinkFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="533,4,599,24" Style="propid=1;1" Caption="propid=-518;��������" Action="propid=2;RefreshLink" RadioKey="propid=3;" Check="propid=5;���" EventName="propid=4;" Enabled="propid=-514;��" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="AddItemToTheLotFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="463,4,528,24" Style="propid=1;1" Caption="propid=-518;�������� �������" Action="propid=2;" RadioKey="propid=3;" Check="propid=5;���" EventName="propid=4;" Enabled="propid=-514;��" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Status" LinkPath="|..|Document|������" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="484,12,484,12" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1771334" BackColor="propid=-501;16777215" Multiline="propid=1;���" Mask="propid=2;" ReadOnly="propid=3;��" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="AXDocumentLinksControl" LinkPath="#nodatalink#" controltype="C_ACTIVEX" ProgID="AXDOCUMENTLINKS.AXDocumentLinksCtrl.1" position="8,26,599,172" StaticTextFont="propid=1;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ButtonTextFont="propid=3;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" EditeTextFont="propid=4;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ReadOnly="propid=5;���" IsExtended="propid=6;���" Flow="propid=7;" Columns="propid=8;Num;�;30;Num;;True;False|/Document/������������_�������;������������ �������;300;String|/Document/����2;����2;100;String|/Document/�����_������_�����;����� ������ �����;180;String|/Document/�����_������_��������_����;����� ������ �������� ����;180;String|/Document/�����_������_�������_����;����� ������ ������� ����;180;String|/Document/�����_������_�������_����;����� ������ ������� ����;180;String|/Document/�����_������_�����������_�����;����� ������ ����������� �����;185;String|/Document/����������_�����;����������;180;String|/Document/������;������;180;String" SettingsFunkNameName="propid=9;" DeleteLinkSettings="propid=10;" FilterFlow="propid=11;�������" ShowHeaders="propid=12;���" DeleteAllLinksSettings="propid=13;" AddButtonText="propid=14;-"/><CONTROL name="DisregardPosition" LinkPath="|..|Document|�������_��_���������" controltype="C_CHECK" ProgID="FRMBUT.FrmbutCtrl.1" position="1,1,1,1" Style="propid=1;3" Caption="propid=-518;�������_��_���������" Action="propid=2;" RadioKey="propid=3;" Check="propid=5;���" EventName="propid=4;" Enabled="propid=-514;��" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;16777215"/><CONTROL name="Balance" LinkPath="|..|Document|�������_�����������_�����������_���" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="11,11,11,11" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1377716" BackColor="propid=-501;16777215" Multiline="propid=1;���" Mask="propid=2;" ReadOnly="propid=3;���" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Totalamount" LinkPath="|..|Document|�����_�����" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="11,11,11,11" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;2363756" BackColor="propid=-501;16777215" Multiline="propid=1;���" Mask="propid=2;" ReadOnly="propid=3;���" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="OKPD2" LinkPath="|..|Document|����2" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="1,1,1,1" Font="propid=-512;name=MS Sans Serif;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;1512636" BackColor="propid=-501;16777215" Multiline="propid=1;���" Mask="propid=2;" ReadOnly="propid=3;���" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM>
<?BinaryFile xxxLinksPositionAdd.fbin?>
