"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function ListsPage() {
    const [jobDescriptionn, setJobDescriptionn] = useState("");
    const [keywordMatch, setKeywordMatches] = useState<string[]>([]);
    const [pdfHeadings, setPdfHeadings] = useState<string[]>([]); // New state for PDF headings
    const [isLoading, setIsLoading] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // Handle Job Description Analysis
    const handleAnalyze = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/matchScore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescriptionn }),
            });
            const data = await response.json();
            console.log("ML Response:", data);

            if (data.keyword_suggestions) {
                setKeywordMatches(data.keyword_suggestions);
            }
        } catch (error) {
            console.error("Error calling ML API:", error);
        }
        setIsLoading(false);
    };

    // Handle PDF Upload
    const handlePdfUpload = async () => {
        if (!pdfFile) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", pdfFile);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            console.log("ML Response:", data);

            if (data.headings_found) {
                setPdfHeadings(data.headings_found);
            }
        } catch (error) {
            console.error("Error uploading PDF:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            {/* PDF Upload */}
            <div className="flex flex-col w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
                <label className="mb-2 font-semibold text-gray-700 text-lg">Upload Resume PDF</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="mb-4"
                />
                <button
                    onClick={handlePdfUpload}
                    disabled={isLoading || !pdfFile}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-md w-full font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <>Upload PDF</>
                    )}
                </button>
                {pdfHeadings.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-gray-700">Headings Found:</h3>
                        <ul className="list-disc list-inside">
                            {pdfHeadings.map((h) => (
                                <li key={h}>{h}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Job Description Analysis */}
            <div className="flex flex-col w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
                <label htmlFor="job-description" className="mb-2 font-semibold text-gray-700 text-lg">
                    Job Description Analysis
                </label>
                <textarea
                    id="job-description"
                    rows={6}
                    value={jobDescriptionn}
                    onChange={(e) => setJobDescriptionn(e.target.value)}
                    placeholder="Paste job description here to get AI-powered skill suggestions..."
                    className="border border-gray-300 p-3 rounded-md mb-4 w-full focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-md w-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Analyze Job Description
                        </>
                    )}
                </button>
                {keywordMatch.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-gray-700">Suggested Keywords:</h3>
                        <ul className="list-disc list-inside">
                            {keywordMatch.map((k) => (
                                <li key={k}>{k}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
