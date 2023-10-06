import type NodeCG from '@nodecg/types';
import { klona } from 'klona';

interface DropdownOption {
	value: string;
	label: string;
}

module.exports = function (nodecg: NodeCG.ServerAPI) {

	//Get Games Count
	let gamesCount = nodecg.Replicant<number>('gamesCount', 'aoe-4-series-manager', { defaultValue: 0 })

	//Get replicants from Civ Draft
	let playedMap = nodecg.Replicant<DropdownOption>(`map1`, 'aoe4-map-selector')

	let leftPicks = nodecg.Replicant<DropdownOption[]>('leftPicks', 'aoe-4-civ-draft');
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

	let updateDraft = nodecg.Replicant<boolean>(`updateDraft`, 'aoe-4-civ-draft')

	let lockBans = nodecg.Replicant<boolean>(`lockBans`, 'aoe-4-civ-draft')
	
	let leftScore = nodecg.Replicant<number>(`leftScore`, 'aoe4-score-display', { defaultValue: 0})
	let rightScore = nodecg.Replicant<number>(`rightScore`, 'aoe4-score-display', { defaultValue: 0})


	nodecg.listenFor('addLatestGame', async (leftSideWin: boolean) => {
		let id: number | undefined = gamesCount.value + 1
		console.log(`Made game ${id}`)
		let map = nodecg.Replicant<DropdownOption>(`map${id}`)

		let leftSideCivs = nodecg.Replicant<DropdownOption[]>(`leftSideCivs${id}`)
		let leftSideCount = nodecg.Replicant<number>(`leftSideCount${id}`)

		let rightSideCivs = nodecg.Replicant<DropdownOption[]>(`rightSideCivs${id}`)
		let rightSideCount = nodecg.Replicant<number>(`rightSideCount${id}`)

		//let leftSideWinReplicant = nodecg.Replicant<boolean>(`leftSideWin${id}`)
		let gameState = nodecg.Replicant<DropdownOption>(`gameState${id}`)

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
			leftPicks.value = [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }, { value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }]
			//leftPicksCount.value = 1
			
			rightPicks.value = [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }, { value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }]
			//rightPicksCount.value = 1
			
			if(lockBans.value == false){
				leftBan.value = [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }, { value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }]
				//leftBanCount.value = 0

				rightBan.value = [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }, { value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" },{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }]
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
	})
};
