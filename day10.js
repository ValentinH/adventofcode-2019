const input = `.#..#
.....
#####
....#
...##`

const map = []
input.split('\n').forEach((l, lineIndex) => {
  l.split('').forEach((point, index) => {
    if (point === '#') {
      map.push([index, lineIndex])
    }
  })
})

let max = 0
const asteroids = new Map()
for (let point of map) {
  const set = new Set()
  for (let other of map) {
    if (point[0] === other[0] && point[1] == other[1]) continue
    const angle = (Math.atan2(other[1] - point[1], other[0] - point[0]) * 180) / Math.PI + 180
    set.add(angle)
  }
  if (set.size > max) {
    max = set.size
  }
  console.log(`${point[0]}-${point[1]}`, set.size)
  asteroids.set(`${point[0]}-${point[1]}`, set)
}

console.log(max)
