import { useRef } from 'react';
import { nanoid } from 'nanoid';

function useUniqueId() {
  const ref = useRef(nanoid());
  return ref.current;
}

export default useUniqueId;
