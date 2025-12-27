import "./SectionItem.css";

type SectionItemParams = {
  title: string;
  subtitle: string;
};

export function SectionItem({ title, subtitle }: SectionItemParams) {
  return (
    <div className="section-item">
      <div className="section-item-image"></div>
      <div className="section-item-info">
        <p className="section-item-title">{title}</p>
        <p className="section-item-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
