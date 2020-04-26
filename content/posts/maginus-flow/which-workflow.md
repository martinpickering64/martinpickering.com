---
title: "Which Workflow?"
date: 2018-08-20T16:49:19Z
draft: false
summary: "So which is the Git Workflow for me?"
categories: Software
tags: ["Git", "Maginus Flow"]

---
When considering which Git Workflow to use one is 
naturally drawn to three leading candidates:

1.	Gitflow: because it is the most popular and everybody can't be wrong - can they?
2.	Oneflow: because it is said to address the shortcoming of Gitflow - well, that's good
3.	The workflow used by the Git Open Source Project (git.git for short); because 
    surely the authors of Git know a thing or two about using it – don't they? 

## Why not Gitflow?

There are several reasons why Gitflow is not going to work well for my circumstances:

1.	The reality of Gitflow is it results in a dirty looking Commit History that 
    is incredibly difficult to follow for anything more than a trivial project 
	with very few released versions. This is argued by the author of Oneflow and 
	by Contributors to Git itself
2.	I work on Products that carry the legacy of Customer specific Variants and so consequently 
    does not uphold the requirement that "every new production release is based on 
	the previous one" as there are multiple, simultaneously released versions that 
	are incompatible with each other

The first reason makes me disinterested in using Gitflow due to my limited capability 
to understand complexity (simpler is always better for me) and the second point 
just seals the deal as it effectively says that only a fool would proceed.
 
{{<figure src="../figure-1.jpg" caption="Gitflow history after just a small number of iterations.">}}

{{<figure src="../figure-2.jpg" caption="Zoomed in on part of the Gitflow history to reveal the detail.">}}

## Why not Oneflow?

An obvious point would be if not Gitflow, then why not Oneflow. After all, 
Oneflow ought to overcome the issues related to a dirty history. That is 
its main reason for existence after all. The answer is that 
point 2 (see Gitflow above) still kills us with regards to Oneflow.

I would also have concerns that little regard is given within Oneflow for 
having many, parallel feature developments and extended periods required 
to stabilize my Products due to a set of changes being attempted. The 
git.git workflow does expend quite a lot of effort on this point; 
obviously it needs to because it is a big Open Source Project with 
many Contributors attempting many, many pushes.

## Why not git.git?

There are several reasons why git.git won't work for Maginus OMS:

- It is not an Open Source Project, so requiring an Integration Workflow 
  utilizing the role Maintainers seems to add complication and a bottleneck
- Git.git does not detail well enough the interaction with topics/feature 
  branches (as Oneflow does) such that Commit History remains in a clean 
  and intelligible state
- Git.git does not address our needs in respect of Customer specific Variant releases

## So which one?

I believe that what I need is a combination of the detailed 
Topic Branch policies of Oneflow (to keep the Commit History clean), the 
higher-level Branching Policy of git.git (to deal with parallel development, 
stabilization, release and hot fix related quandaries). Additionally, I need to
give some thought as to how to sort out work related to Customer specific Variants.

I call this mash-up Maginus Flow. Not a very inventive name, but it'll do for now.
