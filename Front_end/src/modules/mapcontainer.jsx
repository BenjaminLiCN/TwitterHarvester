import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';

import {withStyles, Typography,Checkbox,Slider} from "@material-ui/core";

import mapStyles from '../resources/mapstyle.json';
import InnerMap from './innermap';
import * as location from './location'
import hospital_marker from '../resources/hospital_marker.png'
import touristsite_marker from '../resources/touristsite_marker.png'
import {hospitals} from "./location";

const styles = theme => ({
    map: {
        width: '100%',
        height: "746px"
    },
    mapContainer: {
        width: "100%",
        height: "746px",
        boxShadow: "0 2px 8px 0 #d7d7d7"
    }
})

class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            month: 1,
            hospitals: [],
            touristsites:[],
            showHospital: true,
            showTouristSite: true,
            map:null
        };
        this.initBorder = this.initBorder.bind(this)
        this.changeBorder = this.changeBorder.bind(this);
        this.initHospitalMarkers = this.initHospitalMarkers.bind(this);
        this.initTouristSiteMarkers = this.initTouristSiteMarkers.bind(this);
    }

    initBorder(map) {

        map.data.loadGeoJson('https://api.jsonbin.io/b/5eaaae404c87c3359a644031/2')


        map.data.addListener('mouseover', function (event) {
            map.data.overrideStyle(event.feature, {
                fillColor: '#ff9999',
                strokeWeight: 8,
                fillOpacity: 0.9
            });
        });

        map.data.addListener('mouseout', function () {
            map.data.revertStyle();
        });

        map.data.addListener('click', function (event) {
            const InfoWindowContent = (
                <div>
                    This is the info <br/>
                    ......

                </div>
            );


            let infoWindow = new window.google.maps.InfoWindow({position: event.latLng});
            const content = ReactDOMServer.renderToString(InfoWindowContent);
            infoWindow.setContent(content);
            infoWindow.open(map);
            window.google.maps.event.addListener(infoWindow, 'domready', function (e) {
            })

        });

        this.initHospitalMarkers(map)
        this.initTouristSiteMarkers(map)
        this.changeBorder(map)

    }

    changeBorder(map) {

        var month = this.state.month;
        map.data.setStyle(function (feature) {
            var cases = feature.getProperty('CONFIRMED');
            if (month === 2)
                cases = feature.getProperty('CONFIRMED_2');
            if (month === 3)
                cases = feature.getProperty('CONFIRMED_3');
            if (month === 4)
                cases = feature.getProperty('CONFIRMED_4');
            var color = "#FCA78F"
            if(cases>1)
                color="#F88665"
            if(cases>5)
             color = "#F77A56"
            if (cases > 30)
                color = "#F96E46"
            if (cases > 100)
                color = "#FD6336"
            if (cases > 200)
                color = "#F95D30"
            if (cases > 500)
                color = "#FA5121"
            if (cases > 800)
                color = "#FB4A18"
            if (cases > 1000)
                color = "#FC4714"
            if (cases > 2000)
                color = "#FA3903"
            return {
                fillColor: color,
                strokeWeight: 1,
                strokeOpacity: 0.3,
                fillOpacity: 0.8,
            };
        });

    }

    initHospitalMarkers(map) {
        location.hospitals.map(hospital => {
            this.state.hospitals.push(new window.google.maps.Marker({
                position: hospital,
                map: map,
                icon: hospital_marker
            }))
        })
        this.state.map=map;

    }
    initTouristSiteMarkers(map) {
        location.touristsites.map(touristsite => {
            this.state.touristsites.push(new window.google.maps.Marker({
                position: touristsite,
                map: map,
                icon: touristsite_marker
            }))
        })
        this.state.map=map;

    }

    MonthChange = (event, value) => {

        this.setState({
            month: value
        });
        console.log("month: " + this.state.month);

    };

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

    TouristSiteCheckboxChange = (event) => {

        if(this.state.showTouristSite)
            this.setState({showTouristSite:false});
        else
            this.setState({showTouristSite:true});
        if (event.target.checked)
            this.initTouristSiteMarkers(this.state.map);
        else
            this.state.touristsites.map(touristsite => touristsite.setMap(null))

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
                            <div style={{display:'flex', position: 'absolute',bottom: '190px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.showHospital}
                                    onChange={this.HospitalCheckboxChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    Hospital
                                </p>
                            </div>

                            <div style={{display:'flex', position: 'absolute',bottom: '150px', left: '20px'}}>
                                <Checkbox
                                    checked={this.state.showTouristSite}
                                    onChange={this.TouristSiteCheckboxChange}
                                />
                                <p style={{color:'#FFFFFF'}}>
                                    Tourist site
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

                        </div>

                    )
                }
            }

        export default withStyles(styles)(MapContainer);