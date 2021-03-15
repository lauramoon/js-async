const numbers_URL = 'http://numbersapi.com';
const card_URL = 'https://deckofcardsapi.com/api/deck';
const pokemon_URL = 'https://pokeapi.co/api/v2/pokemon';
const num1 = document.getElementById("number-fact-1");
const num2 = document.getElementById("number-fact-2");
const num3 = document.getElementById("number-fact-3");
const cardDiv = document.getElementById("card-draw");
const drawButton = document.getElementById("draw-button");
let displayDeck;
const pokemonButton = document.getElementById("pokemon-button");
const pokemonDiv = document.getElementById("three-pokemon");

async function getNumFact(num) {
    try {
        const res = await axios.get(`${numbers_URL}/${num}?json`);
        return res.data;
    } catch (err) {
        console.log(err);
        return "Something went wrong."
    }
}

async function setNum1Fact() {
    res = await getNumFact(14);
    num1.innerHTML = res.text;
}

async function setNum2Fact() {
    res = await getNumFact('6,8,43,52');
    for (num of [6, 8, 43, 52]) {
        num2.innerHTML += `<p>${res[num]}</p>`;
    }
}

async function setNum3Fact() {
    for (i=0; i < 4; i++) {
        res = await getNumFact(14);
        num3.innerHTML += `<p>${res.text}</p>`;
    }
}

setNum1Fact();
setNum2Fact();
setNum3Fact();

async function getCardDeck() {
    try {
        const res = await axios
            .get('https://deckofcardsapi.com/api/deck/new/shuffle/');
        return res.data.deck_id;
    } catch (err) {
        console.log(err);
        return false;
    }
}
async function drawNextCard(deckNum) {
    try {
        const res = await axios.get(`${card_URL}/${deckNum}/draw/?count=1`);
        return res.data.cards[0];
    } catch (err) {
        console.log(err)
        return false;
    }
}

async function logTopCard() {
    const deckNum = await getCardDeck();
    const card = await drawNextCard(deckNum);
    console.log("Deck of Cards #1:");
    console.log(`${card.value} of ${card.suit}`);
}

async function logTopTwoCards() {
    const deckNum = await getCardDeck();
    const card1 = await drawNextCard(deckNum);
    const card2 = await drawNextCard(deckNum);
    console.log("Deck of Cards #2:");
    console.log(`${card1.value} of ${card1.suit}`);
    console.log(`${card2.value} of ${card2.suit}`);
}
logTopCard();
logTopTwoCards();


// create deck for card display on page load
setCardDeck();

async function setCardDeck() {
    const res = await getCardDeck();
    if (res) {
        displayDeck = res;
    } else {
        drawButton.removeEventListener('click', e => {
            drawButton.innerText = 'Something went wrong.'
        })
    }
}

drawButton.addEventListener('click', async e => {
    const card = await drawNextCard(displayDeck);
    if (card) {
        let deg = (Math.random() - .5)*45;
        cardDiv.innerHTML += `<img 
                            class="card" 
                            style="transform:rotate(${deg}deg);"
                            src="${card.image}">`;
    } else {
        cardDiv.innerHTML = '<p>Something went wrong. Please refresh page. </p>';
    }
})

pokemonButton.addEventListener('click', async e => {
    try {
        const num = await axios.get(`${pokemon_URL}`);
        let numPokemon = num.data.count;
        const all = await axios.get(`${pokemon_URL}?limit=${numPokemon}`);
        let allPokemon = all.data.results;
        for (let i=0; i < 3; i++) {
            let randPick = Math.floor(Math.random()*1118);
            await post_info(allPokemon[randPick])
        }
    } catch (err) {
        console.log(err)
    }
})

let description;
async function post_info(pokemon) {
    let name = pokemon.name;

    try {
        const res = await axios.get(pokemon.url);
        const species = await axios.get(res.data.species.url);
        const entries = species.data.flavor_text_entries;
        for (entry of entries) {
            if (entry.language.name == 'en') {
                description = entry.flavor_text;
                break;
            }
        }
        pokemonDiv.innerHTML += `<h3>${name}</h3>
                                <p>${description}</p>`
    } catch (err) {
        console.log(err)
    }
}
