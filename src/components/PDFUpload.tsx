"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

interface PDF {
  pdf_id: string;
  filename: string;
  upload_date: string;
  file_size: number;
  total_pages?: number;
}

interface UploadStatus {
  type: "success" | "error";
  message: string;
}

interface PDFUploadProps {
  onPDFUploaded?: (pdf: PDF) => void;
}

function PDFUpload({ onPDFUploaded }: PDFUploadProps): React.JSX.Element {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]): Promise<void> => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file type
      if (file.type !== "application/pdf") {
        setUploadStatus({
          type: "error",
          message: "Please upload a PDF file",
        });
        return;
      }

      // Validate file size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        setUploadStatus({
          type: "error",
          message: "File size must be less than 20MB",
        });
        return;
      }

      setUploading(true);
      setUploadStatus(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/pdf/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setUploadStatus({
            type: "success",
            message: `PDF uploaded successfully! ${result.total_pages} pages processed.`,
          });

          if (onPDFUploaded) {
            onPDFUploaded(result);
          }
        } else {
          const error = await response.json();
          setUploadStatus({
            type: "error",
            message: error.error || "Upload failed",
          });
        }
      } catch (error) {
        console.error("Upload error:", error);
        setUploadStatus({
          type: "error",
          message: "Upload failed. Please try again.",
        });
      } finally {
        setUploading(false);
      }
    },
    [onPDFUploaded]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      disabled: uploading,
    });

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? "border-primary-400 bg-primary-50"
            : isDragReject
            ? "border-red-400 bg-red-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
        } ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-4">
            <Loader className="h-12 w-12 text-primary-600 mx-auto animate-spin" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Processing PDF...
              </p>
              <p className="text-sm text-gray-600">
                This may take a few moments
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
              {isDragReject ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : (
                <Upload className="h-6 w-6 text-primary-600" />
              )}
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive
                  ? isDragReject
                    ? "Invalid file type"
                    : "Drop the PDF here"
                  : "Upload PDF Document"}
              </p>
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? isDragReject
                    ? "Please upload a PDF file"
                    : "Release to upload"
                  : "Drag and drop a PDF file, or click to select"}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <FileText className="h-4 w-4" />
              <span>Maximum file size: 20MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div
          className={`p-4 rounded-lg border ${
            uploadStatus.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {uploadStatus.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span className="font-medium">{uploadStatus.message}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          How it works:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload a PDF document (text or scanned)</li>
          <li>• The system will extract text and process it with AI</li>
          <li>
            • Start chatting about the document content in Bulgarian or English
          </li>
          <li>• Get answers with clickable page references</li>
        </ul>
      </div>
    </div>
  );
}

export default PDFUpload;
