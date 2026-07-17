# ⊞ HIVEMIND: Cybernetic Multi-Agent Swarm Orchestration

Hivemind is an advanced, high-tech cognitive orchestration platform that coordinates a collective intelligence of specialized sub-agents. It breaks down complex user objectives, facilitates deep collaborative board discussions, dynamically assigns specialized AI models based on task efficiency, and executes multi-stage development workflows with real-time visual telemetry.

---

## 🌌 System Philosophy: Swarm Intelligence

Traditional AI interactions are limited to single-agent, single-turn prompts. Hivemind introduces a **decentralized, role-specialized steering board** that acts as a cognitive amplifier:
- **Task Decomposition**: The AI Director breaks down objectives into modular subtasks.
- **Collaborative Deliberation**: Specialized roles (Product Directors, Tech Leads, Security Specialists) deliberate, propose, and refine ideas in the Board Room before any execution begins.
- **Dynamic Model Assignments**: Users can recruit and bind specialized AI models on a task-by-task level to leverage model strengths (e.g. assigning deep-reasoning models for core architectures and high-velocity models for automated test suites).

---

## 🛠️ Key Architectural Pillars

### 1. Cyber High-Contrast Interface (Yellow, Blue, & Red Theme)
The platform is styled with an aggressive, ultra-clean sci-fi cybernetic aesthetic:
- **Neon Glow Accents**: Key status displays and panels are framed with radiant yellow, deep cobalt blue, and rich crimson glows.
- **Micro-Animations**: Framer Motion transitions guide user attention across board meetings and workspaces.
- **Modular layout**: Optimized side-by-side terminal logs, consensus rooms, and bento-grid progress circles.

### 2. D3 Real-Time Workload Matrix (`TaskRadialProgress`)
Using **D3.js (v7)**, Hivemind includes an elegant circular progress and workload allocation analyzer:
- **Concentric Outer Ring**: A glowing neon yellow arc indicating overall task completion status.
- **Inner Donut Chart**: High-contrast segments mapped to specialized agent roles, visualising work distribution across the swarm.
- **Tactical Tick Marks**: Inner ticking vector markers indicating active telemetry sub-systems.
- **Interaction States**: Hover states for checking specific model boundaries and agent data sub-blocks.

### 3. Swarm Recruitment Blueprint (`BoardMeetingSummary`)
A visual dashboard displaying optimal model allocations for each active agent:
- **Reasoning Power vs. Velocity ratings**: Displays performance metrics dynamically per assigned role.
- **Contextual Justification**: Shows why a model was matched (e.g. selected for advanced logical deduction vs. fast sequential unit testing).
- **Binding Safeguards**: Validates model bindings in real-time.

### 4. High-Reliability Agent Communication
Hivemind ensures zero-deadlock workflows using advanced recovery mechanics:
- **Unified OpenRouter Gateway**: Access any major model (Gemini, Claude, GPT, Llama, DeepSeek) through a single provider.
- **Dynamic Token Budgeting**: When hitting credit or token allocation exceptions (e.g., restricted OpenRouter token affordances), the system extracts the current affordance limit from the error response, scales the `max_tokens` safely (at 95%), and automatically retries the inference.
- **Active Model Fallback Loops**: If a primary assigned model fails to respond, the execution chain cascades down backup models to keep communication uninterrupted.
- **Robust Schema Healing**: If an agent produces non-JSON content under JSON instruction constraints, a fallback parser wraps the response seamlessly to prevent pipeline breaks.

---

## 💻 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion (`motion/react`), Lucide React icons.
- **Data Visualizations**: D3.js (v7) custom SVG radial rendering.
- **Backend Server**: Node.js Express, TypeScript, Server-Sent Events (SSE) telemetry.
- **Core AI Integration**: Unified **OpenRouter API** integration with automatic rate-limit and token budget self-healing.

---

## 🚀 Quick Start & Deployment

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Add your OpenRouter API Key:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. Launch the development server:
   ```bash
   npm run dev
   ```
   The server runs on port `3000` with live asset hot-reloading.

### Production Build
To bundle the frontend assets and compile the `server.ts` backend into a highly optimized, cold-start resistant file:
```bash
npm run build
```

To run the production build:
```bash
npm run start
```

---

## 🗂️ Project Directory Structure

```text
├── server.ts                       # Backend orchestration server, SSE logic, & OpenRouter agent loops
├── package.json                    # Workspace dependencies and script configurations
├── tsconfig.json                   # TypeScript project rules and path mapping
├── src/
│   ├── main.tsx                    # React client entry point
│   ├── App.tsx                     # Main layout & router
│   ├── types.ts                    # Shared domain type definitions
│   ├── index.css                   # Tailwind CSS global configurations & neon panel glows
│   └── components/
│       ├── TaskRadialProgress.tsx  # Dynamic D3.js circular progress & workload visualizer
│       ├── BoardMeetingSummary.tsx # Swarm model recruitment blueprint & capability indicators
│       ├── BoardMeetingRoom.tsx    # Live steering board dialogue interface & role toggling
│       ├── AgentDiscussion.tsx     # Real-time sub-agent execution chat feed
│       ├── TaskNode.tsx            # Visual graph representation of subtask deliverables
│       ├── NewWorkflowForm.tsx     # Custom swarm initialization portal
│       └── ExecutionLogs.tsx       # Live diagnostic telemetry log
```

---

## 📡 Live Telemetry & Server-Sent Events (SSE)

Hivemind avoids slow HTTP polling by running a permanent Server-Sent Events telemetry link:
1. Whenever the steering board speaks or a task transitions state, the backend raises a workflow state update.
2. Clients instantly receive the structured payload via `/api/workflows/:id/events`.
3. The React UI updates the D3 concentric charts and logs in real-time, resulting in an immersive, high-fidelity experience.
