"use client";

import { useState, useEffect } from "react";
import { Copy, Trash2, BarChart2, ExternalLink, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Link = {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
};

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ url: "", code: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error("Failed to fetch links", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: form.url,
          shortCode: form.code || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setForm({ url: "", code: "" }); 
        fetchLinks(); 
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    
    await fetch(`/api/links/${code}`, { method: "DELETE" });
    setLinks(links.filter((l) => l.shortCode !== code));
  };


  const handleCopy = (code: string) => {
    const fullUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    alert("Copied to clipboard!"); 
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">TinyLink</h1>
            <p className="text-gray-500">Shorten links, track clicks, manage easy.</p>
          </div>
        </header>

        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create a new link</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
            <div className="grow w-full">
              <input
                type="url"
                placeholder="https://example.com/very-long-url"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div className="w-full md:w-48">
              <input
                type="text"
                placeholder="Custom code (opt)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                maxLength={8}
              />
            </div>
            <button
              disabled={submitting}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 w-full md:w-auto"
            >
              {submitting ? "Creating..." : "Shorten"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </div>

        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your Links</h2>
            <button onClick={fetchLinks} className="text-gray-500 hover:text-indigo-600 transition">
              <RefreshCw size={20} />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading links...</div>
          ) : links.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No links created yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Short Link</th>
                    <th className="p-4">Original URL</th>
                    <th className="p-4">Clicks</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <button 
                          onClick={() => handleCopy(link.shortCode)}
                          className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
                        >
                           /{link.shortCode} <Copy size={14} />
                        </button>
                      </td>
                      <td className="p-4 max-w-xs truncate text-gray-500" title={link.originalUrl}>
                        {link.originalUrl}
                      </td>
                      <td className="p-4 font-semibold text-gray-700">{link.clicks}</td>
                      <td className="p-4 text-gray-400">
                        {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                      </td>
                      <td className="p-4 flex justify-end gap-3">
                        <a 
                            href={`/${link.shortCode}`} 
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-blue-500 transition"
                            title="Test Redirect"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => handleDelete(link.shortCode)}
                          className="p-2 text-gray-400 hover:text-red-500 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}