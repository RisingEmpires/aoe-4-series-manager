import type NodeCG from '@nodecg/types';
import { klona } from 'klona';

interface ValueLabelPair {
	value: string;
	label: string;
}

interface DropdownOption {
	value: string;
	label: string;
	picked?: boolean;
}

module.exports = function (nodecg: NodeCG.ServerAPI) {

	//Get Games Count
	let gamesCount = nodecg.Replicant<number>('gamesCount', 'aoe-4-series-manager', { defaultValue: 0 })

	//Get replicants from Civ Draft
	let playedMap = nodecg.Replicant<ValueLabelPair>(`map1`, 'aoe4-map-selector')

	let leftPicks = nodecg.Replicant<DropdownOption[]>('leftPicks', 'aoe-4-civ-draft', {defaultValue: [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]});
	let leftPicksCount = nodecg.Replicant<number>('leftPicksCount', 'aoe-4-civ-draft');

	let rightPicks = nodecg.Replicant<DropdownOption[]>('rightPicks', 'aoe-4-civ-draft');
	let rightPicksCount = nodecg.Replicant<number>('rightPicksCount', 'aoe-4-civ-draft');

	let leftBan = nodecg.Replicant<DropdownOption[]>('leftBans', 'aoe-4-civ-draft');
	let leftBanCount = nodecg.Replicant<number>('leftBansCount', 'aoe-4-civ-draft');

	let rightBan = nodecg.Replicant<DropdownOption[]>('rightBans', 'aoe-4-civ-draft');
	let rightBanCount = nodecg.Replicant<number>('rightBansCount', 'aoe-4-civ-draft');

	let resetDraft = nodecg.Replicant<boolean>(`resetDraft`)
	let addToScore = nodecg.Replicant<boolean>(`addToScore`)
	let setMapToRandom = nodecg.Replicant<boolean>(`setMapToRandom`)
	let autoUpdateGraphics = nodecg.Replicant<boolean>('autoUpdateGraphics')
	let updateSeriesGraphics = nodecg.Replicant<boolean>('updateGraphicsOnce');

	let updateDraft = nodecg.Replicant<boolean>(`updateDraft`, 'aoe-4-civ-draft')

	let lockBans = nodecg.Replicant<boolean>(`lockBans`, 'aoe-4-civ-draft')
	
	let leftScore = nodecg.Replicant<number>(`leftScore`, 'aoe4-score-display', { defaultValue: 0})
	let rightScore = nodecg.Replicant<number>(`rightScore`, 'aoe4-score-display', { defaultValue: 0})


	nodecg.listenFor('addLatestGame', async (leftSideWin: boolean) => {
		let id: number | undefined = gamesCount.value + 1
		console.log(`Made game ${id}`)
		let map = nodecg.Replicant<ValueLabelPair>(`map${id}`)

		let leftSideCivs = nodecg.Replicant<DropdownOption[]>(`leftSideCivs${id}`)
		let leftSideCount = nodecg.Replicant<number>(`leftSideCount${id}`)

		let rightSideCivs = nodecg.Replicant<DropdownOption[]>(`rightSideCivs${id}`)
		let rightSideCount = nodecg.Replicant<number>(`rightSideCount${id}`)

		//let leftSideWinReplicant = nodecg.Replicant<boolean>(`leftSideWin${id}`)
		let gameState = nodecg.Replicant<ValueLabelPair>(`gameState${id}`)

		await new Promise(r => setTimeout(r, 200));

		map.value = klona(playedMap.value)
		leftSideCivs.value = klona(leftPicks.value)
		leftSideCount.value = klona(leftPicksCount.value)
		rightSideCivs.value = klona(rightPicks.value)
		rightSideCount.value = klona(rightPicksCount.value)

		if(leftSideWin){
			gameState.value = ({ value: 'leftWin', label: 'Left Win' })
		} else {
			gameState.value = ({ value: 'rightWin', label: 'Right Win' })
		}

		gamesCount.value++

		if (resetDraft.value === true) {
			leftPicks.value = [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }, { value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]
			//leftPicksCount.value = 1
			
			rightPicks.value = [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }, { value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]
			//rightPicksCount.value = 1
			
			if(lockBans.value == false){
				leftBan.value = [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }, { value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]
				//leftBanCount.value = 0

				rightBan.value = [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }, { value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]
				//rightBanCount.value = 0
			}

			updateDraft.value = !updateDraft.value
		}

		if(addToScore.value === true) {
			if(leftSideWin) {
				leftScore.value++
			} else {
				rightScore.value++
			}
		}

		if(setMapToRandom.value === true) {
			playedMap.value = { value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }
		}

		if(autoUpdateGraphics.value === true) {
			updateSeriesGraphics.value = !updateSeriesGraphics.value
		}
	})

	nodecg.listenFor('resetSeries', async query => {
		nodecg.log.info(`Extension received the value ${query}!`);

		let gamescount = nodecg.Replicant<number>(`gamesCount`)
		
		for (let i = 1; i < 10; i++) {
			console.log(i)
			let map = nodecg.Replicant<ValueLabelPair>(`map${i}`)
			map.value = { value: '/assets/aoe4-map-selector/maps/Random.png', label: 'Random' }
			
			let leftSideCivs = nodecg.Replicant<DropdownOption[]>(`leftSideCivs${i}`)
			leftSideCivs.value = [{value: '/assets/aoe-4-civ-draft/civs/Random.png', label: 'Random', picked: false}]
			let leftSideCount = nodecg.Replicant<number>(`leftSideCount${i}`)
			leftSideCount.value = 1
			
			let rightSideCivs = nodecg.Replicant<DropdownOption[]>(`rightSideCivs${i}`)
			rightSideCivs.value = [{value: '/assets/aoe-4-civ-draft/civs/Random.png', label: 'Random', picked: false}]
			let rightSideCount = nodecg.Replicant<number>(`rightSideCount${i}`)
			rightSideCount.value = 1
			
			let gameState = nodecg.Replicant<ValueLabelPair>(`gameState${i}`)
			gameState.value = { value: 'tbd', label: 'TBD' }
			
			
		}
		
		gamesCount.value = 0;
		
		updateDraft.value = !updateDraft.value
	})
};
