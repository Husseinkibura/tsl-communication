// pages/HomePage.tsx
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { 
  Camera, 
  Mic, 
  Languages, 
  Heart, 
  Shield, 
  Users, 
  Play,
  Droplets,
  Baby,
  AlertCircle,
  Thermometer,
  Hand,
  ThumbsUp,
  Smile,
  Waves,
  Flame,
  Zap,
  HelpCircle,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Loader2
} from "lucide-react";
import chavitaLogo from "@/assets/chavita-logo.png";
import helloVideo from "@/assets/Hello.mp4";
import naumwaJichoVideo from "@/assets/Naumwa_jicho.mp4";
import pregnantVideo from "@/assets/I'm pregnant.mp4";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    { src: helloVideo, label: "Hello" },
    { src: naumwaJichoVideo, label: "Naumwa jicho" },
    { src: pregnantVideo, label: "Nina mimba" }
  ];

  const next = () => setCurrentIndex((prev) => (prev + 1) % videos.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  const goToVideo = (index: number) => setCurrentIndex(index);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = path;
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      {/* Header */}
      <div className="bg-primary text-primary-foreground text-[11px] sm:text-xs sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-1.5 flex items-center justify-center">
          <span className="opacity-90 text-center">Tanzanian Sign Language Medical Translator</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={chavitaLogo} alt="CHAVITA Logo" className="h-10 sm:h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('phrases')} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Phrases
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              How It Works
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground/70 hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <div className="container mx-auto px-3 sm:px-4 py-4 flex flex-col gap-3">
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors text-left py-2"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors text-left py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('phrases')} 
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors text-left py-2"
              >
                Phrases
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors text-left py-2"
              >
                How It Works
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative overflow-hidden py-12 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                Medical Communication
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Bridge the Gap in <span className="text-primary">Medical Care</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg">
                Real-time translation of Tanzanian Sign Language to voice for effective communication in healthcare settings.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleNavigation('/app')}
                  className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-full text-base font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  Get Started
                </button>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-border shadow-xl bg-black">
                <div className="relative w-full" style={{ minHeight: '300px' }}>
                  <video
                    ref={videoRef}
                    key={currentIndex}
                    src={videos[currentIndex].src}
                    className="w-full h-auto max-h-[400px] object-contain"
                    muted
                    playsInline
                    autoPlay
                    loop
                    preload="auto"
                  />
                </div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                  <span className="text-white text-sm font-medium">{videos[currentIndex].label}</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <div className="flex justify-center gap-2 mt-3">
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToVideo(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to video ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-all backdrop-blur-sm z-20">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-all backdrop-blur-sm z-20">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-20 bg-card/50">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Empowering deaf patients and healthcare providers with seamless communication</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Camera className="h-6 w-6 text-primary" />, title: "Real-time Detection", desc: "Instantly recognize TSL gestures from your camera feed with high accuracy." },
              { icon: <Mic className="h-6 w-6 text-primary" />, title: "Voice Output", desc: "Hear translated phrases spoken aloud in Swahili or English." },
              { icon: <Languages className="h-6 w-6 text-primary" />, title: "Bilingual Support", desc: "Switch between Swahili and English translations seamlessly." },
              { icon: <Heart className="h-6 w-6 text-primary" />, title: "Medical Focus", desc: "Specially designed for medical communication in healthcare settings." },
              { icon: <Users className="h-6 w-6 text-primary" />, title: "Accessible Design", desc: "Built with accessibility in mind for deaf patients and healthcare providers." },
              { icon: <Shield className="h-6 w-6 text-primary" />, title: "Privacy First", desc: "All processing is done locally on your device. No data is stored or shared." }
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-border hover:border-primary/30 transition-all hover:shadow-lg">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Phrases */}
      <section id="phrases" className="py-12 sm:py-20">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Medical Phrases</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Common TSL medical phrases available for instant translation</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { sw: "Nina kiu", en: "I'm thirsty", icon: <Droplets className="h-6 w-6" /> },
              { sw: "Nina mimba", en: "I'm pregnant", icon: <Baby className="h-6 w-6" /> },
              { sw: "Sielewi", en: "I don't understand", icon: <AlertCircle className="h-6 w-6" /> },
              { sw: "Sijisikii vizuri", en: "I don't feel well", icon: <Thermometer className="h-6 w-6" /> },
              { sw: "Tafadhali", en: "Please", icon: <Hand className="h-6 w-6" /> },
              { sw: "Asante sana", en: "Thank you", icon: <ThumbsUp className="h-6 w-6" /> },
              { sw: "Samahani", en: "Sorry", icon: <Smile className="h-6 w-6" /> },
              { sw: "Habari", en: "Hello", icon: <Waves className="h-6 w-6" /> },
              { sw: "Nimeungua", en: "I've been burned", icon: <Flame className="h-6 w-6" /> },
              { sw: "Nina kifafa", en: "I have epilepsy", icon: <Zap className="h-6 w-6" /> },
              { sw: "Ninahisi kichefuchefu", en: "I feel nauseous", icon: <HelpCircle className="h-6 w-6" /> },
              { sw: "Nahitaji msaada", en: "I need help", icon: <Stethoscope className="h-6 w-6" /> }
            ].map((p, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center border border-border hover:border-primary/20 transition-all">
                <div className="flex justify-center mb-2 text-primary">{p.icon}</div>
                <p className="text-sm font-medium">{p.sw}</p>
                <p className="text-xs text-muted-foreground">{p.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-20 bg-primary/5">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Simple three-step process to translate TSL to voice</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Show the Sign", desc: "Perform the TSL gesture in front of your camera" },
              { title: "AI Detection", desc: "Our model recognizes the sign and identifies the phrase" },
              { title: "Voice Translation", desc: "Hear the phrase spoken aloud in your preferred language" }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{i + 1}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button 
              onClick={() => handleNavigation('/app')}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-base font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
              Start Translating Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white text-foreground sticky bottom-0">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-3 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center">© {new Date().getFullYear()} CHAVITA · Kilakala Unit for the Deaf, Morogoro</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;