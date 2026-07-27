import { fullAccess, type AccessPermissions } from './access';
import { agentDefinitions, type AgentDefinition, type AgentTypeKey } from './agents';
import { skillRegistry, type SkillRegistry } from './skills';
import { builtinTools, type ToolDefinition } from './tools';

export const defaultMode: AgentTypeKey = 'builder';

export interface AetherClientConfig {
  readonly defaultAgent: AgentTypeKey;
  readonly agents: readonly AgentDefinition[];
  readonly skills: SkillRegistry;
  readonly tools: readonly ToolDefinition[];
  readonly gateway: {
    readonly openclawUrl: string;
    readonly nebulaGatewayUrl: string;
  };
  readonly features: {
    readonly browserEnabled: true;
    readonly toolCreationEnabled: true;
    readonly mcpServerCreationEnabled: true;
    readonly customAgentsEnabled: true;
    readonly subagentSpawningEnabled: true;
    readonly shellAccessEnabled: true;
    readonly dockerAccessEnabled: true;
    readonly databaseAccessEnabled: true;
    readonly secretsAccessEnabled: true;
    readonly unrestrictedFilesystem: true;
    readonly unrestrictedNetwork: true;
  };
  readonly access: AccessPermissions;
}

export const clientConfig: AetherClientConfig = {
  defaultAgent: defaultMode,
  agents: agentDefinitions,
  skills: skillRegistry,
  tools: builtinTools,
  gateway: {
    openclawUrl: 'http://localhost:8090',
    nebulaGatewayUrl: 'http://localhost:4010',
  },
  features: {
    browserEnabled: true,
    toolCreationEnabled: true,
    mcpServerCreationEnabled: true,
    customAgentsEnabled: true,
    subagentSpawningEnabled: true,
    shellAccessEnabled: true,
    dockerAccessEnabled: true,
    databaseAccessEnabled: true,
    secretsAccessEnabled: true,
    unrestrictedFilesystem: true,
    unrestrictedNetwork: true,
  },
  access: fullAccess,
};
