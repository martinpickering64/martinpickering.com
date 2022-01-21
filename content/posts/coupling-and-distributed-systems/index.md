---
title: "Coupling and Distributed Systems"
date: 2017-06-26T10:49:19Z
draft: false
summary: "Collected notes from various sources "

categories: Software
tags: ["Design", "Distributed Computing"]
---

# Summary 

__Assertion__: Excessive re-use of anything leads to tight coupling. 

Loose Coupling is an often used term to justify a particular design decision. It is also 
stated as a core value or principle. It turns out it is a largely meaningless term. It is 
useful as a trigger for our curiosity. But what do we mean and what are we actually trying 
to achieve when we refer to this term? 

We have found that coupling consists of five principle types: 

1. [Efferent](https://en.oxforddictionaries.com/definition/efferent) Logical Coupling, 
2. [Afferent](https://en.oxforddictionaries.com/definition/afferent) Logical Coupling, 
3. Platform Coupling, 
4. Temporal Coupling 
5. and Spatial Coupling. 

We have also found that coupling is an interrelated, multi-dimensional problem. 

We have settled on Coupling being a vitally important concept to understand 
in our world of software and distributed systems. We have identified several 
candidate solutions for us to use to manage our coupling levels. We have decided 
that what's most important is to recognise and to create the right amount of 
coupling to suit what we are attempting to achieve. 

# Introduction 

Software Engineering principles from way back, when Software Engineering was born as a discipline3 introduced the concepts of Coupling and Cohesion. They were designed to help Programmers get to grips with the concepts of Modular Software Structure and what was good and what was bad. Those measures are not often heard about now, but they still hold true when considering software design. 

More recently, a term has been often quoted called _loose-coupling_ and that to be loosely coupled is a valiant, even virtuous, aim. Yet now that I think about it, most references to loose-coupling and most circumstances one might see it being used: 

> Do we actually know what loose-coupling actually means when we use it the term or we see it being used; let alone what our Customers might be thinking? 

I suspect that we don't. 

Now as such a lot will depend upon the concept of loose-coupling in realising any new SaaS entity, I came to the conclusion that this doubt was too high a risk with too drastic a consequence not to attempt to do something about it. That is what this document is about. It is a part of my attempt to define and so bring certainty to the term loose-coupling so that we can use it and apply it accurately, with confidence. 

The remainder of this document has been structured along the following lines: 

1. I define what the concept of coupling is for modern, design of object orientated software 
2. Now I try to illustrate what might be the right amount of coupling to aim for 
3. Next, there are several more types of coupling when one looks at the nature of distributed systems and so I define these other forms as well and illustrate solutions for poor coupling of the various types 
4. Finally, I try to summarise the journey taken and bring it all together 

# So what is coupling anyways? 

Logical Coupling in Object Orientated Software Design is a measure of the dependencies that exist in the way the software has been structured. If Object X is dependent upon Object Y then we can say that logical coupling exists between X and Y. 

So what? 

By knowing that coupling exists and the extent of the coupling then any plans to modify the software can be risk assessed in a more knowledgeable and certain way, e.g. if X and Y are not coupled then it is likely either X and Y can change without impacting each other. The greater the degree of coupling that does exist then the more likely any change is likely to have impact in areas other than those directly affected by the change.  

Similarly, knowing about the extent and location of coupling can be used to inform a risk-based approach to Quality Assurance such that the limited amount of QA Resource available can be directed to best effect towards the more risky areas, i.e. those areas that exhibit unusually high or low values of coupling. 

In actual fact, it is useful to look upon logical coupling as being of two distinct sub-types: 

1. Afferent Coupling (Ca): the count of incoming dependencies 
2. Efferent Coupling (Ce): the count of outgoing dependencies 

## But what is loose coupling? 

Loosely coupled entities exhibit the right amount of coupling for their needs and no more. 

After performing static analysis of a System containing four Classes the following measures of Ca and Ce coupling were obtained: 

{{< figure src="table-ca-ce-coupling.png" >}}

From these results we are able to determine that: 

* The design of Class D is so loosely coupled that either D is useless, or else D is in actual fact the entire system 
* The design of Class A exhibits high (in relation to its peers) Ca. We can conclude that any changes planned for Class A carry a high risk of causing disruption to any or all of the Classes that depend upon Class A 
* The design of Class B exhibits high Ce. We can conclude that Class B is at a high risk of becoming destabilised due to any planned changes occurring in any of the Classes upon which it is dependent 
* The design of Class C exhibits both Ca and Ce to the same extent. Although lower than either Class A's Ca or Class B's Ce, Class C also represents a risk. Any Class upon which Class C is dependent can de-stabilise Class C. In turn de-stabilisation of Class C can de-stabilise any of the Classes that are dependent upon Class C. So Class C represents a possibility of causing a domino effect or a cascade of problems 

The above has not helped us to determine what the right amount of coupling is, nor when we are achieving an appropriate level to be able to say that loose coupling exists.  

It all depends upon the actual context. 

A coupling measure like that exhibited by Class A (high Ca and low Ce) is typical of Classes that represent Framework Code or that implement cross-cutting concerns. As such we would expect Class A to be very stable, slowly changing and not at all volatile. Class A needs careful implementation and testing, because failures in Class A will impact all over the place. If the purpose of Class A was not Framework Code, or there was a Framework Class with a low Ca measure then we would be detecting a bad smell. 

The coupling pattern of Class B (low Ca and high Ce) are very typical of Presentation Layer Classes. All too often though this pattern indicates a Class whose design breaches the Single Responsibility Principle and so is a bad smell. Another term for a Class B type class is a _God Class_, again a bad smell and the more there are then the more it all smells. About the only good thing we can say is that should Class B become unstable then it is likely that only Class B will be affected. 

If Class B is a _God Class_ then the pattern exhibited by Class C is that of a _Chaos Monkey_. Should Class C become unstable (which is likely given its Ce measure) then it will result in many others being affected (due to its Ca measure). 

What about Class D. Well it is irrelevant. Delete it. 

Whilst we have said that a high Afferent Coupling measure can be ok in the right context, it is typically the case that high Efferent Coupling is a bad thing. 

## Measuring Logical Coupling 

Consider the following software design: 

{{< figure src="example-software-design.png" >}}

Class X is dependent on Class Y by virtue of Class X accessing or using a single Method or Property belonging to Class Y. Class A is dependent upon Class B because it uses five different Methods or Properties belonging to Class B. 

Given the above, how do we count the values of Ca and Ce for Classes X, Y, A and B? Do we count the number of different Classes involved in the relationship or do we count the number of different access methods (a Method call and a Property call) utilised? Is there a difference between a Method call and a Property call? 

There is no hard and fast rule, but there is a useful convention...  

Afferent Coupling is measured by how many things I could break. 

> B can only break A and Y can only break X so the afferent coupling measures for B and Y are both 1. 

Efferent Coupling is measured by how many things may break me. 

> A can be broken by B in five different ways, so A's efferent coupling measure is 5. Whilst X can only be broken by Y in one manner so its efferent coupling measure is 1. 

Static Code Analysers (like NDepend) can produce Ca and Ce measures for us and some static analysers possess a Constraint Query Language that allow you to build tests associated with their analysis results and place those tests as part of the Continuous Integration Build Pipeline. This offers the opportunity to fail a build if inappropriate static analysis results are discovered (e.g. a suspect logical coupling measure). 

# How much coupling is enough? 

We have already seen that the amount of logical coupling displayed by a system is determined by how you choose to count it. We also have seen that the difference between a good level and a bad level of coupling is dependent upon the context of what has been measured. So it doesn't look like this question can actually be answered other than by _it depends_ and our judgement is affected by the context, our experiences and our prejudices. 

A useful guide exists in the form of the following chart, which is plotting Ca and Ce. It is attempting to show the relative Ca-Ce ratios one might expect to see for Classes assigned different types of responsibilities: 

{{< figure src="coupling-graph.png" >}}

Whilst considering the extent of logical coupling displayed by a System's components, beware of coupling that can grow unseen, usually via shared resources, as they will hide the coupling in your design that would have otherwise been apparent. An example of such a shared resource is a database. 

{{< figure src="shared-resource.png" >}}

Loose coupling minimizes the Afferent and Efferent Coupling but always pays attention to the context in which it exists. Zero coupling is impractical. Above all, we should not be mechanistic about how the amount of coupling is adjusted or how we judge what is a good or a bad amount of coupling. 

# Platform Coupling 

When considering distributed systems, there are more types of Coupling than just Logical Coupling. Platform Coupling also exists. 

* Also known as _interoperability_ 
* Using a protocol or technology only available on a single platform 

One of the SOA Principles is that of _share Contract and Schema and not Class or Type_. This is an attempt to limit the extent of Platform Coupling 

## Potential Solutions for Platform Coupling 

__Assertion__: The first rule of distributed computing is __DON'T__. 

Assist with interoperability by selecting over-the-wire forms that promote interoperability (but may sacrifice some performance). For example, textual representation of data: 

* XML without an XSD - and use XPATH to extract from 
* XML with an XSD - can help with development productivity 

Note: the above alternatives trade-off between version headaches (of the XSD) and development productivity headaches (what does the XML all mean). 

Using a standards-based protocol for interconnectivity. The most common one selected being HTTPS. We must not forget about alternatives such as SMTP, SFTP, UDP and TCP. 

Other standards that may exist include SOAP, WSDL and REST. Be cautious about REST in respect of performance and scale, for example, Google Query Services has a HTTP/REST API, but Google resource limit the API and they require you to move to their proprietary GDATA API to achieve scale. 

Java and .Net bridges, like JNBridge, allow Java code to exist in-process on the .Net CLR. They also allow the reverse to occur, i.e. for .Net code to be in-process on the JVM. Interoperability achieved without needing to resort to a network-call. 

# Temporal Coupling 

The processing time of an operation on Service A is dependent upon the processing time of an operation of Service B. 

{{< figure src="temporal-aspect.png" caption="figure 1 Temporal Coupling Aspect" >}}

## Potential solutions for Temporal Coupling 

__Assertion__: Distributed system always require decisions to be made based upon stale data. If the business requirements advocate for a position whereby decisions can never be made based upon stale data then the solution design cannot involve distribution. 

Figure 1 shows us high temporal coupling between Service A and Service B. If we decompose those interactions a little more we also see that their interaction also involves acting upon stale data. Unfortunately, the presence of stale data is somewhat hidden within the design and so is often overlooked. 

{{< figure src="temporal-aspect-detail.png" caption="figure 2 a more detail view of Temporal Aspect Coupling" >}}

It is possible to refactor the design of Service A and Service B to reduce the amount of temporal coupling between them and to make plain the presence of stale data. By making the use of stale data visible it is more possible to validate the decision to do so. The Publish/Subscribe Pattern has been used to help refactor the design. 

{{< figure src="reduced-temporal-coupling.png" caption="figure 3 with reduced Temporal Coupling" >}}

There are many designs that can be refactored using the Publish/Subscribe Pattern (Pub/Sub for short). However, there are some deployment options that make Pub/Sub difficult to utilise. Consider the System shown in Figure 4, Service A and Service B represent or are allocated a number of different responsibilities. In addition, Service B is a Service not under our control (it is from a third-party). Now consider that we are re-factoring our System to reduce its temporal coupling and introducing Pub/Sub. When we come to re-look at the responsibility and requirements of our System, they indicate that the service boundaries should be as depicted by Service X and Service Y. 

As we can't change Service B, or re-factor System Design around Service X and Service Y, using Pub/Sub cannot be done. So what are our alternatives? 

* Give up and stick with what we have. Not acceptable; we were re-factoring the design because the amount of temporal coupling we experienced was causing serious problems 
* Change the requirements to avoid the need for the Service X and Service Y boundaries. Possible, but unlikely 
* Introduce two-phase commits. Using distributed transactions we could create a Service X and Service Y facade around Service B. Therefore, we get our refactored design and the rest of the System will work as we want it to. There are costs when introducing distributed transactions: 

  - A new, additional form of complication 
  - Throughput performance is likely to be lower than otherwise 
  - An increase in resource contention is likely 

{{< figure src="conflict-over-responsibilities.png" caption="figure 4 a conflict over responsibilities" >}}

The hallmarks to look out for that will suggest the introduction of Pub/Sub to reduce temporal coupling and will cause the least number of complications whilst doing so are: 

A potential Subscriber must be able to make decisions based on somewhat stale data 

There must exist a strong division of responsibility between a potential Publisher and its Subscribers 

Only one Subscriber should have the responsibility of publishing a given kind of event 

# Spatial Coupling 

{{< figure src="spatial-coupling-aspect.png" caption="figure 5 Spatial Coupling Aspect" >}}

If Server 2 were to fail, could Service A [on Server 1] automatically continue by using Service B on Server 3? 

## Potential solutions for Spatial Coupling 

Any given code ought not to need to know where its co-operating Services are on the network. This can be achieved by delegating communications to a lower software level; an example of which is the [Service Agent Pattern](https://patterns.arcitura.com/soa-patterns/design_patterns/service_agent).  

Even using Service Agents still leaves the question as to how the agents know where to send messages to. Load Balancing is an often utilised technique that means that a Requester talking via a Load Balancer does not actually know where their Request has been routed and therefore which server is handling their Request. 

Routing is first of all a logical concept and then becomes a physical realisation. Load Balancers are the physical manifestation. Service Agent is an example of logical routing, but from a Service Client's point of view. The server-side equivalent would be the Service Layer Facade. 

Using the Service Agent, client code could instruct the Agent to route according to its instructions. Alternatively, the Service Agent could be left to discover the routing to use, e.g. from some configuration data that maps message type to destination (known as command-centric routing). 

Document-centric routing is an alternative to command routing. The message contents contains information that instructs the Service Agent as to how the message needs to be routed. 

# Coupling: a summary 

The concept of Loose-Coupling is more than just a slogan, but it is difficult to define and to quantify absolutely. 

By looking at the various types of coupling and their inter-relationships we have discovered that coupling is a multi-dimensional problem. 

{{< figure src="coupling-is-multi-dimensional.png" caption="figure 6 coupling is multi-dimensional" >}}

The Publish/Subscribe Pattern impacts most types of coupling by lowering the extent of coupling except for spatial coupling, which is almost always increased. Messaging technologies, such as AMQP, might prove useful to lessen the degree of spatial coupling introduced by Pub/Sub. 

Finally, let's not get to myopic about Loose Coupling as it turns out it is a meaningless term. Leaving us with the notion that there is the right amount of coupling to suit the demands of what we are attempting to achieve. 

