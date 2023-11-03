// ==UserScript==
// @name         AVA Notification b0.4
// @namespace    http://tampermonkey.net/
// @version      0.1
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
        // Your script logic goes here
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
        function playSound() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();

            oscillator.type = "square"; // Use a square wave for a robotic sound
            oscillator.frequency.setValueAtTime(500, audioContext.currentTime); // Adjust the frequency
            oscillator.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1); // Adjust the duration (0.1 seconds)
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