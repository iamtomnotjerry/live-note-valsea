/**
 * Sinh messages/id.json, th.json, ms.json từ en.json (cùng cấu trúc key).
 * Chạy: node scripts/gen-sea-ui-locales.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "messages");
const en = JSON.parse(fs.readFileSync(path.join(root, "en.json"), "utf8"));

const id = structuredClone(en);
const th = structuredClone(en);
const ms = structuredClone(en);

/* ——— Bahasa Indonesia ——— */
id.Meta = {
  title: "Live Note Taker — Catatan kelas real-time",
  titleTemplate: "%s · Live Note Taker",
  description:
    "Catatan kelas real-time untuk mahasiswa Asia Tenggara: VALSEA RTT dengan banyak locale pengenalan (ASEAN dulu), Next.js + Supabase, terang/gelap, banyak bahasa UI.",
};
id.Theme = {
  useLight: "Mode terang",
  useDark: "Mode gelap",
};
id.LocaleSwitcher = {
  label: "Bahasa",
  vi: "Tiếng Việt",
  en: "English",
  id: "Bahasa Indonesia",
  th: "ไทย",
  ms: "Bahasa Melayu",
};
id.Header = {
  brandTitle: "Live Note Taker",
  navLabel: "Utama",
  navFeatures: "Fitur",
  navWhy: "Manfaat",
  live: "Rekam live",
  login: "Masuk",
  accountOpenAria: "Menu akun",
  signOut: "Keluar",
  valseaApi: "API VALSEA",
};
id.Footer = {
  tagline:
    "Catatan kuliah bergaya kampus — ASR realtime VALSEA, siap hackathon tanpa stres.",
  colFeatures: "Jelajahi",
  linkLive: "Buka rekam live",
  linkDocs: "Dokumentasi API",
  linkFeatures: "Semua fitur",
  colProject: "Proyek",
  linkHackathon: "VALSEA & hackathon",
  linkRepo: "Repositori GitHub",
  colSupport: "Komunitas",
  linkStories: "Cerita tim",
  linkWhy: "Mengapa aplikasi ini",
  legal:
    "© {year} Live Note Taker — demo mahasiswa, bukan nasihat akademik resmi.",
};
id.Home = {
  heroBadge: "Untuk mahasiswa · Catatan live",
  heroTitle1: "Tetap lihat papan tulis,",
  heroTitle2: "bukan keyboard —",
  heroTitle3: "Live Note Taker mengikuti kuliah.",
  heroSub:
    "Sekali aktifkan mik: VALSEA mengalirkan suara ke teks real-time. Pantau partial untuk memastikan terdengar; final menumpuk jadi catatan setelah kelas — fokus ke materi, bukan mengetik.",
  ctaLive: "Mulai rekam gratis",
  ctaDocs: "Baca dokumentasi VALSEA",
  stripAria: "Sorotan cepat",
  strip1Label: "Dengar → teks",
  strip1Sub: "VALSEA RTT",
  strip2Label: "Partial & final",
  strip2Sub: "Sesuai panduan VALSEA",
  strip3Label: "Review setelah kelas",
  strip3Sub: "Satu transkrip berjalan",
  stat1Value: "16 kHz",
  stat1Label: "PCM untuk ASR",
  stat2Value: "RTT",
  stat2Label: "Dengar, langsung terlihat",
  stat3Value: "35+",
  stat3Label: "Locale ASR di app — ASEAN dulu (VALSEA)",
  statsAria: "Angka sorotan",
  progressEyebrow: "Pratinjau catatan live",
  progressTitle: "Dengar kuliah — teks terisi untuk Anda",
  progressLesson: "VALSEA ASR realtime · WebSocket & proxy aman",
  progressMeta:
    "Partial mengikuti ucapan; hanya final yang masuk riwayat — mudah dipulang setelah kelas.",
  progressLabel: "Alur rekam (ilustrasi)",
  progressValue: "Merekam",
  progressAria: "Contoh transkrip dan bar animasi",
  progressCta: "Buka rekam live",
  livePreviewTranscriptAria: "Contoh transkrip di kelas",
  livePreviewTranscriptLabel: "Transkrip · contoh",
  livePreviewFinal:
    "Poin kunci: aturan rantai — dipakai di latihan 3; bagian ini sering muncul di ujian tengah.",
  livePreviewPartial:
    '… masih mengenali: "Untuk soal tiga kita hubungkan dengan format ujian tengah, perhatikan substitusi…"',
  catalogEyebrow: "Yang Anda dapat di kelas",
  catalogTitle: "Bagaimana Live Note Taker mendukung kuliah",
  catalogSub:
    "Setiap kartu bagian pipeline — dari mik ke transkrip dan ruang berkembang (penyimpanan, ringkasan…).",
  cat1Title: "Realtime dengan mik Anda",
  cat1Meta: "WebSocket · PCM mono",
  cat1Detail: "Realtime · WebSocket · PCM 16 kHz",
  cat1Desc:
    "Partial langsung muncul, final menyusun riwayat — tetap terbaca tanpa slide padat.",
  cat2Title: "Supabase untuk data",
  cat2Meta: "Postgres · Auth · RLS",
  cat2Detail: "Data · Auth · RLS untuk transkrip",
  cat2Desc:
    "Setelah MVP cukup simpan catatan & pengguna — tanpa rewrite backend mendadak.",
  cat3Title: "API VALSEA",
  cat3Meta: "REST & realtime",
  cat3Detail: "Integrasi · Dok resmi",
  cat3Desc:
    "Ikuti panduan VALSEA; kunci tetap di server untuk demo & deploy lebih aman.",
  cat4Title: "Hari juri, tetap tenang",
  cat4Meta: "Pitch · plan B",
  cat4Detail: "Checklist · dev:rtt · /live",
  cat4Desc:
    "Jalankan proxy, buka live, latih skrip 60 dtk — tunjukkan Anda kendalikan risiko.",
  ratingScore: "4.9",
  ratingLabel: "manfaat untuk belajar",
  viewAll: "Lihat pengalaman live lengkap",
  whyEyebrow: "Kenapa teman pakai",
  whyTitle: "UI lembut, pipeline serius",
  whySub:
    "UI lembut agar baca lama tetap nyaman — dengan pipeline VALSEA realtime di baliknya.",
  why1Title: "Copy untuk mahasiswa dulu",
  why1Body: "Bahasa ramah, jargon minim; mentor paham dalam satu walkthrough.",
  why2Title: "Demo seukuran camilan",
  why2Body: "Satu tombol rekam — tidak memanjang timeline saat juri buru-buru.",
  why3Title: "Mode terang / gelap",
  why3Body:
    "Belajar malam? Mode gelap. Ruang terang? Pastel tetap nyaman di mata.",
  why4Title: "Banyak bahasa UI",
  why4Body:
    "VI, EN, ID, TH, MS selaras — tim internasional langsung pilih kontrol yang tepat.",
  storiesEyebrow: "Dari kelas",
  storiesTitle: "Kata teman sekelas",
  story1Quote:
    "UI terasa imut tapi pipeline mik-ke-teks nyata. Pitch kami bikin aula hening fokus.",
  story1Name: "Anh Minh",
  story1Role: "Junior · tim VALSEA",
  story2Quote:
    "Dosen tanya keamanan API — saya tunjukkan dark mode & middleware, lanjut. Kurik nitpick.",
  story2Name: "Dang Hai",
  story2Role: "Tech lead klub CS",
  story3Quote:
    "Saya belajar malam jadi mode gelap penyelamat. Catatan pagi tetap nyaman di mata.",
  story3Name: "My Tra",
  story3Role: "UX · tim hackathon",
  closingTitle: "Siap untuk kuliah berikutnya?",
  closingSub:
    "Buka rekam live, ucap beberapa baris seperti di kelas — lihat transkrip langsung muncul.",
  closingCta: "Rekam di web",
  closingSecondary: "Harga & API (dokumen)",
  closingNote1: "Tanpa kartu kredit — cukup mik dan Wi-Fi stabil.",
  closingNote2: "Dev: jalankan npm run dev:rtt saat uji RTT.",
};
id.LivePage = {
  title: "Catatan live",
  subtitle:
    "Pilih bahasa yang akan Anda gunakan, ketuk Mulai rekam, lalu bicara seperti biasa — teks muncul di bawah secara langsung. Masuk jika ingin menyimpan catatan ke akun Anda.",
  backHome: "← Beranda",
};
id.Rtt = {
  ...en.Rtt,
  cardTitle: "Sebelum mulai",
  cardIntro:
    "Aplikasi memakai mikrofon Anda untuk mengubah suara menjadi teks secara langsung. Memilih bahasa yang tepat membantu akurasi. Bahasa tidak bisa diubah saat sedang merekam.",
  transcriptTitle: "Transkrip",
  transcriptHint:
    "Baris terakhir bisa masih berubah saat Anda berbicara; kalimat yang sudah mantap dipindahkan ke catatan berjalan di atas.",
  asrLanguage: "Bahasa bicara",
  asrLanguageHint:
    "Samakan dengan bahasa yang akan Anda pakai di kelas atau rapat. Daftar ini mengutamakan Asia Tenggara dan sekitarnya. Ini terpisah dari bahasa antarmuka di header.",
  emptyHint:
    "Belum ada isi. Ketuk Mulai rekam dan bicara — transkrip akan muncul di sini.",
  statusReady: "Siap kapan Anda mulai.",
  statusStopped: "Rekaman dihentikan.",
  statusDisconnected: "Koneksi tertutup.",
  statusConnecting: "Menyambung…",
  statusWsOpen: "Hampir siap…",
  statusSessionCreated: "Memulai sesi…",
  statusEngineReady: "Menyalakan mikrofon…",
  statusRecording: "Mendengarkan — terus bicara, catatan diperbarui langsung.",
  errNoGetUserMedia: "Peramban ini tidak bisa memakai mikrofon.",
  errMicOpen:
    "Tidak bisa mengakses mikrofon. Periksa izin di pengaturan peramban.",
  errValseaGeneric: "Terjadi masalah saat transkripsi.",
  errWs:
    "Tidak dapat menghubungi layanan transkripsi. Periksa internet dan coba lagi.",
  downloadTxt: "Unduh file teks",
  exportPartialBanner: "--- Masih direkam (bisa berubah) ---",
  saveSuccess: "Disimpan ke akun Anda.",
};
id.Login = {
  title: "Masuk",
  subtitle: "Masuk dengan Google — lalu simpan catatan ke akun Anda.",
  backLive: "← Rekam live",
  continueWithGoogle: "Lanjutkan dengan Google",
  continueWithGoogleAria: "Masuk dengan akun Google",
  redirecting: "Mengalihkan…",
  callbackError:
    "Masuk belum selesai. Coba Google lagi atau periksa Redirect URL di Supabase.",
  genericError: "Terjadi kesalahan. Coba lagi.",
};

