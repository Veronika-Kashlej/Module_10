import { useEffect, useState } from "react";
import { SectionItem } from "../../../../components/SectionItem/SectionItem";
import { profileApi } from "../../../../store/api";
import { SuggestedPeople } from "../../../../store/types";

export function SuggestedPeopleSection() {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedPeople[]>([]);
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await profileApi.getSuggestedUsers();
        setSuggestedUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuggestedUsers();
  }, []);
  return (
    <aside>
      <h2>Suggested people</h2>
      <div className="aside-list">
        {suggestedUsers.map((user, index) => (
          <SectionItem
            key={user.id}
            title={`${user.firstName} ${user.secondName}`}
            subtitle={`@${user.username}`}
            image={user.photo}
          />
        ))}
      </div>
    </aside>
  );
}
