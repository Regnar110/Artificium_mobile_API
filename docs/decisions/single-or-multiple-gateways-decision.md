---
status: "proposed"
date: 2024-11-06
decision-makers: Regnar110
---

# Should I implement single or separated web socket gateways to handle chat and friendList user socket connections

## Context and Problem Statement

Chat and friendList are different entites as socket conenctions in terms of user application usage. Is a good way to handle such socket connections via single gateway keeping in mind that chat connection can be pretty much heavier for server, more resource-hungry and more frequently used than friend list connection. Does single gateway be easy to maintain when handling multiple connection entities?

## Considered Options

* single gateway
* separated gateway

## Decision Outcome

Chosen option: "single gateway", because one gateway keep thing simplier which makes easier to maintain socket related modules in such low user count application. It is also possible to allow servers to scale with single gatewaye in such way:
                                                     +----------+  
                                              +------| App:Chat |  
+--------+                   +---------+      |      +----------+  
| Client |-----internet------| gateway |------+      (port 8081)  
+--------+                   +---------+      |        
                               (port80)       |      +----------+  
                                              +------| App:App2 |  
                                                     +----------+  
                                                     (port 8082)  
													 
Chat module and friend list module can later be moved to dedicated socket applications, and gateway would fulfill the role of proxy which redirects us to different socket apps on different ports (port-share)

<!-- This is an optional element. Feel free to remove. -->
### Consequences

* Good, because this solution is easier to maintain in temrs of small portfolio application
* Good, beacuse it can scale up later if needed
* Good, because single gateway allow us to centralize authentication process for multiple user connection types
* Good, possible lower latency for smaller applications
* Good, no need for gateways redirection or no need to specify a certain gateway on server or client. 
* Bad, because event if it's possible to scale up with single gateway it can be better to create
separated gateways for resource-hungry socket connections
* Bad, because it may require more work in terms of keeping chat and friend list socket modules properly        separated from each other  
* Bad, because latency can be higher when application get larger where gateway also would be used more frequently (by both socket modules)

<!-- This is an optional element. Feel free to remove. -->
### Confirmation

{Describe how the implementation of/compliance with the ADR can/will be confirmed. Is the chosen design and its implementation in line with the decision? E.g., a design/code review or a test with a library such as ArchUnit can help validate this. Note that although we classify this element as optional, it is included in many ADRs.}

<!-- This is an optional element. Feel free to remove. -->
## Pros and Cons of the Options

### {title of option 1}

<!-- This is an optional element. Feel free to remove. -->
{example | description | pointer to more information | …}

* Good, because {argument a}
* Good, because {argument b}
<!-- use "neutral" if the given argument weights neither for good nor bad -->
* Neutral, because {argument c}
* Bad, because {argument d}
* … <!-- numbers of pros and cons can vary -->

### {title of other option}

{example | description | pointer to more information | …}

* Good, because {argument a}
* Good, because {argument b}
* Neutral, because {argument c}
* Bad, because {argument d}
* …

<!-- This is an optional element. Feel free to remove. -->
## More Information

{You might want to provide additional evidence/confidence for the decision outcome here and/or document the team agreement on the decision and/or define when/how this decision the decision should be realized and if/when it should be re-visited. Links to other decisions and resources might appear here as well.}