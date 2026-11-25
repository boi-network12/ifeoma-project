export interface EnrolledStudent {
  regNo: string;
  name: string;
  level: string;
  score: number | null; // null = not yet entered
}

export interface LecturerCourse {
  code: string;
  title: string;
  units: number;
  level: string;
  semester: "First" | "Second";
  session: string;
  students: EnrolledStudent[];
}

export const mockLecturer = {
  staffNo: "1999/2000/NUT/204",
  name: "Dr. Ada Nwosu",
  department: "Computer Science",
  rank: "Senior Lecturer",
  courses: [
    {
      code: "COM 211",
      title: "Data Structures",
      units: 3,
      level: "ND II",
      semester: "First",
      session: "2024/2025",
      students: [
        { regNo: "2023/2024/ND/CS/1042", name: "Ifeoma Okafor", level: "ND II", score: 78 },
        { regNo: "2023/2024/ND/CS/1043", name: "Chidi Eze", level: "ND II", score: 65 },
        { regNo: "2023/2024/ND/CS/1044", name: "Amaka Obi", level: "ND II", score: 42 },
        { regNo: "2023/2024/ND/CS/1045", name: "Tunde Bello", level: "ND II", score: null },
        { regNo: "2023/2024/ND/CS/1046", name: "Ngozi Ade", level: "ND II", score: null },
      ],
    },
    {
      code: "COM 212",
      title: "Database Design",
      units: 3,
      level: "ND II",
      semester: "First",
      session: "2024/2025",
      students: [
        { regNo: "2023/2024/ND/CS/1042", name: "Ifeoma Okafor", level: "ND II", score: 85 },
        { regNo: "2023/2024/ND/CS/1043", name: "Chidi Eze", level: "ND II", score: 71 },
        { regNo: "2023/2024/ND/CS/1044", name: "Amaka Obi", level: "ND II", score: 55 },
      ],
    },
    {
      code: "COM 214",
      title: "Operating Systems",
      units: 3,
      level: "ND II",
      semester: "First",
      session: "2024/2025",
      students: [
        { regNo: "2023/2024/ND/CS/1042", name: "Ifeoma Okafor", level: "ND II", score: 49 },
        { regNo: "2023/2024/ND/CS/1043", name: "Chidi Eze", level: "ND II", score: null },
      ],
    },
  ] as LecturerCourse[],
};

export function gradeFromScore(score: number | null): string {
  if (score === null) return "—";
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
}