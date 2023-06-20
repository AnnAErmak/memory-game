import {items} from "./items.js";


const btnStart = document.querySelector('.btn-start')
const btnMenu = document.querySelector('.btn-menu')
const btnRestart = document.getElementById("btn-restart")

const screenStart = document.querySelector('.start-screen')
const settings = document.querySelector('select')
const playingField = document.querySelector('.playing-field')

const timeValue = document.getElementById("time");
const moves = document.getElementById("moves-count")

let interval
let seconds = 0
let minutes = 0
let movesCount = 0
let winCount = 0

btnRestart.addEventListener('click', () => {
    restartGame()
})

btnStart.addEventListener('click', () => {
    screenStart.classList.add('close')
    startGame()
})

function generateField(size){
    switch (size){
        case 16:
            playingField.style.width = "375px"
            playingField.style.gridTemplateColumns = `repeat(${size/4},auto)`
            const newItems = [...items].slice(0, 16)
            generateCards(size, mixElements(newItems))
            break
        case 36:
            playingField.style.width = "545px"
            playingField.style.gridTemplateColumns = `repeat(${size/6},auto)`
            generateCards(size, mixElements(items))
            break
        default:
            playingField.style.width = "705px"
            playingField.style.gridTemplateColumns = `repeat(${size/8},auto)`
            const bigItems = [...items, ...items].slice(0, -8)
            generateCards(size, mixElements(bigItems))
            break
    }

}

const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Время:</span>${minutesValue}:${secondsValue}`;
};

btnMenu.addEventListener('click', () => {
    screenStart.classList.remove('close')
    clearInterval(interval)
    seconds = 0
    minutes = 0
    movesCount = 0
    winCount = 0

})

const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Количество ходов:</span>${movesCount}`;
};


//перемешиваем массив
const mixElements = (elements) => {
    return elements
        .map(el => [Math.random(), el])
        .sort()
        .map(el => el[1])
};


function generateCards (countCard, elements){
    let fr = new DocumentFragment();


    for (let i = 0; i < countCard; i++){
        const card = document.createElement('div')
        const front = document.createElement('div')
        const back = document.createElement('div')
        const img = document.createElement('img')

        img.setAttribute('src', `./images/${elements[i]}`)
        card.setAttribute('data-card-value', elements[i])

        card.classList.add('card')
        front.classList.add('front')
        back.classList.add('back')

        back.append(img)
        card.append(front)
        card.append(back)
        fr.append(card)
    }
    playingField.append(fr)
    const cards = document.querySelectorAll('.card')

    let firstCard = false;
    let secondCard = false;

    cards.forEach((card) =>{
        card.addEventListener('click', (e) => {
            if(card.classList.contains("flipped")) return
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped")
                if (!firstCard) {
                    firstCard = card
                } else {
                    movesCounter()
                    secondCard = card
                    if (firstCard.dataset.cardValue === secondCard.dataset.cardValue) {
                        firstCard.classList.add("matched")
                        secondCard.classList.add("matched")
                        firstCard = false
                        winCount += 1
                        if (winCount === Math.floor(elements.length / 2)) {
                            playingField.innerHTML = `<h2>Вы победили!</h2>
                                <h4>Количество шагов: ${movesCount}</h4>`
                                stopGame()
                        }
                    }else{
                        let [tempFirst, tempSecond] = [firstCard, secondCard]
                        firstCard = false;
                        secondCard = false;
                        playingField.style.pointerEvents = 'none'

                        setTimeout(() => {
                            tempFirst.classList.remove("flipped")
                            tempSecond.classList.remove("flipped")
                            playingField.style.pointerEvents = ''
                        }, 1500)
                        setTimeout(() => {
                            tempFirst.classList.add("shake")
                            tempSecond.classList.add("shake")
                        }, 800)
                        setTimeout(() => {
                            tempFirst.classList.remove("shake")
                            tempSecond.classList.remove("shake")
                        }, 1200)
                    }
                }
            }
        })
    })
}

function stopGame(){
    clearInterval(interval);
}

function restartGame(){
    playingField.innerHTML = `<div class="loader"></div>`
    seconds = 0
    minutes = 0
    movesCount = 0
    winCount = 0
    moves.innerHTML = `<span>Количество ходов:</span>${movesCount}`;
    clearInterval(interval);
    setTimeout(startGame, 2000)

}
function startGame(){
    moves.innerHTML = `<span>Количество ходов:</span>${movesCount}`;
    interval = setInterval(timeGenerator, 1000)
    const size = settings.value
    playingField.innerHTML = ''
    generateField(+size)
}

