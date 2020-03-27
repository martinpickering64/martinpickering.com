---
title: "The Fallacies of Distributed Computing"
date: 2017-06-27T10:49:19Z
draft: false
summary: "A collection of notes from various sources."
categories: ["Software"]
tags: ["Design", "Distributed Computing"]

---
# Summary 
Designers bring with them set of assumptions, prejudices and fallacies to their design efforts that if left unchallenged corrupt their design artefacts. In turn, this gives rise to short and long term issues with the realisation of their designs. The fallacies of distributed computing attempts to challenge and disrupt Design and to cause Designers to think more carefully and undertake appropriate self-examination. 

We have settled upon 12 key fallacies, 81 of which are long standing, widely accepted and still contemporary and an additional 4 that reflect more recent situations. 
# Introduction 
In 1994, Peter Deutsch, a Sun Fellow at the time, drafted seven assumptions architects and designers of distributed systems were likely to make, which prove wrong in the long run and so resulted in all sorts of troubles and pains for the solution and architects who made those assumptions. In 1997, James Gosling added another fallacy. The assumptions are now collectively known as the "The eight fallacies of distributed computing".  

Unsurprisingly, this paper by Peter Deutsch did not make him all that popular at Sun as it was orthogonal to their entire marketing direction. As is ever the fate of those who "speak truth unto power". I added a further four whilst I was reviewing the list concerning its current applicability.  

__Assertion__: We hold the following commonly held assumptions to be invariably false: 

1. The Network is reliable 
2. Latency is not a problem 
3. Bandwidth is not a concern 
4. The Network is secure 
5. The topology [of the Network/Solution] will not change 
6. Administrators know what to do 
7. Network Transport costs are not a problem 
8. The Network is homogeneous 
9. The System is atomic  
10. The System is finished 
11. Business Logic should be and can be centralised 
12. Customers/Stakeholders/Business Analysts comprehend the implications of their requirements and assertions 
 
# Definition of terms 
## An Application  
An Application is a software entity deployed as a single executable (it may have dependencies on child Assemblies as well). It usually runs in the Security Context of a single user, that being the User who started and is interacting with the Application. 

## A System 
A System is made up of multiple executables deployed and running as several instances on several machines. A System almost invariably has multiple information sources and so has to deal with issues related to "connectivity". 

