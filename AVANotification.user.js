// ==UserScript==
// @name         AVANotification r1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Esteban Reyes
// @inject-into auto
// @include        https://prod-na.ava.robotics.amazon.dev/observer?areas=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.dev
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function main() {
        // Tracking red labels
        // Select the body element or any other element you want to observe
  const targetBody = document.querySelector('body');

  // Create a MutationObserver instance
  const observer1 = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Iterate through added nodes to check for the target class
        mutation.addedNodes.forEach(node => {
          // Check if the added node or its descendants have the target class
            console.log(node);
        });
      }
    }
  });

  // Configuration of the observer
  const config2 = { childList: true, subtree: true };

  // Start observing the target node with the specified configuration
  observer1.observe(targetBody, config2);

        // Audio Context constructor https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Select the node that will be observed for mutations
        const targetNode = document.querySelectorAll('.col')[3];
        // Notification Interval ID
        let intervalID =null;
        let timeoutID = null;
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if(mutation.type === 'childList' && mutation.addedNodes.length > 0){
                    if(mutation.addedNodes[0].className ==="jumbotron"){
                        document.title = " Amazon Virtual Andon"
                        clearInterval(intervalID);
                        clearTimeout(timeoutID);
                        intervalID=null;
                        timeoutID=null;
                    }else{
                        changeTitle();
                    }
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Notification animation
        function changeTitle(){
            if(!intervalID&&!timeoutID){
                document.title = "! Amazon Virtual Andon"
                playSound();
                intervalID = setInterval(()=>{
                    timeoutID = setTimeout(()=>{
                        document.title = "! Amazon Virtual Andon"
                    },500);
                    timeoutID;
                    document.title="Amazon Virtual Andon"
                },1500)
                intervalID;
            }
        }
        // Notification Sound using audioContext using a robotic rhyrhm pattern
        function playSound() {
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.5;
            gainNode.connect(audioContext.destination);
            // Robitic Pattern
            const roboticRhythmPattern = [0,0.2,0.3];
            roboticRhythmPattern.forEach((time, index) => {
                const oscillator = audioContext.createOscillator();
                oscillator.type = 'sawtooth';
                oscillator.connect(gainNode);
                // Alternating between two frequencies
                const frequency = index % 2 === 0 ? 400 : 800;
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.start(audioContext.currentTime + time);
                oscillator.stop(audioContext.currentTime + time + 0.1);
            });
        }
    }

    if (document.readyState === "loading") {
        // The document is still loading, so wait for the DOMContentLoaded event
        document.addEventListener("DOMContentLoaded", main);
    } else {
        // The document is already ready, so run the script immediately
        main();
    }
})();