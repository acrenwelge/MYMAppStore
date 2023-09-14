/* eslint-disable react/no-multi-comp */
import React from "react";

type TextbookProps = {
	child: React.ReactNode;
	codeName: string;
	image: string;
};

const Textbook: React.FC<TextbookProps> = (props): JSX.Element => {
	return (
		<>
			{props.child}
			<footer>
				<img
					alt="The National Science Foundation"
					src="https://www.mymathapps.com/images/nsf.png"
					style={{ verticalAlign: "middle", height: "3em" }}
				/>
				&emsp;Supported in part by NSF DUE CCLI / TUES Grants 0737209 / 1123170 (Meade) 
				and 0737209 / 1123255 (Yasskin)
			</footer>
		</>
	);
};

export default Textbook;
