---
title: "Dictator and Lieutenants Workflow"
date: 2018-08-18T15:49:19Z
draft: false
summary: "Open-Source anyone?"
categories: ["Software"]
tags: ["Git", "Maginus Flow"]

---
This is a variant of a multiple-repository workflow. It's generally used by huge projects with 
hundreds of Collaborators; one famous example being the Linux kernel. Various Integration 
Managers are in charge of certain parts of the repository; they're called Lieutenants. All the 
Lieutenants have one Integration Manager known as the Benevolent Dictator. The Benevolent Dictator 
pushes from his directory to a reference repository from which all the Collaborators need to 
pull. The process works like this:

1.	Collaborators work on their topic branch and rebase their work on top of master. The 
    master branch is that of the reference directory to which the Dictator pushes.
2.	Lieutenants merge the Collaborators' topic branches into their master branch.
3.	The Dictator merges the Lieutenants' master branches into the Dictator's master branch.
4.	Finally, the Dictator pushes that master branch to the reference repository so 
    the other Collaborators can rebase on it.

This kind of workflow isn't common, but can be useful in very big projects, or in 
highly hierarchical environments. It allows the project leader (the Dictator) to 
delegate much of the work and collect large subsets of code at multiple points 
before integrating them.

Further explanations as to how the Git Integration Manager Workflow 
actually works can be found on The Internet, for example, 
on [git-scm](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows#wfdiag_c).
