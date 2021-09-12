# Tatsumaki Duken Api

App create how backend from Tatsumaki Duken App.

Can be use like boilerplate to get all the videos from youtube channel.

Have a sort of "cached" limited by a number of hours to avoid overload the Google API.

## Environment Variables

```
API_KEY={Google API Key}
CHANNEL_ID={Youtube channel ID}
HOURS_TO_CHECK={Hours to pass before query all the videos again}
```

## How to Run

```npm start```