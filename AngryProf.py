def angry_professor(k, a):
    on_time = 0

    for time in a:
        if time <= 0:
            on_time += 1

    if on_time < k:
        return "YES"  
    else:
        return "NO"    



k = 3
a = [-2, -1, 0, 1, 2]

print(angry_professor(k, a))