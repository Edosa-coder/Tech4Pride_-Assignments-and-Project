from file_handler import load_data
from student import *

print("Start")

def main():
    data=load_data()
    if not data:
        data=get_student_info()
    while True:
        print("\n1.Add Semester\n2.View Summary\n3.Exit")
        c=input("Choice: ")
        if c=="1": add_semester(data)
        elif c=="2": display_summary(data)
        elif c=="3": break
        else: print("Invalid choice.")
if __name__=="__main__":
    main()

print('End')