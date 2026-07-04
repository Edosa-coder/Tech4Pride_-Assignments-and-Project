import json
import os

DATA_FILE = "student_data.json"


# -----------------------------
# Grade Point Function
# -----------------------------
def get_grade_point(score):
    if 70 <= score <= 100:
        return 5, "A"
    elif 60 <= score <= 69:
        return 4, "B"
    elif 50 <= score <= 59:
        return 3, "C"
    elif 45 <= score <= 49:
        return 2, "D"
    elif 40 <= score <= 44:
        return 1, "E"
    else:
        return 0, "F"


# -----------------------------
# GPA Calculation
# -----------------------------
def calculate_gpa(courses):
    total_points = 0
    total_units = 0

    for course in courses:
        total_points += course["grade_point"] * course["unit"]
        total_units += course["unit"]

    if total_units == 0:
        return 0

    return round(total_points / total_units, 2)


# -----------------------------
# CGPA Calculation
# -----------------------------
def calculate_cgpa(semesters):
    total_points = 0
    total_units = 0

    for semester in semesters:
        for course in  semester["courses"]:
            total_points += course["grade_point"] * course["unit"]
            total_units += course["unit"]

    if total_units == 0:
        return 0

    return round(total_points / total_units, 2)


# -----------------------------
# Classification
# -----------------------------
def get_classification(cgpa):
    if cgpa >= 4.5:
        return "First Class"
    elif cgpa >= 3.5:
        return "Second Class Upper"
    elif cgpa >= 2.4:
        return "Second Class Lower"
    elif cgpa >= 1.5:
        return "Third Class"
    else:
        return "Pass"
    
score = int(input("Enter score: "))

grade_point, grade = get_grade_point(score)

print("Grade:", grade)
print("Grade Point:", grade_point)

gpa = calculate_gpa(semester1["courses"])
print("Semester 1 GPA:", gpa)