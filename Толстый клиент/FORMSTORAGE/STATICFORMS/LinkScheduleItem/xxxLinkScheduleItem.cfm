<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LinkScheduleItem" LinkPath="|�������" Script="
Sub Form_Load
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
End Sub" position="0,0,603,277" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="AXDocumentLinksControl" LinkPath="#nodatalink#" controltype="C_ACTIVEX" ProgID="AXDOCUMENTLINKS.AXDocumentLinksCtrl.1" position="8,28,595,268" StaticTextFont="propid=1;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ButtonTextFont="propid=3;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" EditeTextFont="propid=4;name=MS Shell Dlg;height=12;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ReadOnly="propid=5;���" IsExtended="propid=6;���" Flow="propid=7;" Columns="propid=8;Num;�;30;Num;;True;False|/Document/�����������_��������/�����������_��������_������������;�����������-��������;300;String|/Document/���;���;200;String|/Document/������������_�������_�������;������������ ������� �������;300;String|/Document/����;����;100;String|/Document/������_�����������_����������;������ ����������� ����������;200;String|/Document/�����������_����_����������;���� ����������;100;Date|/Document/�����������_����_����������;���� ����������;150;Date|/Document/���������� �����;���������� �����;150;Bool|/Document/����������������_�������;���������������� �������;150;Bool|/Document/������;������;180;String" SettingsFunkNameName="propid=9;" DeleteLinkSettings="propid=10;|Document|������ = '�������� � ������ �����-�������'" FilterFlow="propid=11;������� �����-�������" ShowHeaders="propid=12;���" DeleteAllLinksSettings="propid=13;|Document|������ = '������'" AddButtonText="propid=14;-"/><CONTROL name="Status" LinkPath="|..|Document|������" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="1,1,1,1" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;2184974" BackColor="propid=-501;16777215" Multiline="propid=1;���" Mask="propid=2;" ReadOnly="propid=3;��" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="AddScheduleItemToSchedulePlanFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="461,4,526,24" Style="propid=1;1" Caption="propid=-518;�������� ���" Action="propid=2;LinkAddEvent/AddScheduleItemToSchedulePlan" RadioKey="propid=3;" Check="propid=5;���" EventName="propid=4;" Enabled="propid=-514;��" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="RefreshLinkFrmbutControl" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="529,4,595,24" Style="propid=1;1" Caption="propid=-518;��������" Action="propid=2;RefreshLink" RadioKey="propid=3;" Check="propid=5;���" EventName="propid=4;" Enabled="propid=-514;��" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/></FORM>
<?BinaryFile xxxLinkScheduleItem.fbin?>
