'use client';

import { DesignConfig, LayoutTemplate, FontPairing } from '../types';
import { COLOR_THEMES } from '../data/themes';
import { Columns, Layers, Type, ZoomIn, Eye, Image } from 'lucide-react';

interface DesignConfiguratorProps {
	config: DesignConfig;
	onChange: (newConfig: DesignConfig) => void;
	disabled?: boolean;
}

export default function DesignConfigurator({ config, onChange, disabled = false }: DesignConfiguratorProps) {
	const updateConfig = (field: keyof DesignConfig, value: any) => {
		onChange({
			...config,
			[field]: value,
		});
	};

	const templates: { id: LayoutTemplate; label: string; desc: string }[] = [
		{ id: 'minimal', label: 'Minimalist Single', desc: 'Clean, classical single-column layout' },
		{ id: 'professional', label: 'Split Columns', desc: 'Modern split panel structure with header bar' },
		{ id: 'sidebar-left', label: 'Left Sidebar', desc: 'Sleek tinted sidebar on the left side' },
		{ id: 'sidebar-right', label: 'Right Sidebar', desc: 'Sleek tinted sidebar on the right side' },
		{ id: 'elegant-serif', label: 'Elegant Editorial', desc: 'Editorial serif headings with gold accents' },
	];

	const fontPairings: { id: FontPairing; label: string; desc: string }[] = [
		{ id: 'sans', label: 'Modern Sans (Inter)', desc: 'Extremely clean and highly readable' },
		{ id: 'serif', label: 'Editorial Serif (Lora)', desc: 'Elegant, executive, and luxury vibe' },
		{ id: 'mono', label: 'Sleek Tech (Mono)', desc: 'Technical monospace, crisp details' },
	];

	return (
		<div
			className={`bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-5 shadow-sm space-y-4 sm:space-y-6 transition-all ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
			<div>
				<h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
					<Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-800 dark:text-slate-300" />
					<span>Design Stylist</span>
				</h3>
				<p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
					Customize layout, color accents, and font metrics.
				</p>
			</div>

			<div className="space-y-1.5 sm:space-y-2">
				<label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
					<Columns className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
					<span>Layout Template</span>
				</label>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{templates.map((t) => (
						<button
							key={t.id}
							onClick={() => updateConfig('template', t.id)}
							className={`p-3 rounded-xl border text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
								config.template === t.id
									? 'border-slate-900 bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-950 dark:ring-slate-400'
									: 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900'
							}`}>
							<p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{t.label}</p>
							<p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{t.desc}</p>
						</button>
					))}
				</div>
			</div>

			<div className="space-y-1.5 sm:space-y-2">
				<label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
					<div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-indigo-600" />
					<span>Color Palette</span>
				</label>
				<div className="grid grid-cols-2 gap-1.5 sm:gap-2">
					{COLOR_THEMES.map((theme) => {
						const isSelected = config.themeId === theme.id;
						return (
							<button
								key={theme.id}
								onClick={() => updateConfig('themeId', theme.id)}
								className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border flex items-center gap-1.5 sm:gap-2.5 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
									isSelected
										? 'border-slate-900 bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-950 dark:ring-slate-400'
										: 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900'
								}`}>
								<div className="flex -space-x-1">
									<div
										className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 rounded-full border border-white"
										style={{ backgroundColor: theme.primary }}
									/>
									<div
										className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 rounded-full border border-white"
										style={{ backgroundColor: theme.accent }}
									/>
									<div
										className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 rounded-full border border-white"
										style={{ backgroundColor: theme.bgLight }}
									/>
								</div>
								<div className="leading-none overflow-hidden min-w-0">
									<p className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-none">
										{theme.name.split(' (')[0]}
									</p>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			<div className="space-y-1.5 sm:space-y-2">
				<label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
					<Type className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
					<span>Font Pairing</span>
				</label>
				<div className="space-y-1 sm:space-y-1.5">
					{fontPairings.map((fp) => (
						<button
							key={fp.id}
							onClick={() => updateConfig('fontPairing', fp.id)}
							className={`w-full p-2 sm:p-2.5 rounded-lg sm:rounded-xl border text-left transition-all flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
								config.fontPairing === fp.id
									? 'border-slate-900 bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-950 dark:ring-slate-400'
									: 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900'
							}`}>
							<div className="min-w-0">
								<p className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">{fp.label}</p>
								<p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">{fp.desc}</p>
							</div>
							<span
								className={`text-[11px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded shrink-0 ${
									fp.id === 'sans' ? 'font-sans' : fp.id === 'serif' ? 'font-serif' : 'font-mono'
								} bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200`}>
								Aa
							</span>
						</button>
					))}
				</div>
			</div>

			<div className="space-y-1.5 sm:space-y-2">
				<label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
					<ZoomIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
					<span>Spacing</span>
				</label>
				<div className="grid grid-cols-3 gap-1.5 sm:gap-2">
					{(['compact', 'comfortable', 'loose'] as const).map((density) => (
						<button
							key={density}
							onClick={() => updateConfig('spacing', density)}
							className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg border text-[11px] sm:text-xs font-semibold transition-all capitalize cursor-pointer ${
								config.spacing === density
									? 'border-slate-900 dark:border-slate-400 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white ring-1 ring-slate-950 dark:ring-slate-400'
									: 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
							}`}>
							{density}
						</button>
					))}
				</div>
			</div>

			<div className="space-y-1.5 sm:space-y-2 pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700">
				<label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
					<Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
					<span>Display</span>
				</label>

				<div className="space-y-1.5 sm:space-y-2">
					<label className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 font-semibold cursor-pointer select-none py-1">
						<input
							type="checkbox"
							checked={config.showSectionHeaders}
							onChange={(e) => updateConfig('showSectionHeaders', e.target.checked)}
							className="rounded border-slate-300 dark:border-slate-600 focus:ring-slate-950 dark:focus:ring-slate-400 shrink-0"
						/>
						<span>Show Section Headers</span>
					</label>

					<label className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 font-semibold cursor-pointer select-none py-1">
						<input
							type="checkbox"
							checked={config.showAvatar}
							onChange={(e) => updateConfig('showAvatar', e.target.checked)}
							className="rounded border-slate-300 dark:border-slate-600 focus:ring-slate-950 dark:focus:ring-slate-400 shrink-0"
						/>
						<span className="flex items-center gap-1">
							<Image className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
							Show Profile Photo
						</span>
					</label>
				</div>
			</div>
		</div>
	);
}
