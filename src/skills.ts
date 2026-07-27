export type SkillCapability = string;

export interface SkillHook {
  readonly type: 'openclaw' | 'pre_execution' | 'post_execution';
  readonly path?: string;
  readonly endpoint?: string;
}

export interface Skill {
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly source: string;
  readonly capabilities: readonly SkillCapability[];
  readonly hooks: readonly SkillHook[];
  readonly config?: Record<string, string>;
}

export interface SkillRegistry {
  readonly skills: Record<string, Skill>;
  readonly openclaw: {
    readonly gatewayUrl: string;
    readonly hookEndpoint: string;
  };
}

const directorySkills: Skill[] = [
  {
    name: 'nebula-commerce',
    version: '1.0.0',
    description: 'E-commerce and dropshipping for store management, orders, and fulfillment',
    source: 'skills/commerce/SKILL.md',
    capabilities: [
      'store_management',
      'product_catalog',
      'order_processing',
      'inventory_sync',
      'pricing_optimization',
      'fulfillment_automation',
    ],
    hooks: [],
  },
  {
    name: 'nebula-content-generation',
    version: '1.0.0',
    description: 'AI-powered content generation for blogs, social media, marketing, and SEO',
    source: 'skills/content-generation/SKILL.md',
    capabilities: [
      'blog_generate',
      'social_media_post',
      'seo_optimize',
      'email_campaign',
      'product_description',
      'ad_copy_generate',
      'content_calendar',
    ],
    hooks: [],
  },
  {
    name: 'nebula-llm-as-a-service',
    version: '1.0.0',
    description: 'LLM-as-a-Service for on-demand model inference, fine-tuning, and evaluation',
    source: 'skills/llm-as-a-service/SKILL.md',
    capabilities: [
      'model_inference',
      'model_fine_tune',
      'model_evaluate',
      'model_deploy',
      'model_list',
      'usage_metering',
    ],
    hooks: [],
  },
  {
    name: 'nebula-telecom',
    version: '1.0.0',
    description: 'Telecom/MVNO for SIM provisioning, plan management, and carrier integration',
    source: 'skills/telecom/SKILL.md',
    capabilities: [
      'sim_provision',
      'plan_management',
      'carrier_lookup',
      'number_porting',
      'usage_tracking',
      'billing_integration',
    ],
    hooks: [],
  },
  {
    name: 'nebula-whatsapp-integration',
    version: '1.0.0',
    description:
      'WhatsApp Business API for automated messaging, AI responses, and customer communication',
    source: 'skills/whatsapp-integration/SKILL.md',
    capabilities: [
      'whatsapp_send',
      'whatsapp_receive',
      'whatsapp_webhook',
      'whatsapp_ai_response',
      'whatsapp_media',
      'whatsapp_templates',
    ],
    hooks: [{ type: 'openclaw', path: 'services/whatsapp-bridge/' }],
  },
];

