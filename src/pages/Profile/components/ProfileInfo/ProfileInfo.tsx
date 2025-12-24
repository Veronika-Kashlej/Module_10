import { Actions } from "./components/Actions/Actions";
import { EditProfile } from "./components/EditProfile/EditProfile";
import { Preferences } from "./components/Preferences/Preferences";

export function ProfileInfo() {
  return (
    <div className="tab-profile-info">
      <EditProfile />
      <Preferences />
      <Actions />
    </div>
  );
}
