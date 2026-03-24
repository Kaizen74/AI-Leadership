export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  contextOverlay: string;
}

export const industries: Industry[] = [
  {
    id: 'aviation_logistics',
    name: 'Aviation & Logistics',
    icon: '✈',
    description: 'Airlines, airports, cargo handling, ground services',
    contextOverlay:
      'The organization operates in the aviation and logistics sector — managing airports, cargo handling, ground services, and airline partnerships across a global network. Regulatory bodies include IATA, national civil aviation authorities, and customs agencies. Key stakeholders include airline partners, airport authorities, ground handling crews, and logistics clients. Industry-specific pressures include safety compliance, turnaround time optimization, fuel cost volatility, and labor-intensive operations undergoing rapid automation.',
  },
  {
    id: 'financial_services',
    name: 'Financial Services',
    icon: '🏦',
    description: 'Banking, insurance, asset management, fintech',
    contextOverlay:
      'The organization operates in financial services — spanning retail banking, institutional asset management, insurance, or fintech. Regulatory bodies include central banks, securities commissions, and financial conduct authorities. Key stakeholders include institutional investors, retail customers, regulators, and fintech partners. Industry-specific pressures include regulatory capital requirements, cybersecurity threats, algorithmic trading oversight, anti-money-laundering compliance, and the tension between digital transformation and fiduciary duty.',
  },
  {
    id: 'healthcare_pharma',
    name: 'Healthcare & Pharma',
    icon: '🏥',
    description: 'Hospitals, pharmaceuticals, medtech, health systems',
    contextOverlay:
      'The organization operates in healthcare or pharmaceuticals — managing hospitals, pharmaceutical R&D, medical device manufacturing, or integrated health systems. Regulatory bodies include the FDA, EMA, WHO, and national health ministries. Key stakeholders include patients, clinical staff, regulatory agencies, insurers, and research partners. Industry-specific pressures include patient safety requirements, clinical trial integrity, drug pricing scrutiny, electronic health record interoperability, and the ethical implications of AI in diagnostic and treatment decisions.',
  },
  {
    id: 'energy_resources',
    name: 'Energy & Resources',
    icon: '⚡',
    description: 'Oil & gas, renewables, mining, utilities',
    contextOverlay:
      'The organization operates in the energy and resources sector — spanning oil and gas, renewable energy, mining, or utilities. Regulatory bodies include energy commissions, environmental protection agencies, and occupational safety authorities. Key stakeholders include governments, local communities, environmental groups, institutional investors, and energy consumers. Industry-specific pressures include the energy transition, ESG commitments, carbon pricing, operational safety in hazardous environments, stranded asset risk, and the challenge of maintaining energy security while decarbonizing.',
  },
  {
    id: 'technology_saas',
    name: 'Technology & SaaS',
    icon: '💻',
    description: 'Enterprise software, cloud platforms, AI companies',
    contextOverlay:
      'The organization operates in the technology sector — building enterprise software, cloud platforms, or AI-powered products. Regulatory bodies include data protection authorities (GDPR, CCPA), antitrust regulators, and AI governance bodies. Key stakeholders include enterprise customers, developers, venture investors, and data subjects. Industry-specific pressures include data privacy obligations, platform liability, open-source ecosystem dynamics, talent wars for AI engineers, rapid product cycles, and the responsibility of deploying AI systems that affect millions of users.',
  },
  {
    id: 'manufacturing_industrial',
    name: 'Manufacturing & Industrial',
    icon: '🏭',
    description: 'Automotive, aerospace, heavy industry, supply chain',
    contextOverlay:
      'The organization operates in manufacturing or industrial sectors — producing automotive, aerospace, consumer goods, or heavy industrial equipment. Regulatory bodies include trade commissions, occupational safety agencies, and environmental regulators. Key stakeholders include factory workers, supply chain partners, OEM customers, unions, and trade bodies. Industry-specific pressures include supply chain resilience, just-in-time vs. just-in-case inventory strategies, factory floor automation, quality control, tariff and trade policy exposure, and the workforce implications of Industry 4.0.',
  },
  {
    id: 'retail_consumer',
    name: 'Retail & Consumer',
    icon: '🛍',
    description: 'Retail chains, e-commerce, FMCG, hospitality',
    contextOverlay:
      'The organization operates in retail, e-commerce, or consumer goods — managing physical stores, digital marketplaces, fast-moving consumer goods, or hospitality services. Regulatory bodies include consumer protection agencies, advertising standards authorities, and data privacy regulators. Key stakeholders include consumers, franchise operators, supply chain partners, and brand ambassadors. Industry-specific pressures include omnichannel transformation, customer data ethics, demand forecasting accuracy, last-mile logistics, brand reputation in social media, and the balance between personalization and privacy.',
  },
  {
    id: 'public_sector',
    name: 'Public Sector & Education',
    icon: '🏛',
    description: 'Government agencies, universities, NGOs, multilaterals',
    contextOverlay:
      'The organization operates in the public sector — as a government agency, university, non-governmental organization, or multilateral institution. Oversight bodies include legislative committees, audit offices, public ombudsmen, and donor organizations. Key stakeholders include citizens, students, elected officials, civil servants, and international partners. Industry-specific pressures include public accountability and transparency requirements, procurement regulations, political cycles, budget constraints, the digital divide, and the need to deploy AI responsibly when decisions affect public welfare, social equity, and democratic legitimacy.',
  },
];

export function getIndustry(id: string): Industry | undefined {
  return industries.find((ind) => ind.id === id);
}
