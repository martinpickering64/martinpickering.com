---
title: "Gitflow"
date: 2018-08-18T12:49:19Z
draft: false
summary: "The most popular Git Workflow."
categories: Software
tags: ["Git", "Maginus Flow"]

---
Gitflow Workflow is a Git Workflow design that was first published and made popular by 
[Vincent Driessen at nvie](http://nvie.com/posts/a-successful-git-branching-model/) 
and is now probably the most popular  Git Workflow. Gitflow 
defines a strict branching model, designed around the Project Release. As such, it 
provides a robust framework for managing larger projects.  

Gitflow is suited for projects that have a scheduled release cycle. Gitflow doesn't 
add any new concepts or commands beyond what's required for the Feature Branch Workflow. 
Instead, it assigns very specific roles to different branches and defines how and when 
they should interact. In addition to feature branches, it uses individual branches for 
preparing, maintaining, and recording releases. Advantage is still taken of Git Feature 
Branch Workflow, such as pull requests, isolated experiments, and more efficient collaboration.

In addition to the abstract Gitflow ideas, there is a more tangible git-flow toolset 
available that integrates with Git to provide a set of specialized Gitflow Git 
command line tool extensions that ease the implementation and day-to-day usage of 
Gitflow by the team.

Explanations as to how the Git Feature Branch Workflow actually works can be found 
on The Internet, for example, on 
[Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) 
or via its original source 
[Vincent Driessen's Blog Post: A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/).
