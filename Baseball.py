def Points(operations= ["5", "2", "C", "D", "+"]):
    # operations= ["5", "2", "C", "D", "+"]
    scores = []

    for ops in operations:
        if ops == "C":
            scores.pop()
        elif ops == "D":
            scores.append(scores[-1] * 2)
        elif ops == "+":
            scores.append(scores[-1] + scores[-2])
        else:
            scores.append(int(ops))
    return sum(scores)

# print(Points(["5", "2", "C", "D", "+"]))
print(Points())


     