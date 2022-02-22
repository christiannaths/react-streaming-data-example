import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
  }

  *::before, *::after {
    box-sizing: inherit;
  }

  html,body {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: sans-serif;
    font-size: 1rem;
  }

  #__next {
    display: table;
    width: 100%;
    height: 100%;
  }

`;

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
