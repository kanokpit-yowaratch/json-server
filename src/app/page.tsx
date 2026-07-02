'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ResumeData, DesignConfig } from '../types';
import { thaiMockResume as thaiDefault, englishMockResume as enDefault } from '../data/mockData';
import ResumeEditor from '../components/ResumeEditor';
import DesignConfigurator from '../components/DesignConfigurator';
import GuidePanel from '../components/GuidePanel';
import ResumePreview from '../components/ResumePreview';
import { exportToPdf } from '../utils/pdfExport';
import { FileText, Download, Printer, Settings, HelpCircle, Eye, Sun, Moon, Save, Check } from 'lucide-react';

export default function Home() {
	const [currentLanguage, setCurrentLanguage] = useState<'th' | 'en'>('th');
	const [thaiResume, setThaiResume] = useState<ResumeData>(thaiDefault);
	const [englishResume, setEnglishResume] = useState<ResumeData>(enDefault);

	const resumeData = currentLanguage === 'th' ? thaiResume : englishResume;

	const handleResumeChange = (newData: ResumeData) => {
		if (currentLanguage === 'th') {
			setThaiResume(newData);
		} else {
			setEnglishResume(newData);
		}
	};

	const handleResetToDefault = () => {
		if (currentLanguage === 'th') {
			setThaiResume(thaiDefault);
		} else {
			setEnglishResume(enDefault);
		}
	};

	const [designConfig, setDesignConfig] = useState<DesignConfig>({
		template: 'minimal',
		themeId: 'obsidian',
		fontPairing: 'sans',
		spacing: 'comfortable',
		showSectionHeaders: true,
		showAvatar: true,
	});

	const [isDarkMode, setIsDarkMode] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem('resume_builder_dark_mode');
		if (saved !== null) {
			setIsDarkMode(JSON.parse(saved));
		} else {
			setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
		}
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.classList.toggle('dark', isDarkMode);
		localStorage.setItem('resume_builder_dark_mode', JSON.stringify(isDarkMode));
	}, [isDarkMode, mounted]);

	const [isLoadedFromServer, setIsLoadedFromServer] = useState(false);

	useEffect(() => {
		const localDataRaw = localStorage.getItem('resume_builder_data');
		if (localDataRaw) {
			try {
				const parsed = JSON.parse(localDataRaw);
				if (parsed.th) setThaiResume(parsed.th);
				if (parsed.en) setEnglishResume(parsed.en);
				if (parsed.designConfig) setDesignConfig(parsed.designConfig);
				setIsLoadedFromServer(true);
				return;
			} catch (e) {
				console.warn('Failed to parse localStorage data', e);
			}
		}

		async function loadFromApi() {
			try {
				const response = await fetch('/api/resume');
				const result = await response.json();
				if (result.success && result.data) {
					if (result.data.th) setThaiResume(result.data.th);
					if (result.data.en) setEnglishResume(result.data.en);
					if (result.data.designConfig) setDesignConfig(result.data.designConfig);
				}
			} catch (error) {
				console.info('Using default mock data (API unavailable)');
			} finally {
				setIsLoadedFromServer(true);
			}
		}

		loadFromApi();
	}, []);

	useEffect(() => {
		if (!isLoadedFromServer) return;

		const saveData = () => {
			const payload = {
				th: thaiResume,
				en: englishResume,
				designConfig: designConfig,
			};
			localStorage.setItem('resume_builder_data', JSON.stringify(payload));
		};

		window.addEventListener('beforeunload', saveData);
		return () => window.removeEventListener('beforeunload', saveData);
	}, [thaiResume, englishResume, designConfig, isLoadedFromServer]);

	const [activeSidebarTab, setActiveSidebarTab] = useState<'content' | 'design' | 'guide'>('content');
	const [isExporting, setIsExporting] = useState(false);
	const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
	const isSaving = saveStatus === 'saving';

	const previewContainerRef = useRef<HTMLDivElement>(null);
	const [previewScale, setPreviewScale] = useState(1);

	const updatePreviewScale = useCallback(() => {
		if (!previewContainerRef.current) return;
		const containerWidth = previewContainerRef.current.clientWidth;
		const scale = Math.min(1, (containerWidth - 32) / 794);
		setPreviewScale(Math.max(0.3, scale));
	}, []);

	useEffect(() => {
		updatePreviewScale();
		const observer = new ResizeObserver(updatePreviewScale);
		if (previewContainerRef.current) {
			observer.observe(previewContainerRef.current);
		}
		window.addEventListener('resize', updatePreviewScale);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', updatePreviewScale);
		};
	}, [updatePreviewScale]);

	const handleExportPdf = async () => {
		setIsExporting(true);
		try {
			const safeName = resumeData.personalInfo.name.replace(/\s+/g, '_') || 'Resume';
			await exportToPdf('resume-print-area', `Resume_${safeName}.pdf`);
		} catch (err) {
			alert('เกิดข้อผิดพลาดในการดาวน์โหลด PDF กรุณาลองใหม่อีกครั้ง');
			console.error(err);
		} finally {
			setIsExporting(false);
		}
	};

	const handleBrowserPrint = () => {
		window.print();
	};

	const handleSave = async () => {
		setSaveStatus('saving');
		const payload = {
			th: thaiResume,
			en: englishResume,
			designConfig: designConfig,
		};
		localStorage.setItem('resume_builder_data', JSON.stringify(payload));
		try {
			await fetch('/api/resume', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			localStorage.removeItem('resume_builder_data');
		} catch {
			// API unavailable — localStorage kept as fallback
		}
		setSaveStatus('saved');
		setTimeout(() => setSaveStatus('idle'), 2000);
	};

	if (!mounted) {
		return null;
	}

	return (
		<div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900 overflow-x-hidden">
			<header className="no-print sticky top-0 z-40 bg-white/80 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2 sm:py-4 backdrop-blur-sm">
				<div className="flex items-center justify-between gap-2 sm:gap-4">
					<div className="flex items-center gap-2 sm:gap-3 min-w-0">
						<div className="p-1.5 sm:p-2 bg-amber-500 rounded-xl text-slate-950 shadow-md shadow-amber-500/10 shrink-0">
							<FileText className="h-4 w-4 sm:h-5 sm:w-5" />
						</div>
						<h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
							Resume Builder
						</h1>
					</div>

					<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
						<div
							className={`flex bg-slate-100 dark:bg-slate-900 p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-slate-800 ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
							<button
								onClick={() => setCurrentLanguage('th')}
								disabled={isSaving}
								className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
									currentLanguage === 'th'
										? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
										: 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
								}`}>
								<span className="hidden xs:inline">🇹🇭</span>
								<span className="sm:hidden">TH</span>
								<span className="hidden sm:inline">🇹🇭 ภาษาไทย (TH)</span>
							</button>
							<button
								onClick={() => setCurrentLanguage('en')}
								disabled={isSaving}
								className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
									currentLanguage === 'en'
										? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
										: 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
								}`}>
								<span className="hidden xs:inline">🇺🇸</span>
								<span className="sm:hidden">EN</span>
								<span className="hidden sm:inline">🇺🇸 English (EN)</span>
							</button>
						</div>

						<button
							onClick={() => setIsDarkMode((prev: boolean) => !prev)}
							disabled={isSaving}
							className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:pointer-events-none"
							title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
							{isDarkMode ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
						</button>

						<button
							onClick={handleBrowserPrint}
							disabled={isSaving}
							className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:pointer-events-none"
							title="Use browser print dialog">
							<Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span className="hidden lg:inline">Print / พิมพ์</span>
						</button>

						<button
							onClick={handleSave}
							disabled={saveStatus === 'saving'}
							className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition-all cursor-pointer border border-emerald-400/50 disabled:opacity-60 shrink-0"
							title="Save data">
							{saveStatus === 'saved' ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
							<span className="hidden md:inline">
								{saveStatus === 'saving' ? 'กำลังบันทึก...' : saveStatus === 'saved' ? 'บันทึกแล้ว' : 'บันทึก'}
							</span>
						</button>
					</div>
				</div>
			</header>

			<main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
				<div className="no-print lg:col-span-5 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white/80 dark:bg-slate-950/80 h-full overflow-hidden">
					<div className="flex border-b border-slate-200 dark:border-slate-800 px-2 sm:px-4 bg-white dark:bg-slate-950">
						<button
							onClick={() => setActiveSidebarTab('content')}
							disabled={isSaving}
							className={`flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-4 py-3 text-[11px] sm:text-xs font-semibold border-b-2 cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 ${
								activeSidebarTab === 'content'
									? 'border-amber-500 text-amber-400 font-bold bg-slate-100/40 dark:bg-slate-900/40'
									: 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
							}`}>
							<FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span className="truncate">
								<span className="sm:hidden">เนื้อหา</span>
								<span className="hidden sm:inline">1. แก้ไขข้อมูล<span className="hidden lg:inline"> (Content)</span></span>
							</span>
						</button>

						<button
							onClick={() => setActiveSidebarTab('design')}
							disabled={isSaving}
							className={`flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-4 py-3 text-[11px] sm:text-xs font-semibold border-b-2 cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 ${
								activeSidebarTab === 'design'
									? 'border-amber-500 text-amber-400 font-bold bg-slate-100/40 dark:bg-slate-900/40'
									: 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
							}`}>
							<Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span className="truncate">
								<span className="sm:hidden">ดีไซน์</span>
								<span className="hidden sm:inline">2. ตกแต่งสไตล์<span className="hidden lg:inline"> (Design)</span></span>
							</span>
						</button>

						<button
							onClick={() => setActiveSidebarTab('guide')}
							disabled={isSaving}
							className={`flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-4 py-3 text-[11px] sm:text-xs font-semibold border-b-2 cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 ${
								activeSidebarTab === 'guide'
									? 'border-amber-500 text-amber-400 font-bold bg-slate-100/40 dark:bg-slate-900/40'
									: 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
							}`}>
							<HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span className="truncate">
								<span className="sm:hidden">คู่มือ</span>
								<span className="hidden sm:inline">3. คู่มือตำแหน่งงาน<span className="hidden lg:inline"> (Guide)</span></span>
							</span>
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
						{activeSidebarTab === 'content' && (
							<ResumeEditor
								data={resumeData}
								onChange={handleResumeChange}
								currentLanguage={currentLanguage}
								onResetToDefault={handleResetToDefault}
								disabled={isSaving}
							/>
						)}

						{activeSidebarTab === 'design' && (
							<DesignConfigurator config={designConfig} onChange={setDesignConfig} disabled={isSaving} />
						)}

						{activeSidebarTab === 'guide' && <GuidePanel />}
					</div>
				</div>

				<div className="lg:col-span-7 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
					<div className="no-print p-2 sm:p-3 bg-white/40 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center px-3 sm:px-6">
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
							<Eye className="h-3 w-3" />
							<span className="hidden xs:inline">Live Preview</span>
							<span className="xs:hidden">Preview</span>
						</span>
						<div className="flex items-center gap-1.5 sm:gap-2 text-[10px] text-slate-500 dark:text-slate-400">
							<span className="px-1.5 sm:px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
								A4
							</span>
						</div>
					</div>

					<div
						ref={previewContainerRef}
						className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden overflow-y-auto flex justify-center items-start bg-slate-50 dark:bg-slate-900">
						<div
							id="resume-print-area"
							className="bg-white overflow-hidden origin-top shrink-0 shadow-sm"
							style={{
								width: '794px',
								minHeight: '1123px',
								transform: `scale(${previewScale})`,
								marginBottom: `${(1 - previewScale) * 1123 * -1 + 24}px`,
							}}>
							<ResumePreview data={resumeData} config={designConfig} />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
