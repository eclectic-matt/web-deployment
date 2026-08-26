class ScoreEffect
{
  attackType = "any";
  damageType = "any";
  additor = 0;
  subtractor = 0;
  multiplier = 1;
  divisor = 1;
  
  constructor(attackType = "any", damageType = "any", additor = 0, subtractor = 0, multiplier = 1, divisor = 1)
  {
    this.attackType = attackType;
    this.damageType = damageType;
    this.additor = additor;
    this.subtractor = subtractor;
    this.multiplier = multiplier;
    this.divisor = divisor;
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
    //Attack scores - apply effects
    attack.score += this.additor;
    attack.score -= this.subtractor;
    attack.score *= this.multiplier;
    attack.score /= this.divisor;
    
    //Return the modified attack
    return attack;
  }
}