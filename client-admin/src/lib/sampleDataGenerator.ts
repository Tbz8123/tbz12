/**
 * Sample Data Generator for Template Testing
 * Generates realistic sample resume data with configurable quantities
 */

export interface SampleDataConfig {
  experienceCount: number;
  educationCount: number;
  skillsCount: number;
  includeCertifications?: boolean;
  includeLanguages?: boolean;
  includeCustomSections?: boolean;
}

const sampleExperiences = [
  {
    id: '1',
    company: "Tech Solutions Inc.",
    position: "Senior Software Engineer",
    location: "San Francisco, CA",
    startDate: "2021-01",
    endDate: "Present",
    description: "• Led development of scalable web applications serving 100k+ users\n• Implemented microservices architecture reducing system latency by 40%\n• Mentored junior developers and conducted code reviews\n• Collaborated with cross-functional teams to deliver features on time"
  },
  {
    id: '2',
    company: "Digital Innovations LLC",
    position: "Full Stack Developer",
    location: "New York, NY",
    startDate: "2019-03",
    endDate: "2020-12",
    description: "• Built responsive web applications using React and Node.js\n• Optimized database queries improving performance by 35%\n• Integrated third-party APIs and payment processing systems\n• Participated in agile development processes and sprint planning"
  },
  {
    id: '3',
    company: "StartupXYZ",
    position: "Frontend Developer",
    location: "Austin, TX",
    startDate: "2017-06",
    endDate: "2019-02",
    description: "• Developed user interfaces for mobile and web applications\n• Implemented responsive design principles for cross-device compatibility\n• Collaborated with UX designers to create intuitive user experiences\n• Maintained and improved existing codebase with 95% test coverage"
  },
  {
    id: '4',
    company: "Creative Agency Pro",
    position: "Web Developer Intern",
    location: "Los Angeles, CA",
    startDate: "2016-09",
    endDate: "2017-05",
    description: "• Created landing pages and marketing websites for clients\n• Learned modern web development frameworks and best practices\n• Assisted senior developers with debugging and testing\n• Contributed to team projects and client presentations"
  },
  {
    id: '5',
    company: "Global Corp",
    position: "Software Developer",
    location: "Seattle, WA",
    startDate: "2020-01",
    endDate: "2021-08",
    description: "• Developed enterprise software solutions for Fortune 500 clients\n• Implemented automated testing frameworks reducing bugs by 50%\n• Worked with cloud technologies including AWS and Azure\n• Participated in architecture design and technical decision making"
  }
];

const sampleEducation = [
  {
    id: '1',
    school: "Stanford University",
    degree: "Master of Science in Computer Science",
    location: "Stanford, CA",
    startDate: "2015",
    endDate: "2017",
    graduationDate: "2017",
    description: "Specialized in Machine Learning and Artificial Intelligence. Completed thesis on neural network optimization."
  },
  {
    id: '2',
    school: "University of California, Berkeley",
    degree: "Bachelor of Science in Computer Science",
    location: "Berkeley, CA",
    startDate: "2011",
    endDate: "2015",
    graduationDate: "2015",
    description: "Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems."
  },
  {
    id: '3',
    school: "MIT",
    degree: "Bachelor of Engineering in Software Engineering",
    location: "Cambridge, MA",
    startDate: "2012",
    endDate: "2016",
    graduationDate: "2016",
    description: "Dean's List for 6 semesters. Senior project focused on distributed systems and cloud computing."
  },
  {
    id: '4',
    school: "Carnegie Mellon University",
    degree: "Master of Information Systems",
    location: "Pittsburgh, PA",
    startDate: "2016",
    endDate: "2018",
    graduationDate: "2018",
    description: "Focus on cybersecurity and data analytics. Completed capstone project on blockchain technology."
  }
];

const sampleSkills = [
  { id: '1', name: "JavaScript", level: "Expert" },
  { id: '2', name: "React", level: "Advanced" },
  { id: '3', name: "Node.js", level: "Advanced" },
  { id: '4', name: "Python", level: "Intermediate" },
  { id: '5', name: "TypeScript", level: "Advanced" },
  { id: '6', name: "SQL", level: "Intermediate" },
  { id: '7', name: "AWS", level: "Intermediate" },
  { id: '8', name: "Docker", level: "Intermediate" },
  { id: '9', name: "Git", level: "Expert" },
  { id: '10', name: "MongoDB", level: "Intermediate" },
  { id: '11', name: "Vue.js", level: "Intermediate" },
  { id: '12', name: "Angular", level: "Beginner" },
  { id: '13', name: "GraphQL", level: "Intermediate" },
  { id: '14', name: "Redis", level: "Beginner" },
  { id: '15', name: "Kubernetes", level: "Beginner" }
];

