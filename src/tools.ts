// ─── Tool System ────────────────────────────────────────────────────
// Tool calling, tool creation, and MCP server generation.

// ─── Tool Schema Types ─────────────────────────────────────────────

export type JsonSchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';

export interface JsonSchemaProperty {
  readonly type: JsonSchemaType;
  readonly description?: string;
  readonly enum?: readonly string[];
  readonly items?: JsonSchemaProperty;
  readonly properties?: Record<string, JsonSchemaProperty>;
  readonly required?: readonly string[];
  readonly default?: unknown;
}

export interface ToolInputSchema {
  readonly type: 'object';
  readonly properties: Record<string, JsonSchemaProperty>;
  readonly required?: readonly string[];
}

export interface ToolOutputSchema {
  readonly type: 'object';
  readonly properties: Record<string, JsonSchemaProperty>;
}

// ─── Tool Definition ───────────────────────────────────────────────

export type ToolCategory =
  'browser' | 'data' | 'communication' | 'infrastructure' | 'ai' | 'custom';

export interface ToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly category: ToolCategory;
  readonly inputSchema: ToolInputSchema;
  readonly outputSchema?: ToolOutputSchema;
  readonly handler: string; // Python/JS handler path or inline code
  readonly timeout: number; // ms
  readonly requiresAuth: boolean;
  readonly tags: readonly string[];
}

export interface ToolCallRequest {
  readonly toolName: string;
  readonly arguments: Record<string, unknown>;
  readonly callId?: string;
  readonly timeout?: number;
}

export interface ToolCallResult {
  readonly callId: string;
  readonly toolName: string;
  readonly success: boolean;
  readonly result?: unknown;
  readonly error?: string;
  readonly duration: number; // ms
  readonly timestamp: string;
}

// ─── Tool Builder ──────────────────────────────────────────────────

type MutableToolDefinition = {
  -readonly [K in keyof ToolDefinition]: ToolDefinition[K];
};

export class ToolBuilder {
  private definition: Partial<MutableToolDefinition> = {
    category: 'custom',
    timeout: 30000,
    requiresAuth: false,
    tags: [],
  };

  static create(): ToolBuilder {
    return new ToolBuilder();
  }

  name(name: string): this {
    this.definition.name = name;
    return this;
  }

  description(desc: string): this {
    this.definition.description = desc;
    return this;
  }

  category(cat: ToolCategory): this {
    this.definition.category = cat;
    return this;
  }

  inputParam(
    name: string,
    type: JsonSchemaType,
    description: string,
    options?: { required?: boolean; enum?: string[]; default?: unknown },
  ): this {
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

  handler(handler: string): this {
    this.definition.handler = handler;
    return this;
  }

  timeout(ms: number): this {
    this.definition.timeout = ms;
    return this;
  }

  requiresAuth(auth: boolean): this {
    this.definition.requiresAuth = auth;
    return this;
  }

  tags(tags: string[]): this {
    this.definition.tags = tags;
    return this;
  }

  build(): ToolDefinition {
    if (!this.definition.name) throw new Error('Tool name is required');
    if (!this.definition.description) throw new Error('Tool description is required');
    if (!this.definition.inputSchema) {
      this.definition.inputSchema = { type: 'object', properties: {} };
    }
    return this.definition as ToolDefinition;
  }
}

// ─── MCP Server Builder ────────────────────────────────────────────

export interface MCPServerDefinition {
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly tools: readonly ToolDefinition[];
  readonly envVars: readonly string[];
  readonly entryPoint: string;
  readonly dependencies: readonly string[];
}

type MutableMCPServerDefinition = {
  -readonly [K in keyof MCPServerDefinition]: MCPServerDefinition[K];
};

export class MCPServerBuilder {
  private server: Partial<MutableMCPServerDefinition> = {
    version: '1.0.0',
    tools: [],
    envVars: [],
    dependencies: [],
  };

  static create(): MCPServerBuilder {
    return new MCPServerBuilder();
  }

  name(name: string): this {
    this.server.name = name;
    return this;
  }

  version(version: string): this {
    this.server.version = version;
    return this;
  }

  description(desc: string): this {
    this.server.description = desc;
    return this;
  }

  addTool(tool: ToolDefinition): this {
    this.server.tools = [...(this.server.tools ?? []), tool];
    return this;
  }

  addEnvVar(name: string): this {
    this.server.envVars = [...(this.server.envVars ?? []), name];
    return this;
  }

  addDependency(dep: string): this {
    this.server.dependencies = [...(this.server.dependencies ?? []), dep];
    return this;
  }

  entryPoint(path: string): this {
    this.server.entryPoint = path;
    return this;
  }

  build(): MCPServerDefinition {
    if (!this.server.name) throw new Error('Server name is required');
    if (!this.server.description) throw new Error('Server description is required');
    this.server.entryPoint ??= `${this.server.name}_mcp.py`;
    return this.server as MCPServerDefinition;
  }
}

// ─── Built-in Tool Definitions (available to all agents) ───────────

export const builtinTools: readonly ToolDefinition[] = [
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
] as const;

// ─── Tool Registry ─────────────────────────────────────────────────

const toolRegistry = new Map<string, ToolDefinition>();

// Register built-in tools
builtinTools.forEach((t) => {
  toolRegistry.set(t.name, t);
});

export function registerTool(tool: ToolDefinition): void {
  toolRegistry.set(tool.name, tool);
}

export function getTool(name: string): ToolDefinition | undefined {
  return toolRegistry.get(name);
}

export function listTools(category?: ToolCategory): ToolDefinition[] {
  const tools = Array.from(toolRegistry.values());
  return category ? tools.filter((t) => t.category === category) : tools;
}

export function listToolNames(): string[] {
  return Array.from(toolRegistry.keys());
}
