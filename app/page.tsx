import { useState } from "react";

export default function Home() {
  const [id, setId] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const webhookURL = "https://script.google.com/macros/s/AKfycbwze28ommfmOgeU6OVLR3q3pF4ydH_q-94L111WEWnleUkt_2-diGGtDMAp5i0k87MJ/exec";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim()) {
      setErrorMsg("Adınız olmadan gönderemezsiniz.");
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch(webhookURL, {
        method: "POST",
        body: JSON.stringify({ id, not: note, ad: name, ip: "0.0.0.0" }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Gönderim başarısız");
      setStatus("success");
      setId("");
      setNote("");
      setName("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setErrorMsg("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">LETZO Şikayet Paneli</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <label>
          Şikayet Edilen ID:
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mt-1 w-full p-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Şikayet edilen ID giriniz"
          />
        </label>
        <label>
          Şikayet Notu:
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 w-full p-2 rounded bg-gray-700 border border-gray-600 resize-y"
            rows={4}
            placeholder="Şikayet detaylarını yazınız"
          />
        </label>
        <label>
          Sizin Adınız <span className="text-red-500">*</span>:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full p-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Adınız"
          />
        </label>

        {errorMsg && <p className="text-red-400">{errorMsg}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 p-3 rounded font-semibold"
        >
          {status === "loading" ? "Gönderiliyor..." : "Gönder"}
        </button>

        {status === "success" && (
          <p className="text-green-400 mt-2 font-semibold">✅ Şikayet başarıyla gönderildi!</p>
        )}
      </form>
    </main>
  );
}
