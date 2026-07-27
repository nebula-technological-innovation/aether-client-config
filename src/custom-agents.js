// ─── Custom Agent Builder ───────────────────────────────────────────
// Prompt-train your own agent for any task. Define behavior via
// system prompt, attach skills/tools, and persist as a reusable agent.
import { universalBrowser, universalTools, universalMCP } from './agents';
export class CustomAgentBuilder {
  config = {
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
  static create() {
    return new CustomAgentBuilder();
  }
  id(id) {
    this.config.id = id;
    return this;
  }
  name(name) {
    this.config.name = name;
    return this;
  }
  category(category) {
    this.config.category = category;
    return this;
  }
  description(description) {
    this.config.description = description;
    return this;
  }
  model(model) {
    this.config.model = model;
    return this;
  }
  systemPrompt(prompt) {
    this.config.systemPrompt = prompt;
    return this;
  }
  // Train the agent with examples
  addTrainingExample(input, expectedOutput, tags) {
    const examples = [...(this.config.trainingExamples ?? [])];
    examples.push({ input, expectedOutput, tags });
    this.config.trainingExamples = examples;
    return this;
  }
  // Set training examples in bulk
  trainingExamples(examples) {
    this.config.trainingExamples = examples;
    return this;
  }
  // Attach skills
  addSkill(skillName) {
    this.config.skills = [...(this.config.skills ?? []), skillName];
    return this;
  }
  skills(skills) {
    this.config.skills = skills;
    return this;
  }
  // Attach MCP tools
  addTool(toolName) {
    this.config.tools = [...(this.config.tools ?? []), toolName];
    return this;
  }
  tools(tools) {
    this.config.tools = tools;
    return this;
  }
  // Add custom capabilities
  addCapability(capability) {
    const custom = [...(this.config.capabilities?.custom ?? [])];
    custom.push(capability);
    this.config.capabilities = {
      ...this.config.capabilities,
      custom,
    };
    return this;
  }
  capabilities(custom) {
    this.config.capabilities = {
      ...this.config.capabilities,
      custom,
    };
    return this;
  }
  maxConcurrentTasks(n) {
    this.config.maxConcurrentTasks = n;
    return this;
  }
  canSpawnSubagents(can) {
    this.config.canSpawnSubagents = can;
    return this;
  }
  status(status) {
    this.config.status = status;
    return this;
  }
  metadata(metadata) {
    this.config.metadata = metadata;
    return this;
  }
  build() {
    if (!this.config.id) throw new Error('Agent id is required');
    if (!this.config.name) throw new Error('Agent name is required');
    if (!this.config.systemPrompt) throw new Error('System prompt is required');
    if (!this.config.model) this.config.model = 'aether/orion-v1';
    if (!this.config.category) this.config.category = 'custom';
    return {
      ...this.config,
      updatedAt: new Date().toISOString(),
    };
  }
}
// ─── Agent Store (in-memory, backed by filesystem) ─────────────────
const customAgents = new Map();
export function registerCustomAgent(agent) {
  customAgents.set(agent.id, agent);
}
export function getCustomAgent(id) {
  return customAgents.get(id);
}
export function listCustomAgents() {
  return Array.from(customAgents.values());
}
export function deleteCustomAgent(id) {
  return customAgents.delete(id);
}
export function updateAgentStatus(id, status) {
  const agent = customAgents.get(id);
  if (!agent) return undefined;
  const updated = { ...agent, status, updatedAt: new Date().toISOString() };
  customAgents.set(id, updated);
  return updated;
}
// ─── Quick Factory: Create agent from a single prompt ──────────────
export function createAgentFromPrompt(id, name, prompt, options) {
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
export function toAgentDefinition(agent) {
  return {
    type: `custom-${agent.id}`,
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
