'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import * as topojson from "topojson-client";
import { Feature, FeatureCollection } from "geojson";


const geoUrl = "https://raw.githubusercontent.com/Avzolem/alertaprensanext/refs/heads/main/data/mx.json";

export const InitialMap = () => {
    // const [mexicoFeatures, setMexicoFeatures] = useState<FeatureCollection | null>(null);

    // useEffect(() => {
    //     axios
    //         .get(geoUrl)
    //         .then((response) => {
    //             const worldData = response.data;

    //             // Convert TopoJSON to GeoJSON
    //             const countries = topojson.feature(
    //                 worldData,
    //                 worldData.objects.countries
    //             ) as unknown as FeatureCollection;

    //             // Filter only Mexico (ID: 484)
    //             const mexico: FeatureCollection = {
    //                 type: "FeatureCollection",
    //                 features: countries.features.filter((d: Feature) => d.id === "484"),
    //             };

    //             setMexicoFeatures(mexico);
    //         })
    //         .catch((error) => console.error("Error fetching map data:", error));
    // }, []);

    // if (!mexicoFeatures) return <p>Loading map...</p>;

    return (
        <div className='h-full w-full'>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 1200,
                    center: [-102, 24]
                }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography className='cursor-pointer'
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#E0E0E0"
                                stroke="#333"
                                strokeWidth={1}
                            />
                        ))
                    }
                </Geographies>
            </ComposableMap>
        </div>
    )
}
