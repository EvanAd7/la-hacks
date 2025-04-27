export interface ProfileData {
  profile: {
    id: string;
    name: string;
    location: string;
    headline: string;
    description: string;
    title: string;
    profile_picture_url: string;
    linkedin_url: string;
  };
  experience: {
    title: string;
    company_name: string;
    start_date: string;
    end_date: string;
    description: string;
    location: string;
    company_logo: string;
  }[];
  education: {
    degree: string;
    field_of_study: string;
    school_name: string;
    start_date: string;
    end_date: string;
    description: string;
    school_logo: string;
  }[];
}

export interface ContactProfile extends ProfileData {
  id: string;
  category: string[];
  responded: boolean;
  responseDate?: string;
  lastContactDate: string;
  message: string;
}

export const mockProfiles: ContactProfile[] = [
  {
    id: "profile-1",
    category: ["Tech Recruiter", "Alumni"],
    responded: true,
    responseDate: "2024-05-10",
    lastContactDate: "2024-05-05",
    message: "Hi Jessica, I noticed you're a technical recruiter at Amazon with experience in ML roles. I recently completed a project using AWS SageMaker for NLP classification and would love to connect about potential opportunities in that space.",
    profile: {
      id: "jessica-murphy",
      name: "Jessica Murphy",
      location: "Seattle, WA",
      headline: "Technical Recruiter at Amazon AWS | Hiring ML Engineers",
      description: "I help build world-class AI/ML teams at Amazon Web Services. Focusing on finding passionate engineers who want to push the boundaries of what's possible with machine learning at scale.",
      title: "Technical Recruiter",
      profile_picture_url: "https://i.pravatar.cc/150?img=20",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Technical Recruiter",
        company_name: "Amazon",
        start_date: "2021-03",
        end_date: "present",
        description: "Lead technical recruiting for ML engineering roles across AWS AI services. Partner closely with hiring managers to build diverse and skilled teams.",
        location: "Seattle, WA",
        company_logo: "https://logo.clearbit.com/amazon.com"
      },
      {
        title: "Recruiter",
        company_name: "Microsoft",
        start_date: "2018-06",
        end_date: "2021-02",
        description: "Recruited software engineers for Azure cloud services teams.",
        location: "Redmond, WA",
        company_logo: "https://logo.clearbit.com/microsoft.com"
      }
    ],
    education: [
      {
        degree: "Bachelor of Arts",
        field_of_study: "Psychology",
        school_name: "University of Washington",
        start_date: "2014",
        end_date: "2018",
        description: "Focus on industrial psychology and organizational behavior",
        school_logo: "https://logo.clearbit.com/washington.edu"
      }
    ]
  },
  {
    id: "profile-2",
    category: ["Engineer", "Alumni"],
    responded: false,
    lastContactDate: "2024-05-08",
    message: "Hello Emily, I came across your profile and was impressed by your work at Netflix. As a fellow Stanford CS alum, I'm very interested in learning more about the engineering culture there and how you've applied your skills in distributed systems.",
    profile: {
      id: "emily-zhang",
      name: "Emily Zhang",
      location: "San Francisco, CA",
      headline: "Software Engineer at Netflix | Distributed Systems",
      description: "I build scalable distributed systems at Netflix, focusing on the content delivery platform. Passionate about high-performance computing and microservices architecture.",
      title: "Senior Software Engineer",
      profile_picture_url: "https://i.pravatar.cc/150?img=10",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Senior Software Engineer",
        company_name: "Netflix",
        start_date: "2022-01",
        end_date: "present",
        description: "Working on core content delivery microservices, improving system reliability and performance at scale.",
        location: "Los Gatos, CA",
        company_logo: "https://logo.clearbit.com/netflix.com"
      },
      {
        title: "Software Engineer",
        company_name: "Dropbox",
        start_date: "2019-05",
        end_date: "2021-12",
        description: "Built sync engine components and file system reconciliation services.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/dropbox.com"
      }
    ],
    education: [
      {
        degree: "MS",
        field_of_study: "Computer Science",
        school_name: "Stanford University",
        start_date: "2017",
        end_date: "2019",
        description: "Specialization in distributed systems and databases",
        school_logo: "https://logo.clearbit.com/stanford.edu"
      },
      {
        degree: "BS",
        field_of_study: "Computer Science",
        school_name: "Stanford University",
        start_date: "2013",
        end_date: "2017",
        description: "Minor in Human-Computer Interaction",
        school_logo: "https://logo.clearbit.com/stanford.edu"
      }
    ]
  },
  {
    id: "profile-3",
    category: ["Startup Founder", "Alumni"],
    responded: true,
    responseDate: "2024-05-07",
    lastContactDate: "2024-05-02",
    message: "Hi Sara, I was excited to learn about your fintech startup journey after being in SEP Club together at USC. I'm working on a ML-powered financial product and would love to get your insights on the regulatory landscape you've navigated.",
    profile: {
      id: "sara-chen",
      name: "Sara Chen",
      location: "New York, NY",
      headline: "Founder & CEO at FinTech Innovations | YC W22 | USC Alum",
      description: "Founded FinTech Innovations to make financial services more accessible through AI and automation. YCombinator W22 batch. Previously investment banking at Goldman Sachs.",
      title: "Founder & CEO",
      profile_picture_url: "https://i.pravatar.cc/150?img=5",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Founder & CEO",
        company_name: "FinTech Innovations",
        start_date: "2021-09",
        end_date: "present",
        description: "Building an AI-powered platform that automates financial decision-making for small businesses. Raised $3.5M seed round after YC W22.",
        location: "New York, NY",
        company_logo: "https://logo.clearbit.com/fintech-innovations.io"
      },
      {
        title: "Investment Banking Analyst",
        company_name: "Goldman Sachs",
        start_date: "2019-06",
        end_date: "2021-08",
        description: "Worked in the Technology, Media & Telecommunications group, supporting M&A and IPO transactions.",
        location: "New York, NY",
        company_logo: "https://logo.clearbit.com/goldmansachs.com"
      }
    ],
    education: [
      {
        degree: "Bachelor of Science",
        field_of_study: "Business Administration",
        school_name: "University of Southern California",
        start_date: "2015",
        end_date: "2019",
        description: "Marshall School of Business, Concentration in Finance. Active in SEP Entrepreneurship Club.",
        school_logo: "https://logo.clearbit.com/usc.edu"
      }
    ]
  },
  {
    id: "profile-4",
    category: ["VC", "Alumni"],
    responded: false,
    lastContactDate: "2024-05-09",
    message: "Michael, I hope this message finds you well. As a fellow SEP Club member from USC, I've been following your career in venture capital with interest. I'm working on a new ML-powered platform and would value your perspective on the current funding landscape for AI startups.",
    profile: {
      id: "michael-rodriguez",
      name: "Michael Rodriguez",
      location: "Menlo Park, CA",
      headline: "VC Associate at Sequoia Capital | USC Alum | Early-stage Investor",
      description: "Investing in early-stage technology companies at Sequoia Capital, with a focus on AI/ML, enterprise SaaS, and consumer platforms. Former product manager and SEP Club president at USC.",
      title: "Associate",
      profile_picture_url: "https://i.pravatar.cc/150?img=3",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Associate",
        company_name: "Sequoia Capital",
        start_date: "2022-08",
        end_date: "present",
        description: "Source and evaluate early-stage investment opportunities in technology startups. Focus areas include AI/ML, enterprise SaaS, and consumer platforms.",
        location: "Menlo Park, CA",
        company_logo: "https://logo.clearbit.com/sequoiacap.com"
      },
      {
        title: "Product Manager",
        company_name: "Stripe",
        start_date: "2020-05",
        end_date: "2022-07",
        description: "Led product for Stripe Connect, working on marketplace payment solutions.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/stripe.com"
      }
    ],
    education: [
      {
        degree: "MBA",
        field_of_study: "Business Administration",
        school_name: "Harvard Business School",
        start_date: "2018",
        end_date: "2020",
        description: "Member of the Venture Capital & Private Equity Club, Tech Club",
        school_logo: "https://logo.clearbit.com/hbs.edu"
      },
      {
        degree: "Bachelor of Science",
        field_of_study: "Business Administration",
        school_name: "University of Southern California",
        start_date: "2014",
        end_date: "2018",
        description: "Marshall School of Business. President of SEP Entrepreneurship Club.",
        school_logo: "https://logo.clearbit.com/usc.edu"
      }
    ]
  },
  {
    id: "profile-5",
    category: ["Engineer", "Alumni"],
    responded: true,
    responseDate: "2024-05-15",
    lastContactDate: "2024-05-12",
    message: "Hi David, I noticed we both attended Stanford Design School, though a few years apart. I'm particularly impressed by your work on Apple's product design team. I'd love to learn more about how you approach combining design thinking with technology development.",
    profile: {
      id: "david-kim",
      name: "David Kim",
      location: "Cupertino, CA",
      headline: "Product Designer at Apple | Stanford d.school Alum",
      description: "Creating intuitive and beautiful experiences at Apple. I combine human-centered design with technology to build products that people love. Passionate about the intersection of hardware and software design.",
      title: "Senior Product Designer",
      profile_picture_url: "https://i.pravatar.cc/150?img=11",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Senior Product Designer",
        company_name: "Apple",
        start_date: "2021-04",
        end_date: "present",
        description: "Leading design for next-generation Apple products, focusing on the intersection of hardware and software experiences.",
        location: "Cupertino, CA",
        company_logo: "https://logo.clearbit.com/apple.com"
      },
      {
        title: "Product Designer",
        company_name: "Airbnb",
        start_date: "2018-07",
        end_date: "2021-03",
        description: "Designed key features for the Airbnb user experience across mobile and web platforms.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/airbnb.com"
      }
    ],
    education: [
      {
        degree: "Master of Fine Arts",
        field_of_study: "Design",
        school_name: "Stanford University",
        start_date: "2016",
        end_date: "2018",
        description: "Stanford d.school, focusing on interaction design and product innovation",
        school_logo: "https://logo.clearbit.com/stanford.edu"
      },
      {
        degree: "Bachelor of Arts",
        field_of_study: "Graphic Design",
        school_name: "Rhode Island School of Design",
        start_date: "2012",
        end_date: "2016",
        description: "Concentration in digital media",
        school_logo: "https://logo.clearbit.com/risd.edu"
      }
    ]
  },
  {
    id: "profile-6",
    category: ["Engineer", "Alumni"],
    responded: false,
    lastContactDate: "2024-05-01",
    message: "Hello Sophia, I came across your profile and was impressed by your work in reinforcement learning at OpenAI. I'm also working on ML projects and would love to connect and hear about your experience since winning LA Hacks 2022.",
    profile: {
      id: "sophia-williams",
      name: "Sophia Williams",
      location: "San Francisco, CA",
      headline: "Machine Learning Engineer at OpenAI | Reinforcement Learning | LA Hacks Winner",
      description: "Building the future of AI at OpenAI, specializing in reinforcement learning from human feedback. My work focuses on training language models to better align with human values and preferences.",
      title: "Machine Learning Engineer",
      profile_picture_url: "https://i.pravatar.cc/150?img=9",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Machine Learning Engineer",
        company_name: "OpenAI",
        start_date: "2022-06",
        end_date: "present",
        description: "Working on reinforcement learning from human feedback (RLHF) to train and align language models. Contributing to model alignment research.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/openai.com"
      },
      {
        title: "ML Research Intern",
        company_name: "Google Brain",
        start_date: "2021-05",
        end_date: "2022-05",
        description: "Researched multi-task reinforcement learning approaches for robot manipulation tasks.",
        location: "Mountain View, CA",
        company_logo: "https://logo.clearbit.com/google.com"
      }
    ],
    education: [
      {
        degree: "MS",
        field_of_study: "Computer Science",
        school_name: "University of California, Berkeley",
        start_date: "2020",
        end_date: "2022",
        description: "Focus on artificial intelligence and machine learning. Winner of LA Hacks 2022 with an AI project for accessibility.",
        school_logo: "https://logo.clearbit.com/berkeley.edu"
      },
      {
        degree: "BS",
        field_of_study: "Computer Science",
        school_name: "University of California, Los Angeles",
        start_date: "2016",
        end_date: "2020",
        description: "Minor in Cognitive Science",
        school_logo: "https://logo.clearbit.com/ucla.edu"
      }
    ]
  },
  {
    id: "profile-7",
    category: ["Product", "AI Researcher"],
    responded: true,
    responseDate: "2024-05-16",
    lastContactDate: "2024-05-14",
    message: "Dr. Park, I've been following your research at DeepMind on large language models. I read your recent NLP conference paper and was particularly intrigued by your approach to few-shot learning. Would you be open to discussing some research ideas in this area?",
    profile: {
      id: "lisa-park",
      name: "Dr. Lisa Park",
      location: "London, UK",
      headline: "Research Scientist at DeepMind | NLP & Large Language Models",
      description: "Research scientist working on large language models at DeepMind. My research focuses on improving few-shot learning, reasoning capabilities, and safety in large language models.",
      title: "Research Scientist",
      profile_picture_url: "https://i.pravatar.cc/150?img=23",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Research Scientist",
        company_name: "DeepMind",
        start_date: "2020-03",
        end_date: "present",
        description: "Leading research on large language models, focusing on few-shot learning, reasoning, and alignment. Published several papers at top NLP conferences.",
        location: "London, UK",
        company_logo: "https://logo.clearbit.com/deepmind.com"
      },
      {
        title: "Research Scientist",
        company_name: "Microsoft Research",
        start_date: "2018-01",
        end_date: "2020-02",
        description: "Researched natural language processing and neural language models.",
        location: "Cambridge, UK",
        company_logo: "https://logo.clearbit.com/microsoft.com"
      }
    ],
    education: [
      {
        degree: "PhD",
        field_of_study: "Computer Science",
        school_name: "Carnegie Mellon University",
        start_date: "2013",
        end_date: "2017",
        description: "Thesis on neural approaches to language understanding and generation",
        school_logo: "https://logo.clearbit.com/cmu.edu"
      },
      {
        degree: "BS",
        field_of_study: "Computer Science and Mathematics",
        school_name: "MIT",
        start_date: "2009",
        end_date: "2013",
        description: "Graduated with honors",
        school_logo: "https://logo.clearbit.com/mit.edu"
      }
    ]
  },
  {
    id: "profile-8",
    category: ["Tech Recruiter"],
    responded: false,
    lastContactDate: "2024-05-15",
    message: "Hi Chris, I noticed you're a Talent Partner at Andreessen Horowitz helping portfolio companies with technical talent. I'm a software engineer with experience in ML and web development, and I'd love to learn more about the types of roles you're currently helping portfolio companies fill.",
    profile: {
      id: "chris-johnson",
      name: "Chris Johnson",
      location: "Menlo Park, CA",
      headline: "Talent Partner at Andreessen Horowitz | Connecting Top Tech Talent with Startups",
      description: "I help a16z portfolio companies build world-class technical teams. Specializing in engineering, product, and data science roles for early to mid-stage startups.",
      title: "Talent Partner",
      profile_picture_url: "https://i.pravatar.cc/150?img=30",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Talent Partner",
        company_name: "Andreessen Horowitz",
        start_date: "2021-01",
        end_date: "present",
        description: "Support a16z portfolio companies with talent strategy and executive recruiting. Focus on engineering, product, and data science roles.",
        location: "Menlo Park, CA",
        company_logo: "https://logo.clearbit.com/a16z.com"
      },
      {
        title: "Technical Recruiter",
        company_name: "Facebook",
        start_date: "2017-03",
        end_date: "2020-12",
        description: "Led technical recruiting for infrastructure and ML engineering teams.",
        location: "Menlo Park, CA",
        company_logo: "https://logo.clearbit.com/facebook.com"
      }
    ],
    education: [
      {
        degree: "Bachelor of Arts",
        field_of_study: "Business Administration",
        school_name: "University of Michigan",
        start_date: "2013",
        end_date: "2017",
        description: "Concentration in Organizational Studies",
        school_logo: "https://logo.clearbit.com/umich.edu"
      }
    ]
  },
  {
    id: "profile-9",
    category: ["Engineer", "SF Tech Scene"],
    responded: true,
    responseDate: "2024-05-04",
    lastContactDate: "2024-05-03",
    message: "Hello Olivia, it was great meeting you at the React meetup in SF last month. I've been following your work on Airbnb's design systems and would love to chat more about component architecture and design tokens. Are you free for a virtual coffee sometime next week?",
    profile: {
      id: "olivia-smith",
      name: "Olivia Smith",
      location: "San Francisco, CA",
      headline: "Frontend Engineer at Airbnb | Design Systems | React",
      description: "Building scalable design systems at Airbnb. I focus on creating component libraries and design tokens that enable consistent, accessible user experiences across Airbnb's web platform.",
      title: "Senior Frontend Engineer",
      profile_picture_url: "https://i.pravatar.cc/150?img=29",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Senior Frontend Engineer",
        company_name: "Airbnb",
        start_date: "2020-07",
        end_date: "present",
        description: "Leading development on Airbnb's design system. Building reusable React components and implementing design tokens for consistent UX.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/airbnb.com"
      },
      {
        title: "Frontend Engineer",
        company_name: "Lyft",
        start_date: "2018-02",
        end_date: "2020-06",
        description: "Worked on rider-facing web applications using React and TypeScript.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/lyft.com"
      }
    ],
    education: [
      {
        degree: "Bachelor of Science",
        field_of_study: "Computer Science",
        school_name: "University of California, Santa Barbara",
        start_date: "2014",
        end_date: "2018",
        description: "Focus on human-computer interaction",
        school_logo: "https://logo.clearbit.com/ucsb.edu"
      }
    ]
  },
  {
    id: "profile-10",
    category: ["Engineer", "SF Tech Scene"],
    responded: false,
    lastContactDate: "2024-05-07",
    message: "Hi Ethan, we connected at SF TechWeek last month, and I wanted to follow up. I'm particularly interested in your experience leading engineering teams at Stripe. I'm currently scaling my own team and would value any insights you might have on managing technical growth while maintaining code quality.",
    profile: {
      id: "ethan-brown",
      name: "Ethan Brown",
      location: "San Francisco, CA",
      headline: "Engineering Director at Stripe | Distributed Systems | Engineering Leadership",
      description: "Leading engineering teams that build financial infrastructure at Stripe. Passionate about distributed systems, engineering excellence, and building inclusive teams that deliver impactful products.",
      title: "Engineering Director",
      profile_picture_url: "https://i.pravatar.cc/150?img=50",
      linkedin_url: "https://linkedin.com/in/example"
    },
    experience: [
      {
        title: "Engineering Director",
        company_name: "Stripe",
        start_date: "2021-03",
        end_date: "present",
        description: "Leading multiple engineering teams working on Stripe's core payment processing infrastructure. Responsible for technical strategy, team growth, and delivering reliable systems at scale.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/stripe.com"
      },
      {
        title: "Engineering Manager",
        company_name: "Stripe",
        start_date: "2019-01",
        end_date: "2021-02",
        description: "Managed the Payments API team, focusing on developer experience and API reliability.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/stripe.com"
      },
      {
        title: "Senior Software Engineer",
        company_name: "Square",
        start_date: "2016-05",
        end_date: "2018-12",
        description: "Built payment processing systems and merchant-facing APIs.",
        location: "San Francisco, CA",
        company_logo: "https://logo.clearbit.com/squareup.com"
      }
    ],
    education: [
      {
        degree: "Master of Science",
        field_of_study: "Computer Science",
        school_name: "University of Washington",
        start_date: "2014",
        end_date: "2016",
        description: "Specialization in distributed systems",
        school_logo: "https://logo.clearbit.com/washington.edu"
      },
      {
        degree: "Bachelor of Science",
        field_of_study: "Computer Engineering",
        school_name: "Carnegie Mellon University",
        start_date: "2010",
        end_date: "2014",
        description: "Minor in Business Administration",
        school_logo: "https://logo.clearbit.com/cmu.edu"
      }
    ]
  }
];

export const outreachMetrics = {
  weeklyTarget: 15,
  totalSent: 67,
  sentThisWeek: 10,
  totalResponses: 28,
  responseRate: 41.8,
};

export const uniqueCompanies = Array.from(
  new Set(mockProfiles.map(profile => profile.experience[0].company_name))
);
