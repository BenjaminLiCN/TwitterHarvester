import React , { Component } from 'react';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis,LineSeries} from 'react-vis';
import {date} from '../modules/scale'

class Analysis extends Component{
    constructor(props) {
        super(props);
        this.state = {
            suburbCases:[],
            loaded:false,
        };
    }
   async componentDidMount() {

/*        await fetch('http://172.26.131.49:8081/confirmedAll/')
            .then(res=>res.json())
            .then(data=>{
                console.log('suburbcases'+data)
                let t=[]
                for(const x of date){
                    data[x].map(d=>{
                        t[d.Suburb][]=
                    })
                }
                t.push(data)

                console.log('cases0 '+this.state.allcases['0404'][0].cases)
                this.setState({loaded: true})
            }).catch(console.log)*/
    }

    render() {
        const timestamp = new Date('April 4 2020').getTime();
        const ONE_DAY = 86400000;

        const cases = [
            {x: '0404', y: 8},
            {x: '0405', y: 5},
            {x: '0406', y: 4},
        ];
        const mood=[
            {x: '0404', y: 0.2},
            {x: '0405', y: 0.7},
            {x: '0406', y: -0.3},
        ];
        return(
            <div>
                {this.state.loaded===true&&<div style={{marginTop:'150px'}}>
                <XYPlot
                    width={1200}
                    height={600}
                    xType="ordinal"

                >
                    <LineSeries data={cases}/>
                    <LineSeries data={cases}/>
                    <XAxis title={'Date'}/>
                    <YAxis />
                </XYPlot>
            </div>}
            </div>
        );
    }
}
export default Analysis

