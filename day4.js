const range = '264793-803935'.split('-').map(Number)

// It is a six-digit number.
// The value is within the range given in your puzzle input.
// Two adjacent digits are the same (like 22 in 122345).
// Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).

function isValid(password) {
  let previous = ''
  const consecutives = new Map()
  for (let c of String(password).split('')) {
    if (c < previous) {
      return false
    }
    if (c === previous) {
      if (!consecutives.get(c)) {
        consecutives.set(c, 2)
      } else {
        consecutives.set(c, consecutives.get(c) + 1)
      }
    }
    previous = c
  }
  return Array.from([...consecutives.values()]).some(c => c === 2)
}

let validCount = 0

for (let password = range[0]; password <= range[1]; password++) {
  if (isValid(password)) {
    validCount += 1
  }
}

console.log(validCount)