/* ——— ไทย ——— */
th.Meta = {
  title: "Live Note Taker — จดบันทึกคาบเรียนแบบเรียลไทม์",
  titleTemplate: "%s · Live Note Taker",
  description:
    "จดบันทึกคาบเรียนแบบเรียลไทม์สำหรับนักศึกษาเอเชียตะวันออกเฉียงใต้: VALSEA RTT รองรับหลายโหมดภาษา (เน้น ASEAN) Next.js + Supabase โหมดสว่าง/มืด หลายภาษา UI",
};
th.Theme = { useLight: "โหมดสว่าง", useDark: "โหมดมืด" };
th.LocaleSwitcher = {
  label: "ภาษา",
  vi: "Tiếng Việt",
  en: "English",
  id: "Bahasa Indonesia",
  th: "ไทย",
  ms: "Bahasa Melayu",
};
th.Header = {
  brandTitle: "Live Note Taker",
  navLabel: "หลัก",
  navFeatures: "ฟีเจอร์",
  navWhy: "ทำไมใช้",
  live: "จดบันทึกสด",
  login: "เข้าสู่ระบบ",
  accountOpenAria: "เมนูบัญชี",
  signOut: "ออกจากระบบ",
  valseaApi: "VALSEA API",
};
th.Footer = {
  tagline:
    "จดบันทึกคาบเรียนสไตล์คampus — ASR แบบเรียลไทม์ VALSEA พร้อมแข่ง hackathon",
  colFeatures: "สำรวจ",
  linkLive: "เปิดจับเสียงสด",
  linkDocs: "เอกสาร API",
  linkFeatures: "ฟีเจอร์ทั้งหมด",
  colProject: "โปรเจกต์",
  linkHackathon: "VALSEA & hackathon",
  linkRepo: "GitHub repository",
  colSupport: "ชุมชน",
  linkStories: "เรื่องจากทีม",
  linkWhy: "ทำไมแอปนี้",
  legal:
    "© {year} Live Note Taker — โดยนักศึกษา ไม่ใช่คำแนะทางวิชาการอย่างเป็นทางการ",
};
th.Home = {
  heroBadge: "สำหรับนักศึกษา · จดบันทึกสด",
  heroTitle1: "จับตาที่กระดาน,",
  heroTitle2: "ไม่ใช่ที่คีย์บอร์ด —",
  heroTitle3: "Live Note Taker ตามบทเรียน",
  heroSub:
    "เปิดไมค์ครั้งเดียว: VALSEA สตรีมเสียงเป็นข้อความแบบเรียลไทม์ ดู partial เพื่อยืนยันว่าได้ยิน; final ต่อเป็นบันทึกหลังคาบ — โฟกัสที่บทเรียน",
  ctaLive: "เริ่มจับเสียงฟรี",
  ctaDocs: "อ่านเอกสาร VALSEA",
  stripAria: "ไฮไลต์",
  strip1Label: "ฟัง → ข้อความ",
  strip1Sub: "VALSEA RTT",
  strip2Label: "Partial & final",
  strip2Sub: "ตามคำแนะ VALSEA",
  strip3Label: "ทบทวนหลังคาบ",
  strip3Sub: "ทรานสคริปต์เดียวต่อเนื่อง",
  stat1Value: "16 kHz",
  stat1Label: "PCM สำหรับ ASR",
  stat2Value: "RTT",
  stat2Label: "ได้ยิน เห็นทันที",
  stat3Value: "35+",
  stat3Label: "โหมด ASR ในแอป — เน้น SEA (VALSEA)",
  statsAria: "ตัวเลขเด่น",
  progressEyebrow: "ตัวอย่างโน้ตสด",
  progressTitle: "ฟังบทเรียน — ข้อความเติมให้คุณ",
  progressLesson: "VALSEA ASR เรียลไทม์ · WebSocket & พร็อกซีปลอดภัย",
  progressMeta: "partial ตามเสียง; เฉพาะ final เข้าประวัติ — ทบทวนหลังคาบง่าย",
  progressLabel: "โฟลว์บันทึก (ตัวอย่าง)",
  progressValue: "กำลังบันทึก",
  progressAria: "ตัวอย่างทรานสคริปต์และแถบแอนิเมชัน",
  progressCta: "เปิดจับเสียงสด",
  livePreviewTranscriptAria: "ตัวอย่างทรานสคริปต์ในห้อง",
  livePreviewTranscriptLabel: "ทรานสคริปต์ · ตัวอย่าง",
  livePreviewFinal: "ประเด็นสำคัญ: กฎลูกโซ่ — ใช้ในแบบฝึก 3; มักออกกลางภาค",
  livePreviewPartial:
    '… ยังรู้จำเสียง: "ข้อสามเชื่อมกับรูปแบบกลางภาค ดูการแทนค่า…"',
  catalogEyebrow: "ได้อะไรในคาบ",
  catalogTitle: "Live Note Taker ช่วยบทเรียนอย่างไร",
  catalogSub:
    "แต่ละการ์ดเป็นส่วนของ pipeline — จากไมค์ถึงทรานสคริปต์และขยายต่อ",
  cat1Title: "เรียลไทม์กับไมค์คุณ",
  cat1Meta: "WebSocket · PCM mono",
  cat1Detail: "Realtime · WebSocket · PCM 16 kHz",
  cat1Desc: "partial ทันที final ต่อประวัติ — อ่านได้โดยไม่ต้องสไลด์หนา",
  cat2Title: "Supabase สำหรับข้อมูล",
  cat2Meta: "Postgres · Auth · RLS",
  cat2Detail: "Data · Auth · RLS สำหรับทรานสคริปต์",
  cat2Desc: "หลัง MVP เก็บโน้ตและผู้ใช้ — ไม่ต้องรีไรต์ backend",
  cat3Title: "VALSEA API",
  cat3Meta: "REST & realtime",
  cat3Detail: "Integration · เอกสารทางการ",
  cat3Desc: "ตาม VALSEA; คีย์อยู่ฝั่งเซิร์ฟเวอร์ ปลอดภัยขึ้น",
  cat4Title: "วันตัดสิน ไม่แพนิค",
  cat4Meta: "Pitch · plan B",
  cat4Detail: "Checklist · dev:rtt · /live",
  cat4Desc: "รันพร็อกซี เปิด live ซ้อม 60 วิ — แสดงว่าคุมความเสี่ยง",
  ratingScore: "4.9",
  ratingLabel: "ประโยชน์ต่อการเรียน",
  viewAll: "ดูประสบการณ์ live ทั้งหมด",
  whyEyebrow: "ทำไมเพื่อนใช้",
  whyTitle: "UI นุ่ม pipeline จริงจัง",
  whySub: "UI นุ่มอ่านนานสบาย — มี VALSEA realtime ด้านล่าง",
  why1Title: "ข้อความนักศึกษาก่อน",
  why1Body: "คำเรียบง่าย เมนเทอร์เข้าใจในครั้งเดิน",
  why2Title: "สาธิตสั้น",
  why2Body: "ปุ่มเดียวเริ่มบันทึก — ไม่ยืดเวลาตอนคณะกรรมการจับเวลา",
  why3Title: "โหมดสว่าง/มืด",
  why3Body: "อ่านกลางคืน? มืด ห้องสว่าง? สีพาสเทลนุ่มตา",
  why4Title: "หลายภาษา UI",
  why4Body: "VI EN ID TH MS สอดคล้องกัน — ทีมสากลกดถูกที่",
  storiesEyebrow: "จากห้องเรียน",
  storiesTitle: "เพื่อนร่วมชั้นพูด",
  story1Quote: "UI น่ารักแต่เส้นทางไมค์-ข้อความจริง พิชท์ให้ทั้งฮอลเงียบฟัง",
  story1Name: "Anh Minh",
  story1Role: "Junior · VALSEA crew",
  story2Quote: "อาจารย์ถามความปลอดภัย API — สลับมืด ชี้ middleware แล้วผ่าน",
  story2Name: "Dang Hai",
  story2Role: "หัวหน้าเทคคลับ CS",
  story3Quote: "อ่านดึกโหมดมืดช่วยมาก โน้ตเช้ายังนุ่มตา",
  story3Name: "My Tra",
  story3Role: "UX · ทีม hackathon",
  closingTitle: "พร้อมคาบถัดไป?",
  closingSub: "เปิด live พูดไม่กี่ประโยคเหมือนในคาบ — เห็นทรานสคริปต์ทันที",
  closingCta: "จับบนเว็บ",
  closingSecondary: "ราคา & API (เอกสาร)",
  closingNote1: "ไม่ต้องใช้บัตร — แค่ไมค์กับ Wi-Fi",
  closingNote2: "Dev: รัน npm run dev:rtt เมื่อทดสอบ RTT",
};
th.LivePage = {
  title: "โน้ตสด",
  subtitle:
    "เลือกภาษาที่คุณจะพูด แตะเริ่มบันทึก แล้วพูดตามปกติ — ข้อความจะขึ้นด้านล่างแบบเรียลไทม์ เข้าสู่ระบบหากต้องการบันทึกโน้ตไว้ในบัญชี",
  backHome: "← หน้าแรก",
};
th.Rtt = {
  ...en.Rtt,
  cardTitle: "ก่อนเริ่ม",
  cardIntro:
    "แอปใช้ไมโครโฟนเพื่อแปลงเสียงเป็นข้อความแบบเรียลไทม์ การเลือกภาษาให้ตรงช่วยความแม่นยำ ระหว่างบันทึกจะเปลี่ยนภาษาไม่ได้",
  transcriptTitle: "ถอดความ",
  transcriptHint:
    "บรรทัดสุดท้ายอาจเปลี่ยนขณะยังพูดอยู่ ประโยคที่นิ่งแล้วจะถูกย้ายขึ้นไปในส่วนโน้ตด้านบน",
  asrLanguage: "ภาษาที่พูด",
  asrLanguageHint:
    "ให้ตรงกับภาษาที่ใช้ในชั้นเรียนหรือประชุม รายการเน้นเอเชียตะวันออกเฉียงใต้และใกล้เคียง แยกจากภาษาของแอปที่หัวหน้าเพจ",
  emptyHint: "ยังไม่มีเนื้อหา แตะเริ่มบันทึกแล้วพูด — ถอดความจะแสดงในกล่องนี้",
  statusReady: "พร้อมเมื่อคุณเริ่ม",
  statusStopped: "หยุดบันทึกแล้ว",
  statusDisconnected: "ปิดการเชื่อมต่อแล้ว",
  statusConnecting: "กำลังเชื่อมต่อ…",
  statusWsOpen: "เกือบพร้อม…",
  statusSessionCreated: "กำลังเริ่มเซสชัน…",
  statusEngineReady: "กำลังเปิดไมโครโฟน…",
  statusRecording: "กำลังฟัง — พูดต่อได้ โน้ตอัปเดตสด",
  errNoGetUserMedia: "เบราว์เซอร์นี้ใช้ไมโครโฟนไม่ได้",
  errMicOpen: "เปิดไมโครโฟนไม่ได้ ตรวจสิทธิ์ในการตั้งค่าเบราว์เซอร์",
  errValseaGeneric: "เกิดข้อผิดพลาดระหว่างถอดความ",
  errWs: "เชื่อมต่อบริการถอดความไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง",
  downloadTxt: "ดาวน์โหลดไฟล์ข้อความ",
  exportPartialBanner: "--- ยังบันทึกอยู่ (อาจเปลี่ยน) ---",
  saveSuccess: "บันทึกลงบัญชีของคุณแล้ว",
};
th.Login = {
  title: "เข้าสู่ระบบ",
  subtitle: "เข้าด้วย Google — จากนั้นบันทึกโน้ตลงบัญชีของคุณได้",
  backLive: "← จดบันทึกสด",
  continueWithGoogle: "ดำเนินการต่อด้วย Google",
  continueWithGoogleAria: "เข้าสู่ระบบด้วยบัญชี Google",
  redirecting: "กำลังเปลี่ยนเส้นทาง…",
  callbackError:
    "เข้าสู่ระบบยังไม่เสร็จ ลอง Google อีกครั้งหรือตรวจ Redirect URLs บน Supabase",
  genericError: "มีข้อผิดพลาด ลองอีกครั้ง",
};

