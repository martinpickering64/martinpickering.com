---
title: "The Forking Workflow"
date: 2018-08-18T13:49:19Z
draft: false
summary: "Daring to be different."
categories: ["Software"]
tags: ["Git", "Maginus Flow"]

---
The Forking Workflow is fundamentally different to other popular Git Workflows. Instead of 
using a single server-side repository to act as the "central" codebase, it gives every developer 
their own server-side repository. This means that each contributor has not one, but two Git 
repositories: a private local one and a public server-side one. The Forking Workflow is 
most often seen in public open source projects.

The main advantage of the Forking Workflow is that contributions can be integrated without 
the need for everybody to push to a single central repository. Developers push to their own 
server-side repositories, and only the Project Maintainer can push to the official 
repository. This allows the maintainer to accept commits from any developer without 
giving them write access to the official codebase.

The Forking Workflow typically follows a branching model, perhaps based on Gitflow Workflow. 
This means that complete feature branches will be purposed for merge into the original 
project maintainer's repository. The result is a distributed workflow that provides a 
flexible way for large, organic teams (including untrusted third-parties) to collaborate 
securely. This makes it an ideal workflow for open source projects.

Explanations as to how the Git Forking Workflow actually works can be found on The Internet, 
for example, on [Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow).
