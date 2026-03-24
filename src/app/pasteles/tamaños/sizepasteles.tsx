import { Users } from 'lucide-react';
import styles from "@/app/pasteles/tamaños/sizepasteles.module.css";

interface Props {
  value: Size;
  onChange: (size: Size) => void;
}
const sizes: { name: Size; portions: string; desc: string }[] = [
  { name: 'Pequeño', portions: '10-15 personas', desc: 'Ideal para reuniones íntimas' },
  { name: 'Mediano', portions: '20-30 personas', desc: 'Perfecto para fiestas familiares' },
  { name: 'Grande', portions: '40-50 personas', desc: 'Para celebraciones grandes' },
  { name: 'XL', portions: '60+ personas', desc: 'Eventos masivos y bodas' },
];

export type Size = "Pequeño" | "Mediano" | "Grande" | "XL";

export function SizeSelector({ value, onChange }: Props) {
  return (
    <div className={styles.container}>
  <h3 className={styles.title}>
   
  </h3>

  <div className={styles.grid}>
    {sizes.map((size) => {
      const isSelected = value === size.name;

      return (
        <button
          key={size.name}
          onClick={() => onChange(size.name)}
          className={`${styles.button} ${isSelected ? styles.selected : ""}`}
        >
          <div className={styles.header}>
            <span className={`${styles.name} ${isSelected ? styles.nameSelected : ""}`}>
              {size.name}
            </span>

            <span className={`${styles.badge} ${isSelected ? styles.badgeSelected : ""}`}>
              {size.portions}
            </span>
          </div>

          <p className={`${styles.desc} ${isSelected ? styles.descSelected : ""}`}>
            {size.desc}
          </p>
        </button>
      );
    })}
  </div>
</div>
  );
}