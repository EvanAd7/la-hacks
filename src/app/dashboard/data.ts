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
    category: ["UX Designer", "Student"],
    responded: false,
    lastContactDate: "2024-05-15",
    message: "Hi Aastha, I was impressed by your work in UX design and your background in Computer Science. I'd love to connect and learn more about how you blend computer science, psychology, and public interest technology.",
    profile: {
      id: "131444453",
      name: "Aastha Agrawal",
      location: "Amherst, Massachusetts, United States",
      headline: "UX Designer | Senior @ UMass Amherst | Blending Computer Science, Psychology, and Public Interest Technology for Human-Centered Innovation",
      description: "Student with a diverse skillset spanning UX design, content writing, and software analysis.",
      title: "Content Writer",
      profile_picture_url: "https://media.licdn.com/dms/image/v2/D4E03AQH_UjEZBM5DHA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1696020970004?e=1749081600&v=beta&t=Mez9NAd-fvuTg5WhhMssls7qih2UpyyXL_t_ruw3hFc",
      linkedin_url: "https://www.linkedin.com/in/ACwAADgc3YkBqX5szAW_eibh7JS09IRztrHdV5M"
    },
    experience: [
      {
        title: "UI/UX Designer & Product Manager",
        company_name: "BUILD UMass",
        start_date: "2024-11",
        end_date: "present",
        description: "Designing user interfaces and managing product development for BUILD UMass projects.",
        location: "Amherst, Massachusetts, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/C4D0BAQEOOjB5evIbRA/company-logo_400_400/company-logo_400_400/0/1630469396055/buildumass_logo?e=1749081600&v=beta&t=-zIbDB3cc-IWH14J8og5OpXYFpvnlTBS6WHwuwSOrng"
      },
      {
        title: "Software Analyst",
        company_name: "Amicus Global Inc.",
        start_date: "2024-05",
        end_date: "2024-08",
        description: "Designed, built, tested, and deployed the Laboratory Information Management System (LIMS). Collaborated with stakeholders to gather requirements and ensure alignment with business objectives.",
        location: "Maryland, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/C4E0BAQHArIEflWTVDA/company-logo_400_400/company-logo_400_400/0/1630614334466/amicus_technology_logo?e=1749081600&v=beta&t=tdbnGtNpGkiUphQcna_n74l7aog1cOwJ5_3jfFzA0Rc"
      },
      {
        title: "Founder & President",
        company_name: "Public Interest Technology",
        start_date: "2022-09",
        end_date: "present",
        description: "Founded and leading a technology initiative focused on public interest applications at UMass Amherst.",
        location: "University of Massachusetts Amherst",
        company_logo: "https://media.licdn.com/dms/image/v2/D560BAQHo8iIYFyU20Q/company-logo_400_400/company-logo_400_400/0/1726176765479/public_interest_technology_logo?e=1749081600&v=beta&t=_pUy6MDhg01q63pdOnLEBAGASfkO6cWQjXgdQ7F1KwM"
      }
    ],
    education: [
      {
        degree: "Bachelor of Science - BS",
        field_of_study: "Major: Computer Science, Minor: Psychology, Certificate: Public Interest Technology",
        school_name: "University of Massachusetts Amherst",
        start_date: "2021",
        end_date: "2025",
        description: "Combining computer science with psychology and public interest technology to create human-centered solutions.",
        school_logo: "https://media.licdn.com/dms/image/v2/D4E0BAQFCzmsrZannXw/company-logo_400_400/company-logo_400_400/0/1680271203107/umassamherst_logo?e=1749686400&v=beta&t=xdgC1WUvjIH4hFneG6DxDN1V2kCPLsnW0g71I2l5PU0"
      }
    ]
  },
  {
    id: "profile-2",
    category: ["Product Manager", "Tech Professional"],
    responded: true,
    responseDate: "2024-05-10",
    lastContactDate: "2024-05-05",
    message: "Hello Alex, I'm impressed by your product management experience at noon and your background in computer science. I'd love to hear about your transition from software engineering to product management.",
    profile: {
      id: "168388709",
      name: "Alex Ko",
      location: "Dubai, United Arab Emirates",
      headline: "Product Manager 1 at Namshi | noon",
      description: "Product manager with a strong technical background in software engineering and UI/UX design.",
      title: "Product Manager 1",
      profile_picture_url: "https://media.licdn.com/dms/image/v2/D4D03AQFIos4aNwuaqg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1685181790219?e=1745452800&v=beta&t=MY6ros7Z1GEhyM8Oif95LeNePyD6cA9LoevFKmDwUu8",
      linkedin_url: "https://www.linkedin.com/in/ACwAAC-w8nwBerWHl3vU0YA9BYBxkPJZYCPNGr0"
    },
    experience: [
      {
        title: "Product Manager 1",
        company_name: "noon",
        start_date: "2024-01",
        end_date: "present",
        description: "Discovery at Namshi (acquired by noon)",
        location: "Dubai, United Arab Emirates",
        company_logo: "https://media.licdn.com/dms/image/v2/C510BAQHuVrAgR-7UBA/company-logo_400_400/company-logo_400_400/0/1630597270656/nooncom_logo?e=1749686400&v=beta&t=2_N8w0cPOV8UiPLa5GGi6PRXqoASyDblKYb4ENfEZQY"
      },
      {
        title: "Software Engineering Intern",
        company_name: "Endex",
        start_date: "2022-06",
        end_date: "2022-08",
        description: "Improved Hi-Fidelity prototypes for the Endex app on Figma and proposed UX/UI changes for our Private Beta Release. Built and deployed iOS app screens with Flutter.",
        location: "New York, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/C4D0BAQE7nGj0OKN7qQ/company-logo_400_400/company-logo_400_400/0/1632189639688/endexapp_logo?e=1749081600&v=beta&t=I9KZ_vxA_qdFDjJHMe5llobQoNZc91bb8mi3HsL-Zx4"
      },
      {
        title: "Strategic Communications and Web Development Intern",
        company_name: "AI for Good Foundation",
        start_date: "2021-02",
        end_date: "2021-04",
        description: "Designed and monitored social media fundraising campaigns and researched articles about AI for consistent new web content. Assisted with interactive website development.",
        location: "Berkeley, California, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/C560BAQG2P5GN9rQfNg/company-logo_400_400/company-logo_400_400/0/1670278941905/ai_for_good_foundation_logo?e=1749686400&v=beta&t=5fE_up0Y527Gu5WiyTUR0AeE8ZHk7M4CnOPYKBkC2ns"
      }
    ],
    education: [
      {
        degree: "Bachelor's degree",
        field_of_study: "Computer Science",
        school_name: "New York University Abu Dhabi",
        start_date: "2019",
        end_date: "2023",
        description: "Computer Science degree with focus on software engineering and product development.",
        school_logo: "https://media.licdn.com/dms/image/v2/C4D0BAQEr7NDNythPxw/company-logo_400_400/company-logo_400_400/0/1631314170855?e=1749686400&v=beta&t=RCX-VRu1R-J-Nc5CKFyaCoQRqLULBvQvQy4ugj6WuHw"
      }
    ]
  },
  {
    id: "profile-3",
    category: ["Tech PM", "Computer Science Professional"],
    responded: false,
    lastContactDate: "2024-05-03",
    message: "Hi Roberta, your combination of computer science expertise and product management experience is impressive. I'd love to connect and learn about your journey from systems analyst to product leadership.",
    profile: {
      id: "3172698",
      name: "Roberta Ältermann",
      location: "São Paulo, São Paulo, Brazil",
      headline: "Tech | Product Manager | MSc. in Computer Science USP | Mathematics | MBA | Cloud ☁️",
      description: "Experienced product leader with a strong technical background in computer science and systems engineering.",
      title: "Product Manager FinOps & Painel MultiCloud",
      profile_picture_url: "https://media.licdn.com/dms/image/v2/D4D03AQGeSXS8pDZGJA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1708722937683?e=1741219200&v=beta&t=ew9f3tD6vTduAtqYz3ysPvFzyqLrIwleL2lVBZ4JUA0",
      linkedin_url: "https://www.linkedin.com/in/ACwAAADd9H4B2x33GGwSFZZKSMaBXjp1voi13bA"
    },
    experience: [
      {
        title: "Product Manager FinOps & Painel MultiCloud",
        company_name: "Claro Brasil",
        start_date: "2020-02",
        end_date: "present",
        description: "Leading product strategy and development for FinOps and cloud management solutions.",
        location: "São Paulo, Brazil",
        company_logo: "https://media.licdn.com/dms/image/v2/C4D0BAQH2gEZpU9Oy5Q/company-logo_400_400/company-logo_400_400/0/1630559270452/clarobrasil_logo?e=1749686400&v=beta&t=vJEC2jUjx9_cLSHmfx1aHllcB7n4oFYLJ8q1CgEPmj4"
      },
      {
        title: "Head Of Product | Agile",
        company_name: "Beleza na Web | Largest Cosmetic e-Tailer in Brazil",
        start_date: "2017-07",
        end_date: "2020-01",
        description: "Led product strategy and development for Brazil's largest cosmetics e-commerce platform using Agile methodologies.",
        location: "São Paulo, Brazil",
        company_logo: "https://media.licdn.com/dms/image/v2/C4E0BAQEzyqKD3VpxxQ/company-logo_400_400/company-logo_400_400/0/1656592053215/beleza_na_web_logo?e=1749686400&v=beta&t=pNbLKmI2ka0YHqbJJRj1ieQSnp2mrAFXokpgNw4z6FQ"
      },
      {
        title: "Group Product Manager",
        company_name: "Beleza na Web | Largest Cosmetic e-Tailer in Brazil",
        start_date: "2016-08",
        end_date: "2017-07",
        description: "Managed product development teams and initiatives for e-commerce platform enhancements.",
        location: "São Paulo, Brazil",
        company_logo: "https://media.licdn.com/dms/image/v2/C4E0BAQEzyqKD3VpxxQ/company-logo_400_400/company-logo_400_400/0/1656592053215/beleza_na_web_logo?e=1749686400&v=beta&t=pNbLKmI2ka0YHqbJJRj1ieQSnp2mrAFXokpgNw4z6FQ"
      }
    ],
    education: [
      {
        degree: "MSc",
        field_of_study: "Computer Science",
        school_name: "Instituto de Matemática e Estatística - Universidade de São Paulo (IME-USP)",
        start_date: "2004",
        end_date: "2007",
        description: "Research focus on computer science principles and applications.",
        school_logo: "https://media.licdn.com/dms/image/v2/C4D0BAQHcV9q3HlLtvg/company-logo_400_400/company-logo_400_400/0/1659061684351/instituto_de_matemtica_e_estatstica_universidade_de_so_paulo_ime_usp_logo?e=1749686400&v=beta&t=D75qqqiF7DVcKMGNgJLAMIaJP8_ur19mxI4WjqSIazE"
      },
      {
        degree: "Mathematics",
        field_of_study: "Mathematics",
        school_name: "Instituto de Matemática e Estatística - Universidade de São Paulo (IME-USP)",
        start_date: "1999",
        end_date: "2002",
        description: "Foundation in mathematical theory and applications.",
        school_logo: "https://media.licdn.com/dms/image/v2/C4D0BAQHcV9q3HlLtvg/company-logo_400_400/company-logo_400_400/0/1659061684351/instituto_de_matemtica_e_estatstica_universidade_de_so_paulo_ime_usp_logo?e=1749686400&v=beta&t=D75qqqiF7DVcKMGNgJLAMIaJP8_ur19mxI4WjqSIazE"
      }
    ]
  },
  {
    id: "profile-4",
    category: ["Product Manager", "Tech Professional"],
    responded: true,
    responseDate: "2024-04-20",
    lastContactDate: "2024-04-15",
    message: "Hi Miguel, your experience as a product manager at Juniper Networks caught my attention. I'd appreciate learning about your path from engineering to product management in the tech industry.",
    profile: {
      id: "141395727",
      name: "Miguel Gomez",
      location: "Madrid, Community of Madrid, Spain",
      headline: "Project Manager at Juniper Networks",
      description: "Product manager with a strong background in telecommunications engineering and technical marketing.",
      title: "Product Manager",
      profile_picture_url: "https://media.licdn.com/dms/image/v2/C4E03AQHeyLMmhM8RaQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1517526421825?e=1744848000&v=beta&t=Thnttj8oII6Xhplqh--1rT8CPQNdSB4MfxgTDp4F6uQ",
      linkedin_url: "https://www.linkedin.com/in/ACwAABPLQaQBiJ0F5j3frCsoNbGZDtnnRPOLWos"
    },
    experience: [
      {
        title: "Product Manager",
        company_name: "Juniper Networks",
        start_date: "2021-01",
        end_date: "present",
        description: "Leading product strategy and development initiatives for networking solutions.",
        location: "Community of Madrid, Spain",
        company_logo: "https://media.licdn.com/dms/image/v2/D560BAQHs1l2oz4krEw/company-logo_400_400/company-logo_400_400/0/1686866548188/juniper_networks_logo?e=1749686400&v=beta&t=vWj_GVVoUmervNv1jDokk3mIOehFzxs-uDeTQf8RWuo"
      },
      {
        title: "Technical Marketing Engineer",
        company_name: "Juniper Networks",
        start_date: "2020-10",
        end_date: "2021-01",
        description: "Created technical marketing materials and strategies to showcase product capabilities and features.",
        location: "Barajas, Madrid, Comunidad de Madrid, España",
        company_logo: "https://media.licdn.com/dms/image/v2/D560BAQHs1l2oz4krEw/company-logo_400_400/company-logo_400_400/0/1686866548188/juniper_networks_logo?e=1749686400&v=beta&t=vWj_GVVoUmervNv1jDokk3mIOehFzxs-uDeTQf8RWuo"
      },
      {
        title: "Technical Product Manager",
        company_name: "Netrounds",
        start_date: "2019-12",
        end_date: "2020-10",
        description: "Managed technical aspects of product development and market fit for network testing solutions.",
        location: "Madrid, Community of Madrid, Spain",
        company_logo: "https://media.licdn.com/dms/image/v2/C510BAQE-HloG3zbASA/company-logo_400_400/company-logo_400_400/0/1631311197951?e=1748476800&v=beta&t=b_qCScRxh4xDdxOr-g7JtobKeqx3Csxk_yfP9QCEI0Y"
      }
    ],
    education: [
      {
        degree: "Master of Science (MSc) Telecomunications Engineering",
        field_of_study: "Computer Science",
        school_name: "Universidad Politécnica de Madrid",
        start_date: "2006",
        end_date: "2012",
        description: "Specialized in telecommunications engineering with focus on computer science applications.",
        school_logo: "https://media.licdn.com/dms/image/v2/D4D0BAQHJPlcA68PA2Q/company-logo_400_400/company-logo_400_400/0/1686904766811/universidad_politecnica_de_madrid_logo?e=1749686400&v=beta&t=PBTdqV5NAETJGk4SqjamkQbJCns4_J9adCdUj1aNXWg"
      }
    ]
  },
  {
    id: "profile-5",
    category: ["Program Manager", "Scrum Master"],
    responded: false,
    lastContactDate: "2024-04-10",
    message: "Hello Charles, your experience as a Scrum Master and Product Owner caught my attention. I'm interested in learning more about your approach to agile product development and team leadership.",
    profile: {
      id: "151175973",
      name: "Charles Crandall",
      location: "Ellicott City, Maryland, United States",
      headline: "Scrum Master / Agile Project Manager / Product Owner",
      description: "Experienced agile practitioner with expertise in Scrum, product ownership, and technical program management.",
      title: "Scrum Master",
      profile_picture_url: "https://media.licdn.com/dms/image/v2/D4E03AQHNdFDjQv_7iA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1706102196299?e=1744848000&v=beta&t=I6XJHFiHqpzhFw9lMe2DI9KdpnW0Nyp8rtJ7lIVzZls",
      linkedin_url: "https://www.linkedin.com/in/ACwAAAFodC0BKyrh8DdKOc-D_us0kv-xurZ5Qnc"
    },
    experience: [
      {
        title: "Scrum Master",
        company_name: "Jack Henry & Associates",
        start_date: "2024-02",
        end_date: "present",
        description: "Working with a great team to develop the next generation of check imaging software for regional banks and credit unions.",
        location: "Baltimore metropolitan area, Maryland, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/C4E0BAQEbosvo87NZ-Q/company-logo_400_400/company-logo_400_400/0/1659316229997/jack_henry__associates_logo?e=1749686400&v=beta&t=5lPdIfeX1jLnSoKhhgv_sWPJA6MecJqRyX1eVBeqvGY"
      },
      {
        title: "Product Owner, Acumen Source",
        company_name: "Allegis Global Solutions",
        start_date: "2022-03",
        end_date: "2023-10",
        description: "Responsible for the ongoing development and vision for the Acumen Source product. Managed transformation from on/near-shore to off-shore development team.",
        location: "Hanover, Maryland, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/D4E0BAQFxjdppnHCViA/company-logo_400_400/company-logo_400_400/0/1720196577923/allegis_global_solutions_logo?e=1749686400&v=beta&t=FjDHW7sc1-M-4Gr6hq51oySJCm664vynoh0r7ZwqWKo"
      },
      {
        title: "Technical Program Manager",
        company_name: "Allegis Global Solutions",
        start_date: "2018-11",
        end_date: "2022-03",
        description: "Operated as overall Technical Manager for the Acumen Source program. Responsible for Scrum Master duties as well as budget and overall program management.",
        location: "Hanover, Maryland, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/D4E0BAQFxjdppnHCViA/company-logo_400_400/company-logo_400_400/0/1720196577923/allegis_global_solutions_logo?e=1749686400&v=beta&t=FjDHW7sc1-M-4Gr6hq51oySJCm664vynoh0r7ZwqWKo"
      }
    ],
    education: [
      {
        degree: "Bachelor of Science - BS",
        field_of_study: "Computer Science",
        school_name: "University of Maryland Global Campus",
        start_date: "1980",
        end_date: "1986",
        description: "Computer Science degree with focus on software development and systems analysis.",
        school_logo: "https://media.licdn.com/dms/image/v2/C4E0BAQE7DmPl0TeYKQ/company-logo_400_400/company-logo_400_400/0/1630610225890/university_of_maryland_global_campus_logo?e=1749686400&v=beta&t=wGYGdZOWzQUzDH0KwondHHeYFbiWn96OKgGyybzrI3k"
      }
    ]
  },
  {
    id: "profile-6",
    category: ["Tech Manager", "Program Management"],
    responded: true,
    responseDate: "2024-04-05",
    lastContactDate: "2024-04-01",
    message: "Hi Balaji, your experience as a product manager and consulting expert is impressive. I'd love to learn more about your work in program management and how you've applied your computer science background throughout your career.",
    profile: {
      id: "75544124",
      name: "Balaji Rajamani",
      location: "Chantilly, Virginia, United States",
      headline: "Manager Consulting Expert",
      description: "Experienced program management professional with expertise in product management and technical implementation.",
      title: "Senior Program Management Analyst, PMO, Office of the Chief Information Officer (OCIO)",
      profile_picture_url: "https://media.licdn.com/dms/image/v2/D4E03AQH7q_BWLdTLHA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1715697553264?e=1746057600&v=beta&t=cCbgJS3o0BK_IGCwIZGDLKC2bk72pF5LBN5k43ExORQ",
      linkedin_url: "https://www.linkedin.com/in/ACwAAAAO1bkBjuXtKOMd7kga28GsVY1js8T3T6A"
    },
    experience: [
      {
        title: "Manager Consulting Expert",
        company_name: "CGI",
        start_date: "2024-07",
        end_date: "present",
        description: "Providing expert consulting services in program management and technology implementation.",
        location: "Arlington, Virginia, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/C4E0BAQErzXWSFkn9tQ/company-logo_400_400/company-logo_400_400/0/1663664110809/cgi_logo?e=1749686400&v=beta&t=TMciUGVKa4PsYzqWKPFSsVJaCSon-taBjQ3R420kkws"
      },
      {
        title: "Senior Program Management Analyst, PMO, Office of the Chief Information Officer (OCIO)",
        company_name: "Cybersecurity and Infrastructure Security Agency",
        start_date: "2024-07",
        end_date: "present",
        description: "Leading program management initiatives within the Office of the Chief Information Officer.",
        location: "Arlington, Virginia, United States",
        company_logo: "https://media.licdn.com/dms/image/v2/C560BAQHqZkwy_9qfLg/company-logo_400_400/company-logo_400_400/0/1657640157247/cisagov_logo?e=1749686400&v=beta&t=Dq6Mgiu747odxiHCbpxkoPWgC03akBASP20SprK8n68"
      },
      {
        title: "Product Manager",
        company_name: "Duck Creek Technologies (formerly Agencyport Software)",
        start_date: "2003",
        end_date: "2007-12",
        description: "Managed product development and implementation strategies for insurance technology solutions.",
        location: "Boston area",
        company_logo: ""
      }
    ],
    education: [
      {
        degree: "B.E",
        field_of_study: "Computer Science and Engineering",
        school_name: "Bharathidasan University",
        start_date: "1985",
        end_date: "1989",
        description: "Foundational education in computer science and engineering principles.",
        school_logo: ""
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
