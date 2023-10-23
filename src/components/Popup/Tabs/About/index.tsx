import Markdown from "markdown-to-jsx";
import { Stack } from "react-bootstrap";
export const About: React.FC = () => {
	return (
		<Stack gap={2}>
			<Markdown>{`
# About

**RoSanta** automatically get free items from the Roblox website and provides catalog automations related.

## Why

On the recent update on Roblox, now creators can publish free bundles and heads, causing a large amount of free items published on the day, some of them after minutes turning into paid items.

## Solution

**RoSanta** autobuyer track, compare, notify and display the newest free items from Roblox catalog then purchase them before they change its value.

## Download

<p flot="left">
<a href="https://chromewebstore.google.com/detail/rosanta-roblox-free-catal/jihbdahgiamkbmjdohfaglmojmilhdbd"><img width="246" src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/iNEddTyWiMfLSwFD6qGq.png" alt="Chrome Web Store" />
</a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/rosanta-roblox-autobuyer/"><img width="200" src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg" alt="Firefox Browser Add-ons" /></a>
</p>

## Did you like?

Rate us on <a href="https://chromewebstore.google.com/detail/rosanta-roblox-free-catal/jihbdahgiamkbmjdohfaglmojmilhdbd">Chrome Web Store</a>
 and <a href="https://addons.mozilla.org/en-US/firefox/addon/rosanta-roblox-autobuyer/">Firefox Add-ons</a>

## Donations

<a href="https://www.paypal.com/donate/?hosted_button_id=SLTU45DK5LFSS">
<img width="252" src="https://raw.githubusercontent.com/stefan-niedermann/paypal-donate-button/master/paypal-donate-button.png" alt="Donate with PayPal" />
</a>`}</Markdown>
		</Stack>
	);
};

export default About;
