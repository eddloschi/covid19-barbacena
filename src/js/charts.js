import { Chart } from 'chart.js'
import { DateTime } from 'luxon'
import 'chartjs-adapter-luxon'
import data from '../data.json'

const mapData = (entryData) => {
  if (entryData > 0) {
    return entryData
  }
  return null
}

const labels = data.map((entry) => {
  return entry.date
})
const confirmed = data.map((entry) => {
  return mapData(entry.confirmed)
})
const suspects = data.map((entry) => {
  return mapData(entry.suspects)
})
const discarded = data.map((entry) => {
  return mapData(entry.discarded)
})

const createByDayData = (section) => {
  const byDayData = []
  let prev = 0

  for (let index = 0; index < data.length; index++) {
    const value = data[index][section] - prev

    byDayData.push(value)
    prev = data[index][section]
  }

  return byDayData
}

const confirmedByDayData = createByDayData('confirmed')
const discardedByDayData = createByDayData('discarded')
// const deathsByDayData = createByDayData("deaths")

const suspectsByDayData = []
let prev = 0
for (let index = 0; index < data.length; index++) {
  let value = data[index].suspects + data[index].discarded - prev

  suspectsByDayData.push(value)
  prev = data[index].suspects + data[index].discarded
}

const commonOptions = () => {
  return {
    layout: {
      padding: {
        top: 0,
        right: 12,
        left: 8,
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
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day'
          },
          ticks: {
            maxRotation: 180
          }
        }
      ]
    },
    tooltips: {
      axis: 'x',
      intersect: false,
      mode: 'nearest',
      position: 'nearest',
      callbacks: {
        title: (tooltipItem) => {
          return DateTime.fromISO(tooltipItem[0].label).toLocaleString(
            DateTime.DATE_FULL
          )
        }
      }
    }
  }
}

const cumulativeChartOptions = () => {
  const options = commonOptions()
  options.scales.yAxes = [
    {
      ticks: {
        min: 1
      }
    }
  ]
  options.title = {
    display: true,
    text: 'Evolução dos casos de COVID-19'
  }
  return options
}

const cumulativeChartDatasetOptions = {
  borderWidth: 1,
  pointRadius: 2
}

new Chart('cumulative', {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        ...cumulativeChartDatasetOptions,
        data: confirmed,
        label: 'Confirmados',
        backgroundColor: 'rgba(239, 83, 80, 0.7)',
        borderColor: 'rgb(211, 47, 47)',
        pointBackgroundColor: 'rgb(211, 47, 47)'
      },
      {
        ...cumulativeChartDatasetOptions,
        data: suspects,
        label: 'Suspeitos',
        backgroundColor: 'rgba(255, 238, 88, 0.3)',
        borderColor: 'rgb(251, 192, 45)',
        pointBackgroundColor: 'rgb(251, 192, 45)'
      },
      {
        ...cumulativeChartDatasetOptions,
        data: discarded,
        label: 'Descartados',
        backgroundColor: 'rgba(102, 187, 10, 0.3)',
        borderColor: 'rgb(56, 142, 60)',
        pointBackgroundColor: 'rgb(56, 142, 60)'
      }
    ]
  },
  options: cumulativeChartOptions()
})

const byDayOptions = () => {
  const options = commonOptions()
  options.scales.xAxes[0].offset = true
  return options
}

new Chart('by-day', {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Confirmados por dia',
        data: confirmedByDayData,
        backgroundColor: 'rgb(211, 47, 47)'
      },
      {
        label: 'Suspeitos por dia',
        data: suspectsByDayData,
        backgroundColor: 'rgb(251, 192, 45)'
      },
      {
        label: 'Descartados por dia',
        data: discardedByDayData,
        backgroundColor: 'rgb(56, 142, 60)'
      }
    ]
  },
  options: byDayOptions()
})
