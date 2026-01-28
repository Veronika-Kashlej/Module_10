import { Diagrams } from '../Diagrams/Diagrams';
import { CardStatisticsList } from './CardStatisticsList';

export function Statistics() {
    return (
        <section className="tab-content">
            <CardStatisticsList />
            <Diagrams />
        </section>
    );
}
