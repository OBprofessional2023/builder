// ResumePDFTwo.tsx
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link,
} from "@react-pdf/renderer";

// ---- Types (imported from ResumePDF.tsx or define them here for self-containment) ----
type Experience = {
    id: string;
    company: string;
    location: string;
    title: string;
    dates: string;
    description: string;
};

type Education = {
    id: string;
    school: string;
    location: string;
    degree: string;
    dates: string;
};

type SkillItem = {
    id: string;
    name: string;
};

// New types for Projects and Certifications
type Project = {
    id: string;
    name: string;
    description: string;
    link?: string;
};

type Certification = {
    id: string;
    name: string;
    issuer: string;
    date: string;
    link?: string;
};

export type ResumeStateTwo = {
    id?: string;
    name: string;
    jobTitle: string;
    address: string;
    cityStateZip: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: SkillItem[];
    projects: Project[]; // Added projects
    certifications: Certification[]; // Added certifications
    rating?: string;
};

// ---- Helpers ----
const normalizeUrl = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
};

// ---- PDF Styles for the new template ----
const pdfStyles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 12,
        paddingTop: 30,
        paddingHorizontal: 45,
        backgroundColor: "#ffffff",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 9,
    },
    headerLeft: {
        flexDirection: "column",
    },
    headerRight: {
        flexDirection: "column",
        alignItems: "flex-end",
    },
    name: {
        fontSize: 33,
        fontWeight: "bold",
        marginBottom: 2,
    },
    jobTitle: {
        fontSize: 20,
        color: "gray",
    },
    // Styles for contact info, skills, education and experience headers
    header: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 5,
        // borderBottomWidth: 1.5,
        // borderBottomColor: "#cccccc",
        paddingBottom: 7,
    },
    contactInfo: {
        fontSize: 10,
        marginBottom: 2,
    },
    link: {
        fontSize: 10,
        color: "#3498db",
        textDecoration: "underline",
        marginBottom: 2,
    },
    sectionItem: {
        marginBottom: 10,
    },
    experienceItem: {
        marginBottom: 8,
    },
    experienceTitle: {
        fontSize: 12,
        fontWeight: "bold",
    },
    experienceDetails: {
        fontSize: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    experienceCompany: {
        fontSize: 11,
        fontStyle: "italic",
    },
    descriptionList: {
        marginTop: 8,
    },
    descriptionItem: {
        fontSize: 10,
        marginBottom: 2,
    },
    educationItem: {
        marginBottom: 8,
    },
    educationDetails: {
        fontSize: 11,
        fontStyle: "italic",
    },
});

