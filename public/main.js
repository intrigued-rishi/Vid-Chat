const form = document.getElementById("room-name-form");
const roomNameInput = document.getElementById("room-name-input");
const container = document.getElementById("video-container");
const btn=document.getElementById("mute");

let localParticipant=null;

const startRoom = async (event) => {
  // prevent a page reload when a user submits the form
  event.preventDefault();
  // hide the join form
  form.style.visibility = "hidden";
  // retrieve the room name
  const roomName = roomNameInput.value;

  // fetch an Access Token from the join-room route
  const response = await fetch("/join-room", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName: roomName }),
  });
  const { token } = await response.json();

  //console.log(token);
  //join the video room with the token
  const room = await joinVideoRoom(roomName, token);
  console.log(room);
  localParticipant=room.localParticipant;
  handleConnectedParticipant(room.localParticipant,"red");
  room.participants.forEach((participant)=>handleConnectedParticipant(participant,"yellow"));
  room.on("participantConnected", (participant)=>handleConnectedParticipant(participant,"yellow"));

  //for disabling video
  // room.localParticipant.videoTracks.forEach(publication => {
  //     console.log(publication);
  //     publication.track.disable();
  // });
  

  // handle cleanup when a participant disconnects
  room.on("participantDisconnected", handleDisconnectedParticipant);
  window.addEventListener("pagehide", () => room.disconnect());
  window.addEventListener("beforeunload", () => room.disconnect());
};

const handleConnectedParticipant = (participant,color) => {
        // create a div for this participant's tracks
        const participantDiv = document.createElement("div");
        participantDiv.style.height=50;
        participantDiv.style.width=50;
        participantDiv.style.margin="1rem";
        participantDiv.style.backgroundColor=color;
        participantDiv.setAttribute("id", participant.identity);
        container.appendChild(participantDiv);
    
        // iterate through the participant's published tracks and
        // call `handleTrackPublication` on them
        participant.tracks.forEach((trackPublication) => {
              handleTrackPublication(trackPublication, participant);
        });
    
        // listen for any new track publications
        participant.on("trackPublished", handleTrackPublication);
  };
  
  const handleTrackPublication = (trackPublication, participant) => {
        function displayTrack(track) {
            // append this track to the participant's div and render it on the page
            const participantDiv = document.getElementById(participant.identity);
            // track.attach creates an HTMLVideoElement or HTMLAudioElement
            // (depending on the type of track) and adds the video or audio stream
            participantDiv.append(track.attach());
        }
    
        // check if the trackPublication contains a `track` attribute. If it does,
        // we are subscribed to this track. If not, we are not subscribed.
        //console.log(trackPublication);
        if (trackPublication.track) {
            displayTrack(trackPublication.track);
        }
    
        // listen for any new subscriptions to this track publication
        trackPublication.on("subscribed", displayTrack);
  };
  
  const handleDisconnectedParticipant = (participant) => {
        // stop listening for this participant
        participant.removeAllListeners();
        // remove this participant's div from the page
        const participantDiv = document.getElementById(participant.identity);
        participantDiv.remove();
  };

const joinVideoRoom = async (roomName, token) => {
    // join the video room with the Access Token and the given room name
    try{
        const room = await Twilio.Video.connect(token, {
            room: roomName,
        });
        return room;
    }catch(error) {
            console.log(error);
    }

};


btn.addEventListener("click",()=>{
  localParticipant.videoTracks.forEach(publication => {
      if(publication.isTrackEnabled)
        publication.track.disable();
      else
        publication.track.enable();
  });
})
form.addEventListener("submit", startRoom);