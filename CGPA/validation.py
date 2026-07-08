def non_empty(msg):
    while True:
        v=input(msg).strip()
        if v:return v
        print("Input cannot be empty.")
def positive_int(msg):
    while True:
        try:
            n=int(input(msg))
            if n>0:return n
        except: pass
        print("Enter a positive integer.")
def score():
    while True:
        try:
            s=int(input("Score: "))
            if 0<=s<=100:return s
        except: pass
        print("Score must be 0-100.")
