import React, {Component} from 'react';
import ReactDOM from "react-dom";
import ReactDOMServer from 'react-dom/server';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {Checkbox} from "@material-ui/core";
import {PieChart} from 'react-chartkick'
import 'chart.js'
import Echart from './Echart'
import MarkerClusterer from 'node-js-marker-clusterer';
import Colorlegend from "./colorlegend";

import { ContinuousColorLegend,SearchableDiscreteColorLegend } from "react-vis";
import { Bullet } from '@nivo/bullet'


import {colorOnConfirmed} from '../methods/defineColor'



import mapStyles from '../resources/mapstyle.json';
import InnerMap from './innermap';
import * as location from './location'
import hospital_marker from '../resources/hospital_marker.png'
import school_marker from '../resources/school_marker.png'
import toiletpaper_marker from '../resources/toiletpaper_marker.png'
import discrimination_marker from '../resources/discrimination_marker.png'

import {fetchHospitals} from '../methods/fetchAPIs'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
const styles = theme => ({
    map: {
        width: '100%',
        height: "846px"
    },
    mapContainer: {
        width: "100%",
        height: "846px",
        boxShadow: "0 2px 8px 0 #d7d7d7"
    }
})

//1.20 人传人确定 1.23 武汉封城 1.31 global emergency declared 2.1澳洲禁止中国 3.7 toilet paper 3.11 europe new epiccentre
//3.15 aus 14-day qarantine for oversea returners 3.20 australia lockdown 3.23 aus cafes shutdown  3.30 victoria stage 3
//5.13 stage 3 eased
const keyDates = [
    {value: 18, info: "human-to-human transmission confirmed"},
    {value: 24, info: "Wuhan lockdown started"},
    {value: 28, info: "global emergency declared"},
    {value: 35, info: "travel ban issued for Chinese nationals"},
    {value: 64, info: "toilet paper crisis in Australia"},
    {value: 72, info: "Europe became new epicentre"},
    {value: 79, info: "14-day quarantine needed for returners from overseas"},
    {value: 84, info: "Australia closed its borders"},
    {value: 86, info: "cafes shutdown"},
    {value: 93, info: "stage 3 restrictions in place in Victoria"},
    {value: 120, info: "restrictions lifted in Victoria"},
];

