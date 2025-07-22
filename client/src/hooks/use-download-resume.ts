import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const useDownloadResume = () => {
  const downloadPDF = async (element: HTMLElement, fileName: string) => {
    if (!element) {
      return;
    }

    try {
      // Show loading state (you could expand this with a loading indicator)
      console.log('Generating PDF...');

      const canvas = await html2canvas(element, {
        scale: 2, // Good quality
        useCORS: true,
        logging: false, // Disable logging for cleaner output
        allowTaint: true,
        backgroundColor: '#ffffff', // Ensure white background
      });

      // Create PDF with A4 dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add the image to PDF as JPEG with maximum quality
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save(fileName);
      console.log('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return { downloadPDF };
}; 