import React, {Component} from 'react';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis, LineSeries} from 'react-vis';
import {Button} from "@material-ui/core";

import {searchSuburb, suburbCaseDate, stateCaseDate, suburbName, stateName, searchState} from '../modules/scale'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class Analysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartdata: [],
            statecases:props.statecases,
            suburbcases: props.suburbcases,
            scale: 'state',
            name: 'VIC',
            loaded: false
        };
        this.handleScaleChange = this.handleScaleChange.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.upload = this.upload.bind(this);
        this.clearState=this.clearState.bind(this);
    }

    componentDidMount() {

        console.log("3.8 cases .."+this.state.suburbcases['0405'][1].cases)
        console.log("3.8 cases .."+this.state.suburbcases['0405'][1].Suburb)
        this.upload()


    }

    clearState=()=> {
        this.state.chartdata.length=0   }



    upload = () => {
        console.log("uploading")

        this.clearState()

        /*for (const datestr of suburbCaseDate) {

            for (const x of this.state.suburbcases[datestr]) {
                if (x.Suburb === datestr) {
                    let item = {x: datestr, y: x.cases}
                    //console.log("item x "+item.x+" y "+item.y)
                    this.setState({chartdata: [...this.state.chartdata, item]})
                }
            }
        }*/
       if (this.state.scale === 'state') {

           for (const datestr of stateCaseDate) {

               this.state.statecases[datestr].forEach(day => {
                       if (day.state === this.state.name) {
                           var item = {x: datestr, y: day.cases}
                           //console.log("item x " + item.x + " y " + item.y)
                           this.state.chartdata.push(item)
                           this.setState({chartdata:this.state.chartdata})
                       }
                   }
               )
           }
          // this.setState({loaded:true})
       }
        else if (this.state.scale === 'suburb') {

           for (const datestr of suburbCaseDate) {

               this.state.suburbcases[datestr].forEach(day => {
                       if (day.suburb === this.state.name) {
                           var item = {x: datestr, y: day.cases}
                           console.log("item x " + item.x + " y " + item.y)
                           this.state.chartdata.push(item)
                           this.setState({chartdata:this.state.chartdata})
                       }
                   }
               )
           }
        }

    }

    handleScaleChange = (event) => {
        this.clearState()
        this.setState({scale: (event.target.value)});


    };
    handleAreaChange = (event) => {
        console.log("chartdata1 "+this.state.chartdata[1].x)
        this.clearState()

        this.setState({name: (event.target.value)});
        this.upload()
    };

    render() {
        const timestamp = new Date('April 4 2020').getTime();
        const ONE_DAY = 86400000;

        return (
            <div>
                <div style={{display: 'flex', marginTop: '200px'}}>
                    <div>
                        <XYPlot
                            width={1200}
                            height={500}
                            xType="ordinal"
                        >
                            <LineSeries data={this.state.chartdata}/>
                            <XAxis title={'Date'}/>
                            <YAxis title={'Cases'}/>
                        </XYPlot>
                    </div>
                    <div>
                        <FormControl>
                            <InputLabel>Scale</InputLabel>
                            <Select
                                value={this.state.scale}
                                onChange={this.handleScaleChange}>
                                <MenuItem value={'state'}>state</MenuItem>
                                <MenuItem value={'suburb'}>suburb</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <br/>
                        <FormControl>
                            <InputLabel>Area</InputLabel>
                            <Select
                                value={this.state.name}
                                onChange={this.handleAreaChange}>

                                {this.state.scale === 'state' &&
                                stateName.map((key, i) =>
                                    <MenuItem key={i} value={key}>{key}</MenuItem>)}}

                                {this.state.scale === 'suburb' &&
                                suburbName.map((key, i) =>
                                    <MenuItem key={i} value={key}>{key}</MenuItem>)}}
                            </Select>
                        </FormControl>
                    </div>}
                </div>
            </div>
        );
    }
}

export default Analysis

