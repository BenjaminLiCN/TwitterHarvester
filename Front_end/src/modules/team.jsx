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
                            The development of the ML model is used to identify the relationship between the ratio
                            of tweets harvest and social factors:
                            COVID patients numbers, people's sentiment evaluation, hospital numbers and income status(poor/rich), in the year 2020.
                            This model can also be used for sentiment prediction. <br/> <br/>
                            This project is designed and developed by a team of University of Melbourne students.
                            Detailed information can be found below.
                        </div>
                    </Typography>
                </div>

                <div style={{margin: "20px"}}>
                    <Grid container spacing={16}>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Benjieming Li"}
                                role={"Database Administrator"}
                                Introduction={["Dev-ops and data analysing", "Benjieming Li is a Master of Information Technology student. He had internship in Alibaba. He is responsible for the dev-ops in this project."]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Chuang Wang"}
                                role={"Back-end Developer"}
                                Introduction={["Back-end development and data analysing", "Chuang Wang is a Master of Information Technology student, he is also working as a tutor in more than one subjects. He is responsible for back-end development in the project."]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Honglong Zhang"}
                                role={"Back-end Developer"}
                                Introduction={["Backend development and dev-ops", "Honglong Zhang is a Master of Information Technology student. He had working experience in Tencent and he was proficient in development."]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Yangyang Hu"}
                                role={"Data Analyst"}
                                Introduction={["Web Scraping and data analysing", "Yangyang Hu is a Master of Data Science student. She is responsible for the data scraping and data analysing of this project."]}
                            />
                        </Grid>
                        <Grid md={6} lg={4}>
                            <PeerCard
                                name={"Wei Lin"}
                                role={"Front-end Developer"}
                                Introduction={["Front-end development and data visualization", "Wei Lin is a Master of Information Technology student, she had working experience as a product manager in company and tech teams."
                                    /*, " https://www.linkedin.com/in/wei-lin-894238b7/"*/]}
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