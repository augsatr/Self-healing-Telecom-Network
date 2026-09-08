# AI Self-Healing Telecom Network

> **Smart India Hackathon 2026** - Next-generation telecom infrastructure with AI-driven fault prediction and autonomous healing

## Screenshots

### Dashboard - Network Operations Center
<img width="1917" height="831" alt="Screenshot 2026-09-07 195512" src="https://github.com/user-attachments/assets/82b3bda4-de72-4cb6-b1ca-f6876aaa858c" />


### 3D Globe - Global Network View
<img width="1917" height="838" alt="Screenshot 2026-09-07 195409" src="https://github.com/user-attachments/assets/78174a40-402b-4377-9746-10405ef77910" />


### Network Topology Map
<img width="1917" height="838" alt="Screenshot 2026-09-07 195419" src="https://github.com/user-attachments/assets/796e2ee7-988d-4c82-9220-2e017b61163d" />


### AI Engine Control Center
<img width="1917" height="836" alt="Screenshot 2026-09-07 195429" src="https://github.com/user-attachments/assets/336ed4e9-2f9f-4baa-beff-faab22a0242f" />


### Stress Testing Lab
<img width="1917" height="831" alt="Screenshot 2026-09-07 195512" src="https://github.com/user-attachments/assets/08b02065-67c9-4e20-b37e-3dee0c52fa9d" />


### AI Dashboard - Anomaly Heatmap


### Auto-Healing Engine
<img width="1917" height="873" alt="Screenshot 2026-09-07 195319" src="https://github.com/user-attachments/assets/9dcaa084-a460-44f6-a3f3-86c8ddefdd95" />


---

## Overview

An AI-powered self-healing telecom network that **detects faults before they happen** and **automatically reroutes traffic** with zero human intervention. Built for India's 5G deployment at scale.

## Features

### Network Operations Center
- Real-time monitoring of 32 network nodes across 8 Indian cities
- Live metrics: uptime, latency, bandwidth, fault count
- AI accuracy tracking and healing success rates
- One-click fault injection for live demo

### 3D Globe Visualization
- Interactive rotating 3D Earth with 16 global cities
- Animated data flow lines between cities
- Click any city for detailed infrastructure stats
- Drag to rotate, scroll to zoom

### Network Topology Map
- Canvas-based interactive node visualization
- 5G network slices: eMBB, URLLC, mMTC
- Digital twin with real-time mirror state
- Click nodes for detailed health metrics

### AI Engine Control Center
- Predictive fault detection (CPU, memory, latency analysis)
- Real-time predictions with probability scores
- Automated healing plan generation
- Model performance: 96% accuracy, 95% F1 score

### Stress Testing Lab
- 6 attack simulations: DDoS, traffic spike, mass failure, fiber cut, power outage, cyber attack
- Adjustable intensity (10-100%) and duration
- Live metrics during attack
- Auto-healing response measurement
- Test result history with recovery times

### Incident Reports & Export
- Detailed incident reports with timeline
- Severity filtering (critical/high/medium/low)
- Downloadable text reports
- Weekly summary export

### Enhanced AI Dashboard
- Model accuracy trend charts
- 7-day anomaly detection heatmap
- Radar chart for AI capabilities
- Precision, recall, F1 score metrics

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Recharts | Data visualization |
| Lucide React | Icons |
| Canvas API | 3D Globe & Network Topology |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/augsatr/Self-healing-Telecom-Network.git

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard - Network Operations Center |
| `/globe` | 3D Globe - Global network view |
| `/topology` | Network Map - Interactive topology |
| `/ai-engine` | AI Engine - Predictions & healing |
| `/stress-test` | Stress Test - Attack simulation |
| `/reports` | Reports - Incident logs & export |

## Architecture

```
├── app/                    # Next.js pages
│   ├── page.tsx           # Dashboard
│   ├── globe/             # 3D Globe
│   ├── topology/          # Network Map
│   ├── ai-engine/         # AI Control Center
│   ├── stress-test/       # Stress Testing
│   └── reports/           # Incident Reports
├── components/            # React components
│   ├── Globe3D.tsx        # 3D Earth visualization
│   ├── NetworkTopology.tsx # Canvas network map
│   ├── EnhancedAIDashboard.tsx # AI metrics & charts
│   ├── StressTestingTool.tsx   # Attack simulator
│   ├── ReportsExport.tsx       # Incident reports
│   ├── ParticleBackground.tsx  # Ambient particles
│   └── ...
├── lib/                   # Core logic
│   ├── ai-engine.ts       # AI prediction engine
│   ├── network-simulator.ts # Network simulation
│   └── types.ts           # TypeScript types
└── public/                # Static assets
    └── screenshots/       # Project screenshots
```

## Key Capabilities

- **Predictive Maintenance**: AI analyzes node health and predicts failures 15-60 minutes in advance
- **Autonomous Healing**: Automatic traffic rerouting, failover activation, and load balancing
- **Digital Twin**: Real-time mirrored network state for simulation and analysis
- **Network Slicing**: Support for eMBB, URLLC, and mMTC 5G slices
- **Edge Computing**: Distributed node monitoring across regions

## Demo

1. Open the Dashboard - watch real-time metrics update
2. Click **Inject Fault** - see the auto-healing engine respond
3. Navigate to **3D Globe** - explore global infrastructure
4. Go to **Stress Test** - launch a DDoS simulation
5. Check **Reports** - download incident logs

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contact

**augsatr** - [GitHub](https://github.com/augsatr)

---

Built for Smart India Hackathon 2026 | AI + Digital Twin + 5G Core + Edge Computing
