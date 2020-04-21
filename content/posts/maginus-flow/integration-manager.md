---
title: "Integration Manager Workflow"
date: 2018-08-18T14:49:19Z
draft: false
summary: "Generally found at GitHub and GitLab."
categories: ["Software"]
tags: ["Git", "Maginus Flow"]

---
Because Git allows you to have multiple remote repositories, it's possible to 
arrange a workflow where each developer has write access to their own public 
repository and read access to everyone else's. This scenario often includes a 
canonical repository that represents the "official" project. To contribute to that 
project, a developer creates their own public clone of the project and pushes 
their changes to it. Subsequently, they send a request to the Maintainer of the 
main project to pull in their changes. The Maintainer can then add the repository 
as a remote, test the changes locally, merge them into their own branch, and push 
back to their repository. The process works as follows:

1.	The project's Maintainer pushes to their public repository.
2.	A Contributor clones that repository and makes changes.
3.	The Contributor pushes to their own public copy.
4.	The Contributor sends the Maintainer an email  asking them to pull changes.
5.	The Maintainer adds the Contributor's repository as a remote and merges locally.
6.	The Maintainer pushes merged changes to the main repository.

This is a very common workflow with hub-based tools like GitHub or GitLab, where it's 
easy to fork a project and push changes into your fork for everyone to see. One of 
the main advantages of this approach is that Contributors can continue to work, and 
the Maintainer of the main repository can pull in their changes at any time. 
Contributors don't have to wait for the project to incorporate their changes; 
each party works at their own pace.

Further explanations as to how the Git Integration Manager Workflow actually 
works can be found on The Internet, for example, 
on [git-scm](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows#wfdiag_b).
