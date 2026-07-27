import { agentDefinitions } from './agents';
import { skillRegistry } from './skills';
import { builtinTools } from './tools';
import { fullAccess } from './access';
export const defaultMode = 'builder';
export const clientConfig = {
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
