'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, ClockIcon, RocketIcon, SettingsIcon, SaveIcon, TrashIcon, PlayIcon, PauseIcon } from 'lucide-react';
import Confetti from 'canvas-confetti';

export default function Home() {
  const [targetDate, setTargetDate] = useState<string>('');
  const [targetTime, setTargetTime] = useState<string>('12:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState('Event Countdown');
  const [savedCountdowns, setSavedCountdowns] = useState<Array<{id: string, title: string, date: string, time: string}>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved countdowns from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('countdowns');
    if (saved) {
      try {
        setSavedCountdowns(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved countdowns', e);
      }
    }
  }, []);

  // Save countdowns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('countdowns', JSON.stringify(savedCountdowns));
  }, [savedCountdowns]);

  // Countdown timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (!targetDate) return;

        const combinedDateTime = new Date(`${targetDate}T${targetTime}`);
        const now = new Date();
        const difference = combinedDateTime.getTime() - now.getTime();

        if (difference <= 0) {
          setIsActive(false);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });

          // Trigger confetti celebration
          triggerConfetti();

          // Play notification sound (if available)
          playNotificationSound();
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, targetDate, targetTime]);

  const triggerConfetti = () => {
    setShowConfetti(true);

    // Confetti animation
    Confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Clear confetti after 5 seconds
    if (confettiRef.current) {
      clearTimeout(confettiRef.current);
    }
    confettiRef.current = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = 880; // Higher pitch
      gainNode.gain.value = 0.3;

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 500);
    } catch (e) {
      console.log('Audio context not supported or user interaction required');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetDate) {
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTargetDate('');
    setTargetTime('12:00');
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  };

  const saveCountdown = () => {
    if (!targetDate || !title) return;

    const newCountdown = {
      id: Date.now().toString(),
      title,
      date: targetDate,
      time: targetTime
    };

    setSavedCountdowns(prev => [...prev, newCountdown]);
  };

  const loadCountdown = (countdown: {date: string, time: string, title: string}) => {
    setTargetDate(countdown.date);
    setTargetTime(countdown.time);
    setTitle(countdown.title);
    setIsActive(true);
  };

  const deleteCountdown = (id: string) => {
    setSavedCountdowns(prev => prev.filter(item => item.id !== id));
  };

  const formatTimeUnit = (value: number, label: string) => {
    // Determine if the unit should pulse (when 10 or less and counting down)
    const shouldPulse = value <= 10 && isActive;

    return (
      <div className="flex flex-col items-center">
        <div className={`relative transition-all duration-300 ${shouldPulse ? 'animate-pulse scale-110' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-75"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg min-w-[80px] border border-gray-200 dark:border-gray-700">
            <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {String(value).padStart(2, '0')}
            </span>
          </div>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Confetti container */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50" style={{ zIndex: 1000 }}></div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Modern Countdown Timer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Set your target date and time to start the countdown. Perfect for events, launches, and deadlines.
          </p>
        </div>

        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <RocketIcon className={`h-6 w-6 transition-colors ${isActive ? 'text-green-500 animate-pulse' : 'text-purple-600'}`} />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {formatTimeUnit(timeLeft.days, 'Days')}
              {formatTimeUnit(timeLeft.hours, 'Hours')}
              {formatTimeUnit(timeLeft.minutes, 'Minutes')}
              {formatTimeUnit(timeLeft.seconds, 'Seconds')}
            </div>

            {!isActive && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-6 py-3 rounded-full border border-purple-200 dark:border-purple-800">
                  <ClockIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Set your countdown</span>
                </div>
              </div>
            )}

            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && !isActive && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full border border-green-200 dark:border-green-800">
                  <RocketIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-200 font-medium">Event Completed!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <SettingsIcon className="h-5 w-5 text-purple-600" />
              Countdown Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                    Event Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                    Target Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pl-10 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">
                    Target Time
                  </Label>
                  <div className="relative">
                    <Input
                      id="time"
                      type="time"
                      value={targetTime}
                      onChange={(e) => setTargetTime(e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pl-10 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
                    />
                    <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="flex items-end space-x-3">
                  <Button
                    type="submit"
                    className={`flex-1 flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    } transition-all duration-300`}
                  >
                    {isActive ? (
                      <>
                        <PauseIcon className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={saveCountdown}
                    disabled={!targetDate || !title}
                    className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                  >
                    <SaveIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {savedCountdowns.length > 0 && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                Saved Countdowns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCountdowns.map((countdown) => (
                  <div
                    key={countdown.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{countdown.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(`${countdown.date}T${countdown.time}`).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadCountdown(countdown)}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCountdown(countdown.id)}
                        className="border-transparent"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Your countdowns are automatically saved in your browser's local storage</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
