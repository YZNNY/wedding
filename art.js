// 오시는 길 아이콘 (라인 스타일)
window.ART = (() => {
  const icons = {
    subway: `<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8.5 17 6.5 21M15.5 17l2 4"/><circle cx="9" cy="14" r=".8"/><circle cx="15" cy="14" r=".8"/>`,
    bus: `<rect x="4" y="3" width="16" height="15" rx="2.5"/><path d="M4 12h16M4 7h16M7 18v2.5M17 18v2.5"/><circle cx="8" cy="15" r=".8"/><circle cx="16" cy="15" r=".8"/>`,
    car: `<path d="M4 16v-4l2.5-5h11L20 12v4z"/><path d="M4 12h16"/><circle cx="8" cy="16.5" r="1.8"/><circle cx="16" cy="16.5" r="1.8"/>`,
    highway: `<path d="M7 21 10 3M17 21 14 3M12 5.5v2M12 10.5v2M12 15.5v2.5"/>`,
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ""}</svg>`;
  return { icon };
})();
