import React, { useEffect, useState, useCallback } from 'react';
import { useReplicant } from 'use-nodecg';
import Select, { type SingleValue } from 'react-select';
import { NodeCG } from '@nodecg/types/types/nodecg';

interface Game {
	leftSideWin: boolean;

	leftSideCivs?: DropdownOption[];
	leftSideCount?: number;

	rightSideCivs?: DropdownOption[];
	rightSideCount?: number;

	map?: DropdownOption;
	id: number;
}

interface DropdownOption {
	value: string;
	label: string;
}

export function SeriesManager() {

	const [games, set_games] = useReplicant<Game[]>('games', [])
	const [gamesCount, set_gamesCount] = useReplicant<number>('gamesCount', 0)

	const [resetDraft, set_resetDraft] = useReplicant<boolean>('resetDraft', false)
	const [addToScore, set_addToScore] = useReplicant<boolean>('addToScore', false)
	const [setMapToRandom, set_setMapToRandom] = useReplicant<boolean>('setMapToRandom', false)

	const [leftName, set_leftName] = useReplicant<string>('leftName', '', {namespace: 'aoe-4-civ-draft'});
	const [rightName, set_rightName] = useReplicant<string>('rightName', '', {namespace: 'aoe-4-civ-draft'});

	const leftWin = (event: any) => {
		event.preventDefault();
		console.log("Left Win")
		//@ts-ignore
		nodecg.sendMessage('addLatestGame', true)
	}

	const rightWin = (event: any) => {
		event.preventDefault();
		console.log("Right Win")
		//@ts-ignore
		nodecg.sendMessage('addLatestGame', false)
	}

	return (
		<>
			<div>
				<label>Reset Civ on Win</label>
				<input type='checkbox' checked={resetDraft} onChange={(() => set_resetDraft(!resetDraft))} />
				<br/>
				<label>Add To Score</label>
				<input type='checkbox' checked={addToScore} onChange={(() => set_addToScore(!addToScore))} />
				<br/>
				<label>Set Map to Random on Win</label>
				<input type='checkbox' checked={setMapToRandom} onChange={(() => set_setMapToRandom(!setMapToRandom))} />
			</div>
			<div className='flex flex-row justify-center w-full'>
				<hr className='m-4 w-1/3' />
				<button onClick={leftWin} className="leftSideButton mx-4 px-2 w-36" name="swapTeams">
					{leftName ? `${leftName} Win` : 'Left Side Win'}
				</button> 
				<button onClick={rightWin} className="rightSideButton mx-4 px-2 w-36" name="swapTeams">
					{leftName ? `${rightName} Win` : 'Right Side Win'}
				</button>
				<hr className='m-4 w-1/3' />

			</div>

			<div>
				<input
					className='w-1/4 m-auto text-center flex flex-row'
					type="number"
					min={0}
					max={9}
					value={gamesCount ?? 0}
					onChange={(event) => {
						set_gamesCount(parseInt(event.target.value, 10));
					}}
				/>

				{new Array(gamesCount).fill(undefined).map((_, i) => (
					<GameDisplay key={i} id={i + 1}
						leftSideWin={true}
					//leftSideCivs={leftSideCivs1}
					//leftSideCount={leftSideCount1}
					//rightSideCivs={rightSideCivs1}
					//rightSideCount={rightSideCount1}
					/>
				))}
			</div>
		</>
	)
}

