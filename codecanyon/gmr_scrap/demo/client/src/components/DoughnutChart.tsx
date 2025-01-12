import {
  ArcElement,
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
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
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

export const DoughnutChart = ({
  data,
  total,
}: {
  data: number[];
  total: number;
}) => {
  return (
    <div
      className="position-relative"
      // style={{ height: "100px", width: "100px" }}
    >
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <strong className="fs-3">{total}</strong>
        <p className="m-0 text-muted mt-n2">Total</p>
      </div>
      <Doughnut
        data={{
          datasets: [
            {
              data,
              borderWidth: 0,
              // bg-primary bg-success bg-info bg-warning
              backgroundColor: ["#3e2c41", "#a4c694", "#a1d6e2", "#f6e27f"],
              borderRadius: 20,
              borderAlign: "center",
              spacing: 10,
              circular: true,
              // animation: {
              //   duration: 0,
              // },
            },
          ],
        }}
        options={{
          // cutout: 50,
          layout: {
            padding: 10,
            autoPadding: false,
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
};