__Assertion__: The software engineering classic entitled "Design Patterns2" is actually about creating Applications and not Systems. Whilst certain of the patterns it contains can be useful when designing Systems, most are not. It is also the case that most Software Engineers do not appreciate this and so attempt to inappropriately apply Design Patterns on Systems. 
## Semantic Interoperability 
Semantic Interoperability is the ability of two systems to understand the meaning of the data they exchange. The issues associated with achieving semantic interoperability are many and often very difficult to identify and to solve. It is a kind of "Wicked Problem". [wikidpedia](https://en.wikipedia.org/wiki/Wicked_problem)  

For example, consider two hospital systems, the Administrative system for the A&E Department and the Pharmacy's Prescription Management system. Both systems have the concept of Patient and both have the concept of a Patient's date of birth. So this is all going to turn out well as these systems need to speak with each other about Patients, yes? Let's see… 

The Pharmacy system requires the date of birth in order to meet with its compliance requirements ensuring that drugs are not prescribed inappropriately. The A&E system does not require the date of birth, although it is considered important. The A&E system accepts that some of its patients arrive with no identification, unconscious and with no next of kin present; meaning acquisition of the date of birth is not possible until sometime later on. 

```
AE.Patient.DateOfBirth accepts NULL 
PP.Patient.DateOfBirth does not accept NULL 
```

It is not possible for the Pharmacy Prescribing system to assign a default value for data of birth when it receives a patient request from A&E and so it cannot prescribe medication for an A&E Patient without a date of birth. Nor can the A&E system supply a meaningful default value. The consequences of an inappropriate value is a safety critical, regulatory and legislative concern for all parties. 

Consequently, there is a semantic gap that is un-crossable and prevents the A&E and Pharmacy Prescribing systems from interoperating. 
# The Network is reliable 
All Networks are unreliable. To think anything else is blind optimism. Therefore, a distributed system has to be resilient to network unreliability wherever and whenever it is encountered. 

We have to resist the temptation to believe that we can afford the time to design our own solutions to network unreliability. We need to buy in a solution to this (e.g. reliable messaging). However, those Solutions do not easily service a Request-Response paradigm such as are the underpinnings of HTTP and all that sail in her, e.g. Browser Apps, SPAs, Web Services… 

Introducing solutions for unreliable networks to existing systems that are already based upon Request-Response often entails a lot of refactoring. 
# Latency is not a problem 
Latency is most certainly a problem in Production, but hardly ever a problem during Development. 

Developers use a single computer with small amounts of data and at low levels of contention and concurrency. Therefore, latency issues are hardly ever encountered and hence this fallacy. 

In Production, where there are several machines involved, distributed via a LAN, a WAN or the Internet, latency suddenly becomes a measurable factor. Optimistically, a rule of thumb can be stated that latency is a minimum factor of 10 times greater in Production than in Development. 

This knowledge leads to these principles: 
* Don't cross the network unless you really have to 
* Inter-object chit-chat should be minimised (e.g. avoid Lazy Loading) 
* If crossing the network cannot be avoided, then take all the data that you might need with you (e.g. employ Eager Fetching) 
* Do not apply these principles without thought of the consequences 
# Bandwidth is not a concern 
It is true to say that the potential for available Bandwidth has, is and will continue to grow. Our propensity to make use of Bandwidth always grows much faster (e.g. our ability to produce data and our appetite to consume data). 

Regardless of actual available bandwidth, attempts to transfer lots of data within any given time frame can and is usually frustrated by network congestion. 

Certain software infrastructure products, e.g. Object Relational Mappers or ORMs, have a tendency to overuse eager fetching algorithms resulting in network congestion and a waste of Network Bandwidth. This is because they were designed believing that Bandwidth was not a problem. 

Software Engineers often overestimate available bandwidth. When they are told that "we have a Giga-Ethernet Card", then they hear "Giga" and stop listening. The conclusion drawn is that Giga is a big number and so stop worrying about it. 

1Gbps (bits per second) is equivalent to 128MBps (bytes per second). Allowing for a maximum achievable 40% utilization of Ethernet using TCP we get a maximum bandwidth of 50MBps on our Giga-Ethernet. If the communication involves HTTPS then we lose another 4% of our bandwidth to overheads so we are now at 48MBps. Those 48MBps have to be shared amongst all traffic to all devices in our distributed system. That Giga number is not looking all that big anymore! 

So, Latency is a problem and Bandwidth is also a problem. We find that a solution for long latencies is Eager Loading (but a problem for bandwidth) and that a solution for bandwidth consumption is Lazy Loading (but a problem for latency). As Eager Loading is diametrically opposite of Lazy Loading, we have a dilemma. A possible third way would be to consider designing more than one Domain Model for our Solution that allows us to partition our needs to overcome Latency and Bandwidth issues associated with Eager and Lazy Loading of data across the Network. 

Another solution for Bandwidth problems can be to change our Network Topology enabling us to have several Networks partitioned for different purposes, e.g. for general purpose and for time critical traffic. Such a solution requires the components of our system to be able to route appropriately according to the Network Topology we now have. This can be very difficult to achieve in a System made out of monoliths. Therefore, we start to look towards partitioning those monoliths into smaller, distributable components such as Services or even Micro-Services. 

__Assertion__: most advances in technology have failed to solve our software issues and it still falls to "good design" to solve such issue for us. 
# The Network is secure 
Developers hope that the network is secure. Security Engineers, External Auditors and Regulatory Compliance Processes always regard the Network as being insecure. 

The only certainty about security is that it when and not if a breach will occur. Therefore, plan for a breach and limit the damage that can be caused. This implies that security guarantees cannot be given nor can any guarantee offered be proven to be a guarantee. 

Business Requirements often assert that a Feature, System, Application, Communication must be secure; "Just make it secure", they say. The only response can be: 
1. A security guarantee cannot be given or entered into by us 
2. These are the precautions we will take [followed by a list of precautions]; but still they do not constitute a guarantee 
3. Security cannot be guaranteed  

So, what's the solution? 
* Do a threat analysis 
* Be honest with yourself 
* Balance the cost of mitigation against the cost of materialisation 
* Talk widely about security and the risks 
* Plan for their being a security breach and include Marketing/PR and Legal in the discussions and the consequential, pre-prepared plans to enact when a breach occurs 
* Most security plans and threat models are all about guarding the "Front Door", e.g. access from the Internet. Most of these plans need upgrading to also guard the "Back Doors"4  
# The topology will not change 
Even if our plan was to disallow changes of the topology (which it never is), it will change: 
* When a Server crashes 
* Or a Server is moved 
* Or access to the Internet is lost 
* Or Clients are allowed to connect/disconnect wirelessly 
* Or… a legion of other things that will happen but because you accepted this fallacy as truth you have failed to plan for the eventuality 
 
Other topology changes that can sneak up on you and bite include Publish-Subscribe Patterns carelessly implemented and deployed. For example, WCF supports a feature known as Call-back Contracts where: 
* Clients are able to register with a WCF Service/Server a Call-back URL 
* WCF Service/Server calls back to the registered Client Call-backs 
* A Client crashes during a Call-back 
* The WCF Service/Server still references the auto-generated Client Proxy referencing the crashed Client 
* All future Call-backs for all registered Clients will now be delayed for upwards of 120 seconds by this invalid Client Proxy 
* From an external viewpoint it has all of the hallmarks of a SLOWPOST Denial of Service Attack (the system appears not to be busy, but it is unable to do anything). Yet it is an internally inflicted DOS Attack due to a poor design choice 

Solutions that can help us include: 
* Avoiding hard coding routing choices, such as IP Addresses 
* Avoiding using Configuration Files to dictate Routes, e.g. IP Addresses in Configuration Files 
* Try to use resilient Protocols, such as multi-cast protocols 
* Try to use various forms of discovery to make routing more dynamic 

Regardless, if there are time-based requirements or Service Level Agreements then test the deployed system to discover if they can be met when topology changes occur. 
# Administrators know what to do 
Many deployed Systems rely on an Administrator knowing what to do to keep the system running day after day in the face of the legion of issues and changes that will occur during the Systems' lifetime. 

This can sometimes be true for small Systems on small Networks. There is always that "God Admin"5 who has been there for a long time, is utterly dedicated, exceptionally talented etc. But what happens should they be promoted6 onto other duties? What will happen should the System be successful and grow and require multiple Administrators; will they all be equally capable, all of the time? What will happen now that there are multiple capable Administrators all doing different things all at the same time, are we so certain that any of the Administrators will know? 

As reliance on distributed System grows and especially when they are used to underpin Commercial Models such as SaaS, the prospect of enforced Service Level Agreements becomes an unavoidable reality. 
* An SLA of 99.999% availability translates to a total of 5 minutes planned (or unplanned) downtime per year 
* An SLA of 99.99% availability translates to a total of 50 minutes planned (or unplanned) downtime per year 
* An SLA of 99.99% availability translates to a total of 500 minutes or 8.3hrs planned (or unplanned) downtime per year 

It is also to be expected that whatever the initial SLA promise that the SLA will come under pressure and be forced towards "there will be no interruption to the Service". 

So, the System will need to be on all of the time. Single points of Failure will inevitably occur, but must remain unnoticed by the Users of the Service. Upgrades will need to be undertaken, but they cannot be allowed to disrupt the availability of the Service. New Software Version will be created and deployed, but they must maintain backwards compatibility and be capable of running side-by-side with existing versions. 

Administrators cannot make all of this happen in isolation no matter how god-like they are. 

Candidate solutions include: 
* Creating techniques to pinpoint problems in deployment scenarios and then remove those problems 
* Create the ability to have multiple versions running in multiple locations concurrently 
* Create the ability for Administrators to power down parts of the System without adversely affecting the rest of the System 

__Assertion__: the current "en vogue" term "Continuous Deployment" will result in "continuous unavailability" if the implications of the above are not accounted for in the design of the Solution Software. That is not to say that Continuous Deployment is not a valid aim for a highly available, adaptable, flexible and vibrant SaaS Product. 

# Network Transport costs are not a problem 
To send data over a Network, a procedure known as serialization must first of all be completed. Serialization consumes memory and CPU and does take time to accomplish. Therefore, excessive amounts of serialization that is unwarranted or the result of poor design robs your system of memory and CPU that it could have otherwise used. Alternatively, you could have bought fewer, smaller machines than the ones you ended up buying. 

There are capital and operation costs associated with networks, but they are often not properly accounted for. 

__Assertion__: Once you move your System to the Cloud, your first invoice about your Cloud-based System will tell you the extent of your stupidity when you designed your System. 
# The Network is homogeneous 
Well it used to be, maybe, when all we had to choose from was .Net and Java. Today, we have way more: GO, RUBY, NOSQL and various hacked together HTTP-based stuff (aka REST). 

Regardless of the technologies involved and their influence on this matter, it has always been the case that Semantic Interoperability is key and necessary. Yet it is hard to achieve and requires appreciable budget. 

Unfortunately, I can divine no technologically based solution to achieving Semantic Interoperability. __But I guess the consequence is that job security is guaranteed.__ 
# The System is atomic 
The only way a System is atomic is if it is a monolith and that would mean it is most likely an Application (but even then probably not). The instant that any part of the System becomes distributed or accepts incoming information from an external source it cannot be described as atomic. 

If we accept the fact that our System is not atomic, but is in actual fact a complex network of inter-related discrete components (or super organism), then we will be better prepared for the problems and opportunities created by these many discrete component parts independently evolving and failing from time to time. 
# The System is finished 
Don't make me laugh, it hurts too much. 
# Business Logic should be and can be centralised 
This implies that all decisions and manipulations are contained within a monolith.  

If we agree with this assumption, then how are we to scale out to meet performance needs? Scaling out implies distribution, and even if our distributed component is the entire monolith then our business logic is no longer centralised.  

If we agree with this assumption, then how do we create a robust and resilient deployment? The solutions for robustness and resilience always involve a certain amount of redundancy achieved through replication (i.e. running the same stuff on at least two separate pieces of kit). Now we have our Business Logic distributed again. That's ok you say, we'll run them as an active-passive pair. No good I say, as our SaaS SLA precludes warm standby systems as being a solution for robustness (too much downtime). 

If we allow a monolith to be created, we recreate the associated problems of a monolith: 
* Resistance to change 
* Lack of adaptability and flexibility 
* Brittleness 
# Comprehension of the implications of requirements 
The assumption is that Business Users, Stakeholders and Business Analysts actually comprehend the implications of the requirements they mandate. Well, mostly this is wrong, and it is not their fault or failing. 

It is when we assume that they do have an understanding that we fail them. What begins to occur is akin to the "law of unintended consequences". It is down to us as the people who straddle the domains of business and technology to properly and appropriately intercede. Now that is not all about having conversations along the lines of "well if you really want that thing then you'll end up with..." It is more about re-shaping and re-phrasing the conversations we have whilst we are eliciting the requirements and solution candidates. 

For example, an SLA requirement of 99.999% represents 5 minutes per year. Most Business Users won't appreciate the ramifications of saying "we want a five nines SLA". They will be asking for it because they think, and have been told by others, that it is the "Gold Standard" and who wouldn't want that? It can be achieved, but it is achieved at a cost. If the implication of the Request is explained as having a cost impact, then I would expect the same Business Users to assert "What! Are you saying that your software is unreliable?", and the moment is lost and it is all confrontation from there on in. 

Looking at this another way… 

When Users say what it is that they want, it is usually framed with respect to their current system and procedures. "It is like the old system; but faster, and with better search, and more information on that screen, and…" Business Analysts duly write down and formalize these "requirements" into a structure (use cases, user stories…), and then Developers are told to make it. It usually transpires that Users only know what they didn't want when the Developers deliver exactly what had been asked for. 

_Cue Jedi Mind Trick: These are not the requirements you are looking for_

We need to get the real requirements. We need to probe beyond the often-volunteered veneer: 
* Why do you need this additional screen?  
* What real-world trigger will cause you to open it?  
* Is there more than one trigger?  
* How are they different? 
* etc. 

This is the real work that is actually needed. 

Looking at this again from a different viewpoint.  

Consider a customer service representative on the phone with a customer. This CSR is looking at the customer's details on their screen and wishes to make them a preferred customer, as well as modifying their address, changing their title from Ms to Mrs, changing their last name, and indicating that they're now married. What the CSR doesn't know is that just after opening the screen, the billing department determined that this customer has a track record of not paying their bills; they're delinquent and have now been marked as such. Our CSR submits their changes. 

Should the System accept those changes? 

It could accept some of them, but not the change to preferred, since the customer is delinquent. But writing those kinds of checks is hard; there is a need to look at the differences between the before and after datasets, infer what the changes mean, which ones are related to each other (name change, title change) and which are separate, identify which data to check against, not just compared to the data the user retrieved, but compared to the current state in the database, and then reject or accept.  

Unfortunately for all concerned, the tendency is to reject the whole thing if any part of it does not seem to be right. At that point, the CSR has to refresh their screen to get the up-to-date data, and retype in all the previous changes, hoping that this time it won't fail. 

As the Customer Entity gets larger with more fields, there tends to be more Actors working with the Customer Entity, and the likelihood that something will touch some attribute of any given Customer at any given time is increased and so there are an increasing number of concurrency conflicts. If only there was some way for our CSR to provide us with the right level of granularity and to indicate their intent when modifying data? Well, get better CSRs then. No! 

To capture intent, we need to rethink the design so we can capture their intent. Making a customer preferred is actually a different unit of work to that when indicating that the customer has moved or that they're now married. Using an Excel-like Data Entry Forms doesn't allow for the capture of intent; as we saw above. 

By decomposing the CSR's needs using units of work (let's call them commands), we could even consider allowing our CSR to submit a new command before they've received confirmation on the previous one. We could have a little UI Widget in a side-panel showing the CSR their pending commands, checking them off as good asynchronously as we receive confirmation back from the server, or marking them as bad, if they fail. The CSR could then double-click that failed command to find information about what happened. 

