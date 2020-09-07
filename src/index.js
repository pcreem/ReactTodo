import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker';

import { getToken } from './token'
import { Provider, Client, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { FEED_QUERY } from './components/Post.js'

const cache = cacheExchange({
  updates: {
    Mutation: {
      upsertPost: (result, args, cache, info) => {
        cache.updateQuery({ query: FEED_QUERY }, data => {
          if (data !== null) {
            data.info.unshift(result.upsertPost);
            return data;
          } else {
            return null
          }
        });
      },
      deletePost: (result, args, cache, info) => {
        cache.invalidate({ __typename: 'Post', id: result.deletePost.id });
      },
    },
  },
});

const client = new Client({
  // url: 'http://localhost:4000',
  url: 'https://prisma--deploy.herokuapp.com/',
  fetchOptions: () => {
    const token = getToken()
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' }
    }
  },
  exchanges: [dedupExchange, cache, fetchExchange],
})

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
