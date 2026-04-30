import { useEffect, useMemo, useState } from "react";
import heroImage from "./assets/wedding-hero.png";
import receptionImage from "./assets/wedding-reception.png";

const weddingDate = new Date("2026-08-15T15:00:00-05:00");

const forbiddenColors = [
  { name: "Blanco", value: "#f8f6ef" },
  { name: "Negro", value: "#101010" },
  { name: "Rojo", value: "#b83232" },
  { name: "Verde", value: "#3f7d4a" },
  { name: "Amarillo", value: "#f4c542" },
];

const ceremonyMaps =
  "https://www.google.com/maps/search/?api=1&query=Parroquia+San+Antonio+de+Padua+Tarqui+Huila";
const receptionMaps =
  "https://www.google.com/maps/search/?api=1&query=Centro+recreacional+Piscinas+municipal+Tarqui+Huila";
const calendarUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+Freddy+y+Camila&dates=20260815T200000Z/20260816T040000Z&details=Invitacion+a+la+boda+de+Freddy+Sotto+Capera+y+Camila+Cerquera+Sandoval.&location=Parroquia+San+Antonio+de+Padua,+Tarqui,+Huila";

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

function Countdown() {
  const [time, setTime] = useState(getRemainingTime());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getRemainingTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = [
    ["Días", time.days],
    ["Horas", time.hours],
    ["Min", time.minutes],
    ["Seg", time.seconds],
  ];

  return (
    <div className="countdown" aria-label="Cuenta regresiva para la boda">
      {units.map(([label, value]) => (
        <div className="countdownItem" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="sectionHeading" data-reveal>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function InvitationEnvelope() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add("intro-lock");
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove("intro-lock");
    }, 5600);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("intro-lock");
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="envelopeIntro" aria-hidden="true">
      <div className="envelopeGlow" />
      <div className="envelope">
        <div className="envelopeBack" />
        <div className="letterPeek">
          <span>Freddy & Camila</span>
        </div>
        <div className="envelopeFlap" />
        <div className="envelopeFace">
          <div className="envelopeLeft" />
          <div className="envelopeRight" />
          <div className="envelopeBottom" />
        </div>
        <div className="waxSeal">
          <span>FyC</span>
        </div>
      </div>
    </div>
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
      <InvitationEnvelope />
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="heroOverlay" />
        <nav className="nav" aria-label="Secciones de la invitación">
          <a href="#detalles">Detalles</a>
          <a href="#vestimenta">Vestimenta</a>
          <a href="#ubicacion">Ubicación</a>
        </nav>

        <div className="heroContent">
          <p className="saveDate">Reserva la fecha</p>
          <h1>Freddy & Camila</h1>
          <p className="names">Freddy Sotto Capera y Camila Cerquera Sandoval</p>
          <p className="dateLine">{formattedDate}</p>
          <Countdown />
          <div className="heroActions">
            <a className="primaryButton" href={calendarUrl} target="_blank" rel="noreferrer">
              Agregar al calendario
            </a>
            <a className="ghostButton" href="#ubicacion">
              Ver ubicaciones
            </a>
          </div>
        </div>
      </section>

      <section className="introSection">
        <div className="introCopy" data-reveal>
          <span className="script">Con alegría</span>
          <h2>queremos celebrar este sí junto a ustedes</h2>
          <p>
            Entre caminos, siembras, planos y sueños compartidos, Freddy y Camila
            inician una nueva etapa. Su presencia hará parte de este recuerdo.
          </p>
        </div>
        <div className="coupleCards" aria-label="Datos de la pareja">
          <article data-reveal>
            <span>Él</span>
            <h3>Freddy</h3>
            <p>Ingeniero civil, constructor de proyectos, certezas y futuros con buenos cimientos.</p>
          </article>
          <article data-reveal>
            <span>Ella</span>
            <h3>Camila</h3>
            <p>Ingeniera agrícola, sensible a la tierra, a los detalles y a lo que florece con paciencia.</p>
          </article>
        </div>
      </section>

      <section className="detailsSection" id="detalles">
        <SectionHeading eyebrow="Programa" title="Un día para celebrar">
          La ceremonia será en Tarqui, Huila, y después nos encontraremos para brindar, cenar y bailar.
        </SectionHeading>
        <div className="timeline">
          <article data-reveal>
            <time>3:00 p. m.</time>
            <h3>Ceremonia religiosa</h3>
            <p>Parroquial San Antonio de Padua, municipio de Tarqui.</p>
          </article>
          <article data-reveal>
            <time>5:30 p. m.</time>
            <h3>Recepción</h3>
            <p>Centro recreacional Piscinas municipal Tarqui, Huila.</p>
          </article>
          <article data-reveal>
            <time>7:00 p. m.</time>
            <h3>Celebración</h3>
            <p>Cena, brindis, música y una noche para guardar en la memoria.</p>
          </article>
        </div>
      </section>

      <section className="venueSection" id="ubicacion">
        <div className="venueImage" data-reveal>
          <img src={receptionImage} alt="Imagen temporal de una recepción elegante junto a una piscina" />
        </div>
        <div className="venueCopy" data-reveal>
          <span className="script">Tarqui, Huila</span>
          <h2>Ceremonia y recepción</h2>
          <div className="locationCard">
            <strong>Parroquial San Antonio de Padua</strong>
            <p>Ceremonia religiosa</p>
            <a href={ceremonyMaps} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
          </div>
          <div className="locationCard">
            <strong>Centro recreacional Piscinas municipal Tarqui</strong>
            <p>Recepción</p>
            <a href={receptionMaps} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
          </div>
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

      <section className="rsvpSection">
        <div data-reveal>
          <span className="script">Nos vemos pronto</span>
          <h2>15 de agosto de 2026</h2>
          <p>
            Esta tarjeta queda lista para reemplazar las imágenes temporales por las fotos oficiales de Freddy y Camila.
          </p>
          <a className="primaryButton" href="#detalles">
            Revisar detalles
          </a>
        </div>
      </section>
    </main>
  );
}

export default App;
