const showTab = (tabName) => 
{
	let tabDisplays = document.getElementsByClassName("tabDisplay");

	//Hide all tabs
	tabDisplays.forEach( (tab) => 
	{
		//If we are on the tab to display
		if(tab.className.indexOf(tabName) > 0)
		{
			//Block display
			tab.style.display = 'block';
		}else{
			//Hide display
			tab.style.display = 'none';
		}
	});
}

class UI 
{
	constructor()
	{
		//Menu - year/month
		this.dateMenuHeaderUIElId = 'dateHeaderMenuEl';
		this.dateMenuHeaderUIEl = document.getElementById(this.dateMenuHeaderUIElId);
		//Major Development / Minor Development / Opportunity
		this.eventHeaderUIElId = 'developmentTypeHeader';
		this.eventHeaderUIEl = document.getElementById(this.eventHeaderUIElId);
		//All factions vote / Only you vote
		this.eventVoteUIElId = 'voteTypeHeader';
		this.eventVoteUIEl = document.getElementById(this.eventVoteUIElId);

		//Vote One Options 
		this.eventVoteOneOptionHeaderElId = 'voteOneHeader';
		this.eventVoteOneOptionHeaderEl = document.getElementById(this.eventVoteOneOptionHeaderElId);
		//Vote one costs
		this.eventVoteOneOptionCostsElId = 'voteOneCostsUl';		
		this.eventVoteOneOptionCostsListEl = document.getElementById(this.eventVoteOneOptionCostsElId);
		//Vote one benefits
		this.eventVoteOneOptionBenefitsElId = 'voteOneBenefitsUl';
		this.eventVoteOneOptionBenefitsListEl = document.getElementById(this.eventVoteOneOptionBenefitsElId);
		//Vote Two Options 
		this.eventVoteTwoOptionHeaderElId = 'voteTwoHeader';
		this.eventVoteTwoOptionHeaderEl = document.getElementById(this.eventVoteTwoOptionHeaderElId);
		//Vote Two costs
		this.eventVoteTwoOptionCostsElId = 'voteTwoCostsUl';		
		this.eventVoteTwoOptionCostsListEl = document.getElementById(this.eventVoteTwoOptionCostsElId);
		//Vote Two benefits
		this.eventVoteTwoOptionBenefitsElId = 'voteTwoBenefitsUl';
		this.eventVoteTwoOptionBenefitsListEl = document.getElementById(this.eventVoteTwoOptionBenefitsElId);
	}
	//OVERVIEW
	updateUI(data)
	{
		//SPLIT INTO SECTIONS HERE, AS (element, string/array to update)
		//Update date string
		const dateString = this.getDateString(data.date);
		console.log('date string',dateString);
		this.updateElementText(this.dateMenuHeaderUIEl, dateString);
		//Event significance + type => "Major" / "Minor" / "" + "Development" / "Opportunity" / "Event"
		const eventHeaderString = data.event.type.significance + " " + data.event.type.type;
		this.updateElementText(this.eventHeaderUIEl, eventHeaderString);
		//Faction voting "All factions" / "Only you" + " vote..."
		const eventVoteString = data.event.type.voter + " vote...";
		this.updateElementText(this.eventVoteUIEl, eventVoteString);
		//Vote option 1
		const voteOptionOneData = data.event.options[0];//title, arrCosts, arrBenefits
		//Header
		this.updateElementText(this.eventVoteOneOptionHeaderEl, voteOptionOneData.title);
		//Vote One Costs
		this.updateElementList(this.eventVoteOneOptionCostsListEl, voteOptionOneData.costs, 'voteCostsLi');
		//Vote One Benefits
		this.updateElementList(this.eventVoteOneOptionBenefitsListEl, voteOptionOneData.benefits, 'voteBenefitsLi');
		//Vote option 2
		const voteOptionTwoData = data.event.options[1];//title, arrCosts, arrBenefits
		//Header Two
		this.updateElementText(this.eventVoteTwoOptionHeaderEl, voteOptionTwoData.title);
		//Vote Two Costs
		this.updateElementList(this.eventVoteTwoOptionCostsListEl, voteOptionTwoData.costs, 'voteCostsLi');
		//Vote Two Benefits
		this.updateElementList(this.eventVoteTwoOptionBenefitsListEl, voteOptionTwoData.benefits, 'voteBenefitsLi');
	}
	//UPDATE ELEMENT WITH TEXT ONLY
	updateElementText(el, text)
	{
		//Set the innerHTML directly
		el.innerHTML = text;
	}
	updateElementList(el, arr, className)
	{
		//Clear list between runs
		el.innerHTML = null;
		arr.forEach( (arrEl) => {
			let li = document.createElement('li');
			li.innerHTML = arrEl.type + " " + arrEl.amount;
			li.className = className;
			el.appendChild(li);
		});
	}
	//GET DATE AS FORMATTED STRING
	getDateString(date)
	{
		return new Date(2026,date.month,1).toLocaleString('default', { month: 'long' }) + ", Year " + date.year;
	}
}