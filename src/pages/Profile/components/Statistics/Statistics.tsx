import { Switcher } from "../../../../components/Switcher/Switcher";
import { CardStatisticsList } from "./components/CardStatisticsList/CardStatisticsList";

export function Statistics() {
  return (
    <section className="tab-content">
      <CardStatisticsList />
      {/* <Switcher /> */}
    </section>
  );
}
