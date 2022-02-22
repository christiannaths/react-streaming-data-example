import { useState, useEffect } from 'react';

function useExtents(data) {
  const [min, setMin] = useState(Number.POSITIVE_INFINITY);
  const [max, setMax] = useState(Number.NEGATIVE_INFINITY);

  useEffect(() => {
    const current = Math.min(...data);
    if (current > min) return;
    setMin(Math.round(current * 100) / 100);
  }, [data, min]);

  useEffect(() => {
    const current = Math.max(...data);
    if (current < max) return;
    setMax(Math.round(current * 100) / 100);
  }, [data, max]);

  return [min, max];
}

export default useExtents;
