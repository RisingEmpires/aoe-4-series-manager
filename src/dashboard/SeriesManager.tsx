import React, { useEffect, useState, useCallback } from 'react';
import { useReplicant } from 'use-nodecg';
import Select, { type SingleValue } from 'react-select';
import { NodeCG } from '@nodecg/types/types/nodecg';
import { TECollapse, TERipple } from "tw-elements-react";

interface Game {
	leftSideWin: boolean;

	leftSideCivs?: DropdownOption[];
	leftSideCount?: number;

	rightSideCivs?: DropdownOption[];
	rightSideCount?: number;

	map?: ValueLabelPair;
	id: number;
}

interface ValueLabelPair {
	value: string;
	label: string;
}

interface DropdownOption {
	value: string;
	label: string;
	picked?: boolean;
}

export function SeriesManager() {

	const [showSettings, set_showSettings] = useState(false);
	const toggleShowSettings = () => set_showSettings(!showSettings);

	const [games, set_games] = useReplicant<Game[]>('games', [])
	const [gamesCount, set_gamesCount] = useReplicant<number>('gamesCount', 0)

	const [resetDraft, set_resetDraft] = useReplicant<boolean>('resetDraft', false)
	const [addToScore, set_addToScore] = useReplicant<boolean>('addToScore', false)
	const [setMapToRandom, set_setMapToRandom] = useReplicant<boolean>('setMapToRandom', false)
	const [autoUpdateGraphics, set_autoUpdateGraphics] = useReplicant<boolean>('autoUpdateGraphics', false)

	const [leftName, set_leftName] = useReplicant<string>('leftName', '', { namespace: 'aoe-4-civ-draft' });
	const [rightName, set_rightName] = useReplicant<string>('rightName', '', { namespace: 'aoe-4-civ-draft' });

	const [updateGraphics, set_updateGraphics] = useReplicant<boolean>('updateGraphicsOnce', true);

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
			<button className='absolute right-4' onClick={toggleShowSettings}>
				<svg fill='whitesmoke' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" /></svg>
			</button>
			<TECollapse show={showSettings} className='flex flex-col pb-8'>
				<div key={'settings'}>
					<label>Reset Civ on Win</label>
					<input type='checkbox' checked={resetDraft} onChange={(() => set_resetDraft(!resetDraft))} />
					<br />
					<label>Add To Score</label>
					<input type='checkbox' checked={addToScore} onChange={(() => set_addToScore(!addToScore))} />
					<br />
					<label>Set Map to Random on Win</label>
					<input type='checkbox' checked={setMapToRandom} onChange={(() => set_setMapToRandom(!setMapToRandom))} />
					<br />
					<label>Automatically update graphics on win</label>
					<input type='checkbox' checked={autoUpdateGraphics} onChange={(() => set_autoUpdateGraphics(!autoUpdateGraphics))} />
				</div>
			</TECollapse>
			<div className='flex flex-row justify-center w-full'>
				<hr className='m-4 mt-6 w-1/6' />
				<button onClick={leftWin} className="leftSideButton mx-4 px-2 w-36" name="swapTeams">
					{leftName ? `${leftName} Win` : 'Left Side Win'}
				</button>

				<button onClick={() => set_updateGraphics(!updateGraphics)}
					className='updateDraft mx-4 px-2 w-1/4'>Update Graphics</button>

				<button onClick={rightWin} className="rightSideButton mx-4 px-2 w-36" name="swapTeams">
					{leftName ? `${rightName} Win` : 'Right Side Win'}
				</button>
				<hr className='m-4 mt-6 w-1/6' />

			</div>

			<div>
				<h1 className='w-1/4 m-auto flex justify-center text-xl text-center flex flex-row'>Game Count</h1>
				<input
					className='w-1/5 m-auto text-center flex flex-row mb-8'
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

	const [mapsOptions, set_mapsOptions] = useState<ValueLabelPair[]>([]);
	const [maps, set_maps] = useReplicant<Array<any>>('assets:maps', [], { namespace: 'aoe4-map-selector' });

	const [civsOptions, set_civsOptions] = useState<ValueLabelPair[]>([]);
	const [civs, set_civs] = useReplicant<NodeCG.AssetFile[]>('assets:civs', [], { namespace: 'aoe-4-civ-draft' });

	const [map, set_map] = useReplicant<ValueLabelPair>(`map${id}`, { value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' })

	const [leftSideCivs, set_leftSideCivs] = useReplicant<DropdownOption[]>(`leftSideCivs${id}`, [{ value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }])
	const [leftSideCount, set_leftSideCount] = useReplicant<number>(`leftSideCount${id}`, 0)

	const [rightSideCivs, set_rightSideCivs] = useReplicant<DropdownOption[]>(`rightSideCivs${id}`, [{ value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }])
	const [rightSideCount, set_rightSideCount] = useReplicant<number>(`rightSideCount${id}`, 0)

	const [gameState, set_gameState] = useReplicant<ValueLabelPair>(`gameState${id}`, { value: 'tbd', label: 'TBD' })

	//@ts-ignore
	const handleMapChange = (selectedOption) => { set_map(selectedOption) }
	//@ts-ignore
	const handleGameStateChange = (selectedOption) => { set_gameState(selectedOption) }

	let gameStateOptions: ValueLabelPair[] = [
		{ value: 'leftWin', label: 'Left Win' },
		{ value: 'rightWin', label: 'Right Win' },
		{ value: 'tbd', label: 'TBD' }
	]

	//Set the options in the dropdown menu to avaliable maps from /assets/aoe4-map-selector/maps
	useEffect(() => {
		if (!maps) return;
		//@ts-ignore
		let _array = []
		maps.forEach((element, i) => {
			var name = element.name
			name = name.replace(/_/g, ' ');
			//@ts-ignore
			_array.push({ value: element.url, label: name });
		});
		//@ts-ignore
		_array.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
		//@ts-ignore
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

	console.log(map)

	return (
		<div className='gameDiv pb-4'>
			<h1 className='flex justify-center text-2xl'>Game {id}</h1>
			<div className='flex flex-row m-auto'>
				<div className='leftCivs px-8 flex flex-col w-2/5'>
					<h1 className='flex justify-center text-xl'>Played Civ Count</h1>
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
					{leftSideCivs && leftSideCivs.length > 0 && new Array(leftSideCount).fill(undefined).map((_, i) => (
						<CivDropdown key={i} civs={civsOptions} target={i} replicant={`leftSideCivs${id}`} value={leftSideCivs[i] || null} />
					))}
				</div>

				<div className='mapDiv px-8 flex flex-col justify-center w-2/6'>
					<Select className=" mapDropdown" options={mapsOptions} onChange={handleMapChange} value={map} placeholder={'Select Map'} />
					<img className="m-auto" src={map?.value} style={{ width: '140px', padding: '10px 10px' }} />
					<div className='flex flex-row justify-center items-center'>
						<Select className="civDropdown w-48" options={gameStateOptions} onChange={handleGameStateChange} value={gameState} />
					</div>
				</div>

				<div className='rightCivs px-8 flex flex-col w-2/5'>
					<h1 className='flex justify-center text-xl'>Played Civ Count</h1>
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
					{rightSideCivs && rightSideCivs.length > 0 && new Array(rightSideCount || 0).fill(undefined).map((_, i) => (
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
		<div className='w-full py-2'>
			<Select className="civDropdown" options={civs} onChange={handleChange} value={value} />
		</div>
	);
};