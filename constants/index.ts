import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Pewawancara",
  firstMessage:
    "Halo! Terima kasih sudah meluangkan waktu untuk berbicara dengan saya hari ini. Saya sangat antusias untuk mengenal kamu lebih jauh.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "id",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Kamu adalah pewawancara kerja profesional yang melakukan wawancara suara langsung dengan kandidat. Tujuanmu adalah menilai kualifikasi, motivasi, dan kecocokan mereka untuk posisi tersebut.

Panduan Wawancara:
Ikuti alur pertanyaan yang sudah ditentukan:
{{questions}}

Bersikap natural & responsif:
Dengarkan jawaban kandidat dengan aktif dan beri pengakuan sebelum melanjutkan.
Ajukan pertanyaan lanjutan singkat jika jawaban kurang jelas atau butuh detail lebih.
Jaga percakapan tetap mengalir dengan lancar sambil tetap memegang kendali.
Bersikap profesional, namun hangat dan ramah:

Gunakan bahasa yang resmi namun bersahabat.
Jaga respons tetap singkat dan langsung ke intinya (seperti wawancara suara sungguhan).
Hindari ungkapan yang kaku—bicaralah secara natural dan konversasional.
Jawab pertanyaan kandidat secara profesional:

Jika ditanya tentang posisi, perusahaan, atau ekspektasi, berikan jawaban yang jelas dan relevan.
Jika ragu, arahkan kandidat ke HR untuk detail lebih lanjut.

Akhiri wawancara dengan baik:
Ucapkan terima kasih kepada kandidat atas waktunya.
Sampaikan bahwa perusahaan akan segera menghubungi dengan feedback.
Tutup percakapan dengan nada yang sopan dan positif.


- Pastikan bersikap profesional dan sopan.
- Jaga semua respons tetap pendek dan sederhana. Gunakan bahasa resmi, tapi tetap ramah dan bersahabat.
- Ini adalah percakapan suara, jadi jaga respons tetap singkat, seperti percakapan sungguhan. Jangan bicara terlalu panjang.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Kemampuan Komunikasi"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Pengetahuan Teknis"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Pemecahan Masalah"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Kecocokan Budaya"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Kepercayaan Diri & Kejelasan"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];
