import { Link } from "wouter";
import { useEffect, useState, useRef } from "react";
// Utilizziamo l'immagine del modello F24 come thumbnail per il video
import videoThumbnail from "@assets/Modello_F24.png";

/**
 * Componente che mostra l'anteprima del video tutorial F24
 * Visualizza solo il video tutorial principale sulla compilazione del modello F24
 */
export default function VideoTutorialPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gestisce il click sul pulsante play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowControls(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Aggiungi listener per il click esterno al video
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section id="video-tutorial" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 text-center">
          Guida alla compilazione del modello F24
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div 
            className="aspect-video relative rounded-lg overflow-hidden shadow-lg bg-black"
            ref={containerRef}
          >
            {/* Thumbnail con pulsante play */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-all duration-300"
                onClick={togglePlayPause}
              >
                <img 
                  src={videoThumbnail} 
                  alt="Anteprima video tutorial F24" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="w-20 h-20 rounded-full bg-black bg-opacity-60 flex items-center justify-center z-10">
                  <span className="material-icons text-white text-5xl">play_arrow</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-lg font-bold">Come compilare il modello F24: Guida Completa</h3>
                </div>
              </div>
            )}
            
            {/* Video */}
            <video
              ref={videoRef}
              className={`w-full h-full ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
              src="/assets/F24_ cosa sono e come si pagano in breve (online-video-cutter.com).mp4"
              poster={videoThumbnail}
              controls={showControls}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            ></video>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/tutorial">
              <div className="inline-flex items-center bg-white border border-black px-6 py-3 rounded shadow hover:bg-gray-100 transition-colors cursor-pointer">
                Scopri tutti i tutorial <span className="material-icons text-sm ml-1">arrow_forward</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}