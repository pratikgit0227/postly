import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { content, postId } = await request.json();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get LinkedIn access token
  const { data: account } = await supabase
    .from("connected_accounts")
    .select("access_token")
    .eq("user_id", user.id)
    .eq("platform", "linkedin")
    .single();

  if (!account) {
    return NextResponse.json({ error: "LinkedIn not connected" }, { status: 400 });
  }

  // Get LinkedIn person URN
  const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${account.access_token}` },
  });
  const profile = await profileRes.json();

  // Post to LinkedIn
  const postRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${account.access_token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: `urn:li:person:${profile.sub}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  if (postRes.ok) {
    // Update post status to published
    if (postId) {
      await supabase
        .from("posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", postId);
    }
    return NextResponse.json({ success: true });
  }

  const error = await postRes.json();
  return NextResponse.json({ error }, { status: 400 });
}
