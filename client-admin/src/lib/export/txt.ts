import { ResumeData } from '@shared/schema';

function s(str: string | undefined | null) {
  return str || '';
}

function section(title: string, content: string) {
  if (!content.trim()) return '';
  return `
========================================
${title.toUpperCase()}
========================================
${content}
`;
}

export function exportAsTxt(resumeData: ResumeData, fileName: string) {
  const { personalInfo, experience, education, skills, languages, customSections } = resumeData;

  const personal = `
${s(personalInfo?.firstName)} ${s(personalInfo?.lastName)}
${s(personalInfo?.title)}

Email: ${s(personalInfo?.email)}
Phone: ${s(personalInfo?.phone)}
Address: ${s(personalInfo?.address)}
`;

  const summary = section('Professional Summary', s(personalInfo?.summary));

  const exp = section('Experience', experience.map(e => `
----------------------------------------
${s(e.position)} at ${s(e.company)}
${s(e.startDate)} - ${s(e.endDate) || 'Present'}
${s(e.description)}
`).join(''));

  const edu = section('Education', education.map(e => `
----------------------------------------
${s(e.degree)} in ${s(e.school)}
${s(e.startDate)} - ${s(e.endDate) || 'Present'}
`).join(''));

  const skillStr = section('Skills', skills.map(s => s.name).join(', '));

  const lang = section('Languages', languages.map(l => `${l.name} (${l.proficiency})`).join(', '));

  const custom = customSections.map(c => section(s(c.title), s(c.content))).join('');

  const fullText = [personal, summary, exp, edu, skillStr, lang, custom].join('').trim();

  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 