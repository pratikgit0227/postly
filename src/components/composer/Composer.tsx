"use client";
import { useState, useRef, useEffect } from "react";
import { usePostStore } from "@/store/usePostStore";
import { Platform } from "@/types";
import { PlatformIcon, platformConfig } from "@/components/platform/PlatformIcon";
import { Button } from "@/components/ui/button";
import { splitIntoTweets, getCharCount } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { X, Clock, Send, Scissors, ChevronDown } from "lucide-react";

const PLATFORMS: Platform[] = ["twitter", "linkedin", "threads", "bluesky", "mastodon"];
const CHAR_LIMIT: Record<Platform, number> = {
  twitter: 280,
  linkedin: 3000,
  threads: 500,
  bluesky: 300,
  mastodon: 500,
};

export function Composer() {
  const { currentDraft, isComposerOpen, closeComposer, updateDraftContent, togglePlatform, addPost, updatePost } = usePostStore();
  const [scheduledAt, setScheduledAt] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [splits, setSplits] = useState<string[]>([]);
  const [showSplits, setShowSplits] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  const content = currentDraft?.content ?? "";
  const selectedPlatforms = currentDraft?.platforms ?? ["twitter"];

  useEffect(() => {
    if (isComposerOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isComposerOpen]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleSplitThreads = () => {
    const parts = splitIntoTweets(content);
    setSplits(parts);
    setShowSplits(true);
  };

  const savePost = async (status: "draft" | "scheduled") => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const payload = {
        user_id: user.id,
        content,
        platforms: selectedPlatforms,
        status,
        scheduled_at: status === "scheduled" && scheduledAt ? scheduledAt : null,
        tweet_splits: showSplits ? splits : null,
      };

      if (currentDraft?.id) {
        const { data } = await supabase.from("posts").update(payload).eq("id", currentDraft.id).select().single();
        if (data) updatePost(currentDraft.id, data);
      } else {
        const { data } = await supabase.from("posts").insert(payload).select().single();
        if (data) addPost(data);
      }

      closeComposer();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isComposerOpen) return null;

  const primaryPlatform = selectedPlatforms[0] ?? "twitter";
  const charLimit = CHAR_LIMIT[primaryPlatform];
  const charCount = getCharCount(content);
  const overLimit = charCount > charLimit;
  const progress = Math.min((charCount / charLimit) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {currentDraft?.id ? "Edit Post" : "New Post"}
          </h2>
          <button onClick={closeComposer} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Platform selector */}
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Post to</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const selected = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <PlatformIcon platform={p} size="sm" />
                    {platformConfig[p].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compose area */}
          <div className="px-5 py-4">
            {!showSplits ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => updateDraftContent(e.target.value)}
                placeholder="What's on your mind? Write your post here..."
                className="w-full resize-none text-gray-800 text-base leading-relaxed outline-none min-h-[160px] placeholder:text-gray-400"
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">{splits.length} tweet thread</p>
                  <button onClick={() => setShowSplits(false)} className="text-xs text-indigo-600 hover:underline">
                    Back to single post
                  </button>
                </div>
                {splits.map((tweet, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-400 mt-0.5 w-5 flex-shrink-0">{i + 1}.</span>
                      <textarea
                        value={tweet}
                        onChange={(e) => {
                          const newSplits = [...splits];
                          newSplits[i] = e.target.value;
                          setSplits(newSplits);
                        }}
                        className="w-full resize-none text-gray-800 text-sm outline-none min-h-[80px]"
                      />
                    </div>
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs ${tweet.length > 280 ? "text-red-500" : "text-gray-400"}`}>
                        {tweet.length}/280
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule picker */}
          {showSchedule && (
            <div className="px-5 pb-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <label className="text-xs font-medium text-gray-700 block mb-2">Schedule for</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Char counter */}
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="10" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="14" cy="14" r="10" fill="none"
                  stroke={overLimit ? "#ef4444" : charCount > charLimit * 0.9 ? "#f59e0b" : "#6366f1"}
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 10}`}
                  strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              {charCount > charLimit * 0.8 && (
                <span className={`text-xs font-medium ${overLimit ? "text-red-500" : "text-gray-500"}`}>
                  {charLimit - charCount}
                </span>
              )}
            </div>

            {/* Thread splitter */}
            {selectedPlatforms.includes("twitter") && content.length > 240 && !showSplits && (
              <button
                onClick={handleSplitThreads}
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Scissors className="w-3.5 h-3.5" />
                Split thread
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => savePost("draft")} loading={loading}>
              Save draft
            </Button>
            <div className="flex">
              <Button
                size="sm"
                onClick={() => savePost(scheduledAt ? "scheduled" : "draft")}
                loading={loading}
                className="rounded-r-none"
              >
                <Send className="w-3.5 h-3.5" />
                {scheduledAt ? "Schedule" : "Publish"}
              </Button>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg border-l border-indigo-700 transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
