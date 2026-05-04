def angry_professor(k, a):
    on_time = 0

    for time in a:
        if time <= 0:
            on_time += 1

    if on_time < k:
        return "YES"  
    else:
        return "NO"    



k = 57
a = [-1, -3, 0, 2, 4]

print(angry_professor(k, a))