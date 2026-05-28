"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePostStore } from "@/store/usePostStore";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { PenSquare } from "lucide-react";

export default function DraftsPage() {
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
        .eq("status", "draft")
        .order("updated_at", { ascending: false });
      if (data) setPosts(data as Post[]);
    };
    load();
  }, []);

  const drafts = posts.filter((p) => p.status === "draft");

  return (
    <>
      <Header title="Drafts" subtitle={`${drafts.length} draft${drafts.length !== 1 ? "s" : ""}`} />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button onClick={() => openComposer()} size="sm">
            <PenSquare className="w-3.5 h-3.5" /> New Draft
          </Button>
        </div>
        {drafts.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
            <PenSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No drafts yet</p>
            <p className="text-sm text-gray-400 mb-4">Save a post as draft to come back to it later</p>
            <Button onClick={() => openComposer()}>Start writing</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </>
  );
}
