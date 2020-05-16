import React, {Component} from 'react';
import ReactDOM from "react-dom";
import ReactDOMServer from 'react-dom/server';
import {Paper,Button} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {Checkbox} from "@material-ui/core";
import {PieChart} from 'react-chartkick'
import 'chart.js'
import MarkerClusterer from 'node-js-marker-clusterer';
import Colorlegend from "./colorlegend";
import {stateCaseDate,suburbCaseDate,searchSuburb,searchState,searchState2} from "../modules/scale"

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import { ContinuousColorLegend,SearchableDiscreteColorLegend, RadialChart} from "react-vis";
import { Bullet } from '@nivo/bullet'

import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import {colorOnConfirmed} from '../methods/defineColor'
import {dayFromStr,monthFromStr,dayFromValue,strFromDate} from '../methods/DateTransfer'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
        height: '100%'
    },
    mapContainer: {
        width: "100%",
        height: "900px",
        boxShadow: "0 2px 8px 0 #d7d7d7"
    },
    searchPanel: {
        display: 'flex',
        flexWrap: 'wrap',

        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(300),
            height: theme.spacing(16),
        },
        width:theme.spacing(50),
        height:theme.spacing(100),
        position: 'fixed',
        top: '30%',
        left: '60%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '50.00%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
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
        color: 'primary',
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
            boxShadow: '#ccc 0px 2px 2px 1px',
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
        //borderRadius: 4,
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
            emotionInfo: {
                positive: 0,
                middle: 0,
                negative: 0
            },
            showKeyDate: false,
            keyDateText: '',
            hospital_location:[],
            school_location:[],
            hospitals: [],
            schools:[],
            toiletpapers:[],
            discriminations:[],
            cities:[],
            scale: 'state',
            confirm:[{Suburb:'aa',cases:46}],
            suburbcases:'false',
            statecases:'false',
            suburbemotions:'false',
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
            setOpen:false,
            opacity: '30%',
            level: 3,
            searchText: '',
        };
        this.initBorder = this.initBorder.bind(this)
        this.changeBorder = this.changeBorder.bind(this);
        this.initHospitalMarkers = this.initHospitalMarkers.bind(this);
        this.initSchoolMarkers = this.initSchoolMarkers.bind(this);
        this.initHotTopicMarkers = this.initHotTopicMarkers.bind(this);
    }

    handleLevel = (event) => {
        this.setState({level: event.target.value});
    }

    handleSearchText = (event) => {
        this.setState({searchText: event.target.value});
    }

    focusSearchArea = () => {
        let text = this.state.searchText;
        //todo: auto focus
    }

    onHoverSearch = () => {
        this.setState({opacity: '100%'});
    }

    onLeaveSearch = () => {
        this.setState({opacity: '30%'});
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
        await fetch('http://172.26.131.49:8081/confirmedAllState/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({statecases:data})
            }).catch(console.log)

        await fetch('http://172.26.131.49:8081/confirmedAll/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({suburbcases:data})
            }).catch(console.log)

        await fetch('http://172.26.131.49:8081/suburbAndEmotion/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({suburbemotions:data.doc})
                console.log('emotions'+data)
                console.log('emotion 0 '+this.state.suburbemotions[0].num)
                this.setState({loaded: true})
            }).catch(console.log)

    }

    initBorder(map) {

        const that= this;

        map.data.loadGeoJson('https://api.jsonbin.io/b/5eab07bf07d49135ba485cfa/5')
         //  map.data.loadGeoJson('https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json')
       /* map.data.loadGeoJson('https://data.gov.au/geoserver/nsw-state-boundary/wfs?request=GetFeature&typeName=ckan_a1b278b1_59ef_4dea_8468_50eb09967f18&outputFormat=json')
        map.data.loadGeoJson('https://data.gov.au/geoserver/act-state-boundary-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_83468f0c_313d_4354_9592_289554eb2dc9&outputFormat=json')
        map.data.loadGeoJson('https://data.gov.au/geoserver/vic-state-boundary-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_b90c2a19_d978_4e14_bb15_1114b46464fb&outputFormat=json')
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
            else
            {
                if(that.state.scale==='suburb')
                {
                    map.data.setStyle({})
                    that.setState({scale:'state'})
                    map.data.loadGeoJson('https://api.jsonbin.io/b/5eab07bf07d49135ba485cfa/5')
                }
            }


            console.log("scale= "+that.state.scale)

            if(that.state.scale==='suburb') {

                if(suburbCaseDate.includes(strFromDate(that.state.dateInfo.month,that.state.dateInfo.day)))
                {
                    try {
                        var suburbname = event.feature.getProperty('vic_lga__3')
                        var datestr = strFromDate(that.state.dateInfo.month, that.state.dateInfo.day)
                        var suburbindex = searchSuburb.get(suburbname)
                        that.setState({cases: that.state.suburbcases[datestr][suburbindex].cases})
                    }catch (e) {
                        console.log(e)
                    }
                }
            }

        else if(that.state.scale==='state') {

                if (stateCaseDate.includes(strFromDate(that.state.dateInfo.month, that.state.dateInfo.day))) {
                   try {
                       var statename = event.feature.getProperty('STATE_NAME')
                       var datestr = strFromDate(that.state.dateInfo.month, that.state.dateInfo.day)
                       var stateindex = searchState2.get(statename)
                       that.setState({cases: that.state.statecases[datestr][stateindex].cases})
                   } catch (e) {
                       console.log(e)
                   }
                }
            }
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
            console.log("month" + that.state.dateInfo.month+"day"+ that.state.dateInfo.day)


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

            var cases = 0
            if(that.state.scale==='state') {

                if (stateCaseDate.includes(strFromDate(that.state.dateInfo.month, that.state.dateInfo.day))) {
                    try {
                        var statename = feature.getProperty('STATE_NAME')
                        var datestr = strFromDate(that.state.dateInfo.month, that.state.dateInfo.day)
                        var stateindex = searchState2.get(statename)
                        cases = that.state.statecases[datestr][stateindex].cases
                    }catch (e) {
                        console.log(e)
                    }

                }
            }

            else if(that.state.scale==='suburb') {

                if(suburbCaseDate.includes(strFromDate(that.state.dateInfo.month,that.state.dateInfo.day)))
                {
                    try {
                        var suburbname = feature.getProperty('vic_lga__3')
                        var datestr = strFromDate(that.state.dateInfo.month, that.state.dateInfo.day)
                        var suburbindex = searchSuburb.get(suburbname)
                        cases = that.state.suburbcases[datestr][suburbindex].cases
                    }catch (e) {
                        console.log(e)
                    }
                }

            }

            console.log("cases for color rending: " + cases)


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
                month: Math.floor(value / 30) + 1,
                week: Math.floor(value / 7) + 1,
                day: dayFromValue(value)
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
{/*                <div className={classes.searchPanel} style={{opacity: this.state.opacity}} onMouseOver={this.onHoverSearch} onMouseLeave={this.onLeaveSearch}>
                    <Paper elevation={3} >
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1c-content"
                                id="panel1c-header"
                            >
                                <div className={classes.column}>
                                    <Typography className={classes.heading}>Search</Typography>
                                </div>
                                <div className={classes.column}>
                                    <Typography className={classes.secondaryHeading}>Expand</Typography>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <div style={{flex: 2}}>
                                    <FormControl component="fieldset">
                                        <InputLabel id="demo-simple-select-label">Level</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={this.state.level}
                                            onChange={this.handleLevel}
                                        >
                                            <MenuItem value={1}>State</MenuItem>
                                            <MenuItem value={2}>City</MenuItem>
                                            <MenuItem value={3}>Suburb</MenuItem>
                                        </Select>
                                    </FormControl>

                                </div>
                                <div style={{flex: 5}}>
                                    <FormControl component="fieldset">
                                        <div style={{flexDirection: 'row'}}>
                                            <InputBase
                                                className={classes.input}
                                                placeholder="Enter location name"
                                                inputProps={{ 'aria-label': 'search location' }}
                                                onChange={this.handleSearchText}
                                            />

                                        </div>
                                    </FormControl>
                                </div>
                            </ExpansionPanelDetails>
                            <Divider />
                            <ExpansionPanelActions>
                                <Button size="small">Cancel</Button>
                                <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick={this.focusSearchArea}>
                                    <SearchIcon />
                                </IconButton>
                            </ExpansionPanelActions>
                        </ExpansionPanel>
                    </Paper>
                </div>*/}
                {/*                          <div style={{display:'flex', position: 'absolute',bottom: '220px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.clearStyle}
                                    onChange={this.styleChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    Covid cases
                                </p>
                            </div>*/}



{/*                            <div style={{display:'flex', position: 'absolute',bottom: '180px', left: '20px'}}>
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

                            <div style={{display:'flex', position: 'absolute',bottom: '100px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.showSchool}
                                    onChange={this.SchoolCheckboxChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    School
                                </p>
                            </div>*/}

                            <div style={{width:"150px", height:"50px", display:this.state.show,position: 'absolute',bottom:this.state.bottom, left: this.state.left}}>
                                <div>
                                    <p>cases: {this.state.cases}</p><br/>
                                    <p>tweets: {parseInt(this.state.happy)+parseInt(this.state.sad)+parseInt(this.state.angry)+parseInt(this.state.fear)}</p><br/>
                                </div>
                                <PieChart data={[["happy", this.state.happy], ["Sad", this.state.sad],["Angry", this.state.angry],["Fear", this.state.fear]]} />

                                <RadialChart
                                    data={[{angle: 1}, {angle: 5}, {angle: 2}]}
                                    width={300}
                                    height={300} />

                            </div>
                            <div style={{display:'flex', position: 'absolute',bottom: '80px', right: '90px'}}>
                            <Colorlegend/>
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


                            <div style={{position: 'absolute', bottom: '60px', left: '30px', width: '700px'}}>

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