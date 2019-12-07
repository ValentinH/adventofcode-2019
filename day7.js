function decodeOpcode(opcodeInput) {
  const opcodeStr = String(opcodeInput).padStart(5, '0')

  return {
    opcode: Number(opcodeStr.substr(3, 5)),
    mode1: Number(opcodeStr[2]),
    mode2: Number(opcodeStr[1]),
    mode3: Number(opcodeStr[0]),
  }
}

function getDestination(input, value, mode) {
  if (mode === 1) return value
  return input[value]
}

const computer = (inputStr, inputValues) => {
  const input = inputStr.split(',').map(n => Number(n))
  let output = null
  let position = 0
  while (position < input.length) {
    const opcode = decodeOpcode(input[position])
    switch (opcode.opcode) {
      case 99:
        // console.log('HALT')
        return output
      case 1: {
        const f1 = getDestination(input, input[position + 1], opcode.mode1)
        const f2 = getDestination(input, input[position + 2], opcode.mode2)
        input[input[position + 3]] = f1 + f2
        // console.log('ADD', input[position + 3], f1 + f2)
        position += 4
        break
      }
      case 2: {
        const f1 = getDestination(input, input[position + 1], opcode.mode1)
        const f2 = getDestination(input, input[position + 2], opcode.mode2)
        input[input[position + 3]] = f1 * f2
        // console.log('MUL', input[position + 3], f1 * f2)
        position += 4
        break
      }
      case 3: {
        const inputValue = inputValues.shift()
        input[input[position + 1]] = inputValue
        // console.log('INPUT', input[position + 1], inputValue)
        position += 2
        break
      }
      case 4: {
        const f1 = getDestination(input, input[position + 1], opcode.mode1)
        output = f1
        position += 2
        break
      }
      case 5: {
        const f1 = getDestination(input, input[position + 1], opcode.mode1)
        const f2 = getDestination(input, input[position + 2], opcode.mode2)
        if (f1 !== 0) {
          // console.log('JMP', f2)
          position = f2
        } else {
          position += 3
        }
        break
      }
      case 6: {
        const f1 = getDestination(input, input[position + 1], opcode.mode1)
        const f2 = getDestination(input, input[position + 2], opcode.mode2)
        if (f1 === 0) {
          // console.log('JMP', f2)
          position = f2
        } else {
          position += 3
        }
        break
      }
      case 7: {
        const f1 = getDestination(input, input[position + 1], opcode.mode1)
        const f2 = getDestination(input, input[position + 2], opcode.mode2)
        input[input[position + 3]] = f1 < f2 ? 1 : 0
        // console.log('LOWER THAN', input[position + 3], f1 < f2 ? 1 : 0)
        position += 4
        break
      }
      case 8: {
        const f1 = getDestination(input, input[position + 1], opcode.mode1)
        const f2 = getDestination(input, input[position + 2], opcode.mode2)
        input[input[position + 3]] = f1 === f2 ? 1 : 0
        // console.log('EQUAL', input[position + 3], f1 === f2 ? 1 : 0)
        position += 4
        break
      }
    }
  }
}

function computeSequence(program, sequence) {
  let input = 0
  for (let phase of sequence) {
    input = computer(program, [phase, input])
  }
  return input
}

const permutator = inputArr => {
  let result = []

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice()
        let next = curr.splice(i, 1)
        permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(inputArr)

  return result
}

const input = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'

const sequences = permutator([0, 1, 2, 3, 4])
let max = 0
let result = null
for (let sequence of sequences) {
  result = computeSequence(input, sequence)
  if (result > max) {
    max = result
  }
}
console.log(max)
