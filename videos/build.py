#!/usr/bin/env python3
"""Render the Veneta promo: scenes -> HTML -> PNG (Edge headless) + voiceover (say) -> MP4 (ffmpeg).
Run: python3 videos/build.py   Output: videos/veneta-promo.mp4, videos/veneta-promo.vi.srt
Edit SCENES to change copy. Scene length = voiceover length + PAD. See README.md."""
import html, json, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "build"
EDGE = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
VOICE = "Samantha"
PAD = 0.9  # seconds of silence after each line
W, H, FPS = 1920, 1080, 30

DISCLAIMER = ("For information only; not an offer or solicitation to buy securities. All investments involve risk, "
              "including loss of principal. EB-5 outcomes depend on USCIS approval and individual circumstances, which are not guaranteed.")
DISCLAIMER_VI = ("Chỉ mang tính thông tin; không phải chào bán hay mời mua chứng khoán. Mọi khoản đầu tư đều có rủi ro, "
                 "kể cả mất vốn. Kết quả EB-5 phụ thuộc vào sự chấp thuận của USCIS và hoàn cảnh cá nhân, không được đảm bảo.")

# kind: title | stats | list | steps | stack | end.  body = kind-specific content.
SCENES = [
    dict(kind="title", kicker="BD Ventures", head="Your family's future<br>in America.",
         en="What if your family's future in America started with a real, permitted apartment community?",
         vi="Nếu tương lai của gia đình bạn tại Mỹ bắt đầu từ một khu căn hộ có thật, đã được cấp phép thì sao?"),
    dict(kind="title", kicker="Multifamily Investment Opportunity", head="Veneta Apartments",
         sub="Lane County, Oregon &nbsp;·&nbsp; 128 Units",
         en="Introducing Veneta Apartments: 128 market-rate homes in Lane County, Oregon.",
         vi="Giới thiệu Veneta Apartments: 128 căn hộ tại Lane County, bang Oregon."),
    dict(kind="stats", kicker="The Project", head="A real project, already moving",
         stats=[("$28.9M", "Total project cost"), ("5.34", "Acres"), ("5 + 1", "Buildings + clubhouse")],
         ticks=["Permits obtained", "Land acquired", "Site work commenced"],
         en="A $28.9 million development. Permits obtained, land acquired, site work under way.",
         vi="Dự án 28,9 triệu đô la. Đã có giấy phép, đã mua đất, đang san lấp mặt bằng."),
    dict(kind="list", kicker="The Community", head="First new multifamily in Veneta in 10+ years",
         items=["Swimming pool", "Fitness center", "Gated entry", "Playground"],
         en="The first significant new apartments in Veneta in over a decade, with a pool, fitness center, gated entry and playground.",
         vi="Khu căn hộ mới đáng kể đầu tiên tại Veneta sau hơn mười năm, có hồ bơi, phòng gym, cổng an ninh và sân chơi."),
    dict(kind="stats", kicker="The Developer", head="HT Investment Properties",
         stats=[("3,200+", "Rental units developed"), ("1,000+", "Senior living units"), ("1998", "Developing since")],
         en="Built by HT Investment Properties, with more than 3,200 rental units and 1,000 senior living units developed since 1998.",
         vi="Do HT Investment Properties thực hiện, với hơn 3.200 căn hộ cho thuê và 1.000 căn nhà cho người cao tuổi đã phát triển từ năm 1998."),
    dict(kind="stats", kicker="What is EB-5?", head="Invest in U.S. jobs.<br>Earn U.S. permanent residency.",
         stats=[("$800,000", "Minimum investment<br>in a qualifying rural area (Veneta qualifies)"), ("10+", "Full-time U.S. jobs<br>supported per investor")],
         en="EB-5 is a U.S. government program that grants permanent residency to investors whose capital creates American jobs. In a qualifying area like Veneta, the investment starts at $800,000, and your capital must support at least ten full-time jobs.",
         vi="EB-5 là chương trình của chính phủ Hoa Kỳ cấp thường trú nhân cho nhà đầu tư có vốn tạo việc làm tại Mỹ. Tại khu vực đủ điều kiện như Veneta, mức đầu tư từ 800.000 đô la, và vốn phải hỗ trợ ít nhất mười việc làm toàn thời gian."),
    dict(kind="list", kicker="One Investment. Whole Family.", head="Green Card eligibility for",
         items=["The investor", "Spouse", "All unmarried children under 21"],
         en="One investment covers your whole family: you, your spouse, and every unmarried child under 21.",
         vi="Một khoản đầu tư cho cả gia đình: bạn, vợ/chồng và tất cả con chưa kết hôn dưới 21 tuổi."),
    dict(kind="stack", kicker="Capital Structure", head="A loan to the project,<br>backed by a real asset",
         segs=[("Developer", "10%", 10), ("Bank financing", "40–50%", 45), ("EB-5 capital", "40–50%", 45)],
         sub="128-unit property &nbsp;·&nbsp; Zephyrus Regional Center, Lane County",
         en="Your capital is a loan to the project, backed by a real 128-unit property, through the approved Zephyrus Regional Center.",
         vi="Vốn của bạn là khoản vay cho dự án, được bảo chứng bằng tài sản 128 căn hộ thực, thông qua Zephyrus Regional Center đã được phê duyệt."),
    dict(kind="steps", kicker="How BD Ventures Helps", head="With you from the first call",
         steps=["Consultation", "Project review", "Eligibility check", "Source-of-Funds preparation"],
         sub="Together with Hirson EB-5 legal counsel",
         en="The BD Ventures team guides you from the first consultation: reviewing the project, your eligibility, and your source of funds, together with Hirson EB-5 legal counsel.",
         vi="Đội ngũ BD Ventures đồng hành từ buổi tư vấn đầu tiên: xem xét dự án, điều kiện của bạn và nguồn tiền, cùng luật sư Hirson EB-5."),
    dict(kind="steps", kicker="Your Path to the Green Card", head="From investment to permanent residency",
         steps=["Invest", "File I-526E petition", "Approval &amp; visa issuance", "2-year Conditional Green Card — whole family",
                "File I-829 to remove conditions", "Permanent Green Card"],
         en="You invest and file your petition. After approval, your family receives a conditional Green Card. When the project's requirements are met, you file to remove conditions, and your family becomes permanent residents.",
         vi="Bạn đầu tư và nộp hồ sơ. Sau khi được chấp thuận, gia đình nhận thẻ xanh có điều kiện. Khi dự án đáp ứng yêu cầu, bạn nộp đơn gỡ điều kiện và cả gia đình trở thành thường trú nhân."),
    dict(kind="list", kicker="Life with a Green Card", head="What it means for your family",
         items=["Live, work and study anywhere in the U.S.", "In-state university tuition", "Access to U.S. healthcare",
                "No English or business-management requirement"],
         en="Then your family can live, work and study anywhere in the United States, enjoy in-state university tuition, and access U.S. healthcare.",
         vi="Khi đó cả gia đình có thể sống, làm việc và học tập ở bất cứ đâu tại Mỹ, hưởng học phí nội bang đại học và tiếp cận hệ thống y tế Hoa Kỳ."),
    dict(kind="end", kicker="Veneta Apartments · EB-5", head="Request your consultation",
         sub="BD Ventures", min_dur=7.0,
         en="Talk to the BD Ventures team today. Request your consultation.",
         vi="Hãy liên hệ đội ngũ BD Ventures ngay hôm nay để được tư vấn."),
]

