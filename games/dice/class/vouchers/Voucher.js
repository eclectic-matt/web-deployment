class Voucher 
{
	constructor(data=false){
		if(!data){
			this.initData();
		}else{
			this.data = data;
		}
	}
	initData()
	{
		this.data = {};
		this.data.name = 'Example Voucher';
		this.data.description = 'Example Description';
		this.data.price = 10;
	}
	buyVoucher(game)
	{
		//NO EFFECT
		return false;
	}
}