'use client'
import { useState } from 'react';
import { useMessageStore } from '@/store/chat/store';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import type { StatesGeometry } from '@/app/types/Topology';



const geoUrl = "https://raw.githubusercontent.com/Avzolem/alertaprensanext/refs/heads/main/data/mx.json";



export const InitialMap = () => {
    const [selectedState, setSelectedState] = useState<number | null>(null);
    const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

    const sendMessage = useMessageStore((state) => state.sendMessage)

    return (
        <div className='h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] w-full'>
            {/* Tooltip */}
            {tooltip && (
                <div
                    className="absolute bg-black text-white text-sm px-2 py-1 rounded-md shadow-lg"
                    style={{
                        top: tooltip.y,
                        left: tooltip.x,
                        transform: "translate(-50%, -120%)", // Center above the mouse
                        pointerEvents: "none", // Avoid interference
                    }}
                >
                    {tooltip.name}
                </div>
            )}
            {/* Map */}
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 1000,
                    center: [-102, 19]
                }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo: StatesGeometry) => {
                            const isSelected = geo.properties.state_code === selectedState;
                            return (
                                // States
                                <Geography
                                    key={geo.properties.state_name}
                                    geography={geo}
                                    className="cursor-pointer fill ease-in-out outline-none"
                                    onClick={() => {
                                        sendMessage(`Dime lo que sabes de ${geo.properties.state_name}`)
                                        setSelectedState(geo.properties.state_code)
                                        setTooltip(null);
                                    }} // Set selected state ID on click
                                    fill={isSelected ? "#FF5733" : "#E0E0E0"} // Change color if selected
                                    stroke="#333"
                                    strokeWidth={1}
                                    onMouseEnter={(event) => {
                                        const { clientX, clientY } = event; // Get mouse position
                                        setTooltip({
                                            name: geo.properties.state_name, // Show state name
                                            x: clientX,
                                            y: clientY,
                                        });
                                    }}
                                    onMouseLeave={() => setTooltip(null)} // Hide tooltip on exit


                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>
        </div>
    )
}
