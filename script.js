var $messages = $('.messages-content');
var serverResponse = "";
var otherResponses = ['Okay','Alright','Of Course','Ok','Sure','Absolutely','Fine'];
var genResponses = ['Good','Loved it','Amazing','Great','Very Good','Helpful','Nice','Fine enough','Interesting'];

var checkbox = document.getElementById('checkbox');
checkbox.addEventListener('change',() => {
    $(".chat-title").toggleClass("dark-chat-title");
    $(".messages").toggleClass("dark-messages");
    $(".popupButtons").toggleClass("dark-popupbuttons");
    $(".message-box").toggleClass("dark-message-box");
    $(".fa-microphone").toggleClass("dark-microphone");
});
try
{
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
}
catch(e)
{
    console.error(e);
    var err="Sorry, Your Browser Doesn't Support the Web Speech API. Try Opening This Demo In Google Chrome.";
    err.show();
}

$('#start-record-btn').on('click', function(e){
    recognition.start();
});

recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    document.getElementById("MSG").value = speechToText;
    insertMessage()
}

function listendom(no) {
    console.log(no)
    document.getElementById("MSG").value = no.innerHTML;
    insertMessage()
}

grt_msg = "Hey, I'm AmyBot. I'm your Career Counsellor. Say Hi, to start the conversation!";

$(window).load(function() {
    $messages.mCustomScrollbar();
    setTimeout(function() {
        serverMessage(grt_msg);
    }, 100);
});

function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
  }

function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
        return false;
    }
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    fetchmsg("normal","");

    $('.message-input').val(null);
    updateScrollbar();
}

document.getElementById("mymsg").onsubmit = (e)=> {
    e.preventDefault()
    $('#popupButtons').empty();
    insertMessage();
}

function serverMessage(response2) {
    if($('.message-input').val() != '') {
        return false;
    }
    $('<div class="message loading new"><div class="robot"><i class="fas fa-robot"></i></div><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();

    setTimeout(function() {
        $('.message.loading').remove();
        $('<div class="message new"><div class="robot"><i class="fas fa-robot"></i></div>' + response2 + '</div>').appendTo($('.mCSB_container')).addClass('new');
        updateScrollbar();
    }, 100);
}

function clickFunction(reply) {
    msg = reply;
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    fetchmsg("button",msg);

    $('#popupButtons').empty();
    updateScrollbar();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function showQuickButtons() {
    let returnedArray = shuffleArray(otherResponses);
    document.getElementById('popupButtons').innerHTML = '<button id="button1" class="button" onclick="clickFunction(this.innerHTML)">Yes</button>&nbsp&nbsp&nbsp<button id="button2" class="button" onclick="clickFunction(this.innerHTML)">No</button>&nbsp&nbsp&nbsp<button id="button3" class="button" onclick="clickFunction(this.innerHTML)">' + returnedArray[0] + '</button>&nbsp&nbsp&nbsp<button id="button4" class="button" onclick="clickFunction(this.innerHTML)">' + returnedArray[1] + '</button>';
}

function showQuickButtonsNew() {
    let returnedArray = shuffleArray(genResponses);
    document.getElementById('popupButtons').innerHTML = '<button id="button1" class="button" onclick="clickFunction(this.innerHTML)">' + returnedArray[0] + '</button>&nbsp&nbsp&nbsp<button id="button2" class="button" onclick="clickFunction(this.innerHTML)">' + returnedArray[1] + '</button>&nbsp&nbsp&nbsp<button id="button3" class="button" onclick="clickFunction(this.innerHTML)">' + returnedArray[2] + '</button>&nbsp&nbsp&nbsp<button id="button4" class="button" onclick="clickFunction(this.innerHTML)">' + returnedArray[3] + '</button>';
}

function fetchmsg(type,message){

    var url = 'http://localhost:3000/send-msg';
     
    const data = new URLSearchParams();
    for (const pair of new FormData(document.getElementById("mymsg"))) {
        if (type == 'button') {
            data.append(pair[0], message);
        }
        else {
            data.append(pair[0], pair[1]);
        }
        console.log(pair)
    }
   
     console.log("abc",data)
       fetch(url, {
         method: 'POST',
         body:data
       }).then(res => res.json())
       .then(r => {
        let completeResponse = r.Reply;
        let intent = (completeResponse.split('$>'))[0];
        let response = (completeResponse.split('$>'))[1];
        
        if(response.includes("||")) {
            if (intent.includes('yes')) {
                showQuickButtons();
            }
            else if(intent.includes('good')) {
                showQuickButtonsNew();
            }
            for (text of response.split("||")) {
                serverMessage(text);
                var checkbox1 = document.getElementById('checkbox1');
                if(checkbox1.checked==true)
                {
                    speechSynthesis.speak( new SpeechSynthesisUtterance(text))
                }
            }
        }
        else {
            if (intent.includes('yes')) {
                showQuickButtons();
            }
            else if(intent.includes('good')) {
                showQuickButtonsNew();
            }
            serverMessage(response);
            var checkbox1 = document.getElementById('checkbox1');
            if(checkbox1.checked==true)
            {
                speechSynthesis.speak( new SpeechSynthesisUtterance(response))
            }
        }
        })
         .catch(error => console.error('Error h:', error));

}