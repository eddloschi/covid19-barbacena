import { Chart } from "chart.js"
import "chartjs-adapter-luxon"
import data from "../data.json"

const labels = data.map(entry => { return entry.date })
const confirmed = data.map(entry => { return entry.confirmed })
const suspects = data.map(entry => { return entry.suspects })
const discarded = data.map(entry => { return entry.discarded })

const createByDayData = (section) => {
  let byDayData = []
  let byDayLabels = []
  let prev = 0

  for (let index = 0; index < data.length; index++) {
    let value = data[index][section] - prev

    if (value > 0) {
      byDayData.push(value)
      byDayLabels.push(data[index].date)
    }

    prev = data[index][section]
  }

  return { byDayData, byDayLabels }
}

const { byDayData: confirmedByDayData, byDayLabels: confirmedByDayLabels } = createByDayData("confirmed")
const { byDayData: discardedByDayData, byDayLabels: discardedByDayLabels } = createByDayData("discarded")
// const { byDayData: deathsByDayData, byDayLabels: deathsByDayLabels } = createByDayData("deaths")

const suspectsByDayData = []
const suspectsByDayLabels = []
let prev = 0
for (let index = 0; index < data.length; index++) {
  let value = data[index].suspects + data[index].discarded - prev

  if (value > 0) {
    suspectsByDayData.push(value)
    suspectsByDayLabels.push(data[index].date)
  }

  prev = data[index].suspects + data[index].discarded
}

const commonOptions = () => {
  return {
    layout: {
      padding: {
        left: 8,
        right: 8,
        top: 0,
        bottom: 8
      }
    },
    legend: {
      display: true,
      labels: {
        boxWidth: 12
      }
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: "time",
        time: {
          unit: "day"
        }
      }]
    }
  }
}


const cumulativeChart = new Chart("cumulative", {
  type: "line",
  data: {
    labels,
    datasets: [
      {
        backgroundColor: "rgba(239, 83, 80, 0.7)",
        borderColor: "rgb(211, 47, 47)",
        borderWidth: 1,
        data: confirmed,
        label: "Confirmados",
        pointBackgroundColor: "rgb(211, 47, 47)",
        pointHitRadius: 2,
        pointRadius: 2,
      },
      {
        backgroundColor: "rgba(255, 238, 88, 0.3)",
        borderColor: "rgb(251, 192, 45)",
        borderWidth: 1,
        data: suspects,
        label: "Suspeitos",
        pointBackgroundColor: "rgb(251, 192, 45)",
        pointHitRadius: 2,
        pointRadius: 2,
      },
      {
        backgroundColor: "rgba(102, 187, 10, 0.3)",
        borderColor: "rgb(56, 142, 60)",
        borderWidth: 1,
        data: discarded,
        label: "Descartados",
        pointBackgroundColor: "rgb(56, 142, 60)",
        pointHitRadius: 2,
        pointRadius: 2,
      }
    ]
  },
  options: {
    ...commonOptions(),
    title: {
      display: true,
      text: "Evolução dos casos de COVID-19"
    }
  }
})

const byDayOptions = () => {
  let options = commonOptions()
  options.scales.xAxes[0].offset = true
  return options
}

const confirmedByDayOptions = () => {
  let options = byDayOptions()
  options.scales.yAxes = [
    {
      ticks: {
        stepSize: 1
      }
    }
  ]
  return options
}

const confirmedByDayChart = new Chart("confirmed-by-day", {
  type: "bar",
  data: {
    labels: confirmedByDayLabels,
    datasets: [{
      label: "Confirmados por dia",
      data: confirmedByDayData,
      backgroundColor: "rgb(211, 47, 47)"
    }]
  },
  options: confirmedByDayOptions()
})

const suspectsByDayChart = new Chart("suspects-by-day", {
  type: "bar",
  data: {
    labels: suspectsByDayLabels,
    datasets: [{
      label: "Suspeitos por dia",
      data: suspectsByDayData,
      backgroundColor: "rgb(251, 192, 45)"
    }]
  },
  options: byDayOptions()
})

const discardedByDayChart = new Chart("discarded-by-day", {
  type: "bar",
  data: {
    labels: discardedByDayLabels,
    datasets: [{
      label: "Descartados por dia",
      data: discardedByDayData,
      backgroundColor: "rgb(56, 142, 60)"
    }]
  },
  options: byDayOptions()
})
