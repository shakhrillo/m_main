import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { hexToRgba } from "../utils/hexToRGB";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
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

/**
 * Line chart component
 * @param labels - Array of labels
 * @param datasets - Array of datasets
 * @returns Line chart component
 */
export const LineChart = ({ labels, datasets }: LineChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const chartHeight = 350;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current)
        setChartWidth(containerRef.current.clientWidth - 40);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const createGradient = (
    ctx: CanvasRenderingContext2D,
    chartArea: any,
    color: string,
  ) => {
    if (!chartArea) return null;
    const { top, bottom } = chartArea;
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, hexToRgba(color, 0.5));
    gradient.addColorStop(1, hexToRgba(color, 0));
    return gradient;
  };

  const chartData = {
    labels,
    datasets: datasets.map(({ label, data, color }) => ({
      label,
      data,
      borderColor: hexToRgba(color, 1),
      pointBackgroundColor: hexToRgba(color, 1),
      backgroundColor: (context: any) =>
        createGradient(context.chart.ctx, context.chart.chartArea, color) ||
        hexToRgba(color, 0.5),
      tension: 0.1,
      fill: true,
    })),
  };

  const chartOptions = {
    animation: { duration: 0, delay: 0 },
    scales: {
      x: {
        grid: { color: "#fff" },
        ticks: { color: "#666", font: { size: 10 } },
      },
      y: {
        grid: { color: "#fff" },
        ticks: { color: "#666", font: { size: 10 } },
      },
    },
    plugins: {
      legend: { display: false },
      zoom: { zoom: { drag: { enabled: true }, mode: "x" as const } },
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
