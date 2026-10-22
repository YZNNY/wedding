// ─────────────────────────────────────────────
//  청첩장 내용은 이 파일만 고치면 됩니다.
//  (따옴표 안의 글자만 바꿔주세요. 비워두면 화면에서 자동으로 숨겨져요)
// ─────────────────────────────────────────────
window.WEDDING = {
  message: "Become Us, More Us.",

  groom: {
    name: "안태건",
    father: "",
    mother: "조경희",
    relation: "아들",
    phone: "",
  },
  bride: {
    name: "이유진",
    father: "이완열",
    mother: "윤정옥",
    relation: "딸",
    phone: "",
  },

  // 예식 일시 (24시간 형식)
  date: "2026-12-13T15:00:00",

  venue: {
    name: "서울대학교 호암교수회관",
    hall: "베리타스홀",
    address: "서울시 관악구 관악로 1 서울대학교 호암교수회관",
    navAddress: "서울시 관악구 관악로 1",
    tel: "",
    directions: [
      {
        icon: "subway",
        title: "지하철",
        lines: [
          "2호선 낙성대역 4번 출구",
          "→ GS주유소 → [장블랑제리] 제과점 앞에서 마을버스 [관악-02번] 승차",
          "→ 호암교수회관 하차 (5분 거리)",
        ],
      },
      {
        icon: "bus",
        title: "버스",
        lines: [
          "461, 641, 643, 5413, 5424, 5520, 5524, 5528 이용 낙성대 하차",
          "→ GS주유소 → [장블랑제리] 제과점 앞에서 마을버스 [관악-02번] 승차",
          "→ 호암교수회관 하차 (5분 거리)",
        ],
      },
      {
        icon: "car",
        title: "승용차",
        lines: [
          "남부순환도로에서 낙성대(이정표: 서울대 후문) 방면으로 좌회전",
          "→ 1.5km 직진하여 좌측에 위치",
        ],
        note: "내비게이션 주소 : 서울시 관악구 관악로 1",
      },
      {
        icon: "highway",
        title: "경부고속도로를 이용하는 경우",
        lines: [
          "서초IC에서 사당 방면으로 P턴",
          "→ 남부순환로 이용하여 낙성대(이정표: 서울대 후문) 방면으로 좌회전",
          "→ 1.5km 직진하여 좌측에 위치",
        ],
      },
    ],
  },

  greeting: [
    "함께할수록 서로에게 더 좋은 사람이 되어 온 두 사람,",
    "서로를 가장 깊이 이해하는 우리가 되어가려 합니다.",
    "",
    "기쁜 자리에 귀한 걸음 하시어",
    "<b>저희의 새로운 시작을 함께해주세요!</b>",
  ],

  // 첫 화면 사진 · 마지막 감사 인사 사진
  coverPhoto: "images/gallery/HSW01607.jpg",
  closingPhoto: "images/gallery/HSW01317.jpg",

  // 인사말 아래 폴라로이드 사진: 4장이면 2×2 네컷으로 붙여서 보여줘요 (1장만 넣으면 한 장짜리 폴라로이드)
  couplePhoto: ["images/booth/01.jpg", "images/booth/02.jpg", "images/booth/03.jpg", "images/booth/04.jpg"],

  // 갤러리 사진: images/gallery 폴더의 사진을 아래 순서대로 보여줍니다. (앞의 9장이 처음 화면에 보여요)
  // 순서를 바꾸거나 빼려면 아래 이름만 고치세요. (pictures 폴더 원본 파일 이름과 같아요)
  gallery: [
    "HSW00247", "HSW01432", "HSW00386", "HSW00704", "HSW01317",
    "HSW01607", "HSW01747", "HSW00571", "HSW00087", "HSW00199",
    "HSW00209", "HSW00236", "HSW00261", "HSW00289", "HSW00335",
    "HSW00894", "HSW00898", "HSW01126", "HSW01518", "HSW01546",
    "HSW01649", "HSW01730", "HSW01736", "HSW01789",
  ].map((n) => `images/gallery/${n}.jpg`),
  // 처음에 보여줄 사진 수 (나머지는 '더보기'로 펼쳐짐)
  galleryPreview: 9,

  // 연락처: 계좌 칸(신랑측·신부측) 안에서 계좌보다 위에 보여요.
  contacts: {
    groom: [
      { role: "신랑", name: "안태건", phone: "010-4195-6622" },
      { role: "신랑 모", name: "조경희", phone: "010-3296-6622" },
    ],
    bride: [
      { role: "신부", name: "이유진", phone: "010-7224-3474" },
      { role: "신부 부", name: "이완열", phone: "010-3004-2887" },
      { role: "신부 모", name: "윤정옥", phone: "010-8774-3474" },
    ],
  },

  // 계좌: 비어 있는 쪽은 화면에서 숨겨집니다.
  accounts: {
    groom: [
      { role: "신랑", name: "안태건", bank: "신한은행", number: "110-207-142074" },
      { role: "신랑 모", name: "조경희", bank: "신한은행", number: "901-06-350769" },
    ],
    bride: [
      { role: "신부", name: "이유진", bank: "카카오뱅크", number: "3333-09-9170256" },
      { role: "신부 부", name: "이완열", bank: "하나은행", number: "121-890290-52907" },
      { role: "신부 모", name: "윤정옥", bank: "국민은행", number: "598002-01-220643" },
    ],
  },

  // 참석 여부를 구글폼 등으로 받으려면 주소를 넣으세요. 비우면 버튼이 숨겨집니다.
  rsvpUrl: "",

  // 방명록을 저장할 구글 시트 웹 앱 주소 (apps-script/설정방법.md 참고)
  // 비워두면 방명록은 숨겨집니다.
  sheetApi: "https://script.google.com/macros/s/AKfycbwhfJf1RCiKzOVdt5bOydAOXOAZSbNd69z9Li1BQuGblMSGdJkTq3tCUJqf3e8YPYSTqQ/exec",

  // 배경음악 파일 경로 (예: "music/bgm.mp3"). 비우면 음악 버튼이 숨겨집니다.
  bgm: "",
};
