import React, {Component} from 'react';
import {AppBar, withStyles,Toolbar, Typography, Tabs, Tab} from '@material-ui/core'

import MapContainer from './mapcontainer'
import Analysis from './analysis'
import Team from './team'

class Nav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            statecases: false,
            suburbcases: false,
            statetopic:false,
            stateemotion: false,
            suburbtopic: false,
            suburbemotion : false,
            twitterday:[],
        }
        ;
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    componentWillMount() {
        fetch('http://172.26.131.49:8081/confirmedAllState/')
            .then(res => res.json())
            .then(statedata => {
                this.setState({statecases: statedata})
            }).catch(console.log)

        fetch('http://172.26.131.49:8081/confirmedAll/')
            .then(res => res.json())
            .then(suburbdata => {
                this.setState({suburbcases: suburbdata})
            }).catch(console.log)

        fetch('http://172.26.131.49:8081/state_hot_topics/')
            .then(res => res.json())
            .then(statedata => {
                this.setState({statetopic: statedata.doc})
            }).catch(console.log)

        fetch('http://172.26.131.49:8081/state_emotions/')
            .then(res => res.json())
            .then(statedata => {
                this.setState({stateemotion: statedata.doc})
            }).catch(console.log)

        fetch('http://172.26.131.49:8081/suburbAndHottopic/')
            .then(res => res.json())
            .then(suburbdata => {
                this.setState({suburbtopic: suburbdata.doc})
            }).catch(console.log)

        fetch('http://172.26.131.49:8081/suburbAndEmotion/')
            .then(res => res.json())
            .then(suburbdata => {
                this.setState({suburbemotion: suburbdata.doc})
            }).catch(console.log)

        fetch('http://172.26.131.49:8081/state_avg_emotion/')
            .then(res => res.json())
            .then(statedata => {
                this.setState({stateavg: statedata.doc})
            }).catch(console.log)

        fetch('http://172.26.131.49:8081/suburb_avg_emotion/')
            .then(res => res.json())
            .then(suburbdata => {
                this.setState({suburbavg: suburbdata.doc})
            }).catch(console.log)


    }

    render() {

        const {value} = this.state;

        return (
            <div>
                <AppBar color="primary">
                    <div style={{marginTop:'40px', marginLeft:'80px'}}>
                    <Typography variant={"h1"}>
                        Covid-19 Analyse
                    </Typography>
                    </div>
                    <Toolbar variant={"dense"} style={{marginLeft:'auto'}}>
                        <Tabs value={value}  style={{marginLeft:'auto'}} onChange={this.handleChange} indicatorColor={"white"}>
                            <Tab label="Overview"/>
                            <Tab label="Analyse"/>
                            <Tab label="Our Team"/>
                        </Tabs>
                    </Toolbar>
                </AppBar>

                {value === 0 && <MapContainer statecases={this.state.statecases} suburbcases={this.state.suburbcases} suburbtopic={this.state.suburbtopic} suburbemtion={this.state.suburbemotion} statetopic={this.state.statetopic} stateemotion={this.state.stateemotion} />}
                {value === 1 && <Analysis statecases={this.state.statecases} suburbcases={this.state.suburbcases} suburbtopic={this.state.suburbtopic} suburbemtion={this.state.suburbemotion} statetopic={this.state.statetopic} stateemotion={this.state.stateemotion} stateavg={this.state.stateavg} suburbavg={this.state.suburbavg}/>}
                {value === 2 && <Team/>}
            </div>
        )

    }
}

export default Nav;
