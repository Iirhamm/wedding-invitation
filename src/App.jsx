import { useEffect, useState } from "react";
import "./App.css";

// ==========================================
// GANTI TANGGAL PERNIKAHAN DI SINI
// Format: YYYY-MM-DDTHH:MM:SS
// ==========================================
const weddingDate = new Date("2027-01-01T10:00:00");

function App() {
  // ==========================================
  // STATE
  // ==========================================
  const [isOpen, setIsOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // ==========================================
  // NAMA TAMU DARI URL
  // Contoh:
  // ?to=Budi-Santoso
  // ==========================================
  const getGuestName = () => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get("to");

    if (!guest) {
      return "Tamu Undangan";
    }

    return guest
      .replace(/-/g, " ")
      .replace(/\+/g, " ")
      .trim();
  };

  const [guestNamePersonal, setGuestNamePersonal] = useState(
    getGuestName()
  );

  // RSVP
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  // Wishes
  const [wishes, setWishes] = useState(() => {
    const savedWishes = localStorage.getItem("weddingWishes");

    return savedWishes ? JSON.parse(savedWishes) : [];
  });

  // Countdown
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // ==========================================
  // BUKA UNDANGAN + MUSIK
  // ==========================================
  const handleOpenInvitation = () => {
    setIsOpen(true);

    const audio = document.getElementById("wedding-music");

    if (audio) {
      audio.volume = 0.5;

      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((error) => {
          console.log("Musik gagal diputar:", error);
        });
    }
  };

  // ==========================================
  // PLAY / PAUSE MUSIK
  // ==========================================
  const toggleMusic = () => {
    const audio = document.getElementById("wedding-music");

    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((error) => {
          console.log("Musik gagal diputar:", error);
        });
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  // ==========================================
  // HANDLE RSVP
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guestName || !attendance || !guestMessage) {
      alert("Mohon lengkapi semua data.");
      return;
    }

    const newWish = {
      id: Date.now(),
      name: guestName,
      attendance: attendance,
      message: guestMessage,
    };

    const updatedWishes = [newWish, ...wishes];

    setWishes(updatedWishes);

    localStorage.setItem(
      "weddingWishes",
      JSON.stringify(updatedWishes)
    );

    setGuestName("");
    setAttendance("");
    setGuestMessage("");

    alert("Terima kasih atas ucapan dan konfirmasinya ❤️");
  };

  // ==========================================
  // COUNTDOWN
  // ==========================================
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = weddingDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });

        return;
      }

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateCountdown();

    const countdown = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdown);
  }, []);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="wedding-page">

      {/* ==========================================
          MUSIK
      ========================================== */}
      <audio
        id="wedding-music"
        src="/music/lagu-pernikahan.mp3"
        loop
      />

      {/* ==========================================
          OPENING
      ========================================== */}
      {!isOpen && (
        <section className="opening">
          <div className="opening-content">

            <p className="subtitle">
              THE WEDDING OF
            </p>

            <h1>
              Nama Pria
              <span>&</span>
              Nama Wanita
            </h1>

            <div className="guest-opening">
              <p className="guest-label">
                Kepada Yth.
              </p>

              <p className="guest-title">
                Bapak/Ibu/Saudara/i
              </p>

              <h2 className="guest-name">
                {guestNamePersonal}
              </h2>
            </div>

            <p className="date">
              [Tanggal Pernikahan]
            </p>

            <button
              className="open-button"
              onClick={handleOpenInvitation}
            >
              Buka Undangan
            </button>

          </div>
        </section>
      )}

      {/* ==========================================
          ISI UNDANGAN
      ========================================== */}
      {isOpen && (
        <main className="invitation">

          {/* MUSIC BUTTON */}
          <button
            className="music-button"
            onClick={toggleMusic}
            aria-label="Kontrol musik"
          >
            {isMusicPlaying ? "♫" : "🔇"}
          </button>

          {/* ==========================================
              BOTTOM NAVIGATION
          ========================================== */}
          <nav className="bottom-nav">
            <a href="#home">⌂</a>
            <a href="#couple">♡</a>
            <a href="#event">♢</a>
            <a href="#gallery">▧</a>
            <a href="#rsvp">✉</a>
          </nav>

          {/* ==========================================
              HERO
          ========================================== */}
          <section className="hero" id="home">

            <p className="subtitle">
              THE WEDDING OF
            </p>

            <h1>
              Nama Pria
              <span>&</span>
              Nama Wanita
            </h1>

            <p className="date">
              [Tanggal Pernikahan]
            </p>

            <div className="hero-guest">
              <p>
                Kepada Yth.
              </p>

              <strong>
                {guestNamePersonal}
              </strong>
            </div>

          </section>

          {/* ==========================================
              QUOTE
          ========================================== */}
          <section
            className="quote section"
            id="couple"
          >

            <p>
              "Dan di antara tanda-tanda kekuasaan-Nya
              ialah Dia menciptakan untukmu pasangan
              hidup dari jenismu sendiri supaya kamu
              merasa tenteram kepadanya."
            </p>

            <span>
              — QS. Ar-Rum: 21
            </span>

          </section>

          {/* ==========================================
              DETAIL ACARA
          ========================================== */}
          <section
            className="event section"
            id="event"
          >

            <p className="section-label">
              SAVE THE DATE
            </p>

            <h2>
              Detail Acara
            </h2>

            <div className="event-container">

              <div className="event-card">

                <h3>
                  Akad Nikah
                </h3>

                <p>
                  [Hari, Tanggal]
                </p>

                <p>
                  [Jam Acara]
                </p>

                <div className="divider"></div>

                <p>
                  [Nama Gedung / Tempat]
                </p>

                <p>
                  [Alamat Lengkap]
                </p>

              </div>

              <div className="event-card">

                <h3>
                  Resepsi
                </h3>

                <p>
                  [Hari, Tanggal]
                </p>

                <p>
                  [Jam Acara]
                </p>

                <div className="divider"></div>

                <p>
                  [Nama Gedung / Tempat]
                </p>

                <p>
                  [Alamat Lengkap]
                </p>

              </div>

            </div>

          </section>

          {/* ==========================================
              COUNTDOWN
          ========================================== */}
          <section className="countdown section">

            <p className="section-label">
              COUNTDOWN
            </p>

            <h2>
              Menuju Hari Bahagia
            </h2>

            <div className="countdown-container">

              <div>
                <strong>{timeLeft.days}</strong>
                <span>Hari</span>
              </div>

              <div>
                <strong>{timeLeft.hours}</strong>
                <span>Jam</span>
              </div>

              <div>
                <strong>{timeLeft.minutes}</strong>
                <span>Menit</span>
              </div>

              <div>
                <strong>{timeLeft.seconds}</strong>
                <span>Detik</span>
              </div>

            </div>

          </section>

          {/* ==========================================
              OUR STORY
          ========================================== */}
          <section
            className="story section"
            id="story"
          >

            <p className="section-label">
              OUR STORY
            </p>

            <h2>
              Kisah Kami
            </h2>

            <div className="story-container">

              <div className="story-item">

                <div className="story-image">
                  <span>Foto</span>
                </div>

                <div className="story-content">

                  <span className="story-date">
                    [Tanggal]
                  </span>

                  <h3>
                    Pertemuan
                  </h3>

                  <p>
                    [Ceritakan bagaimana kalian
                    pertama kali bertemu.]
                  </p>

                </div>

              </div>

              <div className="story-item reverse">

                <div className="story-image">
                  <span>Foto</span>
                </div>

                <div className="story-content">

                  <span className="story-date">
                    [Tanggal]
                  </span>

                  <h3>
                    Lamaran
                  </h3>

                  <p>
                    [Ceritakan kisah perjalanan
                    hingga sampai pada lamaran.]
                  </p>

                </div>

              </div>

              <div className="story-item">

                <div className="story-image">
                  <span>Foto</span>
                </div>

                <div className="story-content">

                  <span className="story-date">
                    [Tanggal]
                  </span>

                  <h3>
                    Pernikahan
                  </h3>

                  <p>
                    [Ceritakan kisah menuju
                    hari pernikahan.]
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ==========================================
              GALLERY
          ========================================== */}
          <section
            className="gallery section"
            id="gallery"
          >

            <p className="section-label">
              OUR MOMENTS
            </p>

            <h2>
              Galeri
            </h2>

            <div className="gallery-container">

              <div className="gallery-item">
                <span>Foto 1</span>
              </div>

              <div className="gallery-item">
                <span>Foto 2</span>
              </div>

              <div className="gallery-item">
                <span>Foto 3</span>
              </div>

              <div className="gallery-item">
                <span>Foto 4</span>
              </div>

              <div className="gallery-item">
                <span>Foto 5</span>
              </div>

              <div className="gallery-item">
                <span>Foto 6</span>
              </div>

            </div>

          </section>

          {/* ==========================================
              RSVP
          ========================================== */}
          <section
            className="rsvp section"
            id="rsvp"
          >

            <p className="section-label">
              RSVP
            </p>

            <h2>
              Konfirmasi Kehadiran
            </h2>

            <p className="rsvp-description">
              Mohon konfirmasi kehadiran dan
              sampaikan ucapan untuk kedua mempelai.
            </p>

            <form
              className="rsvp-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label>
                  Nama
                </label>

                <input
                  type="text"
                  placeholder="Masukkan nama"
                  value={guestName}
                  onChange={(e) =>
                    setGuestName(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Kehadiran
                </label>

                <select
                  value={attendance}
                  onChange={(e) =>
                    setAttendance(e.target.value)
                  }
                >

                  <option value="">
                    Pilih kehadiran
                  </option>

                  <option value="Hadir">
                    Hadir
                  </option>

                  <option value="Tidak Hadir">
                    Tidak Hadir
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  Ucapan & Doa
                </label>

                <textarea
                  placeholder="Tuliskan ucapan dan doa..."
                  rows="5"
                  value={guestMessage}
                  onChange={(e) =>
                    setGuestMessage(e.target.value)
                  }
                />

              </div>

              <button
                type="submit"
                className="submit-button"
              >
                Kirim Ucapan
              </button>

            </form>

          </section>

          {/* ==========================================
              WISHES
          ========================================== */}
          <section className="wishes section">

            <p className="section-label">
              WISHES
            </p>

            <h2>
              Ucapan & Doa
            </h2>

            <div className="wishes-container">

              {wishes.length === 0 ? (

                <p className="empty-wishes">
                  Belum ada ucapan.
                </p>

              ) : (

                wishes.map((wish) => (

                  <div
                    className="wish-card"
                    key={wish.id}
                  >

                    <h3>
                      {wish.name}
                    </h3>

                    <span className="attendance">
                      {wish.attendance}
                    </span>

                    <p>
                      {wish.message}
                    </p>

                  </div>

                ))

              )}

            </div>

          </section>

        </main>
      )}

    </div>
  );
}

export default App;