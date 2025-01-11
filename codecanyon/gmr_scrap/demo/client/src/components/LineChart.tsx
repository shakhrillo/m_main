import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import "leaflet/dist/leaflet.css";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

interface LineChartProps {
  label: string;
  total: number;
  labels: string[];
  datasets: any[];
}

export const LineChart = ({
  total,
  label,
  labels,
  datasets,
}: LineChartProps) => {
  return (
    <div className="row g-0 row-cols-1 row-cols-md-2">
      <div className="col">
        <div className="fs-3">{total}</div>
        <p className="m-0">{label}</p>
        {/* <hr />
        <small>* Graph for the last 3 days</small> */}
      </div>
      <div className="col">
        <Line
          data={{
            labels,
            datasets,
          }}
          options={{
            scales: {
              x: {
                grid: {
                  color: "#fff",
                },
                display: false,
              },
              y: {
                display: false,
                backgroundColor: "#fff",
                grid: {
                  color: "#fff",
                },
                border: {
                  color: "transparent",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
                position: "bottom",
                labels: {
                  usePointStyle: true,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};
