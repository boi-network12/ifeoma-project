export interface AdminStudentRow {
  regNo: string;
  name: string;
  program: "ND" | "MTI";
  department: string;
  level: string;
  email: string;
  status: "active" | "suspended";
  createdAt: string;
}

export interface AdminLecturerRow {
  staffNo: string;
  name: string;
  department: string;
  rank: string;
  email: string;
  courses: number;
  status: "active" | "suspended";
  createdAt: string;
}

export const mockAdmin = {
  name: "Ifeoma (Admin)",
  staffNo: "ADM/2020/001",
  students: [
    { regNo: "2023/2024/ND/CS/1042", name: "Ifeoma Okafor", program: "ND", department: "Computer Science", level: "ND II", email: "ifeoma@example.edu.ng", status: "active", createdAt: "2023-09-12" },
    { regNo: "2023/2024/ND/CS/1043", name: "Chidi Eze", program: "ND", department: "Computer Science", level: "ND II", email: "chidi@example.edu.ng", status: "active", createdAt: "2023-09-12" },
    { regNo: "2023/2024/ND/CS/1044", name: "Amaka Obi", program: "ND", department: "Computer Science", level: "ND II", email: "amaka@example.edu.ng", status: "active", createdAt: "2023-09-12" },
    { regNo: "2023/2024/MTI/SF/2011", name: "Tunde Bello", program: "MTI", department: "Software", level: "MTI I", email: "tunde@example.edu.ng", status: "active", createdAt: "2023-10-01" },
    { regNo: "2023/2024/MTI/SF/2012", name: "Ngozi Ade", program: "MTI", department: "Software", level: "MTI I", email: "ngozi@example.edu.ng", status: "suspended", createdAt: "2023-10-01" },
  ] as AdminStudentRow[],
  lecturers: [
    { staffNo: "1999/2000/NUT/204", name: "Dr. Ada Nwosu", department: "Computer Science", rank: "Senior Lecturer", email: "ada@example.edu.ng", courses: 3, status: "active", createdAt: "2020-02-10" },
    { staffNo: "2005/2006/NUT/311", name: "Mr. Emeka Obi", department: "Computer Science", rank: "Lecturer I", email: "emeka@example.edu.ng", courses: 2, status: "active", createdAt: "2021-08-03" },
    { staffNo: "2010/2011/NUT/407", name: "Mrs. Kemi Balogun", department: "Software", rank: "Lecturer II", email: "kemi@example.edu.ng", courses: 2, status: "active", createdAt: "2022-01-20" },
  ] as AdminLecturerRow[],
};

/** Reusable reg-no validators — mirrors the patterns used on the login page */
export const REG_NO_PATTERN = /^\d{4}\/\d{4}\/(ND|MTI)\/[A-Z]{2,4}\/\d{3,5}$/i;
export const STAFF_NO_PATTERN = /^\d{4}\/\d{4}\/NUT\/\d{2,4}$/i;