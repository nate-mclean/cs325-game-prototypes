
window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    var game = new Phaser.Game(1000, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {

    //spritesheet ref
    //this.load.spritesheet('dice', 'assets/diceroll.png', 100, 100, 6);
    
    this.load.image('bkg', 'assets/bkg.png');
    this.load.image('button', 'assets/button.png');
    this.load.image('newwordbutton', 'assets/newwordbutton.png');
    this.load.image('newgamebutton', 'assets/newgamebutton.png');
    this.load.image('playletterbutton', 'assets/playletterbutton.png');
    this.load.image('oneplayerbutton', 'assets/oneplayerbutton.png');
        this.load.image('twoplayerbutton', 'assets/twoplayerbutton.png');
    
    //dictionary 
    this.game.load.text('dictionary', 'assets/dictionary.txt');
    
    //audio
   //this.load.audio('song', 'assets/song.mp3');



}

//globals

//sounds
var music;

//state
var state = false;
var ingame = false;
var oneortwoplayer = false; //false = 1 player, true = 2 player

//sprites
var newgamebutton;
var newwordbutton;
var playletterbutton;
var oneplayerbutton;
var twoplayerbutton;
var bkg;

//text
var playeronescore;
var playertwoscore;
var playerturn;
var playernum=1;
var lettertiles1;
var lettertiles2;
var numbertiles1;
var numbertiles2;
var sentence;
var sentencetext="";
var index;

//text data
var playeronescorenum = 0;
var playertwoscorenum = 0;



//arrays
var letters;
var numbers;




function create() {

//music
    //music = game.add.audio('song');
    //music.play();


//groups
    letters = new Array(20);   
    numbers = new Array(20);   


//create game enviroment
bkg = game.add.sprite(0, 0, 'bkg');

//buttons
newgamebutton = game.add.sprite(270, 250, 'newgamebutton');
newgamebutton.inputEnabled = true;
newwordbutton = game.add.sprite(400, 420, 'newwordbutton');
newwordbutton.inputEnabled = true;
playletterbutton = game.add.sprite(640, 420, 'playletterbutton');
playletterbutton.inputEnabled = true;
oneplayerbutton = game.add.sprite(200, 100, 'oneplayerbutton');
oneplayerbutton.inputEnabled = true;
twoplayerbutton = game.add.sprite(450, 100, 'twoplayerbutton');
twoplayerbutton.inputEnabled = true;
twoplayerbutton.alpha=.3;





//game text
    playeronescore = game.add.text(150, 50, playeronescorenum, { font: "50px Arial", fill: "#000000", align: "center" });
    playertwoscore = game.add.text(790, 50, playertwoscorenum, { font: "50px Arial", fill: "#000000", align: "center" });
    
    sentence =  game.add.text(50,160,"",{ font: "30px Arial", fill: "#000000", align: "center" });
    
    playerturn = game.add.text(40, 420, "Player 1:", { font: "50px Arial", fill: "#000000", align: "center" });
    lettertiles1= game.add.text(63, 527, "", { font: "50px Arial", fill: "#000000", align: "center" });
    lettertiles2= game.add.text(63, 615, "", { font: "50px Arial", fill: "#000000", align: "center" });
    numbertiles1= game.add.text(105, 570, "          ", { font: "20px Arial", fill: "#000000", align: "center" });
   numbertiles2= game.add.text(105, 658, "   ", { font: "20px Arial", fill: "#000000", align: "center" });
   
    //endgame = game.add.text(330, 200, "Increase regulations to \nenable rapid tree growth,\n grow 25 trees \nto save the forest!!", { font: "60px Arial", fill: "#000000", align: "center" });
    
    
   

}

function update() {
    
    //keep animals in front 
    //game.world.bringToTop(catsg);
    
    //update text fields
    playeronescore.setText(playeronescorenum);
    playertwoscore.setText(playertwoscorenum);
    playerturn.setText("Player "+playernum);
    
    //play letter button smart
    if( state === false) {
        playletterbutton.alpha = .2
        playletterbutton.inputEnabled = false;
    }
    if( state === true) {
        playletterbutton.alpha = 1
        playletterbutton.inputEnabled = true;
    }

    //button clicks
        newwordbutton.events.onInputDown.add(newword, this);
        newgamebutton.events.onInputDown.add(newgame, this);
        playletterbutton.events.onInputDown.add(playletter, this);
        oneplayerbutton.events.onInputDown.add(oneplayer, this);
        twoplayerbutton.events.onInputDown.add(twoplayer, this);
    //clicking on a letter
        if (game.input.activePointer.isDown)
    {
        checkfortile();
    }
}
function checkfortile () {
    
    if(ingame){
    var x = Math.round(game.input.activePointer.position.x);     
    var y = Math.round(game.input.activePointer.position.y);

//find correct letter selected
  var hit = false
//within bounds
if( x> 60 && x <900 && y >530 && y <680 ){
    hit = true;
    newwordbutton.alpha = .2;
    newwordbutton.inputEnabled  = false;
    }
//letter
if( x > 60 && x < 130 && y >530 && y< 600)
    index = 0;
if( x >= 130 && x < 210 && y >530 && y< 600)
    index = 1;
if( x >= 210 && x < 290 && y >530 &&  y< 600)
    index = 2;
if( x >= 290 && x < 370 && y >530 && y< 600)
    index = 3;
if( x >= 370 && x < 450 && y >530 && y< 600)
    index = 4;
if( x >= 450 && x < 540 && y >530 && y< 600)
    index = 5;
if( x >= 540 && x < 630 && y >530 && y< 600)
    index = 6;
if( x >= 630 && x < 720 && y >530 && y< 600)
    index = 7;
if( x >= 720 && x < 810 && y >530 && y< 600)
    index = 8;
if( x >= 810 && x < 900 && y >530 && y< 600)
    index = 9;
if( x > 60 && x < 130 && y >=600 && y< 680)
    index = 10;
if( x >= 130 && x < 210 && y >=600 && y< 680)
    index = 11;
if( x >= 210 && x < 290 && y >=600 && y< 680)
    index = 12;
if( x >= 290 && x < 370 && y >=600 && y< 680)
    index = 13;
if( x >= 370 && x < 450 && y >=600 && y< 680)
    index = 14;
if( x >= 450 && x < 540 && y >=600 && y< 680)
    index = 15;
if( x >= 540 && x < 630 && y >=600 && y< 680)
    index = 16;
if( x >= 630 && x < 720 && y >=600 && y< 680)
    index = 17;
if( x >= 720 && x < 810 && y >=600 && y< 680)
    index = 18;
if( x >= 810 && x < 900 && y >=600 && y< 680)
    index = 19;


//first time enter
if(state === false && hit === true){
    sentencetext += letters[index];
    sentence.setText(sentencetext);
    state = true;
}
//enter after x time
if(state === true && hit === true){
    sentencetext = sentencetext.substring(0, sentencetext.length-1);
     sentencetext += letters[index];
    sentence.setText(sentencetext);
}

}
}
function oneplayer () {
    oneortwoplayer = false;
    oneplayerbutton.alpha=1;
    twoplayerbutton.alpha=.3;
    }
function twoplayer () {
    oneortwoplayer= true;
    oneplayerbutton.alpha=.3;
    twoplayerbutton.alpha=1;
    }
function newgame () {
    resetletters();
    newgamebutton.visible=false;
    oneplayerbutton.visible=false;
    twoplayerbutton.visible=false;
    playletterbutton.inputEnabled = true;
    ingame = true;
    sentence.setText(sentencetext);
    playeronescorenum = 0;
    playertwoscorenum = 0;
    playernum=1;
    }
function resetletters () {
    //get random letter strings
    var letter1 = "";
    var letter2 = "";
    for(var  i = 0 ; i <10 ; i++){
        var let1= String.fromCharCode(65 + Math.floor(Math.random()*26));
        var let2= String.fromCharCode(65 + Math.floor(Math.random()*26));
        letter1 += let1;
        letter2 += let2;
        if(let1 === "I"||let1 === "J"||let1 === "L"||let1 === "T"||let1 === "F")
            letter1+=" ";
        if(let2 === "I"||let2 === "J"||let2 === "L"||let2 === "T"||let2 === "F")
            letter2+=" ";
        //save these values into arrays of chars
        letters[i] = let1;
        letters[i+10]= let2;
        
        if( i === 2 ||  i === 5 ||  i === 8 ){
            letter1 += "   "; letter2+= "   ";
       } else {
            letter1 += "    "; letter2+= "    "; }
         }   
    //get random number strings
    var num1 = "";
    var num2 = "";
    for(var  i = 0 ; i <10 ; i++){
        var n1=  Math.floor(Math.random()*10);
        var n2=  Math.floor(Math.random()*10);
        num1 += n1;
        num2 += n2;
        //if(let1 === "I"||let1 === "J"||let1 === "L"||let1 === "T")
        //    letter1+=" ";
        //if(let2 === "I"||let2 === "J"||let2 === "L"||let2 === "T")
        //    letter2+=" ";
        //save these values into arrays of chars
        numbers[i] = n1;
        numbers[i+10]= n2;
        
        if( i === 2 ||  i === 4 ||  i === 6 |  i === 8 ){
            num1 += "              "; num2+= "              ";
       } else {
            num1 += "             "; num2+= "             "; }
    
    }
    lettertiles1.setText(letter1);
    lettertiles2.setText(letter2);
    numbertiles1.setText(num1);
    numbertiles2.setText(num2);
    }
    
function newword () {
    //button.play();
    //check if valid word
    var word = sentencetext;
    if(sentencetext.lastIndexOf(" ") != -1)
        word = sentencetext.substring(sentencetext.lastIndexOf(" ")+1, sentencetext.length);
        
    //check dictionary
    if(game.cache.getText('dictionary').indexOf(' ' + word.toLowerCase() + ' ') > -1){
    alert(word.toLowerCase()+" is a valid word");
    sentencetext += " ";
    sentence.setText(sentencetext);
    newwordbutton.alpha = .2;
    newwordbutton.inputEnabled  = false;
    //extend to new line if too long
    } else {
        //not in dictionary
    alert(word.toLowerCase()+" is not a valid word, GAME OVER!");
    newgamebutton.visible = true;
    oneplayerbutton.visible = true;
    twoplayerbutton.visible = true;
    playletterbutton.inputEnabled = false;
    newwordbutton.inputEnabled = false;
    ingame=false;
    sentencetext="";
    }
    //

}



//when you hit play letter, the computer will reply with his turn as well
//will choose state based on mode (will ask mode at startup)
function playletter () {
    //button.play();
    
    //if player 1, player!
    //check if its a word!
    var word = sentencetext;
    if(sentencetext.lastIndexOf(" ") != -1)
        word = sentencetext.substring(sentencetext.lastIndexOf(" ")+1, sentencetext.length);
        
        //if 1 OR 2 player, it will check you
    //check dictionary to make sure its ok
    if(game.cache.getText('dictionary').indexOf(' ' + word.toLowerCase() ) > -1){
    state = false;
    //add points
    if(playernum === 1)
    playeronescorenum += numbers[index];
    if(playernum === 2 && oneortwoplayer === true)
    playertwoscorenum += numbers[index];
    //advance player if in 2 player mode
    if( oneortwoplayer === true){
    if (playernum === 1)
    playernum=2;
    else if(playernum === 2)
    playernum=1;
    }
    //re set letters 
    resetletters();
    //re enable new word button
    newwordbutton.alpha = 1;
    newwordbutton.inputEnabled  = true;
    }
    else {
        //not in dictionary
    alert(word.toLowerCase()+" is not the start of a valid word, GAME OVER!");
    newgamebutton.visible = true;
    oneplayerbutton.visible = true;
    twoplayerbutton.visible = true;
    playletterbutton.inputEnabled = false;
    newwordbutton.inputEnabled = false;
    ingame=false;
    sentencetext="";
    }
    //if 1 player !!! then the AI goes next!
    if(oneortwoplayer === false && ingame === true){
        
        //check all letters to see if any work as next letter. if so then play it
        var i =0;
        while( i < 20) {
            var sentencetexttemp = sentencetext + letters[i];
            sentence.setText(sentencetexttemp);
            
            //convert to word
    var word = sentencetexttemp;
    if(sentencetexttemp.lastIndexOf(" ") != -1)
        word = sentencetexttemp.substring(sentencetext.lastIndexOf(" ")+1, sentencetext.length);

    //check word
    if(game.cache.getText('dictionary').indexOf(' ' + word.toLowerCase() ) > -1){
        sentencetext =  sentencetexttemp;
        playertwoscorenum += numbers[i];
        break;
        }
           i++; 
            }
        //if no letters work then do a new word and play a random letter
        }
}

}
