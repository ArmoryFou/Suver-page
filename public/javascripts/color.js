var colors = ['red', 'green', 'blue', 'yellow', 'pink', 'purple'];
var currentIndex = 0;
setInterval(function () {
    document.getElementsByClassName("text-left").style.background = "red";

   if (!colors[currentIndex]) {
       currentIndex = 0;
   } else {
       currentIndex++;
   }
}, 100);