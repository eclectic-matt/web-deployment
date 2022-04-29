/**
 * GRID ASSUMPTIONS
 * grids are defined by a "false" rectangular grid pattern
 * The grid hex in space 0,0 is ALWAYS the top left hex
 * The grid hex in space 1,0 is in the next column right and so is offset
vertically by 1/2 a hex
 *
 * GRID neighbours/setup - array moving clockwise from top:
 * 0: THE HEX ITSELF (SETUP TILES, NOT NEIGHBOURS)
 * 1: ABOVE
 * 2: TOP RIGHT
 * 3: BOTTOM RIGHT
 * 4: BELOW
 * 5: BOTTOM LEFT
 * 6: TOP LEFT
 * format: [row, col]
 *
 * GRID DETAILS:
 * id: THE ID OF THE TILE (LOWEST NUMBERED ETC)
 * type: THE TYPE OF TILE (HILL, PLAINS, WATER)
 * level: THE LEVEL OF THE TILE (FOR OLD ONES LEVEL)
 * setupTile: (boolean) DETERMINES IF THIS GETS A SETUP TILE
 * neighbours: (object) WHERE EACH NEIGHBOUR'S GRID COORDINATES ARE STORED
 */


/**
 * COORDINATES SYSTEM:
 * 0 = the hex itself
 * 1 = TOP
 * 2 = TR
 * 3 = BR
 * 4 = BOTTOM
 * 5 = BL
 * 6 = TL
 */
var directions = [
	"Self",
	"Up",
	"Right Up",
	"Right Down",
	"Down",
	"Left Down",
	"Left Up"
];

var setupTiles = [
	{
		0: null,
		1: null,
		2: 'olds',
		3: 'iron',
		4: null,
		5: 'olds',
		6: 'coal',
		redClip: true
	},
	{
		0: 'olds',
		1: 'olds',
		2: 'gold',
		3: 'olds',
		4: 'phos',
		5: 'coal',
		6: 'olds',
		redClip: false
	},
	{
		0: 'olds',
		1: 'phos',
		2: 'olds',
		3: 'coal',
		4: null,
		5: 'gold',
		6: null,
		redClip: false
	},
	{
		0: 'iron',
		1: null,
		2: 'olds',
		3: null,
		4: 'olds',
		5: null,
		6: 'olds',
		redClip: false
	},
	{
		0: 'gold',
		1: null,
		2: null,
		3: 'olds',
		4: null,
		5: 'olds',
		6: null,
		redClip: true
	},
	{
		0: 'coal',
		1: 'olds',
		2: null,
		3: 'olds',
		4: null,
		5: null,
		6: 'gold',
		redClip: false
	},
	{
		0: 'olds',
		1: 'gold',
		2: null,
		3: null,
		4: 'olds',
		5: null,
		6: 'coal',
		redClip: false
	},
	{
		0: 'gold',
		1: 'iron',
		2: 'olds',
		3: null,
		4: null,
		5: null,
		6: 'olds',
		redClip: true
	},
	{
		0: null,
		1: 'olds',
		2: null,
		3: null,
		4: 'olds',
		5: null,
		6: 'iron',
		redClip: true
	},
	{
		0: 'gold',
		1: null,
		2: 'olds',
		3: null,
		4: 'olds',
		5: null,
		6: 'phos',
		redClip: false
	},
	{
		0: 'phos',
		1: null,
		2: null,
		3: null,
		4: 'olds',
		5: 'coal',
		6: 'olds',
		redClip: true
	},
	{
		0: 'olds',
		1: null,
		2: null,
		3: 'gold',
		4: null,
		5: 'coal',
		6: 'olds',
		redClip: false
	},
	{
		0: null,
		1: 'olds',
		2: 'iron',
		3: 'olds',
		4: 'phos',
		5: 'olds',
		6: null,
		redClip: false
	},
	{
		0: 'iron',
		1: 'olds',
		2: null,
		3: 'gold',
		4: null,
		5: 'olds',
		6: null,
		redClip: true
	},
	{
		0: 'olds',
		1: null,
		2: 'gold',
		3: null,
		4: null,
		5: 'olds',
		6: 'coal',
		redClip: false
	},
	{
		0: null,
		1: 'coal',
		2: null,
		3: 'olds',
		4: 'iron',
		5: null,
		6: 'olds',
		redClip: true
	},
	{
		0: 'olds',
		1: 'olds',
		2: null,
		3: null,
		4: 'gold',
		5: null,
		6: 'coal',
		redClip: false
	},
	{
		0: 'olds',
		1: 'olds',
		2: null,
		3: 'phos',
		4: 'olds',
		5: null,
		6: 'coal',
		redClip: false
	},
	{
		0: 'olds',
		1: 'iron',
		2: null,
		3: 'olds',
		4: 'phos',
		5: 'coal',
		6: 'olds',
		redClip: false
	},
	{
		0: 'olds',
		1: 'iron',
		2: 'olds',
		3: 'coal',
		4: null,
		5: 'olds',
		6: 'coal',
		redClip: false
	}
];