CSS = f"""
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
:root{{--navy:#0d2545;--navy2:#1a3a6b;--gold:#c9a84c;--ivory:#faf8f3;}}
*{{box-sizing:border-box;margin:0}}
html,body{{width:{W}px;height:{H}px;overflow:hidden}}
body{{font:400 34px/1.4 'Inter',system-ui,sans-serif;color:var(--ivory);
 background:linear-gradient(160deg,var(--navy) 0%,var(--navy2) 55%,var(--navy) 100%);position:relative}}
.main{{position:absolute;inset:0 0 230px 0;padding:90px 140px 0;display:flex;flex-direction:column;justify-content:center}}
.kicker{{font:600 26px 'Inter';letter-spacing:.32em;text-transform:uppercase;color:var(--gold);margin-bottom:28px}}
h1{{font:700 84px/1.12 'Playfair Display',Georgia,serif;margin-bottom:30px}}
.rule{{width:90px;height:4px;background:var(--gold);margin:0 0 40px}}
.sub{{font:400 38px 'Inter';color:#d6dbe6;margin-top:30px}}
.row{{display:flex;gap:90px;margin-top:20px}}
.stat b{{display:block;font:700 108px/1 'Playfair Display',serif;color:var(--gold)}}
.stat span{{display:block;font:400 28px/1.35 'Inter';color:#d6dbe6;margin-top:14px}}
ul{{list-style:none;margin-top:6px}}
li{{font:500 44px/1.3 'Inter';padding:14px 0 14px 54px;position:relative}}
li::before{{content:'';position:absolute;left:0;top:30px;width:24px;height:4px;background:var(--gold)}}
li.tick::before{{content:'✓';background:none;color:var(--gold);top:8px;font-size:40px;width:auto;height:auto}}
.ticks{{display:flex;gap:60px;margin-top:44px}} .ticks li{{font-size:34px;padding-left:44px}}
.steps{{counter-reset:s;display:grid;grid-template-columns:1fr 1fr;gap:18px 70px;margin-top:10px}}
.steps div{{counter-increment:s;font:500 34px/1.3 'Inter';padding-left:76px;position:relative;min-height:60px}}
.steps div::before{{content:counter(s);position:absolute;left:0;top:-4px;width:56px;height:56px;border-radius:50%;
 background:var(--gold);color:var(--navy);font:700 30px/56px 'Inter';text-align:center}}
.steps.one{{grid-template-columns:1fr}}
.bar{{display:flex;height:96px;margin-top:20px;border:2px solid var(--gold)}}
.bar div{{display:flex;flex-direction:column;justify-content:center;align-items:center;font:500 24px/1.3 'Inter';color:var(--navy);background:var(--gold)}}
.bar div:nth-child(2){{background:#e4d7aa}} .bar div:nth-child(3){{background:var(--ivory)}}
.bar b{{font:700 34px 'Playfair Display',serif}}
.brandmark{{position:absolute;top:44px;right:80px;font:700 26px 'Playfair Display';color:var(--gold);letter-spacing:.06em}}
.sub-vi{{position:absolute;left:0;right:0;bottom:0;height:230px;padding:0 160px;display:flex;align-items:center;justify-content:center;
 text-align:center;background:rgba(5,15,30,.78);font:500 42px/1.4 'Inter',system-ui,sans-serif;color:#fff;border-top:3px solid var(--gold)}}
.disc{{margin-top:50px;font:300 22px/1.45 'Inter';color:#aeb7c8}}
h1,.stat b,.bar b{{font-variant-numeric:lining-nums}}
.disc i{{display:block;margin-top:8px;font-style:normal}}
"""


