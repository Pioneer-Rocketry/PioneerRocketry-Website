# Link: [Production](https://pioneerrocketry.com)
## Pioneer-Rocketry-Webpage
 This Repo is to house the new webpage for the pioneer rocketry club. (2024)
Admin Page is Designed to allow the webpage to be updated without any code knowlege.
this uses a seperate api to do so.

## How This All Works
I have realized that i may not be able to maintain this github forever, so i will list out how the entire workflow works.
When any change is mafe to the webpage itself, the worker is cloned to a temp dir within the workflow, the static webpage files, a.k.a all files within this repo, are coppied into the static folder within the worker. this allows the worker to serve the static pages and the api shares the same url as the webpage. 

## ToDo
[ ] - Move Page get to This worker
[ ] - Finish module updater
[ ] - Finish page updater
[ ] - add module selector for pages
[ ] - add module verification to pages after they are added
[ ] - Remove Excess code in auth.js and possibly move it to tools.js
[ ] - Redo all calendar.js code and move it to tools.js

## Page Layout Credits
Escape Velocity by HTML5 UP
html5up.net | @ajlkn
Free for personal and commercial use under the CCA 3.0 [license](html5up.net/license)