Problem Statement: Console-Based CGPA Calculator
1. Overview
Design and implement a comprehensive, console-based Cumulative Grade Point Average (CGPA) calculator that allows students to input their academic records across multiple semesters and receive accurate GPA/CGPA computations, grade analytics, and performance summaries — all within a terminal/command-line interface. The application must be intuitive, robust against invalid input, and capable of persisting student data across sessions.

2. Background & Motivation
CGPA is the primary metric used by academic institutions worldwide to assess a student's overall academic performance. A well-designed CGPA calculator:

Eliminates manual computation errors in weighted GPA calculations.
Supports multiple grading systems used globally (4.0 scale, 5.0 scale, 10.0 scale, percentage-based).
Provides actionable insights: target grades needed, performance trends, at-risk subject detection.
Serves as a standalone utility usable by students, academic advisors, and institutions.
The console-only constraint ensures maximum compatibility across environments and encourages well-structured, modular code design.

3. Scope & Definitions
Term	Definition
Credit Hour	A unit representing the weight of a course (typically 1–6 credit hours per course)
Grade Point	Numerical value assigned to a letter grade (e.g., A = 4.0, B+ = 3.5)
GPA	Grade Point Average for a single semester: Σ(Grade Points × Credit Hours) / Σ(Credit Hours)
CGPA	Cumulative GPA across all semesters: Σ(Semester GPA × Semester Credits) / Σ(All Credits)
Academic Year	A grouping of two semesters (Fall + Spring), optionally with a Summer session
4. Functional Requirements
4.1 Application Launch & Main Menu
On startup, the application displays:

╔══════════════════════════════════════════════╗
║          CGPA CALCULATOR — v1.0              ║
║     Your Academic Performance Companion      ║
╚══════════════════════════════════════════════╝

  [1] Enter / Update Semester Grades
  [2] View CGPA Summary
  [3] Semester-wise GPA Report
  [4] Target CGPA Calculator
  [5] What-If Scenario Planner
  [6] Export Report
  [7] Settings (Grading Scale, Student Info)
  [8] Load / Save Student Profile
  [9] Exit
The menu must loop until the user explicitly selects Exit.

4.2 Student Profile
At first launch, the user is prompted to enter:
Full Name
Student ID (optional, alphanumeric)
Programme / Major (e.g., BSc Computer Science)
Total Programme Duration (in semesters, e.g., 8)
Grading Scale (see Section 4.3)
This profile is saved to a local file and auto-loaded on subsequent launches.
Multiple profiles must be supported (e.g., for different students using the same machine).
4.3 Grading Scale Configuration
The application must support the following grading scales, selectable via Settings:

Scale A — Standard 4.0 (USA/Canada Common)
Letter Grade	Grade Points
A / A+	4.0
A−	3.7
B+	3.3
B	3.0
B−	2.7
C+	2.3
C	2.0
C−	1.7
D+	1.3
D	1.0
F	0.0
Scale B — 5.0 Scale (Nigeria, some African universities)
Letter Grade	Grade Points
A	5.0
B	4.0
C	3.0
D	2.0
E	1.0
F	0.0
Scale C — 10.0 Scale (India, some Asian universities)
Percentage Range	Grade Points
90–100	10
80–89	9
70–79	8
60–69	7
50–59	6
45–49	5
40–44	4
< 40	0 (Fail)
Scale D — Custom Scale
Users may define their own letter-to-grade-point mapping.
Custom scales are saved per profile.
4.4 Entering Semester Data
For each semester, the user provides:

Semester Name/Label: e.g., Fall 2023, Semester 1, Year 2 Term 1.
Number of Courses: An integer between 1 and 15.
For each course:
Course Code (e.g., CS101) — optional but recommended.
Course Name (e.g., Introduction to Programming).
Credit Hours (e.g., 3): validated as a positive integer or decimal (0.5–6.0).
Grade Received: validated against the active grading scale.
After entry, the system:

Computes the semester GPA immediately.
Appends the semester to the student's record.
Displays a confirmation summary before saving.
The user must be able to:

Edit a previously entered semester (modify a course grade or credit hours).
Delete a semester from the record.
Add courses to an existing semester.
4.5 CGPA Computation
Semester GPA Formula:

Semester GPA = Σ(Grade_Points_i × Credit_Hours_i) / Σ(Credit_Hours_i)
               for all courses i in the semester
Cumulative GPA Formula:

CGPA = Σ(Semester_GPA_j × Semester_Total_Credits_j) / Σ(Semester_Total_Credits_j)
       for all semesters j on record
Results are displayed rounded to 2 decimal places in all output.
Internal computation must use full floating-point precision.
Edge cases handled: division by zero (no credits), single course, single semester.
4.6 CGPA Summary View
Displays a formatted dashboard:

══════════════════════════════════════════════════════
  STUDENT: Jane Doe          ID: 20210045
  Programme: BSc Computer Science   Year 2 of 4