def body(s):
    k = s["kind"]
    kicker = f'<p class="kicker">{s["kicker"]}</p>'
    head = f'<h1>{s["head"]}</h1><div class="rule"></div>'
    sub = f'<p class="sub">{s["sub"]}</p>' if s.get("sub") else ""
    if k == "title":
        return kicker + head + sub
    if k == "stats":
        stats = '<div class="row">' + "".join(f'<div class="stat"><b>{a}</b><span>{b}</span></div>' for a, b in s["stats"]) + "</div>"
        ticks = ('<ul class="ticks">' + "".join(f'<li class="tick">{t}</li>' for t in s["ticks"]) + "</ul>") if s.get("ticks") else ""
        return kicker + head + stats + ticks
    if k == "list":
        return kicker + head + "<ul>" + "".join(f"<li>{i}</li>" for i in s["items"]) + "</ul>"
    if k == "steps":
        cls = "steps" + (" one" if len(s["steps"]) > 4 and False else "")
        return kicker + head + f'<div class="{cls}">' + "".join(f"<div>{t}</div>" for t in s["steps"]) + "</div>" + sub
    if k == "stack":
        total = sum(w for *_, w in s["segs"])
        bar = '<div class="bar">' + "".join(f'<div style="width:{w * 100 / total}%"><b>{p}</b>{n}</div>' for n, p, w in s["segs"]) + "</div>"
        return kicker + head + bar + sub
    if k == "end":
        return kicker + head + sub + f'<div class="disc">{DISCLAIMER}<i>{DISCLAIMER_VI}</i></div>'
    raise ValueError(k)


