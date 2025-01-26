class MoreHandy extends Voucher 
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
		this.data.name = 'More Handy';
		this.data.description = 'Gain 1 hand per ante';
		this.data.price = 14;
	}
	buyVoucher(game)
	{
		//INCREASE THE INITIAL HANDS PER ANTE
		game.data.state.initial.hands++;
	}
}