══════════════════════════════════════════════════════

  Current CGPA   :  3.47 / 4.00
  Total Credits  :  72
  Semesters Done :  4 of 8
  Honour Class   :  Second Class Upper
  Status         :  Good Standing

  GPA Trend      :  3.20 → 3.35 → 3.50 → 3.47  (▼ slight dip)

══════════════════════════════════════════════════════
Honour Classification (for 4.0 scale — configurable):

CGPA Range	Classification
3.50 – 4.00	First Class Honours
3.00 – 3.49	Second Class Upper
2.50 – 2.99	Second Class Lower
2.00 – 2.49	Third Class
< 2.00	Fail / Probation
The classification boundaries must be configurable in Settings.

4.7 Semester-Wise GPA Report
Displays a table of all semesters:

┌─────────────────┬──────────┬──────────┬────────────┐
│ Semester        │ Courses  │ Credits  │ Semester   │
│                 │ Taken    │ Earned   │ GPA        │
├─────────────────┼──────────┼──────────┼────────────┤
│ Fall 2022       │   6      │   18     │   3.20     │
│ Spring 2023     │   6      │   19     │   3.35     │
│ Fall 2023       │   7      │   21     │   3.50     │
│ Spring 2024     │   5      │   14     │   3.47     │
├─────────────────┼──────────┼──────────┼────────────┤
│ CUMULATIVE      │  24      │   72     │   3.47     │
└─────────────────┴──────────┴──────────┴────────────┘
An optional ASCII bar chart visualizes GPA trend across semesters.

4.8 Target CGPA Calculator
Given a desired CGPA target, the system calculates:

Minimum GPA required in each remaining semester to achieve the target.
Whether the target is achievable given the remaining semesters and credits.
The best-case CGPA (if the student scores 4.0 in all remaining semesters).
Inputs:

Target CGPA (e.g., 3.50)
Estimated credits per remaining semester (default: average of past semesters)
Output Example:

  Target CGPA       :  3.50
  Current CGPA      :  3.47  (72 credits)
  Remaining Semesters: 4
  Est. Credits Left  : ~72

  Required GPA (each remaining semester): 3.53
  Best Possible CGPA (if all 4.0):        3.74
  Target Achievable:  ✓ YES
4.9 What-If Scenario Planner
Allows the student to simulate a hypothetical semester without modifying their actual record:

