import { useEffect, useMemo, useRef, useState } from "react";
import camilaProfile from "./assets/Ella.jpg";
import coupleHero from "./assets/Encabezado FyC.jpg";
import ceremonyImage from "./assets/Iglesia.jpeg";
import freddyProfile from "./assets/El.jpg";
import receptionImage from "./assets/Recepcion.jpeg";
import storyAdventure from "./assets/FyC 2.png";
import storyFuture from "./assets/FyC 3.jpeg";
import storyMet from "./assets/FyC 1.png";
import introVideo from "./assets/Vídeo Invitación de Boda Plantas Elegante Sencillo Minimalista Limpio Verde y Blanco.mp4";
import weddingSong from "./assets/Carín León - Desde Que te Tengo.mp3";

const weddingDate = new Date("2026-08-15T15:00:00-05:00");

const forbiddenColors = [
  { name: "Blanco", value: "#f8f6ef" },
  { name: "Negro", value: "#101010" },
  { name: "Rojo", value: "#b83232" },
  { name: "Verde", value: "#3f7d4a" },
  { name: "Amarillo", value: "#f4c542" },
];

const ceremonyMaps = "https://www.google.com/maps/search/?api=1&query=2.113857991981589,-75.82555015466646";
const receptionMaps = "https://www.google.com/maps/search/?api=1&query=2.1100777020088186,-75.82518778438562";

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
      <SectionHeading titleClassName="countdownTitle" title="Con mucha ilusion, contamos los dias para celebrar juntos" />
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
  const [isPlaying, setIsPlaying] = useState(false);

  async function playMusic() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    void playMusic();

    const playAfterInteraction = () => {
      void playMusic();
    };

    const interactionEvents = ["click", "touchstart", "keydown", "wheel"];

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, playAfterInteraction, { once: true, passive: true });
    });

    return () => {
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
        aria-label={isPlaying ? "Pausar musica" : "Reproducir musica"}
        title={isPlaying ? "Pausar musica" : "Reproducir musica"}
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
      text: "cuando el destino nos cruzó en los pasillos de la universidad. Compartimos algunas clases sin imaginar que, años después, construiríamos una vida juntos.",
    },
    {
      year: "2022",
      title: "Nuestro primer camino",
      image: storyAdventure,
      text: "El camino nos puso a prueba. Durante un momento difícil descubrimos que el amor también significa cuidar, acompañar y permanecer. Fue entonces cuando, en el 2022, decidimos dar un gran paso: comenzar a vivir juntos y convertir una casa en nuestro Hogar",
    },
    {
      year: "2025",
      title: "Hacia el altar",
      image: storyFuture,
      text: `el 2025 nos regaló uno de los momentos más inolvidables de nuestra historia. Frente a la majestuosidad de la Catedral de Manizales, llegó la pregunta que cambiaría nuestras vidas para siempre:

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

  return (
    <section className="confirmSection" id="confirmar">
      <SectionHeading eyebrow="Confirma tu asistencia" title="Confirma tu Asistencia">
        Tu presencia hará este día aún más especial.
      </SectionHeading>
      <form
        className="rsvpForm"
        data-reveal
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <label>
          Nombre completo *
          <input name="name" placeholder="Tu nombre" required />
        </label>

        <fieldset>
          <legend>¿Podrás asistir? *</legend>
          <div className="attendanceOptions">
            <label>
              <input type="radio" name="attendance" value="si" required />
              <span>Sí, asistiré</span>
            </label>
            <label>
              <input type="radio" name="attendance" value="no" />
              <span>No podré asistir</span>
            </label>
          </div>
        </fieldset>

        <label>
          Número de asistentes, incluyéndote *
          <input name="guests" type="number" min="1" placeholder="Indica el número de asistentes" required />
        </label>

        <label>
          Mensaje para los novios
          <textarea name="message" placeholder="Escribe un mensaje especial..." rows={4} />
        </label>

        <button type="submit">Confirmar Asistencia</button>
        {submitted && <p className="formThanks">Gracias. Tu respuesta quedó registrada en esta vista.</p>}
      </form>
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

  return (
    <main>
      <BackgroundMusic />
      <InvitationIntroVideo />
      <section className="hero heroCouple" style={{ backgroundImage: `url(${coupleHero})` }}>
        <div className="heroOverlay" />
        <div className="heroContent">
          <h1>Freddy & Camila</h1>
          <p className="dateLine">{formattedDate}</p>
        </div>
      </section>

      <section className="introSection">
        <div className="introCopy" data-reveal>
          <span className="script introTagline">Dos almas, un mismo destino y un amor que crece cada dia ♥ ♥ ♥</span>
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
        <p className="script introTagline introClosing">Hoy elegimos escribir juntos el capitulo más importante de nuestra historia</p>
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
              <p>Parroquial San Antonio de Padua, Tarqui, Huila.</p>
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
              <p>Centro recreacional Piscinas municipal Tarqui, Huila.</p>
              <a className="eventMapButton" href={receptionMaps} target="_blank" rel="noreferrer">
                Abrir en Google Maps
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="dressCodeSection" id="vestimenta">
        <SectionHeading eyebrow="Código de vestimenta" title="Colores reservados">
          Para conservar la armonía visual de la celebración, evita asistir con estos colores.
        </SectionHeading>
        <div className="colorGrid">
          {forbiddenColors.map((color) => (
            <article className="colorChip" data-reveal key={color.name}>
              <span style={{ background: color.value }} />
              <strong>{color.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <RsvpSection />
    </main>
  );
}

export default App;
