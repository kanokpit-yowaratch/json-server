export interface PersonalInfo {
	name: string;
	title: string;
	email: string;
	phone: string;
	location: string;
	linkedin?: string;
	website?: string;
	avatar?: string;
}

export interface WorkExperience {
	id: string;
	company: string;
	role: string;
	location: string;
	startDate: string;
	endDate: string;
	current: boolean;
	description: string[];
}

export interface Education {
	id: string;
	institution: string;
	degree: string;
	major: string;
	location: string;
	startDate: string;
	endDate: string;
	current: boolean;
	gpa?: string;
	description?: string;
}

export interface Skill {
	id: string;
	name: string;
	level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | '';
	category: 'Core' | 'Tools' | 'Soft' | string;
}

export interface Language {
	id: string;
	name: string;
	proficiency: string;
}

export interface ProjectOrCert {
	id: string;
	title: string;
	issuerOrCompany: string;
	date: string;
	description: string;
}

export interface ResumeData {
	personalInfo: PersonalInfo;
	summary: string;
	workExperiences: WorkExperience[];
	educations: Education[];
	skills: Skill[];
	languages: Language[];
	projectsOrCerts: ProjectOrCert[];
}

export type LayoutTemplate = 'minimal' | 'professional' | 'sidebar-left' | 'sidebar-right' | 'elegant-serif';

export type ColorTheme = {
	id: string;
	name: string;
	primary: string;
	secondary: string;
	accent: string;
	textDark: string;
	bgLight: string;
};

export type FontPairing = 'sans' | 'serif' | 'mono';

export interface DesignConfig {
	template: LayoutTemplate;
	themeId: string;
	fontPairing: FontPairing;
	spacing: 'compact' | 'comfortable' | 'loose';
	showSectionHeaders: boolean;
	showAvatar: boolean;
}
