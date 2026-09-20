import { useEffect, useRef } from 'react';
import { 
  createAgoraRtcEngine, 
  IRtcEngine, 
  ChannelProfileType,
  ClientRoleType
} from 'react-native-agora';
import { useVoiceStore } from '../store/useVoiceStore';
import { Platform } from 'react-native';

const AGORA_APP_ID = process.env.EXPO_PUBLIC_AGORA_APP_ID;

export function useAgoraVoice() {
  const engine = useRef<IRtcEngine | null>(null);
  
  const { 
    channelId, 
    isMuted, 
    setIsConnected, 
    setConnectedRidersCount,
    setSpeakingUids,
    leaveChannel
  } = useVoiceStore();

  // Track user IDs internally to update count
  const remoteUsers = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!AGORA_APP_ID) {
      console.warn("EXPO_PUBLIC_AGORA_APP_ID is not set in .env");
      return;
    }

    const initAgora = async () => {
      engine.current = createAgoraRtcEngine();
      engine.current.initialize({ appId: AGORA_APP_ID });

      // Event Listeners
      engine.current.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          setIsConnected(true);
        },
        onUserJoined: (connection, remoteUid, elapsed) => {
          remoteUsers.current.add(remoteUid);
          setConnectedRidersCount(remoteUsers.current.size + 1); // +1 for self
        },
        onUserOffline: (connection, remoteUid, reason) => {
          remoteUsers.current.delete(remoteUid);
          setConnectedRidersCount(remoteUsers.current.size + 1);
        },
        onAudioVolumeIndication: (connection, speakers, speakerNumber, totalVolume) => {
          // Filter out users who are not speaking loudly enough
          const activeSpeakers = speakers
            .filter(speaker => speaker.volume && speaker.volume > 10)
            .map(speaker => speaker.uid || 0); // uid 0 is local user in this context
          
          setSpeakingUids(activeSpeakers);
        }
      });

      // Configure audio profile for intercom
      engine.current.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      engine.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      
      // Enable volume indication for the UI highlight (update every 200ms)
      engine.current.enableAudioVolumeIndication(200, 3, true);
    };

    initAgora();

    return () => {
      if (engine.current) {
        engine.current.leaveChannel();
        engine.current.release();
      }
    };
  }, []);

  // Handle joining/leaving based on channelId state
  useEffect(() => {
    if (engine.current) {
      if (channelId) {
        // Join with null token for testing (requires Agora App ID to not require tokens)
        engine.current.joinChannel('', channelId, 0, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
      } else {
        engine.current.leaveChannel();
        setIsConnected(false);
        setConnectedRidersCount(0);
        remoteUsers.current.clear();
      }
    }
  }, [channelId]);

  // Handle muting
  useEffect(() => {
    if (engine.current && channelId) {
      engine.current.muteLocalAudioStream(isMuted);
    }
  }, [isMuted, channelId]);

  return { engine: engine.current };
}
