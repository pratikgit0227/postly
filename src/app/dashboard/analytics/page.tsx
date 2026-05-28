"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { PlatformIcon } from "@/components/platform/PlatformIcon";
import { Platform } from "@/types";
import { TrendingUp, Eye, Heart, Repeat2, MessageCircle } from "lucide-react";

interface Analytics {
  platform: Platform;
  impressions: number;
  likes: number;
  reposts: number;
  replies: number;
}

const mockAnalytics: Analytics[] = [
  { platform: "twitter", impressions: 12400, likes: 340, reposts: 89, replies: 45 },
  { platform: "linkedin", impressions: 8200, likes: 210, reposts: 34, replies: 28 },
  { platform: "threads", impressions: 3100, likes: 95, reposts: 12, replies: 18 },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const totalImpressions = mockAnalytics.reduce((s, a) => s + a.impressions, 0);
  const totalLikes = mockAnalytics.reduce((s, a) => s + a.likes, 0);

  return (
    <>
      <Header title="Analytics" subtitle="Performance across all platforms" />
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-indigo-600 bg-indigo-50" },
            { label: "Total Likes", value: totalLikes.toLocaleString(), icon: Heart, color: "text-pink-600 bg-pink-50" },
            { label: "Avg. Engagement", value: "4.2%", icon: TrendingUp, color: "text-green-600 bg-green-50" },
            { label: "Best Platform", value: "X", icon: Repeat2, color: "text-amber-600 bg-amber-50" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{loading ? "—" : value}</p>
            </div>
          ))}
        </div>

        {/* Per-platform */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Platform Breakdown</h2>
          <div className="space-y-3">
            {mockAnalytics.map((a) => (
              <div key={a.platform} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <PlatformIcon platform={a.platform} size="md" showLabel />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Impressions", value: a.impressions, icon: Eye },
                    { label: "Likes", value: a.likes, icon: Heart },
                    { label: "Reposts", value: a.reposts, icon: Repeat2 },
                    { label: "Replies", value: a.replies, icon: MessageCircle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label}>
                      <div className="flex items-center gap-1 mb-1">
                        <Icon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{label}</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{loading ? "—" : value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">Analytics are populated once you connect your accounts and start publishing posts.</p>
      </div>
    </>
  );
}
