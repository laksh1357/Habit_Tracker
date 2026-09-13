import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  Compass,
  Target,
  CalendarCheck,
  Flame,
  BarChart3,
  Award,
  BookOpen,
  Settings as SettingsIcon,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Moon,
  Sun,
  Laptop,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Filter,
  Check,
  X,
  Zap,
  RotateCcw,
  Edit3,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Lock,
  Unlock,
  CheckSquare,
  FileText,
  Save,
  Download,
  Upload,
  Calendar as CalendarIcon,
  TrendingUp,
  Activity,
  Layers,
  Menu,
  SlidersHorizontal,
  Search,
  ExternalLink,
  Copy,
  RefreshCw,
  Trophy,
  Lightbulb,
  ThumbsUp,
  Quote,
  Eye,
  Info
} from 'lucide-react';

export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type DayStatus = 'not-started' | 'in-progress' | 'completed' | 'missed';
export type MilestoneStatus = 'locked' | 'upcoming' | 'in-progress' | 'completed';
export type MonthStatus = 'Completed' | 'In Progress' | 'Upcoming' | 'Locked';
export type PageTab = 
  | 'Dashboard' 
  | 'Roadmap' 
  | 'Goals' 
  | 'Daily Tracker' 
  | 'Habits' 
  | 'Analytics' 
  | 'Milestones' 
  | 'Reflections' 
  | 'Settings';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface HabitItem {
  id: string;
  name: string;
  category: string;
  frequency: string;
  targetPerWeek: number;
  dailyTarget?: string;
  trackType?: string;
  icon?: string;
  createdAt: string;
}

export interface DayLog {
  date: string; // ISO format YYYY-MM-DD
  monthId: number;
  dayIndex: number;
  status: DayStatus;
  completedHabitIds: string[];
  note?: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  monthId: number;
  name: string;
  description: string;
  category: string;
  priority: PriorityLevel;
  targetDate: string;
  completed: boolean;
  progress: number;
  createdAt: string;
}

export interface Milestone {
  id: string;
  monthId: number;
  title: string;
  description: string;
  targetDate: string;
  status: MilestoneStatus;
  completionDate?: string;
  createdAt: string;
}

export interface MonthReflection {
  achieved: string;
  wentWell: string;
  wentWrong: string;
  learned: string;
  improveNext: string;
  overallSummary: string;
  updatedAt?: string;
}

export interface MonthData {
  id: number;
  monthNumber: number;
  name: string;
  theme: string;
  subtitle: string;
  status: MonthStatus;
  targetDays: number;
  startDate: string;
  endDate: string;
  goals: Goal[];
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  type: 'goal' | 'milestone' | 'habit' | 'reflection' | 'system';
  badge: string;
}

const PRESET_CATEGORIES = [
  'Health & Fitness',
  'Engineering & Coding',
  'Academics & Growth',
  'Mindset & Discipline',
  'Mindset & Learning',
  'Personal Craft',
  'Financial Autonomy'
];

const DEFAULT_HABITS: HabitItem[] = [
  { id: 'h-1', name: '🏃 Exercise', category: 'Health & Fitness', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '15 min', trackType: '✅/❌', createdAt: '2026-01-01' },
  { id: 'h-2', name: '💻 DSA Coding', category: 'Engineering & Coding', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '2 hours', trackType: 'Minutes', createdAt: '2026-01-01' },
  { id: 'h-3', name: '📚 Study', category: 'Academics & Growth', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '4 hours', trackType: 'Hours', createdAt: '2026-01-01' },
  { id: 'h-4', name: '🚀 Productive Work', category: 'Engineering & Coding', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '1 hour', trackType: 'Hours', createdAt: '2026-01-01' },
  { id: 'h-5', name: '🥗 No Junk Food', category: 'Health & Fitness', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '100%', trackType: '✅/❌', createdAt: '2026-01-01' },
  { id: 'h-6', name: '🍬 Zero Added Sugar', category: 'Health & Fitness', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '100%', trackType: '✅/❌', createdAt: '2026-01-01' },
  { id: 'h-7', name: '😴 Sleep', category: 'Health & Fitness', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '6–7 hours', trackType: 'Hours', createdAt: '2026-01-01' },
  { id: 'h-8', name: '💧 Water', category: 'Health & Fitness', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '2–3 L', trackType: 'Litres', createdAt: '2026-01-01' },
  { id: 'h-9', name: '📱 Social Media', category: 'Mindset & Discipline', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '≤ 1 hour', trackType: 'Minutes', createdAt: '2026-01-01' },
  { id: 'h-10', name: '📖 Reading/Learning', category: 'Mindset & Learning', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '20 min', trackType: 'Minutes', createdAt: '2026-01-01' },
  { id: 'h-11', name: '🧠 Revision', category: 'Academics & Growth', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '30 min', trackType: '✅/❌', createdAt: '2026-01-01' },
  { id: 'h-12', name: '📝 Daily Planning', category: 'Mindset & Discipline', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '5–10 min', trackType: '✅/❌', createdAt: '2026-01-01' },
  { id: 'h-13', name: '🌙 Night Reflection', category: 'Mindset & Discipline', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '5 min', trackType: '✅/❌', createdAt: '2026-01-01' },
  { id: 'h-14', name: '🧹 Room/Environment', category: 'Personal Craft', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '10 min', trackType: '✅/❌', createdAt: '2026-01-01' },
  { id: 'h-15', name: '🎯 Daily Top 3 Tasks', category: 'Engineering & Coding', frequency: 'Daily', targetPerWeek: 7, dailyTarget: '3 tasks', trackType: 'Completed', createdAt: '2026-01-01' },
  { id: 'h-16', name: '🔥 No Zero Day', category: 'Mindset & Discipline', frequency: 'Daily', targetPerWeek: 7, dailyTarget: 'Something meaningful', trackType: '✅/❌', createdAt: '2026-01-01' }
];

