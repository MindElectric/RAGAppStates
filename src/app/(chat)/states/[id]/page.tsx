import React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { Estado } from '@/app/types/Country'
import { getStateById } from '../../../../../actions/states/get-state-by-id'


interface Props {
    params: {
        id: number
    }
}


export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    //Read route params
    const id = params.id;

    //Fetch data
    const state: Estado = await getStateById(id);

    return {
        title: state.nombre ?? 'Estado no encontrado'
    }
}


export default async function StateByPage({ params }: Props) {
    const { id } = params;
    const state: Estado = await getStateById(id);
    // const upper = `${state.nombre.charAt(0).toUpperCase()}${state.nombre.substring(1)}`
    return (
        <div className='mx-5'>
            <h3 className='text-2xl'>{state.nombre}</h3>
            <p className='mt-3'>{state.descripcion}</p>
        </div>
    )
}
