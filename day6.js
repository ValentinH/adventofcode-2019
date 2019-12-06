const input = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`

const orbits = new Map([['COM', new Map()]])
input.split('\n').forEach(l => {
  const [o, d] = l.split(')')
  if (!orbits.get(o)) {
    orbits.set(o, new Map())
  }
  const origin = orbits.get(o)
  if (!orbits.get(d)) {
    orbits.set(d, new Map())
  }
  origin.set(d, orbits.get(d))
})

let total = 0

function visit(graph, distance = 1) {
  if (!graph || graph.size === 0) {
    return
  }
  Array.from(graph.entries()).forEach(([o, children]) => {
    total += distance
    console.log(
      Array(distance + 1)
        .fill('')
        .join('-'),
      o
    )
    visit(children, distance + 1)
  })
}

console.log('COM')
visit(orbits.get('COM'))
console.log(total)
