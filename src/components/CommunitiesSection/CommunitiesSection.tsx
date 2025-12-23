import React from "react";
import { SectionItem } from "../SectionItem/SectionItem";

const Communities = [
  { name: "Design Enthusiasts", membersCount: "13.2k members" },
  { name: "Photographers of SF", membersCount: "2k members" },
  { name: "Marina crew", membersCount: "125 members" },
];

export class CommunitiesSection extends React.Component {
  render() {
    return (
      <section>
        <h2>Communities you might like</h2>
        <div className="section-list">
          {Communities.map((community, index) => (
            <SectionItem
              key={index}
              title={community.name}
              subtitle={community.membersCount}
            />
          ))}
        </div>
      </section>
    );
  }
}
