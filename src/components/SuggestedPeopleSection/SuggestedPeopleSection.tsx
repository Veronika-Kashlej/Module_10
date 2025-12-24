import { SectionItem } from "../SectionItem/SectionItem";

const suggestedPeople = [
  { name: "Helena", link: "@helenahills" },
  { name: "Charles", link: "@charles" },
  { name: "Oscar Davis", link: "@oscardavis" },
  { name: "Daniel Jay Park", link: "@danielj" },
  { name: "Carlo Rojas", link: "@carlorojas" },
];

export function SuggestedPeopleSection() {
  return (
    <aside>
      <h2>Suggested people</h2>
      <div className="aside-list">
        {suggestedPeople.map((user, index) => (
          <SectionItem key={index} title={user.name} subtitle={user.link} />
        ))}
      </div>
    </aside>
  );
}
