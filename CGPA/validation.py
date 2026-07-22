def get_name(msg):
    while True:
        name = input(msg).strip()

        if not name:
            print("Name cannot be empty.")
        elif not all(part.isalpha() for part in name.split()): 
            print("Name should contain only letters.")
        else:
            return name.title()
        
def get_semester_name(msg):
    while True:
        semester = input(msg).strip()

        if not semester:
            print("Semester name cannot be empty.")
        else:
            return semester.title()

def get_matric_number(msg):
    while True:
        matric = input(msg).strip()

        if not matric:
            print("Matric number cannot be empty.")
        elif not matric.isdigit():
            print("Matric number should contain only numbers.")
        else:
            return matric


def get_course_of_study(msg):
    while True:
        course = input(msg).strip()

        if not course:
            print("Course of study cannot be empty.")
        elif not all(word.isalpha() for word in course.split()):
            print("Course of study should contain only letters.")
        else:
            return course.title()


def get_course_name(msg,existing_courses):
    while True:
        course = input(msg).strip().upper()

        if not course:
            print("Course name cannot be empty.")
        elif course in existing_courses:
            print("This course has already been entered for this semester.")
        else:
            return course


def get_course_count(msg):
    while True:
        try:
            num = int(input(msg))
            if 1 <= num <= 5:
                return num
            print("Number of courses must be between 1 and 5.")
        except ValueError:
            print("Enter a valid integer.")


def get_course_unit(msg):
    while True:
        try:
            unit = int(input(msg))
            if 1 <= unit <= 5:
                return unit
            print("Course unit must be between 1 and 5.")
        except ValueError:
            print("Enter a valid integer.")


def score():
    while True:
        try:
            score = float(input("Score: "))
            if 0 <= score <= 100:
                return score
            print("Score must be between 0 and 100.")
        except ValueError:
            print("Enter a valid score.")
 