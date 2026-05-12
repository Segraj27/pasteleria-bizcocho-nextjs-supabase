"use client";

import {
  Camera,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#3D2B1F",
        color: "#F1E9E4",
        padding: "65px 20px 25px",
        marginTop: "auto",
        borderTop: "3px solid #D4A373",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Contenido principal */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "120px",
          alignItems: "start",
          paddingBottom: "40px",
          borderBottom: "1px solid rgba(241, 233, 228, 0.12)",
        }}
      >
        {/* Columna izquierda */}
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#D4A373",
              fontSize: "3rem",
              marginBottom: "22px",
              lineHeight: "1.1",
            }}
          >
            Pastelería El Bizcocho
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.9",
              color: "#F1E9E4",
              maxWidth: "620px",
              fontWeight: "500",
            }}
          >
            Postres artesanales elaborados con pasión, elegancia y los mejores
            ingredientes para cada ocasión especial.
          </p>

          {/* Redes sociales */}
          <div
            style={{
              display: "flex",
              gap: "28px",
              marginTop: "35px",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                name: "Instagram",
                icon: <Camera size={22} />,
                link: "https://instagram.com",
              },
              {
                name: "Facebook",
                icon: <Globe size={22} />,
                link: "https://facebook.com",
              },
              {
                name: "WhatsApp",
                icon: <MessageCircle size={22} />,
                link: "https://wa.me/573001234567",
              },
            ].map((red) => (
              <a
                key={red.name}
                href={red.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#F1E9E4",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#D4A373";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#F1E9E4";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {red.icon}
                {red.name}
              </a>
            ))}
          </div>
        </div>

        {/* Columna derecha */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h4
            style={{
              color: "#D4A373",
              marginBottom: "22px",
              fontSize: "1.4rem",
              fontWeight: "700",
            }}
          >
            Contacto
          </h4>

          {/* Información de contacto */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              fontSize: "1rem",
              color: "#FFFFFF",
              fontWeight: "600",
              letterSpacing: "0.3px",
              opacity: 1,

            }}
          >
            {[
              {
                icon: <MapPin size={22} color="#D4A373" />,
                text: "Bogotá, Colombia",
              },
              {
                icon: <Phone size={22} color="#D4A373" />,
                text: "+57 300 222 3355",
              },
              {
                icon: <Mail size={22} color="#D4A373" />,
                text: "contacto@elbizcocho.com",
              },
              {
                icon: <Clock size={22} color="#D4A373" />,
                text: "Lunes a Sábado · 8:00 AM – 7:00 PM",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                {item.icon}
                {/* <span>{item.text}</span> */}
                <span
                  style={{
                    color: "#F5E6D3",
                    fontWeight: "600",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parte inferior */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "25px auto 0",
          textAlign: "center",
          fontSize: "0.95rem",
          opacity: 0.9,
          color: "#E6D5C8",
          fontWeight: "500",
        }}
      >
        <p>
          © 2026 Pastelería El Bizcocho. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

