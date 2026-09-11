/**
 * An effect that gives you insight into enemies or items.
 */
class InsightEffect extends Effect 
{
  #insightType = "items";
  constructor(insightType = "items")
  {
    this.#insightType = insightType;
  }
}