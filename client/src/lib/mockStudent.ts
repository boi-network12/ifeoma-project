export interface CourseResult {
  code: string;
  title: string;
  units: number;
  score: number;
  grade: string;
  remark: "Pass" | "Fail";
}

export interface SemesterResult {
  session: string;
  semester: "First" | "Second";
  level: string;
  courses: CourseResult[];
}

export const mockStudent = {
  regNo: "2023/2024/ND/CS/1042",
  name: "Ifeoma Okafor",
  program: "National Diploma — Computer Science",
  department: "Computer Science",
  level: "ND II",
  session: "2024/2025",
  semester: "First",
  cgpa: 3.42,
  totalUnits: 22,
  results: [
    {
      session: "2024/2025",
      semester: "First",
      level: "ND II",
      courses: [
        { code: "COM 211", title: "Data Structures", units: 3, score: 78, grade: "A", remark: "Pass" },
        { code: "COM 212", title: "Database Design", units: 3, score: 85, grade: "A", remark: "Pass" },
        { code: "COM 213", title: "Web Technologies", units: 3, score: 72, grade: "B", remark: "Pass" },
        { code: "MTH 211", title: "Discrete Mathematics", units: 2, score: 64, grade: "C", remark: "Pass" },
        { code: "GST 201", title: "Use of English II", units: 2, score: 58, grade: "D", remark: "Pass" },
        { code: "COM 214", title: "Operating Systems", units: 3, score: 49, grade: "F", remark: "Fail" },
      ],
    },
    {
      session: "2023/2024",
      semester: "Second",
      level: "ND I",
      courses: [
        { code: "COM 121", title: "Intro to Programming", units: 3, score: 81, grade: "A", remark: "Pass" },
        { code: "COM 122", title: "Computer Hardware", units: 2, score: 75, grade: "B", remark: "Pass" },
        { code: "MTH 121", title: "Algebra", units: 2, score: 69, grade: "C", remark: "Pass" },
      ],
    },
  ] as SemesterResult[],
};