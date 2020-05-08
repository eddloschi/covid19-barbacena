import { DateTime } from 'luxon'
import data from '../data.json'

const updatesList = document.getElementById('updates-list')

data.reverse().forEach((entry) => {
  const listItem = document.createElement('li')
  const anchor = document.createElement('a')
  const date = document.createTextNode(
    `${DateTime.fromISO(entry.date).toLocaleString(DateTime.DATE_SHORT)}:`
  )
  const stats = document.createTextNode(
    `Mortes:\xa0${entry.deaths} - Confirmados:\xa0${entry.confirmed} - Suspeitos:\xa0${entry.suspects} - Descartados:\xa0${entry.discarded}`
  )
  anchor.href = entry.link
  anchor.appendChild(date)
  listItem.appendChild(anchor)
  listItem.appendChild(document.createElement('br'))
  listItem.appendChild(stats)
  updatesList.appendChild(listItem)
})
