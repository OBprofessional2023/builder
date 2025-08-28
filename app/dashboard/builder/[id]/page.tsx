"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from 'lucide-react'; // Importing Sparkles icon
// import { ResumePDF, ResumeState } from "../../../components/ResumeForm";
import { ResumePDFTwo, ResumeStateTwo } from "../../../components/ResumeFormTwo";
import { useParams } from "next/navigation";

// ---- Dynamic import to prevent SSR crashes in Next.js ----
const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    { ssr: false }
);

function PDFPreview({ resume }: { resume: ResumeStateTwo }) {
    const count = useRef(0);

    // bump counter whenever resume changes
    useEffect(() => {
        count.current++;
        console.log(count);
    }, [resume]);

    return (
        <div className="w-full h-[800px] border shadow-lg rounded-lg overflow-hidden">
            <PDFViewer width="100%" height="100%" key={count.current}>
                <ResumePDFTwo resume={resume} />
            </PDFViewer>
        </div>
    );
}

export default function ResumeBuilder() {
    const params = useParams(); // This will contain the dynamic route params
    const { id } = params;      // id corresponds to [id] in the file path
    const [jobDescription, setJobDescription] = useState("");
    const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
    const [resume, setResume] = useState<ResumeStateTwo>({
        name: "Your Name",
        jobTitle: "Job Title",
        address: "123 Your Street",
        cityStateZip: "Your City, ST 12345",
        phone: "(123) 456-7890",
        email: "no_reply@example.com",
        linkedin: "linkedin.com/in/YourProfile",
        github: "github.com/YourProfile",
        website: "YourWebsite.com",
        summary:
            "Write a short professional summary here. Highlight your key skills, experiences, and career objectives in a concise paragraph. Tailor this section to the job you are applying for.",
        experience: [
            {
                id: crypto.randomUUID(),
                company: "Company Name",
                location: "Location",
                title: "Job Title",
                dates: "MONTH 20XX - PRESENT",
                description:
                    "Developed and maintained web applications using React and Node.js.\nCollaborated with cross-functional teams to deliver high-quality software solutions.\nImplemented new features and optimized existing code for performance improvements.",
            },
        ],
        education: [
            {
                id: crypto.randomUUID(),
                school: "School Name",
                location: "Location",
                degree: "Degree",
                dates: "MONTH 20XX - MONTH 20XX",
            },
        ],
        skills: [
            { id: crypto.randomUUID(), name: "JavaScript" },
            { id: crypto.randomUUID(), name: "React" },
            { id: crypto.randomUUID(), name: "Node.js" },
        ],
        // skills: [
        //     { id: crypto.randomUUID(), name: "JavaScript" },
        //     { id: crypto.randomUUID(), name: "React" },
        // ],
        projects: [], // Initialize projects as an empty array
        certifications: [], // Initialize certifications as an empty array
    });

    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

    const handleAnalyze = async () => {
        setIsLoading(true); // Set loading to true when analysis starts
        try {
            const response = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescription }),
            });
            const data = await response.json();
            console.log("ML Response:", data);

            if (data.keyword_suggestions) {
                setSuggestedSkills(data.keyword_suggestions);
            }

            console.log(suggestedSkills);

        } catch (error) {
            console.error("Error calling ML API:", error);
        } finally {
            setIsLoading(false); // Set loading to false when analysis ends
        }
    };

    const handleSaveResume = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/resumes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resume),
            });

            if (res.ok) {
                const updated = await res.json();
                alert(`Resume saved! ID: ${updated.id}`);
            } else {
                alert("Failed to save resume");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving resume");
        } finally {
            setIsLoading(false);
        }
    };

    // ---- Handlers (functional setState to avoid stale closures) ----
    const handleChange = (field: keyof ResumeStateTwo, value: string) =>
        setResume((prev) => ({ ...prev, [field]: value }));

    const handleExperienceChange = (
        index: number,
        field: keyof ResumeStateTwo['experience'][0],
        value: string
    ) =>
        setResume((prev) => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            ),
        }));

    const handleEducationChange = (
        index: number,
        field: keyof ResumeStateTwo['education'][0],
        value: string
    ) =>
        setResume((prev) => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            ),
        }));

    // Change skill value
    const handleSkillChange = (id: string, value: string) => {
        setResume((prev) => ({
            ...prev,
            skills: prev.skills.map((s) => (s.id === id ? { ...s, name: value } : s)),
        }));
    };

    // Handlers for Projects
    const handleProjectChange = (
        index: number,
        field: keyof ResumeStateTwo['projects'][0],
        value: string
    ) =>
        setResume((prev) => ({
            ...prev,
            projects: prev.projects.map((proj, i) =>
                i === index ? { ...proj, [field]: value } : proj
            ),
        }));

    const addProject = () =>
        setResume((prev) => ({
            ...prev,
            projects: [
                ...prev.projects,
                { id: crypto.randomUUID(), name: "", description: "", link: "" },
            ],
        }));

    const removeProject = (id: string) =>
        setResume((prev) => ({
            ...prev,
            projects: prev.projects.filter((proj) => proj.id !== id),
        }));

    // Handlers for Certifications
    const handleCertificationChange = (
        index: number,
        field: keyof ResumeStateTwo['certifications'][0],
        value: string
    ) =>
        setResume((prev) => ({
            ...prev,
            certifications: prev.certifications.map((cert, i) =>
                i === index ? { ...cert, [field]: value } : cert
            ),
        }));

    const addCertification = () =>
        setResume((prev) => ({
            ...prev,
            certifications: [
                ...prev.certifications,
                { id: crypto.randomUUID(), name: "", issuer: "", date: "", link: "" },
            ],
        }));

    const removeCertification = (id: string) =>
        setResume((prev) => ({
            ...prev,
            certifications: prev.certifications.filter((cert) => cert.id !== id),
        }));

    const addExperience = () =>
        setResume((prev) => ({
            ...prev,
            experience: [
                ...prev.experience,
                { id: crypto.randomUUID(), company: "", location: "", title: "", dates: "", description: "" },
            ],
        }));

    const addEducation = () =>
        setResume((prev) => ({
            ...prev,
            education: [
                ...prev.education,
                { id: crypto.randomUUID(), school: "", location: "", degree: "", dates: "" },
            ],
        }));

    const addSkill = () => {
        setResume((prev) => ({
            ...prev,
            skills: [...prev.skills, { id: crypto.randomUUID(), name: "" }],
        }));
    };

    // Remove Experience
    const removeExperience = (id: string) =>
        setResume((prev) => ({
            ...prev,
            experience: prev.experience.filter((exp) => exp.id !== id),
        }));

    // Remove Education
    const removeEducation = (id: string) =>
        setResume((prev) => ({
            ...prev,
            education: prev.education.filter((edu) => edu.id !== id),
        }));

    // Remove skill
    const removeSkill = (id: string) => {
        setResume((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s.id !== id),
        }));
    };

    // Accept suggested skill
    const acceptSuggestedSkill = (skillName: string) => {
        setResume((prev) => ({
            ...prev,
            skills: [...prev.skills, { id: crypto.randomUUID(), name: skillName }],
        }));
        setSuggestedSkills((prev) => prev.filter((s) => s !== skillName));
    };

    // Memoize to avoid unnecessary re-renders of the PDF tree
    // const pdfDoc = useMemo(() => <ResumePDF resume={resume} />, [resume]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-100 min-h-screen">
            {/* LEFT SIDE - Form */}
            <div className="lg:w-1/2 space-y-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-6">
                    Build Your Resume
                </h2>

                {/* Contact Info */}
                <section>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Contact Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            value={resume.name}
                            placeholder="Full Name"
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md"
                        />
                        <input
                            value={resume.jobTitle}
                            placeholder="Job Title"
                            onChange={(e) => handleChange("jobTitle", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md"
                        />
                        <input
                            value={resume.address}
                            placeholder="Street Address"
                            onChange={(e) => handleChange("address", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md"
                        />
                        <input
                            value={resume.cityStateZip}
                            placeholder="City, State, Zip"
                            onChange={(e) => handleChange("cityStateZip", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md"
                        />
                        <input
                            value={resume.phone}
                            placeholder="Phone"
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md"
                        />
                        <input
                            value={resume.email}
                            placeholder="Email"
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md"
                        />
                        <input
                            value={resume.linkedin}
                            placeholder="LinkedIn"
                            onChange={(e) => handleChange("linkedin", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md"
                        />
                        <input
                            value={resume.github}
                            placeholder="GitHub"
                            onChange={(e) => handleChange("github", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md"
                        />
                        <input
                            value={resume.website}
                            placeholder="Website"
                            onChange={(e) => handleChange("website", e.target.value)}
                            className="border border-gray-300 p-3 rounded-md col-span-1 md:col-span-2"
                        />
                    </div>
                </section>

                {/* Summary */}
                <section>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Summary</h3>
                    <textarea
                        rows={5}
                        value={resume.summary}
                        onChange={(e) => handleChange("summary", e.target.value)}
                        className="border border-gray-300 p-3 w-full rounded-md"
                    />
                </section>

                {/* Experience */}
                <section>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Experience</h3>
                    {resume.experience.map((exp, i) => (
                        <div
                            key={exp.id}
                            className="border border-gray-200 p-4 rounded-lg mb-4 bg-gray-50 shadow-sm relative"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <input
                                    value={exp.company}
                                    placeholder="Company"
                                    onChange={(e) => handleExperienceChange(i, "company", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    value={exp.location}
                                    placeholder="Location"
                                    onChange={(e) => handleExperienceChange(i, "location", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    value={exp.title}
                                    placeholder="Title"
                                    onChange={(e) => handleExperienceChange(i, "title", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    value={exp.dates}
                                    placeholder="Dates"
                                    onChange={(e) => handleExperienceChange(i, "dates", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                            </div>
                            <textarea
                                value={exp.description}
                                placeholder="Description"
                                onChange={(e) => handleExperienceChange(i, "description", e.target.value)}
                                rows={3}
                                className="border border-gray-300 p-2 w-full rounded-md"
                            />
                            <button
                                onClick={() => removeExperience(exp.id)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                                aria-label="Remove experience"
                                title="Remove experience"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addExperience}
                        className="w-full bg-blue-500 text-white p-3 rounded-md mt-2"
                    >
                        Add Experience
                    </button>
                </section>

                {/* Education */}
                <section>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Education</h3>
                    {resume.education.map((edu, i) => (
                        <div
                            key={edu.id}
                            className="border border-gray-200 p-4 rounded-lg mb-4 bg-gray-50 shadow-sm relative"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <input
                                    value={edu.school}
                                    placeholder="School"
                                    onChange={(e) => handleEducationChange(i, "school", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    value={edu.location}
                                    placeholder="Location"
                                    onChange={(e) => handleEducationChange(i, "location", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    value={edu.degree}
                                    placeholder="Degree"
                                    onChange={(e) => handleEducationChange(i, "degree", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    value={edu.dates}
                                    placeholder="Dates"
                                    onChange={(e) => handleEducationChange(i, "dates", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                            </div>
                            <button
                                onClick={() => removeEducation(edu.id)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                                aria-label="Remove education"
                                title="Remove education"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addEducation}
                        className="w-full bg-blue-500 text-white p-3 rounded-md mt-2"
                    >
                        Add Education
                    </button>
                </section>

                {/* Projects Section */}
                <section>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Projects</h3>
                    {resume.projects.map((proj, i) => (
                        <div
                            key={proj.id}
                            className="border border-gray-200 p-4 rounded-lg mb-4 bg-gray-50 shadow-sm relative"
                        >
                            <input
                                value={proj.name}
                                placeholder="Project Name"
                                onChange={(e) => handleProjectChange(i, "name", e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded-md mb-2"
                            />
                            <input
                                value={proj.link}
                                placeholder="Project Link (Optional)"
                                onChange={(e) => handleProjectChange(i, "link", e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded-md mb-2"
                            />
                            <textarea
                                value={proj.description}
                                placeholder="Project Description (use new lines for bullet points)"
                                onChange={(e) => handleProjectChange(i, "description", e.target.value)}
                                rows={3}
                                className="border border-gray-300 p-2 w-full rounded-md"
                            />
                            <button
                                onClick={() => removeProject(proj.id)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                                aria-label="Remove project"
                                title="Remove project"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addProject}
                        className="w-full bg-blue-500 text-white p-3 rounded-md mt-2 hover:bg-blue-600 transition-colors"
                    >
                        Add Project
                    </button>
                </section>

                {/* Certifications Section */}
                <section>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Certifications</h3>
                    {resume.certifications.map((cert, i) => (
                        <div
                            key={cert.id}
                            className="border border-gray-200 p-4 rounded-lg mb-4 bg-gray-50 shadow-sm relative"
                        >
                            <input
                                value={cert.name}
                                placeholder="Certification Name"
                                onChange={(e) => handleCertificationChange(i, "name", e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded-md mb-2"
                            />
                            <input
                                value={cert.issuer}
                                placeholder="Issuing Organization"
                                onChange={(e) => handleCertificationChange(i, "issuer", e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded-md mb-2"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <input
                                    value={cert.date}
                                    placeholder="Date Achieved (e.g., May 2023)"
                                    onChange={(e) => handleCertificationChange(i, "date", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    value={cert.link}
                                    placeholder="Certificate Link (Optional)"
                                    onChange={(e) => handleCertificationChange(i, "link", e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                            </div>
                            <button
                                onClick={() => removeCertification(cert.id)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                                aria-label="Remove certification"
                                title="Remove certification"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addCertification}
                        className="w-full bg-blue-500 text-white p-3 rounded-md mt-2 hover:bg-blue-600 transition-colors"
                    >
                        Add Certification
                    </button>
                </section>

                {/* Skills */}
                <section>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {resume.skills.map((skill) => (
                            <div key={skill.id} className="relative">
                                <input
                                    value={skill.name}
                                    onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                                    className="border border-gray-300 p-2 pr-8 w-full rounded-md"
                                />
                                <button
                                    onClick={() => removeSkill(skill.id)}
                                    className="absolute inset-y-0 right-2 flex items-center p-1 bg-red-500 text-white rounded-full text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addSkill}
                        className="w-full bg-blue-500 text-white p-3 rounded-md mt-4"
                    >
                        Add Skill
                    </button>
                </section>
            </div>

            {/* RIGHT SIDE - Live PDF Preview + Job Description */}
            <div className="lg:w-1/2 flex flex-col items-center gap-6">
                {/* PDFViewer */}

                <PDFPreview resume={resume} />

                {/* Job Description input below PDF */}
                <div className="flex flex-col w-full max-w-lg p-6 bg-white rounded-lg shadow-md mt-4"> {/* Added styling here */}
                    <label htmlFor="job-description" className="mb-2 font-semibold text-gray-700 text-lg">Job Description Analysis</label>
                    <textarea
                        id="job-description"
                        rows={6}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste job description here to get AI-powered skill suggestions..."
                        className="border border-gray-300 p-3 rounded-md mb-4 w-full focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading} // Disable button when loading
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
                </div>
                {/* Suggested Skills Section */}
                {suggestedSkills.length > 0 && (
                    <div className="w-full max-w-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Suggested Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {suggestedSkills.map((skill, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => acceptSuggestedSkill(skill)}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Click a skill to add it to your resume.
                        </p>
                    </div>
                )}
                <button
                    onClick={handleSaveResume}
                    disabled={isLoading}
                    className="mt-4 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md w-full font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save Resume
                </button>

            </div>
        </div>
    );
}
