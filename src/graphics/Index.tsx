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

	const [theme, set_theme] = useReplicant<{ value: string; label: string; }>('theme', { value: '../../../assets/nodecg-themer/themes/default.css', label: 'default' }, { namespace: 'nodecg-themer' });

	const [updateGraphics, set_updateGraphics] = useReplicant<boolean>('updateGraphics', true);
	const [updateGraphicsOnce, set_updateGraphicsOnce] = useReplicant<boolean>('updateGraphicsOnce', true);
	const [updateGameGraphics, set_updateGameGraphics] = useReplicant<boolean>('updateGameGraphics', true);

	const [graphics, set_graphics] = useState(<></>)
	const [themeDiv, set_themeDiv] = useState(<></>)

	useEffect(() => {
		console.log(theme)
		if (!theme) return;
		console.log(theme)
		set_themeDiv(<link rel='stylesheet' type='text/css' href={theme.value} />)
	}, [theme])

	useEffect(() => {
		console.log("updating graphics")

		const shittyUpdate = async () => {
			function sleep(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			}

			console.log("updating graphics 2")
			await sleep(200)
			console.log("updating graphics 3")
			set_graphics(<div className='series-games flex flex-row'>
				{new Array(gamesCount).fill(undefined).map((_, i) => (
					<GameDisplay key={i} id={i + 1} />
					))}
			</div>)
			set_updateGameGraphics(!updateGameGraphics)
			await sleep(500)
			set_updateGraphics(!updateGraphics)
		}

		shittyUpdate()

	}, [updateGraphicsOnce])

	useEffect(() => {
		// declare the async data fetching function
		const shittyUpdate = async () => {
			function sleep(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			}

			// waits for 1000ms
			console.log("sleepy")
			await sleep(200);
			console.log("uwu")
			set_updateGraphics(!updateGraphics)
			set_updateGameGraphics(!updateGameGraphics)
		};

		shittyUpdate()
	}, [])

	const [gamesCount, set_gamesCount] = useReplicant<number>('gamesCount', 0)

	return (
		<div>
			{themeDiv}
			{graphics}
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
	const [updateGameGraphics, set_updateGameGraphics] = useReplicant<boolean>('updateGameGraphics', true);


	const [graphics, set_graphics] = useState(<></>)

	useEffect(() => {
		console.log("Rerendering Game")
		set_graphics(<div className='flex flex-row px-4 series-game'>
			<div className='series-civPicks series-leftPicks'>
				{new Array(leftSideCount).fill(undefined).map((_, i) => (
					<div className="series-civContainer">
						<img className={`series-civPick series-leftPick ${gameState?.value == 'rightWin' ? 'series-civLose' : ''}`} src={leftSideCivs[i]?.value} />
						{gameState?.value == 'rightWin' ? <div className='series-loseIcon'>╲</div> : ''}
					</div>
				))}
			</div>

			<div className='series-map'>
				<img className="m-auto series-map" src={map?.value} />
			</div>

			<div className='series-civPicks series-rightPicks'>
				{new Array(rightSideCount).fill(undefined).map((_, i) => (
					<div className="series-civContainer">
						<img className={`series-civPick series-rightPick ${gameState?.value == 'leftWin' ? 'series-civLose ' : ''} `} src={rightSideCivs[i]?.value} />
						{gameState?.value == 'leftWin' ? <div className='series-loseIcon'>╲</div> : ''}
					</div>
				))}
			</div>
		</div>)
		console.log(map?.value)
	}, [updateGameGraphics])

	return (
		<div>
			{graphics}
		</div>
	)
}