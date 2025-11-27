import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default function AnnouncementSlide() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcement`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
    setLoading(false);
  };

  // Auto-rotate announcements every 5 seconds
  useEffect(() => {
    if (announcements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements]);

  if (loading || announcements.length === 0) {
    return null; // Don't show if no announcements
  }

  const currentAnnouncement = announcements[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="py-3 bg-gradient-to-r from-red-400 to-red-600">
      <style>{`
        @keyframes slideLeft {
          0% { transform: translateX(100%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }

        @keyframes slideRight {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        .announcement-slide {
          animation: slideLeft 5s ease-in-out forwards;
        }

        .announcement-slide.reverse {
          animation: slideRight 5s ease-in-out forwards;
        }
      `}</style>

      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center gap-4">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="text-white hover:bg-blue-700 p-2 rounded-full transition flex-shrink-0 hover:scale-110"
            aria-label="Previous announcement"
          >
            ❮
          </button>

          {/* Announcement Content with Marquee Animation */}
          <div className="flex-1 min-h-12 flex items-center overflow-hidden relative">
            <div 
              key={currentIndex}
              className="announcement-slide w-full"
            >
              <div className="text-white font-bold text-sm md:text-base px-4 py-2 bg-red-900 rounded-lg">
                <div className="font-semibold mb-1">{currentAnnouncement.content}</div>
                {/* <div className="line-clamp-2 text-xs md:text-sm">{currentAnnouncement.content}</div> */}
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="text-white hover:bg-blue-700 p-2 rounded-full transition flex-shrink-0 hover:scale-110"
            aria-label="Next announcement"
          >
            ❯
          </button>

          {/* Indicator Dots */}
          <div className="flex gap-1 ml-4 flex-shrink-0">
            {announcements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition ${
                  idx === currentIndex ? 'bg-white scale-125' : 'bg-blue-300'
                }`}
                aria-label={`Go to announcement ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
