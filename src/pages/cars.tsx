import Link from 'next/link';
import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';

import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from '../database/getModels';
import { getPaginatedCars } from '../database/getPaginatedCars';

import { getAsString } from '../getAsString';

import { ParsedUrlQuery } from 'querystring';

import Search from '.'

import { CarModel } from '../../api/Car';


import {  Grid } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { PaginationRenderItemParams } from '@material-ui/lab';


export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

export default function CarsList({ 
  makes, 
  models, 
  cars, 
  totalPages 
}: CarsListProps) {
  const { query } = useRouter();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Search makes={makes} models={models} />
      </Grid>
      <Grid item xs={12} sm={6} md={8} lg={9}>
        <Pagination 
          page={parseInt(getAsString(query.page) || '1')}
          count={totalPages}
          renderItem={(item) => (
            <PaginationItem 
              component={MaterialUiLink}
              query = {query}
              item={item}
              {...item}
            />
          )}
        />
        <pre>{JSON.stringify({ totalPages, cars }, null, 4)}</pre>
      </Grid>
    </Grid>
  )
}

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
  return (
    <Link href={{
      pathname: '/cars',
      query: {...query, page: item.page}
    }} shallow>
      <a {...props}></a>
    </Link>
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
      totalPages: pagination.totalPages
    }
  }
}