// import Sdk from './index';

// const api = new Sdk({
//   key: process.env.SDK_KEY || '',
//   password: process.env.SDK_PASSWORD || '',
//   themeId: Number(process.env.SDK_THEME_ID) || 0,
//   debug: Boolean(process.env.SDK_DEBUG),
// });

// api.getThemes().then((res) => {
//   console.log(res);
// });

import { Client } from './api/Client';

const client = new Client({
  token: process.env.SDK_TOKEN || '',
  themeId: Number(process.env.SDK_THEME_ID) || 0,
  debug: Boolean(process.env.SDK_DEBUG),
});

// client
//   .getThemes()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.toString()));

client
  .getThemes()
  .then((res) => console.log(res))
  .catch((err) => console.log(err.toString()));
