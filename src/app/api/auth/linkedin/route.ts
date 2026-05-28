import { NextResponse } from "next/server";

const APP_URL = "https://postly-rho-jade.vercel.app";
const REDIRECT_URI = `${APP_URL}/api/auth/linkedin/callback`;

export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID!;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    scope: "w_member_social r_liteprofile r_emailaddress",
    state: Math.random().toString(36).substring(7),
  });

  return NextResponse.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  );
}