var emptyResources = {
	'iron': 0,
	'coal': 0,
	'phos': 0,
	'gold': 0,
	'olds': 0
};

var resources = {
	"iron": {
		type: "iron",
		count: 3,
		fontIcon: '<i style="color: grey;" class="fa-solid fa-ticket-simple"></i>'
	},
	"coal": {
		type: "coal",
		count: 3,
		fontIcon: '<i style="color: black;" class="fa-solid fa-industry"></i>'
	},
	"gold": {
		type: "gold",
		count: 3,
		fontIcon: '<i style="color: yellow; background-color: lightgrey;" class="fa-solid fa-star"></i>'
	},
	"phos": {
		type: "phosphates",
		count: 1,
		fontIcon: '<i style="color: white; background-color: lightgrey;" class="fa-solid fa-flask-vial"></i>'
	},
	"olds": {
		type: "oldOnes",
		count: 1,
		fontIcon: '<i style="color: purple;" class="fa-brands fa-wolf-pack-battalion"></i>'
	}
};

var oldssCounts = {
	1: {
		level: 1,
		count: 15,
		current: 15
	},
	2: {
		level: 2,
		count: 10,
		current: 10
	},
	3: {
		level: 3,
		count: 10,
		current: 10
	}
};

var hexId = 44;

const hexTypes = {
	'outback': {
		color: '#ff4d4d',
		farmType: 'sheep',
		description: 'Furthest from coast, red'
	},
	'hill': {
		color: '#00cc66',
		farmType: 'cow',
		description: 'Midlands, green'
	},
	'coastal': {
		color: '#cccc00',
		farmType: 'corn',
		description: 'Coastal, 1-2 tiles from ocean, yellow'
	},
	'empty': {
		color: '#000',
		farmType: 'none',
		description: 'Empty, no tile, black'
	},
	'setup': {
		color: '#fff',
		fontWeight: '15px',
		description: 'Tiles with a setup symbol'
	},
	'westernFarm': {
		color: '#00cc66',
		farmType: 'cow|corn|sheep',
		description: 'Western Board, all farm types, green'
	},
	'westernHill': {
		color: '#cc0',
		farmType: null,
		description: 'Western Board, no farms, yellow'
	},
	'cornlands': {
		color: '#cccc00',
		farmType: 'corn',
		description: 'TaZmania Board, Cornlands, no resources, yellow'
	},
	'tazmaniaHill': {
		color: '#cc0',
		farmType: 'cow',
		description: 'TaZmania Board - cows, green'
	},
	'tazmaniaOutback': {
		color: '#ff4d4d',
		farmType: 'sheep',
		description: 'TaZmania Board - sheep, red'
	},
	'lake': {
		color: '#00d',
		farmType: null,
		description: 'TaZmania Board - Lakes, no resouces, blue'
	}
};

