import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, MapPin, Bell, BarChart3, Users, MessageSquare,
  FileText, Settings, Truck, Menu, X, Sun, Moon, Shield, Wifi,
  Cloud, Route, Star, Plus, Edit, Trash2, Download, Search,
  ArrowRight, ChevronRight, Phone, Globe, Leaf, Activity, Zap,
  Navigation, AlertCircle, CheckCircle, Clock, Fuel, TrendingUp,
  Database, RefreshCw, Filter
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { toast, Toaster } from "sonner";

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

type TruckStatus = "on-route" | "completed" | "idle" | "maintenance";
type View = "landing" | "dashboard" | "tracking" | "notifications" | "analytics" | "citizens" | "complaints" | "reports" | "settings" | "citizen-portal" | "admin";

interface TruckData {
  id: string;
  driver: string;
  area: string;
  status: TruckStatus;
  progress: number;
  x: number;
  y: number;
  fuel: number;
  collections: number;
  phone: string;
}

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════

const TRUCKS: TruckData[] = [
  { id: "T-001", driver: "Marcus Rivera", area: "Downtown Core", status: "on-route", progress: 68, x: 42, y: 38, fuel: 72, collections: 24, phone: "+1 555-0101" },
  { id: "T-002", driver: "Priya Nair", area: "Northside District", status: "completed", progress: 100, x: 22, y: 18, fuel: 45, collections: 31, phone: "+1 555-0102" },
  { id: "T-003", driver: "James Okonkwo", area: "East Park", status: "on-route", progress: 43, x: 68, y: 62, fuel: 89, collections: 18, phone: "+1 555-0103" },
  { id: "T-004", driver: "Sofia Chen", area: "Riverside", status: "idle", progress: 0, x: 78, y: 30, fuel: 98, collections: 0, phone: "+1 555-0104" },
  { id: "T-005", driver: "Ahmed Hassan", area: "West Hills", status: "maintenance", progress: 0, x: 12, y: 55, fuel: 33, collections: 0, phone: "+1 555-0105" },
  { id: "T-006", driver: "Elena Vasquez", area: "Central Market", status: "on-route", progress: 81, x: 50, y: 50, fuel: 61, collections: 29, phone: "+1 555-0106" },
  { id: "T-007", driver: "Raj Patel", area: "Harbor Zone", status: "completed", progress: 100, x: 82, y: 72, fuel: 52, collections: 35, phone: "+1 555-0107" },
  { id: "T-008", driver: "Anya Kowalski", area: "University Belt", status: "on-route", progress: 55, x: 30, y: 75, fuel: 77, collections: 21, phone: "+1 555-0108" },
];

const STATUS_COLORS: Record<TruckStatus, string> = {
  "on-route": "#00C47A",
  "completed": "#0EA5E9",
  "idle": "#F59E0B",
  "maintenance": "#EF4444",
};

const STATUS_LABELS: Record<TruckStatus, string> = {
  "on-route": "On Route",
  "completed": "Completed",
  "idle": "Idle",
  "maintenance": "Maintenance",
};

const DAILY_DATA = [
  { day: "Mon", collections: 142, efficiency: 88 },
  { day: "Tue", collections: 165, efficiency: 92 },
  { day: "Wed", collections: 138, efficiency: 85 },
  { day: "Thu", collections: 189, efficiency: 95 },
  { day: "Fri", collections: 172, efficiency: 91 },
  { day: "Sat", collections: 98, efficiency: 82 },
  { day: "Sun", collections: 61, efficiency: 78 },
];

const MONTHLY_DATA = [
  { month: "Jan", waste: 4200, target: 4000 },
  { month: "Feb", waste: 3800, target: 4000 },
  { month: "Mar", waste: 4500, target: 4200 },
  { month: "Apr", waste: 4100, target: 4200 },
  { month: "May", waste: 4800, target: 4500 },
  { month: "Jun", waste: 5100, target: 4500 },
];

const AREA_DATA = [
  { area: "Downtown", efficiency: 94, collections: 48 },
  { area: "Northside", efficiency: 88, collections: 35 },
  { area: "East Park", efficiency: 76, collections: 28 },
  { area: "Riverside", efficiency: 91, collections: 42 },
  { area: "West Hills", efficiency: 83, collections: 31 },
  { area: "Harbor", efficiency: 97, collections: 52 },
];

const FUEL_DATA = [
  { time: "06:00", liters: 12 },
  { time: "08:00", liters: 28 },
  { time: "10:00", liters: 35 },
  { time: "12:00", liters: 22 },
  { time: "14:00", liters: 38 },
  { time: "16:00", liters: 31 },
  { time: "18:00", liters: 18 },
  { time: "20:00", liters: 8 },
];

const STATUS_PIE = [
  { name: "On Route", value: 4, color: "#00C47A" },
  { name: "Completed", value: 2, color: "#0EA5E9" },
  { name: "Idle", value: 1, color: "#F59E0B" },
  { name: "Maintenance", value: 1, color: "#EF4444" },
];

const NOTIFICATIONS_DATA = [
  { id: 1, type: "approach", message: "Truck T-001 is 500m from Downtown Block 4", time: "2 min ago", read: false, area: "Downtown Core" },
  { id: 2, type: "completed", message: "Collection completed in Northside District", time: "8 min ago", read: false, area: "Northside" },
  { id: 3, type: "alert", message: "Truck T-005 requires maintenance check", time: "1 hr ago", read: true, area: "West Hills" },
  { id: 4, type: "approach", message: "Truck T-006 arriving in Central Market Zone B", time: "3 min ago", read: false, area: "Central Market" },
  { id: 5, type: "completed", message: "Harbor Zone collection — 35 points served", time: "22 min ago", read: true, area: "Harbor Zone" },
  { id: 6, type: "alert", message: "Low fuel warning: Truck T-005 (33%)", time: "1 hr ago", read: true, area: "West Hills" },
  { id: 7, type: "approach", message: "Truck T-008 approaching University Belt Sector C", time: "4 min ago", read: false, area: "University Belt" },
  { id: 8, type: "info", message: "Route optimization applied — saving 12km today", time: "30 min ago", read: true, area: "All Areas" },
];

const CITIZENS_DATA = [
  { id: "C-001", name: "Aarav Sharma", area: "Downtown Core", phone: "+1 555-1001", notifications: true, rating: 4.5, joined: "Jan 2024" },
  { id: "C-002", name: "Fatima Al-Hassan", area: "Northside District", phone: "+1 555-1002", notifications: true, rating: 4.8, joined: "Mar 2024" },
  { id: "C-003", name: "Liam O'Brien", area: "East Park", phone: "+1 555-1003", notifications: false, rating: 3.9, joined: "Feb 2024" },
  { id: "C-004", name: "Mei-Ling Wu", area: "Riverside", phone: "+1 555-1004", notifications: true, rating: 4.7, joined: "Dec 2023" },
  { id: "C-005", name: "Carlos Mendez", area: "West Hills", phone: "+1 555-1005", notifications: true, rating: 4.2, joined: "Apr 2024" },
  { id: "C-006", name: "Olga Petrov", area: "Central Market", phone: "+1 555-1006", notifications: false, rating: 4.0, joined: "May 2024" },
];

