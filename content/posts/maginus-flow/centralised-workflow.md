---
title: "The Centralised Workflow"
date: 2018-08-18T10:49:19Z
draft: false
summary: "Are you transitioning from a Centralised Version Control System?"
categories: Software
tags: ["Git", "Maginus Flow"]

---
The Centralised Workflow is a Git workflow often used by teams transitioning from a 
CVCS (like SVN or TFS) as it involves the fewest number of conceptual leaps for the 
team members. The Centralised Workflow uses a central repository (just like TFS does) to 
serve as the single point-of-entry for all changes to the project. Instead of trunk, 
the default development branch is called master and all changes are committed into this branch. 
This workflow doesn't require any other branches besides master.

The transitioning to a distributed version control system (aka Git) may seem like a 
daunting task for such teams, but by adopting the Centralised Workflow the team is not 
forced into wholesale change to its existing workflow (or concepts) to be able to take 
advantage of using Git. The team can develop projects in almost the exact same way as 
they do with TFS.

However, using Git and the Centralised Workflow presents a few advantages over CVCS. First, 
it gives every developer their own local copy of the entire project. This isolated environment 
lets each developer work independently of all other changes to a project; they can add commits 
to their local repository and completely forget about upstream developments until it's 
convenient for them.

Secondly, it gives you access to Git's robust branching and merging model. Unlike CVCS, 
Git branches are designed to be a fail-safe mechanism for integrating code and sharing 
changes between repositories. The Centralised Workflow is similar to CVCS in its utilization 
of a remote server-side hosted repository that developers push and pull form. Compared to 
other Git Workflows, the Centralised Workflow has no defined pull request or forking patterns. 
A Centralised Workflow is generally better suited for smaller teams migrating from a CVCS.

Explanations as to how the Centralised Workflow actually works can be found 
on The Internet, for example, on 
[Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows#centralized-workflow).
