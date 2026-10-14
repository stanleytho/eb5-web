// One entry per scene. Edit copy/timing here; footage files go in public/footage/, voice in public/audio/voiceover.*
// Real project photos/renderings: put them in public/footage/ and point `footage` at them (.mp4 or .jpg).
export type Scene = {
  footage: string; // file in public/footage/ — .mp4 plays, .jpg/.png gets a slow Ken Burns move
  seconds: number; // target length; re-time once the real voiceover is recorded
  kicker?: string;
  head: string;
  chips?: string[]; // short key facts shown as gold tags
  en: string; // voiceover line (recording script)
  vi: string; // Vietnamese subtitle
  illustrative?: boolean; // generic stock, not the Veneta site — shows an "Illustrative" tag
};

export const SCENES: Scene[] = [
  { footage: "01.jpg", seconds: 6.11, illustrative: true, head: "Your family's future in America.",
    en: "What if your family's future in America started with a real, permitted apartment community?",
    vi: "Nếu tương lai của gia đình bạn tại Mỹ bắt đầu từ một khu căn hộ có thật, đã được cấp phép thì sao?" },
  { footage: "02.jpg", seconds: 7.48, kicker: "Multifamily Investment Opportunity", head: "Veneta Apartments",
    chips: ["Lane County, Oregon", "128 units"],
    en: "Introducing Veneta Apartments: 128 market-rate homes in Lane County, Oregon.",
    vi: "Giới thiệu Veneta Apartments: 128 căn hộ tại Lane County, bang Oregon." },
  { footage: "03.jpg", seconds: 7.76, illustrative: true, kicker: "The Project", head: "A real project, already moving",
    chips: ["$28.9M", "5.34 acres", "Permits ✓", "Land ✓", "Site work ✓"],
    en: "A $28.9 million development. Permits obtained, land acquired, site work under way.",
    vi: "Dự án 28,9 triệu đô la. Đã có giấy phép, đã mua đất, đang san lấp mặt bằng." },
  { footage: "04.jpg", seconds: 9.18, illustrative: true, kicker: "The Community", head: "First new multifamily in Veneta in 10+ years",
    chips: ["Pool", "Fitness center", "Gated entry", "Playground"],
    en: "The first significant new apartments in Veneta in over a decade, with a pool, fitness center, gated entry and playground.",
    vi: "Khu căn hộ mới đáng kể đầu tiên tại Veneta sau hơn mười năm, có hồ bơi, phòng gym, cổng an ninh và sân chơi." },
  { footage: "05.jpg", seconds: 11.17, illustrative: true, kicker: "The Developer", head: "HT Investment Properties",
    chips: ["3,200+ rental units", "1,000+ senior living", "Since 1998"],
    en: "Built by HT Investment Properties, with more than 3,200 rental units and 1,000 senior living units developed since 1998.",
    vi: "Do HT Investment Properties thực hiện, với hơn 3.200 căn hộ cho thuê và 1.000 căn nhà cho người cao tuổi đã phát triển từ năm 1998." },
  { footage: "06.jpg", seconds: 18.78, illustrative: true, kicker: "What is EB-5?", head: "Invest in U.S. jobs. Earn U.S. permanent residency.",
    chips: ["$800,000 minimum (qualifying rural area)", "10+ full-time U.S. jobs per investor"],
    en: "EB-5 is a U.S. government program that grants permanent residency to investors whose capital creates American jobs. In a qualifying area like Veneta, the investment starts at $800,000, and your capital must support at least ten full-time jobs.",
    vi: "EB-5 là chương trình của chính phủ Hoa Kỳ cấp thường trú nhân cho nhà đầu tư có vốn tạo việc làm tại Mỹ. Tại khu vực đủ điều kiện như Veneta, mức đầu tư từ 800.000 đô la, và vốn phải hỗ trợ ít nhất mười việc làm toàn thời gian." },
  { footage: "07.jpg", seconds: 8.0, illustrative: true, kicker: "One Investment. Whole Family.", head: "Green Card eligibility for the whole family",
    chips: ["The investor", "Spouse", "Children under 21"],
    en: "One investment covers your whole family: you, your spouse, and every unmarried child under 21.",
    vi: "Một khoản đầu tư cho cả gia đình: bạn, vợ/chồng và tất cả con chưa kết hôn dưới 21 tuổi." },
  { footage: "08.jpg", seconds: 9.47, illustrative: true, kicker: "Capital Structure", head: "A loan to the project, backed by a real asset",
    chips: ["Developer 10%", "Bank 40–50%", "EB-5 40–50%", "Zephyrus Regional Center"],
    en: "Your capital is a loan to the project, backed by a real 128-unit property, through the approved Zephyrus Regional Center.",
    vi: "Vốn của bạn là khoản vay cho dự án, được bảo chứng bằng tài sản 128 căn hộ thực, thông qua Zephyrus Regional Center đã được phê duyệt." },
  { footage: "09.jpg", seconds: 12.4, illustrative: true, kicker: "How BD Ventures Helps", head: "With you from the first call",
    chips: ["Consultation", "Project review", "Eligibility check", "Source of Funds", "with Hirson EB-5 counsel"],
    en: "The BD Ventures team guides you from the first consultation: reviewing the project, your eligibility, and your source of funds, together with Hirson EB-5 legal counsel.",
    vi: "Đội ngũ BD Ventures đồng hành từ buổi tư vấn đầu tiên: xem xét dự án, điều kiện của bạn và nguồn tiền, cùng luật sư Hirson EB-5." },
  { footage: "10.jpg", seconds: 14.56, illustrative: true, kicker: "Your Path to the Green Card", head: "From investment to permanent residency",
    chips: ["Invest", "I-526E", "Visa", "2-year Conditional Green Card", "I-829", "Permanent Green Card"],
    en: "You invest and file your petition. After approval, your family receives a conditional Green Card. When the project's requirements are met, you file to remove conditions, and your family becomes permanent residents.",
    vi: "Bạn đầu tư và nộp hồ sơ. Sau khi được chấp thuận, gia đình nhận thẻ xanh có điều kiện. Khi dự án đáp ứng yêu cầu, bạn nộp đơn gỡ điều kiện và cả gia đình trở thành thường trú nhân." },
  { footage: "11.jpg", seconds: 9.9, illustrative: true, kicker: "Life with a Green Card", head: "A bright future for your children",
    chips: ["Live, work, study anywhere in the U.S.", "In-state tuition", "U.S. healthcare"],
    en: "Then your family can live, work and study anywhere in the United States, enjoy in-state university tuition, and access U.S. healthcare.",
    vi: "Khi đó cả gia đình có thể sống, làm việc và học tập ở bất cứ đâu tại Mỹ, hưởng học phí nội bang đại học và tiếp cận hệ thống y tế Hoa Kỳ." },
  { footage: "12.jpg", seconds: 5.0, illustrative: true, kicker: "Veneta Apartments · EB-5", head: "Request your consultation",
    chips: ["BD Ventures"],
    en: "Talk to the BD Ventures team today. Request your consultation.",
    vi: "Hãy liên hệ đội ngũ BD Ventures ngay hôm nay để được tư vấn." },
];

export const DISCLAIMER =
  "For information only; not an offer or solicitation to buy securities. All investments involve risk, including loss of principal. EB-5 outcomes depend on USCIS approval and individual circumstances, which are not guaranteed. Stock footage is illustrative and does not depict the Veneta project.";
export const DISCLAIMER_VI =
  "Chỉ mang tính thông tin; không phải chào bán hay mời mua chứng khoán. Mọi khoản đầu tư đều có rủi ro, kể cả mất vốn. Kết quả EB-5 phụ thuộc vào sự chấp thuận của USCIS và hoàn cảnh cá nhân, không được đảm bảo. Hình ảnh chỉ mang tính minh họa, không phải dự án Veneta.";
