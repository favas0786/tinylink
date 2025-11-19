"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Clock, MousePointer, Globe, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type LinkData = {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
};

export default function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  
  const { code } = use(params);
  
  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/links/${code}`);
        if (!res.ok) throw new Error("Link not found");
        const data = await res.json();
        setLink(data);
      } catch (err) {
        setError("Link not found or deleted.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading stats...</div>;
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-4">
      <h1 className="text-2xl font-bold text-gray-800">404 - Not Found</h1>
      <p className="text-gray-500">{error}</p>
      <Link href="/" className="text-indigo-600 hover:underline">Go back home</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
       
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-4 transition">
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Link Statistics</h1>
          <p className="text-gray-500">Stats for <span className="font-mono text-indigo-600">/{link?.shortCode}</span></p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
           
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3 mb-2 text-indigo-600">
                    <MousePointer size={24} />
                    <h3 className="font-semibold">Total Clicks</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{link?.clicks}</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3 mb-2 text-orange-600">
                    <Clock size={24} />
                    <h3 className="font-semibold">Last Clicked</h3>
                </div>
                <p className="text-lg font-medium text-gray-900">
                    {link?.lastClicked 
                        ? formatDistanceToNow(new Date(link.lastClicked), { addSuffix: true }) 
                        : "Never"}
                </p>
            </div>
        </div>

       
        <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-start gap-3">
                <Globe className="text-gray-400 mt-1" size={20} />
                <div>
                    <p className="text-sm text-gray-500 mb-1">Destination URL</p>
                    <a href={link?.originalUrl} target="_blank" className="text-indigo-600 break-all hover:underline">
                        {link?.originalUrl}
                    </a>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={20} />
                <div>
                    <p className="text-sm text-gray-500">Created on</p>
                    <p className="text-gray-800 font-medium">
                        {link && new Date(link.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}