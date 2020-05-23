import React, {Component} from 'react';
import {Typography, Grid} from '@material-ui/core';
import PeerCard from './peercard'



class Team extends Component {

    render() {
        return(
            <div>

                <div>
                    <Typography variant="h6" color="primary">
                        <div style={{marin: "0 auto", padding: "140px 40px 40px 40px", textAlign: "center"}}>
                            The Covid-19 twitter analyse project is designed to collect and analyse the twitter posts located
                            within Victoria, Australia. Sentiment analysis is conducted on the harvested tweets to identify the ratio of
                            sentiment posts in each local government area.
                            The development of the twitter harvesting and data analysis model is used to identify the relationship between the ratio
                            of tweets harvest and social factors:
                            COVID patients cases, twitters' hot topics statistics, and twitters' emotion analysis in the year 2020.<br/> <br/>
                            Team members information can be found below.
                        </div>
                    </Typography>
                </div>

                <div style={{margin: "20px"}}>
                    <Grid container spacing={16}>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Benjieming Li"}
                                role={"Dev ops"}
                                Introduction={["Dev-ops and data analysing", "Benjieming Li is a Master of Information Technology student. He had internship in Alibaba and he got offer from well-know Internet companies. He is responsible for the dev-ops in this project."]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Chuang Wang"}
                                role={"Back-end Developer"}
                                Introduction={["Back-end development and data analysing", "Chuang Wang is a Master of Software Engineer student, he is currently employed as a tutor in multiple subjects. He is responsible for data analysis and back-end development in the project."]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Honglong Zhang"}
                                role={"Dev ops and Back-end Developer"}
                                Introduction={["Backend development and dev-ops", "Honglong Zhang is a Master of Information Technology student. He had working experience in Tencent and he was proficient in system architecture build and development. He is responsible for dev-ops and back-end development."]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Yangyang Hu"}
                                role={"Data Analyst"}
                                Introduction={["Web Scraping and data analysing", "Yangyang Hu is a Master of Information Technology student. She was highly ranked in the kaggle competition in the knowledge technology course. She is responsible for the data scraping in this project."]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Wei Lin"}
                                role={"Front-end Developer"}
                                Introduction={["Front-end development and data visualization", "Wei Lin is a Master of Information Technology student, she had working experience as a product manager in company and tech teams. She is responsible for the front end and data visualization."
                                ]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}/>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default Team;