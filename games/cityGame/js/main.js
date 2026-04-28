var gameData = {
    date: {
        year: 1,
        month: 0
    },
    event: {
        type: {
            significance: "Major",
            type: "Development",
            voter: "All factions"
        },
        options: [
            {
                title: "Build Poop Factory",
                costs: [
                    {
                        type: "Materials",
                        amount: 20
                    },
                    {
                        type: "Money",
                        amount: 25
                    }
                ],
                benefits: [
                    {
                        type: "Satisfaction",
                        amount: 10
                    },
                    {
                        type: "Health",
                        amount: 15
                    }
                ]
            },
            {
                title: "Build Crap Houses",
                costs: [
                    {
                        type: "Materials",
                        amount: 50
                    },
                    {
                        type: "Money",
                        amount: 20
                    }
                ],
                benefits: [
                    {
                        type: "Satisfaction",
                        amount: 20
                    },
                    {
                        type: "Housing",
                        amount: 25
                    }
                ]
            }
        ]
    }
};

UI = new UI();

loadCurrentEvent(gameData);

function loadCurrentEvent(data)
{
    if(UI == undefined) UI = new UI();
    UI.updateUI(data);
}