import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function PDFViewer({ selectedPDF, onPDFSelect, pdfs }) {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (selectedPDF) {
      loadPDF();
    } else {
      setPdfDocument(null);
      setCurrentPage(1);
      setTotalPages(0);
      setError(null);
    }
  }, [selectedPDF]);

  useEffect(() => {
    if (pdfDocument && currentPage) {
      renderPage();
    }
  }, [pdfDocument, currentPage]);

  const loadPDF = async () => {
    if (!selectedPDF) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/pdf/${selectedPDF.pdf_id}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load PDF");
      }

      const arrayBuffer = await response.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      setPdfDocument(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setError("Failed to load PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async () => {
    if (!pdfDocument || !canvasRef.current) return;

    try {
      const page = await pdfDocument.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const viewport = page.getViewport({ scale: 1.0 });

      // Calculate scale to fit canvas width
      const canvasWidth = canvas.clientWidth;
      const scale = canvasWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error("Error rendering page:", error);
      setError("Failed to render page");
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDownload = async () => {
    if (!selectedPDF) return;

    try {
      const response = await fetch(`/pdf/${selectedPDF.pdf_id}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = selectedPDF.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (!selectedPDF) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No PDF Selected</p>
          <p className="text-sm">
            {pdfs.length > 0
              ? "Select a PDF from the list to view it here"
              : "Upload a PDF to get started"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {selectedPDF.filename}
            </h3>
            <p className="text-sm text-gray-600">
              {totalPages > 0
                ? `${currentPage} of ${totalPages} pages`
                : "Loading..."}
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="btn-secondary flex items-center ml-2"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading PDF...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-600">
              <p className="font-medium">{error}</p>
              <button onClick={loadPDF} className="btn-primary mt-2">
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto p-4">
            <canvas
              ref={canvasRef}
              className="mx-auto border border-gray-200 rounded shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 text-center input-field"
              />
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PDFViewer;
