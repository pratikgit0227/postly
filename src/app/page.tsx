import Link from "next/link";
import { Zap, Calendar, BarChart2, Globe, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  { icon: Globe, title: "Post Everywhere", desc: "Publish to X, LinkedIn, Threads, Bluesky, and Mastodon from one place." },
  { icon: Calendar, title: "Smart Scheduling", desc: "Queue posts at the perfect time and build a consistent content cadence." },
  { icon: BarChart2, title: "Analytics", desc: "Track impressions, likes, and engagement across all platforms." },
  { icon: Zap, title: "Thread Builder", desc: "Write long-form content and automatically split it into tweet threads." },
];

const platforms = ["X (Twitter)", "LinkedIn", "Threads", "Bluesky", "Mastodon"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">Postly</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
          <Link href="/signup" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Get started free</Link>
        </div>
      </nav>
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm px-4 py-1.5 rounded-full font-medium mb-6">
          <Zap className="w-3.5 h-3.5" />All your social media, one place
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">Write once.<br /><span className="text-indigo-600">Publish everywhere.</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">Postly is the distraction-free way to write, schedule, and publish to all your social media platforms. Grow your audience without the chaos.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors text-lg">Start for free<ArrowRight className="w-5 h-5" /></Link>
          <Link href="/login" className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors text-lg">Log in</Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400">Works with:</span>
          {platforms.map((p) => (<span key={p} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{p}</span>))}
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to grow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-indigo-200 transition-colors">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-indigo-600" /></div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to grow your audience?</h2>
          <p className="text-gray-500 mb-8">Join thousands of creators who use Postly to publish consistently.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">Get started — it&apos;s free<ArrowRight className="w-4 h-4" /></Link>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mt-4 flex-wrap">
            {["No credit card required", "Free forever plan", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" />{t}</span>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">© 2025 Postly. Built with Next.js + Supabase.</footer>
    </div>
  );
}

