import RobloxUser from "../../../../roblox/roblox-user/RobloxUser";

const UserTab = ({ robloxUser }: { robloxUser?: RobloxUser }) => {
	return robloxUser ? (
		<div className="p-4">
			Hi <b>{robloxUser.displayName}</b>!
		</div>
	) : (
		<div className="p-4">
			User not found, please <a href="https://www.roblox.com/login">login</a>
		</div>
	);
};

export default UserTab;
