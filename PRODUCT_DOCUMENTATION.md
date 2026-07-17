# Z.ai Product Documentation

## Overview

Z.ai is an AI-powered development platform that leverages a board of specialized agents to automate and assist in software development tasks. By simulating a real engineering team, it breaks down complex prompts into manageable subtasks, discusses requirements, executes code, and evaluates progress.

## Core Concepts

### 1. The Director
The Director acts as the orchestrator of the workflow. When a user submits an objective, the Director breaks it down into a series of sequential subtasks, assigning specific roles and models to each.

### 2. The Board (Agent Discussion)
Before executing tasks, a curated board of agents (e.g., Product Manager, Architect, Technical Lead) brainstorms and discusses the requirements. This ensures that the generated plan is technically sound and aligns with user goals.

### 3. Task Execution
Each subtask is executed by a specialized agent (e.g., `zai-coder-pro` for development tasks, `zai-architect-v1` for system design). The agents use context from the board discussion to generate accurate deliverables.

### 4. Progress Evaluation
After a subtask is completed, the Technical Lead evaluates the result. This evaluation is fed back into the workflow, allowing the team to adjust the subsequent steps if necessary.

## API Integration
Z.ai relies on the `@google/genai` SDK, specifically utilizing the Interactions API to manage complex, multi-turn interactions. If the Interactions API fails, it gracefully falls back to the standard `generateContent` API.

## Frontend UI
The UI is designed to provide real-time visibility into the workflow:
- **Agent Discussion**: A real-time chat interface showing the board's deliberation.
- **Task List**: A live view of all subtasks, their statuses (pending, running, completed, failed), and assigned roles.
- **Deliverables**: Links or previews of the generated code, designs, or documentation.
