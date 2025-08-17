"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PDFUpload from "./PDFUpload";
import PDFViewer from "./PDFViewer";
import ChatInterface from "./ChatInterface";
import PDFList from "./PDFList";
import Profile from "./Profile";
import LanguageSwitcher from "./LanguageSwitcher";
import UpgradeMessage from "./UpgradeMessage";
import { LogOut, FileText, MessageSquare, Upload, User } from "lucide-react";

interface PDF {
  pdf_id: string;
  filename: string;
  upload_date: string;
  file_size: number;
}

type TabType = "upload" | "chat" | "pdfs" | "profile";

function Dashboard(): React.JSX.Element {
  const { user, logout } = useAuth();
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("upload");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pdf/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPdfs(data.pdfs);
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePDFUploaded = (newPDF: PDF): void => {
    setPdfs((prev) => [...prev, newPDF]);
    setSelectedPDF(newPDF);
    setActiveTab("chat");
  };

  const handlePDFDeleted = (pdfId: string): void => {
    setPdfs((prev) => prev.filter((pdf) => pdf.pdf_id !== pdfId));
    if (selectedPDF && selectedPDF.pdf_id === pdfId) {
      setSelectedPDF(null);
    }
  };

  const handleLogout = (): void => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Dokument Chat
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "upload"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "chat"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </button>

            <button
              onClick={() => setActiveTab("pdfs")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "pdfs"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              My PDFs
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "profile"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "upload" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload PDF
              </h2>
              <p className="text-gray-600">
                Upload a PDF document to start chatting with AI about its
                content.
              </p>
            </div>
            <PDFUpload onPDFUploaded={handlePDFUploaded} />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="space-y-6">
            <UpgradeMessage />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChatInterface
                  selectedPDF={selectedPDF}
                  pdfs={pdfs}
                  onPDFSelect={setSelectedPDF}
                />
              </div>
              <div className="lg:col-span-1">
                <PDFViewer
                  selectedPDF={selectedPDF}
                  onPDFSelect={setSelectedPDF}
                  pdfs={pdfs}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "pdfs" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">My PDFs</h2>
              <p className="text-gray-600">
                Manage your uploaded PDF documents.
              </p>
            </div>
            <PDFList
              pdfs={pdfs}
              loading={loading}
              onPDFSelect={setSelectedPDF}
              onPDFDeleted={handlePDFDeleted}
              onRefresh={fetchPDFs}
            />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
              <p className="text-gray-600">
                Manage your account settings and view subscription details.
              </p>
            </div>
            <Profile />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
