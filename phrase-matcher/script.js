var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var correct = 0;
var total = 0;
var phrases = [
'A boy had a pet fly',
'He named him Fly Guy',
'He could say the boy\’s name',
'One day he went to school with Buzz',
'He learned about reading and phonics',
'He learned about art',
''
];

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');
var testBtn = document.querySelector('button');


var i=0;
function testSpeech() {

  var phrase=phrases[i];
  phrase = phrase.toLowerCase();
  var phraseNum=phrase.length;
  i ++;

  if (i > 6) {
  var r=confirm("문장을 모두 발화하셨습니다~! 다시하려면 ok 버튼을 누르세요!");
  if (r== true) {
    phrasePara.textContent = '학습할 문장';
    resultPara.textContent = '정/오답 확인';
    resultPara.style.background = 'rgba(0,0,0,0.2)';
    diagnosticPara.textContent = '실제 발화한 문장';
    location.reload();

  } else {
    window.location.href="../index.html";
  }
  }

  testBtn.disabled = true;
  testBtn.textContent = '녹음 인식 중';

  // To ensure case consistency while checking with the returned output text
  phrase = phrase.toLowerCase();
  phrasePara.textContent = phrase;
  resultPara.textContent = '정답 여부 분석';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = '음성 인식 결과';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  recognition.onresult = function(event) {

   var speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = '음성인식 결과: ' + speechResult + '.';

    var phraseSplit=phrase.split(" ");
    var phraseLen=phraseSplit.length;
    var j=0;
    var array = speechResult.split(" ");
    for (var k=0; k<array.length;k++) {
    var word = array[k]; //발화 문장에 있는 개별 단어 담기
    var result = phrase.includes(word); //발화 문장 단어 원본 문장과 비교
     if (result) {
       j=j+1
     }

    }

    console.log(result);
    console.log(j);
    console.log(phraseLen);

    var score = Math.round((j/phraseLen) *100);
    console.log(score);


    if(speechResult === phrase) {
      resultPara.textContent = '짝짝짝~ 정확하게 발음했습니다~!';
      resultPara.style.background = 'lime';
      correct ++;
      total ++;

    } else {

      resultPara.textContent = '제대로 발음이 인식되지 않았어요.  원어민 음성 일치율은 '+ score+'% 입니다~!';
      resultPara.style.background = 'red';
      total ++;
    }

 var totalValue=document.getElementById("total");
 totalValue.innerHTML = "응답한 문장 수/전체 문장 수 : " + total +" / 6" ;
 var correctValue=document.getElementById("correct");
 correctValue.innerHTML = "맞힌 문장 수 : " + correct;


  console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = '새로운 문장 낭독하기';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = '새로운 문장 낭독하기';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }

  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}

testBtn.addEventListener('click', testSpeech);
