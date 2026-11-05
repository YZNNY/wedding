"""청첩장 인쇄용 QR코드 생성기

사용법:
    python3 qr/make_qr.py https://내아이디.github.io/wedding/

qr 폴더에 아래 파일이 만들어집니다.
    wedding-qr.svg       인쇄소 전달용 (벡터, 아무리 키워도 깨지지 않음)
    wedding-qr.png       흰 배경, 진한 모브색 (고해상도 2000px)
    wedding-qr-card.png  핑크 카드 디자인 버전 (QR + 안내 문구)

필요 패키지: pip install "qrcode[pil]"
"""
import sys
from pathlib import Path

import qrcode
import qrcode.image.svg
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
INK = (110, 70, 78)        # 진한 모브 (인쇄 대비 충분)
PINK = (246, 232, 228)
ROSE = (201, 154, 154)


def build(url):
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_Q,  # 인쇄 얼룩/접힘에 강하게
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    return qr


def main():
    if len(sys.argv) < 2:
        sys.exit("주소를 넣어주세요. 예) python3 qr/make_qr.py https://아이디.github.io/wedding/")
    url = sys.argv[1]
    qr = build(url)

    # 1) SVG (인쇄소용)
    svg = qr.make_image(image_factory=qrcode.image.svg.SvgPathFillImage)
    svg.save(OUT / "wedding-qr.svg")

    # 2) 고해상도 PNG
    img = qr.make_image(fill_color=INK, back_color="white").convert("RGB")
    img = img.resize((2000, 2000), Image.NEAREST)
    img.save(OUT / "wedding-qr.png", dpi=(600, 600))

    # 3) 핑크 카드 버전 (QR 영역은 흰 바탕 유지 → 인식률 보장)
    W, H = 1500, 1740
    card = Image.new("RGB", (W, H), PINK)
    d = ImageDraw.Draw(card)
    d.rounded_rectangle((60, 60, W - 60, H - 60), radius=40, outline=ROSE, width=4)
    q = img.resize((1000, 1000), Image.NEAREST)
    pad = 40
    d.rounded_rectangle((250 - pad, 360 - pad, 1250 + pad, 1360 + pad), radius=30, fill="white")
    card.paste(q, (250, 360))

    font = find_font()
    title = ImageFont.truetype(font, 92) if font else ImageFont.load_default()
    small = ImageFont.truetype(font, 56) if font else ImageFont.load_default()
    center(d, "모바일 청첩장", 200, title, INK)
    center(d, "카메라로 QR을 비춰주세요", 1520, small, ROSE)
    card.save(OUT / "wedding-qr-card.png", dpi=(300, 300))

    print(f"완료: {url}\n -> {OUT}")


def center(d, text, y, font, fill):
    w = d.textbbox((0, 0), text, font=font)[2]
    d.text(((1500 - w) / 2, y), text, font=font, fill=fill)


def find_font():
    for p in [
        "/System/Library/Fonts/Supplemental/AppleMyungjo.ttf",
        "/System/Library/Fonts/AppleSDGothicNeo.ttc",
        "/Library/Fonts/NanumMyeongjo.ttf",
        "C:/Windows/Fonts/batang.ttc",
        "C:/Windows/Fonts/malgun.ttf",
    ]:
        if Path(p).exists():
            return p
    return None


if __name__ == "__main__":
    main()
