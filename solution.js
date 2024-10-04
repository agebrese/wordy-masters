const letters=document.querySelectorAll('.scoreboard-letter');

const loadingDiv=document.querySelector('.info-bar');
// avoid use of magic numbers define any numbers used for clarity
const ANSWER_LENGTH=5;
const ROUNDS=6;

// init function is async so that you can await any functions
// inside the init function

// tip is to write the skeleton of what you want to do 1st
async function init(){
    let currentGuess="";
    let currentRow=0;
    let isLoading=true;


    const res=await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObj=await res.json()
    const word=resObj.word.toUpperCase();
    const wordParts=word.split("");
    let done=false;

    isLoading=false;
    setLoading(isLoading);
    // console.log(word)



    function addLetter(letter){
        if (currentGuess.length < ANSWER_LENGTH){
            // add letter to the end
            currentGuess+=letter;
        }else{
            // replace the last letter
            currentGuess=currentGuess.substring(0,currentGuess.length-1)+ letter
        }
            // placing letter into html
        letters[ANSWER_LENGTH * currentRow + currentGuess.length-1].innerText=letter;
    }

    async function commit(){
        if (currentGuess.length !== ANSWER_LENGTH){
            //do nothing
            return;
        }


        isLoading=true;
        setLoading(true);
        const res=await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({word: currentGuess})
        });

        const resObj=await res.json()
        const validWord=resObj.validWord;
        // const {validWord}=resObj;

        isLoading=false;
        setLoading(false);

        if (!validWord){
            markInvalidWord();
            return;
        }

        const guessParts=currentGuess.split("");
        const map=makeMap(word)


        for (let i=0; i<ANSWER_LENGTH; i++){
            // mark as correct
            if (guessParts[i]===wordParts[i]){
                letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
                map[guessParts[i]]--
            }
        }

        for (let i=0; i<ANSWER_LENGTH; i++){
            if (guessParts[i]===wordParts[i]){
                //do nothing, we already did it
            }else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] >0 ){
                // mark as correct
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
                map[guessParts[i]]--
            }else{
            letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
            }
        }
        currentRow++;
        if (currentGuess===word){
            // win
            alert('you win!');
            document.querySelector('.brand').classList.add('winner')
            done=true;
            return ;
        }else if(currentRow===ROUNDS){
            alert (`you lose the word was ${word}`)
            done=true;
        }
        currentGuess="";

    }

    function backspace(){
        currentGuess=currentGuess.substring(0,currentGuess.length-1)

        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText="";
    }

    function markInvalidWord(){
        for (let i=0; i< ANSWER_LENGTH; i++){
            letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

            setTimeout(function (){
                letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
            }, 10)
        }
    }


    document.addEventListener('keydown', function handleKeyPress(event){
        if (done || isLoading){
            // do nothing
            return;
        }

        const action=event.key


        if (action === 'Enter'){
            commit();
        } else if (action ==='Backspace'){
            backspace();
        } else if (isLetter(action)){
            addLetter(action.toUpperCase())
        }else{
            //do nothing
        }
    })
}
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

function setLoading(isLoading){
    loadingDiv.classList.toggle('hidden', !isLoading);
}

function makeMap(array){
    const obj={}
    for (i=0; i < array.length; i++){
        const letter=array[i]
        if (obj[letter]){
            obj[letter]++
        }else{
            obj[letter]=1
        }
    }

    return obj
}

init();