const sampleCertifications = [
  {
    id: '1',
    name: "AWS Certified Solutions Architect",
    issuingOrganization: "Amazon Web Services",
    date: "2023",
    credentialId: "AWS-SAA-2023-001"
  },
  {
    id: '2',
    name: "Google Cloud Professional Developer",
    issuingOrganization: "Google Cloud",
    date: "2022",
    credentialId: "GCP-PD-2022-002"
  },
  {
    id: '3',
    name: "Certified Kubernetes Administrator",
    issuingOrganization: "Cloud Native Computing Foundation",
    date: "2023",
    credentialId: "CKA-2023-003"
  },
  {
    id: '4',
    name: "Microsoft Azure Developer Associate",
    issuingOrganization: "Microsoft",
    date: "2022",
    credentialId: "AZ-204-2022-004"
  }
];

const sampleLanguages = [
  { name: "English", proficiency: "Native" },
  { name: "Spanish", proficiency: "Professional" },
  { name: "French", proficiency: "Conversational" },
  { name: "German", proficiency: "Basic" },
  { name: "Mandarin", proficiency: "Conversational" }
];

const sampleCustomSections = [
  {
    title: "Projects",
    content: "• E-commerce Platform: Built a full-stack e-commerce solution with React and Node.js\n• Task Management App: Developed a collaborative task management application\n• Data Visualization Tool: Created interactive dashboards using D3.js and Python",
    placement: "main"
  },
  {
    title: "Achievements",
    content: "• Employee of the Month (3 times)\n• Led team that won company hackathon\n• Published technical article with 10k+ views\n• Speaker at 2 tech conferences",
    placement: "main"
  },
  {
    title: "Interests",
    content: "Technology, Open Source, Machine Learning, Photography, Hiking, Chess",
    placement: "sidebar"
  }
];

export const generateSampleData = (config: SampleDataConfig) => {
  const {
    experienceCount,
    educationCount,
    skillsCount,
    includeCertifications = true,
    includeLanguages = true,
    includeCustomSections = true
  } = config;

  return {
    personalInfo: {
      firstName: "John",
      lastName: "Smith",
      title: "Senior Software Engineer",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, San Francisco, CA 94105",
      summary: "Experienced software engineer with 5+ years of expertise in full-stack development, cloud technologies, and team leadership. Proven track record of delivering scalable solutions that serve thousands of users while maintaining high code quality and performance standards. Passionate about emerging technologies and continuous learning.",
      contactDetails: {
        linkedin: "linkedin.com/in/johnsmith",
        website: "www.johnsmith.dev",
        github: "github.com/johnsmith"
      }
    },
    experience: sampleExperiences.slice(0, experienceCount),
    education: sampleEducation.slice(0, educationCount),
    skills: sampleSkills.slice(0, skillsCount),
    certifications: includeCertifications ? sampleCertifications.slice(0, 3) : [],
    languages: includeLanguages ? sampleLanguages.slice(0, 3) : [],
    customSections: includeCustomSections ? sampleCustomSections.slice(0, 2) : [],
    customization: {
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#60a5fa',
        text: '#111827',
        background: '#ffffff'
      }
    }
  };
};

export const getDefaultSampleConfig = (): SampleDataConfig => ({
  experienceCount: 3,
  educationCount: 2,
  skillsCount: 8,
  includeCertifications: true,
  includeLanguages: true,
  includeCustomSections: true
});

export const getMinimalSampleConfig = (): SampleDataConfig => ({
  experienceCount: 1,
  educationCount: 1,
  skillsCount: 5,
  includeCertifications: false,
  includeLanguages: false,
  includeCustomSections: false
});

export const getMaximalSampleConfig = (): SampleDataConfig => ({
  experienceCount: 5,
  educationCount: 4,
  skillsCount: 15,
  includeCertifications: true,
  includeLanguages: true,
  includeCustomSections: true
});