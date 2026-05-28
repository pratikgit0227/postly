"use client";
import { Post } from "@/types";
import { PlatformIcon } from "@/components/platform/PlatformIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { usePostStore } from "@/store/usePostStore";
import { createClient } from "@/lib/supabase/client";
import { Edit2, Trash2, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const statusConfig = {
  draft: { label: "Draft", variant: "default" as const, icon: Edit2 },
  scheduled: { label: "Scheduled", variant: "warning" as const, icon: Clock },
  published: { label: "Published", variant: "success" as const, icon: CheckCircle2 },
  failed: { label: "Failed", variant: "danger" as const, icon: AlertCircle },
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { openComposer, removePost } = usePostStore();
  const supabase = createClient();
  const status = statusConfig[post.status];

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("posts").delete().eq("id", post.id);
    removePost(post.id);
  };

  const handleEdit = () => {
    openComposer(post);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap">{post.content}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {post.platforms.map((p) => (
              <div key={p} className="w-5 h-5 rounded-full ring-2 ring-white overflow-hidden">
                <PlatformIcon platform={p} size="sm" />
              </div>
            ))}
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <span className="text-xs text-gray-400">
          {post.scheduled_at
            ? `Scheduled: ${formatDateTime(post.scheduled_at)}`
            : post.published_at
            ? `Published: ${formatDateTime(post.published_at)}`
            : formatDateTime(post.created_at)}
        </span>
      </div>

      {post.analytics && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
          {[
            { label: "Impressions", value: post.analytics.impressions },
            { label: "Likes", value: post.analytics.likes },
            { label: "Reposts", value: post.analytics.reposts },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-semibold text-gray-700">{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
