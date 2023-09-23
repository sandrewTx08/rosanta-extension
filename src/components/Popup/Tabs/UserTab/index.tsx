import RobloxUser from "../../../../roblox/roblox-user/RobloxUser";

const UserTab = ({ robloxUser }: { robloxUser: RobloxUser }) => {
	return (
		<div className="p-4">
			Hi <b>{robloxUser.displayName}</b>!
		</div>
	);
};

export default UserTab;
