// ─── Tool System ────────────────────────────────────────────────────
// Tool calling, tool creation, and MCP server generation.
export class ToolBuilder {
  definition = {
    category: 'custom',
    timeout: 30000,
    requiresAuth: false,
    tags: [],
  };
  static create() {
    return new ToolBuilder();
  }
  name(name) {
    this.definition.name = name;
    return this;
  }
  description(desc) {
    this.definition.description = desc;
    return this;
  }
  category(cat) {
    this.definition.category = cat;
    return this;
  }
  inputParam(name, type, description, options) {
    const props = { ...(this.definition.inputSchema?.properties ?? {}) };
    props[name] = {
      type,
      description,
      ...(options?.enum ? { enum: options.enum } : {}),
      ...(options?.default !== undefined ? { default: options.default } : {}),
    };
    const required = options?.required
      ? [...(this.definition.inputSchema?.required ?? []), name]
      : this.definition.inputSchema?.required;
    this.definition.inputSchema = {
      type: 'object',
      properties: props,
      ...(required?.length ? { required } : {}),
    };
    return this;
  }
  handler(handler) {
    this.definition.handler = handler;
    return this;
  }
  timeout(ms) {
    this.definition.timeout = ms;
    return this;
  }
  requiresAuth(auth) {
    this.definition.requiresAuth = auth;
    return this;
  }
  tags(tags) {
    this.definition.tags = tags;
    return this;
  }
  build() {
    if (!this.definition.name) throw new Error('Tool name is required');
    if (!this.definition.description) throw new Error('Tool description is required');
    if (!this.definition.inputSchema) {
      this.definition.inputSchema = { type: 'object', properties: {} };
    }
    return this.definition;
  }
}
export class MCPServerBuilder {
  server = {
    version: '1.0.0',
    tools: [],
    envVars: [],
    dependencies: [],
  };
  static create() {
    return new MCPServerBuilder();
  }
  name(name) {
    this.server.name = name;
    return this;
  }
  version(version) {
    this.server.version = version;
    return this;
  }
  description(desc) {
    this.server.description = desc;
    return this;
  }
  addTool(tool) {
    this.server.tools = [...(this.server.tools ?? []), tool];
    return this;
  }
  addEnvVar(name) {
    this.server.envVars = [...(this.server.envVars ?? []), name];
    return this;
  }
  addDependency(dep) {
    this.server.dependencies = [...(this.server.dependencies ?? []), dep];
    return this;
  }
  entryPoint(path) {
    this.server.entryPoint = path;
    return this;
  }
  build() {
    if (!this.server.name) throw new Error('Server name is required');
    if (!this.server.description) throw new Error('Server description is required');
    this.server.entryPoint ??= `${this.server.name}_mcp.py`;
    return this.server;
  }
}
// ─── Built-in Tool Definitions (available to all agents) ───────────
export const builtinTools = [
  {
    name: 'browser_navigate',
    description: 'Navigate browser to a URL and return page content',
    category: 'browser',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to navigate to' },
        wait_for: { type: 'string', description: 'CSS selector to wait for' },
      },
      required: ['url'],
    },
    handler: 'cloud-browser-mcp/server.py',
    timeout: 30000,
    requiresAuth: false,
    tags: ['browser', 'navigation'],
  },
  {
    name: 'browser_screenshot',
    description: 'Take a screenshot of the current page or element',
    category: 'browser',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'CSS selector to screenshot (omit for full page)',
        },
        format: { type: 'string', enum: ['png', 'jpeg'], description: 'Image format' },
      },
    },
    handler: 'cloud-browser-mcp/server.py',
    timeout: 15000,
    requiresAuth: false,
    tags: ['browser', 'screenshot'],
  },
  {
    name: 'browser_extract',
    description: 'Extract text, links, or structured data from a page',
    category: 'browser',
    inputSchema: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector to extract from' },
        extract_type: {
          type: 'string',
          enum: ['text', 'links', 'html', 'table'],
          description: 'What to extract',
        },
      },
    },
    handler: 'cloud-browser-mcp/server.py',
    timeout: 10000,
    requiresAuth: false,
    tags: ['browser', 'extraction'],
  },
  {
    name: 'tool_create',
    description: 'Create a new tool from a natural language description',
    category: 'custom',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tool name (snake_case)' },
        description: { type: 'string', description: 'What the tool does' },
        parameters: { type: 'string', description: 'JSON schema of parameters' },
        implementation: { type: 'string', description: 'Python implementation code' },
      },
      required: ['name', 'description'],
    },
    handler: 'aether/tool_creator.py',
    timeout: 60000,
    requiresAuth: false,
    tags: ['tool', 'creation'],
  },
  {
    name: 'mcp_server_create',
    description: 'Scaffold a new MCP server with specified tools',
    category: 'infrastructure',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Server name' },
        description: { type: 'string', description: 'Server purpose' },
        tools: { type: 'string', description: 'JSON array of tool definitions' },
      },
      required: ['name', 'description'],
    },
    handler: 'aether/mcp_scaffolder.py',
    timeout: 30000,
    requiresAuth: false,
    tags: ['mcp', 'creation'],
  },
  {
    name: 'agent_spawn',
    description: 'Spawn a sub-agent with a specific task',
    category: 'ai',
    inputSchema: {
      type: 'object',
      properties: {
        agent_type: { type: 'string', description: 'Agent type to spawn' },
        task: { type: 'string', description: 'Task description for the agent' },
        context: { type: 'string', description: 'Additional context' },
        timeout: { type: 'number', description: 'Max execution time in seconds' },
      },
      required: ['agent_type', 'task'],
    },
    handler: 'aether/agent_spawner.py',
    timeout: 300000,
    requiresAuth: false,
    tags: ['agent', 'orchestration'],
  },
];
// ─── Tool Registry ─────────────────────────────────────────────────
const toolRegistry = new Map();
// Register built-in tools
builtinTools.forEach((t) => {
  toolRegistry.set(t.name, t);
});
export function registerTool(tool) {
  toolRegistry.set(tool.name, tool);
}
export function getTool(name) {
  return toolRegistry.get(name);
}
export function listTools(category) {
  const tools = Array.from(toolRegistry.values());
  return category ? tools.filter((t) => t.category === category) : tools;
}
export function listToolNames() {
  return Array.from(toolRegistry.keys());
}
