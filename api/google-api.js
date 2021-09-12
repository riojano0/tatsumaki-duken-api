const axios = require('axios');
const { ChronoUnit, LocalDateTime } = require('@js-joda/core');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;
const HOUR_TO_CHECK = process.env.HOURS_TO_CHECK;

let videosDataCached = [];
let dateTimeFromLastQuery;

const googleApiAxios = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/search'
})

module.exports = googleApi = {

    async getVideos() {

        if (!dateTimeFromLastQuery) {
            dateTimeFromLastQuery = LocalDateTime.now();
            dateTimeFromLastQuery= dateTimeFromLastQuery.plusHours(5);
        } else {
            const hoursBetweenLastQuery = ChronoUnit.HOURS.between(LocalDateTime.now(), dateTimeFromLastQuery);
            if (hoursBetweenLastQuery < HOUR_TO_CHECK) {
                console.info(`Cached Response, next query in ${HOUR_TO_CHECK - hoursBetweenLastQuery} Hours`)
                return videosDataCached;
            }
        }

        const response = await googleApiAxios.get('', {
            params: {
                part: 'snippet,id',
                key: API_KEY,
                order: 'date',
                channelId: CHANNEL_ID,
                maxResults: 50
            }
        });

        const responseData = response.data;
        videosDataCached = responseData.items.map(data => {
                return {
                    id: data.id.videoId,
                    title: data.snippet.title,
                    thumb: data.snippet.thumbnails.default.url
                };
            });
        await fillWithNextPages(responseData);

        return videosDataCached;
    }

}

async function fillWithNextPages(responseData) {
    let nextPageToken = responseData['nextPageToken'];
    while (nextPageToken) {
        console.info(`Get Page with token ${nextPageToken}`);
        let nextPageResponse = await googleApiAxios.get('', {
            params: {
                part: 'snippet,id',
                key: API_KEY,
                order: 'date',
                channelId: CHANNEL_ID,
                maxResults: 50,
                pageToken: nextPageToken
            }
        });

        nextPageResponse.data.items.forEach(data => {
            videosDataCached.push({
                id: data.id.videoId,
                title: data.snippet.title,
                thumb: data.snippet.thumbnails.default.url
            });
        });

        nextPageToken = nextPageResponse.data['nextPageToken'];
    }
}
