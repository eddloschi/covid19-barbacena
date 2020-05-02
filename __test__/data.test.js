const fs = require('fs')

const data = JSON.parse(fs.readFileSync('src/data.json'))

test('has at least one entry', () => {
  expect(data.length).toBeGreaterThan(0)
})

test('data types', () => {
  data.forEach((entry) => {
    expect(entry.date).toMatch(
      /^202[0-9]-([0][1-9]|[1][0-2])-([0][1-9]|[12][0-9]|[3][01])$/
    )
    expect(Number.isInteger(entry.suspects)).toBeTruthy()
    expect(Number.isInteger(entry.confirmed)).toBeTruthy()
    expect(Number.isInteger(entry.deaths)).toBeTruthy()
    expect(Number.isInteger(entry.discarded)).toBeTruthy()
    expect(entry.link).toMatch(/^https?:\/\//)
  })
})

test('sequencial dates', () => {
  let date = '1970-01-01'
  data.forEach((entry) => {
    expect(entry.date > date).toBeTruthy()
    date = entry.date
  })
})
