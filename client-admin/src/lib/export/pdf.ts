import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeData } from '@shared/schema';
import ResumePreview from '@/components/resume/ResumePreview';

export async function exportAsPdf(resumeData: ResumeData, templateCode: string, fileName: string) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  const root = createRoot(container);

  try {
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(React.StrictMode, {},
          React.createElement('div', 
            { style: { width: '800px', height: '1131px' } },
            React.createElement(ResumePreview, { 
              resumeData: resumeData, 
              templateCode: templateCode 
            })
          )
        )
      );
      setTimeout(resolve, 1000); 
    });

    const canvas = await html2canvas(container.children[0] as HTMLElement, {
      scale: 2, // Good quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgWidth = 210; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0), // Maximum JPEG quality
      'JPEG',
      0,
      0,
      imgWidth,
      imgHeight
    );
    pdf.save(fileName);

  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
} 