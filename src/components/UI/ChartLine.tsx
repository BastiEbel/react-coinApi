import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  ChartData,
  Point,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

type ChartUIProps = {
  data: ChartData<"line", (number | Point)[], unknown>;
};

export default function ChartLine({ data }: ChartUIProps) {
  return (
    <Line
      data={data as ChartData<"line", (number | Point)[], unknown>}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: { legend: { display: false } },
      }}
      style={{ height: "auto", width: "100%" }}
    />
  );
}
