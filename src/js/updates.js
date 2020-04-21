import { DateTime } from "luxon"
import data from "../data.json"

const updatesList = document.getElementById("updates-list")

data.forEach(entry => {
  let listItem = document.createElement("li")
  let anchor = document.createElement("a")
  let date = document.createTextNode(DateTime.fromISO(entry.date).toLocaleString(DateTime.DATE_SHORT))
  anchor.href = entry.link
  anchor.appendChild(date)
  listItem.appendChild(anchor)
  updatesList.appendChild(listItem)
})
