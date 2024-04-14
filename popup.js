function doThing() {
    document.getElementById('result').innerHTML = "<p>Hello World</p>";
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fakeNewsButton').addEventListener('click', doThing, false);
})
