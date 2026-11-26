/**
 * Math3-2 Score Portal
 * Store SHEET_ID and ADMIN_PASSWORD in Apps Script > Project Settings > Script properties.
 * Sheet columns: StudentID, StudentName, Class, PIN, Assessment, Score, MaxScore, Note
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Math3-2 | เช็กคะแนน')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function cfg_() {
  const p=PropertiesService.getScriptProperties();
  const id=p.getProperty('SHEET_ID'), admin=p.getProperty('ADMIN_PASSWORD');
  if(!id || !admin) throw new Error('ครูยังตั้งค่า SHEET_ID หรือ ADMIN_PASSWORD ไม่ครบ');
  return {sheet:SpreadsheetApp.openById(id).getSheets()[0], admin:admin};
}
function setupHeaders() {
  const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if(!id) throw new Error('กรุณาตั้ง Script Property ชื่อ SHEET_ID ก่อน');
  const sh=SpreadsheetApp.openById(id).getSheets()[0];
  const headers=['StudentID','StudentName','Class','PIN','Assessment','Score','MaxScore','Note'];
  sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold');
  sh.setFrozenRows(1);
  return 'ตั้งหัวตารางเรียบร้อย';
}
function checkAdmin_(password) {
  const c=cfg_();
  if(String(password||'')!==c.admin) throw new Error('รหัสครูไม่ถูกต้อง');
  return c.sheet;
}
function teacherGet(password) {
  const sh=checkAdmin_(password), values=sh.getDataRange().getDisplayValues();
  return values.slice(1).filter(r=>r[0]).map(r=>({
    id:r[0],name:r[1],klass:r[2],pin:r[3],assessment:r[4],
    score:r[5],max:r[6],note:r[7]
  }));
}
function teacherSave(password, data) {
  const sh=checkAdmin_(password);
  const id=String(data.id||'').trim(), name=String(data.name||'').trim(),
        klass=String(data.klass||'').trim(), pin=String(data.pin||'').trim(),
        assessment=String(data.assessment||'').trim(), note=String(data.note||'').trim();
  if(!id||!name||!klass||!pin||!assessment) throw new Error('กรุณากรอก รหัส ชื่อ ชั้น PIN และรายการประเมิน');
  if(!/^[0-9]{4,8}$/.test(pin)) throw new Error('PIN นักเรียนต้องเป็นตัวเลข 4–8 หลัก');
  const score=data.score===''||data.score===null ? '' : Number(data.score);
  const max=Number(data.max);
  if(max<=0 || !Number.isFinite(max)) throw new Error('คะแนนเต็มต้องมากกว่า 0');
  if(score!=='' && (!Number.isFinite(score)||score<0||score>max)) throw new Error('คะแนนต้องอยู่ระหว่าง 0 ถึงคะแนนเต็ม');
  const rows=sh.getDataRange().getValues();
  let row=0;
  for(let i=1;i<rows.length;i++) if(String(rows[i][0]).trim()===id && String(rows[i][4]).trim()===assessment){row=i+1;break;}
  const vals=[id,name,klass,pin,assessment,score,max,note];
  if(row) sh.getRange(row,1,1,8).setValues([vals]); else sh.appendRow(vals);
  return 'บันทึกคะแนนแล้ว';
}
function studentCheck(id,pin) {
  const sh=cfg_().sheet, rows=sh.getDataRange().getDisplayValues();
  const found=rows.slice(1).filter(r=>String(r[0]).trim()===String(id).trim() && String(r[3]).trim()===String(pin).trim());
  if(!found.length) throw new Error('รหัสนักเรียนหรือ PIN ไม่ถูกต้อง');
  return {name:found[0][1],klass:found[0][2],scores:found.map(r=>({
    assessment:r[4],score:r[5],max:r[6],note:r[7]
  }))};
}