def page(s, subtitle=True):
    sub = f'<div class="sub-vi">{html.escape(s["vi"])}</div>' if subtitle else ""
    return (f'<!doctype html><meta charset="utf-8"><style>{CSS}</style><body>'
            f'<div class="brandmark">BD VENTURES</div><div class="main">{body(s)}</div>{sub}</body>')


def run(*a, **kw):
    return subprocess.run(a, check=True, capture_output=True, text=True, **kw)


def duration(p):
    return float(run("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)).stdout)


def srt_time(t):
    h, r = divmod(t, 3600); m, r = divmod(r, 60)
    return f"{int(h):02}:{int(m):02}:{int(r):02},{int(round((r % 1) * 1000)):03}"


def main():
    OUT.mkdir(exist_ok=True)
    clips, srt, t = [], [], 0.0
    for i, s in enumerate(SCENES, 1):
        n = f"{i:02}"
        (OUT / f"{n}.html").write_text(page(s), encoding="utf-8")
        run(EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--window-size={W},{H}",
            "--virtual-time-budget=15000", f"--screenshot={OUT / (n + '.png')}", f"file://{OUT / (n + '.html')}")
        run("say", "-v", VOICE, "-r", "165", "-o", str(OUT / f"{n}.aiff"), s["en"])
        dur = max(duration(OUT / f"{n}.aiff") + PAD, s.get("min_dur", 0))
        # still -> clip with slow zoom, padded audio, fade in/out
        run("ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-framerate", str(FPS), "-t", f"{dur:.3f}", "-i", str(OUT / f"{n}.png"),
            "-i", str(OUT / f"{n}.aiff"),
            "-filter_complex",
            f"[0:v]scale=2400:-1,zoompan=z='1+0.04*on/({dur:.3f}*{FPS})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},"
            f"fade=t=in:d=0.4,fade=t=out:st={dur - 0.4:.3f}:d=0.4,format=yuv420p[v];"
            f"[1:a]aresample=44100,apad,atrim=0:{dur:.3f}[a]",
            "-map", "[v]", "-map", "[a]", "-t", f"{dur:.3f}", "-r", str(FPS), "-c:v", "libx264", "-crf", "18", "-c:a", "aac",
            str(OUT / f"{n}.mp4"))
        clips.append(OUT / f"{n}.mp4")
        srt.append(f"{i}\n{srt_time(t + 0.3)} --> {srt_time(t + dur - PAD + 0.3)}\n{s['vi']}\n")
        t += dur
    (OUT / "list.txt").write_text("".join(f"file '{c}'\n" for c in clips))
    run("ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(OUT / "list.txt"), "-c", "copy",
        str(HERE / "veneta-promo.mp4"))
    (HERE / "veneta-promo.vi.srt").write_text("\n".join(srt), encoding="utf-8")
    print(f"done: {t:.1f}s -> {HERE / 'veneta-promo.mp4'}")


if __name__ == "__main__":
    main()
