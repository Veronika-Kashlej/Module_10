import "./SectionItem.css";

type SectionItemParams = {
  title: string;
  subtitle: string;
  image: string;
};

export function SectionItem({ title, subtitle, image }: SectionItemParams) {
  return (
    <div className="section-item">
      <img className="section-item-image" src={image} alt="profile"></img>
      <div className="section-item-info">
        <p className="section-item-title">{title}</p>
        <p className="section-item-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
