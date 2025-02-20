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
import zoomPlugin from "chartjs-plugin-zoom";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { hexToRgba } from "../utils/hexToRGB";

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

interface Dataset {
  label: string;
  data: number[];
  color: string;
}

interface LineChartProps {
  labels: string[];
  datasets: Dataset[];
}

export const LineChart = ({ labels, datasets }: LineChartProps) => {
  const [chartWidth, setChartWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartHeight = 300;

  useEffect(() => {
    const updateChartWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth - 40);
      }
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);

    return () => {
      window.removeEventListener("resize", updateChartWidth);
    };
  }, []);

  const createGradient = (
    ctx: CanvasRenderingContext2D,
    chartArea: any,
    color: string,
  ) => {
    if (!chartArea) return null;

    const { top, bottom } = chartArea;
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, hexToRgba(color, 1));
    gradient.addColorStop(1, hexToRgba(color, 1));
    return gradient;
  };

  const chartData = {
    labels,
    datasets: datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: hexToRgba(dataset.color, 1),
      pointBackgroundColor: hexToRgba(dataset.color, 1),
      backgroundColor: (context: any) => {
        const { chart } = context;
        const { ctx, chartArea } = chart;
        return (
          createGradient(ctx, chartArea, dataset.color) ||
          hexToRgba(dataset.color, 0.5)
        );
      },
      tension: 0,
      pointRadius: 0,
      fill: true,
      borderWidth: 0,
    })),
  };

  const chartOptions = {
    animation: {
      duration: 0,
      delay: 0,
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: { color: "#fff", lineWidth: 0.5 },
        border: { display: false },
        ticks: {
          color: "#000",
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "bottom" as const,
        labels: { usePointStyle: true },
      },
      zoom: {
        zoom: {
          drag: { enabled: true },
          mode: "x" as "x" | "y" | "xy",
        },
      },
    },
  };

  return (
    <div ref={containerRef} className="w-100">
      {chartWidth > 0 && (
        <Line
          data={chartData}
          options={chartOptions}
          width={chartWidth}
          height={chartHeight}
        />
      )}
    </div>
  );
};
