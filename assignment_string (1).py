while True:
    sentence = input('Enter a sentence: ')
    if len(sentence) < 20:
        print('Sentence must be longer than 20.')
        continue
    else:
        print('Sentence is long enough.')
        

    change = ''
    while True: 
        userInput = input('> : ').lower()
        if userInput == 'u':
            change = sentence.upper()
            print(change)
        elif userInput == 'l':
            change = sentence.lower()
            print(change)
        elif userInput == 'r' :
            change = sentence[::-1]
            print(f"{change}")
        elif userInput == 'z':
            change, sentence = sentence, change
            print(f"Sentence: {sentence}")

        elif userInput == 'c':
            ch1 = input('What character do you want to replace? ')
            ch2 = input(f'What character will replace {ch1}? ')
            change = sentence.replace(ch1, ch2)
            print(change)
        
        elif  userInput == 'x':
            print('Exiting program.')
            exit
            
