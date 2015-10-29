![](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/animachine/animachine?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/animachine/animachine.svg)](https://travis-ci.org/animachine/animachine)

#This version is outdated! The new one is availabale [here](https://github.com/animachine/animachine#readme)!

<img src="http://s9.postimg.org/mqolutoxb/amheader.png">

The animachine is a GUI for [GSAP].  
It lets you to create code driven animation using traditional animation tools (like timeline, transformtool, etc).  
You don't need to make any changes to your project to use animachine, just add the [chrome extension][extension] or embed it like any other js library and start animating.

###Why is this needed?
You have great tools to make animations for the web (like Adobe Edge, Google Webdesigner or Animatron) but all of these are only for making sandboxed animations and embedding the boxes somewhere (usually in an iframe). If you need to animate some inner part of your project (ex. when a dialog appears or a game character jumps and walks) it has to be coded by a programmer. When this animation has to be long, artistic or done by somebody who is not a skilled programmer, this work can be tedious or almost impossible which can prevent us from seeing more fine and sophisticated animations on the web.

###How is this working?
In a nutshell, when you click on the extension you'll have an overlay on your page with the animation tools which you'll be familiar with if you ever made animations with programs like Anime Studio, Adobe Edge, After Effects, etc.  
Then you can pick elements from your page and start animating them.
When it's done, you can save your animation as a .js file and include it in your page.  
If you want to change your animation later, just open the animachine, load that .js file and you can continue where you stopped.  

###What is the state of this?
We're working to reach the beta state where you can start using it in your projects, but currently it's in alpha, so things are changing each day and many of the basic features are in draft and the save files from last week probably aren't going to work in the next week. Although you're welcome to play with the [extension], the demos and take the in app tours.

###Demos: [marslanding][demo-marspolip], [argh][demo-argh]
###Tours:  [quickstart][tour-quickstart], [bezier path][tour-bezier], triggers
###Videos:  react.js, WordPress
(currently only for Chrome and Opera)

<img src="http://i.imgur.com/9X2xUfz.png">


**DOM picking**   | ![Dom picking](http://i.imgur.com/LPCj6jp.gif)
-------------:|:-------------
![](http://i.imgur.com/LjBruea.gif) | **bezier path**
**advanced ease editor**   | ![](http://i.imgur.com/fZhQcc6.gif)
![](http://zippy.gfycat.com/IndolentBowedBustard.gif) | **free transform tool**
**inslnie ease editor**   | ![](http://i.imgur.com/hRiwrS2.gif) 
![](http://i.imgur.com/d9K7DpQ.gif) | **timeline navigator**

**Update:** The next version is in progress as these separated modules: 
- [transhand](https://github.com/azazdeaz/transhand)
- [react-matterkit](https://github.com/azazdeaz/react-matterkit)
- [json-vision](https://github.com/azazdeaz/json-vision)
- [spaceman](https://github.com/azazdeaz/spaceman)
- [react-theme](https://github.com/azazdeaz/react-theme)

[extension]: https://chrome.google.com/webstore/detail/animachine/gpnfomkfgajaojpakbkikiekmajeojgd
[demo-marspolip]: http://animachine.github.io/temp/demos/marspolip/
[demo-argh]: http://animachine.github.io/temp/demos/argh/
[tour-quickstart]: http://animachine.github.io/temp/tours/quickstart/
[tour-bezier]: http://animachine.github.io/temp/tours/bezier/
[GSAP]: http://greensock.com/
