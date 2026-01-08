
export interface Milestone {
  id: string;
  date: Date;
  title: string;
  description: string;
  owner: 'protopia' | 'prospect';
  completed?: boolean;
}

export interface ProposalData {
  prospectName: string;
  repName: string;
  repEmail: string;
  licenseFee: number;
  currency: string;
  effectiveDate: Date;
  modelType: string;
  calendlyUrl: string;
  valueBullets: string[];
  milestones: Milestone[];
}

export const defaultProposal: ProposalData = {
  prospectName: "Acme Corp",
  repName: "Sarah Jenkins",
  repEmail: "sarah@protopia.com",
  licenseFee: 60000,
  currency: "USD",
  effectiveDate: new Date(),
  modelType: "Llama 3 70B",
  calendlyUrl: "https://calendly.com",
  valueBullets: [
    "Deploy your endpoint within 45 days",
    "Demo a privacy preserving use case",
    "Agree to public case study"
  ],
  milestones: [
    {
      id: "1",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      title: "Kickoff Call",
      description: "Initial meeting to align on goals and timeline.",
      owner: "protopia",
      completed: false
    },
    {
      id: "2",
      date: new Date(new Date().setDate(new Date().getDate() + 15)),
      title: "Technical Discovery",
      description: "Deep dive into architecture and requirements.",
      owner: "prospect",
      completed: false
    },
    {
      id: "3",
      date: new Date(new Date().setDate(new Date().getDate() + 30)),
      title: "Joint Demo Build",
      description: "Collaborative session to build the POC.",
      owner: "prospect",
      completed: false
    },
    {
      id: "4",
      date: new Date(new Date().setDate(new Date().getDate() + 45)),
      title: "Activation Complete",
      description: "System live and first transaction processed.",
      owner: "prospect",
      completed: false
    }
  ]
};
