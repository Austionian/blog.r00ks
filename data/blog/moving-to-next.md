---
title: Moving to Next.js
date: '2022-01-16'
tags: ['next-js', 'gatsby', 'JAM stack']
draft: false
summary: 'A trite write up of my journey from Gatsby to Next to here (a blog from a template with Next).'
---

I intially created this blog with [Gatsby](https://www.gatsbyjs.com/) (and it looked completely different than it is now). And I enjoyed the process. Having heard about Gatsby for what seems like years, though never seriously looking into it, I thought it was a meaningful framework to give a try, and what better opportunity than taking my idle Hexo blog to the SSR world.

As I was building it though, looking at other blogs for inspiration, a consistent post I saw by others was the *Why I Migrated from Gatsby to Next* (most of them dated from summer 2020) and here I am crafting my own such post in the third season of this pandemic.

## What I Liked About Gatsby
#### Thoughts on Organization
If there's one thing from a blog's perspective that Gatsby just does better than Next, it's the ability to organize your images and blog posts in the same folder:
```
$ R00T
│   # All blog posts' content
└── content
    └──blog
        └──post-title
            ├──index.md
            └──blog-assets.
```

Coupling assets with their associated posts just makes more organizational sense long term. There's probably a way to get there with Next.js, but I don't think the effort is worth it at this point, compared with the simplicity to get there with Gatsby.

#### Plugin Ecosystem
The plug and play options in the ```gatsby-config.js``` is great for getting a site polished quickly and pretty effortlessly. This is definitely a double edge sword as I'll get to it more later, as I think Gatsby itself has an opportunity to better manager their plugin ecosystem. There seems to be no barrier to entry to being listed on [Gatsby's site itself as a plugin](https://www.gatsbyjs.com/plugins).  

## What I Didn't Like
#### Plugin Ecosystem
Adding more dependencies to a blog makes for a headache down the road. Plus feeling as though I was making this site with plugins wasn't really what I was after. I wanted something were I wrote the code, not download the dependency. With this site being a hobby project, that's where the fun is.

#### Graphql Opinionated
Garphql was fine. Being able to navigate your sites content through the web graphql interface was nice. But it seems a little heavy handed for a blog. It also goes back to the above, I'd rather write the code myself that collates and compiles the data. You can find mine [here](https://github.com/Austionian/blog.r00ks/blob/main/lib/blog.ts). 

## Moving to Next.js
The migration process itself was pretty simple. Next has it's [own post about the process](https://nextjs.org/docs/migrating/from-gatsby). Removing the plugins and figuring out a way to do it myself instead was very satisfying.

I had some trouble getting different [remark](https://github.com/remarkjs/remark) plugins to work. I would add them to my ```getPostData``` function ([here](https://github.com/Austionian/blog.r00ks/blob/main/lib/blog.ts)), compile with no errors, and see that no changes to the output where made. It was frustrating, but again, this just pushed me to figure it out on my own. 

Since I moved to Next, I figured I should give [Vercel](https://vercel.com/) a try. I'm happy I did. It is amazing what it gives you for free. I was using Github Pages orginally and that's pretty awesome, too. But Vercel is also free and seems to have marginally better response times. The preview for pull requests and the free analytics on a single project is really cool, at a price you can't beat.

The fact that deploying is just pushing to ```main``` makes me slightly worried about how easy the whole process is.

## Finding this Template
Having spent a lot of time first iterating through my Gatsby blog and then migrating it to Next, I was never satisfied with the end product. I tinkered all the time with both iterations, but I could never get it to look right. There were places that looked polished and others that always felt off. I ended up spending so much time in the dev tools and CSS just trying to get it look as good as I could... I'm happy to admit though I'm not a designer and I never took the time to really map something out. I just went with the flow and what I liked. I'd see something from someone else's blog and I'd think that'd look cool on mine. It did, but just continued to look incohesive.

I'd think to myself *no one's going to read this anyway, why am I spending so much time on how it looks?* 

Queue this tempate, the [Tailwind Nextjs Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog). It's modeled after Tailwind's own blog and it's great. It gives me all the things I wouldn't have made time to implement myself, like tags, a searchable list of all blog posts, pagination, and looks great. (Comments on comestics never age with ever changing trends in design.)

The best part is I was able to take all the tinkering I've done over the past two iterations of my blog (this is officially the third iteration of *blog.r00ks*) and add them to this already great looking template.

My first step was to make the nav sticky. I've just always liked the feel of a sticky nav, and the little surprise that happens when you first scroll is a great experience. I added a little animation to the theme toggle (and elsewhere), updated the tailwind theme colors, and added the scroll spy table of contents to blog posts. Removed some components and utilities that I won't make any use of. It all feels a little like the previous iterations that I spent so much time on, but now with a twice-removed professional designer's touch.

Thank you, [Tim](https://github.com/timlrx)!

## Jamming forward
My eyes have been opened to the JAM stack and it's incredible what can be accomplished. Both Next and Gatsby give React developers great frameworks to easily create highly performative webapps. Coupled with the fact that it's easy to host these for free, it's undeniably the direction of the Internet.

I certianly plan to build future frontends with Next.