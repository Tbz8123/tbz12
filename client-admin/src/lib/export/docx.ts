import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '@shared/schema';

function s(str: string | undefined | null): string {
  return str || '';
}

function createSection(title: string, children: any[]) {
  if (children.every(c => !c)) return [];
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: title, bold: true })],
      spacing: { before: 400, after: 200 },
    }),
    ...children.filter(c => !!c)
  ];
}

export async function exportAsDocx(resumeData: ResumeData, fileName: string) {
  const { personalInfo, experience, education, skills, languages, customSections } = resumeData;

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({ text: `${s(personalInfo?.firstName)} ${s(personalInfo?.lastName)}`, size: 48 }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: s(personalInfo?.title), bold: true, size: 24 })],
        }),
        new Paragraph({
          text: `Email: ${s(personalInfo?.email)} | Phone: ${s(personalInfo?.phone)} | Address: ${s(personalInfo?.address)}`,
          spacing: { after: 400 },
        }),

        ...createSection('Professional Summary', [
          new Paragraph(s(personalInfo?.summary)),
        ]),

        ...createSection('Experience', 
          experience.flatMap(e => [
            new Paragraph({
              children: [new TextRun({ text: s(e.position), bold: true })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `${s(e.company)} | ${s(e.startDate)} - ${s(e.endDate) || 'Present'}` })],
            }),
            new Paragraph({ text: s(e.description), spacing: { after: 200 } }),
          ])
        ),

        ...createSection('Education', 
          education.flatMap(e => [
            new Paragraph({
              children: [new TextRun({ text: s(e.degree), bold: true })],
            }),
            new Paragraph({ text: `${s(e.school)} | ${s(e.startDate)} - ${s(e.endDate) || 'Present'}`, spacing: { after: 200 } }),
          ])
        ),

        ...createSection('Skills', [
          new Paragraph(skills.map(s => s.name).join(', ')),
        ]),

        ...createSection('Languages', [
          new Paragraph(languages.map(l => `${l.name} (${l.proficiency})`).join(', ')),
        ]),

        ...customSections.flatMap(section => createSection(s(section.title), [new Paragraph(s(section.content))])),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
} 