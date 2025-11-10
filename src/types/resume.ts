export interface Resume {
    id: string;
    owner: string;
    title: string;
    sections: ResumeSection[];
    isPublished: boolean;
    lastUpdated: number;
    views: number;
}

export type ResumeSection =
    | AboutSection
    | SkillsSection
    | ExperienceSection
    | ProjectsSection
    | ContactsSection
    | VideoSection;

// === ABOUT ===
export interface AboutSection {
    id: string;
    type: "about";
    data: {
        headline: string;
        bio: string;
    };
}


// === SKILLS ===
export interface SkillsSection {
    id: string;
    type: "skills";
    data: {
        skills: string[];
    };
}

// === EXPERIENCE ===
export interface ResumeExperienceItem {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
}

export interface ExperienceSection {
    id: string;
    type: "experience";
    data: {
        items: ResumeExperienceItem[];
    };
}

// === PROJECTS ===
export interface ResumeProjectItem {
    id: string;
    title: string;
    description: string;
    link?: string;
    imageUrl?: string;
}

export interface ProjectsSection {
    id: string;
    type: "projects";
    data: {
        projects: ResumeProjectItem[];
    };
}

// === CONTACTS ===
export interface ResumeContactsData {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
}

export interface ContactsSection {
    id: string;
    type: "contacts";
    data: ResumeContactsData;
}

// === VIDEO ===
export interface VideoSection {
    id: string;
    type: "video";
    data: {
        url: string;
    };
}

