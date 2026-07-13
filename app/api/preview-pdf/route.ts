import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function GET(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams;
  const fileUrl = urlParams.get("url");

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // Construct absolute URL if it is a relative path
    let absoluteUrl = fileUrl;
    if (!absoluteUrl.startsWith("http")) {
      const origin = request.nextUrl.origin;
      absoluteUrl = `${origin}${absoluteUrl.startsWith('/') ? '' : '/'}${absoluteUrl}`;
    }

    // Fetch the original PDF
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    
    // Load the PDF into pdf-lib
    const sourcePdf = await PDFDocument.load(arrayBuffer);
    
    // Create a new empty document
    const previewPdf = await PDFDocument.create();

    // Determine how many pages to copy (limit to 5)
    const pageCount = sourcePdf.getPageCount();
    const previewCount = Math.min(5, pageCount);
    const pageIndices = Array.from({ length: previewCount }, (_, i) => i);

    // Copy the pages
    const copiedPages = await previewPdf.copyPages(sourcePdf, pageIndices);
    copiedPages.forEach((page) => previewPdf.addPage(page));

    // Serialize the new document
    const pdfBytes = await previewPdf.save();

    // Return the truncated PDF
    return new NextResponse(pdfBytes as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=\"preview.pdf\"",
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
      },
    });
  } catch (error) {
    console.error("PDF Preview Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF preview" }, { status: 500 });
  }
}
