"use server";

import { db } from "@/firebase/admin";

async function askDeepSeek(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const rawResponse = await askDeepSeek(
      "Kamu adalah pewawancara profesional yang menganalisis wawancara simulasi. Tugasmu adalah mengevaluasi kandidat berdasarkan kategori yang terstruktur. SELALU keluarkan hanya JSON valid, tanpa teks lain, tanpa markdown.",
      `Kamu adalah pewawancara AI yang menganalisis wawancara simulasi. Tugasmu adalah mengevaluasi kandidat berdasarkan kategori yang terstruktur. Bersikaplah teliti dan detail dalam analisismu. Jangan terlalu lunak kepada kandidat. Jika ada kesalahan atau area yang perlu ditingkatkan, tunjukkan.

Transkrip:
${formattedTranscript}

Mohon beri skor kandidat dari 0 sampai 100 di area berikut:
- Kemampuan Komunikasi: Kejelasan, artikulasi, respons yang terstruktur.
- Pengetahuan Teknis: Pemahaman konsep kunci untuk posisi tersebut.
- Pemecahan Masalah: Kemampuan menganalisis masalah dan mengusulkan solusi.
- Kecocokan Budaya: Keselarasan dengan nilai perusahaan dan peran pekerjaan.
- Kepercayaan Diri & Kejelasan: Keyakinan dalam merespons, keterlibatan, dan kejelasan.

KELUARKAN HANYA JSON DENGAN FORMAT INI:
{
  "totalScore": (angka 0-100),
  "categoryScores": [
    { "name": "Kemampuan Komunikasi", "score": (0-100), "comment": "..." },
    { "name": "Pengetahuan Teknis", "score": (0-100), "comment": "..." },
    { "name": "Pemecahan Masalah", "score": (0-100), "comment": "..." },
    { "name": "Kecocokan Budaya", "score": (0-100), "comment": "..." },
    { "name": "Kepercayaan Diri & Kejelasan", "score": (0-100), "comment": "..." }
  ],
  "strengths": ["...", "..."],
  "areasForImprovement": ["...", "..."],
  "finalAssessment": "ringkasan penilaian akhir"
}`
    );

    // Parse JSON from response
    let object;
    try {
      object = JSON.parse(rawResponse);
    } catch {
      const match = rawResponse.match(/\{([\s\S]*)\}/);
      if (match) {
        object = JSON.parse(match[0]);
      } else {
        throw new Error("Gagal memparse JSON feedback");
      }
    }

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const interview = await db.collection("interviews").doc(id).get();
    return interview.data() as Interview | null;
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  try {
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { limit = 20 } = params;

  try {
    // Fetch finalized interviews (no orderBy to avoid composite index)
    const interviews = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .limit(50)
      .get();

    // Sort in code instead of requiring Firestore composite index
    const result = interviews.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as Interview)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return result;
  } catch (error) {
    console.error("Error fetching latest interviews:", error);
    return [];
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    // Fetch user's interviews (no orderBy to avoid composite index)
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();

    // Sort in code instead of requiring Firestore composite index
    const result = interviews.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as Interview)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    return [];
  }
}