const COMPLAINTS_DATA = [
  { id: "CP-001", citizen: "Aarav Sharma", area: "Downtown Core", issue: "Missed collection on Monday", status: "resolved", priority: "medium", date: "Jun 18, 2026" },
  { id: "CP-002", citizen: "Fatima Al-Hassan", area: "Northside", issue: "Truck arrived 2 hours late", status: "in-progress", priority: "high", date: "Jun 20, 2026" },
  { id: "CP-003", citizen: "Liam O'Brien", area: "East Park", issue: "Excessive noise during collection", status: "pending", priority: "low", date: "Jun 21, 2026" },
  { id: "CP-004", citizen: "Mei-Ling Wu", area: "Riverside", issue: "Waste left on street after pickup", status: "resolved", priority: "high", date: "Jun 15, 2026" },
  { id: "CP-005", citizen: "Carlos Mendez", area: "West Hills", issue: "No notification received", status: "in-progress", priority: "medium", date: "Jun 22, 2026" },
];

const FEATURES_DATA = [
  { icon: MapPin, title: "Real-Time Truck Tracking", desc: "Monitor every vehicle live with second-by-second GPS updates on an interactive city map." },
  { icon: Navigation, title: "GPS-Based Monitoring", desc: "Precision geolocation with ±3m accuracy ensures exact position of each collection vehicle." },
  { icon: Bell, title: "Citizen Notifications", desc: "Push alerts inform residents when their collection truck is 500m away, eliminating missed pickups." },
  { icon: Shield, title: "Geo-Fencing Alerts", desc: "Define digital boundaries around zones — receive instant alerts when trucks enter or leave areas." },
  { icon: LayoutDashboard, title: "Municipal Dashboard", desc: "Unified command center for supervisors to oversee fleet status, KPIs, and citizen feedback." },
  { icon: Route, title: "Route Optimization", desc: "AI-powered algorithms compute efficient daily routes, reducing fuel use and time by up to 30%." },
  { icon: BarChart3, title: "Collection Analytics", desc: "Deep data insights on collection frequency, efficiency trends, and waste volume across all sectors." },
  { icon: MessageSquare, title: "Complaint Management", desc: "Citizens submit complaints via the portal; supervisors triage and resolve with full audit trail." },
  { icon: Wifi, title: "IoT Device Integration", desc: "Connects with onboard OBD sensors, RFID bin scanners, and fill-level IoT devices on trucks." },
  { icon: Cloud, title: "Cloud Data Storage", desc: "All telemetry stored securely with 99.9% uptime and instant retrieval across all devices." },
];

const CITY_BLOCKS = [
  { x: 3, y: 3, w: 10, h: 8 }, { x: 16, y: 3, w: 7, h: 8 }, { x: 26, y: 3, w: 12, h: 5 },
  { x: 41, y: 3, w: 8, h: 8 }, { x: 52, y: 3, w: 10, h: 5 }, { x: 65, y: 3, w: 8, h: 8 },
  { x: 76, y: 3, w: 12, h: 5 }, { x: 91, y: 3, w: 6, h: 8 },
  { x: 3, y: 15, w: 8, h: 12 }, { x: 14, y: 15, w: 10, h: 7 }, { x: 27, y: 15, w: 6, h: 12 },
  { x: 36, y: 15, w: 9, h: 7 }, { x: 48, y: 15, w: 12, h: 12 }, { x: 63, y: 15, w: 8, h: 7 },
  { x: 74, y: 15, w: 10, h: 12 }, { x: 87, y: 15, w: 10, h: 7 },
  { x: 3, y: 31, w: 12, h: 8 }, { x: 18, y: 31, w: 7, h: 8 }, { x: 28, y: 31, w: 10, h: 8 },
  { x: 41, y: 31, w: 8, h: 8 }, { x: 52, y: 31, w: 10, h: 8 }, { x: 65, y: 31, w: 6, h: 8 },
  { x: 74, y: 31, w: 12, h: 8 }, { x: 89, y: 31, w: 8, h: 8 },
  { x: 3, y: 43, w: 8, h: 10 }, { x: 14, y: 43, w: 12, h: 10 }, { x: 29, y: 43, w: 8, h: 10 },
  { x: 40, y: 43, w: 10, h: 10 }, { x: 53, y: 43, w: 8, h: 10 }, { x: 64, y: 43, w: 12, h: 10 },
  { x: 79, y: 43, w: 8, h: 10 }, { x: 90, y: 43, w: 7, h: 10 },
  { x: 3, y: 57, w: 10, h: 8 }, { x: 16, y: 57, w: 8, h: 8 }, { x: 27, y: 57, w: 12, h: 8 },
  { x: 42, y: 57, w: 8, h: 8 }, { x: 53, y: 57, w: 10, h: 8 }, { x: 66, y: 57, w: 8, h: 8 },
  { x: 77, y: 57, w: 10, h: 8 }, { x: 90, y: 57, w: 7, h: 8 },
  { x: 3, y: 69, w: 8, h: 10 }, { x: 14, y: 69, w: 10, h: 10 }, { x: 27, y: 69, w: 8, h: 10 },
  { x: 38, y: 69, w: 12, h: 10 }, { x: 53, y: 69, w: 8, h: 10 }, { x: 64, y: 69, w: 10, h: 10 },
  { x: 77, y: 69, w: 12, h: 10 }, { x: 92, y: 69, w: 5, h: 10 },
  { x: 3, y: 83, w: 10, h: 14 }, { x: 16, y: 83, w: 7, h: 14 }, { x: 26, y: 83, w: 12, h: 14 },
  { x: 41, y: 83, w: 8, h: 14 }, { x: 52, y: 83, w: 10, h: 14 }, { x: 65, y: 83, w: 8, h: 14 },
  { x: 76, y: 83, w: 12, h: 14 }, { x: 91, y: 83, w: 6, h: 14 },
];

// ═══════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════

