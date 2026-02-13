import { Project, Experience, Skill } from './types';

export const RESUME_DATA = {
  name: "Nitin Jangid",
  role: "Full Stack Engineer",
  about: "Full Stack Engineer specializing in building high-performance web applications and scalable backend systems. Proficient in the MERN stack, Next.js, NestJS, and Microservices architecture. I thrive on transforming complex requirements into clean, maintainable code and delivering seamless user experiences. Driven by curiosity and a commitment to continuous learning, I bring a problem-solving mindset and attention to detail to every project.",
  location: "Pune, India",
  avatar: "https://github.com/OFFICIALNITIN.png",
  email: "dev.nitinjangid@gmail.com",
  phone: "+91-7841983995",
  linkedin: "https://linkedin.com/in/nitin-jangid-ba771726b",
  github: "https://github.com/OFFICIALNITIN"
};

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "MockMate - AI Interview Platform",
    description: "A full-stack AI-driven mock interview platform enabling real-time one-to-one interview sessions using WebRTC. Features include a Profile Builder, skills assessment, and automated Gemini AI feedback for personalized improvement recommendations.",
    tags: ["MERN Stack", "WebRTC", "Gemini AI", "JWT", "Socket.io"],
    image: "/mock-mate.png",
    link: "https://mock-mate-topaz.vercel.app",
    github: "https://github.com/OFFICIALNITIN/MockMate"
  },
  {
    id: "2",
    title: "Nutriguard Web App",
    description: "Hackathon-winning (5th Rank) role-based platform for tracking child malnutrition. Integrated Mapbox for location tracking, automated reporting workflows, and an AI chatbot for user guidance.",
    tags: ["MERN Stack", "Mapbox", "AI Chatbot", "Analytics", "React"],
    image: "/nurtiguard.png",
    link: "https://nutriguard.vercel.app",
    github: "https://github.com/etank0/nutriguard"
  },
  {
    id: "3",
    title: "Discord Clone",
    description: "A real-time chat application inspired by Discord. Features include voice/video channels, direct messaging, server management, and role-based permissions with a sleek modern UI.",
    tags: ["NestJS", "TypeScript", "Docker", "AWS S3", "Redis"],
    image: "/discord.png",
    link: "https://discord-clone-yrns-1yo2cuyyc-officialnitins-projects.vercel.app/",
    github: "https://github.com/OFFICIALNITIN/discord-clone"
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "1",
    role: "Software Engineer Intern",
    company: "Roxiler Systems",
    period: "June 2025 – Present",
    description: [
      "Developing scalable applications using NestJS, Next.js, TypeScript, and Node.js within a microservices architecture.",
      "Building and optimizing backend services while translating business requirements into maintainable APIs.",
      "Integrated AWS S3 for secure file storage and containerized applications using Docker.",
      "Ensuring high code quality using modular architecture and reusable components."
    ]
  },
  {
    id: "2",
    role: "Full Stack Web Developer Intern",
    company: "Nullclass EdTech Pvt Ltd.",
    period: "June 2024 – July 2024",
    description: [
      "Added new features to an existing web application, enhancing functionality and user experience.",
      "Utilized frontend and backend technologies, gaining a clear understanding of scalable feature development.",
      "Successfully completed assigned tasks on time, demonstrating strong problem-solving skills."
    ]
  },
  {
    id: "3",
    role: "Web Developer Intern",
    company: "EduNexa Tech Pvt Ltd.",
    period: "Dec 2023 – Jan 2024",
    description: [
      "Utilized ReactJs and ExpressJs to develop interactive web applications.",
      "Resulted in a 20% increase in user engagement metrics.",
      "Acquired proficiency in debugging and troubleshooting code issues, reducing bug count by 30%."
    ]
  }
];

export const SKILLS: Skill[] = [
  { name: "JavaScript", category: "frontend" },
  { name: "React.js", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "HTML/CSS", category: "frontend" },
  { name: "Bootstrap", category: "frontend" },
  { name: "TanStack Query", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Express.js", category: "backend" },
  { name: "NestJS", category: "backend" },
  { name: "C++", category: "backend" },
  { name: "Microservices", category: "backend" },
  { name: "RESTful APIs", category: "backend" },
  { name: "MongoDB", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "MySQL", category: "backend" },
  { name: "Docker", category: "tools" },
  { name: "AWS S3", category: "tools" },
  { name: "Git/GitHub", category: "tools" },
  { name: "Postman", category: "tools" },
];