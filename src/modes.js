export const aetherModes = [
  {
    key: 'architect',
    label: 'Architect',
    description: 'System design, dependency mapping, release planning',
    model: 'aether/vega-v1',
    skills: ['nebula-llm-as-a-service', 'nebula-content-generation'],
  },
  {
    key: 'builder',
    label: 'Builder',
    description: 'Feature implementation, refactors, migrations',
    model: 'aether/orion-v1',
    skills: ['nebula-commerce', 'nebula-content-generation', 'nebula-income-digital-products'],
  },
  {
    key: 'operator',
    label: 'Operator',
    description: 'Infra, deployment, automation, observability',
    model: 'aether/atlas-v1',
    skills: ['nebula-telecom', 'nebula-llm-as-a-service', 'nebula-whatsapp-integration'],
  },
  {
    key: 'analyst',
    label: 'Analyst',
    description: 'Business ops, memos, GTM, support workflows',
    model: 'aether/orion-v1',
    skills: ['nebula-commerce', 'nebula-income-affiliate', 'nebula-income-payments-revenue'],
  },
  {
    key: 'security',
    label: 'Security',
    description: 'Threat review, policies, hardening, audit trails',
    model: 'aether/draco-v1',
    skills: ['nebula-llm-as-a-service'],
  },
];
export const defaultMode = 'builder';
