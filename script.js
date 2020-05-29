var $messages = $('.messages-content');
var serverResponse = "";

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
    fetchmsg()

    $('.message-input').val(null);
    updateScrollbar();
}

document.getElementById("mymsg").onsubmit = (e)=> {
    e.preventDefault()
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

function fetchmsg(){

    var url = '/send-msg';
     
     const data = new URLSearchParams();
     for (const pair of new FormData(document.getElementById("mymsg"))) {
         data.append(pair[0], pair[1]);
         console.log(pair)
     }
   
     console.log("abc",data)
       fetch(url, {
         method: 'POST',
         body:data
       }).then(res => res.json())
       .then(r => {
        let response = r.Reply;
        console.log(response);
        if(response.includes("||")) {
            for (text of response.split("||")) {
                serverMessage(text);
                speechSynthesis.speak( new SpeechSynthesisUtterance(text))
            }
        }
        else {
            serverMessage(response);
            speechSynthesis.speak( new SpeechSynthesisUtterance(response))
        }
        })
         .catch(error => console.error('Error h:', error));

}