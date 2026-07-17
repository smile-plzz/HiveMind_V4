# Development Roadmap

## Phase 1: Core Orchestration (Current)
- [x] Basic multi-agent orchestration.
- [x] Real-time updates via SSE.
- [x] Agent discussion board (Product Manager, Architect, Technical Lead).
- [x] Task decomposition and execution.
- [x] Progress evaluation after task completion.

## Phase 2: Enhanced Interactivity
- [ ] **Human-in-the-Loop**: Allow users to pause the workflow, provide feedback during board discussions, or approve tasks before execution.
- [ ] **State Persistence**: Save workflows to a database (e.g., Cloud SQL or Firestore) so they can be resumed later.
- [ ] **Workspace Integration**: Allow agents to read/write actual files in a sandboxed environment rather than just generating textual deliverables.

## Phase 3: Advanced Agent Capabilities
- [ ] **Custom Agent Roles**: Allow users to define custom agents with specific system prompts and capabilities.
- [ ] **Tool Use**: Equip agents with tools (e.g., web search, code execution, database querying) to solve more complex problems.
- [ ] **Parallel Execution**: Enable independent subtasks to be executed simultaneously by different agents to speed up the workflow.

## Phase 4: Enterprise Features
- [ ] **Team Collaboration**: Allow multiple users to observe and interact with the same workflow.
- [ ] **Analytics Dashboard**: Track agent performance, API usage, and workflow efficiency.
- [ ] **Integration with CI/CD**: Automatically trigger workflows from GitHub issues or PRs.
