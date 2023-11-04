import Markdown from "markdown-to-jsx";
// @ts-ignore
import Readme from "../../../../../README.md?raw";
import { Stack } from "react-bootstrap";

export const About: React.FC = () => {
	return (
		<Stack>
			<Markdown id="about">{Readme}</Markdown>
		</Stack>
	);
};

export default About;
