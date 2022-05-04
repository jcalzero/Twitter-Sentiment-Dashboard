# Twitter Sentiment Dashboard

## Table of Contents

1. [Overview](#Overview)
2. [How to Use the Live Dashboard](#How-to-Use-the-Live-Dashboard)
3. [How to Use the Dashboard Locally](#How-to-Use-the-Dashboard-Locally)
4. [Future Improvements](#Future-Improvements)

## Overview

### Description

Organized analytics dashboard focused on giving the user powerful sentiment analytics using the Twitter API. Twitter is a social media application most would call the place where people voice their opinions and therefore it makes it a very powerful tools for companies, people, and industries to get truly powerful sentiment analytics of their biggest fans and biggest foes.

## How to Use the Live Dashboard

### Link to Hosted Tool

https://twitsentdashboard.herokuapp.com/

### Searching a Keyword on the Dashboard

https://user-images.githubusercontent.com/47018214/166831027-c7332813-302e-4e9c-8436-693c0678e331.mov

### Using the Trending Tab to find Keywords

https://user-images.githubusercontent.com/47018214/166831102-d8e86caa-954a-46dc-90c4-d3001ef645c6.mov

## How to Use the Dashboard Locally

### Instructions

1. Clone the Repository locally
2. In the local directory, open a terminal and run `yarn` to install all the needed packages/dependencies
3. Open a terminal shell and run `yarn start` (this will start the server which will run on port 8080)
4. Open another terminal shell and run `yarn start-react` (this will start the webpack on port 3000)

### What should pop up on your browser

![Local Dashboard](https://user-images.githubusercontent.com/47018214/166832050-0e2c0a9c-5da5-4c82-a441-c4a99612a6e4.png)

## Future Improvements
```
1. Clicking trending topics row will automatically trigger a search for that topic

2. Cron job to harvest trending topics throughout the day so the Trending Topics page will
   show if the topic has risen or fallen in relevancy
   
3. Adding Twitter User Authentication

4. Extending the API Call to get more tweets (depends on Improvement Number 3 above)

5. Search history by User (depends on Improvement Number 3 above)

6. Dark Mode

7. Additional more powerful analytics

8. Adding link to latest tweets table so clicking on a row will take you to the full tweet on Twitter

9. Training Natural Language Processing model for higher accuracy of sentiment analysis

10. Trending topics queried by User Location rather than just the United States

11. Adding API documentation so it can be used publicly outside of the dashboard
```