const DEFAULT_MONTHS: MonthData[] = [
  {
    id: 1,
    monthNumber: 1,
    name: 'Month 01',
    theme: 'Foundations & Atomic Routines',
    subtitle: 'Audit cognitive energy, establish early morning deep focus, and eliminate friction.',
    status: 'Completed',
    targetDays: 30,
    startDate: '2026-01-01',
    endDate: '2026-01-30',
    goals: [
      {
        id: 'g-1-1',
        monthId: 1,
        name: 'Execute 14-day energy & focus audit',
        description: 'Log 30m blocks to identify attention leaks and purge unproductive meetings.',
        category: 'Mindset & Learning',
        priority: 'High',
        targetDate: '2026-01-15',
        completed: true,
        progress: 100,
        createdAt: '2026-01-01'
      },
      {
        id: 'g-1-2',
        monthId: 1,
        name: 'Lock in 90-minute distraction-free morning block',
        description: 'Zero incoming notifications before 10 AM; uninterrupted focus.',
        category: 'Health & Fitness',
        priority: 'High',
        targetDate: '2026-01-22',
        completed: true,
        progress: 100,
        createdAt: '2026-01-01'
      },
      {
        id: 'g-1-3',
        monthId: 1,
        name: 'Optimize high-ergonomics minimalist workstation',
        description: 'Dual monitor calibration, cable routing, and mechanical ergonomics.',
        category: 'Engineering',
        priority: 'Medium',
        targetDate: '2026-01-28',
        completed: true,
        progress: 100,
        createdAt: '2026-01-05'
      }
    ]
  },
  {
    id: 2,
    monthNumber: 2,
    name: 'Month 02',
    theme: 'Core Craft & Architecture Build',
    subtitle: 'Systematize engineering pipelines, deploy robust foundations, and ship core architecture.',
    status: 'In Progress',
    targetDays: 30,
    startDate: '2026-01-31',
    endDate: '2026-03-01',
    goals: [
      {
        id: 'g-2-1',
        monthId: 2,
        name: 'Deploy distributed fullstack architecture prototype',
        description: 'Stateless services with edge caching, automated database migrations, and testing.',
        category: 'Engineering',
        priority: 'High',
        targetDate: '2026-02-12',
        completed: true,
        progress: 100,
        createdAt: '2026-02-01'
      },
      {
        id: 'g-2-2',
        monthId: 2,
        name: 'Establish continuous automated CI/CD pipelines',
        description: 'Container build and zero-downtime deployment pipelines with test gates.',
        category: 'Engineering',
        priority: 'Medium',
        targetDate: '2026-02-22',
        completed: false,
        progress: 75,
        createdAt: '2026-02-01'
      },
      {
        id: 'g-2-3',
        monthId: 2,
        name: 'Publish 2 technical architecture whitepapers',
        description: 'Document high-throughput event processing and caching strategies.',
        category: 'Career & Growth',
        priority: 'Medium',
        targetDate: '2026-02-28',
        completed: false,
        progress: 50,
        createdAt: '2026-02-05'
      }
    ]
  },
  {
    id: 3,
    monthNumber: 3,
    name: 'Month 03',
    theme: 'Execution Velocity & Beta Cohort',
    subtitle: 'Scale daily throughput, onboard 50 partner testers, and gather baseline metrics.',
    status: 'Upcoming',
    targetDays: 30,
    startDate: '2026-03-02',
    endDate: '2026-03-31',
    goals: [
      {
        id: 'g-3-1',
        monthId: 3,
        name: 'Deploy private Beta build to 50 active partners',
        description: 'Launch telemetry monitoring and direct user feedback channels.',
        category: 'Engineering',
        priority: 'High',
        targetDate: '2026-03-18',
        completed: false,
        progress: 0,
        createdAt: '2026-03-01'
      },
      {
        id: 'g-3-2',
        monthId: 3,
        name: 'Complete 40 logged deep-focus 90m sprint blocks',
        description: 'Track focus quality and protect cognitive recovery periods.',
        category: 'Mindset & Learning',
        priority: 'Medium',
        targetDate: '2026-03-29',
        completed: false,
        progress: 0,
        createdAt: '2026-03-01'
      }
    ]
  },
  {
    id: 4,
    monthNumber: 4,
    name: 'Month 04',
    theme: 'Optimization & Iterative Loops',
    subtitle: 'Eliminate architectural latency, polish core interfaces, and run user discovery.',
    status: 'Upcoming',
    targetDays: 30,
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    goals: [
      {
        id: 'g-4-1',
        monthId: 4,
        name: 'Reduce application API latency by 40%',
        description: 'Optimize queries, enable edge caching, and refine frontend bundle size.',
        category: 'Engineering',
        priority: 'High',
        targetDate: '2026-04-18',
        completed: false,
        progress: 0,
        createdAt: '2026-04-01'
      },
      {
        id: 'g-4-2',
        monthId: 4,
        name: 'Conduct 20 user interviews and refine backlog',
        description: 'Turn qualitative customer feedback into tactical sprints.',
        category: 'Career & Growth',
        priority: 'Medium',
        targetDate: '2026-04-26',
        completed: false,
        progress: 0,
        createdAt: '2026-04-01'
      }
    ]
  },
  {
    id: 5,
    monthNumber: 5,
    name: 'Month 05',
    theme: 'Distribution & Public Launch',
    subtitle: 'Activate marketing distribution channels, execute launch, and close partnerships.',
    status: 'Upcoming',
    targetDays: 30,
    startDate: '2026-05-01',
    endDate: '2026-05-30',
    goals: [
      {
        id: 'g-5-1',
        monthId: 5,
        name: 'Execute public launch across tech communities',
        description: 'Demo walkthrough, product documentation release, and keynote stream.',
        category: 'Career & Growth',
        priority: 'High',
        targetDate: '2026-05-14',
        completed: false,
        progress: 0,
        createdAt: '2026-05-01'
      },
      {
        id: 'g-5-2',
        monthId: 5,
        name: 'Secure 3 strategic enterprise pilot partnerships',
        description: 'Formalize letters of intent and deployment roadmaps.',
        category: 'Financial Autonomy',
        priority: 'High',
        targetDate: '2026-05-28',
        completed: false,
        progress: 0,
        createdAt: '2026-05-01'
      }
    ]
  },
  {
    id: 6,
    monthNumber: 6,
    name: 'Month 06',
    theme: 'Peak Synthesis & Long-Term Horizon',
    subtitle: 'Consolidate 180 days of compounding output, write capstone, and design next phase.',
    status: 'Locked',
    targetDays: 30,
    startDate: '2026-05-31',
    endDate: '2026-06-29',
    goals: [
      {
        id: 'g-6-1',
        monthId: 6,
        name: 'Publish 6-Month Metamorphosis Retrospective Essay',
        description: 'Detailed analysis of metrics, behavioral shifts, and technical deliverables.',
        category: 'Personal Craft',
        priority: 'High',
        targetDate: '2026-06-20',
        completed: false,
        progress: 0,
        createdAt: '2026-06-01'
      },
      {
        id: 'g-6-2',
        monthId: 6,
        name: 'Finalize financial autonomy run-rate projections',
        description: 'Operating budget, revenue systems, and sustainable growth model for 24 months.',
        category: 'Financial Autonomy',
        priority: 'Medium',
        targetDate: '2026-06-28',
        completed: false,
        progress: 0,
        createdAt: '2026-06-01'
      }
    ]
  }
];

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'm-1-1',
    monthId: 1,
    title: 'Zero-Distraction Morning Routine Locked',
    description: '30 consecutive days of starting deep work sprints before checking emails or feeds.',
    targetDate: '2026-01-20',
    status: 'completed',
    completionDate: '2026-01-19',
    createdAt: '2026-01-01'
  },
  {
    id: 'm-1-2',
    monthId: 1,
    title: 'Atomic Habit Consistency > 85%',
    description: 'Maintained 85%+ completion across all foundational daily habits.',
    targetDate: '2026-01-30',
    status: 'completed',
    completionDate: '2026-01-30',
    createdAt: '2026-01-01'
  },
  {
    id: 'm-2-1',
    monthId: 2,
    title: 'Core Platform Architecture Prototype Deployed',
    description: 'Stateless backend services operational with session caching and replication.',
    targetDate: '2026-02-14',
    status: 'completed',
    completionDate: '2026-02-13',
    createdAt: '2026-02-01'
  },
  {
    id: 'm-2-2',
    monthId: 2,
    title: 'Automated CI/CD Test Coverage > 80%',
    description: 'Pull requests execute unit, integration, and visual regression suites.',
    targetDate: '2026-02-28',
    status: 'in-progress',
    createdAt: '2026-02-01'
  },
  {
    id: 'm-3-1',
    monthId: 3,
    title: '50-Member Closed Beta Cohort Live',
    description: 'Onboard 50 active users into live workflows and collect daily telemetry.',
    targetDate: '2026-03-20',
    status: 'upcoming',
    createdAt: '2026-03-01'
  },
  {
    id: 'm-4-1',
    monthId: 4,
    title: 'Sub-100ms API Latency Milestone',
    description: 'P95 response times maintained under 100ms under high concurrency.',
    targetDate: '2026-04-20',
    status: 'upcoming',
    createdAt: '2026-04-01'
  },
  {
    id: 'm-5-1',
    monthId: 5,
    title: 'Global Launch: Top 3 Product of the Day',
    description: 'Coordinated public launch reaching trending developer channels and 2,000+ accounts.',
    targetDate: '2026-05-15',
    status: 'upcoming',
    createdAt: '2026-05-01'
  },
  {
    id: 'm-6-1',
    monthId: 6,
    title: '180-Day Personal Metamorphosis Capstone',
    description: 'Successful completion of all 6-month chapters and publication of findings.',
    targetDate: '2026-06-25',
    status: 'locked',
    createdAt: '2026-06-01'
  }
];

const DEFAULT_REFLECTIONS: Record<number, MonthReflection> = {
  1: {
    achieved: 'Completed 14-day deep time audit, established early morning 90m deep work block, and eliminated notification interruptions before midday.',
    wentWell: 'Protecting the morning block created immense cognitive calm. Energy levels were drastically higher after removing mindless browsing.',
    wentWrong: 'Had two days where late-night coding disrupted the sleep cycle, leading to sluggish mornings on days 8 and 22.',
    learned: 'Consistency beats intensity. Starting at 70% effort reliably yields 3x the sustained output of erratic 100% all-nighters.',
    improveNext: 'Enforce a strict 10:30 PM digital wind-down routine so sleep consistency remains steady into Month 2.',
    overallSummary: 'Month 1 successfully established the operational foundation. The baseline habits are becoming second nature.',
    updatedAt: '2026-01-30'
  },
  2: {
    achieved: 'Delivered foundational core architecture prototype with JWT token rotation and high-speed Redis session management.',
    wentWell: 'Deep work sprint velocity doubled. Complex technical architecture felt approachable due to protected focus blocks.',
    wentWrong: 'Slightly lagged on publishing technical essays due to over-engineering testing harnesses.',
    learned: 'Ship early iterations even when documentation is imperfect. Momentum compounds through tangible shipping.',
    improveNext: 'Timebox documentation and research to 45 minutes instead of allowing unbounded rabbit holes.',
    overallSummary: 'High technical breakthrough month. The system is taking concrete shape and resilience is higher.',
    updatedAt: '2026-02-18'
  },
  3: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' },
  4: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' },
  5: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' },
  6: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' }
};

const DEFAULT_CODEX = `# 180-Day Personal Metamorphosis Codex

## Guiding Operating Principles
1. **Uncompromised Deep Focus**: The first 90 minutes of cognitive attention belong exclusively to highest-leverage creation.
2. **Relentless Iterative Loops**: Momentum is preserved by closing loops quickly. Stagnation is the main friction point.
3. **Physical Baseline**: Sleep quality, clean nutrition, and daily movement dictate intellectual throughput.

## Running Insights & Breakthroughs
- "Discipline is choosing what you want most over what you want right now."
- Batching small decisions eliminates executive fatigue before lunch.
- Building in public creates distribution loops before full launch.
`;

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  { id: 'act-1', timestamp: '2 hours ago', title: 'Marked Goal "Distributed fullstack architecture" as Complete', type: 'goal', badge: 'Goal' },
  { id: 'act-2', timestamp: 'Yesterday', title: 'Unlocked Milestone "Core Platform Architecture Deployed"', type: 'milestone', badge: 'Milestone' },
  { id: 'act-3', timestamp: '2 days ago', title: 'Logged 4/4 daily habits for Day 44', type: 'habit', badge: 'Habit' },
  { id: 'act-4', timestamp: '4 days ago', title: 'Updated Month 2 Retrospective Debrief', type: 'reflection', badge: 'Retros' }
];

const formatDateStr = (d: Date): string => d.toISOString().split('T')[0];

const addDays = (dateStr: string, days: number): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateStr(d);
};

const generateInitialLogs = (startDateStr: string): Record<string, DayLog> => {
  const logs: Record<string, DayLog> = {};
  const base = new Date(startDateStr);

  for (let m = 1; m <= 6; m++) {
    for (let d = 1; d <= 30; d++) {
      const cur = new Date(base);
      const totalOffset = (m - 1) * 30 + (d - 1);
      cur.setDate(base.getDate() + totalOffset);
      const key = formatDateStr(cur);

      let status: DayStatus = 'not-started';
      let completedHabitIds: string[] = [];
      let note = '';

      if (m === 1) {
        if (d === 8 || d === 22) {
          status = 'missed';
          note = 'Recovery & travel day';
        } else if (d === 15) {
          status = 'in-progress';
          completedHabitIds = ['h-1', 'h-3'];
        } else {
          status = 'completed';
          completedHabitIds = ['h-1', 'h-2', 'h-3', 'h-4'];
          if (d === 10) note = 'Deep work block reached uninterrupted flow state.';
        }
      } else if (m === 2) {
        if (d <= 14) {
          if (d === 5) {
            status = 'missed';
            note = 'Urgent bug fix sprint';
          } else {
            status = 'completed';
            completedHabitIds = ['h-1', 'h-2', 'h-3'];
          }
        } else if (d === 15 || d === 16) {
          status = 'in-progress';
          completedHabitIds = ['h-1', 'h-3'];
          note = 'Focus on caching refactor';
        } else {
          status = 'not-started';
        }
      } else {
        status = 'not-started';
      }

      logs[key] = {
        date: key,
        monthId: m,
        dayIndex: d,
        status,
        completedHabitIds,
        note
      };
    }
  }

  return logs;
};

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
}

