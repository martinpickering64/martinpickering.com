---
categories: "Software"
date: 2022-01-08T14:40:42Z
summary: "Is serverless a good fit for SAAS?"
tags: ["herald", "Cloud", "SAAS"]
title: "SAAS and Serverless"

---
Whilst thinking about my side-project (_that I have christened_ [_Herald_](../herald)), I have considered several topics and one is concerned with the fit of serverless paradigms and in particular Azure Serverless Functions.

My experience of creating and living with a SAAS Product has shown me that there is a lot of energy expended in trying to anticipate tenant activity and resource demands, whilst at the same time minimising the size of the invoice from the Cloud Service Provider. 

Ideally we want to anticipate the peaks and troughs of tenant resource consumption and adjust our cloud capacity just-in-time. All that I have read about serverless seems to indicate that this is their sweet spot.

Whilst I have done a certain amount of serverless coding and provisioning, I have yet to attempt the creation of a SAAS Product and the surrounding stuff where the emphasis is placed on a serverless implementation.

If Serverless SAAS can be a thing and we are truly without servers then I hope that I don't have to think about scaling policies or what my provisioning experience might be. My Serverless SAAS will essentially consume just what is needed and so I'll only pay for what is needed. Generally, the deployment and the life cycle of managing and operating serverless environments tends to be lower, so rolling out new features, doing canary releases, and such like should get a whole lot easier. Consequently, in the serverless SAAS environment I hope to achieve better operational agility and efficiency. This would allow me to focus more time and energy on the actual IP of the SAAS Product.

Therefore, I want to use Herald as a exploration as to the practicalities of realising a Serverless SAAS environment.