import type {SectionType} from "../pages/ResumeBuilder/types.ts";

export interface BaseSection {
    id: string;
    type: SectionType;
}

export type AboutSection = BaseSection & {
    type: "about";
    content: string;
};

export type SkillSection = BaseSection & {
    type: "skills";
    items: string[];
};

export type ExperienceSection = BaseSection & {
    type: "experience";
    position?: string;
    company?: string;
    years?: string;
    content?: string;
};

export type ProjectSection = BaseSection & {
    type: "projects";
    name?: string;
    url?: string;
    content?: string;
};

export type ContactsSection = BaseSection & {
    type: "contacts";
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
};

export type VideoSection = BaseSection & {
    type: "video";
    url?: string;
};

export type ResumeSection =
    | AboutSection
    | SkillSection
    | ExperienceSection
    | ProjectSection
    | ContactsSection
    | VideoSection;

export interface Resume {
    id: string;
    owner: string;
    title: string;
    sections: ResumeSection[];
    isPublished: boolean;
    lastUpdated: number;
    views: number;
}
