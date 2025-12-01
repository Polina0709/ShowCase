import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import bg from "../assets/bg.jpg";

interface Props {
    targetRef: React.RefObject<HTMLDivElement | null>;
    fileName?: string;
    className?: string;
}

export default function ExportToPDF({ targetRef, fileName = "resume.pdf", className }: Props) {
    const [loading, setLoading] = useState(false);

    const generatePDF = async () => {
        if (!targetRef.current) return;

        setLoading(true);

        const original = targetRef.current;
        const clone = original.cloneNode(true) as HTMLElement;

        // Remove video & buttons
        clone.querySelectorAll(".pr-video").forEach(el => el.remove());
        clone.querySelectorAll("button").forEach(el => el.remove());

        // Clean sizing
        clone.style.width = "794px"; // A4 width in px
        clone.style.boxSizing = "border-box";
        clone.style.margin = "0 auto";

        clone.style.position = "absolute";
        clone.style.top = "-100000px";
        clone.style.left = "-100000px";
        document.body.appendChild(clone);

        await new Promise(res => setTimeout(res, 100));

        // PDF setup
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // margins
        const marginTop = 12;
        const marginBottom = 12;
        const marginLeft = 10;
        const marginRight = 10;
        const contentWidth = pageWidth - marginLeft - marginRight;

        let currentY = marginTop;

        // Load background image
        const bgImg = new Image();
        bgImg.src = bg;
        await new Promise<void>(resolve => {
            bgImg.onload = () => resolve();
        });

        const drawBackground = () => {
            pdf.addImage(bgImg, "JPEG", 0, 0, pageWidth, pageHeight);
        };

        drawBackground();

        // Collect blocks: userCard + all pr-card
        const blocks: HTMLElement[] = [];

        const userCard = clone.querySelector(".pr-user-card") as HTMLElement | null;
        if (userCard) blocks.push(userCard);

        const sectionCards = Array.from(clone.querySelectorAll(".pr-card")) as HTMLElement[];
        blocks.push(...sectionCards);

        for (const block of blocks) {
            const canvas = await html2canvas(block, {
                scale: 2,
                useCORS: true,
                backgroundColor: null
            });

            const imgData = canvas.toDataURL("image/png");
            const props = pdf.getImageProperties(imgData);

            const imgHeightMm = (props.height * contentWidth) / props.width;

            // If block doesn't fit → new page
            if (currentY + imgHeightMm > pageHeight - marginBottom) {
                pdf.addPage();
                drawBackground();
                currentY = marginTop;
            }

            // Render block with margins
            pdf.addImage(imgData, "PNG", marginLeft, currentY, contentWidth, imgHeightMm);

            const links = Array.from(block.querySelectorAll("a")) as HTMLAnchorElement[];

            links.forEach(link => {
                const href = link.href;
                if (!href) return;

                const rect = link.getBoundingClientRect();
                const blockRect = block.getBoundingClientRect();

                // Position inside block
                const offsetX = rect.left - blockRect.left;
                const offsetY = rect.top - blockRect.top;

                // Convert px → mm (canvas scaling)
                const mmX = (offsetX * (contentWidth / props.width));
                const mmY = (offsetY * (imgHeightMm / props.height));

                const mmWidth = (rect.width * (contentWidth / props.width));
                const mmHeight = (rect.height * (imgHeightMm / props.height));

                pdf.link(
                    marginLeft + mmX,
                    currentY + mmY,
                    mmWidth,
                    mmHeight,
                    { url: href }
                );
            });

            currentY += imgHeightMm + 4;
        }

        pdf.save(fileName);

        document.body.removeChild(clone);
        setLoading(false);
    };

    return (
        <button
            className={`purple-btn ${className ?? ""}`}
            onClick={generatePDF}
            disabled={loading}
        >
            {loading ? "Generating..." : "PDF"}
        </button>
    );
}






