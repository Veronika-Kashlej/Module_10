import { useState } from "react";
import "./Profile.css";
import { EditProfile } from "../../components/EditProfile/EditProfile";
import { Preferences } from "../../components/Preferences/Preferences";
import { Actions } from "../../components/Actions/Actions";
const tabs = [
  {
    id: 0,
    label: "Profile info",
    content: (
      <div className="tab-profile-info">
        <EditProfile />
        <Preferences />
        <Actions />
      </div>
    ),
  },
  {
    id: 1,
    label: "Statistics",
    content: <div className="tab-content"></div>,
  },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <main className="profile-page">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
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
