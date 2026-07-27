// ─── Custom Agent Builder ───────────────────────────────────────────
// Prompt-train your own agent for any task. Define behavior via
// system prompt, attach skills/tools, and persist as a reusable agent.

import type { AgentCategory, AgentCapabilities, AgentTypeKey } from './agents';
import { universalBrowser, universalTools, universalMCP } from './agents';

export type CustomAgentStatus = 'draft' | 'training' | 'active' | 'paused' | 'archived';

export interface TrainingExample {
  readonly input: string;
  readonly expectedOutput: string;
  readonly tags?: readonly string[];
}

export interface CustomAgentConfig {
  readonly id: string;
  readonly name: string;
  readonly category: AgentCategory;
  readonly description: string;
  readonly model: string;
  readonly systemPrompt: string;
  readonly skills: readonly string[];
  readonly tools: readonly string[];
  readonly capabilities: AgentCapabilities;
  readonly trainingExamples: readonly TrainingExample[];
  readonly status: CustomAgentStatus;
  readonly maxConcurrentTasks: number;
  readonly canSpawnSubagents: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Record<string, unknown>;
}

// ─── Builder Pattern ───────────────────────────────────────────────

type MutableCustomAgentConfig = {
  -readonly [K in keyof CustomAgentConfig]: CustomAgentConfig[K];
};

export class CustomAgentBuilder {
  private config: Partial<MutableCustomAgentConfig> = {
    status: 'draft',
    skills: [],
    tools: [],
    trainingExamples: [],
    maxConcurrentTasks: 3,
    canSpawnSubagents: false,
    capabilities: {
      browser: universalBrowser,
      tools: universalTools,
      mcp: universalMCP,
      custom: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  static create(): CustomAgentBuilder {
    return new CustomAgentBuilder();
  }

  id(id: string): this {
    this.config.id = id;
    return this;
  }

  name(name: string): this {
    this.config.name = name;
    return this;
  }

  category(category: AgentCategory): this {
    this.config.category = category;
    return this;
  }

  description(description: string): this {
    this.config.description = description;
    return this;
  }

  model(model: string): this {
    this.config.model = model;
    return this;
  }

  systemPrompt(prompt: string): this {
    this.config.systemPrompt = prompt;
    return this;
  }

  // Train the agent with examples
  addTrainingExample(input: string, expectedOutput: string, tags?: string[]): this {
    const examples = [...(this.config.trainingExamples ?? [])];
    examples.push({ input, expectedOutput, tags });
    this.config.trainingExamples = examples;
    return this;
  }

  // Set training examples in bulk
  trainingExamples(examples: TrainingExample[]): this {
    this.config.trainingExamples = examples;
    return this;
  }

  // Attach skills
  addSkill(skillName: string): this {
    this.config.skills = [...(this.config.skills ?? []), skillName];
    return this;
  }

  skills(skills: string[]): this {
    this.config.skills = skills;
    return this;
  }

  // Attach MCP tools
  addTool(toolName: string): this {
    this.config.tools = [...(this.config.tools ?? []), toolName];
    return this;
  }

  tools(tools: string[]): this {
    this.config.tools = tools;
    return this;
  }

  // Add custom capabilities
  addCapability(capability: string): this {
    const custom = [...(this.config.capabilities?.custom ?? [])];
    custom.push(capability);
    this.config.capabilities = {
      ...this.config.capabilities!,
      custom,
    };
    return this;
  }

  capabilities(custom: string[]): this {
    this.config.capabilities = {
      ...this.config.capabilities!,
      custom,
    };
    return this;
  }

  maxConcurrentTasks(n: number): this {
    this.config.maxConcurrentTasks = n;
    return this;
  }

  canSpawnSubagents(can: boolean): this {
    this.config.canSpawnSubagents = can;
    return this;
  }

  status(status: CustomAgentStatus): this {
    this.config.status = status;
    return this;
  }

  metadata(metadata: Record<string, unknown>): this {
    this.config.metadata = metadata;
    return this;
  }

  build(): CustomAgentConfig {
    if (!this.config.id) throw new Error('Agent id is required');
    if (!this.config.name) throw new Error('Agent name is required');
    if (!this.config.systemPrompt) throw new Error('System prompt is required');
    if (!this.config.model) this.config.model = 'aether/orion-v1';
    if (!this.config.category) this.config.category = 'custom';

    return {
      ...this.config,
      updatedAt: new Date().toISOString(),
    } as CustomAgentConfig;
  }
}

// ─── Agent Store (in-memory, backed by filesystem) ─────────────────

const customAgents = new Map<string, CustomAgentConfig>();

export function registerCustomAgent(agent: CustomAgentConfig): void {
  customAgents.set(agent.id, agent);
}

export function getCustomAgent(id: string): CustomAgentConfig | undefined {
  return customAgents.get(id);
}

export function listCustomAgents(): CustomAgentConfig[] {
  return Array.from(customAgents.values());
}

export function deleteCustomAgent(id: string): boolean {
  return customAgents.delete(id);
}

export function updateAgentStatus(
  id: string,
  status: CustomAgentStatus,
): CustomAgentConfig | undefined {
  const agent = customAgents.get(id);
  if (!agent) return undefined;
  const updated = { ...agent, status, updatedAt: new Date().toISOString() };
  customAgents.set(id, updated);
  return updated;
}

// ─── Quick Factory: Create agent from a single prompt ──────────────

export function createAgentFromPrompt(
  id: string,
  name: string,
  prompt: string,
  options?: {
    model?: string;
    skills?: string[];
    tools?: string[];
    capabilities?: string[];
    examples?: TrainingExample[];
  },
): CustomAgentConfig {
  const builder = CustomAgentBuilder.create()
    .id(id)
    .name(name)
    .description(`Custom agent: ${name}`)
    .systemPrompt(prompt)
    .model(options?.model ?? 'aether/orion-v1');

  if (options?.skills) builder.skills(options.skills);
  if (options?.tools) builder.tools(options.tools);
  if (options?.capabilities) builder.capabilities(options.capabilities);
  if (options?.examples) builder.trainingExamples(options.examples);

  const agent = builder.status('active').build();
  registerCustomAgent(agent);
  return agent;
}

// ─── Convert custom agent to built-in agent format ─────────────────

export function toAgentDefinition(agent: CustomAgentConfig) {
  return {
    type: `custom-${agent.id}` as AgentTypeKey,
    category: agent.category,
    label: agent.name,
    description: agent.description,
    model: agent.model,
    systemPrompt: agent.systemPrompt,
    skills: agent.skills,
    capabilities: agent.capabilities,
    tools: agent.tools,
    maxConcurrentTasks: agent.maxConcurrentTasks,
    canSpawnSubagents: agent.canSpawnSubagents,
  };
}
