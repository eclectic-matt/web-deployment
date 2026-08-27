class ScoreEffect extends Effect
{
	//This score effect applies to "any" attack type
	attackType = "any";
	//This score effect applies to "any" damage type
	damageType = "any";
	//This score effect adds 0 to the overall score
	additor = 0;
	//This score effect subtracts 0 from the overall score
	subtractor = 0;
	//This score effect multiplies the overall score by 1
	multiplier = 1;
	//This score effect divides the overall score by 1
	divisor = 1;
	//This score effect has this chance of happening (%)
	chancePercentage = 100;
	//This effect has been scored for the current attack (resets between attacks)
	scored = false;
	
	constructor(attackType = "any", damageType = "any", additor = 0, subtractor = 0, multiplier = 1, divisor = 1, chancePercentage = 100)
	{
		super("score");
		this.attackType = attackType;
		this.damageType = damageType;
		this.additor = additor;
		this.subtractor = subtractor;
		this.multiplier = multiplier;
		this.divisor = divisor;
		this.chancePercentage = chancePercentage;
	}
	
	//Apply score effects if the attack matches the effect and return the score/false.
	score(attack)
	{
		//Check attackType is not any and doesn't match
		if(this.attackType !== "any" && this.attackType !== attack.attackType)
		{
		//No attack match, return
		return false;
		}
		//Check damageType is not any and doesn't match
		if(this.damageType !== "any" && this.damageType !== attack.damageType)
		{
		return false;
		}
		if(this.chancePercentage < 100)
		{
			randomChance = Math.floor(Math.random() * 100);
			//If this is above the percentage (60% chance has 40% chance of failure)
			if(randomChance >= this.chancePercentage)
			{
				return false;
			}
		}
		//Attack scores - apply effects
		attack.score += this.additor;
		attack.score -= this.subtractor;
		attack.score *= this.multiplier;
		attack.score /= this.divisor;
		//Mark that this effect has been scored
		this.scored = true;
		//Return the modified attack
		return attack;
	}
}