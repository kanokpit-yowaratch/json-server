'use client';

import { Award, TrendingUp, HeartHandshake, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function GuidePanel() {
	return (
		<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-5 space-y-3 sm:space-y-5 text-slate-600 dark:text-slate-300 animate-fadeIn text-[11px] sm:text-xs leading-relaxed">
			<div>
				<h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 mb-1">
					<Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
					<span>คู่มือ Support Sale</span>
				</h3>
				<p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px]">
					เรซูเม่นี้ออกแบบมาให้ตอบโจทย์เกณฑ์หลักในการรับสมัครงาน โดยมุ่งเน้น 3 มิติสำคัญ:
				</p>
			</div>

			<div className="space-y-1 p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
				<div className="flex items-start gap-1.5 sm:gap-2 text-slate-900 dark:text-white font-bold">
					<TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0 mt-0.5" />
					<span>1. การดูแลและผลักดันยอดขาย</span>
				</div>
				<p className="text-slate-500 dark:text-slate-400 pl-5 sm:pl-6">
					ในข้อมูลตัวอย่าง ได้มีการเขียนระบุถึงการ วิเคราะห์ความเคลื่อนไหวของยอดขาย B2B และการเสนอ
					โปรโมชันพิเศษ (Upselling) แก่ลูกค้าเดิมเพื่อกระตุ้นให้สั่งซื้อซ้ำ
					ส่งผลให้ยอดขายรวมเพิ่มขึ้นและทีมบรรลุเป้าหมายที่บริษัทกำหนดได้อย่างเป็นรูปธรรม
				</p>
			</div>

			<div className="space-y-1 p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
				<div className="flex items-start gap-1.5 sm:gap-2 text-slate-900 dark:text-white font-bold">
					<HeartHandshake className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400 shrink-0 mt-0.5" />
					<span>2. การประสานงานลูกค้า</span>
				</div>
				<p className="text-slate-500 dark:text-slate-400 pl-5 sm:pl-6">
					แสดงถึงทักษะการทำงานร่วมกับคลังสินค้า บัญชี ขนส่ง และลูกค้าในระบบ Order-to-Cash มีตัววัดผลเป็นตัวเลข
					(Metrics) ชัดเจน เช่น "ลดข้อผิดพลาดด้านการออกเอกสารลง 15%" และ "เพิ่มความพึงพอใจลูกค้าขึ้นเป็น 96%"
				</p>
			</div>

			<div className="space-y-1 p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
				<div className="flex items-start gap-1.5 sm:gap-2 text-slate-900 dark:text-white font-bold">
					<CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0 mt-0.5" />
					<span>3. การบรรลุเป้าหมายตามกำหนด</span>
				</div>
				<p className="text-slate-500 dark:text-slate-400 pl-5 sm:pl-6">
					เน้นทักษะการใช้ซอฟต์แวร์วิชาชีพ เช่น Salesforce CRM และ SAP ERP
					ในการจัดการข้อมูลเพื่อตอบสนองอย่างรวดเร็ว พร้อมแสดงความยืดหยุ่นในการสนับสนุนงานแอดมิน
					เพื่อความราบรื่นของทีมขาย B2B/B2C
				</p>
			</div>

			<div className="p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 sm:gap-2.5">
				<ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0 mt-0.5" />
				<div>
					<h4 className="font-bold text-amber-600 dark:text-amber-300 text-[11px] sm:text-xs">คำแนะนำ PDF</h4>
					<p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
						เมื่อคลิกปุ่ม <strong>ดาวน์โหลด PDF</strong> ระบบจะเรนเดอร์เอกสาร A4
						และดาวน์โหลดให้คุณโดยอัตโนมัติ คุณสามารถปรับระยะขอบหรือขนาดตัวอักษรในส่วนสไตล์ตบแต่งได้
					</p>
				</div>
			</div>
		</div>
	);
}
