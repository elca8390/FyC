import { useEffect, useMemo, useState } from "react";
import camilaProfile from "./assets/camila-profile.png";
import coupleHero from "./assets/couple-hero.png";
import ceremonyImage from "./assets/event-ceremony.png";
import freddyProfile from "./assets/freddy-profile.png";
import receptionImage from "./assets/wedding-reception.png";
import storyAdventure from "./assets/story-adventure.png";
import storyFuture from "./assets/story-future.png";
import storyMet from "./assets/story-met.png";

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
      <SectionHeading eyebrow="Falta poco" title="Cuenta regresiva">
        Cada segundo nos acerca al día en que celebraremos este amor en Tarqui, Huila.
      </SectionHeading>
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

function LoveStorySection() {
  const moments = [
    {
      year: "2020",
      title: "Cuando nos conocimos",
      image: storyMet,
      text: "Un encuentro sencillo se convirtió en el comienzo de una historia que empezó a crecer con paciencia, alegría y muchas conversaciones.",
    },
    {
      year: "2022",
      title: "Nuestro primer camino",
      image: storyAdventure,
      text: "Entre viajes, proyectos y nuevos planes descubrimos que caminar juntos hacía más bonitos los días ordinarios.",
    },
    {
      year: "2026",
      title: "Hacia el altar",
      image: storyFuture,
      text: "Hoy damos un paso lleno de gratitud, rodeados de las personas que han acompañado nuestro amor.",
    },
  ];

  return (
    <section className="loveStorySection">
      <SectionHeading eyebrow="Nuestra historia" title="Historia de amor">
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
      <InvitationEnvelope />
      <section className="hero heroCouple" style={{ backgroundImage: `url(${coupleHero})` }}>
        <div className="heroOverlay" />
        <div className="heroContent">
          <h1>Freddy & Camila</h1>
          <p className="dateLine">{formattedDate}</p>
        </div>
      </section>

      <CountdownSection />

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
            <img src={freddyProfile} alt="Imagen temporal de Freddy" />
            <span>Él</span>
            <h3>Freddy</h3>
            <p>Ingeniero civil, constructor de proyectos, certezas y futuros con buenos cimientos.</p>
          </article>
          <article data-reveal>
            <img src={camilaProfile} alt="Imagen temporal de Camila" />
            <span>Ella</span>
            <h3>Camila</h3>
            <p>Ingeniera agrícola, sensible a la tierra, a los detalles y a lo que florece con paciencia.</p>
          </article>
        </div>
      </section>

      <LoveStorySection />

      <section className="detailsSection" id="detalles">
        <SectionHeading eyebrow="Programa" title="Ceremonia y recepción">
          Ambos eventos se realizarán en el municipio de Tarqui, Huila.
        </SectionHeading>
        <div className="eventGrid">
          <article className="eventCard" data-reveal>
            <img src={ceremonyImage} alt="Imagen temporal de ceremonia religiosa" />
            <div>
              <time>3:00 p. m.</time>
              <h3>Ceremonia religiosa</h3>
              <p>Parroquial San Antonio de Padua, Tarqui, Huila.</p>
            </div>
          </article>
          <article className="eventCard" data-reveal>
            <img src={receptionImage} alt="Imagen temporal de recepción junto a una piscina" />
            <div>
              <time>5:30 p. m.</time>
              <h3>Recepción</h3>
              <p>Centro recreacional Piscinas municipal Tarqui, Huila.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="venueSection" id="ubicacion">
        <div className="venueImage" data-reveal>
          <img src={receptionImage} alt="Imagen temporal de una recepción elegante junto a una piscina" />
        </div>
        <div className="venueCopy" data-reveal>
          <span className="script">Tarqui, Huila</span>
          <h2>Ubicaciones</h2>
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

      <RsvpSection />
    </main>
  );
}

export default App;