export function ResumePDFTwo({ resume }: { resume: ResumeStateTwo }) {
    return (
        <Document>
            <Page style={pdfStyles.page}>
                {/* Header Row with Name/Job and Contact Info */}
                <View style={pdfStyles.headerRow}>
                    <View style={pdfStyles.headerLeft}>
                        <Text style={pdfStyles.name}>{resume.name}</Text>
                        <Text style={pdfStyles.jobTitle}>{resume.jobTitle}</Text>
                    </View>

                    <View style={pdfStyles.headerRight}>
                        <Text style={pdfStyles.contactInfo}>{resume.address}, {resume.cityStateZip}</Text>
                        <Text style={pdfStyles.contactInfo}>{resume.phone}</Text>
                        <Text style={pdfStyles.contactInfo}>{resume.email}</Text>
                        {!!resume.linkedin && (
                            <Link src={normalizeUrl(resume.linkedin)} style={pdfStyles.link}>
                                {resume.linkedin}
                            </Link>
                        )}
                        {!!resume.github && (
                            <Link src={normalizeUrl(resume.github)} style={pdfStyles.link}>
                                {resume.github}
                            </Link>
                        )}
                        {!!resume.website && (
                            <Link src={normalizeUrl(resume.website)} style={pdfStyles.link}>
                                {resume.website}
                            </Link>
                        )}
                    </View>
                </View>

                {/* Summary Section */}
                <Text style={pdfStyles.header}>Summary</Text>
                <Text style={pdfStyles.sectionItem}>{resume.summary}</Text>

                {/* Skills Section */}
                <Text style={pdfStyles.header}>Core Skills</Text>
                <View style={pdfStyles.sectionItem}>
                    {resume.skills.map((skill) => (
                        <Text key={skill.id} style={pdfStyles.descriptionItem}>
                            {skill.name}
                        </Text>
                    ))}
                </View>

                {/* Experience Section */}
                <Text style={pdfStyles.header}>Work Experience</Text>
                {Array.isArray(resume.experience) && resume.experience.length
                    ? resume.experience.map((exp) => (
                        <View key={exp.id} style={pdfStyles.experienceItem}>
                            <View style={pdfStyles.experienceDetails}>
                                <Text style={pdfStyles.experienceTitle}>{exp.title}</Text>
                                <Text style={pdfStyles.descriptionItem}>{exp.dates}</Text>
                            </View>
                            <Text style={pdfStyles.experienceCompany}>
                                {exp.company} | {exp.location}
                            </Text>
                            <View style={pdfStyles.descriptionList}>
                                {exp.description
                                    .split("\n")
                                    .filter(line => line.trim() !== "")
                                    .map((line, i) => (
                                        <Text key={i} style={pdfStyles.descriptionItem}>
                                            {line}
                                        </Text>
                                    ))}
                            </View>
                        </View>
                    ))
                    : null}

                {/* Education Section */}
                <Text style={pdfStyles.header}>Education</Text>
                {Array.isArray(resume.education) && resume.education.length
                    ? resume.education.map((edu) => (
                        <View key={edu.id} style={pdfStyles.experienceItem}>
                            <View style={pdfStyles.experienceDetails}>
                                <Text style={pdfStyles.experienceTitle}>{edu.school}</Text>
                                <Text style={pdfStyles.descriptionItem}>{edu.dates}</Text>
                            </View>
                            <Text style={pdfStyles.educationDetails}>
                                {edu.degree}{edu.location ? `, ${edu.location}` : ""}
                            </Text>
                        </View>
                    ))
                    : null}

                {/* Projects Section */}
                {Array.isArray(resume.projects) && resume.projects.length > 0 && (
                    <>
                        <Text style={pdfStyles.header}>Projects</Text>
                        {resume.projects.map((project) => (
                            <View key={project.id} style={pdfStyles.experienceItem}>
                                <Text style={pdfStyles.experienceTitle}>{project.name}</Text>
                                {!!project.link && (
                                    <Link src={normalizeUrl(project.link)} style={pdfStyles.link}>
                                        {project.link}
                                    </Link>
                                )}
                                <View style={pdfStyles.descriptionList}>
                                    {project.description
                                        .split("\n")
                                        .filter(line => line.trim() !== "")
                                        .map((line, i) => (
                                            <Text key={i} style={pdfStyles.descriptionItem}>
                                                {line}
                                            </Text>
                                        ))}
                                </View>
                            </View>
                        ))}
                    </>
                )}

                {/* Certifications Section */}
                {Array.isArray(resume.certifications) && resume.certifications.length > 0 && (
                    <>
                        <Text style={pdfStyles.header}>Certifications</Text>
                        {resume.certifications.map((cert) => (
                            <View key={cert.id} style={pdfStyles.experienceItem}>
                                <View style={pdfStyles.experienceDetails}>
                                    <Text style={pdfStyles.experienceTitle}>{cert.name}</Text>
                                    <Text style={pdfStyles.descriptionItem}>{cert.date}</Text>
                                </View>
                                <Text style={pdfStyles.experienceCompany}>
                                    {cert.issuer}
                                </Text>
                                {!!cert.link && (
                                    <Link src={normalizeUrl(cert.link)} style={pdfStyles.link}>
                                        {cert.link}
                                    </Link>
                                )}
                            </View>
                        ))}
                    </>
                )}
            </Page>
        </Document>
    );
}