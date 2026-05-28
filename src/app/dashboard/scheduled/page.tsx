"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePostStore } from "@/store/usePostStore";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { Calendar } from "lucide-react";

export default function ScheduledPage() {
  const { posts, setPosts, openComposer } = usePostStore();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "scheduled")
        .order("scheduled_at", { ascending: true });
      if (data) setPosts(data as Post[]);
    };
    load();
  }, []);

  const scheduled = posts.filter((p) => p.status === "scheduled");

  return (
    <>
      <Header title="Scheduled" subtitle={`${scheduled.length} post${scheduled.length !== 1 ? "s" : ""} in queue`} />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button onClick={() => openComposer()} size="sm">
            <Calendar className="w-3.5 h-3.5" /> Schedule Post
          </Button>
        </div>
        {scheduled.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nothing scheduled</p>
            <p className="text-sm text-gray-400 mb-4">Schedule a post to publish it at the perfect time</p>
            <Button onClick={() => openComposer()}>Schedule a post</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduled.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </>
  );
}
