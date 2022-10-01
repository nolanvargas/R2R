# Overview

Rank to rank (R2R) is a service that takes in a users ranked data and compares it to data from other ranked players in other games to predict what a players rank might be in a different game. Data is stored primarily as percentile ranking using DynamoDB offered by Amazon Web Services. Currently the project is still under development.

Mu buddies and I play different video games and we love to think that our rank in each of our video games is more challenging than a similar titled rank in a different video game (eg: Gold IV or Silver I)

[Software Demo Video](https://youtu.be/kgACD6Upagk)

# Cloud Database

This web application uses DynamoDB, which is an Amazon service. DynamoDB is a NoSql database, meaning it uses "not only Sql".

The databse currently has only a test table and a cars table which is also a test table. but has usable data in it.

# Development Environment

I am using mainly VSCode and the website for DynamoDB, which I can use to do just about anything to the database.

The software uses AWS JDK v3 for javascript. The web application communicates with the JDK, and then the JDK communicates to the DynamoDB servers. There are 2 js files that are important:

- aws_test.js, which creates
- aws_test_browser.js that does all the work.

# Useful Websites

{Make a list of websites that you found helpful in this project}

- [Read and Write one item in DynamoDB using js](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html)
- [Amazons noSql database DynamoDB](https://aws.amazon.com/dynamodb/)

# Future Work

- Create a frontend for the web application
- Upload all the data for the project to the database
- Configure the backend to retrieve relevant data
