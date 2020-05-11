import { Chart } from 'chart.js'
import { DateTime } from 'luxon'
import 'chartjs-adapter-luxon'
import data from '../data.json'

const cumulativeData = {
  deaths: [],
  confirmed: [],
  suspects: [],
  discarded: [],
  recovered: []
}
const activeCases = []
const byDayData = {
  confirmed: [],
  discarded: [],
  deaths: [],
  recovered: []
}
const prev = {
  confirmed: 0,
  discarded: 0,
  deaths: 0,
  suspects: 0,
  recovered: 0
}
const suspectsByDayData = []

const mapData = ({ entryData, date, axis }) => {
  if (!entryData) {
    return null
  }

  const point = {
    t: date
  }
  point[axis] = entryData
  return point
}

data.forEach((entry) => {
  for (let section in cumulativeData) {
    const point = mapData({ entryData: entry[section], date: entry.date, axis: 'y' })
    if (point != null) {
      cumulativeData[section].push(point)
    }
  }

  let point = mapData({
    entryData: entry.confirmed - entry.deaths - entry.recovered,
    date: entry.date,
    axis: 'y'
  })
  if (point != null) {
    activeCases.push(point)
  }

  for (let section in byDayData) {
    const point = mapData({
      entryData: entry[section] - prev[section],
      date: entry.date,
      axis: 'x'
    })
    if (point != null) {
      byDayData[section].push(point)
    }
    prev[section] = entry[section]
  }

  point = mapData({
    entryData: entry.suspects + entry.discarded + entry.confirmed - prev.suspects,
    date: entry.date,
    axis: 'x'
  })
  if (point != null) {
    suspectsByDayData.push(point)
  }
  prev.suspects = entry.suspects + entry.discarded + entry.confirmed
})

const BY_DAY_ENTRY_HEIGHT = 50
const byDayChartHeight = data.length * BY_DAY_ENTRY_HEIGHT
document.querySelectorAll('.vertical-chart').forEach((node) => {
  node.style.height = `${byDayChartHeight}px`
})

byDayData.suspects = suspectsByDayData

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
          gridLines: {
            display: false
          },
          type: 'time',
          time: {
            unit: 'day'
          },
          ticks: {
            maxRotation: 180
          }
        }
      ],
      yAxes: [{ ticks: { min: 0 } }]
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
  options.title = {
    display: true,
    text: 'Evolução dos casos de COVID-19'
  }
  return options
}

const datasetOptions = {
  borderWidth: 2,
  cubicInterpolationMode: 'monotone',
  fill: false,
  pointRadius: 0
}

new Chart('cumulative', {
  type: 'line',
  data: {
    datasets: [
      {
        ...datasetOptions,
        data: cumulativeData.deaths,
        label: 'Mortes',
        backgroundColor: 'rgba(33, 33, 33, 0.7)',
        borderColor: 'rgb(33, 33, 33)'
      },
      {
        ...datasetOptions,
        data: cumulativeData.recovered,
        label: 'Recuperados',
        backgroundColor: 'rgba(3, 169, 244, 0.5)',
        borderColor: 'rgb(3, 169, 244)'
      },
      {
        ...datasetOptions,
        data: cumulativeData.confirmed,
        label: 'Confirmados',
        backgroundColor: 'rgba(239, 83, 80, 0.7)',
        borderColor: 'rgb(211, 47, 47)'
      },
      {
        ...datasetOptions,
        data: cumulativeData.discarded,
        label: 'Descartados',
        backgroundColor: 'rgba(102, 187, 10, 0.3)',
        borderColor: 'rgb(56, 142, 60)'
      },
      {
        ...datasetOptions,
        data: cumulativeData.suspects,
        label: 'Suspeitos',
        backgroundColor: 'rgba(255, 238, 88, 0.3)',
        borderColor: 'rgb(251, 192, 45)'
      }
    ]
  },
  options: cumulativeChartOptions()
})

const activeCasesColor = '#ff5722'

new Chart('active-cases', {
  type: 'line',
  data: {
    datasets: [
      {
        ...datasetOptions,
        data: activeCases,
        label: 'Casos ativos',
        borderColor: activeCasesColor
      }
    ]
  },
  options: commonOptions()
})

const byDayOptions = () => {
  const options = commonOptions()
  const xAxes = options.scales.xAxes
  options.scales.xAxes = options.scales.yAxes
  options.scales.yAxes = xAxes
  options.scales.yAxes[0].distribution = 'series'
  options.scales.yAxes[0].gridLines.display = true
  options.scales.yAxes[0].gridLines.offsetGridLines = true
  options.scales.yAxes[0].offset = true
  options.scales.xAxes[0].position = 'top'
  options.tooltips.axis = 'y'
  options.title = {
    display: true,
    text: 'Novas notificações diárias'
  }
  return options
}

new Chart('by-day', {
  type: 'horizontalBar',
  data: {
    datasets: [
      {
        label: 'Novas mortes',
        data: byDayData.deaths,
        backgroundColor: 'rgb(33, 33, 33)'
      },
      {
        label: 'Novos recuperados',
        data: byDayData.recovered,
        backgroundColor: 'rgb(3, 169, 244)'
      },
      {
        label: 'Novos casos confirmados',
        data: byDayData.confirmed,
        backgroundColor: 'rgb(211, 47, 47)'
      },
      {
        label: 'Novos casos descartados',
        data: byDayData.discarded,
        backgroundColor: 'rgb(56, 142, 60)'
      },
      {
        label: 'Novos casos suspeitos',
        data: byDayData.suspects,
        backgroundColor: 'rgb(251, 192, 45)'
      }
    ]
  },
  options: byDayOptions()
})
