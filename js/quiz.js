const questions = [

{

question:"Who is the President of India?",

options:[
"Droupadi Murmu",
"Narendra Modi",
"Amit Shah",
"Yogi Adityanath"
],

answer:0

},

{

question:"Capital of India?",

options:[
"Mumbai",
"Delhi",
"Chennai",
"Kolkata"
],

answer:1

}

];

let currentQuestion = 0;

const question = document.getElementById("question");

const options =
document.querySelectorAll(".option");

const nextBtn =
document.getElementById("nextBtn");

function loadQuestion(){

question.innerHTML=
questions[currentQuestion].question;

options.forEach((btn,index)=>{

btn.innerHTML=
questions[currentQuestion].options[index];

});

}

loadQuestion();

nextBtn.onclick=function(){

currentQuestion++;

if(currentQuestion<questions.length){

loadQuestion();

}else{

alert("Quiz Finished");

}

}