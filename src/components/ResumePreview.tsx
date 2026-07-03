import React from 'react';
import { ResumeData, DesignConfig, ColorTheme, FontPairing } from '../types';
import { COLOR_THEMES } from '../data/themes';
import {
	Mail,
	Phone,
	MapPin,
	Linkedin,
	Globe,
	Award,
	Briefcase,
	GraduationCap,
	Compass,
	HelpCircle,
} from 'lucide-react';

interface ResumePreviewProps {
	data: ResumeData;
	config: DesignConfig;
}

export default function ResumePreview({ data, config }: ResumePreviewProps) {
	const currentTheme = COLOR_THEMES.find((t) => t.id === config.themeId) || COLOR_THEMES[0];

	const fontClass = {
		sans: 'font-sans',
		serif: 'font-serif',
		mono: 'font-mono',
	}[config.fontPairing];

	const spacingClass = {
		compact: 'space-y-3 text-sm',
		comfortable: 'space-y-5 text-base',
		loose: 'space-y-7 text-lg',
	}[config.spacing];

	const itemSpacing = {
		compact: 'space-y-1.5',
		comfortable: 'space-y-3',
		loose: 'space-y-4',
	}[config.spacing];

	const textSizes = {
		compact: {
			name: 'text-2xl',
			title: 'text-sm',
			sectionTitle: 'text-xs',
			body: 'text-xs',
			meta: 'text-[11px]',
		},
		comfortable: {
			name: 'text-3xl',
			title: 'text-base',
			sectionTitle: 'text-sm',
			body: 'text-sm',
			meta: 'text-xs',
		},
		loose: {
			name: 'text-4xl',
			title: 'text-lg',
			sectionTitle: 'text-base',
			body: 'text-base',
			meta: 'text-sm',
		},
	}[config.spacing];

	const renderAvatar = (size: string = 'h-16 w-16') => {
		if (!config.showAvatar) return null;

		if (data.personalInfo.avatar) {
			return (
				<img
					src={data.personalInfo.avatar}
					alt={data.personalInfo.name}
					className={`${size} rounded-full object-cover border-2 shadow-sm`}
					style={{ borderColor: currentTheme.primary }}
					referrerPolicy="no-referrer"
				/>
			);
		}

		const initials = data.personalInfo.name
			? data.personalInfo.name
					.split(' ')
					.map((n) => n[0])
					.slice(0, 2)
					.join('')
					.toUpperCase()
			: 'RS';

		return (
			<div
				className={`${size} rounded-full flex items-center justify-center text-white font-bold text-lg border-2 shadow-sm`}
				style={{
					backgroundColor: currentTheme.primary,
					borderColor: currentTheme.accent,
				}}
			/>
		);
	};

	const renderSectionHeader = (title: string, icon: React.ReactNode) => {
		if (!config.showSectionHeaders) {
			return <div className="h-px w-full my-2 bg-gray-200" />;
		}
		return (
			<div
				className="flex items-center gap-2 mb-2 pb-1 border-b"
				style={{ borderBottomColor: `${currentTheme.primary}40` }}>
				<span style={{ color: currentTheme.primary }}>{icon}</span>
				<h3
					className={`${textSizes.sectionTitle} font-bold uppercase tracking-wider`}
					style={{ color: currentTheme.primary }}>
					{title}
				</h3>
			</div>
		);
	};

	const renderExperiences = () => {
		if (!data.workExperiences || data.workExperiences.length === 0) return null;
		return (
			<div>
				{renderSectionHeader('Work Experience / ประสบการณ์การทำงาน', <Briefcase className="h-4 w-4" />)}
				<div className={itemSpacing}>
					{data.workExperiences.map((exp) => (
						<div key={exp.id} className="group">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
								<div>
									<h4 className={`font-semibold ${textSizes.body} text-gray-900`}>{exp.role}</h4>
									<div className="flex items-center gap-1.5 text-gray-700">
										<span className="font-medium text-xs">{exp.company}</span>
										{exp.location && (
											<span className={`${textSizes.meta} text-gray-500`}>• {exp.location}</span>
										)}
									</div>
								</div>
								<span
									className={`${textSizes.meta} text-gray-500 font-mono font-medium whitespace-nowrap mt-1 sm:mt-0`}>
									{exp.startDate} - {exp.current ? 'Present / ปัจจุบัน' : exp.endDate}
								</span>
							</div>
							<ul className="list-disc list-inside space-y-1 pl-1">
								{exp.description.map((bullet, idx) => (
									<li key={idx} className={`${textSizes.body} text-gray-600 pl-1 leading-relaxed`}>
										{bullet}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderEducation = () => {
		if (!data.educations || data.educations.length === 0) return null;
		return (
			<div>
				{renderSectionHeader('Education / การศึกษา', <GraduationCap className="h-4 w-4" />)}
				<div className={itemSpacing}>
					{data.educations.map((edu) => (
						<div key={edu.id}>
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
								<div>
									<h4 className={`font-semibold ${textSizes.body} text-gray-900`}>{edu.degree}</h4>
									<p className="text-gray-700 text-xs font-medium">
										{edu.major} • {edu.institution}
									</p>
								</div>
								<span className={`${textSizes.meta} text-gray-500 font-mono whitespace-nowrap mt-1 sm:mt-0`}>
									{edu.startDate} - {edu.current ? 'Present / ปัจจุบัน' : edu.endDate}
								</span>
							</div>
							{edu.gpa && (
								<p className={`${textSizes.meta} text-gray-600 font-medium mt-0.5`}>GPA: {edu.gpa}</p>
							)}
							{edu.description && (
								<p className={`${textSizes.body} text-gray-600 mt-1 pl-1 italic`}>{edu.description}</p>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderSkills = (layout: 'sidebar' | 'full') => {
		if (!data.skills || data.skills.length === 0) return null;

		if (layout === 'sidebar') {
			const coreSkills = data.skills.filter((s) => s.category === 'Core');
			const toolSkills = data.skills.filter((s) => s.category === 'Tools');
			const softSkills = data.skills.filter(
				(s) => s.category === 'Soft' || !['Core', 'Tools'].includes(s.category),
			);

			return (
				<div className="space-y-4">
					{renderSectionHeader('Skills / ทักษะ', <Compass className="h-4 w-4" />)}

					{coreSkills.length > 0 && (
						<div>
							<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Core Skills</p>
							<div className="flex flex-wrap gap-1.5">
								{coreSkills.map((s) => (
									<span
										key={s.id}
										className="px-2 py-0.5 rounded text-[11px] font-medium leading-none"
										style={{ backgroundColor: `${currentTheme.primary}12`, color: currentTheme.primary }}>
										{s.name}
									</span>
								))}
							</div>
						</div>
					)}

					{toolSkills.length > 0 && (
						<div>
							<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
								Tools & Technology
							</p>
							<div className="flex flex-wrap gap-1.5">
								{toolSkills.map((s) => (
									<span
										key={s.id}
										className="px-2 py-0.5 rounded text-[11px] font-medium leading-none bg-gray-100 text-gray-700">
										{s.name}
									</span>
								))}
							</div>
						</div>
					)}

					{softSkills.length > 0 && (
						<div>
							<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Soft Skills</p>
							<div className="flex flex-wrap gap-1.5">
								{softSkills.map((s) => (
									<span
										key={s.id}
										className="px-2 py-0.5 rounded text-[11px] font-medium leading-none bg-gray-50 border border-gray-200 text-gray-600">
										{s.name}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			);
		}

		return (
			<div>
				{renderSectionHeader('Skills / ทักษะและความสามารถ', <Compass className="h-4 w-4" />)}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{['Core', 'Tools', 'Soft'].map((cat) => {
						const catSkills = data.skills.filter(
							(s) => s.category === cat || (cat === 'Soft' && !['Core', 'Tools'].includes(s.category)),
						);
						if (catSkills.length === 0) return null;

						return (
							<div key={cat} className="space-y-1.5">
								<h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
									{cat === 'Core'
										? 'Core Expertise'
										: cat === 'Tools'
											? 'Technical Tools'
											: 'Personal Attributes'}
								</h5>
								<div className="flex flex-wrap gap-1.5">
									{catSkills.map((s) => (
										<span
											key={s.id}
											className="px-2 py-0.5 rounded text-xs font-medium"
											style={{
												backgroundColor: cat === 'Core' ? `${currentTheme.primary}12` : '#f3f4f6',
												color: cat === 'Core' ? currentTheme.primary : '#374151',
											}}>
											{s.name}
										</span>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	const renderLanguages = (layout: 'sidebar' | 'full') => {
		if (!data.languages || data.languages.length === 0) return null;
		return (
			<div>
				{renderSectionHeader('Languages / ภาษา', <Globe className="h-4 w-4" />)}
				<div className={layout === 'sidebar' ? 'space-y-1.5' : 'grid grid-cols-2 gap-4'}>
					{data.languages.map((lang) => (
						<div key={lang.id} className="flex justify-between items-center text-xs">
							<span className="font-semibold text-gray-800">{lang.name}</span>
							<span className="text-gray-500 italic font-medium">{lang.proficiency}</span>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderProjectsAndCerts = () => {
		if (!data.projectsOrCerts || data.projectsOrCerts.length === 0) return null;
		return (
			<div>
				{renderSectionHeader(
					'Certifications & Achievements / เกียรติบัตรและผลงาน',
					<Award className="h-4 w-4" />,
				)}
				<div className="grid grid-cols-1 gap-3">
					{data.projectsOrCerts.map((proj) => (
						<div key={proj.id}>
							<div className="flex justify-between items-start">
								<div>
									<h4 className={`font-semibold ${textSizes.body} text-gray-900`}>{proj.title}</h4>
									<p className="text-gray-600 text-xs font-medium">{proj.issuerOrCompany}</p>
								</div>
								<span className={`${textSizes.meta} text-gray-500 font-mono whitespace-nowrap`}>
									{proj.date}
								</span>
							</div>
							{proj.description && (
								<p className={`${textSizes.body} text-gray-600 mt-1 leading-relaxed`}>{proj.description}</p>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderContactInfo = (layout: 'centered' | 'left' | 'sidebar') => {
		const infoItems = [
			{ icon: <Mail className="h-3 w-3" />, val: data.personalInfo.email, label: 'Email' },
			{ icon: <Phone className="h-3 w-3" />, val: data.personalInfo.phone, label: 'Phone' },
			{ icon: <MapPin className="h-3 w-3" />, val: data.personalInfo.location, label: 'Location' },
			{ icon: <Linkedin className="h-3 w-3" />, val: data.personalInfo.linkedin, label: 'LinkedIn' },
			{ icon: <Globe className="h-3 w-3" />, val: data.personalInfo.website, label: 'Website' },
		].filter((item) => item.val);

		if (layout === 'sidebar') {
			return (
				<div className="space-y-2">
					{infoItems.map((item, idx) => (
						<div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
							<span className="mt-0.5" style={{ color: currentTheme.primary }}>
								{item.icon}
							</span>
							<span className="break-all leading-normal">{item.val}</span>
						</div>
					))}
				</div>
			);
		}

		const alignmentClass = layout === 'centered' ? 'justify-center' : 'justify-start';

		return (
			<div className={`flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600 ${alignmentClass}`}>
				{infoItems.map((item, idx) => (
					<div key={idx} className="flex items-center gap-1.5">
						<span style={{ color: currentTheme.primary }}>{item.icon}</span>
						<span>{item.val}</span>
					</div>
				))}
			</div>
		);
	};

	const renderMinimalLayout = () => {
		return (
			<div
				className={`${fontClass} ${spacingClass} bg-white text-gray-800 h-full w-full max-w-[600px] mx-auto`}
				id="resume-container">
				<div className="text-center space-y-2.5 pb-4 border-b border-gray-100">
					<div className="flex justify-center mb-1">{renderAvatar('h-20 w-20')}</div>
					<div>
						<h1 className={`${textSizes.name} font-bold tracking-tight text-gray-900`}>
							{data.personalInfo.name}
						</h1>
						<p
							className={`${textSizes.title} font-medium tracking-wide mt-0.5 uppercase`}
							style={{ color: currentTheme.primary }}>
							{data.personalInfo.title}
						</p>
					</div>
					{renderContactInfo('centered')}
				</div>

				{data.summary && (
					<div className="space-y-1.5 pt-1">
						<p
							className={`${textSizes.body} text-gray-600 leading-relaxed text-center max-w-2xl mx-auto italic`}>
							"{data.summary}"
						</p>
					</div>
				)}

				{renderExperiences()}
				{renderEducation()}
				{renderSkills('full')}
				{renderLanguages('full')}
				{renderProjectsAndCerts()}
			</div>
		);
	};

	const renderProfessionalLayout = () => {
		return (
			<div
				className={`${fontClass} ${spacingClass} bg-white text-gray-800 h-full w-full max-w-[600px] mx-auto space-y-0`}
				id="resume-container">
				<div
					className="p-6 rounded-lg mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-l-4"
					style={{ backgroundColor: `${currentTheme.primary}08`, borderLeftColor: currentTheme.primary }}>
					<div className="flex items-center gap-4">
						{renderAvatar('h-16 w-16')}
						<div>
							<h1 className={`${textSizes.name} font-bold tracking-tight text-gray-900`}>
								{data.personalInfo.name}
							</h1>
							<p
								className={`${textSizes.title} font-semibold mt-0.5 tracking-wide uppercase`}
								style={{ color: currentTheme.primary }}>
								{data.personalInfo.title}
							</p>
						</div>
					</div>
					<div className="md:text-right">{renderContactInfo('left')}</div>
				</div>

				{data.summary && (
					<div className="pb-4">
						<p className={`${textSizes.body} text-gray-600 leading-relaxed`}>{data.summary}</p>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-gray-100">
					<div className="md:col-span-8 space-y-5">
						{renderExperiences()}
						{renderProjectsAndCerts()}
					</div>

					<div className="md:col-span-4 space-y-5">
						{renderEducation()}
						{renderSkills('sidebar')}
						{renderLanguages('sidebar')}
					</div>
				</div>
			</div>
		);
	};

	const renderSidebarLayout = (isLeft: boolean) => {
		return (
			<div
				className={`${fontClass} h-full w-full max-w-[600px] mx-auto grid grid-cols-12 space-y-0 bg-white overflow-hidden`}
				id="resume-container">
				<div
					className={`col-span-4 p-5 flex flex-col gap-5 ${isLeft ? 'order-1 border-r' : 'order-2 border-l'} border-gray-100`}
					style={{ backgroundColor: currentTheme.bgLight }}>
					<div
						className="flex flex-col items-center text-center space-y-3 pb-4 border-b"
						style={{ borderBottomColor: `${currentTheme.primary}20` }}>
						{renderAvatar('h-24 w-24')}
						<div>
							<h2 className="text-base font-bold text-gray-900 leading-tight">{data.personalInfo.name}</h2>
							<p
								className="text-xs font-semibold mt-1 uppercase tracking-wider"
								style={{ color: currentTheme.primary }}>
								{data.personalInfo.title}
							</p>
						</div>
					</div>

					<div>
						<h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
							Contact Details
						</h3>
						{renderContactInfo('sidebar')}
					</div>

					{renderEducation()}
					{renderSkills('sidebar')}
					{renderLanguages('sidebar')}
				</div>

				<div className={`col-span-8 p-6 flex flex-col gap-5 ${isLeft ? 'order-2' : 'order-1'}`}>
					{data.summary && (
						<div className="pb-4 border-b border-gray-100">
							<h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
								Executive Summary
							</h3>
							<p className={`${textSizes.body} text-gray-600 leading-relaxed`}>{data.summary}</p>
						</div>
					)}

					{renderExperiences()}
					{renderProjectsAndCerts()}
				</div>
			</div>
		);
	};

	const renderElegantSerifLayout = () => {
		return (
			<div
				className={`${fontClass} ${spacingClass} bg-white text-gray-800 h-full w-full max-w-[600px] mx-auto`}
				id="resume-container">
				<div className="text-center space-y-3 pb-5">
					<div className="flex justify-center mb-1">{renderAvatar('h-20 w-20')}</div>
					<div>
						<h1 className="text-3xl font-serif font-semibold tracking-wider text-gray-900">
							{data.personalInfo.name}
						</h1>
						<div className="flex justify-center items-center gap-2 mt-1">
							<div className="h-px w-6" style={{ backgroundColor: currentTheme.accent }} />
							<p
								className="text-xs font-serif font-medium tracking-widest uppercase"
								style={{ color: currentTheme.primary }}>
								{data.personalInfo.title}
							</p>
							<div className="h-px w-6" style={{ backgroundColor: currentTheme.accent }} />
						</div>
					</div>
					{renderContactInfo('centered')}
				</div>

				{data.summary && (
					<div
						className="pt-2 pb-4 text-center border-t border-b"
						style={{ borderColor: `${currentTheme.primary}20` }}>
						<p className="font-serif italic text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
							"{data.summary}"
						</p>
					</div>
				)}

				{renderExperiences()}
				{renderEducation()}
				{renderSkills('full')}
				{renderLanguages('full')}
				{renderProjectsAndCerts()}
			</div>
		);
	};

	switch (config.template) {
		case 'professional':
			return renderProfessionalLayout();
		case 'sidebar-left':
			return renderSidebarLayout(true);
		case 'sidebar-right':
			return renderSidebarLayout(false);
		case 'elegant-serif':
			return renderElegantSerifLayout();
		case 'minimal':
		default:
			return renderMinimalLayout();
	}
}