const GameDisplay = ({ id }: Game) => {

	const [mapsOptions, set_mapsOptions] = useState<DropdownOption[]>([]);
	const [maps, set_maps] = useReplicant<Array<any>>('assets:maps', [], { namespace: 'aoe4-map-selector' });

	const [civsOptions, set_civsOptions] = useState<DropdownOption[]>([]);
	const [civs, set_civs] = useReplicant<NodeCG.AssetFile[]>('assets:civs', [], { namespace: 'aoe-4-civ-draft' });

	const [map, set_map] = useReplicant<DropdownOption>(`map${id}`, { value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' })

	const [leftSideCivs, set_leftSideCivs] = useReplicant<DropdownOption[]>(`leftSideCivs${id}`, [{ value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }])
	const [leftSideCount, set_leftSideCount] = useReplicant<number>(`leftSideCount${id}`, 1)

	const [rightSideCivs, set_rightSideCivs] = useReplicant<DropdownOption[]>(`rightSideCivs${id}`, [{ value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }])
	const [rightSideCount, set_rightSideCount] = useReplicant<number>(`rightSideCount${id}`, 1)

	const [leftSideWin, set_leftSideWin] = useReplicant<boolean>(`leftSideWin${id}`, false)

	const handleMapChange = (selectedOption) => { set_map(selectedOption) }

	//Set the options in the dropdown menu to avaliable maps from /assets/aoe4-map-selector/maps
	useEffect(() => {
		if (!maps) return;
		let _array = []
		maps.forEach((element, i) => {
			var name = element.name
			name = name.replace(/_/g, ' ');
			//@ts-ignore
			_array.push({ value: element.url, label: name });
		});
		//@ts-ignore
		_array.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
		set_mapsOptions(_array);
	}, [maps]);

	// Set the options in the dropdown menu to avaliable civs from /assets/aoe4-civ-draft/civ
	useEffect(() => {
		if (civs.length === 0) return;
		const _array: typeof civsOptions = [];
		civs.forEach((element) => {
			let { name } = element;
			name = name.replace(/_/g, ' ');
			_array.push({ value: element?.url, label: name });
		});
		_array.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
		set_civsOptions(_array);
	}, [civs]);

	//Without this, it crashes if the replicant is empty
	if (!leftSideCivs || leftSideCivs[0].value === '') {
		set_leftSideCivs([{ value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }])
		console.log('Left Side had no civs selected')
	}
	if (!rightSideCivs || rightSideCivs[0].value === '') {
		set_rightSideCivs([{ value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }])
		console.log('Right Side had no civs selected')
	}

	return (
		<div className='gameDiv pb-4'>
			<h1 className='flex justify-center text-2xl'>Game {id}</h1>
			<div className='flex flex-row m-auto'>
				<div className='leftCivs px-8 flex flex-col w-2/5'>
					<input
						className='w-1/4 mx-auto text-center'
						type="number"
						min={1}
						max={4}
						value={leftSideCount ?? 1}
						onChange={(event) => {
							set_leftSideCount(parseInt(event.target.value, 10));
						}}
					/>
					{new Array(leftSideCount).fill(undefined).map((_, i) => (
						<CivDropdown key={i} civs={civsOptions} target={i} replicant={`leftSideCivs${id}`} value={leftSideCivs[i] || null} />
					))}
				</div>

				<div className='mapDiv px-8 flex flex-col justify-center w-2/6'>
					<Select className=" mapDropdown" options={mapsOptions} onChange={handleMapChange} value={map} placeholder={'Select Map'} />
					<img className="m-auto" src={map?.value} style={{ width: '140px', padding: '10px 10px' }} />
					<div className='flex flex-row justify-center items-center'>
						<label className="pr-4">Left Side Win?</label>
						<input className="w-6 h-6" type='checkbox' checked={leftSideWin} onChange={(() => set_leftSideWin(!leftSideWin))} />
					</div>
				</div>

				<div className='rightCivs px-8 flex flex-col w-2/5'>
					<input
						className='w-1/4 mx-auto text-center'
						type="number"
						min={1}
						max={4}
						value={rightSideCount ?? 1}
						onChange={(event) => {
							set_rightSideCount(parseInt(event.target.value, 10));
						}}
					/>
					{new Array(rightSideCount).fill(undefined).map((_, i) => (
						<CivDropdown key={i} civs={civsOptions} target={i} replicant={`rightSideCivs${id}`} value={rightSideCivs[i] || null} />
					))}

				</div>
			</div>
		</div>
	)
}

type CivDropdownProps = {
	civs: DropdownOption[];
	target: number;
	replicant: string;
	value?: DropdownOption;
};

const CivDropdown = ({ civs, target, replicant, value }: CivDropdownProps) => {
	const [replicantValue, set_replicantValue] = useReplicant<DropdownOption[]>(replicant, [{ value: '', label: '' }]);

	const handleChange = useCallback(
		(selectedOption: SingleValue<DropdownOption>) => {
			if (!selectedOption) return
			const newRepValue = replicantValue.slice(0);
			newRepValue[target] = selectedOption;
			set_replicantValue(newRepValue);
		},
		[replicantValue, target],
	);

	return (
		<div className='w-full'>
			<Select className="civDropdown" options={civs} onChange={handleChange} value={value} />
		</div>
	);
};