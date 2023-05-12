import React from "react";
import { Header, Divider,List,Image } from "semantic-ui-react";

import Page from "../../components/Page";
import YasskinImg from "../../resources/images/yasskin.png";
import MeadeImg from "../../resources/images/meade.png";
import NCImg from "../../resources/images/nc.jpg"
import YSImg from "../../resources/images/ys.jpg"
import LYQImg from "../../resources/images/lyq.jpg"
import ZZTImg from "../../resources/images/zzt.jpg"
import WSYImg from '../../resources/images/wsy.jpg'
import DYImg from '../../resources/images/dy.jpg'
import Person from "./Person";

const PersonInfo = [
	{
		name: "Dr. Philip B. Yasskin",
		img: YasskinImg,
		about:
			"Dr. Yasskin is an Associate Professor in the Department of Mathematics at Texas A&M University. Dr. Yasskin has been using computer algebra systems since the mid 1970s and Maple since 1992. He is one of the pioneers of web-based Maple applications. He is the principal author on the single and multivariable Maple lab manuals for Stewart's Calculus texts. For 4 years he supervised the Maple computer labs for the first year engineering calculus courses. Dr. Yasskin is also a Co-Director of the TAMU Summer Educational Enrichment in Math for middle school students and of the TAMU Math Circle for middle and high school students, and is the National Program Director for the Special Interest Group of the MAA on Math Circles."
	},
	{
		name: "Dr. Douglas B. Meade",
		img: MeadeImg,
		about:
			"Dr. Meade is the Director of Undergraduate Studies and an Associate Professor in the Department of Mathematics at the University of South Carolina. Dr. Meade has more than twenty years of experience using Maple for both research and education, and was a pioneer in creating (legal) Internet accessible Maple-based applications. Among his publications are a textbook for freshman engineering, several online courses, and numerous Maple supplements to top-selling calculus, linear algebra, and differential equations textbooks. Dr Meade also supervises the administration of the the Math Placement Tests at the University of South Carolina."
	}
];

const About: React.FC = (props): JSX.Element => {
	return (
		<Page>
			<Header as="h1">About Us</Header>
			<Divider />
			{PersonInfo.map((p, i) => (
				<Person key={i} {...p} />
			))}
			<h2>Development Team</h2>
			<List  style={{paddingBottom:'66px'}} animated verticalAlign='middle' relaxed='very'>
				<List.Item>
					<Image avatar src={NCImg} />
					<List.Content>
						<List.Header as='a'>Cheng Niu</List.Header>
						<List.Description>
							Architect, Security, Front-end, Back-end, Deploy
						</List.Description>
					</List.Content>
				</List.Item>
				<List.Item>
					<Image avatar src={YSImg} />
					<List.Content>
						<List.Header as='a'>Shuang Yu</List.Header>
						<List.Description>
							Front-end, Back-end, Test
						</List.Description>
					</List.Content>
				</List.Item>
				<List.Item>
					<Image avatar src={LYQImg} />
					<List.Content>
						<List.Header as='a'>Yongqing Liang</List.Header>
						<List.Description>
							Front-end, Back-end, Test, Payment
						</List.Description>
					</List.Content>
				</List.Item>
				<List.Item>
					<Image avatar src={ZZTImg} />
					<List.Content>
						<List.Header as='a'>Zhiting Zhao</List.Header>
						<List.Description>
							Front-end, Back-end, Test
						</List.Description>
					</List.Content>
				</List.Item>
				<List.Item>
					<Image avatar src={WSYImg} />
					<List.Content>
						<List.Header as='a'>Shuyu Wang</List.Header>
						<List.Description>Front-end, Back-end, Test, Communication</List.Description>
					</List.Content>
				</List.Item>
				<List.Item>
					<Image avatar src={DYImg} />
					<List.Content>
						<List.Header as='a'>Yun Du</List.Header>
						<List.Description>Test</List.Description>
					</List.Content>
				</List.Item>
			</List>
		</Page>
	);
};

export default About;
