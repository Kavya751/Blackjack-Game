const dealerDiv = document.getElementById("dealer-cards");
const playerDiv = document.getElementById("player-cards");

const dealerScoreEl = document.getElementById("dealer-score");
const playerScoreEl = document.getElementById("player-score");
const statusEl = document.getElementById("game-status");

const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const newGameBtn = document.getElementById("newgame-btn");


const helpBtn = document.getElementById("help-btn");
const modal = document.getElementById("rules-modal");
const closeModal = document.getElementById("close-modal");

const suits = ['Hearts','Diamonds','Spades','Clubs'];
const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

const values = {
    '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
    '10':10,'J':10,'Q':10,'K':10,'A':11
};

let deck = [];
let playerCards = [];
let dealerCards = [];
let gameOver = false;

function createDeck() {
    deck = [];
    for (let s of suits) {
        for (let r of ranks) {
            deck.push({suit: s, rank: r});
        }
    }
}

function shuffle() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard() {
    return deck.pop();
}

function getValue(cards) {
    let value = 0;
    let aces = 0;

    cards.forEach(card => {
        value += values[card.rank];
        if (card.rank === 'A') aces++;
    });

    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value;
}

function displayCards() {
    playerDiv.innerHTML = "";
    dealerDiv.innerHTML = "";

    playerCards.forEach(card => {
        playerDiv.appendChild(createCardElement(card));
    });

    dealerCards.forEach((card, index) => {
        let hidden = (!gameOver && index === 0);
        dealerDiv.appendChild(createCardElement(card, hidden));
    });

    playerScoreEl.innerText = "Score: " + getValue(playerCards);

    if (gameOver) {
        dealerScoreEl.innerText = "Score: " + getValue(dealerCards);
    } else {
        dealerScoreEl.innerText = "Score: ?";
    }
}

function startGame() {
    gameOver = false;

    createDeck();
    shuffle();

    playerCards = [drawCard(), drawCard()];
    dealerCards = [drawCard(), drawCard()];

    statusEl.innerText = "Game started. Your move!";

    displayCards();
}

startGame();

hitBtn.addEventListener("click", () => {
    if (gameOver) return;

    playerCards.push(drawCard());

    if (getValue(playerCards) > 21) {
        statusEl.innerText = "Bust! You exceeded 21. Dealer wins.";
        gameOver = true;
    }

    displayCards();
});

standBtn.addEventListener("click", () => {
    if (gameOver) return;

    // Dealer plays
    while (getValue(dealerCards) < 17) {
        dealerCards.push(drawCard());
    }

    let playerValue = getValue(playerCards);
    let dealerValue = getValue(dealerCards);

    if (dealerValue > 21 || playerValue > dealerValue) {
        statusEl.innerText = "You win! Your hand beats the dealer.";
    } else if (playerValue < dealerValue) {
        statusEl.innerText = "Dealer wins. Better luck next round.";
    } else {
        statusEl.innerText = "Push. It's a tie.";
    }

    gameOver = true;
    displayCards();
});

newGameBtn.addEventListener("click", () => {
    startGame();
});

document.addEventListener("DOMContentLoaded", () => {
    const helpBtn = document.getElementById("help-btn");
    const modal = document.getElementById("rules-modal");
    const closeModal = document.getElementById("close-modal");

    helpBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

function getCardImage(card) {
    return `assets/cards/${card.rank}${card.suit[0]}.png`;
}

function createCardElement(card, hidden = false) {
    let div = document.createElement("div");
    div.classList.add("card");

    let img = document.createElement("img");

    if (hidden) {
        img.src = "assets/cards/back.png";
    } else {
        img.src = getCardImage(card);
    }

    div.appendChild(img);
    return div;
}