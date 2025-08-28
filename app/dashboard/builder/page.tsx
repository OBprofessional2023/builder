"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// dynamically import PDF viewer to avoid SSR crash
const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    { ssr: false }
);

// import your ResumePDF component
import { ResumePDFTwo } from "../../components/ResumeFormTwo";
import type { ResumeStateTwo as Resume } from "../../components/ResumeFormTwo";

export default function BuilderPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);

    // fetch resumes on mount
    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await fetch("/api/resumes"); // GET all resumes
                const data = await res.json();
                setResumes(data.resumes || []); // make sure API returns { resumes: [...] }
            } catch (err) {
                console.error("Error fetching resumes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, []);

    const handleCreate = async () => {
        const res = await fetch("/api/resumes", { method: "POST" });
        if (res.ok) {
            const resume = await res.json();
            router.push(`/dashboard/builder/${resume.id}`);
        } else {
            alert("Failed to create resume");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading resumes...</p>;

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Your Resumes</h1>
                <button
                    onClick={handleCreate}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md text-lg px-6 py-3"
                >
                    Create New Resume <span className="ml-2 text-xl">＋</span>
                </button>
            </div>

            {resumes.length === 0 ? (
                <p>No resumes yet. Create one to get started.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col overflow-hidden"
                            onClick={() => router.push(`/dashboard/builder/${resume.id}`)}
                        >
                            {/* PDF preview */}
                            {/* <iframe
                                src={`/api/resumes/${resume.id}/pdf`}
                                className="w-full aspect-[3/4] border-b"
                            /> */}

                            {/* Info */}
                            <div className="p-4 bg-white">
                                <h2 className="font-semibold">{resume.name}</h2>
                                <p className="text-sm text-gray-500">
                                    {resume.jobTitle || "No title"}
                                </p>
                            </div>
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
}
