/**
 * Extends Item
 */
class Ring extends Item 
{
  effect = {};
  
  constructor(name, effect)
  {
    super("ring", name);
    this.effect = effect;
  }
  score(attack)
  {
    this.effect.score(attack);
  }
}