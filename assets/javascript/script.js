$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyA1CWxH3pP31dXGVnquybdOYXsbArxsdSs",
        authDomain: "saeros-project.firebaseapp.com",
        databaseURL: "https://saeros-project.firebaseio.com",
        projectId: "saeros-project",
        storageBucket: "saeros-project.appspot.com",
        messagingSenderId: "812447571048",
        appId: "1:812447571048:web:41030759721912e2902fdd",
        measurementId: "G-HL5YYDQ1EL"
      };
 
      firebase.initializeApp(firebaseConfig);


    var database = firebase.database();

    var aAudio = new Audio('./assets/sounds/train.mp3');
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#new-train").on("click", function() {
        event.preventDefault();

        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();
        aAudio.play();
        aAudio.volume = 0.2;



        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
        
        var minAway;
        

        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");

        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;

        var minAway = childSnapshot.val().frequency - remainder;

        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");
                
                
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });

function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("digital-clock").innerText = time;
    document.getElementById("digital-clock").textContent = time;
    
    setTimeout(showTime, 1000);
    
}

showTime();
});
var textWrapper = document.querySelector('.ml11 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml11 .line',
    scaleY: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700
  })
  .add({
    targets: '.ml11 .line',
    translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
    easing: "easeOutExpo",
    duration: 700,
    delay: 100
  }).add({
    targets: '.ml11 .letter',
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=775',
    delay: (el, i) => 34 * (i+1)
  }).add({
    targets: '.ml11',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

  $("#frequency").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#new-train").click();
    }
});