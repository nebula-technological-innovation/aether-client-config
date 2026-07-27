export type SubscriptionTier = 'free' | 'developer' | 'team' | 'enterprise';

export type AetherModeKey =
  | 'architect'
  | 'builder'
  | 'operator'
  | 'analyst'
  | 'security'
  | 'research'
  | 'edu'
  | 'agent'
  | 'analyze'
  | 'studio'
  | 'code'
  | 'enterprise';

export interface AetherMode {
  readonly key: AetherModeKey;
  readonly label: string;
  readonly description: string;
  readonly model: string;
  readonly skills: readonly string[];
  readonly tier: SubscriptionTier;
}

export const aetherModes: readonly AetherMode[] = [
  {
    key: 'architect',
    label: 'Architect',
    description: 'System design, dependency mapping, release planning',
    model: 'aether/vega-v1',
    skills: ['nebula-llm-as-a-service', 'nebula-content-generation'],
    tier: 'free',
  },
  {
    key: 'builder',
    label: 'Builder',
    description: 'Feature implementation, refactors, migrations',
    model: 'aether/orion-v1',
    skills: ['nebula-commerce', 'nebula-content-generation', 'nebula-income-digital-products'],
    tier: 'free',
  },
  {
    key: 'operator',
    label: 'Operator',
    description: 'Infra, deployment, automation, observability',
    model: 'aether/atlas-v1',
    skills: ['nebula-telecom', 'nebula-llm-as-a-service', 'nebula-whatsapp-integration'],
    tier: 'developer',
  },
  {
    key: 'analyst',
    label: 'Analyst',
    description: 'Business ops, memos, GTM, support workflows',
    model: 'aether/orion-v1',
    skills: ['nebula-commerce', 'nebula-income-affiliate', 'nebula-income-payments-revenue'],
    tier: 'developer',
  },
  {
    key: 'security',
    label: 'Security',
    description: 'Threat review, policies, hardening, audit trails',
    model: 'aether/draco-v1',
    skills: ['nebula-llm-as-a-service'],
    tier: 'developer',
  },
  {
    key: 'research',
    label: 'Research',
    description: 'Deep research with web search, citations, multi-source analysis',
    model: 'aether/vega-v1',
    skills: ['nebula-web-search', 'nebula-content-generation'],
    tier: 'developer',
  },
  {
    key: 'edu',
    label: 'EDU',
    description: 'Educational content, course creation, learning paths',
    model: 'aether/vega-v1',
    skills: ['nebula-education', 'nebula-content-generation'],
    tier: 'developer',
  },
  {
    key: 'agent',
    label: 'Agent',
    description: 'Multi-agent orchestration, autonomous workflows',
    model: 'aether/atlas-v1',
    skills: ['nebula-agent-orchestration', 'nebula-mcp-integration'],
    tier: 'developer',
  },
  {
    key: 'analyze',
    label: 'Analyze',
    description: 'Data analysis, forecasting, business intelligence',
    model: 'aether/orion-v1',
    skills: ['nebula-data-analytics', 'nebula-business-intelligence'],
    tier: 'developer',
  },
  {
    key: 'studio',
    label: 'Music Studio',
    description: 'AI music generation, artist personas, podcast creation',
    model: 'aether/lyra-v1',
    skills: ['nebula-music-generation', 'nebula-audio-production'],
    tier: 'developer',
  },
  {
    key: 'code',
    label: 'Code Expert',
    description: 'Advanced code review, architecture analysis, debugging',
    model: 'aether/orion-v1',
    skills: ['nebula-code-excellence', 'nebula-debugging'],
    tier: 'team',
  },
  {
    key: 'enterprise',
    label: 'Enterprise',
    description: 'Security suite, compliance, enterprise integrations',
    model: 'aether/draco-v1',
    skills: ['nebula-security-suite', 'nebula-compliance'],
    tier: 'enterprise',
  },
] as const;

export const defaultMode: AetherModeKey = 'builder';