Commands fail most frequently due to breaches of what is often called validation rules. However, validation is different from business rules and we often conflate the two. Validation is able to state a context-independent fact about a command; either a command is valid, or it isn't. Business rules are context dependent. Confusing the two leads to problems in software, comprehension and effectiveness. 

In the CSR example above, the data/command the CSR submitted was valid, it was only due to the billing event arriving earlier that failed the command via a business rule. Had that billing event not arrived when it did, then the command would have been accepted. So, we see that well-crafted client code can fail because valid commands can fail. Often the circumstances for the rejection are related to other Actors changing state relevant to the processing of that command. 

If in the CSR example, the order of the events was reversed then the business outcome would be entirely different. Should it be? Would our CSR/customer understand why and believe it to be reasonable? Isn't more likely that the expectation of the System would be for it to have behaved the same way regardless? In that if the billing event arrived second, shouldn't that revert the preferred customer status back to a regular one?  

Not only that, but shouldn't the customer be notified of this, sending them an email? In which case, why not have this also be the case where the billing event arrived first? And if we've already got a notification model set up, do we really need to return an error to the CSR? It is not like they can do anything about it other than notify the customer that they cannot now be made a preferred customer due to their delinquency; and who wants that conversation! 

So, if we have managed to remove the need to return errors to the CSR, then all the System needs to do is to tell the CSR "thank you, the Customer will receive confirmation via email shortly". We don't even need the UI Widget showing the CSR the pending commands.  

I hope that these examples show that if we, as the experts in both the Business and Technology Domains, think through the implications of various forms of requirements, we can shape and control the implications of the wants and needs of Business Users. If we do not, it is not a failing of the Business Users, their requirement statements or the law of unintended consequences. It is our fault.