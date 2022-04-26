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
		2: 'oldOne',
		3: 'iron',
		4: null,
		5: 'oldOne',
		6: 'coal'
	},
	{
		0: 'oldOne',
		1: 'oldOne',
		2: 'gold',
		3: 'oldOne',
		4: 'phosphorous',
		5: 'coal',
		6: 'oldOne'
	},
	{
		0: 'oldOne',
		1: 'phosphourous',
		2: 'oldOne',
		3: 'coal',
		4: null,
		5: 'gold',
		6: null
	},
	{
		0: 'iron',
		1: null,
		2: 'oldOne',
		3: null,
		4: 'oldOne',
		5: null,
		6: 'oldOne'
	},
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
		count: 3
	},
	"coal": {
		type: "coal",
		count: 3
	},
	"gold": {
		type: "gold",
		count: 3
	},
	"phos": {
		type: "phosphorous",
		count: 1
	},
	"olds": {
		type: "oldOnes",
		count: 1
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
	}
};

var boards = {
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
