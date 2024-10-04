// const scoreCard=document.querySelector(".scorecard");
let letter=""
function isLetter(letter) {
        return /^[a-zA-Z]$/.test(letter);
    }
let i=1;
let word=""

setTimeout(function(){
    let spinner=document.querySelector('.spinner')
    spinner.classList.add('spinAnimation')
},20)
setTimeout(function(){
    let spinAnimation=document.querySelector('.spinAnimation')
    spinAnimation.classList.remove('spinAnimation')
},500)


const wordURL= "https://words.dev-apis.com/word-of-the-day"
let dailyWord=""
let dailyLetterCount={};
async function getDailyWord(){
    const promise=await fetch(wordURL);
    const processedResponse= await promise.json();
    dailyWord+=processedResponse['word']

    for (let i=0; i<dailyWord.length; i++){
        if (dailyWord[i] in dailyLetterCount){
            dailyLetterCount[dailyWord[i]]+=1
        }else{
            dailyLetterCount[dailyWord[i]]=1
        }
    }


}
const postURL="https://words.dev-apis.com/validate-word"
async function postGuess(word){
    let realWord=true;

    const guess={ "word": word}
    await fetch(postURL, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(guess)
    })
    .then((response) => response.json())
    .then((response) => realWord= response["validWord"])

    return realWord
}
let attempt=0;

async function keyClick(key){
    if (i===32){
        return
    }
    let wordBox=document.getElementById("box#" +`${i}`);

    if(key ==="Backspace" && i>1 && i ===6 && attempt ==1){
        return
    }
    else if (key ==="Backspace" && i>1 && i ===11 && attempt ==2){
        return
    }
    else if (key ==="Backspace" && i>1 && i ===16 && attempt ==3){
        return
    }
    else if (key ==="Backspace" && i>1 && i ===21 && attempt ==4){
        return
    }
    else if (key ==="Backspace" && i>1 && i ===26 && attempt ==5){
        return
    }
    else if(key ==="Backspace" && i>1) {
        let wordBox=document.getElementById("box#" +`${i-1}`);

            wordBox.innerHTML="";
            word=word.slice(0, word.length-1)
            i-=1
        }
    else if (key ==="Enter" && word.length === 5 && word ===dailyWord){
        setTimeout(function(){
            let spinner=document.querySelector('.spinner')
            spinner.classList.add('spinAnimation')
        },40)
        setTimeout(function(){
            let spinAnimation=document.querySelector('.spinAnimation')
            spinAnimation.classList.remove('spinAnimation')
        },250)
        for (let x=i-5; x<i;x++){
            let wordBox=document.getElementById("box#" +`${x}`);
            wordBox.classList.add('correctSpot')
        }
        setTimeout(function(){alert("You Win!!!")},300)

        setTimeout(function(){
        let header=document.querySelector('h1')
        header.classList.add('winner')},350)
    }
    else if (key ==="Enter" && word.length === 5 && word !==dailyWord && attempt ===5){
        setTimeout(function(){
            let spinner=document.querySelector('.spinner')
            spinner.classList.add('spinAnimation')
        },40)
        setTimeout(function(){
            let spinAnimation=document.querySelector('.spinAnimation')
            spinAnimation.classList.remove('spinAnimation')
        },250)
        alert("You lose the word was " + `${dailyWord}`)
        let k=0;
        for (let j=i-5; j<i; j++){
            let wordBox=document.getElementById("box#" +`${j}`);
            let letter=wordBox.innerHTML
            if (word[k] ===dailyWord[k]){
                wordBox.classList.add('correctSpot')
            }
            else if (dailyWord.includes(letter) && dailyLetterCount[letter] >0 ){
                dailyLetterCount[letter]-=1
                wordBox.classList.add('correctLetter')
            }
            else{
                wordBox.classList.add('wrong')
            }
            k+=1
        }
    }
    else if (key ==="Enter" && word.length === 5 && word !==dailyWord){
        let k=0;
        let guessLetterCount={};
        setTimeout(function(){
            let spinner=document.querySelector('.spinner')
            spinner.classList.add('spinAnimation')
        },40)
        setTimeout(function(){
            let spinAnimation=document.querySelector('.spinAnimation')
            spinAnimation.classList.remove('spinAnimation')
        },250)

        if (  await postGuess(word)===false) {
            for (let b=i-5;b<i;b++){
                let wordBox=document.getElementById("box#" +`${b}`);
                wordBox.classList.add('invalidWord')
            }
            setTimeout( function(){
                for (let a =i-5; a<i; a++){
                    let wordBox=document.getElementById("box#" +`${a}`);
                    wordBox.classList.remove('invalidWord')
                    // alert('hello')
                }
            },3000 )
            return
        }
        for (let m=0; m<word.length;m++){
            if (word[m] in guessLetterCount && word[m]===dailyWord[m]){
                guessLetterCount[word[m]]+=1

            }
            else if (word[m] in guessLetterCount ){
                guessLetterCount[word[m]]+=1
            }
            else{
                guessLetterCount[word[m]]=1
            }
        }
        for (let j=i-5; j<i; j++){
            let wordBox=document.getElementById("box#" +`${j}`);
            let letter=wordBox.innerHTML;

            if (word[k] ===dailyWord[k]){
                wordBox.classList.add('correctSpot')
                guessLetterCount[word[k]]-=3
            }
            else if (dailyWord.includes(letter) && guessLetterCount[word[k]] ===dailyLetterCount[word[k]]){
                wordBox.classList.add('correctLetter')
                // guessLetterCount[word[k]]-=2
            }
            else if (dailyWord.includes(letter) && guessLetterCount[word[k]] -1 ===dailyLetterCount[word[k]]){
                wordBox.classList.add('correctLetter')
                guessLetterCount[word[k]]+=2
            }
            else if (dailyWord.includes(letter) && guessLetterCount[word[k]] +1 ===dailyLetterCount[word[k]]){
                wordBox.classList.add('correctLetter')
                guessLetterCount[word[k]]+=2
            }

            else{
                wordBox.classList.add('wrong')
            }
            k+=1
        }
        word=""
        attempt+=1
    }
    else if(isLetter(key) && i===6 &&attempt===0){
        return
    }
    else if(isLetter(key) && i===11 &&attempt===1){
        return
    }
    else if(isLetter(key) && i===16 &&attempt===2){
        return
    }
    else if(isLetter(key) && i===21 &&attempt===3){
        return
    }
    else if(isLetter(key) && i===26 &&attempt===4){
        return
    }
    else if(isLetter(key) && i===31 &&attempt===5){
        return
    }
    else if (isLetter(key) ) {
        wordBox.innerHTML=key;
        word+=key;

        i+=1
    }
    else if (key ==="Enter" && word.length != 5){
        return
    }
    }
function init(){
    document
        .querySelector('.scorecard')
        .addEventListener("keydown", function(event){
            keyClick(event.key);


        })

}
init()
getDailyWord()
