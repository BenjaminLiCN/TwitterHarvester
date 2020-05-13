import React, {Component} from 'react';
import {
    withStyles,
    Avatar,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Divider,
    List,
    ListItem
} from '@material-ui/core';
import Wei from '../resources/wei.jpg'
import Yangyang from '../resources/yangyang.jpg'
import Zhang from '../resources/zhang.jpg'
import Wang from '../resources/wang.jpg'
import Benjieming from '../resources/benjieming.jpg'


const styles = theme => ({
    card: {
        width: "80%",
        padding: "20px",
        margin: "25px",
        backgroundColor: "#eceff1",
        boxShadow: "0 2px 8px 0 #d7d7d7"
    },
    avatar: {
        margin: 2,
        width: 130,
        height: 130,

    }, cardContent: {

        backgroundColor: "#eceff1"
    }

});


class PersonCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        const {classes} = this.props;
        let avater = Wei;
        if (this.props.name === "Benjieming Li") {
            avater = Benjieming
        } else if (this.props.name === "Chuang Wang") {
            avater = Wang
        } else if (this.props.name === "Honglong Zhang") {
            avater = Zhang
        } else if (this.props.name === "Yangyang Hu") {
            avater = Yangyang
        }

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Recipe" src={avater} className={classes.avatar}>
                        </Avatar>
                    }
                    title={
                        <div className={classes.header}>
                            <Typography variant="h4" color="inherit">
                                {this.props.name}
                            </Typography>
                        </div>
                    }
                    subheader={
                        <Typography variant="body2" color="inherit">
                            {this.props.role}
                        </Typography>
                    }
                />
                <CardContent classes={{
                    root: classes.cardContent
                }}>
                    <div style={{margin: "5px", backgroundColor: "#fffff"}}>
                        <Divider variant="middle"/>
                        <List>
                            <ListItem key="0">
                                {this.props.Introduction[0]}
                            </ListItem>
                            <ListItem key="1">
                                {this.props.Introduction[1]}
                            </ListItem>
                            <ListItem key="2">
                                <a href={this.props.Introduction[2]}>{this.props.Introduction[2]}</a>
                            </ListItem>
                        </List>
                    </div>
                </CardContent>

            </Card>
        )
    }
}

export default withStyles(styles)(PersonCard);