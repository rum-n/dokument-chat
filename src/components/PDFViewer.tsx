"use client";

import React from "react";
import { FileText, MessageCircle, Search } from "lucide-react";

interface PDF {
  pdf_id: string;
  filename: string;
  upload_date: string;
  file_size: number;
  total_pages?: number;
  total_chunks?: number;
}

interface PDFViewerProps {
  selectedPDF: PDF | null;
  onPDFSelect: (pdf: PDF | null) => void;
  pdfs: PDF[];
}

function PDFViewer({
  selectedPDF,
  onPDFSelect,
  pdfs,
}: PDFViewerProps): React.JSX.Element {
  if (!selectedPDF) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No PDF Selected</p>
          <p className="text-sm">
            {pdfs.length > 0
              ? "Select a PDF from the list to view its details"
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
              {selectedPDF.total_pages
                ? `${selectedPDF.total_pages} pages`
                : "Processing..."}{" "}
              •{" "}
              {selectedPDF.total_chunks
                ? `${selectedPDF.total_chunks} chunks`
                : "Processing..."}
            </p>
          </div>
        </div>
      </div>

      {/* PDF Info Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Document Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Document Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Filename:</span>
                <span className="font-medium">{selectedPDF.filename}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upload Date:</span>
                <span className="font-medium">
                  {new Date(selectedPDF.upload_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">File Size:</span>
                <span className="font-medium">
                  {(selectedPDF.file_size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              {selectedPDF.total_pages && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Pages:</span>
                  <span className="font-medium">{selectedPDF.total_pages}</span>
                </div>
              )}
              {selectedPDF.total_chunks && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Text Chunks:</span>
                  <span className="font-medium">
                    {selectedPDF.total_chunks}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-900">
                  Document Processed
                </h4>
                <p className="text-sm text-green-700">
                  This document has been processed and is ready for AI chat. You
                  can now ask questions about its content.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Ready for Chat</h4>
                <p className="text-sm text-blue-700">
                  Use the chat interface below to ask questions about this
                  document. The AI will search through the content and provide
                  answers with page references.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Search className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-purple-900">
                  AI-Powered Search
                </h4>
                <p className="text-sm text-purple-700">
                  The document content has been analyzed and indexed. Ask
                  questions in natural language and get intelligent answers with
                  page references.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
