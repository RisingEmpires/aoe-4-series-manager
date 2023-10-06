import React, { useEffect, useState, useCallback } from 'react';
import { useReplicant } from 'use-nodecg';

interface Game {
	leftSideWin?: boolean;

	id: number;
}

interface DropdownOption {
	value: string;
	label: string;
}

export function Index() {

	const [gamesCount, set_gamesCount] = useReplicant<number>('gamesCount', 0)

	return (
		<div className='games flex flex-row'>
			{new Array(gamesCount).fill(undefined).map((_, i) => (
				<GameDisplay key={i} id={i + 1} />
			))}
		</div>
	);
}

const GameDisplay = ({ id }: Game) => {

	const [map, set_map] = useReplicant<DropdownOption>(`map${id}`, { value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' })

	const [leftSideCivs, set_leftSideCivs] = useReplicant<DropdownOption[]>(`leftSideCivs${id}`, [{ value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }])
	const [leftSideCount, set_leftSideCount] = useReplicant<number>(`leftSideCount${id}`, 1)

	const [rightSideCivs, set_rightSideCivs] = useReplicant<DropdownOption[]>(`rightSideCivs${id}`, [{ value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }])
	const [rightSideCount, set_rightSideCount] = useReplicant<number>(`rightSideCount${id}`, 1)

	//const [leftSideWin, set_leftSideWin] = useReplicant<boolean>(`leftSideWin${id}`, false)
	//<img className={gameState.value == 'leftWin' ? 'm-auto civPick leftPick' : 'm-auto civPick leftPick civLose'} src={leftSideCivs[i]?.value} />

	const [gameState, set_gameState] = useReplicant<DropdownOption>(`gameState${id}`, { value: 'tbd', label: 'TBD' })

	return (
		<div className='flex flex-row px-4'>
			<div className='civPicks leftPicks'>
				{new Array(leftSideCount).fill(undefined).map((_, i) => (
					<div className="civContainer">
						<img className={`m-auto civPick leftPick ${gameState.value == 'rightWin' ? 'civLose' : '' }`} src={leftSideCivs[i]?.value} />	
						{gameState.value == 'rightWin' ? <div className='loseIcon'>╲</div> : ''}
					</div>
				))}
			</div>

			<div className='map'>
				<img className="m-auto map" src={map?.value} />
			</div>

			<div className='civPicks rightPicks'>
				{new Array(rightSideCount).fill(undefined).map((_, i) => (
					<div className="civContainer">
						<img className={`m-auto civPick rightPick ${gameState.value == 'leftWin' ? 'civLose ': ''} `} src={rightSideCivs[i]?.value} />
						{gameState.value == 'leftWin' ? <div className='loseIcon'>╲</div> : ''}
					</div>
				))}
			</div>
		</div>
	)
}