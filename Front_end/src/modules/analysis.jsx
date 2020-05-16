import React, { useState, useEffect } from 'react';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis, LineSeries,VerticalBarSeries,RadialChart} from 'react-vis';
import {Button} from "@material-ui/core";

import {searchSuburb, suburbCaseDate, stateCaseDate, suburbName, stateName, searchState,vicCases} from '../modules/scale'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { Line } from 'react-chartjs-2';



export default function Analysis(props){

    const vicCases=[]
    const [scale, setScale] = useState('state')
    const [area, setArea] = useState('VIC')
    const [casesData, setcasesData] = useState(vicCases)

    const [topicData, settopicData] = useState([])
    const [date, setDate]=useState('0513')
    const [loaded, setloaded]=useState(false)


    const clearState=()=> {
        setcasesData([])
    }

    useEffect(() => {
        for (const datestr of stateCaseDate) {

            props.statecases[datestr].forEach(day => {
                    if (day.state === 'VIC') {
                        var item = {x: datestr, y: day.cases}
                        vicCases.push(item)
                    }
                }
            )
        }
    });

    const upload = (name) => {
        console.log("uploading")

        clearState()

        /*for (const datestr of suburbCaseDate) {

            for (const x of props.suburbcases[datestr]) {
                if (x.Suburb === datestr) {
                    let item = {x: datestr, y: x.cases}
                    //console.log("item x "+item.x+" y "+item.y)
                    setcasesData([...casesData, item])
                }
            }
        }*/
       if (scale === 'state') {

           for (const datestr of stateCaseDate) {

               props.statecases[datestr].forEach(day => {
                       if (day.state === name) {
                           var item = {x: datestr, y: day.cases}
                           //console.log("item x " + item.x + " y " + item.y)
                           setcasesData(casesData=>[...casesData, item]);
                           set
                       }
                   }
               )
           }

           setloaded(true)



       }
        else if (scale === 'suburb') {

           for (const datestr of suburbCaseDate) {

               props.suburbcases[datestr].forEach(day => {
                       if (day.Suburb === name) {
                           var item = {x: datestr, y: day.cases}
                           console.log("item x " + item.x + " y " + item.y)
                           setcasesData(casesData=>[...casesData, item]);}
                   }
               )
           }


/*
           Object.keys(props.suburbtopic).forEach
           (
               date=>{
                   var total=0
                   Object.keys(props.suburbtopic[date]).forEach
                   (
                        suburb=>{
                           var topic = props.suburbtopic[date][suburb]
                           topic.map(
                               (t)=>{
                                    total+= Number(t.num)
                           }
                           )
                       }
                   )
                   var item = {x: date, y: total }
                   console.log("topics"+ item.x + item.y)
                   settopicData(topicData=>[...topicData, item]);

               }
           )
*/


       }

    }

    const handleScaleChange = (event) => {
        setScale(event.target.value)
    };

    const handleAreaChange = (event) => {
        setArea(event.target.value)
        upload(event.target.value)
    };


    const timestamp = new Date('April 4 2020').getTime();
    const ONE_DAY = 86400000;
    const Data = [
        {angle: 1}, {angle: 5}, {angle: 2}
    ]

        return (
            <div>
                <div style={{display: 'flex', marginTop: '200px',marginLeft:'60px'}}>

                    <div style={{width:'800px',height:'200px'}}>
                        <Line data={casesData}/>
                    </div>



                    {/*<div>
                        <XYPlot
                            width={1200}
                            height={200}
                            xType="ordinal"
                        >

                            <LineSeries data={casesData} animation damping={9} stiffness={300} color="#ffcdd2"/>
                            <VerticalBarSeries data={topicData} animation damping={9} stiffness={300} color="blue"/>
                            <XAxis title={'Date'} tickLabelAngle={40}/>
                            <YAxis title={'Cases'}/>
                        </XYPlot>

                        { !(casesData && casesData.length) && <Typography>Loading</Typography>}

                    <div style={{marginTop:'60px'}}>
                        <RadialChart
                            data={Data}
                            width={200}
                            height={200} />
                    </div>
                    </div>*/}

                    <div style={{marginLeft:'20px'}}>
                    <FormControl>
                            <InputLabel>Scale</InputLabel>
                            <Select
                                value={scale}
                                onChange={handleScaleChange}>
                                <MenuItem value={'suburb'}>suburb</MenuItem>
                                <MenuItem value={'state'}>state</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <br/>
                        <FormControl>
                            <InputLabel>Area</InputLabel>
                            <Select
                                value={area}
                                onChange={handleAreaChange}>
                                {scale === 'state' &&
                                stateName.map((key, i) =>
                                    <MenuItem key={i} value={key}>{key}</MenuItem>)}

                                {scale === 'suburb' &&
                                suburbName.map((key, i) =>
                                    <MenuItem key={i} value={key}>{key}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
        );
}


