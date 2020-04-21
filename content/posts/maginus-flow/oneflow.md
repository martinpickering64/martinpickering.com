---
title: "Git Oneflow"
date: 2018-08-18T16:49:19Z
draft: false
summary: "Its like Gitflow, but simpler."
categories: ["Software"]
tags: ["Git", "Maginus Flow"]

---
Oneflow was conceived as a simpler  alternative to Gitflow. Oneflow's branching 
model is similarly powerful to Gitflow's. It is asserted that everything that 
can be accomplished with Gitflow can be achieved (in a simpler way) with Oneflow. 

Oneflow's premise is to have one eternal branch in your repository (unlike 
Gitflow, which has at least two eternal branches). This brings a number of 
advantages without losing any expressivity of the branching model; the more 
advanced use cases are made possible through the usage of Git Tags.

While the workflow advocates having one long-lived branch, that doesn't mean 
there aren't other branches involved. The branching model encourages using a 
variety of short-lived support branches. These branches being short-lived is 
a crucial point, and their main purpose is twofold: to facilitate code sharing 
and act as a backup. The history is always based on the one infinite lifetime, 
eternal branch.

Oneflow advantages:

- Maintaining a single long-lived branch simplifies the versioning scheme 
  and day-to-day operations that developers have to perform considerably
- Project history is cleaner and more readable, and thus more useful

Oneflow ought to be a drop-in replacement for GitFlow, which means it's 
suitable in all situations that Gitflow is. The main condition that 
needs to be satisfied in order to use Oneflow for a project is that 
every new production release is based on the previous release (Gitflow 
has exactly the same requirement). The vast majority of software projects 
fulfil that condition and web project are often a great fit for Oneflow 
Most open-source projects could be versioned using Oneflow.

Whilst Oneflow is pretty flexible, it's not suitable for every project. 
Oneflow would be a bad fit in basically the same circumstances that 
Gitflow would be. There are 2 main reasons why this might be the case:

1.	When the above condition ("every new production release is based on 
    the previous one") is not satisfied. As an example, take the Python 
    programming language. It has two incompatible versions, 2 and 3. Both 
	of them receive bug fixes and security patches - however, that doesn't 
	mean a new release of Python 3 is based on the commit of the latest 
	release of Python 2. The two versions have diverged, and while they 
	surely share a lot of code, you can't say that one is based on the 
	other (when talking from a pure version control perspective)
2.	If the project needs to maintain multiple simultaneous yet incompatible 
    release versions, then Oneflow won't work out of the box. Elements 
	of the project can probably use Oneflow, e.g. each individual 
	version can be managed using Oneflow.
