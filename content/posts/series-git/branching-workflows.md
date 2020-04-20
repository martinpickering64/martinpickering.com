---
title: "Branching Workflows"
date: 2018-01-13T09:49:19Z
summary: "What can/should you do with branches?"
draft: false
categories: ["Software"]
tags: ["Git"]

---
 
There are some common workflows that Git's lightweight branching makes possible.

## Long-Running Branches

As Git uses a simple three-way merge, merging from one branch into another multiple times 
over a long period is generally easy to do. This means you can have one or several branches 
that are always open and that you use for different stages of your development cycle; you can 
merge regularly from some of them into others.

Many Git developers use workflow that embraces this approach, such as having only source code that is 
entirely stable in the master branch (possibly only code that has been or will be released). 
Then have another parallel branch named develop or next that they work from or use to test stability 
(this branch isn't necessarily always stable, but whenever it gets to a stable state, it can be merged 
into master). It's used to pull in topic branches (short-lived branches, like branch iss53) 
when they're ready, to make sure they pass all the tests and don’t introduce bugs.

In reality, this ia all about pointers moving up the line of commits being made. The stable 
branches are farther down the line in the commit history, and the bleeding-edge 
branches are farther up the history.

{{<figure src="../figure-3.jpg" caption="A linear view of progressive-stability branching.">}} 

It's can be easier to think about progressive-stability branching as being a number of work 
silos, where the sets of commits graduate to a more stable silo when they become fully tested.

{{<figure src="../figure-4.jpg" caprion="A 'silo' view of progressive-stability branching">}} 

You can keep doing this for several levels of stability. Some larger projects also have 
a proposed or pu (proposed updates) branch that has integrated branches that may 
not be ready to go into the next or master branch. The idea is that your branches 
are at various levels of stability; when they reach a more stable level, 
they're merged into the branch above them. Again, having multiple long-running branches isn't 
necessary, but it's often helpful, especially when you're dealing with very large or complex 
projects. The Linux Kernel Project uses master, topic, next, pu, release and hotfix branches. 
Only the master branch is long-lived, all the other branches have varying lengths of live spans.

## Topic Branches

Topic branches are useful in projects of any size. A topic branch is a short-lived branch 
that you create and use for a single particular feature or related work. In Git it's common 
to create, work on, merge, and delete branches several times a day.

As work is separated into silos where all the changes in that branch have to do with 
that topic, it's easier to see what has happened during code review and such. You can 
keep the changes there for minutes, days, or months, and merge them in when they're ready, 
regardless of the order in which they were created or worked on.

It's important to remember when working with topic branches that they are not necessarily ever 
shared with the Remote Repository or other developers and as such are local branches. 
Whenever you're branching and merging, everything is being done only in your local Git 
repository and no server communication is happening. It is only when you git push your work 
(or allow someone to clone from your repository) that these branches have a life 
beyond your Git repository.

