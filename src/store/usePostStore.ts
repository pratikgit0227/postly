"use client";
import { create } from "zustand";
import { Post, Platform } from "@/types";

interface PostStore {
  posts: Post[];
  currentDraft: Partial<Post> | null;
  isComposerOpen: boolean;
  setPosts: (posts: Post[]) => void;
  setCurrentDraft: (draft: Partial<Post> | null) => void;
  updateDraftContent: (content: string) => void;
  togglePlatform: (platform: Platform) => void;
  openComposer: (draft?: Partial<Post>) => void;
  closeComposer: () => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  removePost: (id: string) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  currentDraft: null,
  isComposerOpen: false,

  setPosts: (posts) => set({ posts }),

  setCurrentDraft: (draft) => set({ currentDraft: draft }),

  updateDraftContent: (content) =>
    set((state) => ({
      currentDraft: state.currentDraft ? { ...state.currentDraft, content } : { content },
    })),

  togglePlatform: (platform) =>
    set((state) => {
      const current = state.currentDraft?.platforms ?? [];
      const platforms = current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform];
      return {
        currentDraft: { ...state.currentDraft, platforms },
      };
    }),

  openComposer: (draft) =>
    set({
      isComposerOpen: true,
      currentDraft: draft ?? { content: "", platforms: ["twitter"] },
    }),

  closeComposer: () => set({ isComposerOpen: false, currentDraft: null }),

  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

  updatePost: (id, updates) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  removePost: (id) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
}));
