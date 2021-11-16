// This script is used to rotate the favicon in a browser tab between multiple images

// The amount of time between favicon image swaps
const INTERVAL_MS = 2000;

var favicon_images = [
    '/Icon C1.svg',
    '/Icon C2.svg',
    '/Icon C3.svg',
    '/Icon C4.svg',
    '/Icon C5.svg',
],
image_counter = 0; // To keep track of the current image

setInterval(function() {
    // remove current favicon
    if(document.querySelector("link[rel='icon']") !== null) document.querySelector("link[rel='icon']").remove();
    if(document.querySelector("link[rel='shortcut icon']") !== null) document.querySelector("link[rel='shortcut icon']").remove();

    // add new favicon image
    document.querySelector("head").insertAdjacentHTML('beforeend', '<link rel="icon" href="' + favicon_images[image_counter] + '" type="image/gif">');

    // If last image then goto first image
    // Else go to next image    
    if(image_counter == favicon_images.length -1) image_counter = 0;
    else image_counter++;
}, INTERVAL_MS);