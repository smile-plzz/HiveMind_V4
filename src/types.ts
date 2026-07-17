export type ApiProvider = 'OpenRouter';
export type AgentModel = string;

export interface DiscussionMessage {
  id: string;
  role: string;
  model: string;
  content: string;
}

export interface SubTask {
  id: string;
  title: string;
  description: string;
  role: string;
  model: AgentModel;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  deliverables?: {
    filename: string;
    content: string;
  }[];
}

export interface SelfHealingAttempt {
  attempt: number;
  success: boolean;
  errors: string;
  healingPrompt: string;
  healedFiles: { filename: string; content: string }[];
}

export interface SelfHealingReport {
  success: boolean;
  attempts: SelfHealingAttempt[];
}

export interface QualityGateAudit {
  auditor: string;
  criterion: string;
  status: 'PASSED' | 'FAILED';
  feedback: string;
}

export interface QualityGateReport {
  overallPassed: boolean;
  audits: QualityGateAudit[];
}

export interface WorkflowState {
  workflowId: string;
  originalPrompt: string;
  provider: ApiProvider;
  availableModels: string[];
  assignedRoles?: string[];
  status: 'idle' | 'board_meeting' | 'discussing' | 'planning' | 'executing' | 'integrating' | 'testing' | 'reviewing' | 'completed' | 'failed';
  boardDiscussion: DiscussionMessage[];
  discussion: DiscussionMessage[];
  tasks: SubTask[];
  logs: WorkflowLog[];
  synthesizedDeliverables?: { filename: string; content: string }[];
  synthesisReport?: string;
  selfHealingReport?: SelfHealingReport;
  qualityGateReport?: QualityGateReport;
}

export interface WorkflowLog {
  id: string;
  timestamp: string;
  agent?: string;
  message: string;
}

