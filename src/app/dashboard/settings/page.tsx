"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlatformIcon, platformConfig } from "@/components/platform/PlatformIcon";
import { Platform } from "@/types";
import { CheckCircle2, Plus } from "lucide-react";

const PLATFORMS: Platform[] = ["twitter", "linkedin", "threads", "bluesky", "mastodon"];

function SettingsContent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const successPlatform = searchParams.get("success");

  const handleConnect = (platform: Platform) => {
    if (platform === "linkedin") {
      window.location.href = "/api/auth/linkedin";
    } else {
      alert(`${platformConfig[platform].label} connection coming soon!`);
    }
  };

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        setFullName(user.user_metadata?.full_name ?? "");
        const { data: accounts } = await supabase
          .from("connected_accounts")
          .select("platform")
          .eq("user_id", user.id);
        if (accounts) setConnectedAccounts(accounts.map((a) => a.platform));
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  return (
    <>
      <Header title="Settings" />
      <div className="p-6 max-w-2xl space-y-8">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email" value={email} disabled className="bg-gray-50 cursor-not-allowed" />
            <div className="flex items-center gap-3">
              <Button type="submit" loading={saving} size="sm">Save changes</Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> Saved!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Connected accounts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Connected Accounts</h2>
          <p className="text-sm text-gray-500 mb-4">Connect your social accounts to start publishing.</p>
          {successPlatform && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-3">
              <CheckCircle2 className="w-4 h-4" />
              {successPlatform.charAt(0).toUpperCase() + successPlatform.slice(1)} connected successfully!
            </div>
          )}
          <div className="space-y-3">
            {PLATFORMS.map((platform) => {
              const isConnected = connectedAccounts.includes(platform);
              return (
                <div key={platform} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <PlatformIcon platform={platform} showLabel />
                  {isConnected ? (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Connected
                    </span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleConnect(platform)}>
                      <Plus className="w-3.5 h-3.5" /> Connect
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <h2 className="font-semibold text-red-700 mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all data.</p>
          <Button variant="danger" size="sm" onClick={() => alert("Contact support to delete your account.")}>
            Delete account
          </Button>
        </div>
      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
