// ResumePDF.tsx
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link,
} from "@react-pdf/renderer";

// ---- Types ----
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

export type ResumeState = {
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
};

// ---- Helpers ----
const normalizeUrl = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
};

// ---- PDF Styles ----
const pdfStyles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 12,
        padding: 30,
        backgroundColor: "#ffffff",
    },
    // Increased size and added color for emphasis
    name: { fontSize: 33, fontWeight: "bold", textAlign: "center", color: "#2c3e50", marginBottom: 4 },
    // Increased size, more space below, and subtle color
    jobTitle: {
        fontSize: 21,
        fontStyle: "italic",
        textAlign: "center",
        marginBottom: 15,
        color: "#5f6c7c",
    },
    // Enhanced header styles with more spacing and a bottom border
    header: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 6,
        marginTop: 9,
        color: "#2c3e50",
        borderBottom: "#e0e0e0",
        paddingBottom: 2,
    },
    // Increased line spacing for better readability
    text: { marginBottom: 1 },

    text2: { marginBottom: 1, lineHeight: 1 },
    // Added top border to visually separate main content from header
    columnContainer: {
        flexDirection: "row",
        marginTop: 1,
        borderTop: "#e0e0e0",
        paddingTop: 1,
    },
    // Adjusted padding and added a subtle right border for column separation
    leftColumn: {
        width: "30%",
        paddingRight: 15,
        borderRight: "#e0e0e0",
    },
    // Added left padding to match the gap created by the left column's right padding/border
    rightColumn: {
        width: "70%",
        paddingLeft: 15,
    },
    // Increased indentation for lists
    list: { marginLeft: 5 },
    // Increased space between list items
    listItem: { marginBottom: 5 },
    // Styles for links
    link: { color: "#3498db", textDecoration: "none", marginBottom: 4, fontSize: 12 }, // Added font size for consistency

    // Added style for individual experience/education items
    sectionItem: { marginBottom: 1 },
    // Style for description indentation
    descriptionIndent: { marginLeft: 5, marginBottom: 1, marginTop: 5, fontSize: 11, lineHeight: 1.3 },
    // Specific styles for experience/education titles
    itemTitle: { fontWeight: "bold", fontSize: 13 },
    // Specific styles for experience/education dates
    itemDates: { fontStyle: "italic", fontSize: 11, marginTop: 2 },
});

// ---- PDF Component (pure, props-based) ----
export function ResumePDF({ resume }: { resume: ResumeState }) {
    return (
        <Document>
            <Page style={pdfStyles.page}>
                <Text style={pdfStyles.name}>{resume.name}</Text>
                <Text style={pdfStyles.jobTitle}>{resume.jobTitle}</Text>

                <View style={pdfStyles.columnContainer}>
                    {/* Left Column */}
                    <View style={pdfStyles.leftColumn}>
                        <Text style={pdfStyles.header}>Contact</Text>
                        <Text style={pdfStyles.text2}>{resume.address}</Text>
                        <Text style={pdfStyles.text2}>{resume.cityStateZip}</Text>
                        <Text style={pdfStyles.text2}>{resume.phone}</Text>
                        <Text style={pdfStyles.text2}>{resume.email}</Text>

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
                        <Text style={pdfStyles.header}>Skills</Text>
                        {/* Skills */}
                        <View style={pdfStyles.list}>
                            {Array.isArray(resume.skills) && resume.skills.length
                                ? resume.skills.map((skill) => (
                                    <Text key={skill.id} style={pdfStyles.listItem}>• {skill.name}</Text>
                                ))
                                : null}
                        </View>

                    </View>

                    {/* Right Column */}
                    <View style={pdfStyles.rightColumn}>
                        <Text style={pdfStyles.header}>Summary</Text>
                        <Text style={pdfStyles.text}>{resume.summary}</Text>

                        <Text style={pdfStyles.header}>Experience</Text>

                        {/* Experience */}
                        {Array.isArray(resume.experience) && resume.experience.length
                            ? resume.experience.map((exp) => (
                                <View key={exp.id} style={pdfStyles.sectionItem}>
                                    <Text style={pdfStyles.itemTitle}>
                                        {exp.company}
                                        {exp.location ? `, ${exp.location}` : ""}{" "}
                                        {exp.title ? ` - ${exp.title}` : ""}
                                    </Text>
                                    {exp.dates ? <Text style={pdfStyles.itemDates}>{exp.dates}</Text> : null}
                                    {exp.description ? (
                                        <Text style={pdfStyles.descriptionIndent}>{exp.description}</Text>
                                    ) : null}
                                </View>
                            ))
                            : null}

                        <Text style={pdfStyles.header}>Education</Text>
                        {/* Education */}
                        {Array.isArray(resume.education) && resume.education.length
                            ? resume.education.map((edu) => (
                                <View key={edu.id} style={pdfStyles.sectionItem}>
                                    <Text style={pdfStyles.itemTitle}>
                                        {edu.school}
                                        {edu.location ? `, ${edu.location}` : ""}{" "}
                                        {edu.degree ? ` - ${edu.degree}` : ""}
                                    </Text>
                                    {edu.dates ? <Text style={pdfStyles.itemDates}>{edu.dates}</Text> : null}
                                </View>
                            ))
                            : null}
                    </View>
                </View>
            </Page>
        </Document>
    );
}