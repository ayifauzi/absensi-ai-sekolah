/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  UserPlus, 
  History, 
  User, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Users,
  RefreshCcw,
  RotateCcw,
  CameraOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as faceapi from 'face-api.js';

// Types
interface AttendanceLog {
  id: string;
  name: string;
  time: string;
  date: string;
  type: 'MASUK' | 'PULANG';
  timestamp: number;
  image?: string;
}

interface RegisteredUser {
  id: string;
  name: string;
  joinDate: string;
  descriptor?: number[];
  image?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'absen' | 'daftar' | 'riwayat'>('dashboard');
  const [logs, setLogs] = useState<AttendanceLog[]>(() => {
    const savedLogs = localStorage.getItem('attendflow_logs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  useEffect(() => {
    localStorage.setItem('attendflow_logs', JSON.stringify(logs));
  }, [logs]);
  const [users, setUsers] = useState<RegisteredUser[]>(() => {
    const savedUsers = localStorage.getItem('attendflow_users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: '1', name: 'Budi Santoso', joinDate: '10 Jan 2026' },
      { id: '2', name: 'Siti Aminah', joinDate: '12 Feb 2026' },
      { id: '3', name: 'Andi Wijaya', joinDate: '05 Mar 2026' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('attendflow_users', JSON.stringify(users));
  }, [users]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [topMessage, setTopMessage] = useState<string | null>(null);

  // Components
  const Navbar = () => (
    <nav className="sticky top-0 z-50 bg-white border-b border-emerald-100 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="bg-emerald-600 p-2 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-900 font-sans">Attend<span className="text-emerald-600">Flow</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'absen', icon: Camera, label: 'Absen' },
            { id: 'daftar', icon: UserPlus, label: 'Daftar' },
            { id: 'riwayat', icon: History, label: 'Riwayat' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-2 transition-all duration-200 py-2 relative ${
                activeTab === item.id ? 'text-emerald-600 font-medium' : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-3 left-0 right-0 h-0.5 bg-emerald-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-emerald-50 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { id: 'absen', icon: Camera, label: 'Absen' },
                { id: 'daftar', icon: UserPlus, label: 'Daftar' },
                { id: 'riwayat', icon: History, label: 'Riwayat' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    activeTab === item.id ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-slate-600'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  const Dashboard = () => (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Selamat Datang 👋</h1>
        <p className="text-slate-500 mt-1">Status sistem: <span className="text-emerald-600 font-medium italic">Online & Aktif</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Karyawan</p>
            <p className="text-4xl font-bold text-slate-900 mt-1">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Absen Hari Ini</p>
            <p className="text-4xl font-bold text-slate-900 mt-1">{logs.filter(l => l.date === '21 Apr 2026').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Terlambat</p>
            <p className="text-4xl font-bold text-slate-900 mt-1">{logs.filter(l => l.status === 'Terlambat').length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <History className="text-emerald-600" size={24} />
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold uppercase">
                    {log.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{log.name}</h4>
                    <span className="text-xs text-slate-400">{log.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium text-slate-700">{log.time}</p>
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${log.status === 'Hadir' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveTab('riwayat')}
            className="w-full mt-6 py-3 text-emerald-600 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            Lihat Semua Riwayat <ArrowRight size={16} />
          </button>
        </div>

        <div className="bg-emerald-900 p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Mulai Absensi Wajah</h2>
            <p className="text-emerald-100/80 mb-8 max-w-xs">
              Gunakan kamera untuk melakukan absensi secara otomatis. Cepat, aman, dan tanpa kontak fisik.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('absen')}
            className="relative z-10 bg-white text-emerald-900 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all active:scale-95 shadow-xl shadow-emerald-950/20"
          >
            <Camera size={20} />
            Buka Kamera Absen
          </button>
          
          {/* Abstract background shapes */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-800/40 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );

  const Absen = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<null | 'success' | 'fail'>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isFaceDetected, setIsFaceDetected] = useState(false);
    const [loadingModelsError, setLoadingModelsError] = useState<string | null>(null);
    const [identifiedUser, setIdentifiedUser] = useState<RegisteredUser | null>(null);

    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
        setLoadingModelsError("Gagal memuat model deteksi wajah. Pastikan file model ada di /public/models");
      }
    };

    useEffect(() => {
      loadModels();
    }, []);

    const handleVideoPlay = () => {
      if (!videoRef.current || !overlayCanvasRef.current || !modelsLoaded) return;

      const video = videoRef.current;
      const canvas = overlayCanvasRef.current;
      
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detectionInterval = setInterval(async () => {
        if (video.paused || video.ended || !modelsLoaded) return;

        // Use detectSingleFace with features for recognition
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        
        setIsFaceDetected(!!detection);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (detection && !capturedImage && !scanResult) {
            const { x, y, width, height } = detection.detection.box;
            const resizedBox = faceapi.resizeResults(detection, displaySize).detection.box;
            
            // Draw Box
            ctx.strokeStyle = '#34d399'; // emerald-400
            ctx.lineWidth = 4;
            ctx.strokeRect(resizedBox.x, resizedBox.y, resizedBox.width, resizedBox.height);
            
            // Euclidean Distance Matching
            let bestMatch: RegisteredUser | null = null;
            let minDistance = 1.0;

            if (users.length > 0 && detection.descriptor) {
              users.forEach(u => {
                if (u.descriptor) {
                  const dist = faceapi.euclideanDistance(detection.descriptor, u.descriptor);
                  if (dist < minDistance) {
                    minDistance = dist;
                    bestMatch = u;
                  }
                }
              });
            }

            if (bestMatch && minDistance < 0.6) {
              console.log(`Match found: ${bestMatch.name} (dist: ${minDistance.toFixed(4)})`);
              setIdentifiedUser(bestMatch);
              
              // Draw text on canvas
              ctx.fillStyle = '#34d399';
              ctx.font = 'bold 16px Inter, sans-serif';
              ctx.fillText(bestMatch.name, resizedBox.x, resizedBox.y - 10);
            } else {
              setIdentifiedUser(null);
            }
          } else {
            setIdentifiedUser(null);
          }
        }
      }, 200);

      return () => clearInterval(detectionInterval);
    };

    const getDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error listing devices:", err);
      }
    };

    const startCamera = async () => {
      setCameraError(null);
      setCapturedImage(null);
      // Stop previous stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      try {
        const constraints: MediaStreamConstraints = {
          video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: 'user' }
        };
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Gagal mengakses kamera. Pastikan izin kamera aktif or kamera tidak sedang digunakan.");
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };

    useEffect(() => {
      getDevices();
      // Only start if tab is active and visible
      startCamera();
      return () => stopCamera();
    }, [selectedDeviceId]);

    const capturePhoto = (type: 'MASUK' | 'PULANG') => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setCapturedImage(dataUrl);
          simulateScan(type);
        }
      }
    };

    const simulateScan = (type: 'MASUK' | 'PULANG') => {
      if (!identifiedUser) {
        setTopMessage("Wajah tidak dikenali, silakan daftar terlebih dahulu");
        setTimeout(() => setTopMessage(null), 3000);
        setCapturedImage(null);
        return;
      }

      setIsScanning(true);
      setScanResult(null);
      
      const userToLog = identifiedUser;

      // Simulate face analysis
      setTimeout(() => {
        setIsScanning(false);
        setScanResult('success');
        
        // Add to logs
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const newLog: AttendanceLog = {
          id: Date.now().toString(),
          name: userToLog.name,
          time: timeStr,
          date: dateStr,
          type: type,
          timestamp: Date.now()
        };
        
        setLogs(prev => [newLog, ...prev]);

        // Send to Google Sheets
        const sendToGoogleSheets = async () => {
          const endpoint = 'https://script.google.com/macros/s/AKfycbwfTCpOw2sLXD-iJz_SbLIO-KMO7WVOYz8AbzvlRibdJ_-T2AS67tXxDIEcObTfIIN/exec';
          const payload = {
            nama: userToLog.name,
            waktu: `${dateStr} ${timeStr}`,
            tipe: type
          };

          try {
            console.log("Sending data to Google Sheets:", payload);
            // We use no-cors if the script doesn't return proper CORS headers, 
            // but standard Apps Script WebApps often need 'follow' redirection.
            const response = await fetch(endpoint, {
              method: 'POST',
              mode: 'no-cors', // Common pattern for Simple Apps Scripts to avoid pre-flight issues
              cache: 'no-cache',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload)
            });
            
            console.log("Data successfully sent to Google Sheets (mode: no-cors)");
            setTopMessage(`Berhasil: Data ${type} dikirim ke Cloud`);
            setTimeout(() => setTopMessage(null), 3000);
          } catch (error) {
            console.error("Error sending to Google Sheets:", error);
            setTopMessage("Gagal sinkronisasi Cloud, data hanya tersimpan lokal.");
            setTimeout(() => setTopMessage(null), 3000);
          }
        };

        sendToGoogleSheets();
        
        // Clear result after 3 seconds
        setTimeout(() => {
          setScanResult(null);
          setCapturedImage(null);
        }, 3000);
      }, 1500);
    };

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Absensi Wajah</h1>
          <p className="text-slate-500 mt-1">Posisikan wajah Anda di depan kamera</p>
        </header>

