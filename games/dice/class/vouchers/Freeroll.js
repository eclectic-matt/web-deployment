class FreeRoll extends Voucher 
{
	constructor(data=false){
		if(data){
			super(data);
		}else{
			this.initData();
		}
	}
	initData()
	{
		this.data = {};
		this.data.name = 'FreeRoll';
		this.data.description = 'Gain 1 reroll per hand';
		this.data.price = 15;
	}
	buyVoucher(game)
	{
		//INCREASE THE INITIAL REROLLS PER HAND
		game.data.state.initial.rerolls++;
	}
}