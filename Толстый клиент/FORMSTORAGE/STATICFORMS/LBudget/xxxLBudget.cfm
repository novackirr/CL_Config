<?xml version="1.0" encoding="Windows-1251"?>
<FORM name="LBudget" LinkPath="|LBudget" position="0,0,819,220" ScriptLang="VBScript" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204"><FORM name="форма" LinkPath="|форма" Script=" Sub subdostup 

Set ctx = CreateObject(&quot;Form.ExecutionContext&quot;)
set abitem = ctx.GetItem(ctx.CurrentUser.id)

dostup=0 

For each p in abitem.parents 
  ' Текущий пользователь входит в группу доступа &quot;Закупающее подразделение&quot;
  if p.type= 5 and  p.name = &quot;Закупающее подразделение&quot; then  
        dostup=1
  end if

next            

' Кнопка перехода к позиции ПГ'
'if  Len(IdLot.text) &gt; 0  then 
'ScheduleItemFrmbutControl.Enabled=1 
'else 
'ScheduleItemFrmbutControl.Enabled=0 
'end if 

' Кнопка Опубликовать контракт
' Текущий пользователь входит в группу доступа Закупающее подразделение  и Статус =Черновик
if  dostup=1 and (Status.text = &quot;Внесение изменений&quot; or  Status.text = &quot;Согласован&quot;)   then 
EISDogInf.Enabled=1 
else 
EISDogInf.Enabled=0 
end if 

' Кнопка Внести изменение
' Текущий пользователь входит в группу доступа Закупающее подразделение  и Статус  не &quot;Завершен&quot;
if  dostup=1 and Status.text = &quot;Завершен&quot;   then 
CreateDopSoglFrmbutControl.Enabled=0 
else 
CreateDopSoglFrmbutControl.Enabled=1 
end if 


'Кнопка Опубликовать сведения
' Текущий пользователь входит в группу доступа Закупающее подразделение  и Статус =Черновик
if  dostup=1 and Status.text = &quot;Исполнение&quot; then 
EISDogExe.Enabled=1 
else 
EISDogExe.Enabled=0 
end if 

' Текущий пользователь входит в группу доступа Закупающее подразделение  и Статус =Черновик
if  dostup=1 and Status.text = &quot;Черновик&quot; then 
SoglFrmbutControl.Enabled=1 
else 
SoglFrmbutControl.Enabled=0 
end if 

End Sub



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
	
' Сделать кнопку &quot;На согласование&quot; неактивной после нажатия
Sub SoglFrmbutControl_Click
SoglFrmbutControl.Enabled=0 
End Sub 
 
