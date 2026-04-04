export default function SuccessPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1>❌ Pago fallido</h1>
      <p>Hubo un problema con tu pago. Puedes intentarlo nuevamente. </p>

      <a href="/pedidos">
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Intentar de nuevo
        </button>
      </a>
    </div>
  );
}