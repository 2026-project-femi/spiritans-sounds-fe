const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: "ed3izzby",
  dataset: "production",
  apiVersion: "2024-01-05",
  useCdn: false
});

const RADIO_QUERY = `
*[_type == "radio"][0]{
  tagline,
  streamUrl,
  schedule[]{
    ...,
    "audioUrl": audio.asset->url
  },
  currentProgram
}
`;

client.fetch(RADIO_QUERY).then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err));
