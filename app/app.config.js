import 'dotenv/config';

export default {
    expo: {
        name: 'Igreja',
        slug: 'Igreja-Caravanas',
        version: '1.0.0',

        extra: {
            apiUrl: process.env.API_URL,
        },
    },
};
