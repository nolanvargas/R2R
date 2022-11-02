# Overview

A frontend for R2R is on the way! So far there is a ui for choosing a video game to pick a rank from.

Rank to Rank is a web application for comparing ranks between video games. This repo requires Parsel as well as AWS SDK.

{Provide a link to your YouTube demonstration. It should be a 4-5 minute demo of the software running (starting the server and navigating through the web pages) and a walkthrough of the code.}

[Software Demo Video](https://youtu.be/Id_XeKhoxS4)

# Web Pages

R2R is a single page application, meaning elements are dynamically rendered using JS. There are three main elements:

- Game select
- Rank select
- Results

The first two are self-explanatory. The results section will clear the game and rank selects and show the results of the rank comparisons.

# Development Environment

The webpack used for this project is Parsel 2.7.0. There is also a static file module used for image paths, parcel-reporter-static-files-copy 1.4.0.

DynamoDb is the database used for this project, and the following libraries are required:

- aws-sdk/client-cognito-identity@3.199.0
- aws-sdk/client-dynamodb@3.199.0
- aws-sdk/client-s3@3.199.0
- aws-sdk-credential-provider-cognito-identity@3.199.0
- aws-sdk@2.1243.0

# Useful Websites

{Make a list of websites that you found helpful in this project}

- [AWS SDK for Javascript](https://aws.amazon.com/sdk-for-javascript/)
- [Parcel](https://parceljs.org/)

# Future Work

Work left to do:

- Matching UI for rank select
- Results section
- SEO
- Domain
- TOS
