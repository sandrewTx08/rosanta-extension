import React from 'react';
import RobloxUser from '../../../../roblox/roblox-user/RobloxUser';

const UserTab: React.FC<{ robloxUser: RobloxUser }> = ({ robloxUser }) => {
  return (
    <div className="p-4">
      Hi <b>{robloxUser.displayName}</b>!
    </div>
  );
};

export default UserTab;
