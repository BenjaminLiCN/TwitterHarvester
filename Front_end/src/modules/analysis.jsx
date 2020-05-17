import React, {useState, useEffect} from 'react';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis, LineSeries, VerticalBarSeries, RadialChart} from 'react-vis';

import {
    searchSuburb,
    suburbCaseDate,
    stateCaseDate,
    suburbName,
    stateName,
    searchState,
    twitterDate
} from '../modules/scale'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import {Line, Bar} from 'react-chartjs-2';

import {strFromDate} from '../methods/DateTransfer'


export default function Analysis(props) {

    const [scale, setScale] = useState('suburb')
    const [area, setArea] = useState('ballarat')
    const [casesData, setcasesData] = useState([])
    const [topicAxis, settopicAxis] = useState([])
    const [casesAxis, setcasesAxis] = useState([])
    const [topicData, settopicData] = useState([])

    const [barAxis, setbarAxis] = useState([])
    const [barData, setbarData] = useState([])

    const [bar2Axis, setbar2Axis] = useState([])
    const [bar2Data, setbar2Data] = useState([])


    const [date, setDate] = useState('0513')
    const [loaded, setloaded] = useState(false)


    const clearState = () => {
        casesAxis.length = 0
        casesData.length = 0
        barAxis.length = 0
        barData.length = 0
        bar2Axis.length = 0
        bar2Data.length = 0
    }

    useEffect(() => {

    });

    const upload = (name, date) => {
        console.log("uploading")

        clearState()


        if (scale === 'state') {

            for (const datestr of stateCaseDate) {

                props.statecases[datestr].forEach(day => {
                        if (day.state === name) {
                            setcasesAxis(casesAxis => [...casesAxis, datestr])
                            setcasesData(casesData => [...casesData, day.cases]);
                        }
                    }
                )
            }

            setloaded(true)


        } else if (scale === 'suburb') {

            for (const datestr of suburbCaseDate) {

                props.suburbcases[datestr].forEach(day => {
                        if (day.Suburb === name) {
                            setcasesAxis(casesAxis => [...casesAxis, datestr])
                            setcasesData(casesData => [...casesData, day.cases]);
                        }
                    }
                )
            }

            var low = name.toLowerCase()


            var topic = props.suburbtopic[date][low]
            try {

                topic.map(
                    (t) => {
                        setbarAxis(barAxis => [...barAxis, t.word])
                        setbarData(barData => [...barData, t.num])
                    }
                )
            } catch (e) {
                console.log(e)
            }


            var emotion = props.suburbemtion[date][low]
            try {
                emotion.map(
                    (t) => {
                        setbar2Axis(bar2Axis => [...bar2Axis, t.emotion])
                        setbar2Data(bar2Data => [...bar2Data, t.num])
                    }
                )
            } catch (e) {
                console.log(e)
            }


            Object.keys(props.suburbtopic).forEach
            (date => {
                    var total = 0
                    Object.keys(props.suburbtopic[date]).forEach
                    (
                        suburb => {
                            var topic = props.suburbtopic[date][suburb]
                            topic.map(
                                (t) => {
                                    total += Number(t.num)
                                }
                            )
                        }
                    )
                    var item1 = {x: date, y: total}
                    //settopicData(topicData=>[...topicData, totalitem]);
                }
            )
        }
    }


    const handleScaleChange = (event) => {
        setScale(event.target.value)
    };

    const handleAreaChange = (event) => {
        setArea(event.target.value)
        upload(event.target.value, date)
    };
    const handleDateChange = (event) => {
        setDate(event.target.value)
        upload(area, event.target.value)
    }

    const timestamp = new Date('April 4 2020').getTime();
    const ONE_DAY = 86400000;
    const Data = [
        {angle: 1}, {angle: 5}, {angle: 2}
    ]
    const d1 = [1, 2, 3]
    const d2 = [2, 4, 3]
    return (
        <div>
            <div style={{marginTop: '140px', marginLeft: '80px'}}>
                <div style={{display: 'flex'}}>
                    <div style={{width: '600px', height: '200px', marginRight: '200px'}}>
                        <Line data={{
                            labels: casesAxis, datasets: [{
                                data: casesData, backgroundColor: '#b39ddb',fill: false, label: 'cases',
                            }]
                        }}/>
                    </div>

                    <div>
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
                        <br/>
                        <br/>
                        <FormControl>
                            <InputLabel>Date</InputLabel>
                            <Select
                                value={date}
                                onChange={handleDateChange}>
                                {twitterDate.map(key =>
                                    <MenuItem value={key}>{key}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div style={{display:'flex', marginTop: '120px'}}>
                <div style={{width: '800px', height: '200px'}}>
                    <Bar data={{
                        labels: barAxis, datasets: [{
                            data: barData, backgroundColor: '#b39ddb',fill: false, label: 'twitter topic',
                        }]
                    }}/>
                </div>
                    <div style={{width: '600px', height: '200px',marginLeft:'80px'}}>
                        <Bar data={{
                            labels: bar2Axis, datasets: [{
                                data: bar2Data,backgroundColor: '#b39ddb', fill: false, label: 'twitter emition',
                            }]
                        }}/>
                    </div>
                </div>
                <br/>


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


            </div>
        </div>
    );
}


