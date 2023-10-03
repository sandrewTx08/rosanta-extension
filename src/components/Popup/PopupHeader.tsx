import BrowserStorage from "../../BrowserStorage";

const PopupHeader: React.FC<{ storage: BrowserStorage }> = ({ storage }) => {
	return (
		<header
			className="d-flex gap-4 justify-content-center pb-4 pt-2"
			style={{ height: 180 }}
		>
			<a
				target="_black"
				className="text-white text-decoration-none"
				href="https://github.com/sandrewTx08/rosanta-extension"
			>
				<img className="h-100 w-auto" src="icon.png" />
			</a>

			{storage.avatarHeadshot && (
				<div className="d-flex shadow-sm flex-column gap-2 text-center">
					<a
						className="d-block w-100 h-100"
						href={`https://www.roblox.com/users/${storage.robloxUser?.id}/profile`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							className="rounded w-100 h-100"
							src={storage.avatarHeadshot.data[0].imageUrl}
							alt=""
						/>
					</a>

					<b>{storage.robloxUser?.displayName}</b>
				</div>
			)}
		</header>
	);
};

export default PopupHeader;
