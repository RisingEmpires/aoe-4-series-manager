import React, { useEffect, useState, useCallback } from 'react';
import Select, { type SingleValue } from 'react-select';
import { useReplicant } from 'use-nodecg';
import { NodeCG } from '@nodecg/types/types/nodecg';

type Game = {
    leftSideWin: boolean;

    leftSideCivs: DropdownOption[];
    leftSideCount: number;

    rightSideCivs: DropdownOption[];
    rightSideCount: number;

    map: DropdownOption;
    id: number;
}

interface DropdownOption {
    value: string;
    label: string;
}

export const GameDisplay = ({ leftSideWin, leftSideCivs, leftSideCount, rightSideCivs, rightSideCount, map, id}: Game) => {

    const [mapsOptions, set_mapsOptions] = useState<DropdownOption[]>([]);
    const [maps, set_maps] = useReplicant<Array<any>>('assets:maps', [], 'aoe4-map-selector');

    const [civsOptions, set_civsOptions] = useState<DropdownOption[]>([]);
    const [civs, set_civs] = useReplicant<NodeCG.AssetFile[]>('assets:civs', []);

    const [map_, set_map] = useReplicant<DropdownOption>(`map${id}`, { value: '', label: '' })
    const handleMapChange = (selectedOption) => { set_map(selectedOption) }

	//Set the options in the dropdown menu to avaliable maps from /assets/aoe4-map-selector/maps
	useEffect(() => {
		console.log(maps)
		if (!maps) return;
		let _array = []
		//Should probably sort the maps so they are in alpabetical order
		maps.forEach((element, i) => {
			//Sometimes just fuck TypeScript.. I give up.. Ignore Errors and it still work 5head
			var name = element.name
			name = name.replace(/_/g, ' ');
			//@ts-ignore
			//set_options(oldArray => [...oldArray, { value: element.url, label: name }]);
			_array.push({ value: element.url, label: name });
		});
		//@ts-ignore
		_array.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
		set_mapsOptions(_array);
	}, [maps]);

    return (
        <div>
            <h1>{id}asd</h1>
            <Select className="mapDropdown" options={mapsOptions} onChange={handleMapChange} value={map} placeholder={'Select Map'} />
        </div>
    )
}
