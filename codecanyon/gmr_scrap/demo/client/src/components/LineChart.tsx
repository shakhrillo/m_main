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
import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { hexToRgba } from "../utils/hexToRGB";
import zoomPlugin from "chartjs-plugin-zoom";

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
  zoomPlugin,
);

interface LineChartProps {
  labels: string[];
  datasets: any[];
}

export const LineChart = ({ labels, datasets }: LineChartProps) => {
  const [chartWidth, setChartWidth] = useState(0);
  const chartHeight = 300;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const setWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth - 40);
      }
    };

    setWidth();

    window.addEventListener("resize", setWidth);
    return () => {
      window.removeEventListener("resize", setWidth);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {chartWidth > 0 && (
        <Line
          height={chartHeight}
          width={chartWidth}
          data={{
            labels,
            datasets: datasets.map((dataset) => ({
              ...dataset,
              borderColor: hexToRgba(dataset["color"]),
              pointBackgroundColor: hexToRgba(dataset["color"]),
              tension: 0.4,
              pointRadius: 0,
              fill: true,
              borderWidth: 2,
              backgroundColor: (context: any) => {
                const { chart } = context;
                const { ctx, chartArea } = chart;

                if (!chartArea) {
                  return;
                }

                const { top, bottom } = chartArea;

                // Create a linear gradient
                const gradient = ctx.createLinearGradient(0, top, 0, bottom);
                gradient.addColorStop(0, hexToRgba(dataset["color"], 1));
                gradient.addColorStop(1, hexToRgba(dataset["color"], 0));

                return gradient;
              },
            })),
          }}
          options={{
            animation: {
              duration: 0,
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                border: {
                  display: false,
                },
                ticks: {
                  color: "#999",
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                grid: {
                  color: "#ccc",
                  lineWidth: 0.5,
                },
                border: {
                  display: false,
                },
                ticks: {
                  color: "#999",
                  font: {
                    size: 12,
                  },
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
              zoom: {
                zoom: {
                  drag: {
                    enabled: true,
                  },
                  mode: "x",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};
