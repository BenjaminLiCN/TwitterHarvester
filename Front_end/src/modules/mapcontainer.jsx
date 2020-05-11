import React, {Component} from 'react';
import ReactDOM from "react-dom";
import ReactDOMServer from 'react-dom/server';

import {withStyles, Typography,Checkbox,Slider} from "@material-ui/core";
import {PieChart} from 'react-chartkick'
import 'chart.js'
import Echart from './Echart'
import MarkerClusterer from 'node-js-marker-clusterer';


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
            month: 1,
            hospital_location:[],
            school_location:[],
            hospitals: [],
            schools:[],
            toiletpapers:[],
            discriminations:[],
            cities:[],
            showHospital: true,
            showSchool: true,
            showHotTopic: false,
            clearStyle:false,
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

    componentDidMount() {

        fetch('http://172.26.131.49:8081/hospital/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({hospital_location:data.doc})
                console.log(data.doc)
            }).catch(console.log)

        console.log('didh'+this.state.hospital_location)

        fetch('http://172.26.131.49:8081/school/')
            .then(res=>res.json())
            .then(data=>{
                this.setState({school_location:data.doc})
                console.log(data.doc)
            }).catch(console.log)

        console.log('dids'+this.state.school_location)


    }

    initBorder(map) {

        const that= this;

        map.data.loadGeoJson('https://api.jsonbin.io/b/5eab07bf07d49135ba485cfa/3')


        map.data.addListener('mouseover', function (event) {
            map.data.overrideStyle(event.feature, {
                fillColor: '#ff9999',
                strokeWeight: 8,
                fillOpacity: 0.9
            });
            if(map.zoom>5 && (map.getCenter().lat()>-40&&map.getCenter().lat()<-30)&&(map.getCenter().lng()>135&&map.getCenter().lng()<150)) {
                console.log("load vic")
                map.data.loadGeoJson('https://api.jsonbin.io/b/5eab07bf07d49135ba485cfa')
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
            if(that.state.month ===4 )
                that.setState({cases: event.feature.getProperty('CONFIRMED_4')})
            else if(that.state.month ===3 )
                that.setState({cases: event.feature.getProperty('CONFIRMED_3')})
            else if(that.state.month ===2 )
                that.setState({cases: event.feature.getProperty('CONFIRMED_2')})
            else
                that.setState({cases:'0'})

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

        this.initHospitalMarkers(map)
        this.initSchoolMarkers(map)
        this.initCitiesMarkers(map)
        this.changeBorder(map)

        // this.setState({map:map})

    }

    changeBorder(map) {

        const month = this.state.month;

        map.data.setStyle(function (feature) {
            var cases = feature.getProperty('CONFIRMED');
            if (month === 2)
                cases = feature.getProperty('CONFIRMED_2');
            if (month === 3)
                cases = feature.getProperty('CONFIRMED_3');
            if (month === 4)
                cases = feature.getProperty('CONFIRMED_4');
            if(feature.getProperty("Sortname")=="Melbourne") {
                cases = 2
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

                    return (
                        <div>
                            <div className={classes.mapContainer}>
                                < InnerMap id="map"
                                           options={{center: {lat: -25.5, lng: 132.5}, zoom: 5, styles: mapStyles}}
                                           onMapLoad={(map) => this.initBorder(map)
                                           } changeBorder={this.changeBorder}
                                />
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

                            <div style={{display:'flex', position: 'absolute',bottom: '100px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.showSchool}
                                    onChange={this.SchoolCheckboxChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    School
                                </p>
                            </div>

                            <div style={{position: 'absolute', bottom: '20px', left: '30px', width: '700px'}}>
                                <p style={{color:'#FFFFFF'}}>
                                    Month
                                </p>
                                <Slider
                                    defaultValue={1}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks={true}
                                    min={1}
                                    max={4}
                                    onChange={this.MonthChange}
                                />
                            </div>

                            <div></div>

                        </div>

                    )
                }
            }

        export default withStyles(styles)(MapContainer);