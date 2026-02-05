const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Hh0rE70WfnSFN80K8uJC';
const MODEL_ID = 'eleven_turbo_v2_5';

interface AudioCache {
  [key: string]: string;
}

const audioCache: AudioCache = {};

const getCacheKey = (text: string): string => {
  return btoa(text).substring(0, 50);
};

const addNaturalPauses = (text: string): string => {
  let processedText = text;

  processedText = processedText.replace(/,(\s+)/g, '..$1');

  processedText = processedText.replace(/\?(\s+)/g, '?...$1');
  processedText = processedText.replace(/\.(\s+)/g, '...$1');

  processedText = processedText.replace(/\?$/g, '?...');
  processedText = processedText.replace(/\.$/g, '...');

  return processedText;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const cacheKey = getCacheKey(text);

  if (audioCache[cacheKey]) {
    return audioCache[cacheKey];
  }

  const naturalText = addNaturalPauses(text);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: naturalText,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.75,
          style: 0.2,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);

  audioCache[cacheKey] = audioUrl;

  return audioUrl;
};

export const isElevenLabsAvailable = (): boolean => {
  return Boolean(ELEVENLABS_API_KEY);
};
