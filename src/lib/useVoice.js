import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps the browser's native Web Speech API (SpeechRecognition +
 * SpeechSynthesis). No external service, no API key -- works in Chrome/Edge
 * out of the box, which is enough for a local demo. Firefox/Safari support
 * for SpeechRecognition is patchy; this hook degrades to "voice
 * unsupported" rather than crashing, so typed input always keeps working.
 */
export function useVoice({ onFinalTranscript } = {}) {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      setInterimText(interim);
      if (final.trim()) {
        setInterimText("");
        onFinalTranscript && onFinalTranscript(final.trim());
      }
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // start() throws if called twice in a row too fast -- ignore
    }
  }, [listening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback((text) => {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel(); // don't let replies queue up/overlap
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return {
    supported,
    listening,
    speaking,
    interimText,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
