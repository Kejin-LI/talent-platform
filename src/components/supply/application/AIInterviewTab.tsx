import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Video, 
  Volume2, 
  ChevronDown, 
  Info, 
  Clock, 
  RotateCw, 
  Lock, 
  Calendar,
  MessageSquare,
  User,
  Check,
  Settings,
  Wifi,
  Maximize2,
  MessageSquareText
} from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

interface AIInterviewTabProps {
  onComplete?: () => void;
  taskTitle?: string;
}

const AIInterviewTab = ({ onComplete, taskTitle }: AIInterviewTabProps) => {
  const [stage, setStage] = useState<'device-check' | 'interview' | 'finished'>('device-check');
  const [interviewStatus, setInterviewStatus] = useState<'connecting' | 'intro' | 'questioning' | 'listening' | 'terminating' | 'completed'>('connecting');
  const [transcript, setTranscript] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0-1 for volume animation
  const isEndedRef = useRef(false);
  const { basicInfo, works, addInterviewRecord } = useResumeStore();
  
  // Device check state
  const [deviceStatus, setDeviceStatus] = useState({
    mic: false,
    speaker: false,
    camera: false
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null); // Track audio analysis stream

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Check if component is still mounted and stage is valid
      if (!isMountedRef.current) {
         stream.getTracks().forEach(track => track.stop());
         return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setDeviceStatus(prev => ({ ...prev, camera: true, mic: true }));
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Cannot access camera or microphone. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    // Stop main video/audio stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    // Stop audio analysis stream
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    // Stop AudioContext
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setDeviceStatus(prev => ({ ...prev, camera: false, mic: false }));
  };
  
  // Track mount status
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, []);

  useEffect(() => {
    // Start camera only for relevant stages
    if (stage === 'device-check' || stage === 'interview') {
      // Avoid restarting if already active and stream exists
      if (!streamRef.current) {
        startCamera();
      } else if (videoRef.current && videoRef.current.srcObject !== streamRef.current) {
        // Re-attach existing stream if lost
        videoRef.current.srcObject = streamRef.current;
      }
    } else {
      // Explicitly stop camera for 'finished' or any other future stages
      stopCamera();
    }
  }, [stage]);

  // Separate cleanup for unmounting the component
  // Removed redundant cleanup since it's now handled in the isMountedRef effect
  // But we keep stage-based logic
  
  const testSpeaker = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Simulate speaker test
    const msg = new SpeechSynthesisUtterance("准备好参加你的AI面试了吗？");
    msg.lang = 'zh-CN';
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1.1; // Slightly higher pitch for female-like voice
    
    // Try to select a female voice if available
    const voices = window.speechSynthesis.getVoices();
    // Common Chinese female voices: Ting-Ting (Mac), Huihui/Yaoyao (Windows), Google types
    const femaleVoice = voices.find(v => 
      v.lang.includes('zh') && 
      (v.name.includes('Female') || v.name.includes('Lili') || v.name.includes('Ting') || v.name.includes('Huihui') || v.name.includes('Yaoyao'))
    );
    
    if (femaleVoice) {
      msg.voice = femaleVoice;
    }

    window.speechSynthesis.speak(msg);
    setDeviceStatus(prev => ({ ...prev, speaker: true }));
  };
  
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) { /* IE11 */
      (elem as any).msRequestFullscreen();
    }
  };

  useEffect(() => {
    if (stage === 'interview') {
      enterFullScreen();
    }
  }, [stage]);

  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const maxTime = 21 * 60; // 21 minutes in seconds
  // const maxTime = 10; // Debug: 10 seconds for testing

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Record Interview on Completion
  const finishInterview = () => {
     setStage('finished');
     setInterviewStatus('completed'); // Ensure status updates to stop recognition
     stopCamera();
     
     // Generate mock record
     const mockScore = Math.floor(Math.random() * 20) + 70; // Mock score 70-90 to test pass/fail
     // 50% chance of being "pending" (under review), otherwise auto-graded
     const isPending = Math.random() > 0.8; 
     
     addInterviewRecord({
        role: taskTitle || (works.length > 0 ? works[0].role : 'Candidate'),
        startTime: new Date(Date.now() - timeElapsed * 1000).toISOString(),
        endTime: new Date().toISOString(),
        score: isPending ? undefined : mockScore, 
        status: isPending ? 'pending' : (mockScore >= 80 ? 'passed' : 'failed'),
        feedback: isPending ? "Interview is currently under review by our team." : "Demonstrated strong communication skills and technical understanding. Good structured thinking during problem solving tasks.",
        videoLink: "#" // Mock link
     });

     if (onComplete) onComplete();
  };

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === 'interview' && interviewStatus !== 'completed') {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          // Check if we reached 20:00 (1200 seconds)
          if (prev === 1200) { // 20 minutes
             // Interrupt and wrap up
             handleTimeLimitReached();
          }
          if (prev >= maxTime) {
             clearInterval(interval);
             finishInterview();
             return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, interviewStatus]);

  const handleTimeLimitReached = () => {
    // Interrupt current speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    isEndedRef.current = true;
    
    // Play wrap-up message
    setInterviewStatus('terminating'); 
    const wrapUpMsg = "I'm sorry to interrupt, but we are approaching the time limit. Thank you for sharing your experience with me today. I've gathered enough information for now. Have a great day!";
    speak(wrapUpMsg);
    addTranscript('ai', wrapUpMsg);
    
    // End interview after speech (approximate duration)
    setTimeout(() => {
       finishInterview();
    }, 12000); // 12 seconds for the speech
  };

  // Mock AI Logic
  useEffect(() => {
    if (stage === 'interview' && timeElapsed === 0) { // Only start if beginning
      // Simulate connection
      const timer1 = setTimeout(() => {
        setInterviewStatus('intro');
        speak("Hello, I'm KEJIN, your AI interviewer for today. I've reviewed your resume and I'm excited to learn more about your experience. Shall we begin?");
        addTranscript('ai', "Hello, I'm KEJIN, your AI interviewer for today. I've reviewed your resume and I'm excited to learn more about your experience. Shall we begin?");
      }, 2000);

      return () => clearTimeout(timer1);
    }
  }, [stage]);

  const [lastQuestion, setLastQuestion] = useState("");
  const [repeatCount, setRepeatCount] = useState(0);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abnormalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speakingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Real Audio Analysis for Waveform
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startAudioAnalysisForWaveform = async () => {
     try {
       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
       audioStreamRef.current = stream; // Track stream for cleanup
       
       if (!isMountedRef.current) {
          stream.getTracks().forEach(t => t.stop());
          return;
       }

       if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
       }
       const audioContext = audioContextRef.current;
       const source = audioContext.createMediaStreamSource(stream);
       const analyser = audioContext.createAnalyser();
       analyser.fftSize = 64; // Small size for waveform bars
       source.connect(analyser);
       analyserRef.current = analyser;
       
       const bufferLength = analyser.frequencyBinCount;
       dataArrayRef.current = new Uint8Array(bufferLength);
       
       const updateWaveform = () => {
         if (analyserRef.current && dataArrayRef.current) {
            // @ts-ignore
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            // Calculate average or use raw data for bars
            // We'll update a state or ref that the UI reads
            // For performance, we might just update a ref and force render occasionally, 
            // or just use the volume simulation for simplicity if high-freq updates cause lag.
            // Let's calculate a simple volume metric for the React state
            let sum = 0;
            for(let i=0; i<dataArrayRef.current.length; i++) sum += dataArrayRef.current[i];
            const avg = sum / dataArrayRef.current.length;
            setVolumeLevel(avg / 128); // Normalize 0-2 roughly
         }
         animationFrameRef.current = requestAnimationFrame(updateWaveform);
       };
       updateWaveform();
     } catch(e) {
       console.error("Audio analysis setup failed", e);
     }
  };
  
  // Cleanup audio context
  useEffect(() => {
     return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
     };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        // Always reconstruct the full transcript from all results in the current session
        for (let i = 0; i < event.results.length; ++i) {
             currentTranscript += event.results[i][0].transcript;
        }
        
        // Update user transcript (real-time)
        setTranscript(prev => {
          const newTranscript = [...prev];
          if (newTranscript.length > 0 && newTranscript[newTranscript.length - 1].role === 'user') {
            newTranscript[newTranscript.length - 1].text = currentTranscript;
          } else {
            newTranscript.push({ role: 'user', text: currentTranscript });
          }
          return newTranscript;
        });

        // Simulate volume level based on transcript length change or random for demo
        setVolumeLevel(Math.random() * 0.5 + 0.5); 
        setTimeout(() => setVolumeLevel(Math.random() * 0.3), 100);

        // Reset silence timers since user is speaking
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (abnormalTimerRef.current) clearTimeout(abnormalTimerRef.current);
        
        // Start/Reset Long Speech Timer (3 minutes)
        if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
        speakingTimerRef.current = setTimeout(() => {
          handleLongSpeechInterruption();
        }, 3 * 60 * 1000); 
      };

      recognitionRef.current.onstart = () => {
         console.log("Speech recognition started");
         // Start AudioContext for real visualization if possible
         startAudioAnalysisForWaveform();
      };
      recognitionRef.current.onend = () => {
         console.log("Speech recognition ended");
         // Restart if still listening
         if (interviewStatus === 'listening') {
             try {
                // Add small delay to prevent rapid loops
                setTimeout(() => {
                   if (recognitionRef.current && interviewStatus === 'listening') {
                      recognitionRef.current.start();
                   }
                }, 100);
             } catch(e) {
                console.log("Failed to restart recognition", e);
             }
         }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
           alert("Microphone permission denied. Please enable microphone access in your browser settings.");
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Handle Interview Status Changes for Listening
  useEffect(() => {
    // Only manage recognitionRef if it's initialized
    if (!recognitionRef.current) return;

    if (interviewStatus === 'listening') {
      // Start Recognition
      try {
        // Check if already started to avoid errors
        recognitionRef.current.start();
      } catch (e) {
        // Ignore "already started" errors
        console.log("Recognition start attempt:", e);
      }

      // Start Silence Timer (30s)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        handleSilence();
      }, 30 * 1000);

      // Start Abnormal Timer (5m) - Cumulative silence if not cleared by result
      if (abnormalTimerRef.current) clearTimeout(abnormalTimerRef.current);
      abnormalTimerRef.current = setTimeout(() => {
        handleAbnormalSilence();
      }, 5 * 60 * 1000);

    } else {
      // Stop Recognition & Timers if not listening
      try {
        recognitionRef.current?.stop();
      } catch(e) {}
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (abnormalTimerRef.current) clearTimeout(abnormalTimerRef.current);
      if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
    }
  }, [interviewStatus, lastQuestion, repeatCount]); // Dependencies for timers

  const handleSilence = () => {
    if (repeatCount < 2) {
      setRepeatCount(prev => prev + 1);
      const repeatMsg = `I didn't catch that. ${lastQuestion}`;
      setInterviewStatus('questioning'); // Switch to questioning to speak
      speak(repeatMsg, () => {
         // After repeat, go back to listening (will trigger useEffect to restart timers)
         setInterviewStatus('listening');
      });
      addTranscript('ai', repeatMsg);
    }
    // If repeatCount >= 2, we just wait for the 5m abnormal timer
  };

  const handleAbnormalSilence = () => {
    setInterviewStatus('terminating');
    const msg = "Interview Exception: No audio received for 5 minutes. Please check your microphone or network connection and try again.";
    speak(msg);
    addTranscript('ai', msg);
    setTimeout(() => {
      finishInterview();
    }, 8000);
  };

  const handleLongSpeechInterruption = () => {
    setInterviewStatus('questioning'); // Stop listening
    const interruptMsg = "Thank you for that detailed explanation. I'd like to follow up on that based on your resume. How did you measure the success of those initiatives?";
    speak(interruptMsg, () => {
        setInterviewStatus('listening');
    });
    addTranscript('ai', interruptMsg);
  };

  const speak = (text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US'; 
    msg.rate = 1;
    msg.pitch = 1.1;
    
    msg.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    
    // Voice selection...
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English')));
    if (voice) msg.voice = voice;
    
    window.speechSynthesis.speak(msg);
  };

  // Simulate AI asking questions after intro
  useEffect(() => {
    if (interviewStatus === 'intro') {
      const timer = setTimeout(() => {
        setInterviewStatus('questioning');
        const firstQuestion = works.length > 0 
          ? `I see you worked at ${works[0].company} as a ${works[0].role}. Could you tell me more about your responsibilities there?`
          : "Could you please introduce yourself and highlight your key skills?";
        
        setLastQuestion(firstQuestion); // Store for repeat
        setRepeatCount(0); // Reset repeat count
        speak(firstQuestion, () => {
          if (!isEndedRef.current) setInterviewStatus('listening');
        });
        addTranscript('ai', firstQuestion);
        
        // Removed old Simulate user listening timeout
      }, 8000); // Wait for intro to finish
      return () => clearTimeout(timer);
    }
  }, [interviewStatus, works]);

  const addTranscript = (role: 'ai' | 'user', text: string) => {
    setTranscript(prev => [...prev, { role, text }]);
  };

  const handleUserSpeak = () => {
    // Simulate user speaking
    if (interviewStatus === 'listening') {
      const userResponse = "(Speaking...) I was responsible for frontend development and leading a team of 5 engineers...";
      addTranscript('user', userResponse);
      setInterviewStatus('questioning');
      
      // AI follows up
      setTimeout(() => {
        if (isEndedRef.current) return;
        const followUp = "That's impressive. How did you handle technical challenges in that role?";
        setLastQuestion(followUp);
        setRepeatCount(0);
        speak(followUp, () => {
          if (!isEndedRef.current) setInterviewStatus('listening');
        });
        addTranscript('ai', followUp);
      }, 2000);
    }
  };

  const handleEndCall = () => {
    if (window.confirm("Are you sure you want to end the interview?")) {
      // Interrupt current speech/listening
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      isEndedRef.current = true; // Prevent other timeouts
      
      setInterviewStatus('terminating');
      const goodbyeMsg = "Thank you for your time. The interview has ended. Have a nice day.";
      addTranscript('ai', goodbyeMsg);
      
      speak(goodbyeMsg, () => {
        finishInterview();
      });
    }
  };

  if (stage === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
          <Check size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Interview Completed</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Thank you for completing the interview. Your responses have been recorded and will be reviewed by our team.
          </p>
        </div>
        <button 
           onClick={() => setStage('device-check')}
           className="px-6 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
        >
          Restart Interview (Demo)
        </button>
      </div>
    );
  }

  if (stage === 'interview') {
    return (
      <div className="fixed inset-0 z-50 bg-[#1a1b1e] flex flex-col overflow-hidden text-white font-sans">
        {/* Top Toast */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl z-40 flex flex-col items-center text-center max-w-md animate-fade-in-down border border-white/10">
           <span className="font-bold text-lg mb-1">
             {interviewStatus === 'listening' ? 'Listening' : (isSpeaking ? 'AI Speaking' : 'Interview')}
           </span>
           <div className="text-lg text-gray-200 font-medium line-clamp-2 leading-relaxed">
             {(() => {
               const lastAiMsg = [...transcript].reverse().find(t => t.role === 'ai');
               return lastAiMsg ? lastAiMsg.text : "Thanks for joining today and welcome to the Domain Expert interview.";
             })()}
           </div>
        </div>

        {/* User Transcript (Fixed Bottom) */}
        {(interviewStatus === 'listening' || (transcript.length > 0 && transcript[transcript.length - 1].role === 'user')) && (
           <div className="absolute bottom-24 left-0 right-0 flex justify-center z-40 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-4 border border-white/10 shadow-xl max-w-3xl">
                 {/* Waveform Animation */}
                 <div className="flex items-center gap-1 h-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div 
                        key={i}
                        className="w-1 bg-[#4ade80] rounded-full transition-all duration-75"
                        style={{
                          height: `${Math.max(4, Math.min(24, volumeLevel * 24 * (Math.random() + 0.5)))}px` 
                        }}
                      />
                    ))}
                 </div>
                 
                 <div className="text-gray-200 text-lg font-medium truncate max-w-xl">
                    {transcript.length > 0 && transcript[transcript.length - 1].role === 'user' && transcript[transcript.length - 1].text.trim()
                      ? transcript[transcript.length - 1].text 
                      : "Listening"}
                 </div>
              </div>
           </div>
        )}

        {/* Main Area */}
        <div className="flex-1 relative flex items-center justify-center">
          
          {/* Concentric Circles Animation */}
          <div className="relative flex items-center justify-center">
              {/* Core - Avatar Image */}
              <div className={`w-32 h-32 rounded-full z-20 flex items-center justify-center shadow-[0_0_40px_rgba(92,96,245,0.6)] overflow-hidden border-4 border-white/20 ${!isSpeaking ? 'animate-breathing-border' : ''}`}>
                <img 
                  src="https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=A%20sweet%20beautiful%20young%20woman%203D%20avatar%2C%20long%20brown%20hair%2C%20slim%20face%2C%20casual%20wear%2C%20white%20hoodie%2C%20Pixar%20style%2C%20soft%20lighting%2C%20cute%20and%20lively%2C%20looking%20at%20camera%2C%20high%20quality%2C%20vivid%20eyes%2C%20slight%20smile&image_size=square" 
                  alt="AI Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <style>{`
                @keyframes ripple {
                  0% { transform: scale(0.8); opacity: 1; }
                  100% { transform: scale(3); opacity: 0; }
                }
                .animate-ripple {
                  animation: ripple 2s linear infinite;
                }
                @keyframes breathing-border {
                  0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(92,96,245,0.6); }
                  50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(92,96,245,0.8); }
                }
                .animate-breathing-border {
                  animation: breathing-border 4s infinite ease-in-out;
                }
              `}</style>
              
              {/* Ripples */}
              {isSpeaking && (
                 <>
                   <div className="absolute w-24 h-24 rounded-full border border-blue-400 animate-ripple z-10"></div>
                   <div className="absolute w-24 h-24 rounded-full border border-purple-400 animate-ripple z-10" style={{ animationDelay: '1s' }}></div>
                   <div className="absolute w-24 h-24 rounded-full border border-indigo-400 animate-ripple z-10" style={{ animationDelay: '2s' }}></div>
                 </>
              )}
              
              {/* Static decorative circles if not speaking or base rings */}
               {!isSpeaking && (
                 <>
                   <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5"></div>
                   <div className="absolute w-[500px] h-[500px] rounded-full border border-white/5"></div>
                 </>
               )}
          </div>

          {/* User Video (Bottom Right) */}
          <div className="absolute bottom-24 right-6 w-48 h-32 md:w-64 md:h-40 bg-black rounded-xl overflow-hidden shadow-2xl z-30 border border-white/10 group">
              {/* Maximize Icon Overlay */}
              <div className="absolute top-2 left-2 p-1.5 bg-black/50 rounded-lg hover:bg-black/70 cursor-pointer backdrop-blur-sm z-40">
                 <Maximize2 size={14} className="text-white" />
              </div>
              
              <video 
                 ref={videoRef} 
                 autoPlay 
                 muted 
                 playsInline 
                 className="w-full h-full object-cover transform scale-x-[-1]" 
              />
              
              {/* Name Label */}
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/50 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10 text-white/90 max-w-[80%] truncate">
                 {basicInfo.name || "Kejin..."}
              </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="h-20 bg-[#000000] flex items-center justify-between px-8 select-none z-50">
          {/* Left: Info */}
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
             <span className="text-white">Domain Expert Interview</span>
             <span className="mx-2">|</span>
             <span>{formatTime(timeElapsed)} / 21:00</span>
          </div>

          {/* Center: Controls */}
          <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
             
             {/* End Call */}
             <button 
               className="h-12 px-8 rounded-full bg-[#2c2d31] hover:bg-[#3c3d41] transition-colors text-white text-sm font-semibold flex items-center border border-white/10"
               onClick={handleEndCall}
             >End call</button>
             
             {/* Circle/Dot Icon (Mystery function) */}
             <button 
               className="w-12 h-12 rounded-full bg-[#1a1b1e] flex items-center justify-center hover:bg-[#2c2d31] transition-colors text-white border border-white/10"
               onClick={handleUserSpeak}
               disabled={interviewStatus !== 'listening'}
             >
                <div className={`w-3 h-3 rounded-full ${interviewStatus === 'listening' ? 'bg-green-500 animate-pulse' : 'bg-white'}`}></div>
             </button>
          </div>

          {/* Right: Status Icons */}
          <div className="flex items-center gap-5 text-white">
             <button className="hover:text-gray-300 transition-colors">
                <Wifi size={22} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Device Check UI
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Center Column: Device Check */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Domain Expert Interview 
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">21 min</span>
          </h1>
          <p className="text-gray-500 mt-2">Discuss your expertise in a chosen domain</p>
        </div>

        <div className="space-y-6">
          {/* Video Preview */}
          <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
               <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover transform scale-x-[-1]" 
               />
               {!deviceStatus.camera && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-500 z-10">
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4 border-4 border-gray-600">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                    <p>Camera Off / Loading...</p>
                 </div>
               )}
            </div>
            

          </div>

          {/* Device Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
               <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                 <span className="flex items-center gap-2">
                    <Mic size={16} className={deviceStatus.mic ? "text-green-600" : "text-gray-400"} /> 
                    Microphone
                 </span>
                 {deviceStatus.mic && <Check size={16} className="text-green-600" />}
               </div>
               <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors text-sm">
                 <span className="truncate">Default Microphone</span>
                 <ChevronDown size={14} className="text-gray-400" />
               </button>
               <p className="text-xs text-green-600">
                  {deviceStatus.mic ? "Microphone active" : "Checking..."}
               </p>
             </div>

             <div className="space-y-2">
               <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                 <span className="flex items-center gap-2">
                    <Volume2 size={16} className={deviceStatus.speaker ? "text-green-600" : "text-gray-400"} /> 
                    Speaker
                 </span>
                 {deviceStatus.speaker && <Check size={16} className="text-green-600" />}
               </div>
               <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors text-sm">
                 <span className="truncate">Default Speaker</span>
                 <ChevronDown size={14} className="text-gray-400" />
               </button>
               <button 
                  onClick={testSpeaker}
                  className="text-xs text-indigo-600 hover:underline"
               >
                 {deviceStatus.speaker ? "Test again" : "Play test sound"}
               </button>
             </div>

             <div className="space-y-2">
               <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                 <span className="flex items-center gap-2">
                    <Video size={16} className={deviceStatus.camera ? "text-green-600" : "text-gray-400"} /> 
                    Camera
                 </span>
                 {deviceStatus.camera && <Check size={16} className="text-green-600" />}
               </div>
               <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors text-sm">
                 <span className="truncate">FaceTime HD</span>
                 <ChevronDown size={14} className="text-gray-400" />
               </button>
               <p className="text-xs text-green-600">
                  {deviceStatus.camera ? "Camera active" : "Checking..."}
               </p>
             </div>
          </div>

          <button className="w-full py-3 bg-gray-50 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
            Troubleshooting help
          </button>
        </div>
      </div>

      {/* Right Column: Info */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Info size={20} className="text-gray-400" />
            AI Interview
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">This AI interview explores your expertise in the professional field where you have experience. You will discuss your background and participate in a task similar to those we work on at KEJIN AI Lab. You may need pen and paper. Come on a desktop, ready to have your camera on and showcase your knowledge.</p>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock size={16} className="text-gray-400" />
            <span>Expect to spend <span className="font-medium text-gray-900">~21 minutes</span></span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MessageSquare size={16} className="text-gray-400" />
            <span>Need assistance? <button className="text-indigo-600 hover:underline">Just ask</button></span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <RotateCw size={16} className="text-gray-400" />
            <span>3 of 3 interview <button className="text-indigo-600 hover:underline">retakes remaining</button></span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Lock size={16} className="text-gray-400" />
            <span>Your data is in <button className="text-indigo-600 hover:underline">your control</button></span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <span>Interview on your <button className="text-indigo-600 hover:underline">own time</button></span>
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={() => {
              if (deviceStatus.mic && deviceStatus.speaker && deviceStatus.camera) {
                setStage('interview');
              } else {
                alert("Please ensure microphone, speaker, and camera are all working and tested.");
              }
            }}
            className={`w-full py-3 font-semibold rounded-xl transition-colors shadow-lg ${
              deviceStatus.mic && deviceStatus.speaker && deviceStatus.camera
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewTab;