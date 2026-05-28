"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlatformIcon, platformConfig } from "@/components/platform/PlatformIcon";
import { Platform } from "@/types";
import { CheckCircle2, Plus } from "lucide-react";

const PLATFORMS: Platform[] = ["twitter", "linkedin", "threads", "bluesky", "mastodon"];

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        setFullName(user.user_metadata?.full_name ?? "");
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
          <div className="space-y-3">
            {PLATFORMS.map((platform) => (
              <div key={platform} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <PlatformIcon platform={platform} showLabel />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`OAuth connection for ${platformConfig[platform].label} — add your API keys to enable this.`)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Connect
                </Button>
              </div>
            ))}
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
