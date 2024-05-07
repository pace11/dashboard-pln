import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, ChartDataLabels)

const PieChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        // anchor: "center",
        // backgroundColor: "#404244",
        // borderColor: "white",
        // borderRadius: 25,
        // borderWidth: 2,
        color: 'white',
        font: {
          size: 14,
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

  return <Pie options={options} data={data} />
}

export default PieChart
