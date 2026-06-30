import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

async function askDeepSeek(prompt: string): Promise<string> {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const prompt = `Buat ${amount} pertanyaan untuk wawancara kerja.
Posisi pekerjaan: ${role}
Tingkat pengalaman: ${level}
Tech stack: ${techstack}
Fokus pertanyaan: ${type}

KELUARKAN HANYA ARRAY JSON SAJA. TANPA TEKS LAIN. TANPA MARKDOWN.
Format wajib:
["Pertanyaan 1", "Pertanyaan 2", "Pertanyaan 3"]

Jangan gunakan karakter khusus seperti /, *, #, atau markdown.
Pertanyaan akan dibacakan oleh voice assistant.
HANYA KELUARKAN ARRAY JSON.`;

    const rawResponse = await askDeepSeek(prompt);

    // Parse response — handle extra text from AI
    let questions: string[];
    try {
      questions = JSON.parse(rawResponse);
    } catch {
      const match = rawResponse.match(/\[([\s\S]*)\]/);
      if (match) {
        try {
          questions = JSON.parse(match[0]);
        } catch {
          questions = rawResponse
            .split("\n")
            .map((line) => line.replace(/^[\d.\-•\s]+/, "").replace(/^["']|["']$/g, "").trim())
            .filter((line) => line.length > 10);
        }
      } else {
        questions = rawResponse
          .split("\n")
          .map((line) => line.replace(/^[\d.\-•\s]+/, "").replace(/^["']|["']$/g, "").trim())
          .filter((line) => line.length > 10);
      }
    }

    if (!questions.length) throw new Error("Gagal memparse pertanyaan dari AI");

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
