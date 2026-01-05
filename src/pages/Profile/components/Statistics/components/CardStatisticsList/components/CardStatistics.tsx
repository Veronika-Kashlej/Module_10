import { StatisticsCard } from "../../../../../../../store/types";
import "./CardStatistics.css";

export function CardStatistics({ title, count, progress }: StatisticsCard) {
  return (
    <div className="card-statistics">
      <p className="card-statistics-title">{title}</p>
      <p className="card-statistics-count">{count}</p>
      <p className="card-statistics-progress">{progress}</p>
    </div>
  );
}
