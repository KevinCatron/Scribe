$(document).ready(function(){

  // initialize the clock and display
  var clock = new Clock();
  clock.displayCurrentTime();
  clock.displaySessionTime();
  clock.displayBreakTime();
  clock.displaySessionCount();

  // add event listeners
  $("#pomodoro-time-down").click(function() {
    clock.changeSessionTime("subtract");
  });
  $("#pomodoro-time-up").click(function() {
    clock.changeSessionTime("add");
  });
  $("#break-time-down").click(function() {
    clock.changeBreakTime("subtract");
  });
  $("#break-time-up").click(function() {
    clock.changeBreakTime("add");
  });
  $(".start").click(function() {
    clock.toggleClock();
  });
  $(".circle-restart").click(function() {
    $(".circle-restart").css("display", "none");

    clock.reset();
  });


  // Clock contains all the properties and methods to run a pomodoro clock
  function Clock() {

    var _this = this, // needed to pass 'this' to setInterval
        timer, // reference to the interval
        active = false, // is the timer running?
        type = "Session", // type -- "Session" or "Break"
        startTime = 1500, // stores the starting value of timer
        currentTime = 1500, // current time on the clock in seconds
        sessionTime = 1500, // stores the session time in seconds
        breakTime = 300, // stores the break time in seconds
        sessionCount = 0, // stores the number of session that have passed
        startAudio = new Audio("https://jpk-image-hosting.s3.amazonaws.com/pomodoro-app/audio/start.mp3"),
        endAudio = new Audio("https://jpk-image-hosting.s3.amazonaws.com/pomodoro-app/audio/end.mp3");

    // formatTime returns a friendly formatted time string
    function formatTime(secs) {
      var result = "";
      var seconds = secs % 60;
      var minutes = parseInt(secs / 60) % 60;
      var hours = parseInt(secs / 3600);
      function addLeadingZeroes(time) {
        return time < 10 ? "0" + time : time;
      }
      if (hours > 0) result += (hours + ":");
      result += (addLeadingZeroes(minutes) + ":" + addLeadingZeroes(seconds));
      return result;
    }

    // method to add/substract 60 seconds from session time
    // only works if timer is not active
    this.changeSessionTime = function(str) {
      if (active === false) {
        this.reset();
        if (str === "add") {
          sessionTime += 60;
        } else if ( sessionTime > 60){
          sessionTime -= 60;
        }
        currentTime = sessionTime;
        startTime = sessionTime;
        this.displaySessionTime();
        this.displayCurrentTime();
      }
    }

    // method to add/subtract 60 seconds from break time
    // only works if timer is not active
    this.changeBreakTime = function(str) {
      if (active === false) {
        this.reset();
        if (str === "add") {
          breakTime += 60;
        } else if (breakTime > 60) {
          breakTime -= 60;
        }
        this.displayBreakTime();
      }
    }

    // inserts the current time variable into the DOM
    this.displayCurrentTime = function() {
      $('.timer').text(formatTime(currentTime));

    }

    // inserts the session time variable into the DOM
    this.displaySessionTime = function() {
      $('#pomodoro-time').text(parseInt(sessionTime / 60));
    }

    // inserts the break time variable into the DOM
    this.displayBreakTime = function() {
      $('#break-time').text(parseInt(breakTime / 60));
    }

    // inserts the session count variable into the DOM
    this.displaySessionCount = function() {
      if (sessionCount === 0) {
        $('.session-count').html("<h2>Pomodoro Clock</h2>");
      } else if (type === "Session") {
        $('.session-count').html("<h2> Session " + sessionCount + "</h2>");
      } else if (type === "Break") {
        $('.session-count').html("<h2>Break!</h2>");
      }
    }

    // toggles the timer start/pause
    this.toggleClock = function() {
      if (active === true) {
        clearInterval(timer);
        $('.start').text('START');
        active = false;
        $(".circle-restart").css("display", "block");
      } else {
        $('.start').text('PAUSE');
        $(".circle-restart").css("display", "none");
        if (sessionCount === 0) {
          sessionCount = 1;
          this.displaySessionCount();
          startAudio.play();
        }
        timer = setInterval(function() {
          _this.stepDown();
        }, 1000);
        active = true;
      }
    }

    // steps the timer down by 1
    // when current time runs out, alternates new Session or Break
    this.stepDown = function() {
      if (currentTime > 0) {
        currentTime --;
        this.displayCurrentTime();
        if (currentTime === 0) {
          if (type === "Session") {
            currentTime = breakTime;
            startTime = breakTime;
            type = "Break";
            this.displaySessionCount();
            endAudio.play();
          } else {
            sessionCount ++;
            currentTime = sessionTime;
            startTime = sessionTime;
            type = "Session";
            this.displaySessionCount();
            startAudio.play();
          }
        }
      }
    }

    // reset the timer
    this.reset = function() {
      clearInterval(timer);
      active = false;
      type = "Session";
      currentTime = sessionTime;
      sessionCount = 0;
      $('.time-start').text('Start');
      this.displayCurrentTime();
      this.displaySessionTime();
      this.displaySessionCount();
    }
  }




});
