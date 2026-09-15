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
  const shouldListenRef = useRef(false);
  const lastHandledTranscriptRef = useRef("");
  const resumeAfterSpeechRef = useRef(false);
  const onFinalTranscriptRef = useRef(onFinalTranscript);

  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    const isSecureContext = window.isSecureContext || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !isSecureContext) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
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
        const clean = final.trim();
        if (clean && clean !== lastHandledTranscriptRef.current) {
          lastHandledTranscriptRef.current = clean;
          resumeAfterSpeechRef.current = shouldListenRef.current;
          shouldListenRef.current = false;
          recognition.stop();
          setListening(false);
          setInterimText("");
          onFinalTranscriptRef.current && onFinalTranscriptRef.current(clean);
        }
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition.start();
          setListening(true);
        } catch {
          // ignore start() race when the browser ends and restarts quickly
        }
        return;
      }
      setListening(false);
    };

    recognition.onerror = (event) => {
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        shouldListenRef.current = false;
        setSupported(false);
      }
      if (shouldListenRef.current && (event?.error === "no-speech" || event?.error === "audio-capture")) {
        try {
          recognition.start();
          setListening(true);
        } catch {
          // ignore restart race
        }
        return;
      }
      setListening(false);
    };

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (!window.isSecureContext && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      setSupported(false);
      return;
    }
    shouldListenRef.current = true;
    lastHandledTranscriptRef.current = "";
    if (listening) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  }, [listening]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    resumeAfterSpeechRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback((text) => {
    if (!("speechSynthesis" in window) || !text) {
      resumeAfterSpeechRef.current = false;
      return;
    }
    window.speechSynthesis.cancel(); // don't let replies queue up/overlap
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 0.9;
    utterance.onstart = () => setSpeaking(true);
    const resumeListening = () => {
      setSpeaking(false);
      if (resumeAfterSpeechRef.current) {
        resumeAfterSpeechRef.current = false;
        shouldListenRef.current = true;
        try {
          recognitionRef.current?.start();
          setListening(true);
        } catch {
          // Ignore the browser's start/stop race.
        }
      }
    };
    utterance.onend = resumeListening;
    utterance.onerror = resumeListening;
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
