import re

# Read words from suggestions
with open('suggestions.txt', 'r') as file:
    suggested_words = set(line.strip() for line in file)

# Read words from wordlist.js, removing quotation marks
pattern = re.compile(r"'(.*?)'")
with open('../src/constants/wordlist.ts', 'r') as file:
    wordlist = set(match.group(1) for line in file for match in pattern.finditer(line))

# Find words in suggetsions but not in wordlist
difference = suggested_words - wordlist

# Print the result
for word in difference:
    print(word)
