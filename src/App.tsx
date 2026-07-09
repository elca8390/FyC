import { useEffect, useMemo, useRef, useState } from "react";
import camilaProfile from "./assets/Ella.optimized.jpg";
import dressCodeImage from "./assets/Cod Vestimenta transparent.png";
import coupleHero from "./assets/Encabezado FyC.jpg";
import ceremonyImage from "./assets/Iglesia.optimized.jpg";
import freddyProfile from "./assets/El.optimized.jpg";
import receptionImage from "./assets/Recepcion.optimized.jpg";
import giftsImage from "./assets/Regalos lluvia de sobres transparent.png";
import storyAdventure from "./assets/FyC 2.optimized.jpg";
import storyFuture from "./assets/FyC 3.optimized.jpg";
import storyMet from "./assets/FyC 1.optimized.jpg";
import introVideo from "./assets/Vídeo Invitación de Boda Plantas Elegante Sencillo Minimalista Limpio Verde y Blanco.mp4";
import weddingSong from "./assets/Carín León - Desde Que te Tengo.mp3";

const weddingDate = new Date("2026-08-15T15:00:00-05:00");

const forbiddenColors = [
  { name: "Blanco", value: "#f8f6ef" },
  { name: "Negro", value: "#101010" },
  { name: "Dorado", value: "#d8bd83" },
];

const ceremonyMaps = "https://www.google.com/maps/search/?api=1&query=2.113857991981589,-75.82555015466646";
const receptionMaps = "https://www.google.com/maps/search/?api=1&query=2.1100777020088186,-75.82518778438562";
const galleryImages = Object.entries(
  import.meta.glob<string>("./assets/Galeria/*.{jpg,jpeg,png,webp}", {
    eager: true,
    import: "default",
  }),
)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, "es", { numeric: true }))
  .map(([, image]) => image);

function getRemainingTime() {
  const diff = weddingDate.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function useRevealAnimation() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);
}

function SectionHeading({
  eyebrow,
  title,
  titleClassName,
  children,
}: {
  eyebrow?: string;
  title: string;
  titleClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="sectionHeading" data-reveal>
      {eyebrow && <span>{eyebrow}</span>}
      <h2 className={titleClassName}>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function CountdownSection() {
  const [time, setTime] = useState(getRemainingTime());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getRemainingTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = [
    ["Días", time.days],
    ["Horas", time.hours],
    ["Minutos", time.minutes],
    ["Segundos", time.seconds],
  ];

  return (
    <section className="countdownSection">
      <SectionHeading titleClassName="countdownTitle" title="Con mucha ilusión, contamos los días para celebrar juntos" />
      <div className="countdownLarge" aria-label="Cuenta regresiva para la boda">
        {units.map(([label, value]) => (
          <div className="countdownBox" data-reveal key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InvitationIntroVideo() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    document.body.classList.add("intro-lock");
    const fallbackTimer = window.setTimeout(() => startFade(), 11000);

    return () => {
      window.clearTimeout(fallbackTimer);
      document.body.classList.remove("intro-lock");
    };
  }, []);

  function startFade() {
    setIsFading(true);
    window.setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove("intro-lock");
    }, 900);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`videoIntro${isFading ? " is-fading" : ""}`} aria-hidden="true">
      <video
        className="introVideo"
        src={introVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={startFade}
        onError={startFade}
      />
    </div>
  );
}

function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMountedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playMusic() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      await audio.play();
      if (isMountedRef.current) {
        setIsPlaying(true);
      }
    } catch {
      if (isMountedRef.current) {
        setIsPlaying(false);
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true;
    void playMusic();

    const playAfterInteraction = () => {
      void playMusic();
    };

    const interactionEvents = ["click", "touchstart", "keydown", "wheel"];

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, playAfterInteraction, { once: true, passive: true });
    });

    return () => {
      isMountedRef.current = false;
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, playAfterInteraction);
      });
    };
  }, []);

  async function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await playMusic();
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={weddingSong}
        autoPlay
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        className={`musicButton${isPlaying ? " is-playing" : ""}`}
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        title={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
      </button>
    </>
  );
}

