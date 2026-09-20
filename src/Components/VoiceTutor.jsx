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

  const [userText, setUserText] = useState("");
  const [tutorText, setTutorText] = useState("");

  const [error, setError] = useState("");

  // =========================================================
  // SESSION
  // =========================================================

  const sessionRef = useRef(null);

  // =========================================================
  // MICROPHONE
  // =========================================================

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceRef = useRef(null);
  const processorRef = useRef(null);

  // =========================================================
  // AUDIO PLAYBACK
  // =========================================================

  const audioQueueRef = useRef([]);
  const currentAudioSourceRef = useRef(null);
  const isPlayingAudioRef = useRef(false);

  // Used to invalidate old queued audio after interruption
  const playbackGenerationRef = useRef(0);

  // =========================================================
  // FLOAT32 → PCM16
  // =========================================================

  const floatTo16BitPCM = (float32Array) => {
    const buffer = new ArrayBuffer(
      float32Array.length * 2
    );

    const view = new DataView(buffer);

    for (
      let i = 0;
      i < float32Array.length;
      i++
    ) {
      const sample = Math.max(
        -1,
        Math.min(1, float32Array[i])
      );

      view.setInt16(
        i * 2,
        sample < 0
          ? sample * 0x8000
          : sample * 0x7fff,
        true
      );
    }

    return new Uint8Array(buffer);
  };

  // =========================================================
  // DOWNSAMPLE AUDIO TO 16 KHZ
  // =========================================================

  const downsampleBuffer = (
    input,
    inputSampleRate,
    outputSampleRate
  ) => {
    if (
      inputSampleRate ===
      outputSampleRate
    ) {
      return input;
    }

    if (
      outputSampleRate >
      inputSampleRate
    ) {
      return input;
    }

    const sampleRateRatio =
      inputSampleRate /
      outputSampleRate;

    const newLength = Math.round(
      input.length / sampleRateRatio
    );

    const result = new Float32Array(
      newLength
    );

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (
      offsetResult < result.length
    ) {
      const nextOffsetBuffer =
        Math.round(
          (offsetResult + 1) *
            sampleRateRatio
        );

      let accumulator = 0;
      let count = 0;

      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer &&
        i < input.length;
        i++
      ) {
        accumulator += input[i];
        count++;
      }

      result[offsetResult] =
        count > 0
          ? accumulator / count
          : 0;

      offsetResult++;

      offsetBuffer =
        nextOffsetBuffer;
    }

    return result;
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
  // STOP CURRENT AUDIO
  // =========================================================

  const stopCurrentAudio = () => {
    if (
      currentAudioSourceRef.current
    ) {
      try {
        currentAudioSourceRef.current.stop();
      } catch {}

      try {
        currentAudioSourceRef.current.disconnect();
      } catch {}

      currentAudioSourceRef.current =
        null;
    }

    isPlayingAudioRef.current =
      false;

    setTutorSpeaking(false);
  };

  // =========================================================
  // CLEAR AUDIO QUEUE
  // =========================================================

  const clearAudioQueue = () => {
    audioQueueRef.current = [];

    playbackGenerationRef.current++;

    stopCurrentAudio();
  };

  // =========================================================
  // PLAY NEXT AUDIO CHUNK
  // =========================================================

  const playNextAudio = async () => {
    if (isPlayingAudioRef.current) {
      return;
    }

    if (
      audioQueueRef.current.length ===
      0
    ) {
      setTutorSpeaking(false);
      return;
    }

    const audioContext =
      audioContextRef.current;

    if (!audioContext) {
      return;
    }

    const audioData =
      audioQueueRef.current.shift();

    const generation =
      playbackGenerationRef.current;

    try {
      isPlayingAudioRef.current =
        true;

      setTutorSpeaking(true);

      const bytes =
        base64ToUint8(audioData);

      const int16 = new Int16Array(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength / 2
      );

      // Gemini Live output audio
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

      currentAudioSourceRef.current =
        source;

      source.onended = () => {
        if (
          currentAudioSourceRef.current ===
          source
        ) {
          currentAudioSourceRef.current =
            null;
        }

        isPlayingAudioRef.current =
          false;

        // If this audio belongs to an
        // interrupted/old response,
        // don't continue playback.
        if (
          generation !==
          playbackGenerationRef.current
        ) {
          return;
        }

        if (
          audioQueueRef.current.length >
          0
        ) {
          playNextAudio();
        } else {
          setTutorSpeaking(false);
        }
      };

      source.start();
    } catch (err) {
      console.error(
        "❌ Audio playback error:",
        err
      );

      isPlayingAudioRef.current =
        false;

      currentAudioSourceRef.current =
        null;

      if (
        generation ===
        playbackGenerationRef.current
      ) {
        playNextAudio();
      }
    }
  };

  // =========================================================
  // CONNECT GEMINI
  // =========================================================

  const connectVoice = async () => {
    try {
      setConnecting(true);
      setError("");

      setUserText("");
      setTutorText("");

      clearAudioQueue();

      console.log(
        "🔄 Requesting Gemini token..."
      );

      // =====================================================
      // GET EPHEMERAL TOKEN
      // =====================================================

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
          `Gemini token request failed: ${errorText}`
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

      // =====================================================
      // AUDIO CONTEXT
      // =====================================================

      const audioContext =
        new AudioContext();

      audioContextRef.current =
        audioContext;

      await audioContext.resume();

      console.log(
        "🎧 Browser sample rate:",
        audioContext.sampleRate
      );

      // =====================================================
      // GEMINI CLIENT
      // =====================================================

      const ai = new GoogleGenAI({
        apiKey: token,
      });

      console.log(
        "🔄 Connecting Gemini Live..."
      );

      // =====================================================
      // GEMINI LIVE
      // =====================================================

      const session =
        await ai.live.connect({
          model: "gemini-3.8-live",

          config: {
            responseModalities: [
              Modality.AUDIO,
            ],

            inputAudioTranscription: {},

            outputAudioTranscription: {},

            // =================================================
            // AUTOMATIC VOICE ACTIVITY DETECTION
            // =================================================

            realtimeInputConfig: {
              automaticActivityDetection: {
                disabled: false,

                startOfSpeechSensitivity:
                  "START_SENSITIVITY_HIGH",

                endOfSpeechSensitivity:
                  "END_SENSITIVITY_HIGH",

                // Capture a small amount
                // before speech begins
                prefixPaddingMs: 300,

                // Allow natural pauses
                silenceDurationMs: 1200,
              },
            },
          },

          callbacks: {
            // =================================================
            // CONNECTED
            // =================================================

            onopen: () => {
              console.log(
                "🟢 Gemini Live connected."
              );

              setConnected(true);
              setConnecting(false);
            },

            // =================================================
            // MESSAGE
            // =================================================

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

              // =================================================
              // INTERRUPTION
              // =================================================

              if (
                serverContent.interrupted
              ) {
                console.log(
                  "🛑 Gemini response interrupted."
                );

                clearAudioQueue();

                setTutorSpeaking(false);
              }

              // =================================================
              // USER TRANSCRIPTION
              // =================================================

              if (
                serverContent.inputTranscription
              ) {
                const text =
                  serverContent
                    .inputTranscription
                    .text || "";

                if (text) {
                  console.log(
                    "🗣️ USER:",
                    text
                  );

                  setUserText(
                    (previous) =>
                      previous + text
                  );

                  setUserSpeaking(true);
                }
              }

              // =================================================
              // GEMINI TRANSCRIPTION
              // =================================================

              if (
                serverContent.outputTranscription
              ) {
                const text =
                  serverContent
                    .outputTranscription
                    .text || "";

                if (text) {
                  console.log(
                    "🥑 GEMINI:",
                    text
                  );

                  setTutorText(
                    (previous) =>
                      previous + text
                  );
                }
              }

              // =================================================
              // GEMINI AUDIO
              // =================================================

              const modelTurn =
                serverContent.modelTurn;

              if (modelTurn?.parts) {
                for (
                  const part of modelTurn.parts
                ) {
                  if (
                    part.inlineData?.data
                  ) {
                    // IMPORTANT:
                    // Queue audio instead of
                    // playing chunks simultaneously.

                    audioQueueRef.current.push(
                      part.inlineData.data
                    );

                    playNextAudio();
                  }
                }
              }

              // =================================================
              // TURN COMPLETE
              // =================================================

              if (
                serverContent.turnComplete
              ) {
                console.log(
                  "✅ Gemini turn complete."
                );

                setUserSpeaking(false);
              }
            },

            // =================================================
            // ERROR
            // =================================================

            onerror: (event) => {
              console.error(
                "❌ Gemini Live error:",
                event
              );

              setError(
                event?.message ||
                  "Gemini Live connection error."
              );

              setConnected(false);
              setConnecting(false);

              setUserSpeaking(false);
              setTutorSpeaking(false);
            },

            // =================================================
            // CLOSE
            // =================================================

            onclose: (event) => {
              console.log(
                "🔴 Gemini Live closed:",
                event?.reason
              );

              setConnected(false);
              setConnecting(false);

              setUserSpeaking(false);
              setTutorSpeaking(false);
            },
          },
        });

      sessionRef.current =
        session;

      console.log(
        "✅ Gemini Live session ready."
      );

      // =====================================================
      // ENGLISH B2 CONVERSATION PROMPT
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
THIS IS DEVELOPMENT TEST MODE.

For this testing phase, speak ONLY English.

The learner will also speak ONLY English.

Do NOT speak German.

==================================================
MISSION
==================================================

Day:
${gameDay}

Mission topic:
${mission.topic}

Mission description:
${mission.description}

Mission ID:
${missionId}

==================================================
ROLE
==================================================

Act as a natural B2-level oral examiner
and conversation partner.

This should feel like a real B2 speaking
exam discussion.

It must NOT feel like a chatbot asking
a list of questions.

==================================================
CONVERSATION
==================================================

Have a natural conversation.

React to what the learner actually says.

Do not ask a new question after every sentence.

If the learner gives an opinion,
explore the opinion.

If the learner gives a reason,
ask about the reason when useful.

If the learner gives an example,
discuss the example.

If the learner disagrees with you,
continue the discussion.

Sometimes challenge the learner's position
with another perspective.

Useful conversation patterns include:

"Why do you think that?"

"Can you give me an example?"

"What about the disadvantages?"

"How would you respond to someone who
disagrees with you?"

"Do you think this would be different
in another situation?"

"But couldn't someone argue the opposite?"

Do not use the same question repeatedly.

==================================================
B2 SPEAKING SKILLS
==================================================

Encourage the learner to:

- express opinions
- explain reasons
- give examples
- compare ideas
- discuss advantages and disadvantages
- agree and disagree
- defend an opinion
- respond to opposing opinions
- explain consequences
- develop arguments

==================================================
IMPORTANT VOICE BEHAVIOR
==================================================

The learner does NOT have speaking buttons.

The microphone is continuously active.

Automatic voice activity detection determines
when the learner starts and stops speaking.

Do NOT ask the learner to press a button.

Do NOT say:

"Press Start Speaking."

Do NOT say:

"Press I'm Finished."

When the learner pauses naturally,
respond naturally.

==================================================
INTERRUPTIONS
==================================================

The learner may interrupt you.

If the learner begins speaking while
you are talking:

STOP your response.

Listen to the learner.

Then respond to what the learner said.

Do not continue your previous response.

==================================================
RESPONSE LENGTH
==================================================

Keep responses conversational.

Do not give long speeches.

Usually give:

- a short reaction
- a useful comment
- one follow-up question

Then let the learner speak.

Do not dominate the conversation.

==================================================
CORRECTIONS
==================================================

For this development test, correct
important English mistakes.

Do NOT correct every tiny mistake.

Correct:

- important grammar mistakes
- repeated mistakes
- mistakes that affect meaning

Keep corrections short.

Then continue the conversation naturally.

==================================================
MISSION COMPLETION
==================================================

Do not finish immediately.

Have a meaningful discussion.

Explore the topic from multiple perspectives.

When the conversation has been completed,
finish naturally.

Only then evaluate the learner.

Evaluation:

Vocabulary: X/10
Grammar: X/10
Pronunciation: X/10

If pronunciation cannot be evaluated,
use:

Pronunciation: N/A

Also provide:

Strengths:
- ...

Areas to improve:
- ...

Recommendation:
- ...

Do not evaluate before the mission is finished.

==================================================
START
==================================================

Start naturally.

Briefly introduce the topic.

Ask ONE opening question.

Then wait for the learner's response.

Do not ask multiple questions at once.
                `.trim(),
              },
            ],
          },
        ],

        turnComplete: true,
      });

      console.log(
        "📤 English B2 prompt sent."
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
      // AUDIO PROCESSOR
      // =====================================================

      const processor =
        audioContext.createScriptProcessor(
          2048,
          1,
          1
        );

      processorRef.current =
        processor;

      // =====================================================
      // MICROPHONE → GEMINI
      // =====================================================

      processor.onaudioprocess =
        (event) => {
          if (!sessionRef.current) {
            return;
          }

          const input =
            event.inputBuffer.getChannelData(
              0
            );

          const inputSampleRate =
            audioContext.sampleRate;

          // Convert browser microphone
          // sample rate to 16 kHz.
          const downsampled =
            downsampleBuffer(
              input,
              inputSampleRate,
              16000
            );

          const pcm =
            floatTo16BitPCM(
              downsampled
            );

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
              "❌ Microphone send error:",
              err
            );
          }
        };

      source.connect(processor);

      // Keep processor running
      processor.connect(
        audioContext.destination
      );

      console.log(
        "🎤 Continuous microphone streaming started."
      );
    } catch (err) {
      console.error(
        "❌ Voice tutor connection failed:",
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
  // CLEANUP
  // =========================================================

  const cleanupVoice = () => {
    console.log(
      "🧹 Cleaning up voice..."
    );

    clearAudioQueue();

    // =======================================================
    // MICROPHONE
    // =======================================================

    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      mediaStreamRef.current =
        null;
    }

    // =======================================================
    // SOURCE
    // =======================================================

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {}

      sourceRef.current = null;
    }

    // =======================================================
    // PROCESSOR
    // =======================================================

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}

      processorRef.current = null;
    }

    // =======================================================
    // GEMINI SESSION
    // =======================================================

    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch {}

      sessionRef.current = null;
    }

    // =======================================================
    // AUDIO CONTEXT
    // =======================================================

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}

      audioContextRef.current = null;
    }

    setUserSpeaking(false);
    setTutorSpeaking(false);
  };

  // =========================================================
  // END MISSION
  // =========================================================

  const disconnectVoice = () => {
    cleanupVoice();

    setConnected(false);
    setConnecting(false);

    console.log(
      "🔴 Voice mission ended."
    );
  };

  // =========================================================
  // UNMOUNT
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
          MISSION
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
          START
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
          {/* =================================================
              AVOCADO
          ================================================= */}

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

            {/* -----------------------------------------------
                GEMINI SPEAKING
            ----------------------------------------------- */}

            {tutorSpeaking && (
              <>
                <p className="mt-3 font-bold text-blue-700 text-lg">
                  🥑 Avocado is speaking...
                </p>

                <p className="text-sm mt-1">
                  You can interrupt naturally.
                </p>
              </>
            )}

            {/* -----------------------------------------------
                USER SPEAKING
            ----------------------------------------------- */}

            {!tutorSpeaking &&
              userSpeaking && (
                <>
                  <p className="mt-3 font-bold text-red-700 text-lg">
                    🎤 Listening to you...
                  </p>

                  <p className="text-sm mt-1">
                    Speak naturally.
                  </p>
                </>
              )}

            {/* -----------------------------------------------
                WAITING
            ----------------------------------------------- */}

            {!tutorSpeaking &&
              !userSpeaking && (
                <>
                  <p className="mt-3 font-bold text-green-700 text-lg">
                    🎤 Listening...
                  </p>

                  <p className="text-sm mt-1">
                    Have a natural conversation.
                  </p>
                </>
              )}

          </div>

          {/* =================================================
              USER TRANSCRIPT
          ================================================= */}

          {userText && (
            <div className="mt-6 border-2 border-black bg-white p-4">

              <p className="font-bold text-sm">
                🗣️ You
              </p>

              <p className="mt-2 leading-6">
                {userText}
              </p>

            </div>
          )}

          {/* =================================================
              GEMINI TRANSCRIPT
          ================================================= */}

          {tutorText && (
            <div className="mt-4 border-2 border-black bg-yellow-100 p-4">

              <p className="font-bold text-sm">
                🥑 Avocado
              </p>

              <p className="mt-2 leading-6">
                {tutorText}
              </p>

            </div>
          )}

          {/* =================================================
              END MISSION
          ================================================= */}

          <button
            onClick={disconnectVoice}
            className="mt-7 w-full border-3 border-black bg-red-300 py-4 rounded-sm font-bold text-xl hover:bg-red-400 active:translate-y-1 transition"
          >
            🔴 End Voice Mission
          </button>
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