import { useEffect, useRef, useState } from "react";
import { GoogleGenAI, Modality } from "@google/genai";

export default function VoiceTutor({
  mission,
  gameDay,
  missionId,
}) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [userSpeaking, setUserSpeaking] = useState(false);
  const [tutorSpeaking, setTutorSpeaking] = useState(false);

  const [error, setError] = useState("");

  const sessionRef = useRef(null);

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceRef = useRef(null);
  const processorRef = useRef(null);

  const isUserSpeakingRef = useRef(false);

  const nextPlayTimeRef = useRef(0);

  // =========================================================
  // FLOAT32 → PCM16
  // =========================================================

  const floatTo16BitPCM = (float32Array) => {
    const buffer = new ArrayBuffer(
      float32Array.length * 2
    );

    const view = new DataView(buffer);

    let offset = 0;

    for (
      let i = 0;
      i < float32Array.length;
      i++, offset += 2
    ) {
      const sample = Math.max(
        -1,
        Math.min(1, float32Array[i])
      );

      view.setInt16(
        offset,
        sample < 0
          ? sample * 0x8000
          : sample * 0x7fff,
        true
      );
    }

    return new Uint8Array(buffer);
  };

  // =========================================================
  // UINT8 → BASE64
  // =========================================================

  const uint8ToBase64 = (bytes) => {
    let binary = "";

    const chunkSize = 0x8000;

    for (
      let i = 0;
      i < bytes.length;
      i += chunkSize
    ) {
      binary += String.fromCharCode(
        ...bytes.subarray(
          i,
          i + chunkSize
        )
      );
    }

    return btoa(binary);
  };

  // =========================================================
  // BASE64 → UINT8
  // =========================================================

  const base64ToUint8 = (base64) => {
    const binary = atob(base64);

    const bytes = new Uint8Array(
      binary.length
    );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }

    return bytes;
  };

  // =========================================================
  // PLAY GEMINI AUDIO
  // =========================================================

  const playPCM = async (base64Audio) => {
    try {
      const audioContext =
        audioContextRef.current;

      if (!audioContext) return;

      const bytes =
        base64ToUint8(base64Audio);

      const int16 = new Int16Array(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength / 2
      );

      const sampleRate = 24000;

      const audioBuffer =
        audioContext.createBuffer(
          1,
          int16.length,
          sampleRate
        );

      const channelData =
        audioBuffer.getChannelData(0);

      for (
        let i = 0;
        i < int16.length;
        i++
      ) {
        channelData[i] =
          int16[i] / 32768;
      }

      const source =
        audioContext.createBufferSource();

      source.buffer = audioBuffer;

      source.connect(
        audioContext.destination
      );

      const currentTime =
        audioContext.currentTime;

      const startTime = Math.max(
        currentTime,
        nextPlayTimeRef.current
      );

      source.start(startTime);

      nextPlayTimeRef.current =
        startTime +
        audioBuffer.duration;

      setTutorSpeaking(true);

      source.onended = () => {
        if (
          audioContext.currentTime >=
          nextPlayTimeRef.current - 0.05
        ) {
          setTutorSpeaking(false);
        }
      };
    } catch (err) {
      console.error(
        "❌ Audio playback error:",
        err
      );

      setTutorSpeaking(false);
    }
  };

  // =========================================================
  // CONNECT GEMINI
  // =========================================================

  const connectVoice = async () => {
    try {
      setConnecting(true);
      setError("");

      console.log(
        "🔄 Requesting Gemini token..."
      );

      // -----------------------------------------------------
      // GET EPHEMERAL TOKEN
      // -----------------------------------------------------

      const tokenResponse =
        await fetch(
          "/api/gemini-token",
          {
            method: "POST",
          }
        );

      if (!tokenResponse.ok) {
        const errorText =
          await tokenResponse.text();

        throw new Error(
          `Token request failed: ${errorText}`
        );
      }

      const tokenData =
        await tokenResponse.json();

      const token =
        tokenData.token;

      if (!token) {
        throw new Error(
          "Gemini token was not returned."
        );
      }

      console.log(
        "✅ Gemini token received."
      );

      // -----------------------------------------------------
      // AUDIO CONTEXT
      // -----------------------------------------------------

      const audioContext =
        new AudioContext();

      audioContextRef.current =
        audioContext;

      await audioContext.resume();

      // -----------------------------------------------------
      // GEMINI CLIENT
      // -----------------------------------------------------

      const ai = new GoogleGenAI({
        apiKey: token,
      });

      console.log(
        "🔄 Connecting to Gemini Live..."
      );

      // -----------------------------------------------------
      // GEMINI LIVE SESSION
      // -----------------------------------------------------

      const session =
        await ai.live.connect({
          model: "gemini-3.8-live",

          config: {
            responseModalities: [
              Modality.AUDIO,
            ],

            inputAudioTranscription: {},

            outputAudioTranscription: {},

            // IMPORTANT
            // Automatic VAD is disabled.
            // We control turns manually.
            realtimeInputConfig: {
              automaticActivityDetection: {
                disabled: true,
              },
            },
          },

          callbacks: {
            // ===============================================
            // OPEN
            // ===============================================

            onopen: () => {
              console.log(
                "✅ Gemini Live connected."
              );

              setConnected(true);
              setConnecting(false);
            },

            // ===============================================
            // MESSAGE
            // ===============================================

            onmessage: async (
              message
            ) => {
              console.log(
                "📨 Gemini message:",
                message
              );

              const serverContent =
                message.serverContent;

              if (!serverContent) {
                return;
              }

              // ---------------------------------------------
              // GEMINI AUDIO
              // ---------------------------------------------

              const modelTurn =
                serverContent.modelTurn;

              if (modelTurn?.parts) {
                for (
                  const part of modelTurn.parts
                ) {
                  if (
                    part.inlineData?.data
                  ) {
                    await playPCM(
                      part.inlineData.data
                    );
                  }
                }
              }

              // ---------------------------------------------
              // USER TRANSCRIPTION
              // ---------------------------------------------

              if (
                serverContent.inputTranscription
              ) {
                console.log(
                  "🗣️ USER:",
                  serverContent
                    .inputTranscription
                    .text
                );
              }

              // ---------------------------------------------
              // GEMINI TRANSCRIPTION
              // ---------------------------------------------

              if (
                serverContent.outputTranscription
              ) {
                console.log(
                  "🥑 GEMINI:",
                  serverContent
                    .outputTranscription
                    .text
                );
              }

              // ---------------------------------------------
              // TURN COMPLETE
              // ---------------------------------------------

              if (
                serverContent.turnComplete
              ) {
                console.log(
                  "✅ Gemini finished speaking."
                );

                setTutorSpeaking(false);
              }
            },

            // ===============================================
            // ERROR
            // ===============================================

            onerror: (event) => {
              console.error(
                "❌ Gemini Live error:",
                event
              );

              setError(
                event?.message ||
                  "Gemini Live error."
              );

              setConnected(false);
              setConnecting(false);

              isUserSpeakingRef.current =
                false;

              setUserSpeaking(false);
              setTutorSpeaking(false);
            },

            // ===============================================
            // CLOSE
            // ===============================================

            onclose: (event) => {
              console.log(
                "🔴 Gemini Live closed:",
                event?.reason
              );

              setConnected(false);
              setConnecting(false);

              isUserSpeakingRef.current =
                false;

              setUserSpeaking(false);
              setTutorSpeaking(false);
            },
          },
        });

      sessionRef.current =
        session;

      console.log(
        "✅ Gemini session created."
      );

      // =====================================================
      // SEND TUTOR INSTRUCTIONS
      // =====================================================

      session.sendClientContent({
        turns: [
          {
            role: "user",

            parts: [
              {
                text: `
You are the voice tutor inside the
"Avocado Deutsch" learning game.

IMPORTANT:
This is a DEVELOPMENT TEST MODE.

For this testing phase, speak ONLY English.

The learner will also speak English.

Do NOT speak German during this test.

The learner is completing:

Day: ${gameDay}

Mission topic:
${mission.topic}

Mission description:
${mission.description}

Mission ID:
${missionId}

YOUR RULES:

- Speak ONLY in English.
- The learner speaks English.
- Do NOT use German.
- Ask only ONE question at a time.
- Wait for the learner's answer.
- Do not interrupt the learner.
- Do not ask another question until the learner answers.
- Keep the conversation related to this mission.
- Make the conversation interactive.
- Adapt to the learner's level.
- Correct important English mistakes briefly.
- Do not evaluate the learner before the mission is finished.

IMPORTANT TURN BEHAVIOR:

The learner uses a Push-to-Talk button.

When the learner presses
"Start Speaking", they will answer your question.

When the learner presses
"I'm Finished", their answer is complete.

Wait for the complete answer.

Then respond.

After responding, ask exactly ONE next question.

Do not ask multiple questions at once.

MISSION:

Start naturally.

Briefly introduce the mission.

Then ask the learner the FIRST question.

Ask only ONE question.

Then WAIT.

Do not continue until the learner answers.
                `.trim(),
              },
            ],
          },
        ],

        turnComplete: true,
      });

      console.log(
        "📤 Tutor instructions sent."
      );

      // =====================================================
      // MICROPHONE
      // =====================================================

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: {
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          }
        );

      mediaStreamRef.current =
        stream;

      console.log(
        "🎤 Microphone permission granted."
      );

      // =====================================================
      // MICROPHONE SOURCE
      // =====================================================

      const source =
        audioContext.createMediaStreamSource(
          stream
        );

      sourceRef.current =
        source;

      // =====================================================
      // PROCESSOR
      // =====================================================

      const processor =
        audioContext.createScriptProcessor(
          4096,
          1,
          1
        );

      processorRef.current =
        processor;

      // =====================================================
      // MICROPHONE AUDIO
      // =====================================================

      processor.onaudioprocess =
        (event) => {
          if (!sessionRef.current) {
            return;
          }

          // VERY IMPORTANT:
          // Do NOT send microphone audio
          // unless Start Speaking was pressed.

          if (
            !isUserSpeakingRef.current
          ) {
            return;
          }

          const input =
            event.inputBuffer.getChannelData(
              0
            );

          const pcm =
            floatTo16BitPCM(input);

          const base64 =
            uint8ToBase64(pcm);

          try {
            sessionRef.current.sendRealtimeInput(
              {
                audio: {
                  data: base64,
                  mimeType:
                    "audio/pcm;rate=16000",
                },
              }
            );
          } catch (err) {
            console.error(
              "❌ Audio send error:",
              err
            );
          }
        };

      source.connect(processor);

      processor.connect(
        audioContext.destination
      );

      console.log(
        "🎤 Microphone pipeline ready."
      );
    } catch (err) {
      console.error(
        "❌ Connection failed:",
        err
      );

      setError(
        err.message ||
          "Failed to connect to Gemini."
      );

      setConnected(false);
      setConnecting(false);

      cleanupVoice();
    }
  };

  // =========================================================
  // START SPEAKING
  // =========================================================

  const startSpeaking = async () => {
    if (!sessionRef.current) {
      setError(
        "Gemini is not connected."
      );

      return;
    }

    try {
      // Resume audio
      if (audioContextRef.current) {
        await audioContextRef.current.resume();
      }

      // Tell Gemini that a new user turn begins
      sessionRef.current.sendRealtimeInput({
        activityStart: {},
      });

      isUserSpeakingRef.current =
        true;

      setUserSpeaking(true);
      setTutorSpeaking(false);

      console.log(
        "🎤 USER TURN STARTED"
      );
    } catch (err) {
      console.error(
        "❌ Start speaking error:",
        err
      );

      setError(
        "Could not start speaking."
      );
    }
  };

  // =========================================================
  // STOP SPEAKING
  // =========================================================

  const stopSpeaking = () => {
    if (!sessionRef.current) {
      return;
    }

    try {
      // STOP sending microphone audio first
      isUserSpeakingRef.current =
        false;

      setUserSpeaking(false);

      // Tell Gemini the user's turn is finished
      sessionRef.current.sendRealtimeInput({
        activityEnd: {},
      });

      console.log(
        "🛑 USER TURN ENDED"
      );

      console.log(
        "⏳ Waiting for Gemini response..."
      );
    } catch (err) {
      console.error(
        "❌ Stop speaking error:",
        err
      );

      setError(
        "Could not finish your answer."
      );
    }
  };

  // =========================================================
  // CLEANUP
  // =========================================================

  const cleanupVoice = () => {
    console.log(
      "🧹 Cleaning up voice..."
    );

    isUserSpeakingRef.current =
      false;

    // -------------------------------------------------------
    // Stop microphone
    // -------------------------------------------------------

    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      mediaStreamRef.current =
        null;
    }

    // -------------------------------------------------------
    // Disconnect source
    // -------------------------------------------------------

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {}

      sourceRef.current = null;
    }

    // -------------------------------------------------------
    // Disconnect processor
    // -------------------------------------------------------

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}

      processorRef.current = null;
    }

    // -------------------------------------------------------
    // Close session
    // -------------------------------------------------------

    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch {}

      sessionRef.current = null;
    }

    // -------------------------------------------------------
    // Close audio context
    // -------------------------------------------------------

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}

      audioContextRef.current = null;
    }

    nextPlayTimeRef.current = 0;
  };

  // =========================================================
  // DISCONNECT
  // =========================================================

  const disconnectVoice = () => {
    cleanupVoice();

    setConnected(false);
    setConnecting(false);
    setUserSpeaking(false);
    setTutorSpeaking(false);

    console.log(
      "🔴 Voice tutor disconnected."
    );
  };

  // =========================================================
  // COMPONENT UNMOUNT
  // =========================================================

  useEffect(() => {
    return () => {
      cleanupVoice();
    };
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="mt-8 border-4 border-black bg-green-100 p-5 rounded-sm">

      {/* ===================================================
          TITLE
      =================================================== */}

      <h2 className="text-2xl font-bold text-center">
        🥑 Avocado Voice Tutor
      </h2>

      <p className="text-center mt-2 font-bold">
        Day {gameDay}
      </p>

      {/* ===================================================
          MISSION INFO
      =================================================== */}

      <div className="mt-5 border-2 border-black bg-white p-4">
        <p className="font-bold">
          {mission.topic}
        </p>

        <p className="mt-2 text-sm">
          {mission.description}
        </p>
      </div>

      {/* ===================================================
          NOT CONNECTED
      =================================================== */}

      {!connected && (
        <button
          onClick={connectVoice}
          disabled={connecting}
          className="mt-6 w-full border-3 border-black bg-green-300 py-4 rounded-sm font-bold text-xl hover:bg-green-400 active:translate-y-1 transition disabled:opacity-50"
        >
          {connecting
            ? "🔄 Connecting..."
            : "🎤 Start Voice Mission"}
        </button>
      )}

      {/* ===================================================
          CONNECTED
      =================================================== */}

      {connected && (
        <>
          {/* -----------------------------------------------
              END MISSION
          ----------------------------------------------- */}

          <button
            onClick={disconnectVoice}
            className="mt-6 w-full border-3 border-black bg-red-300 py-4 rounded-sm font-bold text-xl hover:bg-red-400 active:translate-y-1 transition"
          >
            🔴 End Voice Mission
          </button>

          {/* -----------------------------------------------
              AVOCADO
          ----------------------------------------------- */}

          <div className="mt-7 text-center">

            <div
              className={`text-7xl ${
                tutorSpeaking
                  ? "animate-pulse"
                  : ""
              }`}
            >
              🥑
            </div>

            {/* -------------------------------------------
                GEMINI SPEAKING
            ------------------------------------------- */}

            {tutorSpeaking && (
              <>
                <p className="mt-3 font-bold text-blue-700 text-lg">
                  🥑 Avocado is speaking...
                </p>

                <p className="text-sm mt-1">
                  Listen to the tutor.
                </p>
              </>
            )}

            {/* -------------------------------------------
                USER SPEAKING
            ------------------------------------------- */}

            {!tutorSpeaking &&
              userSpeaking && (
                <>
                  <p className="mt-3 font-bold text-red-700 text-lg">
                    🎤 You are speaking...
                  </p>

                  <p className="text-sm mt-1">
                    Speak naturally.
                  </p>

                  <button
                    onClick={stopSpeaking}
                    className="mt-5 w-full border-3 border-black bg-yellow-300 py-4 rounded-sm font-bold text-xl hover:bg-yellow-400 active:translate-y-1 transition"
                  >
                    🛑 I'm Finished
                  </button>
                </>
              )}

            {/* -------------------------------------------
                USER TURN
            ------------------------------------------- */}

            {!tutorSpeaking &&
              !userSpeaking && (
                <>
                  <p className="mt-3 font-bold text-green-700 text-lg">
                    🎤 Your turn
                  </p>

                  <p className="text-sm mt-1">
                    Press the button and speak.
                  </p>

                  <button
                    onClick={startSpeaking}
                    className="mt-5 w-full border-3 border-black bg-green-300 py-4 rounded-sm font-bold text-xl hover:bg-green-400 active:translate-y-1 transition"
                  >
                    🎤 Start Speaking
                  </button>
                </>
              )}

          </div>
        </>
      )}

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="mt-5 border-2 border-black bg-red-100 p-3 text-center font-bold break-words">
          ⚠️ {error}
        </div>
      )}

    </div>
  );
}