function LoveStorySection() {
  const moments = [
    {
      year: "2020",
      title: "Cuando nos conocimos",
      image: storyMet,
      text: "Cuando el destino nos cruzó en los pasillos de la universidad. Compartimos algunas clases sin imaginar que, años después, construiríamos una vida juntos.",
    },
    {
      year: "2022",
      title: "Nuestro primer camino",
      image: storyAdventure,
      text: "El camino nos puso a prueba. Durante un momento difícil descubrimos que el amor también significa cuidar, acompañar y permanecer. Fue entonces cuando, en el 2022, decidimos dar un gran paso: comenzar a vivir juntos y convertir una casa en nuestro hogar.",
    },
    {
      year: "2025",
      title: "Hacia el altar",
      image: storyFuture,
      text: `El año 2025 nos regaló uno de los momentos más inolvidables de nuestra historia. Frente a la majestuosidad de la Catedral de Manizales, llegó la pregunta que cambiaría nuestras vidas para siempre:

"¿Quieres casarte conmigo?"

Con un "sí" lleno de amor, alegría e ilusión, comenzó un nuevo capítulo... el que hoy queremos celebrar junto a ustedes.`,
    },
  ];

  return (
    <section className="loveStorySection">
      <SectionHeading eyebrow="Nuestra historia" title="Historia de amor" titleClassName="loveStoryTitle">
        Un pequeño recorrido por algunos momentos que nos trajeron hasta este día.
      </SectionHeading>
      <div className="storyTimeline">
        {moments.map((moment) => (
          <article className="storyMoment" data-reveal key={moment.year}>
            <div className="storyImage">
              <img src={moment.image} alt={`Imagen temporal de ${moment.title.toLowerCase()}`} />
            </div>
            <div className="storyContent">
              <span>{moment.year}</span>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RsvpSection() {
  const [submitted, setSubmitted] = useState(false);
  const [attendanceValue, setAttendanceValue] = useState("");

  return (
    <section className="confirmSection" id="confirmar">
      <SectionHeading title="Confirma tu asistencia">
        Tu presencia hará este día aún más especial.
      </SectionHeading>
      <form
        className="rsvpForm"
        data-reveal
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const name = String(formData.get("name") ?? "");
          const willAttend = formData.get("attendance") === "si";
          const attendance = willAttend ? "Sí, asistiré" : "No podré asistir";
          const guests = String(formData.get("guests") ?? "");
          const message = String(formData.get("message") ?? "");
          const whatsappMessage = [
            "Confirmación de asistencia",
            `Nombre: ${name}`,
            `Respuesta: ${attendance}`,
            willAttend && guests ? `Número de asistentes: ${guests}` : "",
            message ? `Mensaje: ${message}` : "",
          ].filter(Boolean).join("\n");
          const whatsappUrl = `https://wa.me/573228257722?text=${encodeURIComponent(whatsappMessage)}`;

          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
          setSubmitted(true);
        }}
      >
        <label htmlFor="rsvp-name">
          Nombre completo *
          <input id="rsvp-name" name="name" placeholder="Tu nombre" required />
        </label>

        <fieldset>
          <legend>¿Podrás asistir? *</legend>
          <div className="attendanceOptions">
            <label>
              <input
                id="rsvp-attendance-yes"
                type="radio"
                name="attendance"
                value="si"
                required
                onChange={(event) => setAttendanceValue(event.currentTarget.value)}
              />
              <span>Sí, asistiré</span>
            </label>
            <label>
              <input
                id="rsvp-attendance-no"
                type="radio"
                name="attendance"
                value="no"
                onChange={(event) => setAttendanceValue(event.currentTarget.value)}
              />
              <span>No podré asistir</span>
            </label>
          </div>
        </fieldset>

        {attendanceValue !== "no" && (
          <label htmlFor="rsvp-guests">
            Número de asistentes, incluyéndote *
            <input
              id="rsvp-guests"
              name="guests"
              type="number"
              min="1"
              placeholder="Indica el número de asistentes"
              required={attendanceValue === "si"}
            />
          </label>
        )}

        <label htmlFor="rsvp-message">
          Mensaje para los novios
          <textarea id="rsvp-message" name="message" placeholder="Escribe un mensaje especial..." rows={4} />
        </label>

        <button type="submit">Confirmar Asistencia</button>
        {submitted && (
          <p className="formThanks" role="status" aria-live="polite">
            Gracias. Tu respuesta quedó registrada en esta vista.
          </p>
        )}
      </form>
    </section>
  );
}

function GiftsSection() {
  return (
    <section className="giftsSection">
      <SectionHeading title="Tu presencia es nuestro mejor regalo" />
      <div className="giftsImage" data-reveal>
        <img src={giftsImage} alt="Ilustración de lluvia de sobres" />
      </div>
      <p className="giftsText" data-reveal>
        Si deseas acompañarnos con un detalle, agradeceremos tu generosidad en nuestra lluvia de sobres.
      </p>
    </section>
  );
}

function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (galleryImages.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % galleryImages.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="gallerySection">
      <SectionHeading title="Galería de fotos" />
      <div className="gallerySlider" aria-label="Galería de fotos de Freddy y Camila" data-reveal>
        <div className="galleryTrack" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {galleryImages.map((image, index) => (
            <figure className="gallerySlide" key={image}>
              <img src={image} alt={`Foto ${index + 1} de Freddy y Camila`} loading={index === 0 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  useRevealAnimation();

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(weddingDate),
    [],
  );
  const displayDate = capitalizeFirstLetter(formattedDate);

  return (
    <main>
      <BackgroundMusic />
      <InvitationIntroVideo />
      <section className="hero heroCouple" style={{ backgroundImage: `url(${coupleHero})` }}>
        <div className="heroOverlay" />
        <div className="heroContent">
          <h1>Freddy & Camila</h1>
          <p className="dateLine">{displayDate}</p>
        </div>
      </section>

      <section className="introSection">
        <div className="introCopy" data-reveal>
          <span className="script introTagline">Dos almas, un mismo destino y un amor que crece cada día ♥ ♥ ♥</span>
        </div>
        <div className="coupleCards" aria-label="Datos de la pareja">
          <article data-reveal>
            <img src={freddyProfile} alt="Imagen temporal de Freddy" />
            <span>Él</span>
          </article>
          <article data-reveal>
            <img src={camilaProfile} alt="Imagen temporal de Camila" />
            <span>Ella</span>
          </article>
        </div>
        <p className="script introTagline introClosing">Hoy elegimos escribir juntos el capítulo más importante de nuestra historia</p>
      </section>

      <CountdownSection />

      <LoveStorySection />

      <section className="detailsSection" id="detalles">
        <SectionHeading eyebrow="Programa" title="Ceremonia y recepción">
          Ambos eventos se realizarán en el municipio de Tarqui, Huila.
        </SectionHeading>
        <div className="eventGrid">
          <article className="eventCard" data-reveal>
            <img src={ceremonyImage} alt="Imagen temporal de ceremonia religiosa" />
            <div>
              <time>1:30 p. m.</time>
              <h3>Ceremonia religiosa</h3>
              <p>Parroquia San Antonio de Padua, Tarqui, Huila.</p>
              <a className="eventMapButton" href={ceremonyMaps} target="_blank" rel="noreferrer">
                Abrir en Google Maps
              </a>
            </div>
          </article>
          <article className="eventCard" data-reveal>
            <img src={receptionImage} alt="Imagen temporal de recepción junto a una piscina" />
            <div>
              <time>5:30 p. m.</time>
              <h3>Recepción</h3>
              <p>Centro Recreacional Piscinas Municipal, Tarqui, Huila.</p>
              <a className="eventMapButton" href={receptionMaps} target="_blank" rel="noreferrer">
                Abrir en Google Maps
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="dressCodeSection" id="vestimenta">
        <SectionHeading eyebrow="Código de vestimenta" title="Colores reservados" />
        <div className="dressCodeImage" data-reveal>
          <img src={dressCodeImage} alt="Código de vestimenta" />
        </div>
        <div className="colorGrid">
          {forbiddenColors.map((color) => (
            <article className="colorChip" data-reveal key={color.name}>
              <span style={{ background: color.value }} />
              <strong>{color.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <GiftsSection />

      <GallerySection />

      <RsvpSection />
    </main>
  );
}

export default App;
