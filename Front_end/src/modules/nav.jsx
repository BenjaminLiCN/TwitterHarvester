import React, {Component} from 'react';
import {AppBar, withStyles,Toolbar, Typography, Tabs, Tab} from '@material-ui/core'

import MapContainer from './mapcontainer'
import Summary from './summary'
import Analysis from './analysis'
import Team from './team'


const styles = theme => ({
    flex: {
        flexGrow: 1
    }
});


class Nav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            statecases: false,
            suburbcases: false
        }
        ;
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    async componentWillMount() {
       await fetch('http://172.26.131.49:8081/confirmedAllState/')
            .then(res => res.json())
            .then(statedata => {
                this.setState({statecases: statedata})
            }).catch(console.log)


       await fetch('http://172.26.131.49:8081/confirmedAll/')
            .then(res => res.json())
            .then(suburbdata => {
                this.setState({suburbcases: suburbdata})
            }).catch(console.log)
    }

    render() {

        const {value} = this.state;
        const {classes}= this.props;


        return (
            <div>
                <div className={classes.flex}>
                <AppBar color="primary">
                    <Toolbar variant="dense">
                    <Typography variant={"h1"} className={classes.flex}>
                        Covid-19 Analyse
                    </Typography>
                    </Toolbar>
                    <Toolbar variant={"dense"}>
                        <Tabs value={value} onChange={this.handleChange} indicatorColor={"white"}>
                            <Tab label="Overview"/>
                            <Tab label="Map Analysis"/>
                            <Tab label="Correlation Analyse"/>
                            <Tab label="Our Team"/>
                        </Tabs>
                    </Toolbar>
                </AppBar>
                </div>
                {value === 0 && <MapContainer/>}
                {value === 1 && <Summary/>}
                {value === 2 && <Analysis statecases={this.state.statecases} suburbcases={this.state.suburbcases}/>}
                {value === 3 && <Team/>}
            </div>
        )

    }
}

export default withStyles(styles)(Nav);
