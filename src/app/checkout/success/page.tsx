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
      <h1>✅ Pago exitoso</h1>
      <p>Tu pago fue procesado correctamente. Estamos confirmando tu pedido. </p>

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
          Volver a pedidos
        </button>
      </a>
    </div>
  );
}