import { DateTime } from "luxon"
import data from "../data.json"

const updatesList = document.getElementById("updates-list")

data.forEach(entry => {
  let listItem = document.createElement("li")
  let anchor = document.createElement("a")
  let date = document.createTextNode(`${DateTime.fromISO(entry.date).toLocaleString(DateTime.DATE_SHORT)}:`)
  let stats = document.createTextNode(`Suspeitos: ${entry.suspects} - Confirmados: ${entry.confirmed} - Descartados: ${entry.discarded}`)
  anchor.href = entry.link
  anchor.appendChild(date)
  listItem.appendChild(anchor)
  listItem.appendChild(document.createElement("br"))
  listItem.appendChild(stats)
  updatesList.appendChild(listItem)
})
