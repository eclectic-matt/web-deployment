/**
 * Generic effect type (extended by ScoreEffect).
 */
class Effect 
{
	#effectType = "any";
	constructor(effectType = "any")
	{
		this.#effectType = effectType;
	}
}