"use client";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "#3D2B1F", // Café chocolate oscuro
      color: "#F1E9E4", // Texto crema suave
      padding: "60px 20px 20px 20px",
      marginTop: "auto", // Empuja al fondo en layouts flex
      borderTop: "4px solid #D4A373", // Línea dorada sutil
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <div style={{
        maxWidth: "1550px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px",
        paddingBottom: "40px",
        borderBottom: "1px solid rgba(241, 233, 228, 0.1)"
      }}>
        
        {/* Columna 1: Marca y Esencia */}
        <div>
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            color: "#D4A373", 
            fontSize: "1.8rem",
            marginBottom: "15px" 
          }}>
            Pastelería El Bizcocho
          </h2>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.6", opacity: 0.8 }}>
            Creamos momentos dulces con procesos artesanales y los mejores ingredientes. 
            Un toque de elegancia en cada bocado.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h4 style={{ color: "#D4A373", marginBottom: "20px", fontSize: "1.1rem" }}>Explora</h4>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem", lineHeight: "2" }}>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Nuestra Lista</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Personalizados</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Sobre Nosotros</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contacto</a></li>
          </ul>
        </div>

        {/* Columna 3: Suscripción "Dulce" */}
        <div>
          <h4 style={{ color: "#D4A373", marginBottom: "20px", fontSize: "1.1rem" }}>Únete al Club</h4>
          <p style={{ fontSize: "0.85rem", marginBottom: "15px" }}>Recibe recetas y ofertas exclusivas.</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              type="email" 
              placeholder="Tu correo" 
              style={{
                padding: "10px 15px",
                borderRadius: "50px",
                border: "1px solid rgba(212, 163, 115, 0.3)",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "white",
                flex: 1,
                outline: "none"
              }} 
            />
            <button style={{
              backgroundColor: "#D4A373",
              color: "#3D2B1F",
              border: "none",
              padding: "10px 20px",
              borderRadius: "50px",
              fontWeight: "bold",
              cursor: "pointer"
            }}>
              Ir
            </button>
          </div>
        </div>
      </div>

      {/* Parte Inferior: Copyright y Redes */}
      <div style={{
        maxWidth: "1200px",
        margin: "20px auto 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        fontSize: "0.8rem",
        opacity: 0.6
      }}>
        <p>© 2026 Pastelería El Bizcocho. Todos los derechos reservados.</p>
        <div style={{ display: "flex", gap: "20px" }}>
          <span style={{ cursor: "pointer" }}>Instagram</span>
          <span style={{ cursor: "pointer" }}>Facebook</span>
          <span style={{ cursor: "pointer" }}>WhatsApp</span>
        </div>
      </div>
    </footer>
  );
}