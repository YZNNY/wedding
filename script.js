(() => {
  const W = window.WEDDING;
  const $ = (s) => document.querySelector(s);
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : ""), W);
  const pad = (n) => String(n).padStart(2, "0");

  document.querySelectorAll("[data-f]").forEach((el) => (el.textContent = get(el.dataset.f)));

  const date = new Date(W.date);
  const daysKo = ["일", "월", "화", "수", "목", "금", "토"];
  const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const h = date.getHours(), min = date.getMinutes();
  const timeKo = `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}시${min ? ` ${min}분` : ""}`;

  // ── 인트로 봉투 ──
  const intro = $("#intro"), env = $("#envelope");
  const dateKo = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${daysKo[date.getDay()]}요일 ${timeKo}`;
  $("#envFront").innerHTML = `${dateKo}<br /><span class="env-venue">${W.venue.name}</span>`;
  document.body.classList.add("locked");
  const openEnvelope = () => {
    if (env.classList.contains("open")) return;
    env.classList.add("open");
    $("#openBtn").classList.add("hide");
    setTimeout(() => { intro.classList.add("gone"); document.body.classList.remove("locked"); }, 2600);
    setTimeout(() => intro.remove(), 3600);
  };
  env.addEventListener("click", openEnvelope);
  $("#openBtn").addEventListener("click", openEnvelope);

  // ── 커버 ──
  $("#message").innerHTML = W.message.split(/,\s*/).map((p, i, a) => `<span>${p}${i < a.length - 1 ? "," : ""}</span>`).join("");
  $("#coverPhoto").innerHTML = `<img src="${W.coverPhoto}" alt="${W.groom.name}, ${W.bride.name} 웨딩 사진" fetchpriority="high" />`;
  $("#coverDate").textContent = dateKo;
  if (W.closingPhoto) $("#closingPhoto").innerHTML = `<img src="${W.closingPhoto}" alt="" loading="lazy" />`;
  $("#sign").textContent = `${W.groom.name} & ${W.bride.name}`;

  // ── 인사말 · 가족 ──
  $("#greeting").innerHTML = W.greeting.map((l) => l || "&nbsp;").join("<br />");
  const couple = [].concat(W.couplePhoto || []);
  if (couple.length) {
    $("#photoFrame").classList.toggle("grid", couple.length > 1);
    $("#photoFrame").innerHTML = `<span class="tape" aria-hidden="true"></span>
      <div class="photo-cells">${couple.map((src) => `<span class="cell"><img src="${src}" alt="${W.groom.name}, ${W.bride.name}" /></span>`).join("")}</div>
      <figcaption>${W.message} ♡</figcaption>`;
  } else $("#photoFrame").hidden = true;
  const parents = (p) => [p.father, p.mother].filter(Boolean).join(" · ");
  $("#groomParents").textContent = `${parents(W.groom)}의 ${W.groom.relation}`;
  $("#brideParents").textContent = `${parents(W.bride)}의 ${W.bride.relation}`;
  $("#contactRow").innerHTML = [["신랑", W.groom.phone], ["신부", W.bride.phone]]
    .filter(([, p]) => p).map(([who, p]) => `<a class="btn ghost" href="tel:${p}">${who}에게 연락하기</a>`).join("");

  // ── 날짜 · 달력 ──
  $("#when").textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${daysKo[date.getDay()]}) ${timeKo}`;
  const y = date.getFullYear(), m = date.getMonth();
  $("#calHead").textContent = monthsEn[m];
  const first = new Date(y, m, 1).getDay();
  const last = new Date(y, m + 1, 0).getDate();
  let cal = "<tr>" + daysKo.map((d) => `<th>${d}</th>`).join("") + "</tr><tr>";
  for (let i = 0; i < first; i++) cal += "<td></td>";
  for (let d = 1; d <= last; d++) {
    cal += `<td class="${d === date.getDate() ? "on" : ""}"><span>${d}</span></td>`;
    if ((first + d) % 7 === 0 && d !== last) cal += "</tr><tr>";
  }
  $("#calendar").innerHTML = cal + "</tr>";

  const tick = () => {
    const diff = date - new Date();
    if (diff <= 0) { $("#countdown").hidden = true; return; }
    const s = Math.floor(diff / 1000);
    $("#countdown").innerHTML = [[Math.floor(s / 86400), "DAYS"], [Math.floor(s / 3600) % 24, "HOURS"], [Math.floor(s / 60) % 60, "MINS"], [s % 60, "SECS"]]
      .map(([v, l]) => `<div><b>${pad(v)}</b><small>${l}</small></div>`).join("");
  };
  tick(); setInterval(tick, 1000);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dd = Math.round((new Date(y, m, date.getDate()) - today) / 86400000);
  $("#dday").innerHTML = dd > 0 ? `${W.groom.name.slice(-2)} ♥ ${W.bride.name.slice(-2)}의 결혼식이 <b>${dd}</b>일 남았습니다`
    : dd === 0 ? "오늘, 저희 결혼합니다 ♥" : `저희가 부부가 된 지 <b>${-dd}</b>일째예요`;

  const gfmt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const end = new Date(date.getTime() + 2 * 3600 * 1000);
  $("#gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE"
    + `&text=${encodeURIComponent(`${W.groom.name} ♥ ${W.bride.name} 결혼식`)}`
    + `&dates=${gfmt(date)}/${gfmt(end)}`
    + `&location=${encodeURIComponent(`${W.venue.name} ${W.venue.hall}`)}`;

  // ── 갤러리 ──
  const pics = W.gallery || [];
  const thumb = (src) => (src.includes("images/gallery/") ? src.replace(/\.jpg$/, "_t.jpg") : src);
  if (pics.length) {
    $("#gallerySec").hidden = false;
    const preview = W.galleryPreview || pics.length;
    $("#gallery").innerHTML = pics.map((src, i) =>
      `<div${i >= preview ? " hidden" : ""}><img src="${thumb(src)}" data-i="${i}" alt="웨딩 사진 ${i + 1}" loading="lazy" /></div>`).join("");
    if (pics.length > preview) {
      const more = $("#galleryMore");
      more.hidden = false;
      more.textContent = `사진 더보기 (${pics.length - preview})`;
      more.onclick = () => { $("#gallery").querySelectorAll("[hidden]").forEach((d) => (d.hidden = false)); more.hidden = true; };
    }
  }
  const lb = $("#lightbox"), lbImg = lb.querySelector("img");
  let cur = 0;
  const show = (i) => {
    cur = (i + pics.length) % pics.length;
    lbImg.src = pics[cur];
    $("#lbCount").textContent = `${cur + 1} / ${pics.length}`;
  };
  $("#gallery").addEventListener("click", (e) => {
    if (e.target.dataset.i) { show(+e.target.dataset.i); lb.hidden = false; document.body.classList.add("locked"); }
  });
  const closeLb = () => { lb.hidden = true; document.body.classList.remove("locked"); };
  lb.querySelector(".lb-prev").onclick = (e) => { e.stopPropagation(); show(cur - 1); };
  lb.querySelector(".lb-next").onclick = (e) => { e.stopPropagation(); show(cur + 1); };
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.matches(".lb-close")) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "Escape") closeLb();
  });
  let sx = null;
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });

  // ── 오시는 길 ──
  const q = encodeURIComponent(W.venue.name);
  $("#naverMap").href = `https://map.naver.com/p/search/${q}`;
  $("#kakaoMap").href = `https://map.kakao.com/link/search/${q}`;
  $("#tmap").href = `https://tmap.life/search?name=${q}`;
  $("#copyAddr").onclick = () => copy(W.venue.navAddress || W.venue.address, "주소가 복사되었습니다");
  $("#directions").innerHTML = W.venue.directions.map((d) => `
    <div class="dir">
      <span class="dir-icon">${ART.icon(d.icon)}</span>
      <div>
        <h3>${d.title}</h3>
        ${d.lines.map((l) => `<p>${l}</p>`).join("")}
        ${d.note ? `<p class="note">${d.note}</p>` : ""}
      </div>
    </div>`).join("");

  // ── 연락처 · 계좌 ──
  // 같은 사람(이름 기준)의 연락처 아래에 계좌를 붙여 한 칸으로 보여줌
  // 번호는 화면에 적지 않고 전화·문자 아이콘으로만 연결
  const icoTel = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/></svg>`;
  const icoSms = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.5 1.4 4.7 3.7 6.2L5 21l4.1-2.3c.9.2 1.9.3 2.9.3 5.5 0 10-3.6 10-8s-4.5-8-10-8zm-4 9.3a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"/></svg>`;
  const personHtml = (p) => `
    <div class="acc-item">
      <div class="acc-row">
        <p class="acc-who"><small>${p.role}</small><b>${p.name}</b></p>
        ${p.phone ? `<span class="acc-icons"><a href="tel:${p.phone}" aria-label="${p.name}에게 전화">${icoTel}</a><a href="sms:${p.phone}" aria-label="${p.name}에게 문자">${icoSms}</a></span>` : ""}
      </div>
      ${p.number ? `<div class="acc-row acc-bank">
        <p>${p.bank} ${p.number}</p>
        <button data-copy="${p.bank} ${p.number}">복사</button>
      </div>` : ""}
    </div>`;
  const contacts = W.contacts || { groom: [], bride: [] };
  [["groom", "#accGroom", "#accGroomWrap"], ["bride", "#accBride", "#accBrideWrap"]].forEach(([side, box, wrap]) => {
    const people = contacts[side].filter((c) => c.phone).map((c) => ({ ...c }));
    W.accounts[side].filter((a) => a.number).forEach((a) => {
      const p = people.find((x) => x.name === a.name);
      if (p) Object.assign(p, { bank: a.bank, number: a.number });
      else people.push({ ...a });
    });
    $(box).innerHTML = people.map(personHtml).join("");
    $(wrap).hidden = !people.length;
  });
  $("#accountSec").hidden = $("#accGroomWrap").hidden && $("#accBrideWrap").hidden;
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-copy]");
    if (t) copy(t.dataset.copy, "계좌번호가 복사되었습니다");
  });

  if (W.rsvpUrl) { $("#rsvp").href = W.rsvpUrl; $("#rsvp").hidden = false; }

  // ── 링크 복사 ──
  $("#copyLink").onclick = () => copy(location.href, "링크가 복사되었습니다");

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  // ── 방명록 ──
  if (W.sheetApi) {
    $("#guestbookSec").hidden = false;
    let entries = [], shown = 5;
    const fmt = (t) => { const d = new Date(t); return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`; };
    const renderGb = () => {
      $("#gbList").innerHTML = entries.length
        ? entries.slice(0, shown).map((e) => `<li><p class="gb-msg">${esc(e.message)}</p><p class="gb-meta"><b>${esc(e.name)}</b><span>${fmt(e.time)}</span></p></li>`).join("")
        : `<li class="empty">첫 번째 축하 메시지를 남겨주세요 ♡</li>`;
      $("#gbMore").hidden = entries.length <= shown;
    };
    $("#gbList").innerHTML = `<li class="empty">불러오는 중…</li>`;
    api("guestbook").then((r) => { entries = r.entries || []; renderGb(); })
      .catch(() => ($("#gbList").innerHTML = `<li class="empty">방명록을 불러오지 못했어요</li>`));
    $("#gbMore").onclick = () => { shown += 10; renderGb(); };
    $("#gbName").value = store.get("gb-name") || "";
    $("#gbMessage").addEventListener("input", (e) => ($("#gbCount").textContent = `${e.target.value.length} / 300`));
    $("#gbForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#gbName").value.trim(), message = $("#gbMessage").value.trim();
      if (!name || !message) return;
      const btn = $("#gbSubmit");
      btn.disabled = true; btn.textContent = "남기는 중…";
      store.set("gb-name", name);
      api("guestbook", { name, message })
        .then((r) => {
          if (!r.ok) throw new Error(r.error);
          entries = r.entries; shown = Math.max(shown, 5); renderGb();
          $("#gbMessage").value = ""; $("#gbCount").textContent = "0 / 300";
          toast("축하 메시지가 등록되었어요 ♡");
        })
        .catch(() => toast("등록에 실패했어요. 잠시 후 다시 시도해주세요."))
        .finally(() => { btn.disabled = false; btn.textContent = "남기기"; });
    });
  }

  // ── 배경음악 ──
  if (W.bgm) {
    const a = $("#bgm"), b = $("#bgmBtn");
    a.src = W.bgm; b.hidden = false;
    b.onclick = () => (a.paused ? a.play() : a.pause());
    a.onplay = () => b.classList.add("playing");
    a.onpause = () => b.classList.remove("playing");
  }

  // ── 스크롤 등장 ──
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // 구글 시트 웹 앱 호출 (POST는 text/plain으로 보내 사전 요청 없이 전송)
  function api(action, data) {
    const req = data
      ? fetch(W.sheetApi, { method: "POST", body: JSON.stringify({ action, ...data }) })
      : fetch(`${W.sheetApi}?action=${action}`);
    return req.then((r) => r.json());
  }
  function esc(t) {
    return String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function copy(text, msg) {
    const done = () => toast(msg);
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => fallback(text, done));
    else fallback(text, done);
  }
  function fallback(text, done) {
    const t = document.createElement("textarea");
    t.value = text; document.body.appendChild(t); t.select();
    document.execCommand("copy"); t.remove(); done();
  }
  let tt;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800);
  }
})();
