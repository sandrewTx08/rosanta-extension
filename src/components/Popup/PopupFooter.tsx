const PopupFooter = () => {
	return (
		<footer className="bg-primary d-flex gap-3 py-2 px-4 justify-content-center">
			<a
				className="text-white text-decoration-none"
				href="https://www.roblox.com/my/avatar"
				target="_blank"
				rel="noopener noreferrer"
			>
				Avatar
			</a>

			<a
				target="_black"
				className="text-white text-decoration-none"
				href="https://github.com/sandrewTx08/rosanta-extension"
			>
				Homepage
			</a>

			<a
				target="_black"
				className="text-white text-decoration-none"
				href="https://www.paypal.com/donate/?hosted_button_id=SLTU45DK5LFSS"
			>
				Donations
			</a>
		</footer>
	);
};

export default PopupFooter;