Input hypothetical course grades and credit hours.
System computes the projected CGPA if this hypothetical semester were real.
Multiple scenarios can be compared side-by-side.
Output Example:

  Scenario A (if you get all B's):  Projected CGPA = 3.41
  Scenario B (if you get all A's):  Projected CGPA = 3.58
  Scenario C (custom input)      :  Projected CGPA = 3.49
4.10 Export Report
The student's full academic record can be exported to:

A plain-text .txt file — human-readable formatted report.
A CSV .csv file — for import into spreadsheets.
Exported files are saved in the current working directory with a timestamp in the filename (e.g., JaneDoe_CGPA_Report_20250509.txt).

5. Non-Functional Requirements
5.1 Input Validation
All user inputs must be validated before processing:

Input Type	Validation Rules
Grade	Must be a valid grade in the active scale; case-insensitive
Credit Hours	Positive number; 0.5–6.0; non-zero
Number of Courses	Integer; 1–15
Target CGPA	Float; within the scale's maximum (e.g., 0.0–4.0)
Semester Name	Non-empty string; max 50 characters
Course Code/Name	Non-empty string; max 100 characters
Menu Selection	Must be one of the listed option numbers
Invalid input must display a specific, actionable error message and re-prompt without losing any previously entered data.

5.2 Data Persistence
Student profiles (including all semester and course data) are saved to a structured local file (profiles.json or profiles.pkl).
Auto-save occurs after every data entry or modification.
On launch, the application detects existing profiles and offers to load one.
Data file corruption must be detected and reported gracefully.
5.3 Display Formatting
All tables must be consistently bordered and aligned.
Numbers are right-aligned; text is left-aligned.
CGPA values always display exactly 2 decimal places.
Console output is refreshed (cleared) between major views.
Color-coded output (where supported): green for high GPA, yellow for average, red for low/fail.
5.4 Portability
The application must run on Windows, macOS, and Linux without modification.
Platform-specific behaviors (screen clearing, file paths) must be abstracted.
5.5 Code Quality
Modular design: separate modules for UI, computation, data storage, validation, and reporting.
All functions documented with docstrings.
No global mutable state; data passed explicitly between functions.
Unit tests for all computation functions (GPA, CGPA, target calculator).
6. Data Design
6.1 Profile Data Structure (JSON)
{
  "student": {
    "name": "Jane Doe",
    "id": "20210045",
    "programme": "BSc Computer Science",
    "total_semesters": 8,
    "grading_scale": "4.0"
  },
  "semesters": [
    {
      "label": "Fall 2022",
      "courses": [
        {
          "code": "CS101",
          "name": "Introduction to Programming",
          "credit_hours": 3,
          "grade": "A",
          "grade_points": 4.0
        },
        {
          "code": "MATH101",
          "name": "Calculus I",
          "credit_hours": 4,
          "grade": "B+",
          "grade_points": 3.3
        }
      ],
      "semester_gpa": 3.61,
      "total_credits": 18
    }
  ],
  "cgpa": 3.47,
  "total_credits_earned": 72
}
7. Application Flow Diagram
START
  │
  ▼
Load / Create Student Profile
  │
  ▼
┌───────────────────────────┐
│        MAIN MENU          │◄──────────────────────────┐
└──────────────┬────────────┘                           │
               │                                        │
       ┌───────┼──────────────────────┐                 │
       ▼       ▼         ▼           ▼                  │
  Enter     View       Target     What-If               │
  Grades    CGPA       Calc.      Planner               │
    │         │           │           │                 │
    ▼         ▼           ▼           ▼                 │
  Validate  Display    Compute    Simulate              │
  & Save    Dashboard  Required   Scenarios             │
    │         │         GPA           │                 │
    └─────────┴──────────┴────────────┘                 │
                         │                              │
                   Show Result                          │
                         │                              │
                  Return to Menu ────────────────────── ┘
                         │
                    [Exit Selected]
                         │
                         ▼
                  Save All Data & Exit
8. Sample Session
══════════════════════════════════════════════
  CGPA CALCULATOR — v1.0
══════════════════════════════════════════════
  Welcome back, Jane Doe!
  Current CGPA: 3.47  |  Semesters: 4/8

  [1] Enter / Update Semester Grades
  ...

  Choice: 1

  Enter semester label: Spring 2024
  Number of courses: 3

  Course 1:
    Code (optional): CS301
    Name: Algorithms
    Credit Hours: 3
    Grade: A
    ✓ Grade Points: 4.0

  Course 2:
    Code (optional): CS302
    Name: Operating Systems
    Credit Hours: 3
    Grade: B+
    ✓ Grade Points: 3.3

  Course 3:
    Code (optional): STAT201
    Name: Statistics
    Credit Hours: 2
    Grade: A-
    ✓ Grade Points: 3.7

  ──────────────────────────────────────
  Semester GPA (Spring 2024): 3.69
  Credits This Semester: 8
  Updated CGPA: 3.51
  ──────────────────────────────────────
  Save this semester? [Y/N]: Y
  ✓ Saved successfully.
9. Error Messages Reference
Scenario	Message
Invalid grade letter	⚠ 'X' is not a valid grade. Valid grades: A, B+, B, ...
Credit hours out of range	⚠ Credit hours must be between 0.5 and 6.0.
Target CGPA exceeds scale maximum	⚠ Target CGPA cannot exceed 4.0 (your scale maximum).
No semesters entered	⚠ No academic records found. Please enter semester data first.
Target CGPA not achievable	✗ Target CGPA of 3.90 is not achievable in remaining semesters.
Duplicate semester label	⚠ A semester labelled 'Fall 2023' already exists. Use a different name or edit it.
Data file corrupted	✗ Error reading profile data. Starting fresh session.
Non-numeric credit hours input	⚠ Please enter a valid number for credit hours (e.g., 3 or 1.5).
10. Stretch Goals (Optional Enhancements)
Transcript Generator: Produce a fully formatted academic transcript (text or HTML) sorted by semester with all course details, GPA per semester, and CGPA.
Failed Course Tracker: Identify and flag courses with grades below the passing threshold; suggest retake impact on CGPA.
Academic Probation Alert: Warn when CGPA drops below an institution-defined threshold (e.g., 2.0).
Multi-Institution Support: Allow switching between grading scales mid-programme (e.g., transfer students).
Grade Improvement Simulator: Show how retaking a specific course with a higher grade would change the CGPA.
ASCII GPA Trend Chart: Render a bar or line graph of semester GPAs directly in the terminal.
Prerequisite Planner: Allow the user to map course prerequisites and plan future semesters accordingly.
REST API Mode: Accept JSON input via stdin/stdout, enabling integration with other tools.
11. Deliverables
Deliverable	Description
cgpa_calculator.py (or equiv)	Main application source file(s)
profiles.json	Auto-generated student data store (created on first run)
grading_scales.json	Configurable grading scale definitions
README.md	Setup and usage instructions
Unit test file(s)	Tests for GPA, CGPA, target calculator, and input validation logic
This problem statement	Design reference document
12. Evaluation Criteria
Criterion	Weight
Correctness of GPA/CGPA formulas	30%
Input validation & error handling	15%
Data persistence & profile mgmt	15%
Target & scenario calculators	15%
Code quality & modularity	15%
Display formatting & UX	10%
End of Problem Statement — Console-Based CGPA Calculator