const incomeSkills: Skill[] = [
  {
    name: 'nebula-income-affiliate',
    version: '1.0.0',
    description: 'Affiliate marketing automation and commission tracking',
    source: 'skills/nebula-income-affiliate.skill',
    capabilities: [
      'affiliate_link_generate',
      'commission_tracking',
      'campaign_management',
      'partner_onboarding',
    ],
    hooks: [],
  },
  {
    name: 'nebula-income-ai-courses',
    version: '1.0.0',
    description: 'AI-powered course creation, hosting, and student management',
    source: 'skills/nebula-income-ai-courses.skill',
    capabilities: [
      'course_generate',
      'student_management',
      'content_delivery',
      'certificate_issue',
    ],
    hooks: [],
  },
  {
    name: 'nebula-income-ai-economy',
    version: '1.0.0',
    description: 'AI economy services marketplace and API monetization',
    source: 'skills/nebula-income-ai-economy.skill',
    capabilities: ['api_monetize', 'model_marketplace', 'usage_billing', 'tenant_management'],
    hooks: [],
  },
  {
    name: 'nebula-income-cloud-services',
    version: '1.0.0',
    description: 'Cloud infrastructure resale and managed services',
    source: 'skills/nebula-income-cloud-services.skill',
    capabilities: [
      'cloud_resell',
      'managed_hosting',
      'infrastructure_provision',
      'billing_automation',
    ],
    hooks: [],
  },
  {
    name: 'nebula-income-digital-products',
    version: '1.0.0',
    description: 'Digital product creation, licensing, and distribution',
    source: 'skills/nebula-income-digital-products.skill',
    capabilities: [
      'product_create',
      'license_management',
      'distribution_automate',
      'sales_tracking',
    ],
    hooks: [],
  },
  {
    name: 'nebula-income-dropshipping',
    version: '1.0.0',
    description: 'Dropshipping automation with supplier sync and order routing',
    source: 'skills/nebula-income-dropshipping.skill',
    capabilities: ['supplier_sync', 'order_route', 'price_monitor', 'inventory_track'],
    hooks: [],
  },
  {
    name: 'nebula-income-hard-money',
    version: '1.0.0',
    description: 'Hard money lending finder and deal matching',
    source: 'skills/nebula-income-hard-money.skill',
    capabilities: ['lender_match', 'deal_analyze', 'loan_originate', 'portfolio_track'],
    hooks: [],
  },
  {
    name: 'nebula-income-miner',
    version: '1.0.0',
    description: 'AI-powered mining operations and yield optimization',
    source: 'skills/nebula-income-miner.skill',
    capabilities: ['hash_optimize', 'profit_switch', 'energy_monitor', 'payout_track'],
    hooks: [],
  },
  {
    name: 'nebula-income-mobile',
    version: '1.0.0',
    description: 'Mobile app monetization and in-app purchase management',
    source: 'skills/nebula-income-mobile.skill',
    capabilities: ['iap_manage', 'ad_integration', 'subscription_manage', 'analytics_track'],
    hooks: [],
  },
  {
    name: 'nebula-income-payments-revenue',
    version: '1.0.0',
    description: 'Payment processing and revenue analytics platform',
    source: 'skills/nebula-income-payments-revenue.skill',
    capabilities: ['payment_process', 'revenue_analyze', 'payout_automate', 'tax_reporting'],
    hooks: [],
  },
  {
    name: 'nebula-income-rei-agents',
    version: '1.0.0',
    description: 'Real estate investment AI agents for deal sourcing and analysis',
    source: 'skills/nebula-income-rei-agents.skill',
    capabilities: ['deal_source', 'property_analyze', 'comp_generate', 'offer_automate'],
    hooks: [],
  },
  {
    name: 'nebula-income-shopify',
    version: '1.0.0',
    description: 'Shopify store automation and growth hacking',
    source: 'skills/nebula-income-shopify.skill',
    capabilities: ['store_automate', 'product_optimize', 'email_automate', 'upsell_engine'],
    hooks: [],
  },
  {
    name: 'nebula-income-stock-trader',
    version: '1.0.0',
    description: 'AI stock trading bot with signal generation and risk management',
    source: 'skills/nebula-income-stock-trader.skill',
    capabilities: ['signal_generate', 'trade_execute', 'risk_manage', 'portfolio_rebalance'],
    hooks: [],
  },
  {
    name: 'nebula-income-vindex-marketplace',
    version: '1.0.0',
    description: 'Vehicle marketplace with AI valuation and listing management',
    source: 'skills/nebula-income-vindex-marketplace.skill',
    capabilities: ['vehicle_valuate', 'listing_manage', 'lead_qualify', 'deal_close'],
    hooks: [],
  },
  {
    name: 'nebula-income-vpn',
    version: '1.0.0',
    description: 'VPN service with bandwidth reselling and WireGuard management',
    source: 'skills/nebula-income-vpn.skill',
    capabilities: ['vpn_provision', 'bandwidth_sell', 'wireguard_manage', 'usage_meter'],
    hooks: [],
  },
];

export const skillRegistry: SkillRegistry = {
  skills: Object.fromEntries([...directorySkills, ...incomeSkills].map((s) => [s.name, s])),
  openclaw: {
    gatewayUrl: 'http://localhost:8090',
    hookEndpoint: '/v1/tools/execute',
  },
};

export function getSkillsForMode(modeSkills: readonly string[]): Skill[] {
  return modeSkills
    .map((name) => skillRegistry.skills[name])
    .filter((s): s is Skill => s !== undefined);
}

export function getSkillByName(name: string): Skill | undefined {
  return skillRegistry.skills[name];
}
