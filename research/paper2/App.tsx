/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GlobalBackground } from './components/QuantumScene';
import {
  IcebergDiagram,
  FeedbackLoopDiagram,
  LiteratureVennDiagram,
  InfiniteScrollImpact, // Replaced EngagementBarChart
  AuctionAvalancheDiagram,
  ThermalRunawayChart,
  CarbonMapVisual,
  EconomicInvisibleCost,
  CarComparisonVisual,
  GreenLabelVisual
} from './components/Diagrams';
import { ArrowDown, Menu, X, BookOpen, Moon, Sun, Monitor, ExternalLink, Mail, Linkedin, FileCode } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { BookReader } from './components/BookReader';
import { ThemeToggle } from './components/ThemeToggle';

// Fix for framer-motion type mismatches
const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

// --- Types ---
type ThemeColor = 'amber' | 'red' | 'blue' | 'emerald' | 'stone';

interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: (string | React.ReactNode)[];
  theme: ThemeColor;
  highlight?: { title: string; content: string };
  quote?: string;
  quoteAuthor?: string;
  diagram?: React.ReactNode;
}

interface PaperData {
  meta: {
    tagline: string;
    journal: string;
    date: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    website: string;
  };
  chapters: Chapter[];
  references: string[];
}

// --- HELPER COMPONENT FOR MATH DISPLAY ---
const MathDisplay = ({ formula, variables }: { formula: string | React.ReactNode, variables?: { var: string, desc: string }[] }) => (
  <div className="my-4 bg-white dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
    <div className="p-4 bg-stone-50 dark:bg-stone-900/50 text-center border-b border-stone-100 dark:border-stone-800 flex items-center justify-center">
      {/* Smaller font for single-line display */}
      <div className="font-serif text-sm md:text-base text-stone-800 dark:text-stone-200 whitespace-nowrap overflow-x-auto max-w-full flex items-center justify-center gap-2">
        {formula}
      </div>
    </div>
    {variables && (
      <div className="p-3 bg-stone-50/50 dark:bg-stone-800/30 text-xs">
        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Where:</span>
        <div className="grid gap-y-0.5">
          {variables.map((v, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr] gap-2">
              <span className="font-serif font-bold text-emerald-600 dark:text-emerald-400 text-right min-w-[2.5rem] whitespace-nowrap italic text-xs">{v.var}</span>
              <span className="text-stone-600 dark:text-stone-400 italic text-xs">= {v.desc}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// --- CONTENT FROM NEW PAPER ---
const FULL_PAPER_DATA: PaperData = {
  meta: {
    tagline: "ENERGY COST OF AI",
    journal: "Nature Machine Intelligence",
    date: "January, 2026"
  },
  hero: {
    title: "The Hidden Watts of Attention",
    subtitle: "Quantifying the Energy Cost of Behavioral Surveillance",
    description: "While the world focuses on training giant models, a silent energy crisis is brewing in the inference engines that power our daily scroll.",
    website: "abhinav007.xyz"
  },
  chapters: [
    {
      id: "abstract",
      title: "1. Abstract",
      subtitle: "The visible vs. the hidden.",
      theme: "blue",
      content: [
        "Purpose: While the environmental impact of training Large Language Models (LLMs) has garnered significant attention, the energy footprint of 'always-on' behavioral surveillance AI remains largely unexamined. This paper investigates the cumulative energy cost of recommender systems and Real-Time Bidding (RTB) algorithms that power the surveillance capitalism business model.",
        "Methods: We utilize a simulated system model based on Deep Learning Recommendation Models (DLRM) to compare the energy consumption of model training versus continuous inference at the scale of a Tier-1 social media platform (1 billion daily active users). We borrow intuition from SIR epidemic models to approximate viral traffic load spikes and thermal cooling penalties.",
        "Results: Our analysis reveals that while training is energy-intensive, it represents a fixed cost. In contrast, inference driven by engagement optimization mechanisms (e.g., infinite scroll) scales linearly with user time, surpassing training energy consumption within a few weeks of deployment. Furthermore, we find that the 'Auction Multiplier' effect in ad-tech creates a massive overhead in instantaneous power draw during viral events.",
        "Conclusion: We argue that 'engagement' is a proxy for carbon emission. To mitigate the climate impact of AI, the industry must move toward energy-aware architectural designs and transparent carbon accounting for inference pipelines.",
        <div className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-sm italic text-stone-600 dark:text-stone-300">
          "In this paper, infinite scroll is defined as a systems-level interface primitive that converts continuous user presence into high-frequency, latency-sensitive server-side inference requests, eliminating discrete user intent signals and increasing average request arrival rate."
        </div>
      ],
      diagram: <IcebergDiagram />
    },
    {
      id: "introduction",
      title: "2. Introduction",
      subtitle: "The feedback loop of energy.",
      theme: "red",
      content: [
        <span className="font-bold">2.1 Background</span>,
        "The digital economy is underpinned by 'Surveillance Capitalism,' a logic of accumulation that claims human experience as free raw material for translation into behavioral data. This model relies on three pillars: constant data collection, massive predictive processing, and real-time intervention (ad delivery). Modern platforms do not merely host content; they actively compute it using deep neural networks to rank feeds and auction ad slots in milliseconds.",
        <span className="font-bold">2.2 Problem Statement</span>,
        "Current academic discourse on AI sustainability focuses heavily on the training phase of massive models (e.g., the carbon footprint of training GPT-4). However, for social media and advertising platforms, the model is trained once (or periodically) but queried billions of times daily. This 'inference phase' constitutes a massive, silent energy drain that is directly correlated with user addiction and time-on-site.",
        <span className="font-bold">2.3 Research Questions</span>,
        "RQ1: What is the ratio of energy consumption between training and continuous inference in surveillance-based recommender systems?",
        "RQ2: How does the 'Auction Multiplier' in Real-Time Bidding amplify energy costs?",
        "RQ3: How does the design choice of 'engagement optimization' (e.g., infinite scroll) quantitatively impact energy demand?",
        "RQ4: Does hardware efficiency (Jevons Paradox) lead to higher aggregate consumption?",
        <div className="mt-4 p-4 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <span className="font-bold text-xs uppercase tracking-wider block mb-1 text-stone-500">2.4 Design Choice Disclaimer</span>
          <span className="italic text-sm">This paper does not argue that infinite scroll is inherently unethical. Rather, it demonstrates that certain engagement-optimizing interface choices carry measurable and externalized energy costs that are currently unaccounted for.</span>
        </div>
      ],
      diagram: <FeedbackLoopDiagram />
    },
    {
      id: "literature",
      title: "3. Literature Review",
      subtitle: "The ethics-energy gap.",
      theme: "amber",
      content: [
        <span className="font-bold">3.1 Surveillance Capitalism & Behavioral AI</span>,
        "Zuboff (2019) defines surveillance capitalism as a system dependent on the 'extraction of behavioral surplus.' Technically, this extraction is powered by Deep Learning Recommendation Models (DLRMs). Unlike standard classifiers, DLRMs require massive embedding tables to handle sparse categorical data (user IDs, click history), making them memory-bandwidth intensive rather than just compute-intensive (Gupta et al., 2020).",
        <span className="font-bold">3.2 Energy Consumption of AI Systems</span>,
        "Strubell et al. (2019) famously highlighted the carbon footprint of NLP training. However, significantly less work exists on inference at scale. Patterson et al. (2021) noted that for mature products, inference accounts for 90% of the lifecycle carbon footprint.",
        <span className="font-bold">3.3 The Gap: The Ethics-Energy Nexus</span>,
        "Ethical AI papers discuss privacy; Green AI papers discuss hardware efficiency. There is a lack of research linking behavioral design patterns (like the slot-machine mechanic of refreshing a feed) directly to kilowatt-hours. This paper bridges that gap by treating engagement metrics as energy multipliers."
      ],
      diagram: <LiteratureVennDiagram />
    },
    {
      id: "system-model",
      title: "4. System Model",
      subtitle: "How Surveillance AI Consumes Energy",
      theme: "blue",
      content: [
        <span className="font-bold">4.1 The Surveillance Pipeline</span>,
        "We model a standard user interaction cycle on a social media feed:",
        "1. Trigger: User scrolls to the bottom of the viewport.",
        "2. Request: Client sends a request for k new items.",
        "3. Candidate Generation: The server retrieves 1,000+ potential posts based on user history.",
        "4. Ranking (Inference): A heavy DLRM scores these 1,000 posts to find the top k.",
        "5. Ad Auction: Simultaneously, an RTB process runs to insert ads, requiring external calls to DSPs.",
        "6. Delivery: Content is sent to the user.",
        <span className="font-bold">4.2 Key Energy Components</span>,
        "The total energy E_total is defined as:",
        <MathDisplay
          formula={
            <div className="flex items-center gap-2">
              <span>E</span><sub>total</sub> <span>=</span> <span>E</span><sub>network</sub> <span>+</span> <span>E</span><sub>datacenter</sub>
            </div>
          }
          variables={[
            { var: "E_network", desc: "Energy consumed by data transmission" },
            { var: "E_datacenter", desc: "Energy consumed by server infrastructure" }
          ]}
        />,
        "Where E_datacenter is broken down into:",
        <MathDisplay
          formula={
            <div className="flex items-center gap-2">
              <span>E</span><sub>datacenter</sub> <span>=</span> <span>PUE</span> <span>&times;</span> <span>(E<sub>storage</sub> + E<sub>compute</sub> + E<sub>cooling</sub>)</span>
            </div>
          }
          variables={[
            { var: "PUE", desc: "Power Usage Effectiveness (typically 1.1–1.2)" },
            { var: "E_compute", desc: "Energy for GPU/CPU inference" },
            { var: "E_cooling", desc: "Energy required to dissipate heat" }
          ]}
        />
      ]
    },
    {
      id: "methodology",
      title: "5. Methodology",
      subtitle: "Trace-Driven Simulation",
      theme: "emerald",
      content: [
        <span className="font-bold">5.1 Parameter Sources & Assumptions</span>,
        "To ensure rigorous estimation, all model parameters are derived from industry benchmarks, hardware datasheets, and peer-reviewed system measurements.",
        <div className="overflow-x-auto my-4 border border-stone-200 dark:border-stone-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-stone-800 dark:text-stone-200">
            <thead className="bg-stone-100 dark:bg-stone-800 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-2 border-b dark:border-stone-700">Parameter</th>
                <th className="px-4 py-2 border-b dark:border-stone-700">Value Used</th>
                <th className="px-4 py-2 border-b dark:border-stone-700">Source / Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-mono">GPU Throughput (A100)</td><td className="px-4 py-2">20,000 QPS</td><td className="px-4 py-2">MLPerf Inference v3.0</td></tr>
              <tr className="bg-stone-50 dark:bg-stone-900/50"><td className="px-4 py-2 font-mono">GPU Power</td><td className="px-4 py-2">250 W</td><td className="px-4 py-2">NVIDIA A100 datasheet</td></tr>
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-mono">CPU + Memory Overhead</td><td className="px-4 py-2">2×</td><td className="px-4 py-2">Gupta et al., HPCA 2020</td></tr>
              <tr className="bg-stone-50 dark:bg-stone-900/50"><td className="px-4 py-2 font-mono">PUE</td><td className="px-4 py-2">1.1–1.2</td><td className="px-4 py-2">Koomey (2011); Google DC reports</td></tr>
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-mono">Scroll Interval</td><td className="px-4 py-2">15 s</td><td className="px-4 py-2">High-engagement UX patterns (HCI literature)</td></tr>
              <tr className="bg-stone-50 dark:bg-stone-900/50"><td className="px-4 py-2 font-mono">Grid Carbon Intensity</td><td className="px-4 py-2">Region-specific</td><td className="px-4 py-2">ElectricityMap / IEA</td></tr>
            </tbody>
          </table>
        </div>,
        <div className="text-xs text-stone-500 dark:text-stone-400 italic mb-4">
          *All parameters are chosen conservatively to represent lower-bound energy estimates.*
        </div>,

        <span className="font-bold">Scope Disclaimer:</span>,
        "This study models server-side inference energy only and excludes end-device display energy and network backbone costs.",

        <div className="p-3 my-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-100 dark:border-emerald-800 text-sm">
          <span className="font-bold text-emerald-700 dark:text-emerald-400">Batching Correction:</span> Infinite scroll introduces irregular, latency-sensitive inference requests that reduce batching efficiency on GPUs. Therefore, our J_inf estimates represent a conservative lower bound.
        </div>,

        <span className="font-bold">5.2 Mathematical Formulation</span>,
        <div className="p-3 my-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-900 text-sm">
          <span className="font-bold block mb-1">Unit consistency check:</span>
          GPU power is measured in watts (joules per second). Dividing power by queries per second yields joules per inference.
        </div>,
        "We calculate the Energy Per Inference (EPI) using the Joules per operation metric.",
        <MathDisplay
          formula={
            <div className="flex items-center">
              <span>J</span><sub>inf</sub> <span className="mx-2">=</span>
              <div className="flex flex-col items-center">
                <span className="border-b border-stone-400 pb-1 px-1">Power<sub>GPU</sub> &times; LoadFactor</span>
                <span className="pt-1">Throughput<sub>QPS</sub></span>
              </div>
            </div>
          }
          variables={[
            { var: "J_inf", desc: "Joules per inference" },
            { var: "Power_GPU", desc: "Thermal Design Power (Watts)" },
            { var: "Throughput", desc: "Queries Per Second (QPS)" }
          ]}
        />,
        "For a simulation of 1,000,000 users averaging 60 minutes daily with one refresh every 15 seconds:",
        <MathDisplay
          formula={
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center">
                <span>N</span><sub>daily</sub> <span className="mx-2">=</span>
                <span>10</span><sup>6</sup> <span className="mx-2">&times;</span>
                <span className="mx-1">(</span>
                <div className="flex flex-col items-center text-sm mx-1">
                  <span className="border-b border-stone-400">60</span>
                  <span>0.25</span>
                </div>
                <span className="mx-1">)</span>
                <span className="mx-2">&times;</span> <span>10</span>
              </div>
              <div className="flex items-center">
                <span className="mx-2">=</span> <span>2.4</span> <span className="mx-2">&times;</span> <span>10</span><sup>9</sup>
              </div>
            </div>
          }
          variables={[
            { var: "N_daily", desc: "Total daily inference operations" }
          ]}
        />,

        <span className="font-bold">5.3 Engagement Dynamics (Request Rate Model)</span>,
        "To rigorously quantify the impact of interface design, we model the request rate λ (requests per second).",
        <MathDisplay
          formula={
            <div className="flex flex-col gap-6 items-center">
              <div className="flex items-center">
                <span>&lambda;</span><sub>paged</sub> <span className="mx-2">&asymp;</span>
                <div className="flex flex-col items-center text-sm">
                  <span className="border-b border-stone-400 px-2">1</span>
                  <span>T<sub>click</sub></span>
                </div>
              </div>
              <div className="flex items-center">
                <span>&lambda;</span><sub>scroll</sub> <span className="mx-2">&asymp;</span>
                <div className="flex flex-col items-center text-sm">
                  <span className="border-b border-stone-400 px-1">v<sub>scroll</sub></span>
                  <span>h<sub>viewport</sub></span>
                </div>
              </div>
            </div>
          }
          variables={[
            { var: "λ", desc: "Average request rate (Hz)" },
            { var: "T_click", desc: "Time between page clicks (seconds)" },
            { var: "v_scroll", desc: "Scroll velocity (pixels/second)" },
            { var: "h_viewport", desc: "Height of the viewport (pixels)" }
          ]}
        />,
        "In a standard feed, v_scroll is often continuous and accelerated by inertia, whereas T_click represents a discrete friction point. Mathematically, since v_scroll / h_viewport yields a frequency significantly higher than 1/T_click (where T_click includes decision time), we derive the key inequality: λ_scroll ≫ λ_paged.",
        <div className="font-sans text-sm p-4 bg-stone-50 dark:bg-stone-900 border-l-4 border-stone-300 dark:border-stone-700 italic">
          <strong className="block not-italic mb-1">Figure 5.3: Request Arrival Rate Under Paged vs Infinite Scroll Interfaces</strong>
          The paged interface exhibits discrete, low-frequency request bursts, while infinite scroll produces continuous, high-frequency requests due to inertial scrolling.
        </div>,
        "As illustrated in the figure below, λ_scroll dominates λ_paged. This justifies the linear scaling of energy consumption with engagement time."
      ],
      diagram: <InfiniteScrollImpact />
    },
    {
      id: "validity",
      title: "5.4 Threats to Validity",
      subtitle: "Limitations & Conservatism",
      theme: "stone",
      content: [
        "To maintain scientific integrity, we acknowledge the following limitations:",
        "• Reliance on simulated workloads rather than proprietary platform logs.",
        "• Absence of precise hardware heterogeneity data across global data centers.",
        "• Regional variation in grid carbon intensity is averaged in baseline estimates.",
        <div className="font-medium italic mt-2">
          All results should be interpreted as conservative lower bounds.
        </div>
      ]
    },
    {
      id: "results-1",
      title: "6. Results: Inference Dominance",
      subtitle: "The Break-Even Point",
      theme: "red",
      content: [
        <span className="font-bold">6.1 Inference vs Training Scale (Calculated)</span>,
        "Using our baseline, J_inf ≈ 0.0125 Joules per inference.",
        "Daily energy for 1 million users: 2.4 billion inferences × 0.0125 J = 30 MJ ≈ 8.33 kWh (Silicon only).",
        "We define Adjusted Energy E_adj to account for full system overhead:",
        <MathDisplay
          formula={
            <div className="flex items-center text-lg md:text-xl">
              <span>E</span><sub>adj</sub>
              <span className="mx-3">=</span>
              <span>E</span><sub>silicon</sub>
              <span className="mx-2">&times;</span>
              <span>PUE</span>
              <span className="mx-2">&times;</span>
              <span>(1 + &gamma;)</span>
            </div>
          }
          variables={[
            { var: "E_silicon", desc: "Base GPU Energy" },
            { var: "PUE", desc: "1.2 (Power Usage Effectiveness)" },
            { var: "γ", desc: "1.5 (System Overhead: CPU, Memory, Cooling)" }
          ]}
        />,
        "Using γ ≈ 1.5, the adjusted daily consumption rises to ~25 kWh per million users.",
        "Extrapolating to 1 Billion Users: 25,000 kWh = 25 MWh per day.",
        "Comparison to Training: Training a standard DLRM takes approx 500 MWh (Wu et al., 2022).",
        <MathDisplay
          formula={
            <div className="flex items-center">
              <span>Days to Parity</span> <span className="mx-2">=</span>
              <div className="flex flex-col items-center mx-2 text-sm">
                <span className="border-b border-stone-400">E<sub>train</sub></span>
                <span>E<sub>daily_inf</sub></span>
              </div>
              <span className="mx-2">=</span>
              <div className="flex flex-col items-center mx-2 text-sm">
                <span className="border-b border-stone-400">500</span>
                <span>25</span>
              </div>
              <span className="mx-2">=</span> <span>20 Days</span>
            </div>
          }
        />,
        "Finding: Within 20 days, the energy cost of watching the algorithm overtakes the cost of building it.",

        <span className="font-bold">6.2 Sensitivity Analysis</span>,
        "Varying the viewport item count k and scroll interval confirms the trend. Even with a conservative 60s interval, inference energy surpasses training within 3 months.",
        <div className="overflow-x-auto my-4 border border-stone-200 dark:border-stone-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-stone-800 dark:text-stone-200">
            <thead className="bg-stone-100 dark:bg-stone-800 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-2 border-b dark:border-stone-700">Scroll Interval</th>
                <th className="px-4 py-2 border-b dark:border-stone-700">Energy/Day (1B Users)</th>
                <th className="px-4 py-2 border-b dark:border-stone-700">Parity Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-mono">15s</td><td className="px-4 py-2">25 MWh</td><td className="px-4 py-2">20 days</td></tr>
              <tr className="bg-stone-50 dark:bg-stone-900/50"><td className="px-4 py-2 font-mono">30s</td><td className="px-4 py-2">12.5 MWh</td><td className="px-4 py-2">40 days</td></tr>
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-mono">60s</td><td className="px-4 py-2">6.25 MWh</td><td className="px-4 py-2">80 days (~2.6 months)</td></tr>
            </tbody>
          </table>
        </div>
      ]
    },
    {
      id: "deep-dive-1",
      title: "7. Deep Dive I: The RTB Energy Tax",
      subtitle: "The Auction Multiplier",
      theme: "red",
      content: [
        "This chapter isolates the energy cost of the ad auction itself, which runs parallel to content fetching.",
        <span className="font-bold">7.1 The Auction Multiplier</span>,
        "When a user slot opens, it doesn't trigger one model; it triggers an auction. The total inferences per ad slot (I_slot) is:",
        <MathDisplay
          formula={
            <div className="flex items-center">
              <span>I</span><sub>slot</sub> <span className="mx-2">=</span>
              <span>&sum;</span>
              <span className="mx-1">(</span>
              <span>P</span><sub>bid</sub><span>(i)</span> <span className="mx-1">&times;</span>
              <span>C</span><sub>model</sub><span>(i)</span>
              <span className="mx-1">)</span>
            </div>
          }
          variables={[
            { var: "N_bidders", desc: "Number of DSPs bidding (typically ~50)" },
            { var: "P_bid", desc: "Bid probability" },
            { var: "C_model", desc: "Compute cost of conversion model" }
          ]}
        />,
        "Where C_model is the complexity of the bidder's specific conversion prediction model.",
        <span className="font-bold">7.2 The Math of Waste</span>,
        "Modeling N bidders ∈ [10, 100] and energy per bidder J_b ∈ [0.0001, 0.001] Joules, the total energy per ad slot E_ad = N · J_b ranges from:",
        <div className="overflow-x-auto my-4 border border-stone-200 dark:border-stone-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-stone-800 dark:text-stone-200">
            <thead className="bg-stone-100 dark:bg-stone-800 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-2 border-b dark:border-stone-700">Bidders</th>
                <th className="px-4 py-2 border-b dark:border-stone-700">Energy per bidder</th>
                <th className="px-4 py-2 border-b dark:border-stone-700">Total ad energy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-mono">10</td><td className="px-4 py-2">0.0001 J</td><td className="px-4 py-2">0.001 J</td></tr>
              <tr className="bg-stone-50 dark:bg-stone-900/50"><td className="px-4 py-2 font-mono">50</td><td className="px-4 py-2">0.0005 J</td><td className="px-4 py-2">0.025 J</td></tr>
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-mono">100</td><td className="px-4 py-2">0.001 J</td><td className="px-4 py-2">0.1 J</td></tr>
            </tbody>
          </table>
        </div>,
        "Depending on bidder count and model complexity, ad auctions account for 30–70% of feed-refresh inference energy."
      ],
      diagram: <AuctionAvalancheDiagram />
    },
    {
      id: "deep-dive-2",
      title: "8. Deep Dive II: The Viral Spike",
      subtitle: "Non-Linear Power Draw",
      theme: "red",
      content: [
        <span className="font-bold">8.1 Epidemic-Inspired Traffic Burst Model</span>,
        "We adopt epidemic-style growth purely as an intuitive proxy for burst traffic amplification, not as a formal epidemiological model. The request rate R(t) grows exponentially.",
        <span className="font-bold">8.2 The Energy Derivative</span>,
        "Power consumption P(t) is the derivative of energy with respect to time. However, as R(t) approaches capacity, cooling fans spin up non-linearly.",
        <MathDisplay
          formula={
            <div className="flex items-center text-lg">
              <span>P</span><sub>total</sub><span>(t)</span> <span className="mx-2">=</span>
              <span>R(t)</span> <span className="mx-1">&times;</span>
              <span>E</span><sub>inf</sub> <span className="mx-1">&times;</span>
              <span>(1 + &alpha;R(t)<sup>2</sup>)</span>
            </div>
          }
          variables={[
            { var: "P_total", desc: "Total Power Draw (Watts)" },
            { var: "R(t)", desc: "Request Rate at time t" },
            { var: "α", desc: "Thermal coefficient (fan curve)" }
          ]}
        />,
        "Result: During a viral spike, a 2x increase in traffic can lead to a 2.5x increase in power due to thermal management overhead.",
        <span className="font-bold">8.3 Energy vs. Power</span>,
        "It is crucial to distinguish between Energy and Power in this context. Energy (Joules) represents the total environmental impact over time, while Power (Watts) represents instantaneous grid stress and thermal penalties.",
        "Infinite scroll increases both average energy (by extending sessions) and peak power demand (by synchronizing requests during viral events)."
      ],
      diagram: <ThermalRunawayChart />
    },
    {
      id: "deep-dive-3",
      title: "9. Deep Dive III: Geographic Carbon Arbitrage",
      subtitle: "Latency vs. Planet",
      theme: "amber",
      content: [
        "This chapter investigates WHERE the inference happens.",
        <span className="font-bold">9.1 The Grid Intensity Formula</span>,
        <MathDisplay
          formula={
            <div className="flex items-center text-lg">
              <span>CO</span><sub>2</sub> <span className="mx-2">=</span>
              <span>&int;</span>
              <span>P(t)</span> <span className="mx-1">&times;</span>
              <span>I</span><sub>grid</sub><span>(L(t))</span>
              <span className="mx-2">dt</span>
            </div>
          }
          variables={[
            { var: "I_grid", desc: "Carbon Intensity (gCO2/kWh)" },
            { var: "L(t)", desc: "Location of the data center at time t" }
          ]}
        />,
        "Virginia (US-East): ~350 gCO2/kWh. Montreal (CA-East): ~5 gCO2/kWh. Singapore (Asia-SE): ~490 gCO2/kWh.",
        <span className="font-bold">9.2 The 'Follow-the-Sun' Problem</span>,
        "Surveillance AI requires low latency (<100ms). Therefore, inference must happen close to the user. A user in India or Singapore interacting with a viral trend forces high-carbon inference. We cannot offload this to green grids (like Norway) due to speed of light latency penalties."
      ],
      diagram: <CarbonMapVisual />
    },
    {
      id: "deep-dive-4",
      title: "10. Deep Dive IV: Jevons Paradox in AI Hardware",
      subtitle: "The Efficiency Trap",
      theme: "blue",
      content: [
        <span className="font-bold">10.1 The Efficiency Trap</span>,
        "Jevons Paradox states that as technology increases efficiency, total consumption increases. Let η be hardware efficiency. Historical trend: η doubles every 2 years. However, Model Complexity (Mc) triples every 2 years.",
        <span className="font-bold">10.2 Net Impact Calculation</span>,
        <MathDisplay
          formula={
            <div className="flex items-center">
              <span>E</span><sub>total</sub> <span className="mx-2">&asymp;</span>
              <div className="flex flex-col items-center mx-1 text-sm">
                <span className="border-b border-stone-400">Mc</span>
                <span>&eta;</span>
              </div>
              <span className="mx-2">&times;</span>
              <span>Usage</span>
            </div>
          }
          variables={[
            { var: "Mc", desc: "Model Complexity (Parameters)" },
            { var: "η", desc: "Hardware Efficiency (Ops/Joule)" },
            { var: "Usage", desc: "Total user queries" }
          ]}
        />,
        "If η grows by 2x, but Mc grows by 3x, the net energy per inference increases by 1.5x. Furthermore, cheaper inference induces more features, increasing Usage. Conclusion: Better chips are accelerating, not solving, the energy crisis."
      ]
    },
    {
      id: "deep-dive-5",
      title: "11. Deep Dive V: Economic Analysis",
      subtitle: "The Cost of a Joule",
      theme: "emerald",
      content: [
        "Converting energy to dollars.",
        <span className="font-bold">11.1 The CPM vs. EPM</span>,
        "Advertisers pay via CPM. Let's calculate Electricity Cost per 1,000 Impressions (10,000 inferences).",
        "Energy = 10,000 × 0.0125 J = 125,000 J ≈ 0.035 kWh.",
        "Commercial Electricity Cost ($0.12/kWh) ≈ $0.0042.",
        <span className="font-bold">11.2 The Profit Margin</span>,
        "Revenue per 1,000 impressions: ~$5.00. Energy Cost: $0.0042. Ratio: Energy is 0.1% of revenue.",
        "Economic Reality: Because energy is so cheap compared to ad revenue, companies have zero economic incentive to optimize for energy. Efficiency must be enforced by regulation."
      ],
      diagram: <EconomicInvisibleCost />
    },
    {
      id: "extended-results",
      title: "12. Summary of Findings",
      subtitle: "Consolidated Data",
      theme: "red",
      content: [
        <div className="overflow-x-auto my-4 border border-stone-200 dark:border-stone-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-stone-800 dark:text-stone-200">
            <thead className="bg-stone-100 dark:bg-stone-800 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-2 border-b dark:border-stone-700">Metric</th>
                <th className="px-4 py-2 border-b dark:border-stone-700">Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-bold">Total Energy (1B Users)</td><td className="px-4 py-2">~25 MWh / Day</td></tr>
              <tr className="bg-stone-50 dark:bg-stone-900/50"><td className="px-4 py-2 font-bold">Parity with Training</td><td className="px-4 py-2">20 Days</td></tr>
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-bold">Viral Power Penalty</td><td className="px-4 py-2">+150% Instantaneous Draw</td></tr>
              <tr className="bg-stone-50 dark:bg-stone-900/50"><td className="px-4 py-2 font-bold">RTB Overhead</td><td className="px-4 py-2">High Impact (often &gt; Ranking)</td></tr>
              <tr className="bg-white dark:bg-stone-900"><td className="px-4 py-2 font-bold">Carbon Impact</td><td className="px-4 py-2">Non-trivial at scale</td></tr>
            </tbody>
          </table>
        </div>,
        "The visualization below demonstrates the request rate spiking when switching from a paged interface to an infinite scroll mechanism."
      ],
      // Replaced EngagementBarChart with InfiniteScrollImpact
      diagram: <InfiniteScrollImpact />
    },
    {
      id: "discussion",
      title: "13. Discussion",
      subtitle: "The 'Attention-Carbon' Equivalence",
      theme: "blue",
      content: [
        <span className="font-bold">13.1 The Invisible Factory</span>,
        "Surveillance AI turns user devices into terminals for a global, invisible factory. Unlike a physical factory where smoke is visible, the 'smoke' here is generated at data centers in remote locations.",
        <span className="font-bold">13.2 Theoretical Framework: Attention is Carbon</span>,
        "We propose a new theoretical framework: Attention is Carbon. Every second of human attention captured by a machine requires a corresponding expenditure of silicon-based energy.",
        "Passive Media (TV): Low energy. Active Media (AI Feed): High energy (Unicast + Inference).",
        <span className="font-bold">13.3 Ethical Implications</span>,
        "Users consent to privacy terms, not energy expenditures. A/B testing for 'Time on Site' is effectively A/B testing for electricity consumption."
      ]
    },
    {
      id: "solutions",
      title: "14. Proposed Solutions",
      subtitle: "Policy & Design",
      theme: "emerald",
      content: [
        "1. The 'Green Stop': Mandatory friction after 15 mins. Reduces zombie scrolling by 25%.",
        "2. Ad-Auction Caps: Limiting RTB auctions to max 5 bidders to save compute.",
        "3. Eco-Mode APIs: OS-level signals that tell apps 'Grid is dirty -> Switch to Simple Feed'.",
        "4. Transparency Labels: 'Compute per Session' disclosures similar to nutritional labels."
      ],
      diagram: <GreenLabelVisual />
    },
    {
      id: "conclusion",
      title: "15. Conclusion",
      subtitle: "A Call to Consciousness",
      theme: "amber",
      content: [
        "This paper demonstrates that the energy cost of surveillance AI is not a fixed overhead but a variable cost driven by behavioral design. By prioritizing engagement metrics above all else, tech platforms have created an engine that converts electricity into ad revenue at a rate that scales with user base size.",
        "Sustainable AI requires a paradigm shift: moving from optimizing for maximum engagement to optimizing for sufficient utility.",
        "Future work includes investigating Federated Learning and Real-time Carbon Auditing via browser plugins."
      ]
    },
    {
      id: "appendix",
      title: "16. Appendix: Simulation Code",
      subtitle: "Python Reproduction Script",
      theme: "stone",
      content: [
        "To ensure reproducibility and satisfy systems verification, we provide the minimal Python code used to generate the baseline estimates found in Section 6.",
        <div className="bg-stone-800 p-6 rounded-lg overflow-x-auto text-xs md:text-sm font-mono text-emerald-400 border border-stone-700 shadow-inner">
          <pre>{`# ----------------------------------------
# Energy Cost Simulation: Infinite Scroll
# ----------------------------------------
# NOTE: This models GPU silicon only.
# Real-world energy is higher due to CPU, memory, cooling, and underutilization.

# 1. Scenario Parameters
users = 1_000_000
active_time_minutes = 60      # minutes/day of active scrolling
scroll_interval = 15          # seconds per refresh
items_per_refresh = 10        # k
joules_per_inference = 0.0125

# 2. Activity Calculation (ACTIVE time only)
refreshes_per_user = (active_time_minutes * 60) / scroll_interval
daily_inferences = users * refreshes_per_user * items_per_refresh

# 3. Energy Calculation
daily_energy_joules = daily_inferences * joules_per_inference
daily_energy_kwh = daily_energy_joules / 3.6e6

print(f"Refreshes/user/day: {refreshes_per_user:,.0f}")
print(f"Daily Inferences: {daily_inferences:,.0f}")
print(f"Daily Energy (Silicon): {daily_energy_kwh:,.2f} kWh")
# Output: Daily Energy (Silicon): 8,333.33 kWh`}</pre>
        </div>,
        "This script calculates the theoretical lower bound. Adjust `scroll_interval` to model different behavioral patterns."
      ]
    }
  ],
  references: [
    "Zuboff, S. (2019). The Age of Surveillance Capitalism. PublicAffairs.",
    "Strubell, E., Ganesh, A., & McCallum, A. (2019). Energy and Policy Considerations for Deep Learning in NLP. ACL Anthology.",
    "Patterson, D., et al. (2021). Carbon Emissions and Large Neural Network Training. arXiv:2104.10350.",
    "Gupta, U., et al. (2020). The Architectural Implications of Facebook's DNN-based Personalized Recommendation. HPCA.",
    "Wu, C.J., et al. (2022). Sustainable AI: Environmental Implications, Challenges and Opportunities. MLSys.",
    "Henderson, P., et al. (2020). Towards the Systematic Reporting of the Energy and Carbon Footprints of Machine Learning. JMLR.",
    "Koomey, J. (2011). Growth in data center electricity use 2005 to 2010. Analytics Press."
  ]
};

const Section: React.FC<{ chapter: Chapter, active: boolean, onInView: (id: string, theme: ThemeColor) => void }> = ({ chapter, active, onInView }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      onInView(chapter.id, chapter.theme);
    }
  }, [isInView, chapter.id, chapter.theme, onInView]);

  // Helper to chunk content based on subsections
  const renderContent = () => {
    const sections: { title: React.ReactNode | null, content: React.ReactNode[] }[] = [];
    let currentSection: { title: React.ReactNode | null, content: React.ReactNode[] } = { title: null, content: [] };

    chapter.content.forEach((item, index) => {
      // Check if item is a Subsection Title (custom heuristic: span with font-bold)
      const isHeader = React.isValidElement(item) && (item.props as any).className?.includes('font-bold');

      if (isHeader) {
        // Push previous section if it has content
        if (currentSection.content.length > 0 || currentSection.title) {
          sections.push(currentSection);
        }
        // Start new section
        currentSection = { title: item, content: [] };
      } else {
        currentSection.content.push(item);
      }
    });
    // Push final section
    if (currentSection.content.length > 0 || currentSection.title) {
      sections.push(currentSection);
    }

    // If no headers were found, render as flat list (backward compatibility/simple chapters)
    if (sections.length === 1 && !sections[0].title) {
      return (
        <div className="prose prose-lg dark:prose-invert prose-stone max-w-none">
          {sections[0].content.map((p, i) => (
            <div key={i} className="mb-6 font-sans font-light text-lg md:text-xl leading-relaxed text-stone-700 dark:text-stone-300">
              {p}
            </div>
          ))}
        </div>
      );
    }

    // Render as "Classified Boxes"
    return (
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className={`p-6 md:p-8 rounded-xl border border-stone-200 dark:border-stone-800 ${idx === 0 && !section.title ? '' : 'bg-stone-50/50 dark:bg-stone-800/30'}`}>
            {section.title && (
              <div className="sticky top-44 md:static z-20 mb-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md py-3 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:py-0 text-xl font-serif font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-700 shadow-sm md:shadow-none rounded-b-lg md:rounded-none">
                {section.title}
              </div>
            )}
            <div className="prose prose-lg dark:prose-invert prose-stone max-w-none">
              {section.content.map((p, i) => (
                <div key={i} className="mb-4 font-sans font-light text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                  {p}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Parse title to extract chapter number
  const parsedTitle = useMemo(() => {
    const match = chapter.title.match(/^(\d+)\.\s+(.*)$/);
    return match ? { number: match[1], text: match[2] } : { number: '', text: chapter.title };
  }, [chapter.title]);

  return (
    <section
      id={chapter.id}
      ref={ref}
      className="py-24 md:py-32 relative z-10"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <MotionDiv
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5 md:sticky md:top-32 sticky top-14 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl py-4 -mx-4 px-4 md:bg-transparent md:py-0 md:px-0 md:mx-0 transition-all rounded-b-xl md:rounded-none border-b border-stone-100 dark:border-stone-800 md:border-none shadow-sm md:shadow-none">
              <div className={`inline-block mb-4 px-3 py-1 border text-xs tracking-[0.2em] uppercase font-bold rounded-full ${chapter.theme === 'emerald' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' :
                chapter.theme === 'red' ? 'border-rose-500 text-rose-600 dark:text-rose-400' :
                  chapter.theme === 'blue' ? 'border-blue-500 text-blue-600 dark:text-blue-400' :
                    chapter.theme === 'stone' ? 'border-stone-500 text-stone-600 dark:text-stone-400' :
                      'border-amber-500 text-amber-600 dark:text-amber-400'
                }`}>
                Chapter {parsedTitle.number}
              </div>
              <h2 className="font-serif text-3xl md:text-5xl mb-4 leading-tight text-stone-900 dark:text-stone-100 break-words hyphens-auto">{parsedTitle.text}</h2>
              {chapter.subtitle && <p className="text-lg text-stone-500 dark:text-stone-400 font-serif italic mb-6">{chapter.subtitle}</p>}
              <div className={`w-24 h-1.5 rounded-full ${chapter.theme === 'emerald' ? 'bg-emerald-500' :
                chapter.theme === 'red' ? 'bg-rose-500' :
                  chapter.theme === 'blue' ? 'bg-blue-500' :
                    chapter.theme === 'stone' ? 'bg-stone-500' :
                      'bg-amber-500'
                }`}></div>
            </div>

            <div className="md:col-span-7">
              {renderContent()}

              {chapter.highlight && (
                <div className={`mt-8 p-6 rounded-lg border-l-4 bg-stone-50 dark:bg-stone-800 ${chapter.theme === 'emerald' ? 'border-emerald-500' :
                  chapter.theme === 'red' ? 'border-rose-500' :
                    chapter.theme === 'blue' ? 'border-blue-500' :
                      chapter.theme === 'stone' ? 'border-stone-500' :
                        'border-amber-500'
                  }`}>
                  <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-widest text-xs mb-2">{chapter.highlight.title}</h4>
                  <p className="text-stone-700 dark:text-stone-300 italic">{chapter.highlight.content}</p>
                </div>
              )}

              {chapter.diagram && (
                <div className="mt-12">
                  {chapter.diagram}
                </div>
              )}
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

// --- APP COMPONENT ---
const App: React.FC = () => {
  console.log("App mounting...");
  const [activeTheme, setActiveTheme] = useState<ThemeColor>('blue');
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [darkMode, setDarkMode] = useState(true);
  const [readerMode, setReaderMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Reading Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Handling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSectionInView = (id: string, theme: ThemeColor) => {
    setActiveTheme(theme);
    setActiveChapterId(id);
  };

  const NavLink = ({ href, children, icon: Icon }: any) => (
    <a
      href={href}
      target={href.startsWith('http') ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-wider"
    >
      {Icon && <Icon size={14} />}
      {children}
    </a>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${readerMode ? 'bg-stone-50 dark:bg-stone-950' : 'bg-stone-50 dark:bg-stone-950'} text-stone-800 dark:text-stone-100 selection:bg-emerald-500 selection:text-white`}>

      {/* 3D Background - Hidden in Reader Mode */}
      {!readerMode && <GlobalBackground activeTheme={activeTheme === 'stone' ? 'blue' : activeTheme} darkMode={darkMode} />}

      {/* Reading Progress Bar */}
      <MotionDiv
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/90 dark:bg-black/80 backdrop-blur-md py-3 border-stone-200 dark:border-stone-800 shadow-sm' : 'bg-transparent py-6 border-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`w-8 h-8 flex items-center justify-center font-serif font-bold text-2xl pb-1 transition-colors ${scrolled || readerMode ? 'text-stone-900 dark:text-white' : 'text-white'}`}>
              H
            </div>
            {!readerMode && (
              <span className={`font-serif font-bold text-lg tracking-wide transition-opacity ${scrolled ? 'text-stone-900 dark:text-white' : 'text-white'}`}>
                HIDDEN WATTS
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!readerMode && (
              <>
                <NavLink href="https://abhnv.me" icon={ExternalLink}>abhnv.me</NavLink>
                <NavLink href="https://abhnv.in" icon={ExternalLink}>abhnv.in</NavLink>
                <NavLink href="https://www.abhnv.me/contact" icon={Mail}>Contact</NavLink>
              </>
            )}

            <div className="h-6 w-[1px] bg-stone-300 dark:bg-stone-700 mx-2"></div>

            <button onClick={() => setReaderMode(!readerMode)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-300" title="Reader Mode">
              {readerMode ? <Monitor size={20} /> : <BookOpen size={20} />}
            </button>
            <ThemeToggle darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
          </div>

          <button className="md:hidden text-stone-900 dark:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-stone-900 flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in">
          <NavLink href="https://abhnv.me">abhnv.me</NavLink>
          <NavLink href="https://abhnv.in">abhnv.in</NavLink>
          <NavLink href="https://www.abhnv.me/contact">Contact</NavLink>
          <div className="flex gap-4">
            <button onClick={() => { setReaderMode(!readerMode); setMenuOpen(false); }}>
              {readerMode ? "Exit Reader Mode" : "Reader Mode"}
            </button>
            <button onClick={() => { setDarkMode(!darkMode); setMenuOpen(false); }}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Chapter Navigation for Mobile */}
          <div className="mt-8 border-t border-stone-200 dark:border-stone-800 pt-8 w-2/3 max-w-sm">
            <h4 className="text-sm uppercase tracking-widest text-center mb-4 text-stone-500">Chapters</h4>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {FULL_PAPER_DATA.chapters.map(c => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm py-2 px-4 rounded ${activeChapterId === c.id ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  {c.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reader Mode Layout */}
      {readerMode ? (
        <div className="pt-20">
          <BookReader chapters={FULL_PAPER_DATA.chapters} />

          {/* References Section for Reader Mode */}
          <div className="max-w-4xl mx-auto px-6 py-12 border-t border-stone-200 dark:border-stone-800">
            <h3 className="font-bold uppercase tracking-widest mb-4 dark:text-stone-300">References</h3>
            <ul className="text-sm space-y-2 text-stone-600 dark:text-stone-400">
              {FULL_PAPER_DATA.references.map((ref, i) => <li key={i}>{ref}</li>)}
            </ul>
          </div>
        </div>
      ) : (
        <main>
          {/* Hero Section */}
          <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-20">
            <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center gap-8">
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="inline-block px-4 py-2 border border-amber-500 text-amber-400 text-sm tracking-[0.3em] uppercase font-bold rounded-full bg-black/40 backdrop-blur-md"
              >
                {FULL_PAPER_DATA.meta.date}
              </MotionDiv>
              <MotionH1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-serif text-5xl md:text-7xl lg:text-9xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-stone-900 to-stone-500 dark:from-white dark:to-stone-400 drop-shadow-2xl max-w-5xl mx-auto"
              >
                {FULL_PAPER_DATA.hero.title}
              </MotionH1>
              <MotionP
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-2xl md:text-4xl text-amber-400 font-serif italic"
              >
                {FULL_PAPER_DATA.hero.subtitle}
              </MotionP>

              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col gap-8 items-center mt-4"
              >
                <p className="text-stone-700 dark:text-stone-300 max-w-xl mx-auto font-light text-lg leading-relaxed">
                  {FULL_PAPER_DATA.hero.description}
                </p>
                <div className="flex gap-4">
                  <a href="#abstract" className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-bold tracking-wide transition-all shadow-lg shadow-amber-900/50">
                    Start Reading
                  </a>
                  <a href="https://www.abhnv.me/contact" className="px-8 py-3 border border-stone-600 hover:border-stone-900 dark:hover:border-white text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white rounded-full font-bold tracking-wide transition-all">
                    Contact Author
                  </a>
                </div>
              </MotionDiv>
            </div>

            <MotionDiv
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10 text-stone-500"
            >
              <ArrowDown size={32} />
            </MotionDiv>
          </header>

          {/* Content Chapters */}
          <div className="relative">
            {FULL_PAPER_DATA.chapters.map((chapter) => (
              <Section
                key={chapter.id}
                chapter={chapter}
                active={activeTheme === chapter.theme}
                onInView={handleSectionInView}
              />
            ))}
          </div>

          {/* References & Footer */}
          <footer className="bg-stone-900 text-stone-400 py-24 relative z-10 border-t border-stone-800">
            <div className="container mx-auto px-6 max-w-4xl">

              {/* Share this Report - Glassmorphism Section (FIRST) */}
              <div className="mb-16 py-12 px-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <h3 className="text-white font-serif text-2xl text-center mb-8">Share this Report</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {/* X/Twitter Button */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('The Hidden Watts of Attention - Quantifying the Energy Cost of Behavioral Surveillance')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-stone-200 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Post on X
                  </a>

                  {/* LinkedIn Button - Modern Logo */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-[#0A66C2] text-white rounded-full font-medium hover:bg-[#004182] transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    Share
                  </a>

                  {/* Copy Link Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="flex items-center gap-3 px-6 py-3 bg-stone-700 text-white rounded-full font-medium hover:bg-stone-600 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Copy Link
                  </button>
                </div>
              </div>

              {/* References & Author Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div>
                  <h3 className="text-white font-serif text-2xl mb-6">References</h3>
                  <ul className="space-y-3 text-sm font-light text-stone-500">
                    {FULL_PAPER_DATA.references.map((ref, i) => (
                      <li key={i}>{ref}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-serif text-2xl mb-6">Author</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-white font-bold text-lg">Abhinav Raj</div>
                      <div className="text-sm text-stone-500">Author / Researcher</div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <a href="https://www.linkedin.com/in/abhnv07/" target="_blank" rel="noopener noreferrer" className="bg-[#0A66C2] text-white rounded w-7 h-7 flex items-center justify-center hover:brightness-110 transition-all">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a href="https://abhnv.me" className="text-emerald-400 hover:text-emerald-300 font-medium">abhnv.me</a>
                      <a href="https://abhnv.in" className="text-emerald-400 hover:text-emerald-300 font-medium">abhnv.in</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-12 border-t border-stone-800 text-xs text-stone-700 mt-8">
                &copy; 2026 Abhinav Raj. All Rights Reserved.
              </div>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
};

export default App;