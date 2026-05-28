export type Platform = "twitter" | "linkedin" | "threads" | "bluesky" | "mastodon";

export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface Post {
  id: string;
  user_id: string;
  content: string;
  platforms: Platform[];
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tweet_splits?: string[];
  analytics?: PostAnalytics;
}

export interface PostAnalytics {
  id: string;
  post_id: string;
  platform: Platform;
  impressions: number;
  likes: number;
  reposts: number;
  replies: number;
  clicks: number;
  recorded_at: string;
}

export interface ConnectedAccount {
  id: string;
  user_id: string;
  platform: Platform;
  username: string;
  display_name: string;
  avatar_url: string;
  access_token: string;
  connected_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
}
