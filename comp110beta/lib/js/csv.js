var hours = new Array(7);
    for (var i = 0; i < 7; i++) {
          hours[i] = new Array(24);
    }

$(document).ready(function() {

    var calendar = $("#calendar");
    

    for(var i = 0; i<7; i++){
      for(var j = 0; j<24; j++){
        hours[i][j] = 0;
      }
    }
    
    var calchours = function(start, end, revertFunc, event) {
      var newstartDate = new Date(start);
      var newendDate = new Date(end);
      //potentially delete 
      newstartDate.setHours(newstartDate.getHours()+5);
      newendDate.setHours(newendDate.getHours()+5);

        var title = "Office Hours";
        var eventData;
        if (title) {
          eventData = {
            id: newstartDate,
            oldEnd: newendDate,
            title: title,
            start: start,
            end: end
          };

          $('#calendar').fullCalendar('renderEvent', eventData, true);
          $('#calendar').fullCalendar('unselect');
          if(newendDate.getDay() - newstartDate.getDay() > 0){
            //removes the event based on start time if selected multiple days
              calendar.fullCalendar('removeEvents', eventData.id);
            return;
            //return ends function early, prevents execution if more than one day is selected
          }
          var startDate = new Date(start);
          var endDate = new Date(end);
          var startHour = startDate.getHours();
          var endHour = endDate.getHours();
            for(var i = startHour; i < endHour; i++){
              hours[startDate.getDay()][i+5] = 1;
            }
        
      }
      
      displayHours();
    }
    //increases or decreases size of event - changes date in calendar. 
    var resize = function(event, delta, revertFunc, jsEvent, ui, view){
      
        var newstartDate = new Date(event.start);
        var newendDate = new Date(event.end);
        //poetential delete, timezone effects
      newstartDate.setHours(newstartDate.getHours()+5);
      newendDate.setHours(newendDate.getHours()+5);

        //Plus 5 for timezone, - 9 for array usage
        if(delta.hours()>0){
          for(var i = newstartDate.getHours(); i < newendDate.getHours(); i++){
              hours[newstartDate.getDay()][i] = 1;
            }
        }else if (delta.hours()<0){
          for(var i = newendDate.getHours(); i < (-delta.hours())+(newendDate.getHours()); i++){
              hours[newstartDate.getDay()][i] = 0;
            }
        }
        event.oldEnd = newendDate;
     displayHours();
        
    }
    //deletes previous date from array, adds new one
    var moveEvent = function(event, delta, revertFunc, jsEvent, ui, view){

        for(var i = event.id.getHours(); i < event.oldEnd.getHours(); i++){
              hours[event.id.getDay()][i] = 0;
        }

         event.id = new Date(event.start);
         event.id.setHours(event.id.getHours()+5);
         var endDate = new Date(event.end);
         event.oldEnd = new Date(event.end);
         event.oldEnd.setHours(event.oldEnd.getHours()+5);

        for(var i = event.id.getHours(); i < endDate.getHours()+5; i++){
              hours[event.id.getDay()][i] = 1;
        }
        //display # of hours selected
        $('#calendar').fullCalendar('renderEvent', event, true);
        displayHours();
    }
//deletes dates, removes from array
    var deleteEvent = function(event, jsEvent, view) {
            calendar.fullCalendar('removeEvents', event._id);

             var startDate = new Date(event.start);
              var endDate = new Date(event.end);

            for(var i = event.id.getHours(); i < event.oldEnd.getHours(); i++){
             
              hours[startDate.getDay()][i] = 0;
            }
        displayHours();
    };

//sets up the calendar
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
         center: 'title',
        right: 'agendaWeek'
      },
      defaultView: "agendaWeek",
      selectable: true,
      selectHelper: true,
      allDaySlot: false,
      eventOverlap: false,
      minTime: "09:00:00",
      maxTime: "21:00:00",
      eventResize: resize,
      eventDrop: moveEvent,
      eventConstraint: {
        start: '10:00',
        end:   '20:00'
      },
      slotDuration: {
        hours: 1
      },
      eventBackgroundColor:  "#000",
      eventBorderColor: "#000",
      eventClick: deleteEvent,
      select: calchours,
      editable: true,
      eventLimit: true // allow "more" link when too many events
     
    });
