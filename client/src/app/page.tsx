// client/src/app/page.tsx
"use client"

import Link from "next/link"
import { 
  ArrowRight, Zap, BarChart3, MessageSquare, 
  CheckCircle2, Clock, Shield, Star, Rocket, Play, Menu, X 
} from "lucide-react"
// --- FIX: Added 'Legend' to imports ---
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip 
} from "recharts"
import { useState, useEffect, forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from "clsx"

// --- UTILITY ---
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

// --- UI COMPONENTS ---
const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }>(
  ({ className, variant = "primary", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(104,222,104,0.3)] hover:shadow-[0_0_30px_rgba(104,222,104,0.5)]",
      outline: "border border-primary text-primary hover:bg-primary/10",
      ghost: "text-foreground hover:bg-white/5",
    };
    return <button ref={ref} className={cn(base, variants[variant], className)} {...props} />;
  }
);
Button.displayName = "Button";

const Badge = ({ children, className = "" }: any) => (
  <span className={cn("inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary", className)}>
    {children}
  </span>
);

const Card = ({ children, className = "" }: any) => (
  <div className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

// --- ANIMATION COMPONENT ---
const AnimatedCounter = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); } 
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count.toLocaleString()}</span>;
};

// --- DATA ---
const meetingsData = [{m:"Jan",v:65},{m:"Feb",v:85},{m:"Mar",v:120},{m:"Apr",v:190},{m:"May",v:240},{m:"Jun",v:350}];
const performanceData = [{w:"W1",eff:40,eng:30},{w:"W2",eff:55,eng:45},{w:"W3",eff:70,eng:60},{w:"W4",eff:88,eng:75}];
const activityData = [{d:"Mon",v:40},{d:"Tue",v:65},{d:"Wed",v:50},{d:"Thu",v:80},{d:"Fri",v:60}];
const pieData = [{name:"Product",value:35,color:"#68de68"},{name:"Sales",value:25,color:"#3b82f6"},{name:"HR",value:20,color:"#f59e0b"},{name:"Eng",value:20,color:"#ef4444"}];

const testimonials = [
  { name: "Sarah Chen", role: "CEO, TechFlow", content: "MeetMind has transformed how our team manages meetings. We save 5 hours per week!", rating: 5, image: "https://placehold.co/100x100/222/68de68?text=SC" },
  { name: "Marcus J.", role: "Ops Manager", content: "The automated transcription features are game-changers for our distributed team.", rating: 5, image: "https://placehold.co/100x100/222/68de68?text=MJ" },
  { name: "Emma R.", role: "HR Director", content: "Perfect for scheduling interviews and onboarding sessions. Highly recommend!", rating: 5, image: "https://placehold.co/100x100/222/68de68?text=ER" },
];

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className={cn("fixed top-0 w-full z-50 transition-all duration-300", isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border py-3" : "bg-transparent py-6")}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Rocket size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">MeetMind</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {['Features', 'Analytics', 'Testimonials'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth"><Button variant="ghost">Login</Button></Link>
            <Link href="/auth"><Button className="px-6 font-bold">Get Started</Button></Link>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 px-6 flex items-center min-h-[800px]">
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-float" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          {/* Left Content */}
          <div className="space-y-8 flex flex-col items-start text-left z-10">
            <Badge className="px-4 py-1.5"><Zap size={14} className="mr-2 fill-current" /> New: AI Meeting Assistant</Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Your Gateway to <br />
              <span className="animate-gradient">Business Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Intelligent meeting assistant that streamlines your business communication. Setup, execute, and archive meetings effortlessly.
            </p>
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Link href="/auth">
                <Button className="h-14 px-8 text-lg w-fit">Start Free Trial <ArrowRight className="ml-2" /></Button>
              </Link>
              <Button variant="outline" className="h-14 px-8 text-lg w-fit">Watch Demo</Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800" />)}
               </div>
               <p>Trusted by 50,000+ teams</p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative w-full z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[600px] aspect-video bg-card/80 backdrop-blur border border-primary/20 rounded-2xl p-1 shadow-2xl animate-float">
               <div className="w-full h-full bg-[#0a0a0a] rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                  <div className="text-center p-8 z-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <MessageSquare className="text-primary w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Meeting Dashboard</h3>
                    <p className="text-sm text-muted-foreground mt-2">AI-Powered Analytics</p>
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 border-y border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", val: 50000, suffix: "+" },
              { label: "Meetings Hosted", val: 1000000, suffix: "+" },
              { label: "Uptime", val: 99.9, suffix: "%" },
              { label: "Support", val: 24, suffix: "/7" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  <AnimatedCounter end={stat.val} /><span className="text-primary">{stat.suffix}</span>
                </div>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Empowering Businesses</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Streamlined meeting management for modern teams.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: "Secure Auth", desc: "Enterprise-grade security with email & password." },
              { icon: Users, title: "Smart Setup", desc: "Pre-meeting config & post-meeting archival." },
              { icon: Zap, title: "Auto Links", desc: "Generate unique meeting links instantly." },
              { icon: BarChart3, title: "Analytics", desc: "Track meetings, participants & metrics." },
              { icon: MessageSquare, title: "AI Assistant", desc: "AI-powered meeting notes & summaries." },
              { icon: CheckCircle2, title: "Integration", desc: "Connect with your favorite tools seamlessly." },
            ].map((f, i) => (
              <Card key={i} className="p-8 hover:border-primary/50 transition-all hover:-translate-y-1 bg-card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS CHARTS */}
      <section id="analytics" className="py-24 px-6 bg-card/10 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Data-Driven Insights</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Understand your meeting dynamics like never before.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chart 1: Meeting Trends */}
            <Card className="p-6 bg-background border-border">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Meeting Trends</h3>
                  <p className="text-xs text-muted-foreground">Monthly growth</p>
                </div>
              </div>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={meetingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="m" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="v" stroke="#68de68" strokeWidth={3} dot={{r:4, fill:'#68de68'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 2: Performance */}
            <Card className="p-6 bg-background border-border">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">Performance</h3>
                <p className="text-xs text-muted-foreground">Efficiency vs Engagement</p>
              </div>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#68de68" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#68de68" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="w" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="eff" stroke="#68de68" fill="url(#colorEff)" strokeWidth={2} />
                    <Area type="monotone" dataKey="eng" stroke="#f59e0b" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 3: Daily Activity */}
            <Card className="p-6 bg-background border-border">
               <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">Daily Activity</h3>
                <p className="text-xs text-muted-foreground">Distribution</p>
              </div>
              <div className="w-full h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                       <XAxis dataKey="d" stroke="#666" fontSize={12} axisLine={false} tickLine={false} dy={10} />
                       <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
                       <Bar dataKey="v" fill="#68de68" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 4: Meeting Types */}
            <Card className="p-6 flex flex-col justify-center bg-background border-border">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-foreground">Meeting Types</h3>
                <p className="text-xs text-muted-foreground">Category breakdown</p>
              </div>
              <div className="w-full h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
                       <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">M</div>
            <span className="font-bold text-xl">MeetMind</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 MeetMind Inc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}