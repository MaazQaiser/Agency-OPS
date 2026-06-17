import { PageHeader } from "@/components/ui/PageHeader";
import { ProductionModule } from "@/components/production/ProductionModule";
import { productionHeader } from "@/data/producerScorecard";

export default function ProducerPage() {
  return (
    <div className="module-production">
      <div className="page-container">
        <PageHeader
          title={productionHeader.title}
          titleEmphasis={productionHeader.titleEmphasis}
          patent={productionHeader.patent}
          variant="production"
        />
        <ProductionModule />
      </div>
    </div>
  );
}
