---
title: "Creating a new Branch"
date: 2018-01-11T12:49:19Z
summary: "Creaing a new divergence."
draft: false
categories: Software
tags: ["Git"]

---
When a new branch is created a new pointer is created that you can move around. For example, 
create a branch called testing branching from the tip of the master branch:

{{<highlight bash>}}
$ git checkout master
Switched to branch 'master'
$ git branch testing
{{</highlight>}}
 
This creates a new pointer to the same commit you're currently on (in this case the tip of master).

{{<figure src="../figure-1.jpg" caption="Two branches pointing into the same series of commits.">}} 

How does Git know what branch you're currently on? It keeps a special pointer called HEAD. 
In Git, HEAD is a pointer to the tip of the local branch you're currently on. In the above, you're 
still on master as the git branch command only created a new branch; it didn't switch to that branch.
