/**
 * 모바일 청첩장 방명록 저장소 (Google Apps Script)
 *
 * 구글 시트의 [확장 프로그램 → Apps Script]에 이 코드를 통째로 붙여넣고
 * [배포 → 새 배포 → 웹 앱]으로 배포하세요. (실행: 나, 액세스: 모든 사용자)
 *
 * 시트 탭 '방명록'은 처음 글이 등록될 때 자동으로 만들어집니다.
 * 부적절한 글은 시트에서 그 줄을 지우면 청첩장에서도 사라져요.
 */

const MAX_NAME = 12;
const MAX_MESSAGE = 300;

function doGet(e) {
  const action = (e.parameter && e.parameter.action) || '';
  if (action === 'guestbook') return json({ ok: true, entries: guestbook_() });
  return json({ ok: false, error: 'unknown action' });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'bad json' }); }
  if (body.action !== 'guestbook') return json({ ok: false, error: 'unknown action' });
  const name = clean_(body.name, MAX_NAME);
  const message = clean_(body.message, MAX_MESSAGE);
  if (!name || !message) return json({ ok: false, error: '이름과 메시지를 적어주세요' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date(), name, message]);
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true, entries: guestbook_() });
}

function guestbook_() {
  const sh = sheet_();
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues()
    .filter((r) => r[1] && r[2])
    .map((r) => ({ time: new Date(r[0]).getTime(), name: String(r[1]), message: String(r[2]) }))
    .reverse()
    .slice(0, 300);
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('방명록');
  if (!sh) { sh = ss.insertSheet('방명록'); sh.appendRow(['시간', '이름', '메시지']); sh.setFrozenRows(1); }
  return sh;
}

// 앞뒤 공백·제어문자 제거(줄바꿈은 유지), 길이 제한, 시트 수식으로 실행되지 않게 처리
function clean_(v, max) {
  const s = String(v == null ? '' : v).replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
