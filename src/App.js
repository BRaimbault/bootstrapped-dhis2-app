import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import LeafletMap from './LeafletMap';

const query = {
    geojson: {
        resource: "organisationUnits.geojson",
        params: {
            level: 2,
        },
    },
    values: {
        resource: "analytics",
        params: {
            dimension: ["dx:nkjlWUMIdHh", "ou:LEVEL-2"],
            filter: "pe:LAST_12_MONTHS",
        },
    },
}

const MyApp = () => (
    <div className={classes.container}>
        <DataQuery query={query}>
            {({ error, loading, data }) => {
                if (error) return <span>ERROR</span>
                if (loading) return <span>...</span>
                return (
                    <>
                        <h3>{i18n.t('Bed net usage by district over the last 12 months')}</h3>
                        <LeafletMap data={data} />
                    </>
                )
            }}
        </DataQuery>
    </div>
)

export default MyApp
