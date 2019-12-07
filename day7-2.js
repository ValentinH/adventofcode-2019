const DEBUG = false

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

const computer = (program, inputValues, position = 0) => {
  while (position < program.length) {
    const opcode = decodeOpcode(program[position])
    switch (opcode.opcode) {
      case 99:
        const inputValue = inputValues.shift()
        DEBUG && console.log('HALT', inputValue)
        return {
          completed: true,
          output: inputValue,
        }
      case 1: {
        const f1 = getDestination(program, program[position + 1], opcode.mode1)
        const f2 = getDestination(program, program[position + 2], opcode.mode2)
        program[program[position + 3]] = f1 + f2
        DEBUG && console.log('ADD', program[position + 3], f1 + f2)
        position += 4
        break
      }
      case 2: {
        const f1 = getDestination(program, program[position + 1], opcode.mode1)
        const f2 = getDestination(program, program[position + 2], opcode.mode2)
        program[program[position + 3]] = f1 * f2
        DEBUG && console.log('MUL', program[position + 3], f1 * f2)
        position += 4
        break
      }
      case 3: {
        const inputValue = inputValues.shift()
        program[program[position + 1]] = inputValue
        DEBUG && console.log('INPUT', program[position + 1], inputValue)
        position += 2
        break
      }
      case 4: {
        const f1 = getDestination(program, program[position + 1], opcode.mode1)
        DEBUG && console.log('OUTPUT', f1)
        position += 2
        return {
          completed: false,
          output: f1,
          position,
          inputValues,
          program: [...program], // duplicate program to avoid sharing state with other computers
        }
        break
      }
      case 5: {
        const f1 = getDestination(program, program[position + 1], opcode.mode1)
        const f2 = getDestination(program, program[position + 2], opcode.mode2)
        if (f1 !== 0) {
          DEBUG && console.log('JMP', f2)
          position = f2
        } else {
          position += 3
        }
        break
      }
      case 6: {
        const f1 = getDestination(program, program[position + 1], opcode.mode1)
        const f2 = getDestination(program, program[position + 2], opcode.mode2)
        if (f1 === 0) {
          DEBUG && console.log('JMP', f2)
          position = f2
        } else {
          position += 3
        }
        break
      }
      case 7: {
        const f1 = getDestination(program, program[position + 1], opcode.mode1)
        const f2 = getDestination(program, program[position + 2], opcode.mode2)
        program[program[position + 3]] = f1 < f2 ? 1 : 0
        DEBUG && console.log('LOWER THAN', program[position + 3], f1 < f2 ? 1 : 0)
        position += 4
        break
      }
      case 8: {
        const f1 = getDestination(program, program[position + 1], opcode.mode1)
        const f2 = getDestination(program, program[position + 2], opcode.mode2)
        program[program[position + 3]] = f1 === f2 ? 1 : 0
        DEBUG && console.log('EQUAL', program[position + 3], f1 === f2 ? 1 : 0)
        position += 4
        break
      }
    }
  }
}

function computeSequence(program, sequence) {
  const programStates = new Map()
  let input = 0
  let result
  while (1) {
    for (let phase of sequence) {
      const lastState = programStates.get(phase)
      let nextProgram = program
      let nextInput = [phase, input]
      let nextPosition

      // restore previous state
      if (lastState) {
        nextProgram = lastState.program
        nextInput = [...lastState.inputValues, input]
        nextPosition = lastState.position
      }

      result = computer(nextProgram, nextInput, nextPosition)

      if (result.completed) {
        return result.output
      }
      // save state
      programStates.set(phase, result)
      input = result.output
    }
  }
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

const inputStr =
  '3,8,1001,8,10,8,105,1,0,0,21,38,63,80,105,118,199,280,361,442,99999,3,9,102,5,9,9,1001,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,4,9,102,4,9,9,101,4,9,9,102,2,9,9,101,2,9,9,4,9,99,3,9,1001,9,5,9,102,4,9,9,1001,9,4,9,4,9,99,3,9,101,3,9,9,1002,9,5,9,101,3,9,9,102,5,9,9,101,3,9,9,4,9,99,3,9,1002,9,2,9,1001,9,4,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,99'

const program = inputStr.split(',').map(n => Number(n))

const sequences = permutator([9, 8, 7, 6, 5])
let max = 0
let result = null
for (let sequence of sequences) {
  result = computeSequence(program, sequence)
  if (result > max) {
    max = result
  }
}
console.log(max)

// console.log(computeSequence(program, [9, 7, 8, 5, 6]))
