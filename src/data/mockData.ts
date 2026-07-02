import { ResumeData } from '../types';
import rawData from '../data/mockResumeData.json';

interface MockDataSet {
	th: ResumeData;
	en: ResumeData;
}

const data = rawData as MockDataSet;

export const thaiMockResume: ResumeData = data.th;
export const englishMockResume: ResumeData = data.en;
