import Link from 'next/link';
import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';

import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from '../database/getModels';
import { getPaginatedCars } from '../database/getPaginatedCars';

import { getAsString } from '../getAsString';

import { ParsedUrlQuery, stringify } from 'querystring';

import Search from '.'

import { CarPagination } from '../components/CarPagination';
import { CarCard } from '../components/CarCard';

import { CarModel } from '../../api/Car';

import {  Grid } from '@material-ui/core';

import useSWR from 'swr';

import deepEqual from 'fast-deep-equal';

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
  serverQuery: ParsedUrlQuery;
}

export default function CarsList({ 
  makes, 
  models, 
  cars, 
  totalPages,
  serverQuery 
}: CarsListProps) {
  const { query } = useRouter();
  const { data } = useSWR(`/api/cars?${stringify(query)}`, {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery) ? { cars, totalPages } : undefined
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Search makes={makes} models={models} />
      </Grid>
      <Grid container item xs={12} sm={6} md={8} lg={9} spacing={3}>
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
        {(data?.cars || []).map((car) => (
          <Grid key={car.id} item xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query)
  ])

  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
      serverQuery: ctx.query
    }
  }
}