const marks = [
    {
        value: 0,
        label: '01/01',
    },
    {
        value: 27,
        label: '29/01',
    },
    {
        value: 58,
        label: '29/02',
    },
    {
        value: 83,
        label: '29/03',
    },
    {
        value: 110,
        label: '01/05',
    },
    {
        value: 120,
        label: '13/05',
    }
];
const AirbnbSlider = withStyles({
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        height: 27,
        width: 27,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        marginTop: -12,
        marginLeft: -13,
        boxShadow: '#ebebeb 0px 2px 2px',
        '&:focus, &:hover, &$active': {
            boxShadow: '#ccc 0px 2px 3px 1px',
        },
        '& .bar': {
            // display: inline-block !important;
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    active: {},
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
    markLabel: {
        color: 'grey'
    },
    markLabelActive: {
        color: '#fff'
    },
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
})(Slider);
function valuetext(value) {
    return `Date: ${value}`;
}
function AirbnbThumbComponent(props) {
    return (
        <span {...props}>
      <span className="bar" />
      <span className="bar" />
    </span>
    );
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateInfo: {
                month: 1,
                week: 1,
                day: 1
            },
            showKeyDate: false,
            keyDateText: '',
            month: 3,
            hospital_location:[],
            school_location:[],
            hospitals: [],
            schools:[],
            toiletpapers:[],
            discriminations:[],
            cities:[],
            scale: 'state',
            confirm:[{Suburb:'aa',cases:46}],
            allcases:'false',
            showHospital: false,
            showSchool: false,
            showHotTopic: false,
            clearStyle:false,
            loaded: false,
            map:null,
            bottom:'100px',
            left:'20px',
            show:'none',
            cases:0,
            happy:5,
            sad:7,
            angry:8,
            fear:2,
            setOpen:false
        };
        this.initBorder = this.initBorder.bind(this)
        this.changeBorder = this.changeBorder.bind(this);
        this.initHospitalMarkers = this.initHospitalMarkers.bind(this);
        this.initSchoolMarkers = this.initSchoolMarkers.bind(this);
        this.initHotTopicMarkers = this.initHotTopicMarkers.bind(this);
    }



    handleClick = () => {
        this.setState({setOpen:true});
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({setOpen:false});
        this.setState({showKeyDate:false});
    };
    async componentDidMount() {

/*
        fetch('http://172.26.131.49:8081/hospital/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({hospital_location:data.doc})
                console.log(data.doc)
            }).catch(console.log)


        fetch('http://172.26.131.49:8081/school/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({school_location:data.doc})
                console.log(data.doc)
            }).catch(console.log)
*/


/*        await fetch('http://172.26.131.49:8081/confirmed/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({confirm:data.doc.map(c=>({Suburb:c.Suburb,cases:c.cases}))})
                console.log('confirm'+data.doc)
                console.log('cases0 '+this.state.confirm[0].cases)
                this.setState({loaded: true})
            }).catch(console.log)*/

        await fetch('http://172.26.131.49:8081/confirmedAll/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({allcases:data})
                console.log('confirmm'+data)
                console.log('cases0 '+this.state.allcases['0404'][0].cases)
                this.setState({loaded: true})
            }).catch(console.log)


    }

    initBorder(map) {

        const that= this;

        map.data.loadGeoJson('https://api.jsonbin.io/b/5eab07bf07d49135ba485cfa/5')
     //   map.data.loadGeoJson('https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json')
      /*  map.data.loadGeoJson('https://data.gov.au/geoserver/nsw-state-boundary/wfs?request=GetFeature&typeName=ckan_a1b278b1_59ef_4dea_8468_50eb09967f18&outputFormat=json')//nsw
        map.data.loadGeoJson('https://data.gov.au/geoserver/act-state-boundary-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_83468f0c_313d_4354_9592_289554eb2dc9&outputFormat=json')
       // map.data.loadGeoJson('https://data.gov.au/geoserver/vic-state-boundary-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_b90c2a19_d978_4e14_bb15_1114b46464fb&outputFormat=json')
        map.data.loadGeoJson('https://data.gov.au/geoserver/wa-state-boundary-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_5c00d495_21ba_452d_ae46_1ad0ca05e41f&outputFormat=json')
        map.data.loadGeoJson('https://data.gov.au/geoserver/tas-state-boundary/wfs?request=GetFeature&typeName=ckan_cf2ebc53_1633_4c5c_b892_bfc3945d913b&outputFormat=json')
        map.data.loadGeoJson('https://data.gov.au/geoserver/sa-state-boundary-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_8f996b8c_d939_4757_a231_3fec8cb8e929&outputFormat=json')
        map.data.loadGeoJson('https://data.gov.au/geoserver/nt-state-boundary-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_5162e11c_3259_4894_8b9e_f44540b6cb11&outputFormat=json')
        map.data.loadGeoJson('https://data.gov.au/geoserver/qld-state-boundary-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_2dbbec1a_99a2_4ee5_8806_53bc41d038a7&outputFormat=json')*/

        map.data.addListener('mouseover', function (event) {
            map.data.overrideStyle(event.feature, {
                fillColor: '#ff8a80',
                strokeWeight: 8,
                fillOpacity: 0.6
            });
            if(map.zoom>5 && (map.getCenter().lat()>-40&&map.getCenter().lat()<-30)&&(map.getCenter().lng()>135&&map.getCenter().lng()<150)) {
                console.log("load vic")
                that.setState({scale:'suburb'})
                map.data.loadGeoJson('https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json')
               // map.data.loadGeoJson('https://api.jsonbin.io/b/5eab07bf07d49135ba485cfa')
                that.setState({show:"none"});
            }



            if(that.state.month===4)
            {
                const happy= 'HAPPY_4'
                that.setState({happy: event.feature.getProperty(happy)})
                that.setState({sad: event.feature.getProperty('SAD_4')})
                that.setState({angry: event.feature.getProperty('ANGRY_4')})
                that.setState({fear: event.feature.getProperty('FEAR_4')})
                console.log("fear")
            }
            else if(that.state.month===3)
            {
                that.setState({happy: event.feature.getProperty('HAPPY_3')})
                that.setState({sad: event.feature.getProperty('SAD_3')})
                that.setState({angry: event.feature.getProperty('ANGRY_3')})
                that.setState({fear: event.feature.getProperty('FEAR_3')})
            }

            if(that.state.scale==='suburb}') {

                var name = event.feature.getProperty('vic_lga__3')

                if (that.state.month === 4)
                    var day = that.state.allcases['0407']
                else if (that.state.month === 3)
                    var day = that.state.allcases['0414']
                else if (that.state.month === 2)
                    var day = that.state.allcases['0429']
                else
                    var day = that.state.allcases['0501']

                for (var x of day) {
                    if (x.Suburb === name)
                        that.setState({cases: x.cases})
                }
            }

                if(that.state.month ===4 )
                    that.setState({cases: event.feature.getProperty('CONFIRMED_4')})
                else if(that.state.month ===3 )
                    that.setState({cases: event.feature.getProperty('CONFIRMED_3')})
                else if(that.state.month ===2 )
                    that.setState({cases: event.feature.getProperty('CONFIRMED_2')})
                else
                    that.setState({cases:'0'})

                console.log("mouseovercase"+that.state.cases)





        });

        map.data.addListener('mouseout', function () {
            map.data.revertStyle();
            // that.setState({show:"none"});
        });

        map.data.addListener('click', function (event) {
            const InfoWindowContent = (
                <div>
                    This is the info <br/>
                    ......

                </div>
            );


            console.log("zoom:"+map.getZoom())
            console.log("lat"+map.getCenter().lat())
            console.log("lng"+map.getCenter().lng())
            console.log((map.getCenter().lat())>-45)

            var latBound= map.getBounds().getNorthEast().lat()-map.getBounds().getSouthWest().lat()
            var latLocation = event.latLng.lat()-map.getBounds().getSouthWest().lat()
            var bottom= latLocation/latBound * 1000 -40 + "px"
            that.setState({bottom: bottom})
            console.log(bottom)

            var lngBound= map.getBounds().getNorthEast().lng()-map.getBounds().getSouthWest().lng()
            console.log("lngBound "+ lngBound)
            var lngLocation = event.latLng.lng()-map.getBounds().getSouthWest().lng()
            console.log("lngLocation "+ lngLocation)
            var left= lngLocation/lngBound * 1000 + 10 + "px"
            that.setState({left: left})
            console.log(left)



            if(that.state.show==="flex")
                that.setState({show:"none"});

            else
                 that.setState({show:"flex"});



   /*         let infoWindow = new window.google.maps.InfoWindow({position: event.latLng});
            const content = ReactDOMServer.renderToString(InfoWindowContent);
            infoWindow.setContent(content);
            infoWindow.open(map);
            window.google.maps.event.addListener(infoWindow, 'domready', function (e) {
            })*/

        });



        this.changeBorder(map)

        // this.setState({map:map})

    }

    changeBorder(map) {

        const that= this;

        map.data.setStyle(function (feature) {



               var cases = feature.getProperty('CONFIRMED');
               console.log("m" + that.state.month)
               if (that.state.month === 2){
                   console.log("this is 2")
                   cases = feature.getProperty('CONFIRMED_2');}
               else if (that.state.month === 3)
                   cases = feature.getProperty('CONFIRMED_3');
               else if (that.state.month === 4)
                   cases = feature.getProperty('CONFIRMED_4');

               console.log("casess"+cases)

            if(that.state.scale==='suburb}') {
                var name=feature.getProperty('vic_lga__3')
                if (that.stae.month === 4)
                    var day = that.state.allcases['0407']
                else if (that.state.month === 3)
                    var day = that.state.allcases['0414']
                else if (that.state.month === 2)
                    var day = that.state.allcases['0429']
                else
                    var day = that.state.allcases['0501']

                for (var x of day) {
                    // console.log('suburb cases'+x.Suburb+x.cases)
                    if (x.Suburb === name)
                        cases = x.cases
                }
            }



            let color=colorOnConfirmed(cases);

            return {
                fillColor: color,
                strokeWeight: 0.3,
                strokeOpacity: 0.3,
                fillOpacity: 0.4,
            };
        });

         this.setState({map:map})

    }
    initCitiesMarkers(map){

        location.cities.map(city => {
            this.state.cities.push(new window.google.maps.Marker({
                position: city,
                map: map,
            }))
        })
        this.state.map=map;

    }

    initHotTopicMarkers(map) {

            location.toiletpapers.map(toiletpaper => {
                this.state.toiletpapers.push(new window.google.maps.Marker({
                    position: toiletpaper,
                    map: map,
                    animation: window.google.maps.Animation.BOUNCE,
                    icon: toiletpaper_marker
                }))
            })
           this.state.map = map
        location.discriminations.map(discrimination => {
            this.state.discriminations.push(new window.google.maps.Marker({
                position: discrimination,
                map: map,
                animation: window.google.maps.Animation.BOUNCE,
                icon: discrimination_marker
            }))
        })
        this.state.map = map
    }



    initHospitalMarkers(map) {

/*        console.log("state"+this.state.datas)

             this.state.datas.map((hospital, index) => {
                        console.log(hospital.state)
                        this.state.hospitals.push(new window.google.maps.Marker({
                            position: hospital,
                            map: map,
                            icon: hospital_marker
                        }))
                    })*/

        location.hospitals.map(hospital => {
            this.state.hospitals.push(new window.google.maps.Marker({
                position: hospital,
                map: map,
                icon: hospital_marker
            }))
        })
        this.state.map=map;

    var markerCluster = new MarkerClusterer(map, this.state.hospitals,{
            styles: [{
                width: 16,
                height: 16,
                url: 'https://i.imgur.com/pZcCLJn.png',
            }],
        },
        );

        this.state.map=map;

    }
    initSchoolMarkers(map) {
        location.schools.map(school => {
            this.state.schools.push(new window.google.maps.Marker({
                position: school,
                map: map,
                icon: school_marker
            }))
        })
        this.state.map=map;

        var markerCluster = new MarkerClusterer(map, this.state.schools,{
                styles: [{
                    width: 16,
                    height: 16,
                    url: 'https://i.imgur.com/SvmeGSC.png',
                }],
            },
        );

        this.state.map=map;

    }

    DateChange = (event, value) => {

        this.setState({
            dateInfo: {
                month: value / 30 + 1,
                week: value / 7 + 1,
                day: value
            }
        });

        for (let day = 0; day < keyDates.length; day++) {
            if (keyDates[day].value === value) {
                this.handleClick();
                this.setState({showKeyDate: true, keyDateText: keyDates[day].info})
            }
        }
        if(this.state.showHotTopic)
             this.initHotTopicMarkers(this.state.map);

        this.changeBorder(this.state.map)

        console.log("set month to: " + value);
/*        if (value === 4)
                this.state.toiletpapers.map(toiletpaper => toiletpaper.setMap(null))
        else if (value === 3)
                this.state.discriminations.map(discrimination => discrimination.setMap(null))
           else if (value === 1 || value === 2)
            {
                this.state.toiletpapers.map(toiletpaper => toiletpaper.setMap(null))
                this.state.discriminations.map(discrimination => discrimination.setMap(null))
            }*/

    };

    styleChange = (event) =>{
        if(this.state.clearStyle)
            this.setState({clearStyle: false})
        else
            this.setState({clearStyle:true})
        if (event.target.checked){
            this.state.map.data.setStyle({})
        }

        }



    HospitalCheckboxChange = (event) => {

        if(this.state.showHospital)
            this.setState({showHospital:false});
        else
            this.setState({showHospital:true});
        if (event.target.checked)
            this.initHospitalMarkers(this.state.map);
        else
            this.state.hospitals.map(hospital => hospital.setMap(null))

    };

    SchoolCheckboxChange = (event) => {

        if(this.state.showSchool)
            this.setState({showSchool:false});
        else
            this.setState({showSchool:true});
        if (event.target.checked)
            this.initSchoolMarkers(this.state.map);
        else
            this.state.schools.map(school => school.setMap(null))

    };

    HotTopicCheckboxChange = (event) => {

        if(this.state.showHotTopic)
            this.setState({showHotTopic:false});
        else
            this.setState({showHotTopic:true});
        if (event.target.checked) {
            if(this.state.month===3||this.state.month===4)
                this.initHotTopicMarkers(this.state.map);
            if(this.state.month===3)
                this.state.discriminations.map(discrimination => discrimination.setMap(null))
            else if(this.state.month===4)
                this.state.toiletpapers.map(toiletpaper => toiletpaper.setMap(null))
        }
        else {
            this.state.toiletpapers.map(toiletpaper => toiletpaper.setMap(null))
            this.state.discriminations.map(discrimination => discrimination.setMap(null))
        }
        console.log("toilet paper"+this.state.toiletpapers)

    };


                render()
                {
                    const {classes} = this.props;

                    //if(this.state.loaded===true)

                    return (
                        <div>
                            <div className={classes.mapContainer}>
                                < InnerMap id="map"
                                           options={{center: {lat: -25.5, lng: 132.5}, zoom: 5, styles: mapStyles}}
                                           onMapLoad={(map) => this.initBorder(map)
                                           } changeBorder={this.changeBorder}/>

                            </div>

  {/*                          <div style={{display:'flex', position: 'absolute',bottom: '220px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.clearStyle}
                                    onChange={this.styleChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    Covid cases
                                </p>
                            </div>*/}



                            <div style={{display:'flex', position: 'absolute',bottom: '180px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.showHotTopic}
                                    onChange={this.HotTopicCheckboxChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    HotTopic
                                </p>
                            </div>

                            <div style={{display:'flex', position: 'absolute',bottom: '140px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.showHospital}
                                    onChange={this.HospitalCheckboxChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    Hospital
                                </p>
                            </div>

                            <div style={{width:"150px", height:"50px", display:this.state.show,position: 'absolute',bottom:this.state.bottom, left: this.state.left}}>
                                <div>
                                    <p>cases: {this.state.cases}</p><br/>
                                    <p>tweets: {parseInt(this.state.happy)+parseInt(this.state.sad)+parseInt(this.state.angry)+parseInt(this.state.fear)}</p><br/>
                                </div>
                                <PieChart data={[["happy", this.state.happy], ["Sad", this.state.sad],["Angry", this.state.angry],["Fear", this.state.fear]]} />

                            </div>
                            <div style={{display:'flex', position: 'absolute',bottom: '80px', right: '60px'}}>
                            <Colorlegend/>
                            </div>

                            <div style={{display:'flex', position: 'absolute',bottom: '100px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.showSchool}
                                    onChange={this.SchoolCheckboxChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    School
                                </p>
                            </div>

                           {/* <FormControl>
                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                    Area
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-placeholder-label-label"
                                    id="demo-simple-select-placeholder-label"
                                    value={area}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    className={classes.selectEmpty}
                                >
                                    <MenuItem value="">
                                        <em>State</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Suburb</MenuItem>
                                    <MenuItem value={20}>Cities</MenuItem>
                                </Select>
                                <FormHelperText>Area Select</FormHelperText>
                            </FormControl>*/}


                            <div style={{position: 'absolute', bottom: '-20px', left: '30px', width: '700px'}}>
                                {/*<p style={{color:'#FFFFFF'}}>*/}
                                {/*    Date*/}
                                {/*</p>*/}

                                {/*<Slider*/}
                                {/*    defaultValue={2}*/}
                                {/*    aria-labelledby="discrete-slider"*/}
                                {/*    valueLabelDisplay="auto"*/}
                                {/*    step={1}*/}
                                {/*    marks={true}*/}
                                {/*    min={1}*/}
                                {/*    max={4}*/}
                                {/*    onChange={this.DateChange}*/}
                                {/*/>*/}
                                <Typography style={{color:'#FFFFFF'}} id="discrete-slider-always" gutterBottom>
                                    Date selection
                                </Typography>
                                <AirbnbSlider
                                    getAriaValueText={valuetext}
                                    aria-labelledby="discrete-slider-always"
                                    ThumbComponent={AirbnbThumbComponent}
                                    marks={marks}
                                    defaultValue={0}
                                    valueLabelDisplay="on"
                                    onChange={this.DateChange}
                                    max={120}
                                />
                                <div style={{
                                    backgroundColor: '#fff'
                                }}>
                                    <Snackbar open={this.state.setOpen} autoHideDuration={6000} onClose={this.handleClose}>
                                        <Alert onClose={this.handleClose} severity="warning">
                                            {this.state.keyDateText}
                                        </Alert>
                                    </Snackbar>
                                </div>
                            </div>




                        </div>
                    )
                   /* else
                        return (<div>loading...</div>)*/
                }
            }

        export default withStyles(styles)(MapContainer);
