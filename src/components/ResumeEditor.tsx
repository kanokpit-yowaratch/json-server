'use client';

import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Skill, Language, ProjectOrCert } from '../types';
import {
	User,
	FileText,
	Briefcase,
	GraduationCap,
	Compass,
	Globe,
	Award,
	Plus,
	Trash2,
	ArrowUp,
	ArrowDown,
	Upload,
	Sparkles,
	Check,
	RefreshCw,
} from 'lucide-react';

interface ResumeEditorProps {
	data: ResumeData;
	onChange: (newData: ResumeData) => void;
	currentLanguage: 'th' | 'en';
	onResetToDefault: () => void;
	disabled?: boolean;
}

type TabType = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'certs';

export default function ResumeEditor({
	data,
	onChange,
	currentLanguage,
	onResetToDefault,
	disabled = false,
}: ResumeEditorProps) {
	const [activeTab, setActiveTab] = useState<TabType>('personal');
	const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

	const updatePersonalInfo = (field: string, value: string) => {
		onChange({
			...data,
			personalInfo: {
				...data.personalInfo,
				[field]: value,
			},
		});
	};

	const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 1024 * 1024) {
			showToast('ไฟล์ต้องมีขนาดไม่เกิน 1 MB / File size must be under 1 MB');
			e.target.value = '';
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			onChange({
				...data,
				personalInfo: {
					...data.personalInfo,
					avatar: reader.result as string,
				},
			});
		};
		reader.readAsDataURL(file);
	};

	const handleResetClick = () => {
		const isThai = currentLanguage === 'th';
		const msg = isThai
			? 'คุณแน่ใจหรือไม่ว่าต้องการคืนค่าเรซูเม่ภาษาไทยกลับเป็นค่าเริ่มต้นตามเทมเพลต? ข้อมูลที่คุณแก้ไขไว้จะหายไป'
			: "Are you sure you want to reset this language's content back to the default template? Your custom edits will be overwritten.";

		if (window.confirm(msg)) {
			onResetToDefault();
			showToast(isThai ? 'คืนค่าเริ่มต้นภาษาไทยสำเร็จ' : 'Successfully reset to English default');
		}
	};

	const showToast = (msg: string) => {
		setCopiedNotification(msg);
		setTimeout(() => setCopiedNotification(null), 2500);
	};

	const handleAddExperience = () => {
		const newExp: WorkExperience = {
			id: `work-${Date.now()}`,
			company: 'New Company',
			role: 'Sales Support Representative',
			location: 'Bangkok',
			startDate: '2024',
			endDate: 'Present',
			current: true,
			description: [
				'Coordinated client relations and resolved ordering issues.',
				'Assisted sales representatives to achieve targets.',
			],
		};
		onChange({
			...data,
			workExperiences: [...data.workExperiences, newExp],
		});
	};

	const handleUpdateExperience = (id: string, field: keyof WorkExperience, value: any) => {
		onChange({
			...data,
			workExperiences: data.workExperiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
		});
	};

	const handleAddBullet = (expId: string) => {
		onChange({
			...data,
			workExperiences: data.workExperiences.map((exp) => {
				if (exp.id === expId) {
					return {
						...exp,
						description: [...exp.description, 'New accomplishment or responsibility'],
					};
				}
				return exp;
			}),
		});
	};

	const handleUpdateBullet = (expId: string, index: number, value: string) => {
		onChange({
			...data,
			workExperiences: data.workExperiences.map((exp) => {
				if (exp.id === expId) {
					const newDesc = [...exp.description];
					newDesc[index] = value;
					return { ...exp, description: newDesc };
				}
				return exp;
			}),
		});
	};

	const handleRemoveBullet = (expId: string, index: number) => {
		onChange({
			...data,
			workExperiences: data.workExperiences.map((exp) => {
				if (exp.id === expId) {
					return {
						...exp,
						description: exp.description.filter((_, idx) => idx !== index),
					};
				}
				return exp;
			}),
		});
	};

	const handleRemoveExperience = (id: string) => {
		onChange({
			...data,
			workExperiences: data.workExperiences.filter((exp) => exp.id !== id),
		});
	};

	const moveExperience = (index: number, direction: 'up' | 'down') => {
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= data.workExperiences.length) return;

		const newExperiences = [...data.workExperiences];
		const temp = newExperiences[index];
		newExperiences[index] = newExperiences[targetIndex];
		newExperiences[targetIndex] = temp;

		onChange({ ...data, workExperiences: newExperiences });
	};

	const handleAddEducation = () => {
		const newEdu: Education = {
			id: `edu-${Date.now()}`,
			institution: 'University Name',
			degree: 'Bachelor Degree',
			major: 'Business Administration',
			location: 'Bangkok',
			startDate: '2020',
			endDate: '2024',
			current: false,
			gpa: '3.50',
		};
		onChange({
			...data,
			educations: [...data.educations, newEdu],
		});
	};

	const handleUpdateEducation = (id: string, field: keyof Education, value: any) => {
		onChange({
			...data,
			educations: data.educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
		});
	};

	const handleRemoveEducation = (id: string) => {
		onChange({
			...data,
			educations: data.educations.filter((edu) => edu.id !== id),
		});
	};

	const handleAddSkill = () => {
		const newSkill: Skill = {
			id: `skill-${Date.now()}`,
			name: 'New Skill / ความสามารถ',
			category: 'Core',
		};
		onChange({
			...data,
			skills: [...data.skills, newSkill],
		});
	};

	const handleUpdateSkill = (id: string, field: keyof Skill, value: any) => {
		onChange({
			...data,
			skills: data.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
		});
	};

	const handleRemoveSkill = (id: string) => {
		onChange({
			...data,
			skills: data.skills.filter((s) => s.id !== id),
		});
	};

	const handleAddLanguage = () => {
		const newLang: Language = {
			id: `lang-${Date.now()}`,
			name: 'Language',
			proficiency: 'Fluent',
		};
		onChange({
			...data,
			languages: [...data.languages, newLang],
		});
	};

	const handleUpdateLanguage = (id: string, field: keyof Language, value: string) => {
		onChange({
			...data,
			languages: data.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
		});
	};

	const handleRemoveLanguage = (id: string) => {
		onChange({
			...data,
			languages: data.languages.filter((l) => l.id !== id),
		});
	};

	const handleAddCert = () => {
		const newCert: ProjectOrCert = {
			id: `cert-${Date.now()}`,
			title: 'New Certificate / Project',
			issuerOrCompany: 'Issuing Organization',
			date: '2024',
			description: 'Brief description of what you learned or achieved.',
		};
		onChange({
			...data,
			projectsOrCerts: [...data.projectsOrCerts, newCert],
		});
	};

	const handleUpdateCert = (id: string, field: keyof ProjectOrCert, value: string) => {
		onChange({
			...data,
			projectsOrCerts: data.projectsOrCerts.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
		});
	};

	const handleRemoveCert = (id: string) => {
		onChange({
			...data,
			projectsOrCerts: data.projectsOrCerts.filter((c) => c.id !== id),
		});
	};

	const renderTabButton = (tab: TabType, label: string, shortLabel: string, icon: React.ReactNode) => {
		const isActive = activeTab === tab;
		return (
			<button
				onClick={() => setActiveTab(tab)}
				className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
					isActive
						? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm'
						: 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
				}`}>
				{icon}
				<span className="sm:hidden">{shortLabel}</span>
				<span className="hidden sm:inline">{label}</span>
			</button>
		);
	};

	return (
		<div
			className={`flex flex-col h-full bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
			{copiedNotification && (
				<div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
					<Check className="h-4 w-4 text-emerald-400" />
					<span>{copiedNotification}</span>
				</div>
			)}

			<div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
					<div className="min-w-0">
						<h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
							<Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
							<span className="truncate">
								{currentLanguage === 'th' ? 'แก้ไขข้อมูลเรซูเม่' : 'Resume Content Editor'}
							</span>
						</h2>
						<p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
							{currentLanguage === 'th'
								? 'แก้ไขรายละเอียดข้อมูลด้านล่างได้ทันทีตามต้องการ'
								: 'Customize your details below or edit information as needed.'}
						</p>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						<button
							type="button"
							onClick={handleResetClick}
							className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 transition-all cursor-pointer"
							title={currentLanguage === 'th' ? 'คืนค่าเริ่มต้นตามเทมเพลต' : 'Reset to default template'}>
							<RefreshCw className="h-3 w-3" />
							<span className="hidden xs:inline">
								{currentLanguage === 'th' ? 'คืนค่าเริ่มต้น' : 'Reset'}
							</span>
						</button>
					</div>
				</div>

				<div className="flex gap-1 overflow-x-auto mt-3 sm:mt-4 pb-1 scrollbar-thin -mx-1 sm:mx-0 px-1 sm:px-0">
					{renderTabButton('personal', 'Personal Info', 'ข้อมูล', <User className="h-3.5 w-3.5" />)}
					{renderTabButton('summary', 'Summary', 'สรุป', <FileText className="h-3.5 w-3.5" />)}
					{renderTabButton('experience', 'Experience', 'ประสบการณ์', <Briefcase className="h-3.5 w-3.5" />)}
					{renderTabButton('education', 'Education', 'การศึกษา', <GraduationCap className="h-3.5 w-3.5" />)}
					{renderTabButton('skills', 'Skills', 'ทักษะ', <Compass className="h-3.5 w-3.5" />)}
					{renderTabButton('languages', 'Languages', 'ภาษา', <Globe className="h-3.5 w-3.5" />)}
					{renderTabButton('certs', 'Awards & Certs', 'เกียรติฯ', <Award className="h-3.5 w-3.5" />)}
				</div>
			</div>

			<div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3 sm:space-y-4">
				{activeTab === 'personal' && (
					<div className="space-y-4">
						<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
							Personal Information
						</h3>

						<div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
							<div className="relative">
								{data.personalInfo.avatar ? (
									<img
										src={data.personalInfo.avatar}
										alt="Avatar Preview"
										className="h-16 w-16 rounded-full object-cover border border-slate-300 dark:border-slate-600"
									/>
								) : (
									<div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
								)}
							</div>
							<div className="space-y-1">
								<p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Profile Photo</p>
								<p className="text-[10px] text-slate-500 dark:text-slate-400">
									Upload a professional headshot (JPG, PNG).
								</p>
								<div className="flex items-center gap-2 mt-1">
									<label className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 dark:bg-slate-800 text-white text-[11px] font-medium hover:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-colors">
										<Upload className="h-3 w-3" />
										<span>Upload</span>
										<input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
									</label>
									{data.personalInfo.avatar && (
										<button
											onClick={() => updatePersonalInfo('avatar', '')}
											className="px-2 py-1 text-red-600 dark:text-red-400 text-[11px] font-medium hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors">
											Remove
										</button>
									)}
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1">
								<label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
									Full Name
								</label>
								<input
									type="text"
									value={data.personalInfo.name}
									onChange={(e) => updatePersonalInfo('name', e.target.value)}
									placeholder="e.g. กนกพิชญ์ ยิ่งคุณากร"
									className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 bg-white dark:bg-slate-900"
								/>
							</div>

							<div className="space-y-1">
								<label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
									Professional Title
								</label>
								<input
									type="text"
									value={data.personalInfo.title}
									onChange={(e) => updatePersonalInfo('title', e.target.value)}
									placeholder="e.g. เจ้าหน้าที่สนับสนุนฝ่ายขายอาวุโส"
									className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 bg-white dark:bg-slate-900"
								/>
							</div>

							<div className="space-y-1">
								<label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
									Email Address
								</label>
								<input
									type="email"
									value={data.personalInfo.email}
									onChange={(e) => updatePersonalInfo('email', e.target.value)}
									placeholder="e.g. sujitra.k@gmail.com"
									className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 bg-white dark:bg-slate-900"
								/>
							</div>

							<div className="space-y-1">
								<label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
									Phone Number
								</label>
								<input
									type="text"
									value={data.personalInfo.phone}
									onChange={(e) => updatePersonalInfo('phone', e.target.value)}
									placeholder="e.g. 081-234-5678"
									className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 bg-white dark:bg-slate-900"
								/>
							</div>

							<div className="space-y-1">
								<label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
									Location (City, Country)
								</label>
								<input
									type="text"
									value={data.personalInfo.location}
									onChange={(e) => updatePersonalInfo('location', e.target.value)}
									placeholder="e.g. กรุงเทพมหานคร, ประเทศไทย"
									className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 bg-white dark:bg-slate-900"
								/>
							</div>

							<div className="space-y-1">
								<label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
									LinkedIn URL
								</label>
								<input
									type="text"
									value={data.personalInfo.linkedin || ''}
									onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
									placeholder="e.g. linkedin.com/in/username"
									className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 bg-white dark:bg-slate-900"
								/>
							</div>

							<div className="space-y-1 md:col-span-2">
								<label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
									Personal Website / GitHub
								</label>
								<input
									type="text"
									value={data.personalInfo.website || ''}
									onChange={(e) => updatePersonalInfo('website', e.target.value)}
									placeholder="e.g. github.com/username"
									className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 bg-white dark:bg-slate-900"
								/>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'summary' && (
					<div className="space-y-4">
						<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
							Professional Summary
						</h3>
						<p className="text-[11px] text-slate-500 dark:text-slate-400">
							A 3-4 sentence professional summary of your key strengths, domain expertise (managing sales,
							supporting customers, delivering results), and goals.
						</p>
						<div className="space-y-1.5">
							<textarea
								rows={6}
								value={data.summary}
								onChange={(e) => onChange({ ...data, summary: e.target.value })}
								placeholder="เขียนประวัติย่อของคุณ..."
								className="w-full text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 bg-white dark:bg-slate-900 leading-relaxed font-sans"
							/>
						</div>
					</div>
				)}

				{activeTab === 'experience' && (
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Work Experience
							</h3>
							<button
								onClick={handleAddExperience}
								className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer">
								<Plus className="h-3 w-3" />
								<span>Add Position</span>
							</button>
						</div>

						<div className="space-y-4">
							{data.workExperiences.map((exp, expIdx) => (
								<div
									key={exp.id}
									className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 space-y-3 relative group">
									<div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
										<span className="text-xs font-bold text-slate-700 dark:text-slate-200">
											Role #{expIdx + 1}
										</span>
										<div className="flex items-center gap-1">
											<button
												onClick={() => moveExperience(expIdx, 'up')}
												disabled={expIdx === 0}
												className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded disabled:opacity-30 cursor-pointer"
												title="Move Up">
												<ArrowUp className="h-3 w-3" />
											</button>
											<button
												onClick={() => moveExperience(expIdx, 'down')}
												disabled={expIdx === data.workExperiences.length - 1}
												className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded disabled:opacity-30 cursor-pointer"
												title="Move Down">
												<ArrowDown className="h-3 w-3" />
											</button>
											<button
												onClick={() => handleRemoveExperience(exp.id)}
												className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded cursor-pointer"
												title="Remove">
												<Trash2 className="h-3 w-3" />
											</button>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Company Name
											</label>
											<input
												type="text"
												value={exp.company}
												onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
												placeholder="Company"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-900"
											/>
										</div>

										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Role / Job Title
											</label>
											<input
												type="text"
												value={exp.role}
												onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
												placeholder="e.g. Sales Support Specialist"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-900"
											/>
										</div>

										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Location
											</label>
											<input
												type="text"
												value={exp.location}
												onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
												placeholder="e.g. Bangkok, TH"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-900"
											/>
										</div>

										<div className="grid grid-cols-2 gap-2">
											<div className="space-y-1">
												<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
													Start Date
												</label>
												<input
													type="text"
													value={exp.startDate}
													onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
													placeholder="e.g. 2022"
													className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-900"
												/>
											</div>
											<div className="space-y-1">
												<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
													End Date
												</label>
												<input
													type="text"
													value={exp.current ? 'Present' : exp.endDate}
													disabled={exp.current}
													onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
													placeholder="e.g. 2024"
													className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-900 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:text-slate-400"
												/>
											</div>
										</div>

										<div className="md:col-span-2 flex items-center gap-2 pt-1">
											<input
												type="checkbox"
												id={`current-${exp.id}`}
												checked={exp.current}
												onChange={(e) => handleUpdateExperience(exp.id, 'current', e.target.checked)}
												className="rounded border-slate-300 dark:border-slate-600 focus:ring-slate-950 dark:focus:ring-slate-400"
											/>
											<label
												htmlFor={`current-${exp.id}`}
												className="text-xs text-slate-600 dark:text-slate-300 font-medium">
												I currently work in this role / ยังคงทำงานอยู่ในตำแหน่งนี้
											</label>
										</div>
									</div>

									<div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
										<div className="flex justify-between items-center">
											<span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Key Accomplishments & Bullet Points
											</span>
											<button
												onClick={() => handleAddBullet(exp.id)}
												className="flex items-center gap-0.5 text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 text-[10px] font-bold uppercase cursor-pointer">
												<Plus className="h-3 w-3" />
												<span>Add Bullet</span>
											</button>
										</div>

										<div className="space-y-2">
											{exp.description.map((bullet, bulletIdx) => (
												<div key={bulletIdx} className="flex gap-2 items-start">
													<span className="text-xs text-slate-500 dark:text-slate-400 mt-2">•</span>
													<input
														type="text"
														value={bullet}
														onChange={(e) => handleUpdateBullet(exp.id, bulletIdx, e.target.value)}
														placeholder="Describe responsibility or metrics (e.g. 'Reduced ordering errors by 15%')"
														className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
													/>
													<button
														onClick={() => handleRemoveBullet(exp.id, bulletIdx)}
														disabled={exp.description.length <= 1}
														className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded cursor-pointer disabled:opacity-20"
														title="Remove bullet">
														<Trash2 className="h-3.5 w-3.5" />
													</button>
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === 'education' && (
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Education history
							</h3>
							<button
								onClick={handleAddEducation}
								className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer">
								<Plus className="h-3 w-3" />
								<span>Add Education</span>
							</button>
						</div>

						<div className="space-y-4">
							{data.educations.map((edu, eduIdx) => (
								<div
									key={edu.id}
									className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 space-y-3 relative">
									<div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
										<span className="text-xs font-bold text-slate-700 dark:text-slate-200">
											Institution #{eduIdx + 1}
										</span>
										<button
											onClick={() => handleRemoveEducation(edu.id)}
											className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded cursor-pointer">
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Institution / University
											</label>
											<input
												type="text"
												value={edu.institution}
												onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
												placeholder="University Name"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
											/>
										</div>

										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Degree / Qualification
											</label>
											<input
												type="text"
												value={edu.degree}
												onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
												placeholder="e.g. ปริญญาตรีบริหารธุรกิจบัณฑิต / Bachelor of Business Administration"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
											/>
										</div>

										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Field of Study / Major
											</label>
											<input
												type="text"
												value={edu.major}
												onChange={(e) => handleUpdateEducation(edu.id, 'major', e.target.value)}
												placeholder="e.g. สาขาวิชาการตลาด / Marketing"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
											/>
										</div>

										<div className="grid grid-cols-2 gap-2">
											<div className="space-y-1">
												<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
													GPA (Optional)
												</label>
												<input
													type="text"
													value={edu.gpa || ''}
													onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
													placeholder="e.g. 3.65"
													className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
												/>
											</div>
											<div className="space-y-1">
												<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
													Location
												</label>
												<input
													type="text"
													value={edu.location}
													onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
													placeholder="e.g. Bangkok"
													className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
												/>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-2">
											<div className="space-y-1">
												<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
													Start Year
												</label>
												<input
													type="text"
													value={edu.startDate}
													onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
													placeholder="e.g. 2016"
													className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
												/>
											</div>
											<div className="space-y-1">
												<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
													End Year
												</label>
												<input
													type="text"
													value={edu.current ? 'Present' : edu.endDate}
													disabled={edu.current}
													onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
													placeholder="e.g. 2020"
													className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:text-slate-400"
												/>
											</div>
										</div>

										<div className="md:col-span-2 flex items-center gap-2 pt-1">
											<input
												type="checkbox"
												id={`current-edu-${edu.id}`}
												checked={edu.current}
												onChange={(e) => handleUpdateEducation(edu.id, 'current', e.target.checked)}
												className="rounded border-slate-300 dark:border-slate-600 focus:ring-slate-950 dark:focus:ring-slate-400"
											/>
											<label
												htmlFor={`current-edu-${edu.id}`}
												className="text-xs text-slate-600 dark:text-slate-300 font-medium">
												I am currently studying here / ยังกำลังศึกษาอยู่
											</label>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === 'skills' && (
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Skills
							</h3>
							<button
								onClick={handleAddSkill}
								className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer">
								<Plus className="h-3 w-3" />
								<span>Add Skill</span>
							</button>
						</div>

						<p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
							Organize your skills into three main categories:
							<br />• <strong>Core</strong>: Essential functional skills (e.g., Sales Pipeline, Customer
							Relations)
							<br />• <strong>Tools</strong>: Software and tools (e.g., Salesforce CRM, SAP, Excel)
							<br />• <strong>Soft</strong>: Interpersonal skills (e.g., Negotiation, Collaboration)
						</p>

						<div className="grid grid-cols-1 gap-2.5">
							{data.skills.map((s) => (
								<div
									key={s.id}
									className="flex gap-2 items-center p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg">
									<select
										value={s.category}
										onChange={(e) => handleUpdateSkill(s.id, 'category', e.target.value)}
										className="text-xs px-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-200">
										<option value="Core">Core</option>
										<option value="Tools">Tools</option>
										<option value="Soft">Soft</option>
									</select>

									<input
										type="text"
										value={s.name}
										onChange={(e) => handleUpdateSkill(s.id, 'name', e.target.value)}
										placeholder="Skill name"
										className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-slate-400"
									/>

									<button
										onClick={() => handleRemoveSkill(s.id)}
										className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded cursor-pointer"
										title="Remove Skill">
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === 'languages' && (
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Languages
							</h3>
							<button
								onClick={handleAddLanguage}
								className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer">
								<Plus className="h-3 w-3" />
								<span>Add Language</span>
							</button>
						</div>

						<div className="grid grid-cols-1 gap-2.5">
							{data.languages.map((l) => (
								<div
									key={l.id}
									className="flex gap-2 items-center p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg">
									<input
										type="text"
										value={l.name}
										onChange={(e) => handleUpdateLanguage(l.id, 'name', e.target.value)}
										placeholder="Language name (e.g. English)"
										className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-slate-400 font-semibold"
									/>

									<input
										type="text"
										value={l.proficiency}
										onChange={(e) => handleUpdateLanguage(l.id, 'proficiency', e.target.value)}
										placeholder="Proficiency (e.g. Native, Fluent)"
										className="w-1/3 text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-slate-400"
									/>

									<button
										onClick={() => handleRemoveLanguage(l.id)}
										className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded cursor-pointer"
										title="Remove">
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === 'certs' && (
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Awards & Certifications
							</h3>
							<button
								onClick={handleAddCert}
								className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer">
								<Plus className="h-3 w-3" />
								<span>Add Award</span>
							</button>
						</div>

						<div className="space-y-4">
							{data.projectsOrCerts.map((c, idx) => (
								<div
									key={c.id}
									className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 space-y-3 relative">
									<div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
										<span className="text-xs font-bold text-slate-700 dark:text-slate-200">
											Item #{idx + 1}
										</span>
										<button
											onClick={() => handleRemoveCert(c.id)}
											className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded cursor-pointer">
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Title
											</label>
											<input
												type="text"
												value={c.title}
												onChange={(e) => handleUpdateCert(c.id, 'title', e.target.value)}
												placeholder="Certificate Title"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
											/>
										</div>

										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Issuer / Organization
											</label>
											<input
												type="text"
												value={c.issuerOrCompany}
												onChange={(e) => handleUpdateCert(c.id, 'issuerOrCompany', e.target.value)}
												placeholder="e.g. Salesforce / Udemy"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
											/>
										</div>

										<div className="space-y-1">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Completion Date
											</label>
											<input
												type="text"
												value={c.date}
												onChange={(e) => handleUpdateCert(c.id, 'date', e.target.value)}
												placeholder="e.g. 2023"
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
											/>
										</div>

										<div className="space-y-1 md:col-span-2">
											<label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
												Brief Description
											</label>
											<textarea
												rows={2}
												value={c.description}
												onChange={(e) => handleUpdateCert(c.id, 'description', e.target.value)}
												placeholder="Add some details..."
												className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
