import { Diagrams } from '../Diagrams/Diagrams';
import { CardStatisticsList } from './CardStatisticsList';

export function Statistics() {
    return (
        <section className="tab-content" role="tabpanel" aria-labelledby="tab2">
            <CardStatisticsList />
            <Diagrams />
        </section>
    );
}
