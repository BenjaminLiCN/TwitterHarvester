import React, {Component} from 'react';
import ReactDOM from "react-dom";
import ReactDOMServer from 'react-dom/server';

import {withStyles, Typography,Checkbox,Slider} from "@material-ui/core";
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

class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            month: 4,
            hospital_location:[],
            school_location:[],
            hospitals: [],
            schools:[],
            toiletpapers:[],
            discriminations:[],
            cities:[],
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
            fear:2
        };
        this.initBorder = this.initBorder.bind(this)
        this.changeBorder = this.changeBorder.bind(this);
        this.initHospitalMarkers = this.initHospitalMarkers.bind(this);
        this.initSchoolMarkers = this.initSchoolMarkers.bind(this);
        this.initHotTopicMarkers = this.initHotTopicMarkers.bind(this);
    }

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


        map.data.loadGeoJson('https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json')
        //map.data.loadGeoJson('https://api.jsonbin.io/b/5eab07bf07d49135ba485cfa/3')
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
                fillColor: '#ff9999',
                strokeWeight: 8,
                fillOpacity: 0.9
            });
            if(map.zoom>5 && (map.getCenter().lat()>-40&&map.getCenter().lat()<-30)&&(map.getCenter().lng()>135&&map.getCenter().lng()<150)) {
                console.log("load vic")
                //map.data.loadGeoJson('https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json')
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

            var name=event.feature.getProperty('vic_lga__3')

            if(that.state.month ===4 )
                var day = that.state.allcases['0407']
            else if(that.state.month ===3 )
                var day = that.state.allcases['0414']
            else if(that.state.month ===2 )
                var day = that.state.allcases['0429']
            else
                var day = that.state.allcases['0501']

            for(var x of day)
            {
                console.log('suburb cases'+x.Suburb+x.cases)
                if(x.Suburb===name)
                    that.setState( {cases:x.cases})
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

        const month = this.state.month;
        const that= this;

        map.data.setStyle(function (feature) {

        var name=feature.getProperty('vic_lga__3')
        var cases=0

        if(that.state.month ===4 )
            var day = that.state.allcases['0407']
        else if(that.state.month ===3 )
            var day = that.state.allcases['0414']
        else if(that.state.month ===2 )
            var day = that.state.allcases['0429']
        else
            var day = that.state.allcases['0501']

            for(var x of day)
            {
                //console.log('name'+x.Suburb)
                if(x.Suburb===name)
                     cases=x.cases
            }

            let color=colorOnConfirmed(cases);

            return {
                fillColor: color,
                strokeWeight: 0.3,
                strokeOpacity: 0.3,
                fillOpacity: 0.4,
            };
        });

        // this.setState({map:map})

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

    MonthChange = (event, value) => {

        this.setState({
            month: value
        });

        if(this.state.showHotTopic)
             this.initHotTopicMarkers(this.state.map);

        console.log("month: " + this.state.month);
        if (value === 4)
                this.state.toiletpapers.map(toiletpaper => toiletpaper.setMap(null))
        else if (value === 3)
                this.state.discriminations.map(discrimination => discrimination.setMap(null))
           else if (value === 1 || value === 2)
            {
                this.state.toiletpapers.map(toiletpaper => toiletpaper.setMap(null))
                this.state.discriminations.map(discrimination => discrimination.setMap(null))
            }



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
                            {this.state.loaded===true&&
                            <div className={classes.mapContainer}>
                                < InnerMap id="map"
                                           options={{center: {lat: -25.5, lng: 132.5}, zoom: 5, styles: mapStyles}}
                                           onMapLoad={(map) => this.initBorder(map)
                                           } changeBorder={this.changeBorder}/>

                            </div>  }

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


                            <div style={{position: 'absolute', bottom: '20px', left: '30px', width: '700px'}}>
                                <p style={{color:'#FFFFFF'}}>
                                    Month
                                </p>
                                <Slider
                                    defaultValue={4}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks={true}
                                    min={1}
                                    max={4}
                                    onChange={this.MonthChange}
                                />
                            </div>




                        </div>
                    )
                   /* else
                        return (<div>loading...</div>)*/
                }
            }

        export default withStyles(styles)(MapContainer);