//get rid of default title
    $(".fc-center").html("");
    $('#calendar').fullCalendar('option', 'height', 665);
    



  //The below code executes when you click "generate csv"
  $('#getHours').click(function(){
    var gender ="FILL IN GENDER";
    var level = "FILL IN LEVEL";
    $("input[name*=gender-choice-]:checked").each(function() {
         gender = $(this).val();
      });
    $("input[name*=level-choice-]:checked").each(function() {
         level = $(this).val();

      });
    var name = $("input#name").val();
    var hoursCapacity = $("input#hours").val();
      //CSV Generation
      var pom = document.createElement('a');
      var text = "Name:,"+name+",,,,,,\n";

      text = text + "Gender (enter M or F):,"+ gender +",,,,,,\n";
      text = text + "Capacity:," + hoursCapacity + ",,,,,,\n";
      text = text + "Level (1 - in 401; 2 - in 410/411; 3 - in major),"+level+",,,,,,\n";
      text = text + ",0. Sun,1. Mon,2. Tue,3. Weds,4. Thu,5. Fri,6. Sat\n";

      for(var j = 0; j<24; j++){
        text = text + j;
          for( var i = 0; i<7; i++){
            text = text + "," + hours[i][j];
          }
          text = text + "\n";
      }
      $("pre").html(text);

      var filename = $("input#onyen").val();
      pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
      pom.setAttribute('download', filename);
  //simulates a click to download the file
      if (document.createEvent) {
          var event = document.createEvent('MouseEvents');
          //uncomment these to download CSV!
   //       event.initEvent('click', true, true);
   //       pom.dispatchEvent(event);
      }
      else {
          pom.click();
      }




  });
  var displayHours = function(){
    var counter = 0;
    for(var i = 0; i<7; i++){
      for(var j = 0; j<24; j++){
        if (hours[i][j] == 1){
          counter = counter + 1;
        }
      }
    }

    $("#numHours").html(counter + " hours");

  };


  $("input#onyen").on('keyup paste', function() {
    var string = "";
    $("input#1").prop("checked", false);
    $("input#2").prop("checked", false);
    $("input#3").prop("checked", false);
    $("input#M").prop("checked", false);
    $("input#F").prop("checked", false);
    $("input#hours").val("");
    if($("input#onyen").val().length > 2){
      var temponyen = $("input#onyen").val();
      //Post request to retrieve github csvs given the username 
      $.post( "getSched.php", { onyen: temponyen}, function(){
      })//data is the returned csv!
        .done(function( data ) {


          $("#calendar").fullCalendar('removeEvents');
          if (data == ""){
            return;
          }
          $("pre").html(data);
          string = data;
          var stringArr = string.split("\n"); //breaks up csv into lines
          var name = stringArr[0].slice(stringArr[0].indexOf("Name:,")+6, stringArr[0].indexOf(",,,,,,"));
          $("input#name").val(name);

          //TODO FIX THIS
          var gend = stringArr[1].slice(stringArr[1].indexOf("F):,")+4, stringArr[1].indexOf(",,,,,,"));
          

          $("input#"+gend).prop("checked", true); //checks the appropriate gender



          $("input#hours").val(stringArr[2].slice(stringArr[2].indexOf("Capacity:,")+10, stringArr[2].indexOf(",,,,,,")));

          var level = stringArr[3].slice(stringArr[3].indexOf("in major),")+10, stringArr[3].indexOf(",,,,,,"));
         

          $("input#"+level).prop("checked", true);
             var serverHoursArray = csvparse(string.substr(string.indexOf("0,0,0,0,0,0,0,0"), string.length), ",");
                 //subtract the current day from the current day to get the 0th day. Then add the day 
                 //for each time you go through the loop
          

              //clears out hours, prep for import
               for(var i = 0; i<7; i++){
                    for(var j = 0; j<24; j++){
                     hours[i][j] = 0;
                    }
                }
                //imports new hours from csv into hours
              for(var i = 9; i < 22; i++){
                for(var j = 0; j < 7; j++){
                  var tempstr = serverHoursArray[i][j+1];
                  hours[j][i] = parseInt(tempstr);
                }
              }

              //If you hit a 1, set start time, then turn on boolean, 
              //when you hit 0 or end then you reacched the end of an event, so set end and
              //render the event event. Continue to end. 
              
              for(var i = 0; i<7; i++){
                var startedEvent = false;
                var tempstartDate = new Date();
                var tempendDate = new Date();
                var startDate = null; 
                var endDate = null;
                    for(var j = 0; j<24; j++){
                        if (hours[i][j] == 1 && startedEvent == false){
                            startedEvent = true;

                            //set day to whatever i is. 
                            tempstartDate.setDate(tempstartDate.getDate()-tempstartDate.getDay() + i);
                            tempstartDate.setHours(j);
                            tempstartDate.setMinutes(0);
                            tempstartDate.setSeconds(0);
                            startDate = tempstartDate;
                            //set start time
                        }else if(hours[i][j] == 0 && startedEvent == true){
                            

                            startedEvent = false;
                            tempendDate.setDate(tempendDate.getDate()-tempendDate.getDay() + i);
                            tempendDate.setHours(j);
                            tempendDate.setMinutes(0);
                            tempendDate.setSeconds(0);
                            endDate = tempendDate;
                            //set end time
                            //render event
                            //start is not a date
                            var eventFromServer = {
                            id: startDate,
                            oldEnd: endDate,
                            title: "Office Hours",
                            start: startDate,
                            end: endDate
                            };


                            $('#calendar').fullCalendar('renderEvent', eventFromServer, true);
                            $('#calendar').fullCalendar('unselect');
                            //need to create new dates when multiple events per day 
                            tempstartDate = new Date();
                            tempendDate = new Date();

                        }else if(hours[i][j] == 1 && startedEvent == true){
                            //count hours by 1
                        }
                    }
                }
                displayHours();
               
        })
        .fail(function(data){
          alert("fail");
        })
        .always(function() {

        });
    }
  

    // your code here
  });

  var listArr = (function(){
    var string = "";
    for(var i = 0; i < hours.length; i++){
      string = string + hours[i]+"\n";
    }
    alert(string);
  });
});






//Code below found online
 var csvparse =  (
function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
                ){
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[ 3 ];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }
        // Return the parsed data.
        return( arrData );
    });