function StatusBadge({ status }: { status: TruckStatus }) {
  const styles: Record<TruckStatus, string> = {
    "on-route": "bg-emerald-500/15 text-emerald-500 border-emerald-500/25",
    "completed": "bg-sky-500/15 text-sky-400 border-sky-500/25",
    "idle": "bg-amber-500/15 text-amber-500 border-amber-500/25",
    "maintenance": "bg-red-500/15 text-red-400 border-red-500/25",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-mono ${styles[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

// ═══════════════════════════════════════════════════════
// CITY MAP
// ═══════════════════════════════════════════════════════

function CityMap({ trucks, onSelectTruck, selectedTruck }: {
  trucks: TruckData[];
  onSelectTruck: (t: TruckData | null) => void;
  selectedTruck: TruckData | null;
}) {
  return (
    <div className="relative w-full h-full bg-[#060D1A] overflow-hidden">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="100" height="100" fill="#07101F" />
        {[13, 29, 41, 55, 67, 81].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#0F2035" strokeWidth="1.2" />
        ))}
        {[13, 25, 39, 51, 63, 75, 89].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#0F2035" strokeWidth="1.2" />
        ))}
        {CITY_BLOCKS.map((block, i) => (
          <rect key={i} x={block.x} y={block.y} width={block.w} height={block.h} fill="#0C1A2E" rx="0.5" />
        ))}
        <rect x="40" y="55" width="10" height="11" fill="#0A2218" rx="0.5" />
        <rect x="15" y="29" width="9" height="11" fill="#0A2218" rx="0.5" />
        <rect x="63" y="67" width="24" height="13" fill="#05111E" rx="0.5" />
        <text x="75" y="75" fontSize="2" fill="#0EA5E933" textAnchor="middle" fontFamily="monospace">HARBOR</text>
        <text x="45" y="62" fontSize="2" fill="#00C47A33" textAnchor="middle" fontFamily="monospace">PARK</text>
      </svg>

      {trucks.map(truck => (
        <button
          key={truck.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
          style={{ left: `${truck.x}%`, top: `${truck.y}%` }}
          onClick={() => onSelectTruck(selectedTruck?.id === truck.id ? null : truck)}
        >
          {truck.status === "on-route" && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-50"
              style={{ backgroundColor: STATUS_COLORS[truck.status] }}
            />
          )}
          <div
            className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${selectedTruck?.id === truck.id ? "scale-130 border-white" : "border-white/80"}`}
            style={{ backgroundColor: STATUS_COLORS[truck.status], boxShadow: `0 0 10px ${STATUS_COLORS[truck.status]}70` }}
          >
            <Truck className="w-2.5 h-2.5 text-white" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A2540] border border-white/20 rounded px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap font-mono pointer-events-none">
            {truck.id}
          </div>
        </button>
      ))}

      <div className="absolute bottom-3 left-3 bg-[#060D1A]/90 backdrop-blur-sm border border-white/10 rounded-lg p-2.5">
        <div className="text-[10px] text-white/40 font-mono mb-1.5 tracking-widest">FLEET STATUS</div>
        {(Object.entries(STATUS_COLORS) as [TruckStatus, string][]).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2 text-[10px] text-white/55 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            {STATUS_LABELS[status]}
          </div>
        ))}
      </div>

      <div className="absolute top-3 right-3 bg-[#060D1A]/90 backdrop-blur-sm border border-[#00C47A]/30 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#00C47A] rounded-full animate-pulse" />
        <span className="text-[10px] text-[#00C47A] font-mono tracking-widest">LIVE</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════

function LandingNavbar({ onEnterDashboard, isDark, toggleDark }: {
  onEnterDashboard: () => void;
  isDark: boolean;
  toggleDark: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#060D1A]/95 backdrop-blur-md shadow-lg shadow-black/30" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00C47A] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg font-display tracking-tight">
            SmartWaste<span className="text-[#00C47A]">Connect</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["About", "Features", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white text-sm font-medium transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onEnterDashboard}
            className="hidden md:inline-flex items-center gap-2 bg-[#00C47A] hover:bg-[#00A865] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-[#00C47A]/25"
          >
            Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setMenuOpen(m => !m)} className="md:hidden p-2 text-white">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#060D1A]/97 backdrop-blur-md px-6 py-4 border-t border-white/10">
          {["About", "Features", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-white/60 hover:text-white py-2.5 text-sm font-medium border-b border-white/5 last:border-0">
              {item}
            </a>
          ))}
          <button onClick={onEnterDashboard} className="mt-4 w-full bg-[#00C47A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold">
            Live Dashboard
          </button>
        </div>
      )}
    </nav>
  );
}

function HeroSection({ onEnterDashboard }: { onEnterDashboard: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#060D1A]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&h=900&fit=crop&auto=format"
          alt="Smart city aerial night view"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060D1A]/60 via-[#060D1A]/30 to-[#060D1A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060D1A] via-transparent to-[#060D1A]/70" />
      </div>

      <div className="absolute inset-0 opacity-8 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="herogrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C47A" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#herogrid)" />
        </svg>
      </div>

      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#00C47A]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#0EA5E9]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#00C47A]/10 border border-[#00C47A]/25 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-[#00C47A] rounded-full animate-pulse" />
            <span className="text-[#00C47A] text-sm font-mono font-medium tracking-wide">IoT-Enabled Smart Waste Management</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.08] font-display">
            SmartWaste Connect
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-3 font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#00C47A] to-[#0EA5E9]">
              IoT-Driven Waste Collection Monitoring &amp; Citizen Notification Platform
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/55 mb-10 max-w-2xl leading-relaxed">
            Enhancing urban cleanliness through real-time vehicle tracking, intelligent notifications, and smart waste management for modern cities.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-2.5 bg-[#00C47A] hover:bg-[#00A865] text-white px-8 py-4 rounded-xl text-base font-semibold transition-all shadow-xl shadow-[#00C47A]/25 hover:shadow-[#00C47A]/35 hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-2.5 bg-white/8 hover:bg-white/14 border border-white/18 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all backdrop-blur-sm"
            >
              Live Dashboard <Activity className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Trucks", value: "48", unit: "fleet" },
              { label: "Areas Covered", value: "127", unit: "zones" },
              { label: "Citizens Notified", value: "24.8K", unit: "today" },
              { label: "Collection Rate", value: "97.3", unit: "%" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white font-mono">
                  {stat.value}<span className="text-xs text-white/35 ml-1">{stat.unit}</span>
                </div>
                <div className="text-sm text-white/45 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const cards = [
    {
      icon: MapPin, color: "#00C47A",
      title: "Real-Time Monitoring",
      desc: "Every truck transmits live GPS coordinates every 5 seconds, giving supervisors complete fleet visibility at all times.",
      img: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=200&fit=crop&auto=format",
    },
    {
      icon: Bell, color: "#0EA5E9",
      title: "Citizen Notifications",
      desc: "Residents receive push notifications when their collection truck is within 500m, reducing missed collections by 94%.",
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format",
    },
    {
      icon: Zap, color: "#F59E0B",
      title: "Smart City Integration",
      desc: "Seamlessly integrates with municipal ERP systems, traffic management platforms, and city-wide IoT networks.",
      img: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=200&fit=crop&auto=format",
    },
    {
      icon: Leaf, color: "#8B5CF6",
      title: "Sustainable Management",
      desc: "Route optimization reduces fuel consumption by 28% and carbon emissions by 31%, contributing to a greener city.",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&auto=format",
    },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-[#060D1A] to-[#0A1628]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0EA5E9]/10 border border-[#0EA5E9]/25 rounded-full px-4 py-2 mb-6">
            <Leaf className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span className="text-[#0EA5E9] text-sm font-medium">Smart City Integration</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Transforming Urban Waste Management
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto">
            Connecting municipalities, drivers, and citizens through a unified IoT platform that makes waste collection smarter, faster, and more transparent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(card => (
            <div key={card.title} className="group bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-white/18 transition-all">
              <div className="relative h-36 overflow-hidden bg-slate-900">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="p-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: card.color + "18", border: `1px solid ${card.color}30` }}>
                  <card.icon className="w-4.5 h-4.5" style={{ color: card.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2 font-display text-sm leading-snug">{card.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#00C47A]/10 border border-[#00C47A]/25 rounded-full px-4 py-2 mb-6">
            <Zap className="w-3.5 h-3.5 text-[#00C47A]" />
            <span className="text-[#00C47A] text-sm font-medium">Platform Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Everything Your City Needs
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            Ten integrated capabilities designed to transform how your municipality manages waste collection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES_DATA.map((feature) => (
            <div
              key={feature.title}
              className="group bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-2xl p-5 hover:border-[#00C47A]/30 hover:bg-white/[0.07] transition-all cursor-default"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#00C47A]/15 to-[#0EA5E9]/15 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#00C47A]/25 group-hover:to-[#0EA5E9]/25 transition-all">
                <feature.icon className="w-5 h-5 text-[#00C47A]" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 font-display leading-snug">{feature.title}</h3>
              <p className="text-white/38 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFooter({ onEnterDashboard }: { onEnterDashboard: () => void }) {
  return (
    <footer id="contact" className="bg-[#060D1A] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00C47A] to-[#0EA5E9] rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold font-display">SmartWaste<span className="text-[#00C47A]">Connect</span></span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-4">
              IoT-driven waste collection monitoring and citizen notification platform for smart cities worldwide.
            </p>
            <div className="flex gap-2.5">
              {[Globe, MessageSquare, Activity].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/4 hover:bg-white/10 border border-white/8 rounded-lg flex items-center justify-center text-white/35 hover:text-white transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display">Platform</h4>
            {["Live Tracking", "Notifications", "Analytics", "Citizen Portal", "Admin Portal"].map(item => (
              <a key={item} href="#" className="block text-white/35 hover:text-white/65 text-sm py-1.5 transition-colors">{item}</a>
            ))}
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display">Resources</h4>
            {["Documentation", "API Reference", "Case Studies", "Blog", "Support"].map(item => (
              <a key={item} href="#" className="block text-white/35 hover:text-white/65 text-sm py-1.5 transition-colors">{item}</a>
            ))}
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display">Contact</h4>
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2.5 text-white/35 text-sm">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span>contact@smartwaste.city</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/35 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (800) 555-WASTE</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/35 text-sm">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span>smartwaste.city</span>
              </div>
            </div>
            <button
              onClick={onEnterDashboard}
              className="w-full bg-[#00C47A] hover:bg-[#00A865] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              Access Dashboard
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">© 2026 SmartWaste Connect. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
              <a key={item} href="#" className="text-white/25 hover:text-white/55 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════
// DASHBOARD SIDEBAR
// ═══════════════════════════════════════════════════════

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tracking", label: "Live Tracking", icon: MapPin },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 4 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "citizens", label: "Citizens", icon: Users },
  { id: "complaints", label: "Complaints", icon: MessageSquare },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ activeView, setView, mobileOpen, setMobileOpen, isDark, toggleDark }: {
  activeView: View;
  setView: (v: View) => void;
  mobileOpen: boolean;
  setMobileOpen: (b: boolean) => void;
  isDark: boolean;
  toggleDark: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col w-64
        bg-[#060D1A] border-r border-white/8
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00C47A] to-[#0EA5E9] rounded-lg flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-sm font-display leading-none">SmartWaste</div>
            <div className="text-[#00C47A] text-xs font-mono leading-none mt-0.5">Connect · v2.4</div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-white/35 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00C47A] rounded-full animate-pulse" />
            <span className="text-xs text-white/40 font-mono">8 / 12 Trucks Active</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setView(item.id as View); setMobileOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active
                    ? "bg-[#00C47A]/12 text-[#00C47A] border border-[#00C47A]/18"
                    : "text-white/45 hover:text-white hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-[#00C47A] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-4 pt-3 border-t border-white/8 space-y-0.5">
          <button
            onClick={toggleDark}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all border border-transparent"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={() => setView("citizen-portal")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all border border-transparent"
          >
            <Users className="w-4 h-4" /> Citizen Portal
          </button>
          <button
            onClick={() => setView("admin")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all border border-transparent"
          >
            <Shield className="w-4 h-4" /> Admin Portal
          </button>
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// DASHBOARD HEADER
// ═══════════════════════════════════════════════════════

function DashboardHeader({ title, subtitle, onMenuClick }: { title: string; subtitle?: string; onMenuClick: () => void }) {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => toast.success("Data refreshed")}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => toast.info("Downloading...")}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <Download className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-[#00C47A] to-[#0EA5E9] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">MA</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════

function StatCard({ title, value, unit, change, icon: Icon, color }: {
  title: string; value: string; unit?: string; change?: string; icon: React.ElementType; color: string;
}) {
  const isPositive = change && !change.startsWith("-");
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-[#00C47A]/25 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {change && (
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
            {isPositive ? "▲" : "▼"} {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground font-mono">
        {value}{unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{title}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DASHBOARD HOME
// ═══════════════════════════════════════════════════════

function DashboardHome({ setView }: { setView: (v: View) => void }) {
  const [selectedTruck, setSelectedTruck] = useState<TruckData | null>(null);

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard title="Active Trucks" value="8" unit="/12" change="2" icon={Truck} color="#00C47A" />
        <StatCard title="Areas Covered" value="6" unit="zones" change="1" icon={MapPin} color="#0EA5E9" />
        <StatCard title="Pending Collections" value="23" change="-8" icon={Clock} color="#F59E0B" />
        <StatCard title="Notifications Sent" value="1,247" change="18%" icon={Bell} color="#8B5CF6" />
        <StatCard title="Satisfaction Rate" value="94.2" unit="%" change="1.3%" icon={Star} color="#00C47A" />
        <StatCard title="Fuel Today" value="342" unit="L" change="-12%" icon={Fuel} color="#EF4444" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground font-display text-sm">Live Fleet Map</h3>
              <p className="text-xs text-muted-foreground">Real-time truck positions</p>
            </div>
            <button onClick={() => setView("tracking")} className="text-xs text-[#00C47A] hover:underline flex items-center gap-1">
              Full View <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-72">
            <CityMap trucks={TRUCKS} selectedTruck={selectedTruck} onSelectTruck={setSelectedTruck} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <h3 className="font-semibold text-foreground font-display text-sm">Fleet Status</h3>
            <span className="text-xs text-muted-foreground font-mono">8 Active</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {TRUCKS.map(truck => (
              <div key={truck.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[truck.status] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground font-mono">{truck.id}</div>
                  <div className="text-xs text-muted-foreground truncate">{truck.area}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-mono text-foreground">{truck.progress}%</div>
                  <div className="w-12 h-1 bg-muted rounded-full mt-1">
                    <div className="h-full rounded-full" style={{ width: `${truck.progress}%`, backgroundColor: STATUS_COLORS[truck.status] }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground font-display text-sm mb-1">Daily Collection Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Collections across this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={DAILY_DATA}>
              <defs>
                <linearGradient id="collGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C47A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00C47A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="collections" stroke="#00C47A" fill="url(#collGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground font-display text-sm mb-1">Status Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Current fleet allocation</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={STATUS_PIE} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                  {STATUS_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-shrink-0 space-y-2.5">
              {STATUS_PIE.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-xs whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted-foreground font-mono ml-1 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground font-display text-sm">Recent Alerts</h3>
          <button onClick={() => setView("notifications")} className="text-xs text-[#00C47A] hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {NOTIFICATIONS_DATA.slice(0, 4).map(notif => (
          <div key={notif.id} className={`flex items-start gap-4 px-5 py-3.5 border-b border-border last:border-0 ${!notif.read ? "bg-[#00C47A]/3" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              notif.type === "approach" ? "bg-[#00C47A]/12" : notif.type === "completed" ? "bg-[#0EA5E9]/12" : "bg-[#F59E0B]/12"
            }`}>
              {notif.type === "approach" ? <Navigation className="w-3.5 h-3.5 text-[#00C47A]" /> :
               notif.type === "completed" ? <CheckCircle className="w-3.5 h-3.5 text-[#0EA5E9]" /> :
               <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{notif.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{notif.time}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-xs text-muted-foreground">{notif.area}</span>
              </div>
            </div>
            {!notif.read && <span className="w-2 h-2 bg-[#00C47A] rounded-full flex-shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LIVE TRACKING
// ═══════════════════════════════════════════════════════

function LiveTracking() {
  const [selectedTruck, setSelectedTruck] = useState<TruckData | null>(TRUCKS[0]);
  const [search, setSearch] = useState("");

  const filtered = TRUCKS.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.driver.toLowerCase().includes(search.toLowerCase()) ||
    t.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-5" style={{ minHeight: "calc(100vh - 180px)" }}>
      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden flex flex-col min-h-96">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <h3 className="font-semibold text-foreground font-display text-sm">Live Fleet Map</h3>
            <p className="text-xs text-muted-foreground">Click a truck marker for details</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00C47A] rounded-full animate-pulse" />
            <span className="text-xs text-[#00C47A] font-mono tracking-widest">LIVE</span>
          </div>
        </div>
        <div className="flex-1">
          <CityMap trucks={TRUCKS} selectedTruck={selectedTruck} onSelectTruck={setSelectedTruck} />
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trucks, drivers..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00C47A]/50 transition-colors"
          />
        </div>

        {selectedTruck && (
          <div className="bg-card border border-[#00C47A]/25 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#00C47A]/12 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-[#00C47A]" />
                </div>
                <span className="font-bold text-foreground font-mono">{selectedTruck.id}</span>
              </div>
              <StatusBadge status={selectedTruck.status} />
            </div>
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Driver</span>
                <span className="text-foreground font-medium">{selectedTruck.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Area</span>
                <span className="text-foreground text-xs">{selectedTruck.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Collections</span>
                <span className="text-foreground font-mono font-semibold">{selectedTruck.collections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="text-foreground font-mono text-xs">{selectedTruck.phone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Route Progress</span>
                  <span className="text-foreground font-mono">{selectedTruck.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full">
                  <div className="h-full rounded-full transition-all" style={{ width: `${selectedTruck.progress}%`, backgroundColor: STATUS_COLORS[selectedTruck.status] }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Fuel Level</span>
                  <span className={`font-mono ${selectedTruck.fuel < 40 ? "text-red-500" : "text-foreground"}`}>{selectedTruck.fuel}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full">
                  <div className="h-full rounded-full transition-all" style={{ width: `${selectedTruck.fuel}%`, backgroundColor: selectedTruck.fuel < 40 ? "#EF4444" : "#00C47A" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl overflow-hidden flex-1">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xs text-muted-foreground font-mono">{filtered.length} trucks found</span>
          </div>
          <div className="overflow-y-auto max-h-72">
            {filtered.map(truck => (
              <button
                key={truck.id}
                onClick={() => setSelectedTruck(truck)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors text-left ${selectedTruck?.id === truck.id ? "bg-muted/50" : ""}`}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[truck.status] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono font-semibold text-foreground">{truck.id}</div>
                  <div className="text-xs text-muted-foreground truncate">{truck.driver}</div>
                </div>
                <div className="text-xs text-muted-foreground flex-shrink-0 text-right">
                  <div>{truck.area.split(" ")[0]}</div>
                  <div className="font-mono">{truck.fuel}% fuel</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════

function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(NOTIFICATIONS_DATA);

  const markAllRead = () => {
    setItems(n => n.map(notif => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const filtered = filter === "all" ? items
    : filter === "unread" ? items.filter(n => !n.read)
    : items.filter(n => n.type === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {["all", "unread", "approach", "completed", "alert", "info"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-[#00C47A] text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={markAllRead} className="text-xs text-[#00C47A] hover:underline font-medium">
          Mark all read
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.map(notif => (
          <div key={notif.id} className={`flex items-start gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${!notif.read ? "bg-[#00C47A]/3" : ""}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              notif.type === "approach" ? "bg-[#00C47A]/12" :
              notif.type === "completed" ? "bg-[#0EA5E9]/12" :
              notif.type === "info" ? "bg-purple-500/12" :
              "bg-[#F59E0B]/12"
            }`}>
              {notif.type === "approach" ? <Navigation className="w-4 h-4 text-[#00C47A]" /> :
               notif.type === "completed" ? <CheckCircle className="w-4 h-4 text-[#0EA5E9]" /> :
               notif.type === "info" ? <Activity className="w-4 h-4 text-purple-500" /> :
               <AlertCircle className="w-4 h-4 text-[#F59E0B]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{notif.message}</p>
              <div className="flex items-center flex-wrap gap-2 mt-1.5">
                <span className="text-xs text-muted-foreground">{notif.time}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-xs text-muted-foreground">{notif.area}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide ${
                  notif.type === "approach" ? "bg-[#00C47A]/10 text-[#00C47A]" :
                  notif.type === "completed" ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" :
                  notif.type === "info" ? "bg-purple-500/10 text-purple-500" :
                  "bg-[#F59E0B]/10 text-[#F59E0B]"
                }`}>
                  {notif.type}
                </span>
              </div>
            </div>
            {!notif.read && <span className="w-2 h-2 bg-[#00C47A] rounded-full flex-shrink-0 mt-2" />}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">No notifications found</div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════

function AnalyticsPage() {
  const chartStyle = {
    contentStyle: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Avg Efficiency", value: "88.2%", color: "#00C47A" },
          { label: "Total Collected", value: "27.5T", color: "#0EA5E9" },
          { label: "Fuel Saved", value: "284L", color: "#F59E0B" },
          { label: "CO₂ Reduced", value: "680kg", color: "#8B5CF6" },
          { label: "Complaint Rate", value: "0.8%", color: "#EF4444" },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-xl font-bold font-mono mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground font-display text-sm mb-1">Daily Collection Trends</h3>
          <p className="text-xs text-muted-foreground mb-4">Collections per day this week</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DAILY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip {...chartStyle} />
              <Bar dataKey="collections" fill="#00C47A" radius={[4, 4, 0, 0]} name="Collections" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground font-display text-sm mb-1">Monthly Waste Statistics</h3>
          <p className="text-xs text-muted-foreground mb-4">Actual vs. target collection (tonnes)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip {...chartStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="waste" stroke="#00C47A" strokeWidth={2.5} dot={{ r: 4, fill: "#00C47A" }} name="Actual" />
              <Line type="monotone" dataKey="target" stroke="#0EA5E9" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground font-display text-sm mb-1">Area-wise Collection Efficiency</h3>
          <p className="text-xs text-muted-foreground mb-4">Efficiency percentage by district</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={AREA_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis dataKey="area" type="category" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={72} />
              <Tooltip {...chartStyle} formatter={(v: number) => [`${v}%`, "Efficiency"]} />
              <Bar dataKey="efficiency" radius={[0, 4, 4, 0]} name="Efficiency">
                {AREA_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.efficiency >= 90 ? "#00C47A" : entry.efficiency >= 80 ? "#0EA5E9" : "#F59E0B"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground font-display text-sm mb-1">Fuel Consumption Analysis</h3>
          <p className="text-xs text-muted-foreground mb-4">Fleet-wide fuel usage throughout the day</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={FUEL_DATA}>
              <defs>
                <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip {...chartStyle} formatter={(v: number) => [`${v}L`, "Fuel Used"]} />
              <Area type="monotone" dataKey="liters" stroke="#EF4444" fill="url(#fuelGrad)" strokeWidth={2} dot={false} name="Liters" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CITIZENS
// ═══════════════════════════════════════════════════════

function CitizensPage() {
  const [search, setSearch] = useState("");
  const filtered = CITIZENS_DATA.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search citizens..."
            className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00C47A]/50 w-60 transition-colors"
          />
        </div>
        <button
          onClick={() => toast.success("New citizen form opened")}
          className="flex items-center gap-2 bg-[#00C47A] hover:bg-[#00A865] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Citizen
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["ID", "Name", "Area", "Phone", "Notifications", "Rating", "Joined", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(citizen => (
                <tr key={citizen.id} className="border-b border-border last:border-0 hover:bg-muted/25 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{citizen.id}</td>
                  <td className="px-5 py-3.5 font-medium text-foreground whitespace-nowrap">{citizen.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{citizen.area}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{citizen.phone}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full ${citizen.notifications ? "bg-[#00C47A]/10 text-[#00C47A]" : "bg-muted text-muted-foreground"}`}>
                      {citizen.notifications ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#F59E0B] fill-current" />
                      <span className="font-mono text-sm text-foreground">{citizen.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{citizen.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toast.info(`Editing ${citizen.name}`)} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toast.error(`Removed ${citizen.name}`)} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPLAINTS
// ═══════════════════════════════════════════════════════

function ComplaintsPage() {
  const PRIORITY_STYLES: Record<string, string> = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    low: "bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20",
  };
  const STATUS_STYLES: Record<string, string> = {
    resolved: "bg-[#00C47A]/10 text-[#00C47A]",
    "in-progress": "bg-[#F59E0B]/10 text-[#F59E0B]",
    pending: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "In Progress", "Resolved"].map(f => (
            <button key={f} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => toast.success("Report exported")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-all bg-card hover:bg-muted/30">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["ID", "Citizen", "Issue", "Area", "Priority", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPLAINTS_DATA.map(complaint => (
                <tr key={complaint.id} className="border-b border-border last:border-0 hover:bg-muted/25 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{complaint.id}</td>
                  <td className="px-5 py-3.5 font-medium text-foreground whitespace-nowrap">{complaint.citizen}</td>
                  <td className="px-5 py-3.5 text-muted-foreground max-w-44">
                    <span className="block truncate text-xs">{complaint.issue}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">{complaint.area}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[complaint.priority]}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${STATUS_STYLES[complaint.status]}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">{complaint.date}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toast.success(`Complaint ${complaint.id} resolved`)} className="text-xs text-[#00C47A] hover:underline font-medium">
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════

function ReportsPage() {
  const reports = [
    { name: "Daily Collection Summary", date: "Jun 23, 2026", size: "2.4 MB", type: "PDF" },
    { name: "Weekly Fleet Performance", date: "Jun 21, 2026", size: "5.1 MB", type: "Excel" },
    { name: "Monthly Waste Statistics", date: "Jun 1, 2026", size: "8.7 MB", type: "PDF" },
    { name: "Citizen Satisfaction Q2", date: "May 31, 2026", size: "3.2 MB", type: "PDF" },
    { name: "Fuel Consumption Report", date: "Jun 20, 2026", size: "1.8 MB", type: "Excel" },
    { name: "Route Optimization Analysis", date: "Jun 15, 2026", size: "4.5 MB", type: "PDF" },
    { name: "Complaint Resolution Log", date: "Jun 22, 2026", size: "1.1 MB", type: "Excel" },
    { name: "Driver Performance Review", date: "Jun 16, 2026", size: "2.9 MB", type: "PDF" },
  ];

  return (
    <div>
      <div className="flex gap-3 mb-5">
        <button onClick={() => toast.success("Generating PDF report...")} className="flex items-center gap-2 bg-[#00C47A] hover:bg-[#00A865] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
          <Download className="w-4 h-4" /> Export PDF
        </button>
        <button onClick={() => toast.success("Generating Excel report...")} className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-muted/30">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {reports.map(report => (
          <div key={report.name} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-[#00C47A]/25 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${report.type === "PDF" ? "bg-red-500/10" : "bg-[#00C47A]/10"}`}>
              <FileText className={`w-5 h-5 ${report.type === "PDF" ? "text-red-400" : "text-[#00C47A]"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-sm truncate">{report.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5 font-mono">{report.date} · {report.size} · {report.type}</div>
            </div>
            <button onClick={() => toast.success(`Downloading ${report.name}`)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground flex-shrink-0">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════

function SettingsPage({ isDark, toggleDark }: { isDark: boolean; toggleDark: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [geoFencing, setGeoFencing] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [alertRadius, setAlertRadius] = useState("500");
  const [refreshInterval, setRefreshInterval] = useState("5");

  function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${checked ? "bg-[#00C47A]" : "bg-muted"}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-6" : "left-1"}`} />
      </button>
    );
  }

  return (
    <div className="max-w-xl space-y-5">
      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        <div className="px-5 py-4">
          <h3 className="font-semibold text-foreground font-display text-sm">Appearance</h3>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Switch between light and dark interface themes</div>
          </div>
          <Toggle checked={isDark} onChange={toggleDark} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        <div className="px-5 py-4">
          <h3 className="font-semibold text-foreground font-display text-sm">Notifications</h3>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Push Notifications</div>
            <div className="text-xs text-muted-foreground">Alert citizens when trucks approach their zone</div>
          </div>
          <Toggle checked={notifications} onChange={() => setNotifications(n => !n)} />
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Geo-Fencing Alerts</div>
            <div className="text-xs text-muted-foreground">Alert when trucks enter or exit defined zones</div>
          </div>
          <Toggle checked={geoFencing} onChange={() => setGeoFencing(n => !n)} />
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">SMS Alerts</div>
            <div className="text-xs text-muted-foreground">Send SMS backup for citizens without the app</div>
          </div>
          <Toggle checked={smsAlerts} onChange={() => setSmsAlerts(n => !n)} />
        </div>
        <div className="px-5 py-4">
          <label className="text-sm font-medium text-foreground block mb-2">Alert Radius</label>
          <select value={alertRadius} onChange={e => setAlertRadius(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[#00C47A]/50">
            <option value="250">250 meters</option>
            <option value="500">500 meters</option>
            <option value="750">750 meters</option>
            <option value="1000">1 kilometer</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        <div className="px-5 py-4">
          <h3 className="font-semibold text-foreground font-display text-sm">GPS &amp; Tracking</h3>
        </div>
        <div className="px-5 py-4">
          <label className="text-sm font-medium text-foreground block mb-2">GPS Refresh Interval</label>
          <select value={refreshInterval} onChange={e => setRefreshInterval(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[#00C47A]/50">
            <option value="3">Every 3 seconds</option>
            <option value="5">Every 5 seconds</option>
            <option value="10">Every 10 seconds</option>
            <option value="30">Every 30 seconds</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => toast.success("Settings saved successfully")}
        className="bg-[#00C47A] hover:bg-[#00A865] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-[#00C47A]/25"
      >
        Save Settings
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CITIZEN PORTAL
// ═══════════════════════════════════════════════════════

function CitizenPortal({ setView }: { setView: (v: View) => void }) {
  const [tab, setTab] = useState<"map" | "notifications" | "complaint" | "rate">("map");
  const [selectedTruck, setSelectedTruck] = useState<TruckData | null>(null);
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#060D1A] border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-[#00C47A] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Truck className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-bold text-sm font-display">Citizen Portal</span>
          <span className="text-white/25 text-xs">— SmartWaste Connect</span>
        </div>
        <button onClick={() => setView("dashboard")} className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
          <ArrowRight className="w-3 h-3 rotate-180" /> Admin Dashboard
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#00C47A]/8 to-[#0EA5E9]/8 border border-[#00C47A]/18 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#00C47A]/15 rounded-full flex items-center justify-center">
              <span className="text-[#00C47A] font-bold">AS</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-foreground font-display">Aarav Sharma</div>
              <div className="text-sm text-muted-foreground">Downtown Core · Notifications Enabled</div>
            </div>
            <div className="text-right">
              <div className="text-[#00C47A] font-bold font-mono">T-001</div>
              <div className="text-xs text-muted-foreground">Assigned truck</div>
            </div>
          </div>
        </div>

        <div className="bg-[#00C47A]/8 border border-[#00C47A]/25 rounded-xl p-4 mb-5 flex items-center gap-3">
          <span className="w-2 h-2 bg-[#00C47A] rounded-full animate-pulse flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold text-[#00C47A]">Truck T-001 is approaching your area</span>
            <span className="text-foreground/70"> — estimated arrival in </span>
            <span className="font-mono font-bold text-foreground">8 minutes</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { id: "map", label: "Live Location" },
            { id: "notifications", label: "Notifications" },
            { id: "complaint", label: "Submit Complaint" },
            { id: "rate", label: "Rate Service" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-[#00C47A] text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "map" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground font-display text-sm">Live Truck Location — Downtown Core</h3>
            </div>
            <div className="h-72">
              <CityMap trucks={TRUCKS.filter(t => t.area === "Downtown Core")} selectedTruck={selectedTruck} onSelectTruck={setSelectedTruck} />
            </div>
            <div className="px-5 py-4 grid grid-cols-3 gap-4 border-t border-border">
              {[{ label: "ETA", value: "8 min" }, { label: "Distance", value: "500m" }, { label: "Route Done", value: "68%", color: "#00C47A" }].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`font-mono font-bold text-foreground text-lg`} style={s.color ? { color: s.color } : {}}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-foreground font-display text-sm">Your Notifications</h3>
              <span className="text-xs text-[#00C47A] font-mono font-semibold">4 unread</span>
            </div>
            {NOTIFICATIONS_DATA.slice(0, 6).map(n => (
              <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 border-b border-border last:border-0 ${!n.read ? "bg-[#00C47A]/3" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === "approach" ? "bg-[#00C47A]/12" : n.type === "completed" ? "bg-[#0EA5E9]/12" : "bg-[#F59E0B]/12"}`}>
                  {n.type === "approach" ? <Navigation className="w-3 h-3 text-[#00C47A]" /> : n.type === "completed" ? <CheckCircle className="w-3 h-3 text-[#0EA5E9]" /> : <AlertCircle className="w-3 h-3 text-[#F59E0B]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
                {!n.read && <span className="w-1.5 h-1.5 bg-[#00C47A] rounded-full mt-2 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}

        {tab === "complaint" && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground font-display text-sm mb-4">Submit a Complaint</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Issue Type</label>
                <select className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-[#00C47A]/50">
                  <option>Missed Collection</option>
                  <option>Late Arrival</option>
                  <option>Noise Complaint</option>
                  <option>Waste Left Behind</option>
                  <option>No Notification Received</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00C47A]/50 resize-none"
                />
              </div>
              <button
                onClick={() => toast.success("Complaint submitted — we will respond within 24 hours")}
                className="bg-[#00C47A] hover:bg-[#00A865] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        )}

        {tab === "rate" && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground font-display text-sm mb-4">Rate Today&apos;s Collection</h3>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-5">How satisfied were you with today&apos;s waste collection service?</p>
              <div className="flex justify-center gap-3 mb-5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => { setRating(star); toast.success(`Thank you! ${star} star${star !== 1 ? "s" : ""} submitted.`); }}>
                    <Star className={`w-10 h-10 transition-all hover:scale-110 ${star <= rating ? "text-[#F59E0B] fill-current" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              {rating > 0 && <p className="text-sm text-[#00C47A] font-medium">Thank you for your feedback!</p>}
            </div>
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-3 font-display">Collection History</h4>
              {[
                { date: "Jun 23, 2026", truck: "T-001", status: "Completed", time: "09:32 AM" },
                { date: "Jun 20, 2026", truck: "T-001", status: "Completed", time: "09:15 AM" },
                { date: "Jun 17, 2026", truck: "T-002", status: "Completed", time: "10:48 AM" },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{h.date}</span>
                  <span className="text-xs text-muted-foreground font-mono">{h.truck}</span>
                  <span className="text-xs text-muted-foreground">{h.time}</span>
                  <span className="text-xs bg-[#00C47A]/10 text-[#00C47A] px-2 py-0.5 rounded-full font-mono">{h.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ADMIN PORTAL
// ═══════════════════════════════════════════════════════

function AdminPortal({ setView }: { setView: (v: View) => void }) {
  const [activeTab, setActiveTab] = useState<"trucks" | "drivers" | "citizens" | "config">("trucks");

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#0A2540] border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] rounded-lg flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-bold text-sm font-display">Admin Portal</span>
          <span className="text-white/25 text-xs">— SmartWaste Connect</span>
        </div>
        <button onClick={() => setView("dashboard")} className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
          <ArrowRight className="w-3 h-3 rotate-180" /> Dashboard
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "trucks", label: "Manage Trucks" },
            { id: "drivers", label: "Drivers" },
            { id: "citizens", label: "Citizens" },
            { id: "config", label: "Configuration" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? "bg-[#0A2540] text-white border border-[#0A2540]/80 shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "trucks" && (
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-foreground font-display">Fleet Management</h3>
              <button onClick={() => toast.success("Add truck dialog opened")} className="flex items-center gap-2 bg-[#00C47A] hover:bg-[#00A865] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
                <Plus className="w-4 h-4" /> Add Truck
              </button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Truck ID", "Driver", "Area", "Status", "Fuel", "Collections", "Actions"].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TRUCKS.map(truck => (
                      <tr key={truck.id} className="border-b border-border last:border-0 hover:bg-muted/25 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-foreground">{truck.id}</td>
                        <td className="px-5 py-3.5 text-foreground">{truck.driver}</td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs">{truck.area}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={truck.status} /></td>
                        <td className="px-5 py-3.5">
                          <span className={`font-mono text-sm font-semibold ${truck.fuel < 40 ? "text-red-500" : "text-foreground"}`}>{truck.fuel}%</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-foreground">{truck.collections}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1">
                            <button onClick={() => toast.info(`Editing ${truck.id}`)} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => toast.error(`${truck.id} removed from fleet`)} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "drivers" && (
          <div>
            <h3 className="font-semibold text-foreground font-display mb-4">Driver Management</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {TRUCKS.map(truck => (
                <div key={truck.id} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-[#00C47A]/20 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00C47A]/15 to-[#0EA5E9]/15 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-foreground font-bold text-sm">{truck.driver.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{truck.driver}</div>
                    <div className="text-xs text-muted-foreground font-mono">{truck.id} · {truck.area}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{truck.phone}</div>
                  </div>
                  <StatusBadge status={truck.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "citizens" && <CitizensPage />}

        {activeTab === "config" && (
          <div className="space-y-4 max-w-lg">
            <h3 className="font-semibold text-foreground font-display mb-4">System Configuration</h3>
            {[
              { label: "Firebase Project ID", value: "smartwaste-connect-prod", type: "text" },
              { label: "FCM Server Key", value: "AAAA••••••••••••••••••••••••••", type: "password" },
              { label: "Maps API Key", value: "AIza••••••••••••••••••••••", type: "password" },
              { label: "Alert Radius (meters)", value: "500", type: "number" },
              { label: "GPS Update Interval (seconds)", value: "5", type: "number" },
            ].map(config => (
              <div key={config.label}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">{config.label}</label>
                <input
                  type={config.type}
                  defaultValue={config.value}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                />
              </div>
            ))}
            <button onClick={() => toast.success("Configuration saved successfully")} className="bg-[#0A2540] hover:bg-[#0D3060] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all mt-2">
              Save Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DASHBOARD LAYOUT
// ═══════════════════════════════════════════════════════

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Real-time waste collection overview" },
  tracking: { title: "Live Tracking", subtitle: "GPS fleet monitoring" },
  notifications: { title: "Notifications", subtitle: "Alerts and citizen notifications" },
  analytics: { title: "Analytics", subtitle: "Collection data and insights" },
  citizens: { title: "Citizens", subtitle: "Registered citizen management" },
  complaints: { title: "Complaints", subtitle: "Issue tracking and resolution" },
  reports: { title: "Reports", subtitle: "Generate and export reports" },
  settings: { title: "Settings", subtitle: "Platform configuration" },
};

function DashboardLayout({ view, setView, isDark, toggleDark }: {
  view: View;
  setView: (v: View) => void;
  isDark: boolean;
  toggleDark: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (view === "citizen-portal") return <CitizenPortal setView={setView} />;
  if (view === "admin") return <AdminPortal setView={setView} />;

  const meta = PAGE_META[view] || { title: "Dashboard", subtitle: "" };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activeView={view}
        setView={setView}
        mobileOpen={sidebarOpen}
        setMobileOpen={setSidebarOpen}
        isDark={isDark}
        toggleDark={toggleDark}
      />

      <main className="flex-1 lg:ml-64 overflow-y-auto">
        <div className="p-6">
          <DashboardHeader
            title={meta.title}
            subtitle={meta.subtitle}
            onMenuClick={() => setSidebarOpen(true)}
          />
          {view === "dashboard" && <DashboardHome setView={setView} />}
          {view === "tracking" && <LiveTracking />}
          {view === "notifications" && <NotificationsPage />}
          {view === "analytics" && <AnalyticsPage />}
          {view === "citizens" && <CitizensPage />}
          {view === "complaints" && <ComplaintsPage />}
          {view === "reports" && <ReportsPage />}
          {view === "settings" && <SettingsPage isDark={isDark} toggleDark={toggleDark} />}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LANDING PAGE WRAPPER
// ═══════════════════════════════════════════════════════

function LandingPage({ onEnter, isDark, toggleDark }: { onEnter: () => void; isDark: boolean; toggleDark: () => void }) {
  return (
    <div>
      <LandingNavbar onEnterDashboard={onEnter} isDark={isDark} toggleDark={toggleDark} />
      <HeroSection onEnterDashboard={onEnter} />
      <AboutSection />
      <FeaturesSection />
      <LandingFooter onEnterDashboard={onEnter} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleDark = () => setIsDark(d => !d);

  return (
    <>
      <Toaster richColors position="top-right" duration={3000} />
      {view === "landing" ? (
        <LandingPage onEnter={() => setView("dashboard")} isDark={isDark} toggleDark={toggleDark} />
      ) : (
        <DashboardLayout view={view} setView={setView} isDark={isDark} toggleDark={toggleDark} />
      )}
    </>
  );
}
