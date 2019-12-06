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
K)L
K)YOU
I)SAN`

const orbits = new Map([['COM', { parent: null, children: new Map() }]])
input.split('\n').forEach(l => {
  const [o, d] = l.split(')')
  if (!orbits.get(o)) {
    orbits.set(o, { parent: null, children: new Map() })
  }
  const origin = orbits.get(o)
  if (!orbits.get(d)) {
    orbits.set(d, { parent: o, children: new Map() })
  }
  const destination = orbits.get(d)
  if (!destination.parent) {
    destination.parent = o
  }
  origin.children.set(d, orbits.get(d))
})

const paths = new Set()

function visit(name, node, visited = new Set()) {
  if (!node) {
    return
  }
  if (name === 'SAN') {
    paths.add(visited.size - 2)
    console.log('FOUND', visited.size - 2)
    return
  }
  if (node.parent && !visited.has(node.parent)) {
    visit(node.parent, orbits.get(node.parent), new Set([...visited, node.parent]))
  }
  for (let [o, d] of node.children.entries()) {
    visit(o, d, new Set([...visited, o]))
  }
}

visit('YOU', orbits.get('YOU'))

const best = Math.min(...paths)
console.log(best)
