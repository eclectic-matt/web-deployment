var letters = {
	
	'uni': 
		{
			'A':['Academic','Applied','Association','Authority','Assurance','Appraisal','Agency','Alliance','Approval','Assessment','Achievement','Appeal','Agenda','Agreement','Appointment','Accountability','Amendment','Authentification','Alumni','Audit','Admission'],
			'B':['Business','Branding','Boycott','Briefing','Backup','Bespoke','Barrier','Basic','Basis','Breakthrough','Bulletin','Bias','Building'],
			'C':['Communication','Creative','Committee','Certification','Confirmation','Conference','Contract','Candidate','Classification','Channel','Competence','Clearance','Combine','Concept','Confidential','Correspondance','Control','Centre','Charter','Culture','Compliance','Curriculum'],
			'D':['Development','Directorate','Dynamic','Data','Defunct','Declaration','Domination','Decree','Directory','Demonstration','Disclosure','Disintegration','Division','Duty','Diversity','Digital'],
			'E':['Enhancement','Engagement','Education','Empowered','Ethos','Evaluation','Elective','Election','Employee','Exceptional','Experience','Expert','Extension','Economic','Entitlement','Equality','Ethics'],
			'F':['Facilitation','Facilities','Formative','Foundation','Facilities','Frontline','Format','Fair','Feasibility','Forecast','Formula','Functional','Flexible','Funding','Framework','Faculty'],
			'G':['Generation','Group','Guidance','Global','Grievance','Goal','Governance','Graphic','Graduate','Graduation','Gender'],
			'H':['Higher','Holistic','Hierarchical','Handbook','Helpdesk'],
			'I':['Implementation','Information','Integration','Impact','Influence','Intermediary','Innovation','International'],
			'J':['Joint','Job','Judgement','Justification','Joylessness','Juvenile','Jiggling','Junior'],
			'K':['Knowledge','Key','Keynote','Kit','Know-how','Kudos'],
			'L':['Leadership','Legislative','Liaison','Learning','Legislation','Liability'],
			'M':['Management','Multifunctional','Mainstream','Malfunction','Marginal','Misconduct','Moderator','Moribund','Marginal','Mediocre','Monitoring','Mentoring','Maintenance'],
			'N':['Networking','Negotiation','Notional','Negotiation','National'],
			'O':['Operational','Organisational','Office','Optimal','Official'],
			'P':['Professional','Policy','Prestige','Practice','Physical','Political','Planning'],
			'Q':['Quality','Quantitative','Qualified','Quixotic','Quasi'],
			'R':['Responsive','Reactive','Research','Resources','Review','Regional','Recruitment','Retention'],
			'S':['Support','Secretariat',' Services','Synergy','Strategic','Single','Strategy','Safeguarding','Safety','Studies','Survey','Senior','Student','Standards','Support'],
			'T':['Teaching','Technology','Team','Treasury','Transmission','Tenacious'],
			'U':['University','Union','Unitary','Unit'],
			'V':['Values','Variation','Vision','Voluntary'],
			'W':['Working','Wellbeing','Welfare','Web'],
			'X':['Xenial','Xenogeny','Xanadu','eXemplary','eXceptional','eXperience','eXpert','eXtension'],
			'Y':['Youth','Yearly','Yield'],
			'Z':['Zenith','Zeitgeist']
		},
	
	'technology':
		{
			'A':['Analogue', 'Automated', 'Agile','Advanced','Adept','Advert'],
			'B':['Bluetooth', 'Buckets', 'Bandwidth', 'Back-End'],
			'C':['Crash', 'Console', 'Cache', 'Chip', 'Compression'],
			'D':['Database','Download', 'Domain'],
			'E':['Encryption','Ethernet','Email','Explode','Erase','E-Commerce'],
			'F':['Firewall','File','Fidelity'],
			'G':['Gateway','Graphics','Global','GNU'],
			'H':['Hardware','Hypertext','Home','Heads','Human'],
			'I':['Internet','Information','Intranet','International'],
			'J':['Java','Javascript','Join','Just'],
			'K':['Kilobytes','Kilobits','Keyboard','Knowledge'],
			'L':['Local','Laser','Light','Localization'],
			'M':['Malware','Megabyte','Megahertz','Modem'],
			'N':['Network','Net','Namespace'],
			'O':['Online','Operating','Object','Oriented'],
			'P':['Performance','Protocol','Pathway','Processor','PHP'],
			'Q':['Queue','Quick','Query'],
			'R':['Read-Only','Resolution','Regex','Recursive','Refresh','Rate','Return'],
			'S':['Software','Service','Search','Secure','Socket','Structured','Sales','Support'],
			'T':['Tick','Total','Terrabyte'],
			'U':['Uniform','Unzip','Undo'],
			'V':['Version','Virus','Video'],
			'W':['Wired','Wireless','Working'],
			'X':['eXtensible','Xerox','X-Window'],
			'Y':['Y2K','YK38','Yet'],
			'Z':['Zip','Zero','Zone']
		},

	'swear' : 
		{
		'A':['Arsebasket','Asswipe','Anal'],
		'B':['Bollocks','Bumhead','Buttmunch'],
		'C':['Cockwomble','Crapbasket','Cunt'],
		'D':['Douchebags','Dickwad','Dildohead'],
		'E':['Erection','Ejaculation','Enema'],
		'F':['Fuckwit','Frigging','Fartbox'],
		'G':['Gits','Goddamned','Gooch'],
		'H':['Haemorrhoid','Ho','Handjob'],
		'I':['Idiotic','Imbecile','Ignoramus'],
		'J':['Jobsworth','Jackass','Jackoff'],
		'K':['Kootch','Kunt'],
		'L':['Lameass','Lardass'],
		'M':['Minge','Munter','Muthafucka'],
		'N':['Nutsack','Nobwit','Nobhead'],
		'O':['Orgy','Orgasm'],
		'P':['Poop','Prickwizard','Pantsniffer'],
		'Q':['Queef','Queer'],
		'R':['Rimjob','Runt','Rickroll'],
		'S':['Shitbiscuit','Smeghead','Scrotumface'],
		'T':['Turdmunch','Twatnose','Thundercunt'],
		'U':['Unclefucker','Uterushead'],
		'V':['Vagina','Vajazzle'],
		'W':['Wankchasm','Willyface','Whorebag'],
		'X':['X-rated','eXtreme'],
		'Y':['Yanked','Yabbos','Yankers'],
		'Z':['Zoinks','Zoophiliac','Zooerasty']
	}
		
};

function createBackronym(){
	var backronym = document.getElementById('backronym').value.toUpperCase();
	outputString = '<h3>' + backronym + '</h3><span class="each-word">';
	
	var output = document.getElementById('output');
	var backronymCount = backronym.length;
	
	var useUni = document.getElementById('uniTerms').checked;
	var useSwear = document.getElementById('swearTerms').checked;
	var useTech = document.getElementById('techTerms').checked;
	
	for (var i = 0; i < backronymCount; i++){
		
		var thisLetter = backronym.substr(i,1);
		
		// NEW VERSION 
		var acronymOptions = [];
		
		if (useUni){
			acronymOptions = acronymOptions.concat(letters["uni"][thisLetter]);
		}

		if (useSwear){
			acronymOptions = acronymOptions.concat(letters["swear"][thisLetter]);
		}

		if (useTech){
			acronymOptions = acronymOptions.concat(letters["technology"][thisLetter]);
		}

		var numOptions = acronymOptions.length;
		var randy = Math.floor(Math.random() * numOptions);
		var word = acronymOptions[randy];

		outputString += word + '<br>';
	}
	outputString += '</span>';
	output.innerHTML = outputString;
}