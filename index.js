
var first = new Audio();first.src = 'sound/1stSentence.mp3';
var second = new Audio();second.src = 'sound/2ndSentence.mp3';
var third = new Audio();third.src = 'sound/3rdSentence.mp3';
var fourth = new Audio();fourth.src = 'sound/4thSentence.mp3';
var fifth = new Audio();fifth.src = 'sound/5thSentence.mp3';
var sixth = new Audio();sixth.src = 'sound/6thSentence.mp3';

function myFunction1() {document.getElementById("signal").style.display = "block";}
function myFunction2() {document.getElementById("signal").style.display = "none";}

const recordAudio = () =>
      new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        const stop = () =>
          new Promise(resolve => {
            mediaRecorder.addEventListener("stop", () => {
              const audioBlob = new Blob(audioChunks);
              const audioUrl = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioUrl);
              const play = () => audio.play();
              resolve({ audioBlob, audioUrl, play });
            });

            mediaRecorder.stop();
          });

        resolve({ start, stop });
      });

    let recorder = null;
    let audio = null;

    const recordStop = async () => {
      if (recorder) {
        audio = await recorder.stop();
        recorder = null;
        document.querySelector("#record-stop-button").textContent = "Record";
        document.querySelector("#play-audio-button").removeAttribute("disabled");
      } else {
        recorder = await recordAudio();
        recorder.start();
        document.querySelector("#record-stop-button").textContent = "Stop";
      }
    };

    const playAudio = () => {
      if (audio && typeof audio.play === "function") {
        audio.play();
      }
    };