/* ——— Bahasa Melayu ——— */
ms.Meta = {
  title: "Live Note Taker — Nota kelas masa nyata",
  titleTemplate: "%s · Live Note Taker",
  description:
    "Nota kelas masa nyata untuk pelajar Asia Tenggara: VALSEA RTT dengan banyak locale pengecaman (ASEAN dahulu), Next.js + Supabase, cerah/gelap, pelbagai bahasa UI.",
};
ms.Theme = { useLight: "Mod cerah", useDark: "Mod gelap" };
ms.LocaleSwitcher = {
  label: "Bahasa",
  vi: "Tiếng Việt",
  en: "English",
  id: "Bahasa Indonesia",
  th: "ไทย",
  ms: "Bahasa Melayu",
};
ms.Header = {
  brandTitle: "Live Note Taker",
  navLabel: "Utama",
  navFeatures: "Ciri",
  navWhy: "Kelebihan",
  live: "Nota langsung",
  login: "Log masuk",
  accountOpenAria: "Menu akaun",
  signOut: "Log keluar",
  valseaApi: "API VALSEA",
};
ms.Footer = {
  tagline:
    "Nota kuliah gaya kampus — ASR masa nyata VALSEA, sedia hackathon tanpa tekanan.",
  colFeatures: "Teroka",
  linkLive: "Buka rakaman langsung",
  linkDocs: "Dokumentasi API",
  linkFeatures: "Semua ciri",
  colProject: "Projek",
  linkHackathon: "VALSEA & hackathon",
  linkRepo: "Repositori GitHub",
  colSupport: "Komuniti",
  linkStories: "Cerita pasukan",
  linkWhy: "Mengapa apl ini",
  legal:
    "© {year} Live Note Taker — demo pelajar, bukan nasihat akademik rasmi.",
};
ms.Home = {
  heroBadge: "Untuk pelajar · Nota langsung",
  heroTitle1: "Kekalkan mata di papan,",
  heroTitle2: "bukan pada papan kekunci —",
  heroTitle3: "Live Note Taker mengikut kuliah.",
  heroSub:
    "Hidupkan mik sekali: VALSEA memstrim suara ke teks masa nyata. Pantau partial untuk pastikan didengar; final bertimbun jadi nota selepas kelas — fokus pada pelajaran.",
  ctaLive: "Mula rakam percuma",
  ctaDocs: "Baca dokumentasi VALSEA",
  stripAria: "Sorotan pantas",
  strip1Label: "Dengar → teks",
  strip1Sub: "VALSEA RTT",
  strip2Label: "Partial & final",
  strip2Sub: "Ikut panduan VALSEA",
  strip3Label: "Semak selepas kelas",
  strip3Sub: "Satu transkrip berjalan",
  stat1Value: "16 kHz",
  stat1Label: "PCM untuk ASR",
  stat2Value: "RTT",
  stat2Label: "Dengar, nampak serta-merta",
  stat3Value: "35+",
  stat3Label: "Locale ASR dalam app — ASEAN dahulu (VALSEA)",
  statsAria: "Nombor sorotan",
  progressEyebrow: "Pratonton nota langsung",
  progressTitle: "Dengar kuliah — teks diisi untuk anda",
  progressLesson: "VALSEA ASR masa nyata · WebSocket & proksi selamat",
  progressMeta:
    "Partial mengikut pertuturan; hanya final masuk sejarah — semak selepas kelas lebih mudah.",
  progressLabel: "Aliran rakaman (ilustrasi)",
  progressValue: "Merakam",
  progressAria: "Contoh transkrip dan bar animasi",
  progressCta: "Buka rakaman langsung",
  livePreviewTranscriptAria: "Contoh transkrip dalam kelas",
  livePreviewTranscriptLabel: "Transkrip · contoh",
  livePreviewFinal:
    "Idea utama: peraturan rantai — untuk latihan 3; bahagian ini kerap keluar peperiksaan pertengahan.",
  livePreviewPartial:
    '… masih mengenal pasti: "Untuk soalan tiga kita sambung format peperiksaan pertengahan, perhatikan penggantian…"',
  catalogEyebrow: "Apa anda dapat dalam kelas",
  catalogTitle: "Bagaimana Live Note Taker menyokong kuliah",
  catalogSub:
    "Setiap kad ialah bahagian saluran — dari mik ke transkrip dan ruang berkembang.",
  cat1Title: "Masa nyata dengan mik anda",
  cat1Meta: "WebSocket · PCM mono",
  cat1Detail: "Realtime · WebSocket · PCM 16 kHz",
  cat1Desc:
    "Partial serta-merta, final menyusun sejarah — kekal terbaca tanpa slaid padat.",
  cat2Title: "Supabase untuk data",
  cat2Meta: "Postgres · Auth · RLS",
  cat2Detail: "Data · Auth · RLS untuk transkrip",
  cat2Desc:
    "Selepas MVP simpan nota & pengguna — tanpa tulis semula backend mengejut.",
  cat3Title: "API VALSEA",
  cat3Meta: "REST & masa nyata",
  cat3Detail: "Integrasi · Dok rasmi",
  cat3Desc:
    "Ikut panduan VALSEA; kunci kekal di pelayan untuk demo & deploy lebih selamat.",
  cat4Title: "Hari penilaian, tenang",
  cat4Meta: "Pitch · plan B",
  cat4Detail: "Senarai semak · dev:rtt · /live",
  cat4Desc:
    "Jalankan proksi, buka live, latih skrip 60 saat — tunjuk anda kawal risiko.",
  ratingScore: "4.9",
  ratingLabel: "kebergunaan untuk belajar",
  viewAll: "Lihat pengalaman langsung penuh",
  whyEyebrow: "Kenapa rakan guna",
  whyTitle: "UI lembut, saluran serius",
  whySub:
    "UI lembut supaya baca lama selesa — dengan saluran VALSEA masa nyata di belakang.",
  why1Title: "Teks pelajar dahulu",
  why1Body:
    "Perkataan mesra, jargon minimum; mentor faham dalam satu walkthrough.",
  why2Title: "Demo saiz snek",
  why2Body:
    "Satu butang rakam — tidak memanjangkan masa apabila juri ikut jam.",
  why3Title: "Mod cerah / gelap",
  why3Body: "Belajar lewat? Mod gelap. Dewan cerah? Pastel lembut pada mata.",
  why4Title: "Pelbagai bahasa UI",
  why4Body:
    "VI, EN, ID, TH, MS sejajar — rakan antarabangsa tekan kawalan yang betul.",
  storiesEyebrow: "Dari bilik darjah",
  storiesTitle: "Apa kata rakan sekelas",
  story1Quote:
    "UI comel tetapi saluran mik-ke-teks benar. Pitch kami buat dewan senyap fokus.",
  story1Name: "Anh Minh",
  story1Role: "Junior · krew VALSEA",
  story2Quote:
    "Prof tanya keselamatan API — saya tunjuk mod gelap & middleware, teruskan.",
  story2Name: "Dang Hai",
  story2Role: "Ketua teknikal kelab CS",
  story3Quote:
    "Saya belajar lewat jadi mod gelap menyelamatkan. Nota pagi tetap lembut pada mata.",
  story3Name: "My Tra",
  story3Role: "UX · pasukan hackathon",
  closingTitle: "Sedia untuk kuliah seterusnya?",
  closingSub:
    "Buka rakaman langsung, ucap beberapa baris seperti dalam kelas — lihat transkrip serta-merta.",
  closingCta: "Rakam di web",
  closingSecondary: "Harga & API (dokumen)",
  closingNote1: "Tanpa kad kredit — cukup mik dan Wi-Fi stabil.",
  closingNote2: "Dev: jalankan npm run dev:rtt semasa uji RTT.",
};
ms.LivePage = {
  title: "Nota langsung",
  subtitle:
    "Pilih bahasa yang anda akan guna, ketik Mula rakam, dan bercakap seperti biasa — teks muncul di bawah secara langsung. Log masuk jika mahu simpan nota ke akaun anda.",
  backHome: "← Laman utama",
};
ms.Rtt = {
  ...en.Rtt,
  cardTitle: "Sebelum mula",
  cardIntro:
    "Aplikasi menggunakan mikrofon untuk menukar pertuturan kepada teks secara langsung. Memilih bahasa yang betul membantu ketepatan. Bahasa tidak boleh ditukar semasa merakam.",
  transcriptTitle: "Transkrip",
  transcriptHint:
    "Baris akhir mungkin berubah semasa anda masih bercakap; frasa yang telah stabil dipindahkan ke nota berjalan di atas.",
  asrLanguage: "Bahasa pertuturan",
  asrLanguageHint:
    "Padankan dengan bahasa yang akan digunakan di kelas atau mesyuarat. Senarai mengutamakan Asia Tenggara dan kawasan berdekatan. Ini berasingan daripada bahasa antara muka di pengepala.",
  emptyHint:
    "Tiada kandungan lagi. Ketik Mula rakam dan bercakap — transkrip akan dipaparkan di sini.",
  statusReady: "Bersedia bila-bila masa anda mula.",
  statusStopped: "Rakaman dihentikan.",
  statusDisconnected: "Sambungan ditutup.",
  statusConnecting: "Menyambung…",
  statusWsOpen: "Hampir siap…",
  statusSessionCreated: "Memulakan sesi…",
  statusEngineReady: "Menghidupkan mikrofon…",
  statusRecording:
    "Mendengar — teruskan bercakap, nota dikemas kini secara langsung.",
  errNoGetUserMedia: "Pelayar ini tidak boleh menggunakan mikrofon.",
  errMicOpen:
    "Tidak dapat mengakses mikrofon. Semak kebenaran dalam tetapan pelayar.",
  errValseaGeneric: "Ralat berlaku semasa transkripsi.",
  errWs:
    "Tidak dapat menghubungi perkhidmatan transkripsi. Semak sambungan internet dan cuba lagi.",
  downloadTxt: "Muat turun fail teks",
  exportPartialBanner: "--- Masih dirakam (boleh berubah) ---",
  saveSuccess: "Disimpan ke akaun anda.",
};
ms.Login = {
  title: "Log masuk",
  subtitle: "Log masuk dengan Google — kemudian simpan nota ke akaun anda.",
  backLive: "← Nota langsung",
  continueWithGoogle: "Teruskan dengan Google",
  continueWithGoogleAria: "Log masuk dengan akaun Google",
  redirecting: "Mengalih…",
  callbackError:
    "Log masuk belum selesai. Cuba Google semula atau semak Redirect URL di Supabase.",
  genericError: "Ralat. Cuba lagi.",
};

for (const [name, data] of [
  ["id.json", id],
  ["th.json", th],
  ["ms.json", ms],
]) {
  fs.writeFileSync(
    path.join(root, name),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
}
console.log("Wrote id.json, th.json, ms.json");
