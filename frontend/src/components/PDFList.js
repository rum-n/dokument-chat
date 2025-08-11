import React, { useState } from "react";
import { FileText, Trash2, Download, Eye, RefreshCw } from "lucide-react";

function PDFList({ pdfs, loading, onPDFSelect, onPDFDeleted, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (pdfId) => {
    if (
      !confirm(
        "Are you sure you want to delete this PDF? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(pdfId);

    try {
      const response = await fetch(`/pdf/${pdfId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        onPDFDeleted(pdfId);
      } else {
        const error = await response.json();
        alert(`Failed to delete PDF: ${error.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete PDF. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (pdfId, filename) => {
    try {
      const response = await fetch(`/pdf/${pdfId}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
          <span className="text-gray-600">Loading PDFs...</span>
        </div>
      </div>
    );
  }

  if (pdfs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No PDFs uploaded
          </h3>
          <p className="text-gray-600 mb-4">
            Upload your first PDF document to get started with AI-powered Q&A.
          </p>
          <button
            onClick={onRefresh}
            className="btn-primary flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Your PDF Documents ({pdfs.length})
          </h3>
          <button
            onClick={onRefresh}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {pdfs.map((pdf) => (
          <div key={pdf.pdf_id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {pdf.filename}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{pdf.total_pages} pages</span>
                    <span>{pdf.total_chunks} chunks</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Processed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onPDFSelect(pdf)}
                  className="btn-secondary flex items-center text-xs"
                  title="View PDF"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>

                <button
                  onClick={() => handleDownload(pdf.pdf_id, pdf.filename)}
                  className="btn-secondary flex items-center text-xs"
                  title="Download PDF"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </button>

                <button
                  onClick={() => handleDelete(pdf.pdf_id)}
                  disabled={deletingId === pdf.pdf_id}
                  className="btn-secondary flex items-center text-xs text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                  title="Delete PDF"
                >
                  {deletingId === pdf.pdf_id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                  ) : (
                    <Trash2 className="h-3 w-3 mr-1" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Tip:</strong> Click "View" to open a PDF in the viewer, or
            use it for chat.
          </p>
          <p>
            Each PDF is processed into searchable chunks that the AI can use to
            answer your questions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PDFList;
