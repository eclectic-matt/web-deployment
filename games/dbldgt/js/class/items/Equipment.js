class Equipment extends Item 
{
	//==============
  //Private fields
  //==============
	#id = "generic_item_000";
	#type = "equipment";
	#slot = "none";
	//Fields that contribute to damage scoring
	// - base
	#baseAdd = 0;
	#baseSub = 0;
	#baseMul = 1;
	#baseDiv = 1;
	// - mult
	#multAdd = 0;
	#multSub = 0;
	#multMul = 1;
	#multDiv = 1;
	// - special
	//How many times this scores
	#scoreTimes = 1;
	//Effect
	effect = {
		name: "power",
		operation: "multiply",
		value: 3,
		description: "x3 Power"
	};
	//==============
	//Public fields
	//==============
	name = "equipment";
	rarity = Rarity.Common;
	
	constructor(type, name)
	{
		super(type, name);
	}
	
	score(damage)
	{
		for(let i = 1; i <= this.#scoreTimes; i++)
		{
			//Apply base calculations
			damage.base += this.#baseAdd;
			damage.base -= this.#baseSub;
			damage.base *= this.#baseMul;
			damage.base /= this.#baseDiv;
			//Apply mult calculations
			damage.mult += this.#multAdd;
			damage.mult -= this.#multSub;
			damage.mult *= this.#multMul;
			damage.mult /= this.#multDiv;
		}
		return damage;
	}
}