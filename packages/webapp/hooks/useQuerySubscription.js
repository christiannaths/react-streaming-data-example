import { useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { sub } from 'date-fns';

const HOST = process.env.NEXT_PUBLIC_WSS_HOST || 'localhost';
const PORT = process.env.NEXT_PUBLIC_WSS_PORT || 5000;
const DEFAULT_OPTIONS = {
  buffer: 20,
};

const INITIAL_DATA = new Array(10)
  .fill(0.5)
  .map((v, i) => {
    return { v, t: sub(new Date(), { seconds: i / 2 }).toISOString() };
  })
  .reverse()
  .reduce((acc, curr) => {
    return { ...acc, [curr.t]: curr.v };
  }, {});

function useReactQuerySubscription(entity, { buffer: seconds } = DEFAULT_OPTIONS) {
  const wsUrl = `ws://${HOST}:${PORT}/${entity}`;
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => [entity, 'event-stream'], [entity]);

  useEffect(() => {
    const websocket = new WebSocket(wsUrl);
    websocket.onopen = () => {
      console.info('Connected to websocket server', wsUrl);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const keepUntil = sub(new Date(), { seconds }).toISOString();

      queryClient.setQueryData(queryKey, (state) => {
        Object.keys(state).forEach((ts) => ts < keepUntil && delete state[ts]);
        return { ...state, [data.time]: data.value };
      });
    };

    return () => {
      websocket.close();
    };
  }, [entity, queryClient, queryKey, seconds, wsUrl]);

  const { data } = useQuery(queryKey, () => {}, {
    staleTime: Infinity,
    initialData: {},
  });

  return Object.entries(data)
    .reverse()
    .map(([t, v]) => ({ t, v }));
}

export default useReactQuerySubscription;
