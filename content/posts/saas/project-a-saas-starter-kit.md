+++
categories = "Software"
date = 2021-12-05T14:09:18Z
summary = "My current side project"
tags = ["Cloud", "Azure", "SAAS"]
title = "Project: A SAAS Starter Kit"

+++
I have had the pleasure to create a small number of _limited_ SaaS Projects/Products in the past. They have been fine, even great, but the process of doing so has left me somewhat unsatisfied. I was left thinking there was:

* too many manual day-to-day procedures to keep the lights on
* provisioning new tenants was not as quick as it could be
* updates to the deployed application and/or the Platform Services it was dependent on was overly manual and fraught with risks
* always starting a new Product from scratch. But surely the SAAS-specific parts of the Product are more or less common or independent of the Product being served?

With the recent launch of Microsoft's .Net6 and therefore my need to update and re-skill myself, coupled with my desire to bring my Azure skills and experience up to similar levels as my Oracle OCI ones, I got to thinking...

_Maybe I can combine all of these threads?_

My idea was to create a SAAS Starter Kit. Created out of .Net6, targeting Azure and delivering a platform which could be used by a SAAS Product Team as a kick starter. The _Product Creators_ could concentrate more on their Product and give less attention to the SAAS-specific surrounding _gubbins_, without needing to compromise on quality or outcome.

## Kit Contents

* A multi-tenant reference architecture
* A sample/example Product built using the reference that is ready for immediate deployment and exploration
* Documentation providing advice for on-boarding additional tenants, elastic scaling of the deployment, billing, monitoring etc.

## The Reference Architecture

Use of .Net6 and Azure is assumed.

The kit provides the resources and services to be able to create and launch an end-to-end SaaS Product including microservices, data stores, tenant and identity management needed to underpin the Product and manage the deployed platform.

A sample SaaS Product illustrates the various extension points incorporated in the reference architecture that Product Teams use to embed their own SaaS Product to make it all come alive and service their needs.

## Breakdown

The things I expect it to deliver include:

* A SaaS Management Portal
* A Developer Portal
* A SaaS Provider App for on-boarding new Tenants
* Several microservices
  1. Onboarding
  2. Tenant Catalog
  3. Identity
  4. Billing
  5. Order
  6. Customer
  7. Logging
  8. Notification
* Monitoring and telemetry
* DevOps services and practices

## Use of Azure

I expect the following Azure Services will be involved:

* VCN
* Azure Serverless Functions
* API Management
* Azure Active Directory for B2C
* App Services
* Azure SQL
* Azure Cosmos DB
* Azure Storage (Blobs and Queues)
* Azure Key Vault

Other stuff that may be called upon:

* Azure Kubernetes Service
* Event Grid
* Redis
* Azure SQL Elastic Pools
* Azure DNS
* Azure Front Door

## Let's Begin

So, that's the idea.

To get started with this it looks like I have a lot of research to do in the first instance. That obviously will involve multiple spikes and experiments, discarded ideas and more than a tad of frustration.

First it needs a name...