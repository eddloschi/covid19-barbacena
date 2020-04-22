import { DateTime } from "luxon"
import data from "../data.json"

const updatesList = document.getElementById("updates-list")

data.forEach(entry => {
  let listItem = document.createElement("li")
  let anchor = document.createElement("a")
  let date = document.createTextNode(`${DateTime.fromISO(entry.date).toLocaleString(DateTime.DATE_SHORT)}:`)
  let stats = document.createTextNode(`Suspeitos:\xa0${entry.suspects} - Confirmados:\xa0${entry.confirmed} - Descartados:\xa0${entry.discarded}`)
  anchor.href = entry.link
  anchor.appendChild(date)
  listItem.appendChild(anchor)
  listItem.appendChild(document.createElement("br"))
  listItem.appendChild(stats)
  updatesList.appendChild(listItem)
})
