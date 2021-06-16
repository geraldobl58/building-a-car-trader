import React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import {  
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  Typography
} from '@material-ui/core';

import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { CarModel } from "../../api/Car";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  achorTag: {
    textDecoration: 'none'
  }
}));

export interface CarCardProps {
  car: CarModel;
} 

export function CarCard({ car }: CarCardProps) {
  const classes = useStyles();
  
  return (
    <Link 
      href="/car/[make]/[brand]/[id]"
      as={`/car/${car.make}/${car.model}/${car.id}`}
    >
      <a className={classes.achorTag}>
        <Card>
          <CardHeader
            title={`${car.make} ${car.model}`}
            subheader={`£${car.price}`}
          />
          <CardMedia
            className={classes.media}
            image={car.photoUrl}
            title={`${car.make} ${car.model}`}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {car.details}
            </Typography>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}