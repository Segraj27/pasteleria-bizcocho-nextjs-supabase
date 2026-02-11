type Props = {
  titulo: string;
  descripcion: string;
  imagen: string;
};

export default function PastelCard({ titulo, descripcion, imagen }: Props) {
  return (
    <div className="pastel-card">
      {/* Imagen */}
      <img src={imagen} alt={titulo} className="card-img-top" />

      {/* Texto */}
      <div className="card-body">
        <h5 className="card-title">{titulo}</h5>
        <p className="card-text">{descripcion}</p>
      </div>
    </div>
  );
}
