import { Chart } from 'chart.js'
import { DateTime } from 'luxon'
import 'chartjs-adapter-luxon'
import data from '../data.json'

const labels = []
const cumulativeData = {
  deaths: [],
  confirmed: [],
  suspects: [],
  discarded: [],
  recovered: []
}
const byDayData = {
  confirmed: [],
  discarded: [],
  deaths: [],
  suspects: [],
  recovered: []
}
const prev = {
  confirmed: 0,
  discarded: 0,
  deaths: 0,
  suspects: 0,
  recovered: 0
}
// const suspectsByDayData = []

const mapData = (entryData) => {
  if (entryData == undefined || entryData > 0) {
    return entryData
  }
  return null
}

data.forEach((entry) => {
  labels.push(entry.date)

  for (let section in cumulativeData) {
    cumulativeData[section].push(mapData(entry[section]))
  }

  for (let section in byDayData) {
    byDayData[section].push(entry[section] - prev[section])
    prev[section] = entry[section]
  }

  // suspectsByDayData.push(entry.suspects + entry.discarded - prev.suspects)
  // prev.suspects = entry.suspects + entry.discarded
})

// byDayData.suspects = suspectsByDayData

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
        data: cumulativeData.deaths,
        label: 'Mortes',
        backgroundColor: 'rgba(33, 33, 33, 0.7)',
        borderColor: 'rgb(33, 33, 33)',
        pointBackgroundColor: 'rgb(33, 33, 33)'
      },
      {
        ...cumulativeChartDatasetOptions,
        data: cumulativeData.recovered,
        label: 'Recuperados',
        backgroundColor: 'rgba(3, 169, 244, 0.5)',
        borderColor: 'rgb(3, 169, 244)',
        pointBackgroundColor: 'rgb(3, 169, 244)'
      },
      {
        ...cumulativeChartDatasetOptions,
        data: cumulativeData.confirmed,
        label: 'Confirmados',
        backgroundColor: 'rgba(239, 83, 80, 0.7)',
        borderColor: 'rgb(211, 47, 47)',
        pointBackgroundColor: 'rgb(211, 47, 47)'
      },
      {
        ...cumulativeChartDatasetOptions,
        data: cumulativeData.discarded,
        label: 'Descartados',
        backgroundColor: 'rgba(102, 187, 10, 0.3)',
        borderColor: 'rgb(56, 142, 60)',
        pointBackgroundColor: 'rgb(56, 142, 60)'
      },
      {
        ...cumulativeChartDatasetOptions,
        data: cumulativeData.suspects,
        label: 'Suspeitos',
        backgroundColor: 'rgba(255, 238, 88, 0.3)',
        borderColor: 'rgb(251, 192, 45)',
        pointBackgroundColor: 'rgb(251, 192, 45)'
      }
    ]
  },
  options: cumulativeChartOptions()
})

const byDayOptions = () => {
  const options = commonOptions()
  options.scales.xAxes[0].offset = true
  options.title = {
    display: true,
    text: 'Novas notificações diárias'
  }
  return options
}

new Chart('by-day', {
  type: 'bar',
  data: {
    labels: labels,
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
