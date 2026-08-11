import { useEffect, useState } from "react";
import { loadLocal, saveLocal } from "../model.js";

export function usePersistentState(key, fallback) {
  const [state, setState] = useState(() => loadLocal(key, fallback).value);
  const [error, setError] = useState(() => loadLocal(key, fallback).error);

  useEffect(() => {
    const saveError = saveLocal(key, state);
    setError(saveError);
  }, [key, state]);

  return [state, setState, error];
}
