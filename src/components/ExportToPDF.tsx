import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Props {
    elementId: string;
    fileName?: string;
}

export default function ExportToPDF({ elementId, fileName = "resume.pdf" }: Props) {

    const exportPDF = async () => {
        const element = document.getElementById(elementId);
        if (!element) return;

        // створюємо canvas з DOM
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
        });

        const img = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = 210;
        const pageHeight = 297;

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let position = 0;

        pdf.addImage(img, "PNG", 0, position, imgWidth, imgHeight);

        if (imgHeight > pageHeight) {
            let heightLeft = imgHeight - pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(img, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
        }

        pdf.save(fileName);
    };

    return (
        <button className="purple-btn" onClick={exportPDF}>
            PDF
        </button>
    );
}
