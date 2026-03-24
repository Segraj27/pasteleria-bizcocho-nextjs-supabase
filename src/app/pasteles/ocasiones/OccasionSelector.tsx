import { PartyPopper, Heart, Gift, Baby, GraduationCap, Crown, Flower2, Sparkles } from 'lucide-react';
import styles from "./occasionselector.module.css";

// Definición de tipos
export type Occasion = "Cumpleaños" | "Boda" | "Aniversario" | "Baby Shower" | "Graduación" | "XV Años" | "Día de la Madre" | "Otro";

interface Props {
  value: Occasion;
  onChange: (occasion: Occasion) => void;
}

const occasions: { name: Occasion; icon: React.ElementType }[] = [
  { name: 'Cumpleaños', icon: PartyPopper },
  { name: 'Boda', icon: Heart },
  { name: 'Aniversario', icon: Gift },
  { name: 'Baby Shower', icon: Baby },
  { name: 'Graduación', icon: GraduationCap },
  { name: 'XV Años', icon: Crown },
  { name: 'Día de la Madre', icon: Flower2 },
  { name: 'Otro', icon: Sparkles },
];

export function OccasionSelector({ value, onChange }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {occasions.map((occ) => {
          const Icon = occ.icon;
          const isSelected = value === occ.name;

          return (
            <button
              key={occ.name}
              type="button"
              onClick={() => onChange(occ.name)}
              /* Si está seleccionado, aplicamos ambas clases: la base y la de 'selected' */
              className={`${styles.button} ${isSelected ? styles.selected : ""}`}
            >
              <Icon className={styles.icon} />
              <span className={styles.text}>{occ.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}