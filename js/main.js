let deckId = '';
let player1 = new Array
let player2 = new Array

document.querySelector('#play').addEventListener('click', startGame)
document.querySelector('#hitMe').addEventListener('click', hitMe)
document.querySelector('#checkWin').addEventListener('click', checkWin)


fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json()) //parse response as a JSON
    .then(data => {
        console.log(data)
        deckId = data.deck_id
    })
    .catch(err => {
        console.log(`error ${err}`)
    })

function startGame() {
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=4` // draw four cards -- 1 set for p1 , 1 set for p2
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            player1.push(data.cards[0].value, data.cards[1].value) // creating an array of card values for the players using the cards
            player2.push(data.cards[2].value, data.cards[3].value)
            document.querySelector('#p1card1').src = data.cards[0].image
            document.querySelector('#p1card2').src = data.cards[1].image
            document.querySelector('#p2card1').src = data.cards[2].image
            document.querySelector('#p2card2').src = data.cards[3].image
            document.querySelector('#p1Score').innerText = 'Score: ' + getScore(player1)
            document.querySelector('#p2Score').innerText = 'Score: ' + getScore(player2)
            document.getElementById('checkWin').style.display = 'inline-block'
            document.getElementById('hitMe').style.display = 'inline-block'
        })
}

function hitMe() {
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2` // draw one card for Player 1
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            player1.push(data.cards[0].value)
            document.querySelector('#p1Score').innerText = 'Score: ' + getScore(player1)
            // Create img
            const img = document.createElement('img')
            // Add src to image
            img.src = data.cards[0].image
            // Append to DOM
            document.getElementById('p1card').appendChild(img)

            // Adding conditional statement for player2 on whether to draw extra card or not
            if(getScore(player2) < 15) {
                player2.push(data.cards[1].value)
                document.querySelector('#p2Score').innerText = 'Score: ' + getScore(player2)
                const img2 = document.createElement('img')
                img2.src = data.cards[1].image
                document.getElementById('p2card').appendChild(img2)
            }
        })

}

function checkWin() { // Maybe make this into a switch statements 
    let player1Score = getScore(player1)
    let player2Score = getScore(player2)
    if(player1Score == 21) {
        alert('Player 1 Wins')
    } else if(player1Score > 21) {
        alert('Player 1 Busts')
    } else if (player1Score == player2Score) {
        alert('Its a tie')
    } else if (player2Score == 21) {
        alert('Player 2 Wins')
    } else if (player1Score > player2Score) {
        alert('Player 1 Wins')
    } else if (player1Score < player2Score) {
        alert('Player 2 Wins')
    } else if(player1Score > 21 && player2Score > 21) {
        alert('Player 1 wins due to Player 2 going bust')
    } 
    // After Checking the score the page reloads to start the game again
    window.location.reload(true)
}


// A function to convert the array of strings into numbers and tally score
function getScore(arr) {
    for(let i = 0; i < arr.length; i++) {
        if (arr[i] == 'ACE') {
            arr[i] = 11;
        } else if (arr[i] == 'KING' || arr[i] == 'QUEEN' || arr[i] == 'JACK') {
            arr[i] = 10
        } else {
            arr[i] = Number(arr[i])
        }
    }
    return arr.reduce((acc, cur) => acc + cur, 0)
}


// Questions... how to handle the case of Ace being 1 or 11? // We'll worry about this later
// Questions... how to add image when hitting 'hitMe' button?
// Add function of player2 adding card to itself when player1 does hit me 
// Check winning player // Done
// Checkwin Button // Done
// Hide the Checkwin and Hitme Buttons till after the game is initialized // Done
