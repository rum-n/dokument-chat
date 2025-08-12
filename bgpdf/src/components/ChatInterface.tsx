"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, FileText, MessageSquare } from "lucide-react";

interface PDF {
	pdf_id: string;
	filename: string;
	upload_date: string;
	file_size: number;
}

interface PageReference {
	page_number: number;
}

interface Message {
	id: number;
	type: "user" | "ai" | "error";
	content: string;
	timestamp: Date;
	pageReferences?: PageReference[];
	language?: string;
}

interface ChatInterfaceProps {
	selectedPDF: PDF | null;
	pdfs: PDF[];
	onPDFSelect: (pdf: PDF | null) => void;
}

function ChatInterface({ selectedPDF, pdfs, onPDFSelect }: ChatInterfaceProps): React.JSX.Element {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = (): void => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		if (!inputValue.trim() || loading) return;

		const question = inputValue.trim();
		setInputValue("");
		setLoading(true);

		// Add user message
		const userMessage: Message = {
			id: Date.now(),
			type: "user",
			content: question,
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);

		try {
			const response = await fetch("/chat/ask", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					question: question,
					pdf_id: selectedPDF?.pdf_id,
				}),
			});

			if (response.ok) {
				const result = await response.json();

				// Add AI response
				const aiMessage: Message = {
					id: Date.now() + 1,
					type: "ai",
					content: result.answer,
					pageReferences: result.page_references,
					language: result.language,
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, aiMessage]);
			} else {
				const error = await response.json();
				const errorMessage: Message = {
					id: Date.now() + 1,
					type: "error",
					content: error.error || "Failed to get response",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, errorMessage]);
			}
		} catch (error) {
			console.error("Chat error:", error);
			const errorMessage: Message = {
				id: Date.now() + 1,
				type: "error",
				content: "Failed to connect to server. Please try again.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	const formatTimestamp = (timestamp: Date): string => {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const renderPageReferences = (pageReferences: PageReference[] | undefined): React.JSX.Element | null => {
		if (!pageReferences || pageReferences.length === 0) return null;

		return (
			<div className="mt-3 pt-3 border-t border-gray-200">
				<p className="text-sm text-gray-600 mb-2">Page references:</p>
				<div className="flex flex-wrap gap-2">
					{pageReferences.map((ref: PageReference, index: number) => (
						<button
							key={index}
							className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded hover:bg-primary-200 transition-colors"
							onClick={() => {
								// TODO: Implement page navigation
								console.log(`Navigate to page ${ref.page_number}`);
							}}
						>
							<FileText className="h-3 w-3 mr-1" />
							Page {ref.page_number}
						</button>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
			{/* Header */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<MessageSquare className="h-5 w-5 text-primary-600 mr-2" />
						<h3 className="font-medium text-gray-900">Chat with AI</h3>
					</div>

					{selectedPDF && (
						<div className="text-sm text-gray-600">
							<span className="font-medium">Active:</span>{" "}
							{selectedPDF.filename}
						</div>
					)}
				</div>

				{pdfs.length > 0 && !selectedPDF && (
					<div className="mt-2">
						<select
							className="w-full text-sm border border-gray-300 rounded px-2 py-1"
							onChange={(e) => {
								const pdf = pdfs.find((p) => p.pdf_id === e.target.value);
								onPDFSelect(pdf || null);
							}}
							value=""
						>
							<option value="">Select a PDF to chat about...</option>
							{pdfs.map((pdf) => (
								<option key={pdf.pdf_id} value={pdf.pdf_id}>
									{pdf.filename}
								</option>
							))}
						</select>
					</div>
				)}
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						<MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
						<p className="text-lg font-medium mb-2">Start a conversation</p>
						<p className="text-sm">
							{selectedPDF
								? `Ask questions about "${selectedPDF.filename}" in Bulgarian or English`
								: "Upload a PDF and start chatting about its content"}
						</p>
					</div>
				) : (
					messages.map((message) => (
						<div
							key={message.id}
							className={`message-bubble ${
								message.type === "user" ? "message-user" : "message-ai"
							}`}
						>
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0">
									{message.type === "user" ? (
										<div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
											<span className="text-white text-sm font-medium">U</span>
										</div>
									) : (
										<div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
											<span className="text-white text-sm font-medium">AI</span>
										</div>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="text-sm">
										{message.type === "error" ? (
											<div className="text-red-600">{message.content}</div>
										) : (
											<div className="whitespace-pre-wrap">
												{message.content}
											</div>
										)}
									</div>

									{message.type === "ai" &&
										renderPageReferences(message.pageReferences)}

									<div className="text-xs text-gray-500 mt-1">
										{formatTimestamp(message.timestamp)}
									</div>
								</div>
							</div>
						</div>
					))
				)}

				{loading && (
					<div className="message-bubble message-ai">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0">
								<div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
									<span className="text-white text-sm font-medium">AI</span>
								</div>
							</div>
							<div className="flex-1">
								<div className="text-sm text-gray-600">
									Thinking<span className="loading-dots"></span>
								</div>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="p-4 border-t border-gray-200">
				<form onSubmit={handleSubmit} className="flex space-x-2">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Ask a question in Bulgarian or English..."
						className="flex-1 input-field"
						disabled={loading}
					/>
					<button
						type="submit"
						disabled={!inputValue.trim() || loading}
						className="btn-primary flex items-center"
					>
						<Send className="h-4 w-4" />
					</button>
				</form>
			</div>
		</div>
	);
}

export default ChatInterface;
