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
import { useState, useEffect } from "react";
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
  labels: string[];
  datasets: any[];
}

export const LineChart = ({ labels, datasets }: LineChartProps) => {
  const [chartWidth, setChartWidth] = useState(0);
  const chartHeight = 300;

  useEffect(() => {
    const setWidth = () => {
      const dashboard = document.querySelector("#dashboard");
      console.log("dashboard", dashboard?.clientWidth);
      setChartWidth((dashboard?.clientWidth || 0) - 40);
    };

    setWidth();
  }, []);

  return (
    chartWidth > 0 && (
      <Line
        height={chartHeight}
        width={chartWidth}
        data={{
          labels,
          datasets,
        }}
        options={{
          // responsive: false,
          // maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                color: "#fff",
              },
              // display: false,
              // backgroundColor: "#eee",
              border: {
                color: "transparent",
              },
            },
            y: {
              // display: false,
              // backgroundColor: "#eee",
              grid: {
                // tickBorderDash: [15],
                color: "#f5f5f5",
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
    )
  );
};
