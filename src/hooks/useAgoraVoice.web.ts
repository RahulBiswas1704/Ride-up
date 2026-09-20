// Web mock for Agora Voice (Native module not supported on web)
import { useEffect } from 'react';

export function useAgoraVoice() {
  useEffect(() => {
    console.log("Agora Voice is disabled on Web preview. Please build for Android/iOS to test voice comms.");
  }, []);

  return { engine: null };
}
