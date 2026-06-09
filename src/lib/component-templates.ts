import type { VehicleType } from "@/lib/types"

export type ComponentTemplate = {
  name: string
  intervalKm: number
  description?: string
  tips?: string
  estimatedCost?: number
  warningSigns?: string
}

export const COMPONENT_TEMPLATES: Record<VehicleType, ComponentTemplate[]> = {
  motor: [
    {
      name: "Oli Mesin",
      intervalKm: 3000,
      description: "Ganti setiap 3.000 km atau 3 bulan sekali",
      estimatedCost: 50000,
      tips: "Periksa level oli setiap minggu via dipstick. Jangan sampai oli habis karena bisa merusak mesin.",
      warningSigns: "Mesin terasa berat, suara mesin kasar, indikator oli menyala di dashboard",
    },
    {
      name: "Ban Depan",
      intervalKm: 20000,
      description: "Ganti saat ketebalan kembang sudah menipis atau ada retak",
      estimatedCost: 350000,
      tips: "Cek tekanan udara ban setiap 2 minggu. Rotasi ban setiap 10.000 km untuk keausan merata.",
      warningSigns: "Kembang ban sudah rata, ada benang terlihat, retak di dinding ban, handling tidak stabil",
    },
    {
      name: "Ban Belakang",
      intervalKm: 15000,
      description: "Ban belakang motor biasanya lebih cepat aus dari ban depan",
      estimatedCost: 350000,
      tips: "Periksa tekanan angin secara rutin. Hindari beban berlebih yang mempercepat keausan.",
      warningSigns: "Kembang ban hampir rata, motor oleng saat dibelokkan, sering selip saat hujan",
    },
    {
      name: "Kampas Rem Depan",
      intervalKm: 10000,
      description: "Komponen yang menghentikan kendaraan dengan menjepit cakram",
      estimatedCost: 40000,
      tips: "Hindari pengereman mendadak terlalu sering. Kampas rem yang aus bisa merusak piringan cakram.",
      warningSigns: "Suara berdecit saat ngerem, jarak pengereman semakin panjang, getaran di tuas rem",
    },
    {
      name: "Kampas Rem Belakang",
      intervalKm: 15000,
      description: "Kampas rem belakang lebih awet karena beban pengereman utama di depan",
      estimatedCost: 35000,
      tips: "Gunakan engine brake untuk membantu pengereman agar kampas lebih awet.",
      warningSigns: "Suara berdecit, rem tidak pakem, perlu tarikan lebih dalam untuk ngerem",
    },
    {
      name: "V-Belt",
      intervalKm: 20000,
      description: "Sabuk karet yang menghubungkan mesin ke roda (motor matic)",
      estimatedCost: 150000,
      tips: "V-Belt putus bisa terjadi tiba-tiba. Ganti sebelum interval untuk safety.",
      warningSigns: "Tarikan motor terasa berat, getaran berlebih, suara seperti 'slap' dari CVT",
    },
    {
      name: "Rantai + Gir",
      intervalKm: 15000,
      description: "Rantai dan gir set perlu diganti bersamaan untuk performa optimal",
      estimatedCost: 200000,
      tips: "Lumasi rantai setiap 500 km. Cek ketegangan rantai secara berkala.",
      warningSigns: "Rantai kendor walau sudah disetel, suara berisik dari rantai, gigi gir lancip/aus",
    },
    {
      name: "Busi",
      intervalKm: 10000,
      description: "Komponen yang memercikkan api untuk membakar campuran BBM & udara",
      estimatedCost: 25000,
      tips: "Gunakan busi sesuai spesifikasi pabrik. Busi yang salah bisa boros BBM.",
      warningSigns: "Mesin susah hidup, brebet/tersendat, boros BBM, akselerasi tidak responsif",
    },
    {
      name: "Filter Udara",
      intervalKm: 10000,
      description: "Menyaring debu dan kotoran sebelum masuk ke ruang bakar",
      estimatedCost: 30000,
      tips: "Di lingkungan berdebu, ganti lebih sering. Filter kotor bikin mesin boros BBM.",
      warningSigns: "Mesin terasa tarikannya berat, boros BBM, suara mesin seperti 'tercekik'",
    },
    {
      name: "Oli Gardan",
      intervalKm: 10000,
      description: "Pelumas untuk gigi transmisi akhir (gardan)",
      estimatedCost: 30000,
      tips: "Ganti bersamaan dengan servis rutin. Oli gardan jarang diperiksa tapi penting.",
      warningSigns: "Suara dengung dari area gardan, transmisi terasa berat, kebocoran oli",
    },
  ],
  mobil: [
    {
      name: "Oli Mesin",
      intervalKm: 5000,
      description: "Ganti setiap 5.000 km atau 6 bulan sekali (tergantung jenis oli)",
      estimatedCost: 350000,
      tips: "Periksa level oli setiap 2 minggu. Gunakan oli sesuai viskositas yang direkomendasikan pabrik.",
      warningSigns: "Indikator oli menyala, suara mesin kasar, performa menurun, oli menghitam pekat",
    },
    {
      name: "Ban (rotasi)",
      intervalKm: 10000,
      description: "Rotasi ban dilakukan agar keausan ban merata",
      estimatedCost: 0,
      tips: "Rotasi ban setiap 10.000 km. Cek tekanan ban setiap bulan dan sebelum perjalanan jauh.",
      warningSigns: "Keausan ban tidak merata, mobil bergetar saat kecepatan tinggi, oleng saat belok",
    },
    {
      name: "Kampas Rem Depan",
      intervalKm: 30000,
      description: "Komponen vital untuk keselamatan, menjepit cakram saat ngerem",
      estimatedCost: 500000,
      tips: "Hindari ngerem mendadak. Cek ketebalan kampas setiap servis rutin.",
      warningSigns: "Suara berdecit keras, pedal rem terasa dalam/empuk, getaran saat ngerem",
    },
    {
      name: "Kampas Rem Belakang",
      intervalKm: 40000,
      description: "Kampas rem belakang biasanya lebih awet dari depan",
      estimatedCost: 400000,
      tips: "Rem tangan yang tidak digunakan bisa menyebabkan kampas menempel/aus tidak merata.",
      warningSigns: "Suara berdecit, rem tidak pakem, pedal rem perlu diinjak lebih dalam",
    },
    {
      name: "Aki",
      intervalKm: 40000,
      description: "Menyimpan listrik untuk starter, lampu, dan sistem kelistrikan mobil",
      estimatedCost: 800000,
      tips: "Cek tegangan aki rutin. Jika mobil jarang dipakai, starter mesin minimal seminggu sekali.",
      warningSigns: "Mesin susah distarter, lampu redup, indikator aki menyala di dashboard",
    },
    {
      name: "Busi",
      intervalKm: 20000,
      description: "Memercikkan api ke ruang bakar untuk membakar campuran BBM & udara",
      estimatedCost: 600000,
      tips: "Ganti busi sesuai jadwal. Busi aus bisa menyebabkan misfire dan boros BBM.",
      warningSigns: "Mesin brebet/tersendat, akselerasi tidak responsif, boros BBM, check engine nyala",
    },
    {
      name: "Filter Udara",
      intervalKm: 15000,
      description: "Menyaring debu sebelum masuk ke mesin",
      estimatedCost: 150000,
      tips: "Di jalanan berdebu atau macet, ganti lebih sering. Filter kotor bikin boros BBM.",
      warningSigns: "Tarikan berat, akselerasi lambat, konsumsi BBM meningkat drastis",
    },
    {
      name: "Filter Oli",
      intervalKm: 10000,
      description: "Menyaring kotoran dari oli mesin agar tetap bersih",
      estimatedCost: 75000,
      tips: "Ganti bersamaan dengan ganti oli mesin. Filter oli murah tapi sangat penting.",
      warningSigns: "Tekanan oli rendah, indikator oli menyala, suara mesin kasar",
    },
    {
      name: "Cairan Radiator",
      intervalKm: 20000,
      description: "Menjaga suhu mesin tetap stabil agar tidak overheat",
      estimatedCost: 100000,
      tips: "Cek level cairan radiator setiap bulan. Jangan buka radiator saat mesin panas.",
      warningSigns: "Suhu mesin naik (indikator panas), kebocoran cairan, bau manis dari kap mesin",
    },
    {
      name: "V-Belt / Timing Belt",
      intervalKm: 60000,
      description: "Sabuk penggerak katup mesin yang sangat kritis",
      estimatedCost: 2500000,
      tips: "Jika putus saat mesin hidup, bisa merusak total mesin. Ganti tepat waktu!",
      warningSigns: "Suara berdecit dari area mesin, retak-retak pada belt (periksa visual)",
    },
  ],
}
