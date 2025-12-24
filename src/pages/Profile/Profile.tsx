import { useState } from "react";
import "./Profile.css";
import { ProfileInfo } from "./components/ProfileInfo/ProfileInfo";
import { Statistics } from "./components/Statistics/Statistics";
const tabs = [
  {
    id: 0,
    label: "Profile info",
    content: <ProfileInfo />,
  },
  {
    id: 1,
    label: "Statistics",
    content: <Statistics />,
  },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <main className="profile-page">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((tab) => tab.id === activeTab)?.content}
    </main>
  );
}
