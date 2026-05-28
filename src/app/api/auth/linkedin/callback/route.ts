import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_URL = "https://postly-rho-jade.vercel.app";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/dashboard/settings?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${APP_URL}/api/auth/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${APP_URL}/dashboard/settings?error=token_failed`);
    }

    // Get LinkedIn profile using OpenID userinfo
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    // Save to Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("connected_accounts").upsert({
        user_id: user.id,
        platform: "linkedin",
        username: profile.email ?? profile.sub,
        display_name: profile.name ?? "LinkedIn User",
        avatar_url: profile.picture ?? "",
        access_token: tokenData.access_token,
      }, { onConflict: "user_id,platform" });
    }

    return NextResponse.redirect(`${APP_URL}/dashboard/settings?success=linkedin`);
  } catch {
    return NextResponse.redirect(`${APP_URL}/dashboard/settings?error=failed`);
  }
}