        {/* Camera Selection */}
        {devices.length > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <RefreshCcw size={16} className="text-slate-500 ml-2" />
              <select 
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="bg-transparent border-0 text-sm focus:ring-0 text-slate-600 font-medium pr-8"
              >
                {devices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${devices.indexOf(device) + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="relative group">
          <div className="bg-black rounded-3xl overflow-hidden aspect-video relative flex items-center justify-center border-4 border-white shadow-2xl">
            {cameraError ? (
              <div className="text-center p-8 bg-slate-900 w-full h-full flex flex-col items-center justify-center">
                <CameraOff size={48} className="text-slate-500 mb-4" />
                <p className="text-slate-400 text-sm mb-4">{cameraError}</p>
                <button 
                  onClick={startCamera}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  onPlay={handleVideoPlay}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${capturedImage ? 'opacity-30' : 'opacity-100'}`}
                />
                
                <canvas 
                  ref={overlayCanvasRef} 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10" 
                />

                {!modelsLoaded && !loadingModelsError && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white">
                    <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-medium animate-pulse">Memuat AI Detector...</p>
                  </div>
                )}

                {loadingModelsError && (
                  <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                    <X className="text-red-400 mb-2" size={32} />
                    <p className="text-white text-sm font-bold">{loadingModelsError}</p>
                    <p className="text-red-200 text-xs mt-2">Pastikan model face-api.js ada di /public/models</p>
                  </div>
                )}
                
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-95 duration-300"
                    alt="Captured"
                  />
                )}
                
                {/* Camera Overlay */}
                {!capturedImage && modelsLoaded && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className={`w-64 h-64 border-2 border-dashed rounded-full transition-colors duration-300 ${isFaceDetected ? (identifiedUser ? 'border-emerald-400' : 'border-emerald-400 opacity-60') : 'border-slate-500 opacity-40'}`}></div>
                    
                    {!isFaceDetected && !isScanning && stream && (
                      <div className="absolute top-[20%] bg-slate-900/80 text-white px-4 py-2 rounded-full text-xs font-bold border border-slate-700 animate-bounce">
                        Wajah tidak terdeteksi
                      </div>
                    )}

                    {isFaceDetected && identifiedUser && !isScanning && !capturedImage && (
                      <div className="absolute top-[20%] bg-emerald-600/90 text-white px-6 py-2 rounded-full text-sm font-bold border border-emerald-400 shadow-lg animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          Wajah dikenali: {identifiedUser.name}
                        </div>
                      </div>
                    )}

                    {isFaceDetected && !identifiedUser && !isScanning && !capturedImage && stream && (
                       <div className="absolute top-[20%] bg-red-600/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-red-400 animate-pulse">
                        Wajah tidak dikenali, silakan daftar terlebih dahulu
                      </div>
                    )}
                    
                    {isScanning && (
                      <motion.div 
                        initial={{ top: '20%' }}
                        animate={{ top: '80%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                        className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-20"
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {/* Recognition States */}
            <AnimatePresence>
              {scanResult === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex items-center justify-center bg-emerald-900/40 backdrop-blur-sm"
                >
                  <div className="bg-white p-8 rounded-3xl text-center shadow-xl">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Absen Berhasil!</h3>
                    <p className="text-slate-500 mt-1">Data Anda telah tercatat.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 w-full justify-center">
             {stream ? (
               <div className="flex gap-4">
                 <button 
                  disabled={isScanning || !!scanResult || !identifiedUser}
                  onClick={() => capturePhoto('MASUK')}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  {isScanning ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : <Camera size={18} />}
                  Absen Masuk
                </button>
                <button 
                  disabled={isScanning || !!scanResult || !identifiedUser}
                  onClick={() => capturePhoto('PULANG')}
                  className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-amber-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  {isScanning ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : <Camera size={18} />}
                  Absen Pulang
                </button>
               </div>
             ) : !cameraError && (
              <button 
                onClick={startCamera}
                className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-emerald-600/20"
              >
                Mulai Kamera
              </button>
             )}
          </div>
        </div>

        <div className="pt-8 text-center text-sm text-slate-400">
          <p>Pastikan pencahayaan cukup untuk hasil terbaik</p>
        </div>
      </div>
    );
  };

  const Daftar = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const [formData, setFormData] = useState({ name: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [step, setStep] = useState<'form' | 'camera'>('form');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isFaceDetected, setIsFaceDetected] = useState(false);

    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models for registration:", err);
      }
    };

    useEffect(() => {
      if (step === 'camera') {
        loadModels();
      }
    }, [step]);

    const handleVideoPlay = () => {
      if (!videoRef.current || !overlayCanvasRef.current || !modelsLoaded) return;

      const video = videoRef.current;
      const canvas = overlayCanvasRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const interval = setInterval(async () => {
        if (video.paused || video.ended || !modelsLoaded || capturedImage) return;

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        setIsFaceDetected(detections.length > 0);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const resized = faceapi.resizeResults(detections, displaySize);
          resized.forEach(det => {
            const { x, y, width, height } = det.box;
            ctx.strokeStyle = '#10b981'; // emerald-500
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
          });
        }
      }, 200);

      return () => clearInterval(interval);
    };

    const getDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error listing devices:", err);
      }
    };

    const startCamera = async () => {
      setCameraError(null);
      setCapturedImage(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      try {
        const constraints: MediaStreamConstraints = {
          video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: 'user' }
        };
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        setCameraError("Gagal mengakses kamera.");
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };

    useEffect(() => {
      if (step === 'camera') {
        getDevices();
        startCamera();
      }
      return () => stopCamera();
    }, [step, selectedDeviceId]);

    const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name) return;
      setStep('camera');
    };

    const handleCapture = async () => {
      if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

      if (!isFaceDetected) {
        setTopMessage("Wajah tidak terdeteksi, tidak bisa disimpan");
        setTimeout(() => setTopMessage(null), 3000);
        return;
      }

      setIsSaving(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      try {
        // Detect face and extract descriptor
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          setIsSaving(false);
          setTopMessage("Gagal mengekstrak fitur wajah. Coba lagi.");
          setTimeout(() => setTopMessage(null), 3000);
          return;
        }

        console.log("Face Descriptor Extraxted:", detection.descriptor);

        // Draw image to canvas for base64 storage
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setCapturedImage(dataUrl);

          // Save User
          const newUser: RegisteredUser = {
            id: Date.now().toString(),
            name: formData.name,
            joinDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            image: dataUrl,
            descriptor: Array.from(detection.descriptor)
          };

          setUsers(prev => [...prev, newUser]);
          setTopMessage(`Registrasi berhasil: ${formData.name}`);
          setIsSaving(false);
          
          setTimeout(() => {
            setActiveTab('dashboard');
            setTopMessage(null);
          }, 2000);
        }
      } catch (err) {
        console.error("Error during face registration:", err);
        setIsSaving(false);
        setTopMessage("Terjadi kesalahan saat registrasi");
        setTimeout(() => setTopMessage(null), 3000);
      }
    };

    return (
      <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Registrasi User</h1>
          <p className="text-slate-500 mt-1">Daftarkan wajah karyawan ke sistem</p>
        </header>

        {step === 'form' ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nama Lengkap</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Masukkan nama lengkap" 
                  className="w-full bg-slate-50 border-0 focus:ring-2 focus:ring-emerald-500 rounded-2xl py-4 pl-12 pr-4 transition-all"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 group text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-emerald-600/10"
            >
              Lanjutkan ke Verifikasi Wajah
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Camera Selection for Registration */}
            {devices.length > 1 && !capturedImage && (
              <div className="flex justify-center mb-4">
                <select 
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="bg-slate-100 border-0 text-xs rounded-xl focus:ring-0 text-slate-600 font-medium"
                >
                  {devices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${devices.indexOf(device) + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-slate-900 aspect-square rounded-[2rem] flex items-center justify-center text-white relative overflow-hidden ring-4 ring-slate-50 shadow-inner">
               {cameraError ? (
                 <div className="text-center p-4">
                   <p className="text-xs text-slate-400 mb-4">{cameraError}</p>
                   <button onClick={startCamera} className="text-emerald-400 font-bold text-xs uppercase tracking-widest underline">Buka Kamera</button>
                 </div>
               ) : (
                 <>
                   <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    onPlay={handleVideoPlay}
                    className={`w-full h-full object-cover ${capturedImage ? 'opacity-30' : 'opacity-100'}`}
                  />
                  <canvas 
                    ref={overlayCanvasRef} 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10" 
                  />
                  {!modelsLoaded && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-2"></div>
                      <p className="text-[10px] text-white font-medium uppercase tracking-widest">Inisialisasi AI...</p>
                    </div>
                  )}
                  {capturedImage && (
                    <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover z-10" alt="Preview" />
                  )}
                  {capturedImage && isSaving && (
                    <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                       <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 border-[2rem] border-slate-900/40 pointer-events-none"></div>
                  <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 border-2 border-emerald-400/40 rounded-full aspect-square"></div>
                  {!isFaceDetected && !capturedImage && stream && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold z-20">
                      Wajah tidak terdeteksi
                    </div>
                  )}
                 </>
               )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex flex-col gap-3">
              {!capturedImage ? (
                stream ? (
                  <button 
                    onClick={handleCapture}
                    disabled={isSaving}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Camera size={20} />
                    Ambil Foto Profil
                  </button>
                ) : (
                  <button 
                    onClick={startCamera}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Camera size={20} />
                    Mulai Kamera
                  </button>
                )
              ) : (
                <div className="text-center py-2 text-emerald-600 font-bold flex items-center justify-center gap-2 italic">
                  <CheckCircle2 size={20} /> Foto Berhasil Diambil
                </div>
              )}
              
              <button 
                onClick={() => {
                  stopCamera();
                  setStep('form');
                  setCapturedImage(null);
                }}
                disabled={isSaving}
                className="w-full text-slate-400 py-2 text-sm font-medium hover:text-slate-600 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Riwayat = () => {
    const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

    const clearLogs = () => {
      if (confirm("Hapus semua riwayat absensi?")) {
        setLogs([]);
        setTopMessage("Riwayat absensi dikosongkan.");
        setTimeout(() => setTopMessage(null), 3000);
      }
    };

    const refreshData = () => {
      const saved = localStorage.getItem('attendflow_logs');
      if (saved) setLogs(JSON.parse(saved));
      setTopMessage("Data diperbarui.");
      setTimeout(() => setTopMessage(null), 2000);
    };

    return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-sans">Riwayat Absensi</h1>
          <p className="text-slate-500 mt-1 italic">Log lengkap aktivitas absensi</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={refreshData}
            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            title="Refresh Data"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={clearLogs}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
          >
            <X size={16} />
            Hapus Semua
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Karyawan</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Waktu</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Tanggal</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Tipe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedLogs.length > 0 ? (
                sortedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold">
                          {log.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700">{log.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-slate-600 font-medium">{log.time}</td>
                    <td className="px-8 py-5 text-slate-500 text-sm whitespace-nowrap">{log.date}</td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        log.type === 'MASUK' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">Belum ada data absensi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative">
      <AnimatePresence>
        {topMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-emerald-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-sm pointer-events-none"
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            {topMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'absen' && <Absen />}
            {activeTab === 'daftar' && <Daftar />}
            {activeTab === 'riwayat' && <Riwayat />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-100 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-40 grayscale">
            <ShieldCheck className="text-emerald-950 w-5 h-5" />
            <span className="font-bold text-emerald-950">AttendFlow</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">
            &copy; 2026 attendflow attendance system • v1.0.0
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-semibold uppercase tracking-widest">Panduan</a>
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-semibold uppercase tracking-widest">Privasi</a>
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-semibold uppercase tracking-widest">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
