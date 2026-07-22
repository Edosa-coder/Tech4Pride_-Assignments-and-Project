def get_grade_point(score):
    if 70<=score<=100:return 5,"A"
    elif score>=60:return 4,"B"
    elif score>=50:return 3,"C"
    elif score>=45:return 2,"D"
    elif score>=40:return 1,"E"
    return 0,"F"

def calculate_gpa(courses):

    units=sum(c["unit"] for c in courses)
    pts=sum(c["unit"]*c["grade_point"] for c in courses)
    return round(pts/units,2) if units else 0

def calculate_cgpa(semesters):

    all_courses=[c for s in semesters for c in s["courses"]]
    return calculate_gpa(all_courses)

def get_classification(c):
    
    return "First Class" if c>=4.5 else "Second Class Upper" if c>=3.5 else "Second Class Lower" if c>=2.5 else "Third Class" if c>=1.5 else "Pass"
