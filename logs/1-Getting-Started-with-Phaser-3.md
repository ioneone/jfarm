# Getting Started with Phaser 3

Phaser 3 is a JavaScript game framework. This is a great tool to use because you don't have to worry too much about the graphics rendering and focus more on developing the game. However, there aren't many tutorials that cover the usage of this library, so it's not easy to get started as beginners. 

The goal of this development log is to serve as a comprehensive reference on how to use Phaser 3. I collected some useful resources scatter all over the web into one place so you don't have to suffer. Now, let's dive into the world of game development with Phaser 3!

## Getting Your Hands Dirty

If you haven't already, I recommend you go over the Phaser's [Marking your first Phaser 3 game](https://phaser.io/tutorials/making-your-first-phaser-3-game/part1) tutorial series. You will probably notice that the code you write there is pretty much a spaghetti code. They recently published another tutorial series ([Modern JavaScript Phaser 3 Tutorial](https://phaser.io/news/2020/04/modern-javascript-phaser-3-tutorial-part-1)) that introduce a more modular way to write Phaser 3 application.

## Environemnt Setup

I would like to introduce a more powerful tools for developing a Phaser 3 game. In particular, I want to be able to 

1. Write the code in TypeScript
2. Bundle the source code for deployment
3. Automate the deployment process

Fortunately, someone already made a template for us! You can checkout these templates. 

- [Phaser 3 Parcel TypeScript Template](https://github.com/vickylance/phaser3-parcel-ts-starter)
- [Phaser 3 Rollup TypeScript Template](https://github.com/photonstorm/phaser3-typescript-project-template)

I will be using the parcel template. If everything works, you will  see a plain black screen.

To publish the game on github page, you can use gh-pages. Update ```package.json``` as follows.

```
...
"homepage": "https://ioneone.github.io/jfarm",
"scripts": {
  "start": "parcel src/index.html -p 8000",
  "build": "parcel build src/index.html --out-dir dist --public-url /jfarm/",
  "predeploy": "npm run build",
  "deploy": "gh-pages -b master -d dist"
}
...
```

For more details about how to deploy a github page, you can check [this](https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f) out.

You can also automate the deployment with continuous integration. In particular, you can use Travis CI. Check how to do github page deployment with Travis CI [here](https://docs.travis-ci.com/user/deployment/pages/).

## Next Up

Now that we have a blank screen with everything set up, you can start your game development! If you still need some guidelines and see more examples, check out the next part of this tutorial.

Cheers!