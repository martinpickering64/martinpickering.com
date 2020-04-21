---
title: "Git Feature Branch Workflow"
date: 2018-08-18T11:49:19Z
draft: false
summary: "Never break the master branch"
categories: ["Software"]
tags: ["Git", "Maginus Flow"]

---
The heart of the Feature Branch Workflow is that all development should take place in 
a dedicated branch instead of the master branch. This encapsulation makes it easy 
for multiple developers to work on a given feature without disturbing the 
main codebase. It also means the master branch will  never contain broken code; a 
huge advantage when working with continuous integration environments.

Encapsulating feature development also makes it possible to leverage pull requests, 
which are a way to initiate discussions around/about a branch. They give other 
developers the opportunity to sign off on a feature before it gets integrated into 
the official project. Or, if a developer gets stuck in the middle of a feature, 
they can open a pull request asking for suggestions from their team. The point is, 
pull requests make it incredibly easy for your team to comment on and 
review each other's work.

The Git Feature Branch Workflow can be incorporated into other high-level Git Workflows. 
Git Feature Branch Workflow is branching model focused, meaning that it is a guiding 
framework for managing and creating branches; other workflows are more repository 
focused. The Gitflow, and Git Forking Workflows traditionally use a Git Feature 
Branch Workflow for their branching models.

Explanations as to how the Git Feature Branch Workflow actually works can be 
found on The Internet, for example, on 
[Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow).
