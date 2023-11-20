// ==UserScript==
// @name         AVANotification b2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
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
        // Audio Context constructor https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
         // Select the body element or any other element you want to observe
        const targetNode = document.querySelector('body');
        // Notification Interval ID
        let intervalID =null;
        let timeoutID = null;
        // Create a MutationObserver instance
        const obs = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Iterate through added nodes to check for the target class
                    mutation.addedNodes.forEach(node => {
                        // Check if the added node or its descendants have the target class
                        if(node.className === 'custom-card-big card' || node.className === 'col'){
                            const notificationValue = extractStrongValues(node.innerHTML);
                            // check if notification has 2 values;
                            notificationValue.length === 2?createNotification(notificationValue):null;
                            changeTitle();
                            playSound();
                        }else if(node.className === 'jumbotron'){
                            document.title = " Amazon Virtual Andon"
                            clearInterval(intervalID);
                            clearTimeout(timeoutID);
                            intervalID=null;
                            timeoutID=null;
                        }
                    });
                }
            }
        });

        // Configuration of the observer
        const config = { childList: true, subtree: true };

        function extractStrongValues(htmlString) {
            const strongValues = htmlString.match(/<strong>(.*?)<\/strong>/g);
            const extracted = strongValues ? strongValues.map(tag => tag.replace(/<\/?strong>/g, '')) : [];
            return extracted;
        }

    function createNotification(notificationData) {
        // Check if the browser supports the Notification API
        if ('Notification' in window) {
            // Request permission for notifications
            Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                // Create a notification with title and subtitle
                const title = notificationData[0];
                const subtitle = notificationData[1];
                const notification = new Notification(title, {
                body: subtitle,
                icon: './favicon.ico'
                });
                
                // Handle notification click (if needed)
                notification.onclick = function(event) {
                // Handle notification click
                // event.target refers to the notification itself
                console.log('Notification clicked');
                };
            } else {
                console.log('Permission for notifications denied.');
            }
            });
        } else {
            console.log('Notification API not supported.');
        }
    }

    function checkNotificationPermission() {
    if (Notification.permission === 'granted') {
        // Permission has already been granted
        console.log('Notification permission already granted');
    } else if (Notification.permission !== 'denied') {
        // If the permission has not been denied, request permission
        Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted');
            // Permission has been granted
            // You can now send notifications
        } else {
            console.log('Notification permission denied');
            // Permission has been denied
            // You may want to handle this case accordingly
        }
        });
    } else {
        // Permission has been denied by the user
        console.log('Notification permission denied by user');
        // Handle this case, perhaps by displaying a message to the user
    }
    }
    // Start observing the target node with the specified configuration
    obs.observe(targetNode, config);
    checkNotificationPermission();
            // Notification animation
    function changeTitle(){
        if(!intervalID&&!timeoutID){
            document.title = "! Amazon Virtual Andon"
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