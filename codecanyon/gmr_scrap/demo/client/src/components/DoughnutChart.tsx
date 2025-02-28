import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatNumber } from "../utils/formatNumber";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
);

// Custom plugin for drawing text in the center of the doughnut
const textPlugin = {
  id: "textPlugin",
  beforeDraw(chart: any) {
    const { width, height, options } = chart;
    const ctx = chart.ctx;

    const text = options.plugins?.textPlugin?.text || ""; // Safely access the text property
    if (!text) return; // Exit early if no text is provided

    ctx.save();
    const fontSize = (height / 150).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = "middle";

    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.restore();
  },
};

// Register the custom plugin globally
ChartJS.register(textPlugin);

export const DoughnutChart = ({
  data,
  total,
}: {
  data: number[];
  total: number;
}) => {
  return (
    <div className="position-relative">
      <Doughnut
        data={{
          datasets: [
            {
              data,
              borderWidth: 0,
              backgroundColor: ["#ecd9dd", "#c9f29b"],
              borderRadius: 20,
              borderAlign: "center",
              spacing: 10,
              circular: true,
            },
          ],
        }}
        options={{
          cutout: "80%",
          layout: {
            padding: 10,
          },
          plugins: {
            legend: {
              display: false,
            },
            ["textPlugin" as any]: {
              text: formatNumber(total),
            },
          },
        }}
      />
    </div>
  );
};
