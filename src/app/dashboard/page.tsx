"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePostStore } from "@/store/usePostStore";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { PenSquare, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const { posts, setPosts, openComposer } = usePostStore();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(" ")[0] || "there");
        const { data } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);
        if (data) setPosts(data as Post[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const stats = [
    { label: "Total Posts", value: posts.length, icon: PenSquare, color: "text-indigo-600 bg-indigo-50" },
    { label: "Scheduled", value: posts.filter((p) => p.status === "scheduled").length, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Published", value: posts.filter((p) => p.status === "published").length, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
    { label: "Drafts", value: posts.filter((p) => p.status === "draft").length, icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  ];

  const recentPosts = posts.slice(0, 5);

  return (
    <>
      <Header title={`Good morning, ${userName} 👋`} subtitle="Here's what's happening with your content." />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
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

        {/* Recent posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Posts</h2>
            <Button variant="outline" size="sm" onClick={() => openComposer()}>
              <PenSquare className="w-3.5 h-3.5" />
              New Post
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
              <PenSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No posts yet</p>
              <p className="text-sm text-gray-400 mb-4">Create your first post to get started</p>
              <Button onClick={() => openComposer()}>Create your first post</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