/**
 * WESTERN AUZ RULES:
 * DO NOT PLACE ANY COAL OR PHOSPHATES
 * RESOURCES CAN BE PLACED IN GREEN FARMLAND HEXES
 * PLACE 3VP AND 5VP TOKENS AS INDICATED
 * 
 * TAZMANIA RULES:
 * DO NOT PLACE ANY PHOSPHATES
 * NO RESOURCES ARE PLACED IN CORNLANDS OR LAKES
 * 
 */
var boards = {
	tazmania:{
		grid: [
			[
				/** ROW 0 */
				{
					id: 'r0c0',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c1',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c2',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c3',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c4',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c5',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c6',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c7',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c8',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r0c9',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 1 */
				{
					id: 'r1c0',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r1c1',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r1c2',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r1c3',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r1c4',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r1c5',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r1c6',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r1c7',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r1c8',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r1c9',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 2 */
				{
					id: 'r2c0',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c1',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c2',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c3',
					type: 'tazmaniaOutback',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c4',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c5',
					type: 'lake',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c6',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c7',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c8',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c9',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 3 */
				{
					id: 'r3c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r3c1',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r3c2',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r3c3',
					type: 'tazmaniaOutback',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r3c4',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r3c5',
					type: 'tazmaniaOutback',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r3c6',
					type: 'tazmaniaOutback',
					level: 2,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r3c7',
					type: 'tazmaniaOutback',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r3c8',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r3c9',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 4 */
				{
					id: 'r4c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c1',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c2',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c3',
					type: 'tazmaniaOutback',
					level: 2,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r4c4',
					type: 'tazmaniaOutback',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c5',
					type: 'tazmaniaOutback',
					level: 3,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r4c6',
					type: 'tazmaniaOutback',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c7',
					type: 'tazmaniaOutback',
					level: 2,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r4c8',
					type: 'lake',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c9',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 5 */
				{
					id: 'r5c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c1',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c2',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c3',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c4',
					type: 'tazmaniaOutback',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c5',
					type: 'tazmaniaOutback',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c6',
					type: 'tazmaniaOutback',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c7',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c8',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c9',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 6 */
				{
					id: 'r6c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c1',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c2',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c3',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c4',
					type: 'tazmaniaOutback',
					level: 2,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r6c5',
					type: 'tazmaniaHill',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c6',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r6c7',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c8',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c9',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 7 */
				{
					id: 'r7c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r7c1',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r7c2',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r7c3',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r7c4',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r7c5',
					type: 'tazmaniaOutback',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 'r7c6',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r7c7',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r7c8',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r7c9',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 8 */
				{
					id: 'r8c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c1',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c2',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c3',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c4',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c5',
					type: 'cornlands',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c6',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c7',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c8',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r8c9',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			]
		]
	},
	western: {
		grid: [
			[
				/** ROW 0 */
				{
					id: 'r0c0',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 1,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 10,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 19,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 27,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 28,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 35,
					type: 'westernHill',
					level: 2,
					vpToken: 3,
					setupTile: false,
					resources: false
				},
				{
					id: 36,
					type: 'westernHill',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 43,
					type: 'westernHill',
					level: 3,
					vpToken: 3,
					setupTile: false,
					resources: false
				},
				{
					id: 44,
					type: 'westernHill',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 48,
					type: 'westernHill',
					level: 3,
					vpToken: 5,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 1 */
				{
					id: 'r1c0',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 2,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 11,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 12,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 20,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 21,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 29,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 30,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 37,
					type: 'westernHill',
					level: 3,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 45,
					type: 'westernHill',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 49,
					type: 'westernHill',
					level: 3,
					vpToken: null,
					setupTile: true,
					resources: false
				},
			],
			[
				/** ROW 2 */
				{
					id: 'r2c0',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r2c1',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 3,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 4,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 13,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 14,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 22,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 31,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 38,
					type: 'westernHill',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 46,
					type: 'westernHill',
					level: 3,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 50,
					type: 'westernHill',
					level: 3,
					vpToken: 5,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 3 */
				{
					id: 'r3c0',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r3c1',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r3c2',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r3c3',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 5,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 15,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 23,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 32,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 39,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 40,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 47,
					type: 'westernHill',
					level: 3,
					vpToken: null,
					setupTile: true,
					resources: false
				},
			],
			[
				/** ROW 4 */
				{
					id: 'r4c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c1',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c2',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r4c3',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 6,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 16,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 24,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 25,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 33,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 34,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 41,
					type: 'westernHill',
					level: 2,
					vpToken: 3,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 5 */
				{
					id: 'r5c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c1',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c2',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c3',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 7,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 8,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 17,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 18,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: true,
					resources: false
				},
				{
					id: 26,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r5c9',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 42,
					type: 'westernHill',
					level: 2,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			],
			[
				/** ROW 6 */
				{
					id: 'r6c0',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c1',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c2',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c3',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c4',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c5',
					type: 'westernFarm',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 9,
					type: 'westernHill',
					level: 1,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c7',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c8',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c9',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
				{
					id: 'r6c10',
					type: 'empty',
					level: 0,
					vpToken: null,
					setupTile: false,
					resources: false
				},
			]
		]
	},
	eastern: {
		grid: [
			[
				/* ROW 0 */
				{
					id: 44,
					row: 0,
					col: 0,
					type: 'outback',
					level: 3,
					setupTile: false,
					resources: false
				},
				{
					id: 42,
					row: 0,
					col: 1,
					type: 'outback',
					level: 3,
					setupTile: false,
					resources: false
				},
				{
					id: 43,
					row: 0,
					col: 2,
					type: 'outback',
					level: 3,
					setupTile: true,
					resources: false
				},
				{
					id: 39,
					row: 0,
					col: 3,
					type: 'outback',
					level: 3,
					setupTile: false,
					resources: false
				},
				{
					id: 40,
					row: 0,
					col: 4,
					type: 'outback',
					level: 3,
					setupTile: true,
					resources: false
				},
				{
					id: 34,
					row: 0,
					col: 5,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
				},
				{
					id: 35,
					row: 0,
					col: 6,
					type: 'outback',
					level: 3,
					setupTile: true,
					resources: false,
				},
				{
					id: 28,
					row: 0,
					col: 7,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
				},
				{
					id: 'r0c8',
					row: 0,
					col: 8,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
				},
				{
					id: 'r0c9',
					row: 0,
					col: 9,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
				},
				{
					id: 'r0c10',
					row: 0,
					col: 10,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
				}
			],
			[
				/* ROW 1 */
				{
					id: 41,
					row: 1,
					col: 0,
					type: 'outback',
					level: 3,
					setupTile: true,
					resources: false,
				},
				{
					id: 37,
					row: 1,
					col: 1,
					type: 'outback',
					level: 3,
					setupTile: false,
					resources: false,
				},
				{
					id: 38,
					row: 1,
					col: 2,
					type: 'outback',
					level: 3,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 32,
					row: 1,
					col: 3,
					type: 'outback',
					level: 3,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 33,
					row: 1,
					col: 4,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 26,
					row: 1,
					col: 5,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 27,
					row: 1,
					col: 6,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 21,
					row: 1,
					col: 7,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 22,
					row: 1,
					col: 8,
					type: 'outback',
					level: 1,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r1c9',
					row: 1,
					col: 9,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r1c10',
					row: 1,
					col: 10,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},

			],
			[
				/** ROW 2 */
				{
					id: 36,
					row: 2,
					col: 0,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 30,
					row: 2,
					col: 1,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 31,
					row: 2,
					col: 2,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 24,
					row: 2,
					col: 3,
					type: 'outback',
					level: 2,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 25,
					row: 2,
					col: 4,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 19,
					row: 2,
					col: 5,
					type: 'outback',
					level: 2,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 20,
					row: 2,
					col: 6,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 14,
					row: 2,
					col: 7,
					type: 'outback',
					level: 1,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 15,
					row: 2,
					col: 8,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r2c9',
					row: 2,
					col: 9,
					type: 'hill',
					level: 0,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r2c10',
					row: 2,
					col: 10,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
			],
			[
				/** ROW 3 */
				{
					id: 29,
					row: 3,
					col: 0,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r3c1',
					row: 3,
					col: 1,
					type: 'hill',
					level: 0,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 23,
					row: 3,
					col: 2,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 17,
					row: 3,
					col: 3,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 18,
					row: 3,
					col: 4,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 12,
					row: 3,
					col: 5,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 13,
					row: 3,
					col: 6,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 9,
					row: 3,
					col: 7,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r3c8',
					row: 3,
					col: 8,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r3c9',
					row: 3,
					col: 9,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r3c10',
					row: 3,
					col: 10,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
			],
			[
				/** ROW 4 */
				{
					id: 'r4c0',
					row: 4,
					col: 0,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r4c1',
					row: 4,
					col: 1,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 16,
					row: 4,
					col: 2,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 10,
					row: 4,
					col: 3,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 11,
					row: 4,
					col: 4,
					type: 'outback',
					level: 2,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 7,
					row: 4,
					col: 5,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r4c6',
					row: 4,
					col: 6,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 4,
					row: 4,
					col: 7,
					type: 'outback',
					level: 1,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r4c8',
					row: 4,
					col: 8,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r4c9',
					row: 4,
					col: 9,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r4c10',
					row: 4,
					col: 10,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
			],
			[
				/** ROW 5 */
				{
					id: 'r5c0',
					row: 5,
					col: 0,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r5c1',
					row: 5,
					col: 1,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r5c2',
					row: 5,
					col: 2,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 5,
					row: 5,
					col: 3,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 6,
					row: 5,
					col: 4,
					type: 'outback',
					level: 1,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 2,
					row: 5,
					col: 5,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 3,
					row: 5,
					col: 6,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r5c7',
					row: 5,
					col: 7,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r5c8',
					row: 5,
					col: 8,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r5c9',
					row: 5,
					col: 9,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r5c10',
					row: 5,
					col: 10,
					type: 'empty',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
			],
			[
				/** ROW 6 */
				{
					id: 'r6c0',
					row: 6,
					col: 0,
					type: 'empty',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c1',
					row: 6,
					col: 1,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c2',
					row: 6,
					col: 2,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c3',
					row: 6,
					col: 3,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 1,
					row: 6,
					col: 4,
					type: 'outback',
					level: 1,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c5',
					row: 6,
					col: 5,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c6',
					row: 6,
					col: 6,
					type: 'hill',
					level: 0,
					setupTile: true,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c7',
					row: 6,
					col: 7,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c8',
					row: 6,
					col: 8,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c9',
					row: 6,
					col: 9,
					type: 'empty',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r6c10',
					row: 6,
					col: 10,
					type: 'empty',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
			],
			[
				/** ROW 7 */
				{
					id: 'r7c0',
					row: 7,
					col: 0,
					type: 'empty',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c1',
					row: 7,
					col: 1,
					type: 'empty',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c2',
					row: 7,
					col: 2,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c3',
					row: 7,
					col: 3,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c4',
					row: 7,
					col: 4,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c5',
					row: 7,
					col: 5,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c6',
					row: 7,
					col: 6,
					type: 'hill',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c7',
					row: 7,
					col: 7,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c8',
					row: 7,
					col: 8,
					type: 'coastal',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c9',
					row: 7,
					col: 9,
					type: 'empty',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
				{
					id: 'r7c10',
					row: 7,
					col: 10,
					type: 'empty',
					level: 0,
					setupTile: false,
					resources: false,
					neighbours: {}
				},
			]
		]
	}
};