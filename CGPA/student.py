from calculations import *
from validation import *
from file_handler import save_data

def get_student_info():
    return {"name":get_valid_text("Student Name: "),
            "matric_no":get_valid_text("Matric Number: "),
            "course_of_study":get_valid_text("Course of Study: "),
            "semesters":[]}

def add_semester(data):
    sem=get_valid_text("Semester Name: ")
    n=get_positive_int("Number of courses: ")
    courses=[]
    for i in range(n):
        print(f"\nCourse {i+1}")
        name=get_valid_text("Course Name: ")
        s=score()
        u=get_positive_int("Course Unit: ")
        gp,gl=get_grade_point(s)
        courses.append({"course_name":name,
                        "score":s,
                        "unit":u,
                        "grade_point":gp,
                        "grade_letter":gl})
    gpa=calculate_gpa(courses)
    data["semesters"].append({"semester_name":sem,
                              "courses":courses,
                              "gpa":gpa})
    save_data(data)
    print("Semester GPA:",gpa)

def display_summary(data):
    print("\n===== STUDENT SUMMARY =====")
    print("Name:",data["name"])
    print("Matric:",data["matric_no"])
    print("Course:",data["course_of_study"])
    for sem in data["semesters"]:
        print(f"\n{sem['semester_name']} GPA:{sem['gpa']}")
        for c in sem["courses"]:
            print(f"{c['course_name']} Score:{c['score']} Grade:{c['grade_letter']} Unit:{c['unit']}")
    cg=calculate_cgpa(data["semesters"])
    print("\nCGPA:",cg)
    print("Classification:",get_classification(cg))
