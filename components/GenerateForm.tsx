"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "./ui/button";
import Spinner from "./Spinner";

const LEVELS = ["Junior", "Mid", "Senior", "Lead"];
const TYPES = [
  { value: "Technical", label: "Technical" },
  { value: "Behavioral", label: "Behavioral" },
  { value: "Mixed", label: "Mixed" },
];

const GenerateForm = ({ userId }: { userId?: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    level: "Junior",
    type: "Mixed",
    techstack: "",
    amount: 5,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userid: userId,
        }),
      });

      const result = await response.json();

      if (result.success && result.interviewId) {
        toast.success("Pertanyaan wawancara berhasil dibuat!");
        router.push(`/interview/${result.interviewId}`);
      } else {
        toast.error("Gagal membuat pertanyaan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 mt-8 form">
      {/* Role */}
      <div className="flex flex-col gap-2">
        <label htmlFor="role" className="label">
          Posisi / Jabatan
        </label>
        <input
          id="role"
          name="role"
          type="text"
          required
          placeholder="contoh: Frontend Developer, Backend Engineer..."
          value={formData.role}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Level + Type row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="level" className="label">
            Tingkat Pengalaman
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="input"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="type" className="label">
            Fokus Wawancara
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Techstack */}
      <div className="flex flex-col gap-2">
        <label htmlFor="techstack" className="label">
          Tech Stack (pisahkan dengan koma)
        </label>
        <input
          id="techstack"
          name="techstack"
          type="text"
          required
          placeholder="contoh: React, TypeScript, Node.js, MongoDB"
          value={formData.techstack}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="label">
          Jumlah Pertanyaan
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min={1}
          max={20}
          required
          value={formData.amount}
          onChange={handleChange}
          className="input"
        />
      </div>

      <Button type="submit" className="btn" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner size={16} /> Membuat Pertanyaan...
          </span>
        ) : (
          "Buat Wawancara"
        )}
      </Button>
    </form>
  );
};

export default GenerateForm;