const CelebrationOverlay: React.FC<{ active: boolean; title: string }> = ({ active, title }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
    const newParticles: Particle[] = Array.from({ length: 48 }).map((_, i) => ({
      id: i,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 7 + 4,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      alpha: 1
    }));

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.4,
            alpha: p.alpha - 0.025
          }))
          .filter((p) => p.alpha > 0)
      );
    }, 20);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            transform: `translate(${p.x - window.innerWidth / 2}px, ${p.y - window.innerHeight / 2}px)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.alpha,
            boxShadow: `0 0 10px ${p.color}`
          }}
        />
      ))}
      <div className="animate-in zoom-in-95 fade-in duration-200 px-5 py-3.5 rounded-xl bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/40">
          <Award className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Milestone Completed!</div>
          <div className="text-xs font-bold text-slate-100">{title}</div>
        </div>
      </div>
    </div>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md p-5 rounded-2xl border bg-[#0d1017] border-slate-800 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isDestructive ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30' : 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-xs ${
              isDestructive 
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Theme state: dark, light, system
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('s6_theme_mode_v1');
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isDarkEffective, setIsDarkEffective] = useState<boolean>(true);

  useEffect(() => {
    const applyTheme = () => {
      let isDark = true;
      if (themeMode === 'system') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = themeMode === 'dark';
      }
      setIsDarkEffective(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    try {
      localStorage.setItem('s6_theme_mode_v1', themeMode);
    } catch (e) {
      console.error(e);
    }

    if (themeMode === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeMode]);

  // Page Routing & Navigation
  const [activePage, setActivePage] = useState<PageTab>('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Journey Start Date (6-month period calculation)
  const [journeyStartDate, setJourneyStartDate] = useState<string>(() => {
    try {
      return localStorage.getItem('s6_start_date_v1') || '2026-01-01';
    } catch {
      return '2026-01-01';
    }
  });

  // Calculate 180-day end date
  const journeyEndDate = useMemo(() => {
    return addDays(journeyStartDate, 180);
  }, [journeyStartDate]);

  // Core Data States
  const [months, setMonths] = useState<MonthData[]>(() => {
    try {
      const stored = localStorage.getItem('s6_months_data_v1');
      return stored ? JSON.parse(stored) : DEFAULT_MONTHS;
    } catch {
      return DEFAULT_MONTHS;
    }
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const stored = localStorage.getItem('s6_milestones_data_v1');
      return stored ? JSON.parse(stored) : DEFAULT_MILESTONES;
    } catch {
      return DEFAULT_MILESTONES;
    }
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const stored = localStorage.getItem('s6_habits_data_v2');
      if (stored) return JSON.parse(stored);
      const oldStored = localStorage.getItem('s6_habits_data_v1');
      if (oldStored) {
        const parsed = JSON.parse(oldStored);
        if (Array.isArray(parsed) && parsed.length > 4) return parsed;
      }
      return DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('s6_habits_data_v2', JSON.stringify(habits));
    } catch (e) {
      console.error(e);
    }
  }, [habits]);

  const [dailyLogs, setDailyLogs] = useState<Record<string, DayLog>>(() => {
    try {
      const stored = localStorage.getItem('s6_daily_logs_v1');
      return stored ? JSON.parse(stored) : generateInitialLogs('2026-01-01');
    } catch {
      return generateInitialLogs('2026-01-01');
    }
  });

  const [reflections, setReflections] = useState<Record<number, MonthReflection>>(() => {
    try {
      const stored = localStorage.getItem('s6_reflections_v1');
      return stored ? JSON.parse(stored) : DEFAULT_REFLECTIONS;
    } catch {
      return DEFAULT_REFLECTIONS;
    }
  });

  const [codexNotes, setCodexNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('s6_codex_notes_v1') ?? DEFAULT_CODEX;
    } catch {
      return DEFAULT_CODEX;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const stored = localStorage.getItem('s6_activities_v1');
      return stored ? JSON.parse(stored) : DEFAULT_ACTIVITIES;
    } catch {
      return DEFAULT_ACTIVITIES;
    }
  });

  // UI Interactive States & Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmapLayout, setRoadmapLayout] = useState<'vertical' | 'horizontal'>('vertical');
  const [selectedMonthDrawer, setSelectedMonthDrawer] = useState<MonthData | null>(null);
  const [activeReflectionMonth, setActiveReflectionMonth] = useState<number>(2);
  const [celebrationState, setCelebrationState] = useState<{ active: boolean; title: string }>({
    active: false,
    title: ''
  });

  // Goal Modal State
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formGoalMonth, setFormGoalMonth] = useState<number>(1);
  const [formGoalName, setFormGoalName] = useState('');
  const [formGoalDesc, setFormGoalDesc] = useState('');
  const [formGoalCategory, setFormGoalCategory] = useState('Engineering');
  const [formGoalPriority, setFormGoalPriority] = useState<PriorityLevel>('Medium');
  const [formGoalTargetDate, setFormGoalTargetDate] = useState('');
  const [formGoalProgress, setFormGoalProgress] = useState(0);
  const [formGoalCompleted, setFormGoalCompleted] = useState(false);
  const [goalFormErrors, setGoalFormErrors] = useState<{ [key: string]: string }>({});

  // Milestone Modal State
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mMonth, setMMonth] = useState(1);
  const [mTargetDate, setMTargetDate] = useState('');
  const [mStatus, setMStatus] = useState<MilestoneStatus>('upcoming');
  const [mErrors, setMErrors] = useState<{ [key: string]: string }>({});

  // Habit Modal State
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Health & Fitness');
  const [newHabitDailyTarget, setNewHabitDailyTarget] = useState('');
  const [newHabitTrackType, setNewHabitTrackType] = useState('✅/❌');
  const [newHabitTarget, setNewHabitTarget] = useState(7);

  // Day Checkin Modal State
  const [activeDayLogModal, setActiveDayLogModal] = useState<{ dateKey: string; log: DayLog } | null>(null);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: false,
    onConfirm: () => {}
  });

  // Settings Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('s6_start_date_v1', journeyStartDate);
      localStorage.setItem('s6_months_data_v1', JSON.stringify(months));
      localStorage.setItem('s6_milestones_data_v1', JSON.stringify(milestones));
      localStorage.setItem('s6_habits_data_v1', JSON.stringify(habits));
      localStorage.setItem('s6_daily_logs_v1', JSON.stringify(dailyLogs));
      localStorage.setItem('s6_reflections_v1', JSON.stringify(reflections));
      localStorage.setItem('s6_codex_notes_v1', codexNotes);
      localStorage.setItem('s6_activities_v1', JSON.stringify(activities));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [journeyStartDate, months, milestones, habits, dailyLogs, reflections, codexNotes, activities]);

  // Keep selectedMonthDrawer synced
  useEffect(() => {
    if (selectedMonthDrawer) {
      const refreshed = months.find((m) => m.id === selectedMonthDrawer.id);
      if (refreshed) setSelectedMonthDrawer(refreshed);
    }
  }, [months]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addActivity = (title: string, type: ActivityItem['type'], badge: string) => {
    const item: ActivityItem = {
      id: 'act-' + Date.now(),
      timestamp: 'Just now',
      title,
      type,
      badge
    };
    setActivities((prev) => [item, ...prev.slice(0, 19)]);
  };

  const allGoals = useMemo(() => months.flatMap((m) => m.goals || []), [months]);
  const totalGoals = allGoals.length;
  const completedGoals = allGoals.filter((g) => g.completed).length;
  const remainingGoals = Math.max(0, totalGoals - completedGoals);

  // Overall 6-month progress
  const overallProgress = useMemo(() => {
    if (totalGoals === 0) return 0;
    const totalWeighted = allGoals.reduce((acc, g) => acc + (g.progress || (g.completed ? 100 : 0)), 0);
    return Math.round(totalWeighted / totalGoals);
  }, [allGoals, totalGoals]);

  const allDaysList = useMemo(() => {
    return Object.values(dailyLogs).sort((a, b) => a.date.localeCompare(b.date));
  }, [dailyLogs]);

  // Streak & Cadence
  const streakMetrics = useMemo(() => {
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let totalCompletedDays = 0;
    let totalMissedDays = 0;
    let totalInProgressDays = 0;

    allDaysList.forEach((day) => {
      if (day.status === 'completed') {
        totalCompletedDays++;
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else if (day.status === 'missed') {
        totalMissedDays++;
        tempStreak = 0;
      } else if (day.status === 'in-progress') {
        totalInProgressDays++;
      }
    });

    for (let i = allDaysList.length - 1; i >= 0; i--) {
      const d = allDaysList[i];
      if (d.status === 'not-started') continue;
      if (d.status === 'completed') {
        currentStreak++;
      } else {
        break;
      }
    }

    const activeDays = totalCompletedDays + totalMissedDays + totalInProgressDays;
    const consistencyScore = activeDays > 0 ? Math.round((totalCompletedDays / activeDays) * 100) : 0;

    return {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak),
      totalCompletedDays,
      totalMissedDays,
      totalInProgressDays,
      activeDays,
      consistencyScore
    };
  }, [allDaysList]);

  // Today's progress calculation
  const todayKey = useMemo(() => formatDateStr(new Date()), []);
  const todayLog = dailyLogs[todayKey] || {
    date: todayKey,
    monthId: 2,
    dayIndex: 1,
    status: 'not-started',
    completedHabitIds: []
  };

  const todayHabitCompletion = useMemo(() => {
    if (habits.length === 0) return 0;
    const checked = todayLog.completedHabitIds ? todayLog.completedHabitIds.length : 0;
    return Math.round((checked / habits.length) * 100);
  }, [todayLog, habits]);

  // Current active month
  const currentMonthData = useMemo(() => {
    return months.find((m) => m.status === 'In Progress') || months[0];
  }, [months]);

  const getMonthProgress = (m: MonthData): number => {
    if (!m.goals || m.goals.length === 0) return 0;
    const sum = m.goals.reduce((acc, g) => acc + (g.progress || (g.completed ? 100 : 0)), 0);
    return Math.round(sum / m.goals.length);
  };

  const triggerCelebration = (title: string) => {
    setCelebrationState({ active: true, title });
    setTimeout(() => {
      setCelebrationState({ active: false, title: '' });
    }, 2400);
  };

  const openCreateGoalModal = (monthId?: number) => {
    setEditingGoal(null);
    setFormGoalMonth(monthId || currentMonthData.id);
    setFormGoalName('');
    setFormGoalDesc('');
    setFormGoalCategory('Engineering');
    setFormGoalPriority('Medium');
    setFormGoalTargetDate(addDays(journeyStartDate, 45));
    setFormGoalProgress(0);
    setFormGoalCompleted(false);
    setGoalFormErrors({});
    setGoalModalOpen(true);
  };

  const openEditGoalModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormGoalMonth(goal.monthId);
    setFormGoalName(goal.name);
    setFormGoalDesc(goal.description);
    setFormGoalCategory(goal.category);
    setFormGoalPriority(goal.priority);
    setFormGoalTargetDate(goal.targetDate);
    setFormGoalProgress(goal.progress);
    setFormGoalCompleted(goal.completed);
    setGoalFormErrors({});
    setGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formGoalName.trim()) {
      setGoalFormErrors({ name: 'Goal title is required' });
      return;
    }

    const calculatedProgress = formGoalCompleted ? 100 : formGoalProgress;
    const isCompleted = formGoalCompleted || calculatedProgress === 100;

    if (editingGoal) {
      const updated: Goal = {
        ...editingGoal,
        monthId: formGoalMonth,
        name: formGoalName.trim(),
        description: formGoalDesc.trim(),
        category: formGoalCategory,
        priority: formGoalPriority,
        targetDate: formGoalTargetDate,
        progress: calculatedProgress,
        completed: isCompleted
      };

      setMonths((prev) =>
        prev.map((m) => {
          const filtered = m.goals.filter((g) => g.id !== editingGoal.id);
          if (m.id === formGoalMonth) {
            return { ...m, goals: [...filtered, updated] };
          }
          return { ...m, goals: filtered };
        })
      );
      addActivity(`Updated goal "${updated.name}"`, 'goal', 'Goal');
      showToast('Goal updated successfully');
    } else {
      const newGoal: Goal = {
        id: 'g-' + Date.now(),
        monthId: formGoalMonth,
        name: formGoalName.trim(),
        description: formGoalDesc.trim(),
        category: formGoalCategory,
        priority: formGoalPriority,
        targetDate: formGoalTargetDate,
        progress: calculatedProgress,
        completed: isCompleted,
        createdAt: formatDateStr(new Date())
      };

      setMonths((prev) =>
        prev.map((m) => (m.id === formGoalMonth ? { ...m, goals: [...m.goals, newGoal] } : m))
      );
      addActivity(`Created new goal "${newGoal.name}"`, 'goal', 'Goal');
      showToast('Goal created');
    }

    setGoalModalOpen(false);
  };

  const handleToggleGoalCompleted = (monthId: number, goalId: string) => {
    let toggledTo = false;
    let goalTitle = '';

    setMonths((prev) =>
      prev.map((m) => {
        if (m.id !== monthId) return m;
        const updatedGoals = m.goals.map((g) => {
          if (g.id === goalId) {
            const nextCompleted = !g.completed;
            toggledTo = nextCompleted;
            goalTitle = g.name;
            return {
              ...g,
              completed: nextCompleted,
              progress: nextCompleted ? 100 : 0
            };
          }
          return g;
        });
        return { ...m, goals: updatedGoals };
      })
    );

    addActivity(
      toggledTo ? `Completed goal "${goalTitle}"` : `Reopened goal "${goalTitle}"`,
      'goal',
      'Goal'
    );
    showToast(toggledTo ? 'Goal marked completed' : 'Goal reopened');
  };

  const handleDeleteGoal = (monthId: number, goalId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Goal',
      message: 'Are you sure you want to delete this goal? This action cannot be undone.',
      confirmLabel: 'Delete Goal',
      isDestructive: true,
      onConfirm: () => {
        setMonths((prev) =>
          prev.map((m) => (m.id === monthId ? { ...m, goals: m.goals.filter((g) => g.id !== goalId) } : m))
        );
        addActivity('Deleted a goal', 'goal', 'Goal');
        showToast('Goal removed');
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
      }
    });
  };

  const openAddMilestoneModal = (monthId?: number) => {
    setEditingMilestone(null);
    setMTitle('');
    setMDesc('');
    setMMonth(monthId || currentMonthData.id);
    setMTargetDate(addDays(journeyStartDate, 60));
    setMStatus('upcoming');
    setMErrors({});
    setMilestoneModalOpen(true);
  };

  const openEditMilestoneModal = (m: Milestone) => {
    setEditingMilestone(m);
    setMTitle(m.title);
    setMDesc(m.description);
    setMMonth(m.monthId);
    setMTargetDate(m.targetDate);
    setMStatus(m.status);
    setMErrors({});
    setMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) {
      setMErrors({ title: 'Milestone title is required' });
      return;
    }

    if (editingMilestone) {
      const wasCompleted = editingMilestone.status === 'completed';
      const isCompleted = mStatus === 'completed';

      if (!wasCompleted && isCompleted) {
        triggerCelebration(mTitle.trim());
      }

      setMilestones((prev) =>
        prev.map((m) =>
          m.id === editingMilestone.id
            ? {
                ...m,
                monthId: mMonth,
                title: mTitle.trim(),
                description: mDesc.trim(),
                targetDate: mTargetDate,
                status: mStatus,
                completionDate: isCompleted ? m.completionDate || formatDateStr(new Date()) : undefined
              }
            : m
        )
      );
      addActivity(`Updated milestone "${mTitle.trim()}"`, 'milestone', 'Milestone');
      showToast('Milestone updated');
    } else {
      if (mStatus === 'completed') {
        triggerCelebration(mTitle.trim());
      }

      const newM: Milestone = {
        id: 'm-' + Date.now(),
        monthId: mMonth,
        title: mTitle.trim(),
        description: mDesc.trim(),
        targetDate: mTargetDate,
        status: mStatus,
        completionDate: mStatus === 'completed' ? formatDateStr(new Date()) : undefined,
        createdAt: formatDateStr(new Date())
      };
      setMilestones((prev) => [...prev, newM]);
      addActivity(`Created milestone "${newM.title}"`, 'milestone', 'Milestone');
      showToast('Milestone created');
    }
    setMilestoneModalOpen(false);
  };

  const handleToggleMilestoneCycle = (mId: string, current: MilestoneStatus, title: string) => {
    const cycleMap: Record<MilestoneStatus, MilestoneStatus> = {
      locked: 'upcoming',
      upcoming: 'in-progress',
      'in-progress': 'completed',
      completed: 'upcoming'
    };
    const nextStatus = cycleMap[current];

    if (nextStatus === 'completed') {
      triggerCelebration(title);
    }

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === mId) {
          return {
            ...m,
            status: nextStatus,
            completionDate: nextStatus === 'completed' ? formatDateStr(new Date()) : undefined
          };
        }
        return m;
      })
    );

    addActivity(`Milestone "${title}" is now ${nextStatus}`, 'milestone', 'Milestone');
    showToast(`Milestone status: ${nextStatus.toUpperCase()}`);
  };

  const handleDeleteMilestone = (mId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Milestone',
      message: 'Are you sure you want to remove this milestone from your roadmap?',
      confirmLabel: 'Delete Milestone',
      isDestructive: true,
      onConfirm: () => {
        setMilestones((prev) => prev.filter((m) => m.id !== mId));
        addActivity('Deleted a milestone', 'milestone', 'Milestone');
        showToast('Milestone removed');
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
      }
    });
  };

  const handleSaveNewHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newH: HabitItem = {
      id: 'h-' + Date.now(),
      name: newHabitName.trim(),
      category: newHabitCategory,
      frequency: 'Daily',
      targetPerWeek: newHabitTarget,
      dailyTarget: newHabitDailyTarget.trim() || undefined,
      trackType: newHabitTrackType,
      createdAt: formatDateStr(new Date())
    };

    setHabits((prev) => [...prev, newH]);
    setNewHabitName('');
    setNewHabitDailyTarget('');
    setHabitModalOpen(false);
    addActivity(`Added new recurring habit "${newH.name}"`, 'habit', 'Habit');
    showToast('Habit added to tracker');
  };

  const handleDeleteHabit = (habitId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Habit',
      message: 'Delete this habit from daily tracking? Past logs will retain their completion status.',
      confirmLabel: 'Delete Habit',
      isDestructive: true,
      onConfirm: () => {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
        addActivity('Removed a habit', 'habit', 'Habit');
        showToast('Habit removed');
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
      }
    });
  };

  // Toggle habit check-in for a given date
  const handleToggleDailyHabit = (dateKey: string, habitId: string) => {
    const cur = dailyLogs[dateKey] || {
      date: dateKey,
      monthId: 2,
      dayIndex: 1,
      status: 'not-started',
      completedHabitIds: []
    };

    const isChecked = cur.completedHabitIds?.includes(habitId);
    const updatedIds = isChecked
      ? cur.completedHabitIds.filter((id) => id !== habitId)
      : [...(cur.completedHabitIds || []), habitId];

    let nextStatus: DayStatus = 'not-started';
    if (updatedIds.length === habits.length && habits.length > 0) {
      nextStatus = 'completed';
    } else if (updatedIds.length > 0) {
      nextStatus = 'in-progress';
    }

    const updatedLog: DayLog = {
      ...cur,
      completedHabitIds: updatedIds,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    };

    setDailyLogs((prev) => ({
      ...prev,
      [dateKey]: updatedLog
    }));

    addActivity(`Logged habit for ${dateKey}`, 'habit', 'Habit');
  };

  const handleUpdateReflectionField = (monthId: number, field: keyof MonthReflection, value: string) => {
    const existing = reflections[monthId] || {
      achieved: '',
      wentWell: '',
      wentWrong: '',
      learned: '',
      improveNext: '',
      overallSummary: '',
      updatedAt: ''
    };

    const updated: MonthReflection = {
      ...existing,
      [field]: value,
      updatedAt: formatDateStr(new Date())
    };

    setReflections((prev) => ({
      ...prev,
      [monthId]: updated
    }));
  };

  const handleResetCurrentMonth = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Current Month',
      message: `Reset goals, habit logs, and reflections for ${currentMonthData.name} (${currentMonthData.theme})?`,
      confirmLabel: 'Reset Month',
      isDestructive: true,
      onConfirm: () => {
        // Reset goals for this month
        setMonths((prev) =>
          prev.map((m) => {
            if (m.id === currentMonthData.id) {
              return {
                ...m,
                goals: m.goals.map((g) => ({ ...g, progress: 0, completed: false }))
              };
            }
            return m;
          })
        );
        // Reset reflections
        setReflections((prev) => ({
          ...prev,
          [currentMonthData.id]: {
            achieved: '',
            wentWell: '',
            wentWrong: '',
            learned: '',
            improveNext: '',
            overallSummary: '',
            updatedAt: ''
          }
        }));
        addActivity(`Reset all deliverables for ${currentMonthData.name}`, 'system', 'System');
        showToast(`${currentMonthData.name} reset to zero`);
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
      }
    });
  };

  const handleResetEntireTracker = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Entire 6-Month Tracker',
      message: 'This will reset all 6 months, goals, milestones, reflections, and daily habits back to the blueprint defaults. Are you sure?',
      confirmLabel: 'Reset Entire Tracker',
      isDestructive: true,
      onConfirm: () => {
        setMonths(DEFAULT_MONTHS);
        setMilestones(DEFAULT_MILESTONES);
        setHabits(DEFAULT_HABITS);
        setDailyLogs(generateInitialLogs(journeyStartDate));
        setReflections(DEFAULT_REFLECTIONS);
        setCodexNotes(DEFAULT_CODEX);
        setActivities(DEFAULT_ACTIVITIES);
        showToast('Tracker restored to default blueprint');
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
      }
    });
  };

  const handleClearAllData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear All Data (Hard Wipe)',
      message: 'This will delete ALL custom goals, milestones, habit logs, reflections, and codex entries. You will start with a blank template. Proceed?',
      confirmLabel: 'Clear All Data',
      isDestructive: true,
      onConfirm: () => {
        const blankMonths = DEFAULT_MONTHS.map((m) => ({ ...m, goals: [], status: 'Upcoming' as MonthStatus }));
        setMonths(blankMonths);
        setMilestones([]);
        setHabits([]);
        setDailyLogs({});
        setReflections({
          1: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' },
          2: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' },
          3: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' },
          4: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' },
          5: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' },
          6: { achieved: '', wentWell: '', wentWrong: '', learned: '', improveNext: '', overallSummary: '', updatedAt: '' }
        });
        setCodexNotes('');
        setActivities([]);
        showToast('All tracker data wiped clean');
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
      }
    });
  };

  const handleExportJSON = () => {
    const bundle = {
      version: '6m-tracker-v2',
      exportDate: new Date().toISOString(),
      journeyStartDate,
      journeyEndDate,
      months,
      milestones,
      habits,
      dailyLogs,
      reflections,
      codexNotes
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `6-month-tracker-backup-${formatDateStr(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export file downloaded');
  };

  const handleCopyJSONToClipboard = () => {
    const bundle = {
      version: '6m-tracker-v2',
      exportDate: new Date().toISOString(),
      journeyStartDate,
      journeyEndDate,
      months,
      milestones,
      habits,
      dailyLogs,
      reflections,
      codexNotes
    };

    navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
    showToast('Backup JSON copied to clipboard');
  };

  const handleImportJSON = () => {
    setImportError(null);
    setImportSuccess(false);

    if (!importJsonText.trim()) {
      setImportError('Please paste valid JSON before importing.');
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText);

      // Validation Checks
      if (!parsed.months || !Array.isArray(parsed.months)) {
        throw new Error('Invalid schema: "months" array is missing.');
      }
      if (!parsed.milestones || !Array.isArray(parsed.milestones)) {
        throw new Error('Invalid schema: "milestones" array is missing.');
      }

      setConfirmDialog({
        isOpen: true,
        title: 'Confirm JSON Import',
        message: 'Importing this valid backup will overwrite your current progress and tracker state. Proceed?',
        confirmLabel: 'Import & Overwrite',
        isDestructive: false,
        onConfirm: () => {
          if (parsed.journeyStartDate) setJourneyStartDate(parsed.journeyStartDate);
          if (parsed.months) setMonths(parsed.months);
          if (parsed.milestones) setMilestones(parsed.milestones);
          if (parsed.habits) setHabits(parsed.habits);
          if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
          if (parsed.reflections) setReflections(parsed.reflections);
          if (parsed.codexNotes !== undefined) setCodexNotes(parsed.codexNotes);

          setImportSuccess(true);
          setImportJsonText('');
          addActivity('Imported backup dataset', 'system', 'System');
          showToast('Data successfully imported!');
          setConfirmDialog((c) => ({ ...c, isOpen: false }));
        }
      });
    } catch (err: any) {
      setImportError(`JSON Validation Error: ${err.message || 'Malformed JSON format'}`);
    }
  };

  const getMilestoneBadge = (st: MilestoneStatus) => {
    switch (st) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            <Zap className="w-3 h-3 fill-amber-400" />
            <span>In Progress</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Clock className="w-3 h-3" />
            <span>Upcoming</span>
          </span>
        );
      case 'locked':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <Lock className="w-3 h-3" />
            <span>Locked</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'High':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Low':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  const getMonthStatusBadge = (st: MonthStatus) => {
    switch (st) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Progress':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Upcoming':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Locked':
      default:
        return 'bg-slate-800/80 text-slate-500 border-slate-700';
    }
  };

  /* Navigation Items Definition */
  const NAV_ITEMS: { id: PageTab; label: string; icon: any; badge?: string }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Roadmap', label: '6-Month Roadmap', icon: Compass, badge: '6M' },
    { id: 'Goals', label: 'Goals Portfolio', icon: Target, badge: `${completedGoals}/${totalGoals}` },
    { id: 'Daily Tracker', label: 'Daily Tracker', icon: CalendarCheck, badge: `${streakMetrics.currentStreak}d` },
    { id: 'Habits', label: 'Habit Engine', icon: Flame },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Milestones', label: 'Milestones', icon: Award, badge: `${milestones.filter(m => m.status === 'completed').length}/${milestones.length}` },
    { id: 'Reflections', label: 'Reflections', icon: BookOpen },
    { id: 'Settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        isDarkEffective ? 'bg-[#090b10] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Milestone Celebration Burst */}
      <CelebrationOverlay active={celebrationState.active} title={celebrationState.title} />

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((c) => ({ ...c, isOpen: false }))}
      />

      {/* Micro Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 bg-indigo-600 text-white border border-indigo-400/40">
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Mobile Bar */}
      <div className={`md:hidden flex items-center justify-between px-4 h-14 border-b sticky top-0 z-40 backdrop-blur-md ${
        isDarkEffective ? 'bg-[#090b10]/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight">STRATUM 6</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100"
          >
            {isDarkEffective ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 top-14 z-40 p-4 space-y-1 overflow-y-auto ${
          isDarkEffective ? 'bg-[#090b10] text-slate-100' : 'bg-white text-slate-900'
        }`}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? isDarkEffective ? 'bg-indigo-600/15 text-indigo-400 font-semibold' : 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Container */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r transition-all duration-200 sticky top-0 h-screen ${
            sidebarCollapsed ? 'w-18' : 'w-64'
          } ${
            isDarkEffective ? 'bg-[#0c0e14] border-slate-800/80' : 'bg-white border-slate-200/80'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-inherit shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs shadow-indigo-500/20">
                <Compass className="w-4 h-4" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-black text-xs tracking-wider uppercase">Stratum 6</span>
                  <span className="text-[10px] text-indigo-400 font-medium tracking-tight">180-Day Horizon</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-200 ${
                  sidebarCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            {!sidebarCollapsed && (
              <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Workspace
              </div>
            )}

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    active
                      ? isDarkEffective
                        ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                        : 'bg-indigo-50 text-indigo-600 font-semibold border border-indigo-200'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Streak Footer Card */}
          {!sidebarCollapsed && (
            <div className="p-3 m-3 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cadence</span>
                </span>
                <span className="font-mono font-bold text-amber-400">{streakMetrics.currentStreak}d Streak</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (streakMetrics.currentStreak / 30) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* User / Theme Switcher Footer */}
          <div className="p-3 border-t border-inherit flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0">
                180
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold truncate">Operator Space</div>
                  <div className="text-[10px] text-slate-500 truncate">Day 44 of 180</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : themeMode === 'light' ? 'system' : 'dark')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                title={`Theme: ${themeMode}`}
              >
                {themeMode === 'dark' ? <Moon className="w-3.5 h-3.5" /> : themeMode === 'light' ? <Sun className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
          {/* Header Bar */}
          <header className={`h-16 border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-colors ${
            isDarkEffective ? 'bg-[#090b10]/90 border-slate-800 backdrop-blur-md' : 'bg-white/90 border-slate-200 backdrop-blur-md'
          }`}>
            <div className="flex items-center gap-3">
              <div className="text-xs font-medium text-slate-400">
                <span className="text-indigo-400 font-semibold">Horizon Tracker</span>
                <span className="mx-2 text-slate-600">/</span>
                <span className={isDarkEffective ? 'text-slate-200 font-semibold' : 'text-slate-800 font-semibold'}>{activePage}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Display */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border ${
                isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              {/* Quick Add Goal Button */}
              <button
                onClick={() => openCreateGoalModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Goal</span>
              </button>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
            
            {}
            {activePage === 'Dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* 1. TOP HERO: 6-Month Journey Header & Overall Progress */}
                <div className={`p-6 rounded-2xl border ${
                  isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Sparkles className="w-3 h-3" />
                        <span>Central Command Center</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                        6-MONTH JOURNEY
                      </h1>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Operating trajectory for high-output transformation. Track macro horizons, daily habit consistency, and critical milestones across 180 consecutive days.
                      </p>
                    </div>

                    {/* Radial/Bar Overall Progress Block */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className={isDarkEffective ? 'text-slate-800' : 'text-slate-200'}
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-indigo-500 transition-all duration-500"
                            strokeDasharray={`${overallProgress}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-xs font-mono font-bold">{overallProgress}%</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-200">Overall Progress</div>
                        <div className="text-[11px] text-slate-400">{completedGoals} of {totalGoals} Goals Delivered</div>
                        <div className="text-[10px] text-indigo-400 font-medium">Cadence: {streakMetrics.consistencyScore}% consistency</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SIX METRIC CARDS ROW */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                  {/* Metric 1: Current Month */}
                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Month</div>
                    <div className="text-lg font-bold mt-1 text-indigo-400 truncate">{currentMonthData.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{currentMonthData.theme}</div>
                  </div>

                  {/* Metric 2: Goals Completed */}
                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Goals Completed</div>
                    <div className="text-lg font-bold mt-1 text-emerald-400 font-mono">{completedGoals}</div>
                    <div className="text-[10px] text-slate-500">Delivered successfully</div>
                  </div>

                  {/* Metric 3: Goals Remaining */}
                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Goals Remaining</div>
                    <div className="text-lg font-bold mt-1 text-amber-400 font-mono">{remainingGoals}</div>
                    <div className="text-[10px] text-slate-500">In execution pipeline</div>
                  </div>

                  {/* Metric 4: Current Streak */}
                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Streak</div>
                    <div className="text-lg font-bold mt-1 text-amber-400 font-mono flex items-center gap-1">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>{streakMetrics.currentStreak}d</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Consecutive days</div>
                  </div>

                  {/* Metric 5: Best Streak */}
                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Best Streak</div>
                    <div className="text-lg font-bold mt-1 text-purple-400 font-mono flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      <span>{streakMetrics.bestStreak}d</span>
                    </div>
                    <div className="text-[10px] text-slate-500">All-time record</div>
                  </div>

                  {/* Metric 6: Today's Progress */}
                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Progress</div>
                    <div className="text-lg font-bold mt-1 text-emerald-400 font-mono">{todayHabitCompletion}%</div>
                    <div className="text-[10px] text-slate-500">{todayLog.completedHabitIds?.length || 0} of {habits.length} habits logged</div>
                  </div>
                </div>

                {/* 3. 6-MONTH PROGRESS TIMELINE */}
                <div className={`p-5 rounded-2xl border space-y-3 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-indigo-400" />
                      <h2 className="text-xs font-bold uppercase tracking-wider">6-Month Macro Timeline</h2>
                    </div>
                    <button
                      onClick={() => setActivePage('Roadmap')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <span>Full Roadmap</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-1">
                    {months.map((m) => {
                      const prog = getMonthProgress(m);
                      const isCurrent = m.id === currentMonthData.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMonthDrawer(m)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all hover:border-indigo-500/50 ${
                            isCurrent
                              ? 'bg-indigo-500/10 border-indigo-500/30'
                              : isDarkEffective ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="font-bold text-slate-300">M0{m.id}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-sm border ${getMonthStatusBadge(m.status)}`}>
                              {m.status}
                            </span>
                          </div>
                          <div className="text-xs font-semibold mt-1 truncate">{m.theme}</div>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>Progress</span>
                              <span>{prog}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                                style={{ width: `${prog}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. TWO-COLUMN SPLIT: Current Month Goals & Upcoming Milestones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Month Goals */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <h2 className="text-xs font-bold uppercase tracking-wider">
                          Current Month Deliverables ({currentMonthData.name})
                        </h2>
                      </div>
                      <button
                        onClick={() => openCreateGoalModal(currentMonthData.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        + Add Goal
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {currentMonthData.goals.map((g) => (
                        <div
                          key={g.id}
                          className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                            g.completed
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : isDarkEffective ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <button
                              onClick={() => handleToggleGoalCompleted(currentMonthData.id, g.id)}
                              className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors shrink-0"
                            >
                              {g.completed ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                            </button>
                            <div className="space-y-0.5 min-w-0">
                              <div className={`text-xs font-semibold truncate ${g.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                {g.name}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">{g.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${getPriorityBadge(g.priority)}`}>
                              {g.priority}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{g.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Milestones */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <h2 className="text-xs font-bold uppercase tracking-wider">Key Milestones</h2>
                      </div>
                      <button
                        onClick={() => openAddMilestoneModal()}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        + Add Milestone
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {milestones.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                            m.status === 'completed'
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : isDarkEffective ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs font-semibold truncate text-slate-200">{m.title}</div>
                            <div className="text-[10px] text-slate-400">Target: {m.targetDate || 'Flexible'} • M0{m.monthId}</div>
                          </div>
                          <button
                            onClick={() => handleToggleMilestoneCycle(m.id, m.status, m.title)}
                            className="shrink-0 hover:scale-105 transition-transform"
                          >
                            {getMilestoneBadge(m.status)}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. HABIT HEATMAP STRIP (180-Day Glance) */}
                <div className={`p-5 rounded-2xl border space-y-3 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <h2 className="text-xs font-bold uppercase tracking-wider">Habit Heatmap (180-Day Execution)</h2>
                    </div>
                    <button
                      onClick={() => setActivePage('Daily Tracker')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <span>Open Calendar Tracker</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto pt-2 pb-1">
                    <div className="min-w-[700px] flex gap-1">
                      {allDaysList.slice(0, 90).map((day) => {
                        const isComp = day.status === 'completed';
                        const isInp = day.status === 'in-progress';
                        const isMiss = day.status === 'missed';
                        return (
                          <div
                            key={day.date}
                            onClick={() => setActiveDayLogModal({ dateKey: day.date, log: { ...day } })}
                            title={`${day.date}: ${day.status}`}
                            className={`h-7 w-2.5 rounded-xs cursor-pointer transition-all hover:scale-110 ${
                              isComp
                                ? 'bg-emerald-500'
                                : isInp
                                ? 'bg-amber-400'
                                : isMiss
                                ? 'bg-rose-500'
                                : isDarkEffective ? 'bg-slate-800/80 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Day 1 (Start)</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-emerald-500" /> Completed</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-amber-400" /> In Progress</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-rose-500" /> Missed</span>
                    </div>
                    <span>Day 90 (Midway)</span>
                  </div>
                </div>

                {/* 6. RECENT ACTIVITY LOG */}
                <div className={`p-5 rounded-2xl border space-y-3 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <h2 className="text-xs font-bold uppercase tracking-wider">Recent Activity & Audit Log</h2>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Live Telemetry</span>
                  </div>

                  <div className="divide-y divide-inherit">
                    {activities.slice(0, 4).map((act) => (
                      <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                            act.type === 'goal' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            act.type === 'milestone' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            act.type === 'habit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {act.badge}
                          </span>
                          <span className="text-slate-300 font-medium">{act.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">{act.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {}
            {activePage === 'Roadmap' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h2 className="text-base font-bold">6-Month Transformation Roadmap</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sequential progression from foundation building to public launch and synthesis.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center p-1 rounded-lg bg-slate-800/40 border border-slate-700">
                      <button
                        onClick={() => setRoadmapLayout('vertical')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                          roadmapLayout === 'vertical' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Vertical
                      </button>
                      <button
                        onClick={() => setRoadmapLayout('horizontal')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                          roadmapLayout === 'horizontal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Horizontal
                      </button>
                    </div>

                    <button
                      onClick={() => openAddMilestoneModal()}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                    >
                      + Milestone
                    </button>
                  </div>
                </div>

                {roadmapLayout === 'vertical' ? (
                  <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-indigo-500 before:to-slate-800">
                    {months.map((m) => {
                      const prog = getMonthProgress(m);
                      const monthMilestones = milestones.filter((ms) => ms.monthId === m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMonthDrawer(m)}
                          className="relative group cursor-pointer"
                        >
                          <div className={`absolute -left-6 sm:-left-10 top-5 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 text-[10px] font-bold ${
                            m.status === 'Completed'
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : m.status === 'In Progress'
                              ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}>
                            {m.status === 'Completed' ? <Check className="w-3.5 h-3.5" /> : `M${m.id}`}
                          </div>

                          <div className={`p-5 rounded-2xl border transition-all hover:border-indigo-500/50 ${
                            isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-inherit">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Chapter 0{m.id}</span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm border ${getMonthStatusBadge(m.status)}`}>
                                    {m.status}
                                  </span>
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-100 mt-1">{m.theme}</h3>
                                <p className="text-xs text-slate-400">{m.subtitle}</p>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right">
                                  <div className="text-lg font-bold font-mono text-indigo-400">{prog}%</div>
                                  <div className="text-[10px] text-slate-500">Delivered</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200" />
                              </div>
                            </div>

                            <div className="pt-3 space-y-2">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Chapter Milestones ({monthMilestones.length})
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {monthMilestones.map((ms) => (
                                  <div
                                    key={ms.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleMilestoneCycle(ms.id, ms.status, ms.title);
                                    }}
                                    className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/30 flex items-center justify-between"
                                  >
                                    <span className="text-xs truncate mr-2">{ms.title}</span>
                                    {getMilestoneBadge(ms.status)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-[1100px]">
                      {months.map((m) => {
                        const prog = getMonthProgress(m);
                        return (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMonthDrawer(m)}
                            className={`flex-1 p-5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all hover:border-indigo-500/50 ${
                              isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-bold text-indigo-400">Month 0{m.id}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border ${getMonthStatusBadge(m.status)}`}>
                                  {m.status}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold">{m.theme}</h4>
                              <p className="text-xs text-slate-400 line-clamp-3">{m.subtitle}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-inherit">
                              <div className="flex justify-between text-xs font-mono mb-1">
                                <span className="text-slate-400">Progress</span>
                                <span className="text-indigo-400 font-bold">{prog}%</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                                  style={{ width: `${prog}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {}
            {activePage === 'Goals' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h2 className="text-base font-bold">Strategic Goals Portfolio</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Detailed deliverable tracking across all 6 horizon chapters.
                    </p>
                  </div>

                  <button
                    onClick={() => openCreateGoalModal()}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    + Create Goal
                  </button>
                </div>

                <div className="space-y-6">
                  {months.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border space-y-3 ${
                        isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-inherit">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-400">Month 0{m.id}</span>
                          <span className="text-xs font-bold text-slate-200">• {m.theme}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {m.goals.filter((g) => g.completed).length} of {m.goals.length} Finished
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {m.goals.map((g) => (
                          <div
                            key={g.id}
                            className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 ${
                              g.completed
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : isDarkEffective ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <button
                                    onClick={() => handleToggleGoalCompleted(m.id, g.id)}
                                    className="text-slate-500 hover:text-emerald-400 shrink-0"
                                  >
                                    {g.completed ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                                  </button>
                                  <span className={`text-xs font-bold truncate ${g.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                    {g.name}
                                  </span>
                                </div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${getPriorityBadge(g.priority)}`}>
                                  {g.priority}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">{g.description}</p>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 pl-6 pt-2 border-t border-inherit">
                              <span>Due: {g.targetDate || 'No date'}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditGoalModal(g)}
                                  className="text-slate-400 hover:text-slate-200"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGoal(m.id, g.id)}
                                  className="text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {activePage === 'Daily Tracker' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h2 className="text-base font-bold">180-Day GitHub-Style Heatmap</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Visual log of daily habit execution across your transformation.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-amber-400 font-bold">{streakMetrics.currentStreak}d Streak</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 font-bold">{streakMetrics.consistencyScore}% Cadence</span>
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className={`p-6 rounded-2xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="overflow-x-auto">
                    <div className="min-w-[760px] grid grid-cols-12 gap-1.5">
                      {allDaysList.map((day) => {
                        const isComp = day.status === 'completed';
                        const isInp = day.status === 'in-progress';
                        const isMiss = day.status === 'missed';

                        return (
                          <div
                            key={day.date}
                            onClick={() => setActiveDayLogModal({ dateKey: day.date, log: { ...day } })}
                            className={`p-2 rounded-lg border text-center cursor-pointer transition-all hover:scale-105 ${
                              isComp
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : isInp
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                : isMiss
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                                : isDarkEffective ? 'bg-slate-900/40 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
                            }`}
                            title={`${day.date} (M0${day.monthId} Day ${day.dayIndex}): ${day.status}`}
                          >
                            <div className="text-[10px] font-mono font-bold">D{day.dayIndex}</div>
                            <div className="text-[9px] truncate opacity-80">
                              {isComp ? '✓' : isMiss ? '✕' : isInp ? '•' : '-'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {}
            {activePage === 'Habits' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h2 className="text-base font-bold">Daily Habit Engine</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Core recurring routines powering intellectual velocity and physical sovereignty.
                    </p>
                  </div>

                  <button
                    onClick={() => setHabitModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    + New Habit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {habits.map((h) => {
                    const isCheckedToday = todayLog.completedHabitIds?.includes(h.id);
                    return (
                      <div
                        key={h.id}
                        className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
                          isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                                {h.category}
                              </span>
                              {h.dailyTarget && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                                  Target: {h.dailyTarget}
                                </span>
                              )}
                              {h.trackType && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  Track: {h.trackType}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteHabit(h.id)}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h3 className="text-sm font-bold text-slate-200">{h.name}</h3>
                          <div className="text-xs text-slate-400">
                            Frequency: {h.frequency} • Target: {h.targetPerWeek} days / week
                          </div>
                        </div>

                        <div className="pt-3 border-t border-inherit flex items-center justify-between">
                          <div className="text-xs font-medium text-slate-400">
                            Today ({todayKey}):
                          </div>
                          <button
                            onClick={() => handleToggleDailyHabit(todayKey, h.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isCheckedToday
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isCheckedToday ? 'Completed Today' : 'Mark Done'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {}
            {activePage === 'Analytics' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className={`p-5 rounded-2xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h2 className="text-base font-bold">Transformation Intelligence & Velocity Analytics</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Quantitative synthesis of output, cadence, and horizon strengths.
                  </p>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trajectory Pace</div>
                    <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">{overallProgress}%</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Weighted portfolio completion</div>
                  </div>

                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consistency Index</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{streakMetrics.consistencyScore}%</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{streakMetrics.totalCompletedDays} completed days logged</div>
                  </div>

                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Peak Streak</div>
                    <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{streakMetrics.bestStreak}d</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Current: {streakMetrics.currentStreak} consecutive days</div>
                  </div>

                  <div className={`p-4 rounded-xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Milestone Met Rate</div>
                    <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                      {milestones.filter((m) => m.status === 'completed').length} / {milestones.length}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">High-leverage catalysts</div>
                  </div>
                </div>

                {/* Comparative Month Bars */}
                <div className={`p-5 rounded-2xl border space-y-4 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Month-by-Month Completion Rates</h3>
                  <div className="space-y-3">
                    {months.map((m) => {
                      const prog = getMonthProgress(m);
                      return (
                        <div key={m.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-300">{m.name}: {m.theme}</span>
                            <span className="font-mono text-indigo-400 font-bold">{prog}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {}
            {activePage === 'Milestones' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h2 className="text-base font-bold">Key Milestones Center</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Major catalytic achievements. Click milestone status badges to cycle states and celebrate completions.
                    </p>
                  </div>

                  <button
                    onClick={() => openAddMilestoneModal()}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    + Create Milestone
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
                        m.status === 'completed'
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-100">{m.title}</h3>
                          <button
                            onClick={() => handleToggleMilestoneCycle(m.id, m.status, m.title)}
                            className="hover:scale-105 transition-transform shrink-0"
                          >
                            {getMilestoneBadge(m.status)}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-inherit">
                        <span>Target: {m.targetDate || 'Flexible'} • M0{m.monthId}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditMilestoneModal(m)}
                            className="text-slate-400 hover:text-slate-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(m.id)}
                            className="text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {activePage === 'Reflections' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h2 className="text-base font-bold">Monthly Retrospectives & Continuous Codex</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Guided chapter debriefs alongside your 180-day personal operating manual.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5" />
                    <span>Autosave Enabled</span>
                  </div>
                </div>

                {/* Month Picker for Reflections */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {months.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveReflectionMonth(m.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        activeReflectionMonth === m.id
                          ? 'bg-indigo-600 text-white'
                          : isDarkEffective ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Month 0{m.id}
                    </button>
                  ))}
                </div>

                {/* 6 Structured Prompts for active month */}
                {(() => {
                  const r = reflections[activeReflectionMonth] || {
                    achieved: '',
                    wentWell: '',
                    wentWrong: '',
                    learned: '',
                    improveNext: '',
                    overallSummary: '',
                    updatedAt: ''
                  };

                  return (
                    <div className={`p-6 rounded-2xl border space-y-6 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        Month 0{activeReflectionMonth} Retrospective Debrief
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">1. Key Deliverables & What I Achieved</label>
                          <textarea
                            rows={3}
                            value={r.achieved}
                            onChange={(e) => handleUpdateReflectionField(activeReflectionMonth, 'achieved', e.target.value)}
                            placeholder="Shipped deliverables, habits kept, breakthrough metrics..."
                            className={`w-full p-3 rounded-lg text-xs outline-none resize-none ${
                              isDarkEffective ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">2. What Went Well</label>
                          <textarea
                            rows={3}
                            value={r.wentWell}
                            onChange={(e) => handleUpdateReflectionField(activeReflectionMonth, 'wentWell', e.target.value)}
                            placeholder="Routines that promoted flow state and intellectual velocity..."
                            className={`w-full p-3 rounded-lg text-xs outline-none resize-none ${
                              isDarkEffective ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">3. Bottlenecks & What Went Wrong</label>
                          <textarea
                            rows={3}
                            value={r.wentWrong}
                            onChange={(e) => handleUpdateReflectionField(activeReflectionMonth, 'wentWrong', e.target.value)}
                            placeholder="Attention leaks, missed days, delays, or energy dips..."
                            className={`w-full p-3 rounded-lg text-xs outline-none resize-none ${
                              isDarkEffective ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">4. Core Mental Models & Learnings</label>
                          <textarea
                            rows={3}
                            value={r.learned}
                            onChange={(e) => handleUpdateReflectionField(activeReflectionMonth, 'learned', e.target.value)}
                            placeholder="Tactical discoveries and operational insights..."
                            className={`w-full p-3 rounded-lg text-xs outline-none resize-none ${
                              isDarkEffective ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">5. Tactical Improvements for Next Horizon</label>
                        <textarea
                          rows={2}
                          value={r.improveNext}
                          onChange={(e) => handleUpdateReflectionField(activeReflectionMonth, 'improveNext', e.target.value)}
                          placeholder="Specific system adjustments to implement next month..."
                          className={`w-full p-3 rounded-lg text-xs outline-none resize-none ${
                            isDarkEffective ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">6. Executive Transformation Synthesis</label>
                        <textarea
                          rows={2}
                          value={r.overallSummary}
                          onChange={(e) => handleUpdateReflectionField(activeReflectionMonth, 'overallSummary', e.target.value)}
                          placeholder="Sum up the holistic identity shift of this chapter in 2-3 sentences..."
                          className={`w-full p-3 rounded-lg text-xs outline-none resize-none ${
                            isDarkEffective ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Freeform Running Codex Section */}
                <div className={`p-6 rounded-2xl border space-y-3 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between pb-2 border-b border-inherit">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">180-Day Freeform Codex & Journal</h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      {codexNotes.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={codexNotes}
                    onChange={(e) => setCodexNotes(e.target.value)}
                    className={`w-full p-3.5 rounded-xl font-mono text-xs outline-none resize-y leading-relaxed ${
                      isDarkEffective ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            )}

            {}
            {activePage === 'Settings' && (
              <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
                <div className={`p-5 rounded-2xl border ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h2 className="text-base font-bold">Tracker Configuration & Data Sovereignty</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize workspace theme, start dates, and backup or restore data.
                  </p>
                </div>

                {/* Theme Mode Selector */}
                <div className={`p-5 rounded-2xl border space-y-3 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Interface Theme</h3>
                  <div className="grid grid-cols-3 gap-3 max-w-md">
                    {[
                      { id: 'dark', label: 'Dark Mode', icon: Moon },
                      { id: 'light', label: 'Light Mode', icon: Sun },
                      { id: 'system', label: 'System Theme', icon: Laptop }
                    ].map((t) => {
                      const Icon = t.icon;
                      const active = themeMode === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setThemeMode(t.id as ThemeMode)}
                          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                              : isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Journey Timeline Settings */}
                <div className={`p-5 rounded-2xl border space-y-4 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Journey Dates (180-Day Calculation)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Journey Start Date</label>
                      <input
                        type="date"
                        value={journeyStartDate}
                        onChange={(e) => setJourneyStartDate(e.target.value)}
                        className={`w-full p-2.5 rounded-xl text-xs border outline-none ${
                          isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Auto-Calculated 180-Day End Date</label>
                      <input
                        type="text"
                        disabled
                        value={journeyEndDate}
                        className={`w-full p-2.5 rounded-xl text-xs border outline-none font-mono opacity-80 cursor-not-allowed ${
                          isDarkEffective ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Data Export & Backup */}
                <div className={`p-5 rounded-2xl border space-y-3 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Data Backup & Export</h3>
                  <p className="text-xs text-slate-400">
                    Export your complete 6-month progress state (goals, daily logs, milestones, reflections, habits) as a single portable JSON file.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={handleExportJSON}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON Backup</span>
                    </button>
                    <button
                      onClick={handleCopyJSONToClipboard}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy to Clipboard</span>
                    </button>
                  </div>
                </div>

                {/* Data Import */}
                <div className={`p-5 rounded-2xl border space-y-3 ${isDarkEffective ? 'bg-[#0d1017] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Import Backup Dataset</h3>
                  <p className="text-xs text-slate-400">
                    Paste previously exported JSON. The schema will be strictly validated before updating your local state.
                  </p>
                  <textarea
                    rows={4}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder="Paste JSON bundle here..."
                    className={`w-full p-3 rounded-xl font-mono text-xs border outline-none ${
                      isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  {importError && (
                    <div className="text-xs text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>{importError}</span>
                    </div>
                  )}
                  {importSuccess && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Import complete and verified!</span>
                    </div>
                  )}
                  <button
                    onClick={handleImportJSON}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Validate & Restore Data</span>
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Safety Zone & Resets</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Destructive operations require deliberate confirmation and cannot be reversed.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={handleResetCurrentMonth}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20"
                    >
                      Reset Current Month ({currentMonthData.name})
                    </button>
                    <button
                      onClick={handleResetEntireTracker}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20"
                    >
                      Reset to Blueprint Defaults
                    </button>
                    <button
                      onClick={handleClearAllData}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-xs"
                    >
                      Clear All Data (Hard Wipe)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-14 border-t flex items-center justify-around z-40 backdrop-blur-md ${
        isDarkEffective ? 'bg-[#090b10]/95 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-600'
      }`}>
        {[
          { id: 'Dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'Roadmap', label: 'Roadmap', icon: Compass },
          { id: 'Daily Tracker', label: 'Daily', icon: CalendarCheck },
          { id: 'Milestones', label: 'Milestones', icon: Award },
          { id: 'Settings', label: 'Settings', icon: SettingsIcon }
        ].map((btn) => {
          const Icon = btn.icon;
          const active = activePage === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActivePage(btn.id as PageTab)}
              className={`flex flex-col items-center gap-1 py-1 px-3 ${
                active ? 'text-indigo-500 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {}
      {selectedMonthDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedMonthDrawer(null)}
          />
          <div className={`relative w-full max-w-lg p-6 overflow-y-auto border-l shadow-2xl ${
            isDarkEffective ? 'bg-[#0c0e14] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                  Month 0{selectedMonthDrawer.id} Chapter
                </span>
                <h3 className="text-base font-bold text-slate-100">{selectedMonthDrawer.theme}</h3>
              </div>
              <button
                onClick={() => setSelectedMonthDrawer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-6">
              <p className="text-xs text-slate-400 leading-relaxed">{selectedMonthDrawer.subtitle}</p>

              {/* Milestones in this month */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Chapter Milestones</h4>
                  <button
                    onClick={() => openAddMilestoneModal(selectedMonthDrawer.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {milestones.filter((m) => m.monthId === selectedMonthDrawer.id).map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="text-xs font-semibold truncate text-slate-200">{m.title}</div>
                        <div className="text-[10px] text-slate-400">{m.description}</div>
                      </div>
                      <button onClick={() => handleToggleMilestoneCycle(m.id, m.status, m.title)}>
                        {getMilestoneBadge(m.status)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goals in this month */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Strategic Goals</h4>
                  <button
                    onClick={() => openCreateGoalModal(selectedMonthDrawer.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedMonthDrawer.goals.map((g) => (
                    <div
                      key={g.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <button
                          onClick={() => handleToggleGoalCompleted(selectedMonthDrawer.id, g.id)}
                          className="text-slate-500 hover:text-emerald-400 shrink-0"
                        >
                          {g.completed ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <div className="space-y-0.5 truncate">
                          <span className={`text-xs font-bold truncate block ${g.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {g.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">{g.description}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${getPriorityBadge(g.priority)}`}>
                        {g.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {goalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4 ${
            isDarkEffective ? 'bg-[#0d1017] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <h3 className="text-sm font-bold">{editingGoal ? 'Edit Strategic Goal' : 'Create Strategic Goal'}</h3>
              <button onClick={() => setGoalModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Goal Title</label>
                <input
                  type="text"
                  value={formGoalName}
                  onChange={(e) => setFormGoalName(e.target.value)}
                  placeholder="e.g., Deploy stateless auth microservice"
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                {goalFormErrors.name && <span className="text-[10px] text-rose-400">{goalFormErrors.name}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={formGoalDesc}
                  onChange={(e) => setFormGoalDesc(e.target.value)}
                  placeholder="Specific conditions and deliverables..."
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none resize-none ${
                    isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Assigned Month</label>
                  <select
                    value={formGoalMonth}
                    onChange={(e) => setFormGoalMonth(Number(e.target.value))}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                      isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {months.map((m) => (
                      <option key={m.id} value={m.id}>
                        Month 0{m.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Priority</label>
                  <select
                    value={formGoalPriority}
                    onChange={(e) => setFormGoalPriority(e.target.value as PriorityLevel)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                      isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Progress ({formGoalProgress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formGoalProgress}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormGoalProgress(val);
                    setFormGoalCompleted(val === 100);
                  }}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {milestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4 ${
            isDarkEffective ? 'bg-[#0d1017] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <h3 className="text-sm font-bold">{editingMilestone ? 'Edit Milestone' : 'New Milestone'}</h3>
              <button onClick={() => setMilestoneModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Milestone Title</label>
                <input
                  type="text"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  placeholder="e.g., Top 3 Product Launch"
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                {mErrors.title && <span className="text-[10px] text-rose-400">{mErrors.title}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  placeholder="Success metrics for this milestone..."
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none resize-none ${
                    isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Month</label>
                  <select
                    value={mMonth}
                    onChange={(e) => setMMonth(Number(e.target.value))}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                      isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {months.map((m) => (
                      <option key={m.id} value={m.id}>
                        Month 0{m.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Status</label>
                  <select
                    value={mStatus}
                    onChange={(e) => setMStatus(e.target.value as MilestoneStatus)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                      isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setMilestoneModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {habitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4 ${
            isDarkEffective ? 'bg-[#0d1017] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <h3 className="text-sm font-bold">Add Recurring Habit</h3>
              <button onClick={() => setHabitModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewHabit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Habit Name</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., 20-minute physical stretching"
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Daily Target</label>
                  <input
                    type="text"
                    value={newHabitDailyTarget}
                    onChange={(e) => setNewHabitDailyTarget(e.target.value)}
                    placeholder="e.g., 15 min, 2 hours, 100%"
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                      isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Track Type</label>
                  <select
                    value={newHabitTrackType}
                    onChange={(e) => setNewHabitTrackType(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                      isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="✅/❌">✅/❌ (Done / Undone)</option>
                    <option value="Minutes">Minutes</option>
                    <option value="Hours">Hours</option>
                    <option value="Litres">Litres</option>
                    <option value="Completed">Completed</option>
                    <option value="Percent">Percent (%)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Weekly Target ({newHabitTarget} days / week)</label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newHabitTarget}
                  onChange={(e) => setNewHabitTarget(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setHabitModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {activeDayLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4 ${
            isDarkEffective ? 'bg-[#0d1017] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400">
                  {activeDayLogModal.dateKey}
                </span>
                <h3 className="text-sm font-bold">Daily Habit Log</h3>
              </div>
              <button onClick={() => setActiveDayLogModal(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">Check completed habits:</label>
              <div className="space-y-2">
                {habits.map((h) => {
                  const isChecked = activeDayLogModal.log.completedHabitIds?.includes(h.id);
                  return (
                    <div
                      key={h.id}
                      onClick={() => {
                        const current = activeDayLogModal.log.completedHabitIds || [];
                        const next = isChecked ? current.filter((id) => id !== h.id) : [...current, h.id];
                        const nextStatus: DayStatus =
                          next.length === habits.length ? 'completed' : next.length > 0 ? 'in-progress' : 'not-started';

                        setActiveDayLogModal({
                          ...activeDayLogModal,
                          log: { ...activeDayLogModal.log, completedHabitIds: next, status: nextStatus }
                        });
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{h.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        {h.dailyTarget && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                            {h.dailyTarget}
                          </span>
                        )}
                        {h.trackType && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {h.trackType}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-xs font-semibold text-slate-300">Daily Log Note</label>
                <textarea
                  rows={2}
                  value={activeDayLogModal.log.note || ''}
                  onChange={(e) =>
                    setActiveDayLogModal({
                      ...activeDayLogModal,
                      log: { ...activeDayLogModal.log, note: e.target.value }
                    })
                  }
                  placeholder="Focus breakthroughs or notes..."
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none resize-none ${
                    isDarkEffective ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setActiveDayLogModal(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDailyLogs((prev) => ({
                      ...prev,
                      [activeDayLogModal.dateKey]: activeDayLogModal.log
                    }));
                    addActivity(`Updated log for ${activeDayLogModal.dateKey}`, 'habit', 'Habit');
                    setActiveDayLogModal(null);
                    showToast('Day log saved');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Save Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