" groupbox="true" position="8,0,812,68" ScriptLang="VBScript" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="LotID" LinkPath="|ИД_лота" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="140,32,140,36" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;918058" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Save" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="704,40,796,60" Style="propid=1;1" Caption="propid=-518;Сохранить" Action="propid=2;" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="IdLot" LinkPath="|ИД_лота" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="156,28,156,52" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;3473778" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Нет" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/><CONTROL name="Edit" LinkPath="#nodatalink#" controltype="C_BUTTON" ProgID="FRMBUT.FrmbutCtrl.1" position="704,16,796,34" Style="propid=1;1" Caption="propid=-518;Редактировать" Action="propid=2;" RadioKey="propid=3;" Check="propid=5;Нет" EventName="propid=4;" Enabled="propid=-514;Да" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" BackColor="propid=-501;15790320"/><CONTROL name="Организация_S" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="4,12,184,32" BackColor="propid=-501;12632256" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Организация-заказчик" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Организация_заказчик" LinkPath="|Организация_заказчик" controltype="C_IDLEINPUT" ProgID="CTLCtrl.TextboxCtrl.1" position="4,32,280,52" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Text="propid=-517;" hWnd="propid=-515;4326152" BackColor="propid=-501;16777215" Multiline="propid=1;Нет" Mask="propid=2;" ReadOnly="propid=3;Да" ForeColor="propid=-513;0" MaxChar="propid=4;-1" TextAlign="propid=5;0"/></FORM><FORM name="Форма3" LinkPath="|Источники_финансирования" grouptitle="Источники финансирования" position="12,80,812,212" Font="propid=-512;name=MS Sans Serif;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=0"><CONTROL name="CStatTextCtrlClass" LinkPath="#nodatalink#" controltype="C_STATIC" ProgID="Frmwin.StatText.1" position="0,0,123,20" BackColor="propid=-501;15790320" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" ForeColor="propid=-513;0" Text="propid=-517;Источники финансирования" TextAlign="propid=1;0" Transparent="propid=2;Да"/><CONTROL name="Платежи_этапа_бюджетные_средства" LinkPath="|Источники_финансирования" controltype="C_TABLE" ProgID="VSFlexGrid.VSFlexGridL.1" position="4,20,796,116" _ConvInfo="propid=666;-1" FontName="propid=1;" FontSize="propid=2;" FontBold="propid=3;" FontItalic="propid=4;" FontStrikethru="propid=5;" FontUnderline="propid=6;" Rows="propid=7;10" Cols="propid=8;9" Version="propid=9;700" FixedRows="propid=11;1" FixedCols="propid=12;0" TopRow="propid=13;" LeftCol="propid=14;" RowSel="propid=15;" ColSel="propid=16;" Row="propid=17;" Col="propid=18;" Text="propid=0;" BackColor="propid=-501;-2147483643" ForeColor="propid=-513;-2147483640" BackColorFixed="propid=20;-2147483633" ForeColorFixed="propid=21;-2147483630" BackColorSel="propid=22;-2147483643" ForeColorSel="propid=23;-2147483640" BackColorBkg="propid=24;-2147483636" WordWrap="propid=25;Да" TextStyle="propid=26;0" TextStyleFixed="propid=27;0" ScrollTrack="propid=28;Нет" FocusRect="propid=29;1" HighLight="propid=30;1" Redraw="propid=31;" ScrollBars="propid=32;3" RowHeightMin="propid=39;0" FillStyle="propid=40;0" GridLines="propid=41;1" GridLinesFixed="propid=42;2" GridColor="propid=43;-2147483633" GridColorFixed="propid=44;-2147483632" CellBackColor="propid=45;" CellForeColor="propid=46;" CellAlignment="propid=47;" CellTextStyle="propid=48;" CellPicture="propid=49;" CellPictureAlignment="propid=50;" CellFontName="propid=51;" CellFontSize="propid=52;" CellFontBold="propid=53;" CellFontItalic="propid=54;" CellFontWidth="propid=55;" CellFontUnderline="propid=56;" CellFontStrikethru="propid=57;" FontWidth="propid=58;" Clip="propid=59;" Sort="propid=60;" SelectionMode="propid=61;0" MergeCells="propid=62;0" PictureType="propid=64;0" AllowBigSelection="propid=65;Да" AllowUserResizing="propid=66;1" MousePointer="propid=-521;0" VirtualData="propid=70;Да" Editable="propid=71;2" ComboList="propid=72;" FloodColor="propid=74;192" CellFloodPercent="propid=75;" CellFloodColor="propid=76;" SubtotalPosition="propid=77;1" BorderStyle="propid=-504;1" Font="propid=-512;name=Arial;height=9;weight=400;italic=0;underline=0;strikeout=0;orientation=0;width=0;charset=204" Enabled="propid=-514;Да" Appearance="propid=-520;1" OutlineBar="propid=82;0" TreeColor="propid=83;-2147483632" GridLineWidth="propid=84;1" AutoResize="propid=85;Да" ExtendLastCol="propid=88;Да" EditText="propid=91;" AutoSizeMode="propid=93;1" RightToLeft="propid=94;Нет" MultiTotals="propid=95;Да" BackColorAlternate="propid=96;-2147483643" OwnerDraw="propid=97;0" DataMode="propid=98;0" OLEDragMode="propid=99;0" OLEDropMode="propid=100;0" TabBehavior="propid=101;0" SheetBorder="propid=102;-2147483642" AllowSelection="propid=103;Да" PicturesOver="propid=104;Нет" CellChecked="propid=105;" MergeCompare="propid=106;0" Ellipsis="propid=107;0" OutlineCol="propid=108;0" RowHeightMax="propid=109;0" AutoSearch="propid=110;0" ExplorerBar="propid=111;0" EditMask="propid=112;" EditSelStart="propid=113;" EditSelLength="propid=114;" EditSelText="propid=115;" EditMaxLength="propid=116;" ComboIndex="propid=117;" ColAlignment="propid=119;" ColWidth="propid=120;" RowHeight="propid=121;" MergeRow="propid=122;" MergeCol="propid=123;" RowPosition="propid=124;" ColPosition="propid=125;" RowData="propid=126;" ColData="propid=127;" TextMatrix="propid=130;" IsSubtotal="propid=134;" FixedAlignment="propid=138;" IsSelected="propid=143;" TextArray="propid=144;" IsCollapsed="propid=145;" ColSort="propid=155;" ColFormat="propid=156;" ColDataType="propid=157;" Cell="propid=158;" RowStatus="propid=159;" ColEditMask="propid=164;" ColComboList="propid=165;" RowOutlineLevel="propid=166;" ScrollTips="propid=169;Нет" ScrollTipText="propid=170;" RowHidden="propid=171;" ColHidden="propid=172;" ColWidthMin="propid=173;0" ColWidthMax="propid=174;0" ShowComboButton="propid=176;Да" ComboSearch="propid=178;3" AutoSizeMouse="propid=180;Да" ClipSeparators="propid=182;" ColImageList="propid=184;" ColKey="propid=185;" FrozenRows="propid=188;0" FrozenCols="propid=189;0" AllowUserFreezing="propid=190;0" BackColorFrozen="propid=191;0" ForeColorFrozen="propid=192;0" FlexDataSource="propid=193;" AutoSearchDelay="propid=199;2" WallPaperAlignment="propid=202;9" ColIndent="propid=207;"><COLUMN name="Источник_финансирования" LinkPath="|Источник_финансирования" MaxColChar="0" width="72"/><COLUMN name="КБК_бюджетные_средства" LinkPath="|КБК_бюджетные_средства" EditTool="CallTools.DictionaryView" MaxColChar="0" width="63"/><COLUMN name="КВР_Код" LinkPath="|КВР_Код" MaxColChar="0" width="49"/><COLUMN name="КВР_внебюджетные_средства" LinkPath="|КВР_внебюджетные_средства" MaxColChar="0" width="102"/><COLUMN name="Год_финансирования" LinkPath="|Год_финансирования" MaxColChar="0" width="128"/><COLUMN name="Сумма_лимита" LinkPath="|Сумма_лимита" MaxColChar="0" width="91"/><COLUMN name="Запланировано" LinkPath="|Запланировано" MaxColChar="0" width="100"/><COLUMN name="Остаток" LinkPath="|Остаток" MaxColChar="0" width="101"/><COLUMN name="Экономия" LinkPath="|Экономия" MaxColChar="0" width="72"/></CONTROL></FORM></FORM>
<?BinaryFile xxxLBudget.fbin?>
