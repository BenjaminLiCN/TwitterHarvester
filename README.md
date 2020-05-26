# TwitterHarvester
> 2020 COMP90024 Cluster and Cloud Computing Group Project 

### **Website**
---
[Tweets Analysis amid COVID-19 Pandemic in Australia](http://172.26.131.49/)
> *(UniMelb [Cisco VPN](https://studentit.unimelb.edu.au/wireless-vpn/vpn) is required)*

[Architechture and Deployment](https://www.youtube.com/watch?v=KxHfEahMRIs&feature=youtu.be)

### **Project Description**
---
Starting from 30 January 2020 when WHO declared the COVID-19 outbreak was a public health emergency of international concern, COVID-19 has caused significant social and economic disruption. As the COVID-19 pandemic and its far-reaching implications continue to unfold globally and, in our community, many people have been dealing with the unforeseen challenges because of self-isolation, social distancing and public area closure etc. Those challenges have been making people naturally experience a wide range of thoughts, feelings and reactions which are expressed via social platforms in various ways.  For instance, in Australia, a huge volume of text data is created on Twitter, which gives us a good way to understand people’s emotions change amidst the pandemic chaos and possibly provide insights for experts or governors to make policies to provide health and wellbeing support for their people.

In this project, we built a Twitter Harvesting Application with a range of analytics scenarios including analysing the emotions change and hot topics discussed among people at state and suburb level. As all the team members are living in Victoria and we have intimate understanding of how people’s life is changed in the uncertain time, the suburbs data in VIC is our main focus. Beyond this, we also analyse the emotions change and hot topics at state-level for other 7 states in Australia.

### **System Features**
---
In this project, we explored how people’s emotions and the topics discussed on Twitter are changed on a daily basis as the number of confirmed cases increases. We collected tweets with geo coordinates posted from January 2020 to mid-May 2020 in Australia, and a large number of tweets in Victoria during this period.
- The first scenario is to investigate whether people are expressing their stressed or overwhelmed feelings on twitter texts as the lockdown continues and the number of cases increases.
- The second scenario is to understand how the topics in a community change as the restrictions are upgraded to different stages.
Users can check the emotion distribution and up to 15 hot-topics from the map visualization in each of the states or VIC suburbs on a daily basis. Alternatively, under the `Analyse` tab, after selecting a suburb/state, users can see a line chart which shows the area’s emotions change and hot topics change throughout the whole period.

_(As the Victoria state government published_ [_the number of confirmed cases_](https://www.dhhs.vic.gov.au/media-hub-coronavirus-disease-covid-19) _of each local government area starting from 4th Apr, the appearance on the map before this date might be grey.)_

### **Architecture**
---
The diagram below shows the architecture design of the whole system. In a nutshell, this architecture fully utilises the computing resources of the 4 allocated instances. Firstly, all instances are deployed with the Django service which retrieves data from the database for the client. All HTTP requests are almost evenly distributed by Nginx which does load balancing. Secondly, CouchDB is deployed on all instances and is partitioned into 4 shards and the cluster is managed by instance 0 - the coordinator node. Thirdly, the cluster status is monitored by Grafana, whose data source is Prometheus that collects other instances’ data using Node Exporter. In addition, all services are running in containers which ensures scalability. We will discuss each part of the architecture in detail and give our reasons for such choices. Finally, single point-of-failure is eliminated as far as the database and backend service are concerned.
![](https://github.com/chuangw46/TwitterHarvester/blob/master/Images/architecture.png)
#### 1. CouchDB Cluster
All CouchDB services are running on a Docker container mapping necessary ports (5984, 4369, 9100-9200) to the host. It is important to understand that the CouchDB cluster does not distinguish master or slave nodes and the cluster is set up by configuring a coordinator node which is instance 0 in this example. The process looks like this:
1. All CouchDB enables its cluster function, waiting to be connected by the coordinator.
2. Coordinator adds remote nodes as it’s known nodes.
3. Coordinator uses Erlang daemon (EPMD) to reach for those nodes via port 4369.
4. Upon “cluster_finish” action, port 9100-9200 are allocated to establish TCP connections with each remote node.
Therefore, we have the following two lists when querying for the membership of the cluster:
```
{
  "all_nodes": [
    "couchdb@server1.test.com",
    "couchdb@server2.test.com",
    "couchdb@server3.test.com"
  ],
  "cluster_nodes": [
    "couchdb@server1.test.com",
    "couchdb@server2.test.com",
    "couchdb@server3.test.com"
  ]
}

```
Where cluster_nodes are the ones supposed to be in the cluster and all_nodes are the ones that can be reached. These two should have identical members for a cluster to be correctly configured.
#### 2. Containerisation
Everything running on this cluster is in a container, including the cluster monitoring tools. This decision is carefully made considering this application should be equipped with great scalability. One of the advantages of using containers is that it can simulate a cluster environment even if there is just one computing instance. Therefore, this architecture can be applied to the ones with multiple instances.
Both Dockerfile and Docker-compose are used to set up containers. And there are a few more aspects of Docker we have explored throughout our development of this system:
- Port mapping
Ensures hosts and containers have corresponding ports so the service can be exposed as we intended.
- Docker logs
Useful to trace the issues occurred in containers as well as the activities such as bulk data being put into the database.
- Container inspection
Each container has a minimum operating system that is just enough for the image running on. Using the exec command allows us to check if everything is configured the way we want.
- Mounting
Mounting host files to the container, which is very useful to modify configuration files or synchronise the log files from the host machine.

#### 3. Load Balancing
The topology diagram illustrates that port 8081 of node 0 is a reverse-proxy entity that forwards all requests to upstream servers. It is noteworthy that port 8080 of node 0 is assigned with relatively smaller weight, considering this node carries extra responsibilities such as cluster monitoring, front-end access and reverse proxy.
![](https://github.com/chuangw46/TwitterHarvester/blob/master/Images/proxy.png)

### **Contributors**
---

| **Name** | Contributions | **Email** | **Profile** |
|:-----------------:|:-------------:|:---------------:|:---------------:|
|  Chuang Wang | Backend Development & Data Analysis| chuangw@student.unimelb.edu.au| [LinkedIn](https://www.linkedin.com/in/chuangw/)|
| Honglong Zhang | DevOps & Backend Deveopment| honglongz@student.unimelb.edu.au | [LinkedIn]() |
| Jingyi Li | DevOps & Frontend Deveopment| jili@student.unimelb.edu.au | [LinkedIn]() |
| Wei Lin| Frontend Development|wlin8@student.unimelb.edu.au| [LinkedIn]() |
| Yangyang Hu | Data Crawling and Data Cleaning| yangyangh1@student.unimelb.edu.au| [LinkedIn]() |


### **License**
---
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/chuangw46/TwitterHarvester/blob/master/LICENSE)
