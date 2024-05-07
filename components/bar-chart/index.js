import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartDataLabels,
)

const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        color: 'white',
        font: {
          size: 12,
        },
        formatter(value) {
          return value > 0 ? value : null
        },
      },
      tooltip: {
        callbacks: {
          label(tooltipItems) {
            return `${tooltipItems.formattedValue} Pegawai`
          },
        },
      },
    },
  }

  return <Bar options={options} data={data} />
}

export default BarChart
