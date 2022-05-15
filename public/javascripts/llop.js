function A()
{
    var img = document.getElementById('post-img-1a');
    img.setAttribute('src', 'images/squirtle.gif');
    img.setAttribute("id", "post-img-1");
    if(img == ""){
        
    }
}

function GifReset()
{
var img = document.getElementById('post-img-1');
img.addEventListener('mouseout', function () {
    var imageUrl = img.src;
    img.setAttribute('src', 'images/squirtle.png');
}, false);
img.addEventListener('mouseover', function () {
    img.setAttribute('src', 'images/squirtle.gif');
}, false);
}

function A2()
{
    var img2 = document.getElementById('post-img-2a');
    img2.setAttribute('src', 'images/umbreon.gif');
    img2.setAttribute("id", "post-img-2")
}

function GifReset2()
{
var img2 = document.getElementById('post-img-2');
img2.addEventListener('mouseout', function () {
    var imageUrl = img2.src;
    img2.src = "";
    img2.setAttribute('src', 'images/umbreon.png');
}, false);
img2.addEventListener('mouseover', function () {
    img2.setAttribute('src', 'images/umbreon.gif');
}, false);
}

function A3()
{
    var img3 = document.getElementById('post-img-3a');
    img3.setAttribute('src', 'images/cuy.gif');
    img3.setAttribute("id", "post-img-3");
}

function GifReset3()
{
var img3 = document.getElementById('post-img-3');
img3.addEventListener('mouseout', function () {
    var imageUrl = img3.src;
    img3.src = "";
    img3.setAttribute('src', 'images/cuy.png');
}, false);
img3.addEventListener('mouseover', function () {
    img3.setAttribute('src', 'images/cuy.gif');
}, false);
}