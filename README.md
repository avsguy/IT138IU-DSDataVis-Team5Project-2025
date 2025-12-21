Thank you for visiting this repository. This repository is for hosting Team 5's project for the Data Science and Data Visualization course from IU-VNU.
- You may check out the website at https://avsguy.github.io/IT138IU-DSDataVis-Team5Project-2025/

This website would not be possible without Erik Driessen's Scrollama Demo website. 
- Please check their repository here: https://github.com/edriessen/scrollytelling-scrollama-d3-demo/tree/main
- Their demo website here: https://edriessen.com/app/scrollytelling-demo/

We have used this website as a template for this project, but the data visualization and scrollama configurations and logic were written by the team.

(Last Updated: December 21, 2025)

===================================================================================

Tools we used for this project:
- RStudio
- Visual Studio Code with Live Preview Extension
- Python local web server for console logging (a guide on how to set up a local web server is at the bottom of this document.)
- D3.js
- Scrollama
- For transparency, DeepSeek and Copilot are used for debugging.
  
Note: Although LLMs are used, they made frequent mistakes that needed double checking constantly. Without knowledge of Javascript, it is impossible to make a working website with correct information. 

===================================================================================

For people who would like to learn more about scrollytelling, here are some references.

Essentials
- Examples from the Scrollama github repository: https://github.com/russellsamora/scrollama#examples
- A basic introduction on Scrollama: https://pudding.cool/process/introducing-scrollama/
- About sticky: https://pudding.cool/process/scrollytelling-sticky/


Some very beautiful examples
- Global Gender Gap Report 2016: https://projects.two-n.com/world-gender/
- Machine learning example: http://www.r2d3.us/visual-intro-to-machine-learning-part-1/
- Example with the classic Titanic dataset: https://bmdata.co.uk/titanic/
  
  	Github repository of the Titanic website: https://github.com/BMPMS/Titanic_scroll
- Food seasonality analysis with sundial example: https://rhythm-of-food.net/
  
	Details of the website above here: https://truth-and-beauty.net/projects/the-rhythm-of-food


Other useful resources
- Another introduction on Scrollama (with some ways for solving common issues): https://levelup.gitconnected.com/master-the-art-of-scrollytelling-with-d3-js-a-complete-guide-c1e1bc81daa6#bypass
- Another introduction: https://shorthand.com/the-craft/an-introduction-to-scrollytelling/index.html
- Another template you can follow: https://github.com/jackdbd/scrollytelling
- Another template you can follow: https://github.com/vlandham/scroll_demo
- Same as Erik's demo website: https://github.com/cynthialmy/d3-scrollama
- Same as Scrollama's examples: https://github.com/jsoma/simplified-scrollama-scrollytelling
- Very beautiful example: https://flourish.studio/visualisations/scrollytelling/
- Source of where I found some of the useful examples a while ago: https://medium.com/@bryony_17728/titanic-d3-scrolling-story-eaed1b6f5766#bypass
- I have not read this but you may check this out: https://data.europa.eu/apps/data-visualisation-guide/scrollytelling-introduction

The ones below showcase websites that has a lot of scrolling which I personally do not like as it feels tedious, but they are very beautiful. Please check some of them out if this is what you are looking for.
- Other examples: https://shorthand.com/the-craft/engaging-scrollytelling-examples-to-inspire-your-content/index.html#section-Scrollytelling-examples-w4FIfEcBGm
- Other examples: https://www.wix.com/studio/blog/scrollytelling


This is not about scrollytelling but here are some references regarding D3.js.
- https://www.youtube.com/@jsoma
  
Especially, this video: https://www.youtube.com/watch?v=FTJ7do9FXY8

- https://github.com/scotthmurray/d3-book/tree/master
- https://www.d3indepth.com/
- Senior's previous work as reference: https://github.com/santaduytran/IT138IU_DSDV_Coursework
  
Note: d3.nest is deprecated. d3.group is needed for grouping data so a lot of these resources are a bit outdated.
- Essential reading for Grouped Data: https://d3js.org/d3-array/group

About line charts
- https://www.addtwodigital.com/add-two-blog/2022/5/4/rule-31-line-charts-shouldnt-have-too-many-lines

===================================================================================

How to set up a local web server to see your website and console logs
1. Make sure you have installed Python or node.js.
2. Open Command Prompt.
3. Run this:
```
cd [insert path to project folder]
```
Example:
```
cd C:\Users\...\projectfolder
```
5. You can use either of these commands:
```   
python -m http.server 8888
```
or
```
npx http-server -p 8888
```
7. Enter this in your browser
```   
http://localhost:8888/[put the name of your html file].html
```
You should see your website now.

Right-click and click on Inspect. Go to the Consoles tab to see your console logs.
