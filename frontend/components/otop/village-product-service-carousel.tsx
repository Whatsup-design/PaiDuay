import type { ProductService } from "@/app/(main)/otop/data";
import { OtopCarousel } from "@/components/otop/otop-carousel";
import { ProductServiceCard } from "@/components/otop/product-service-card";

type VillageProductServiceCarouselProps = {
  items: ProductService[];
  villageName: string;
};

export function VillageProductServiceCarousel({
  items,
  villageName
}: VillageProductServiceCarouselProps) {
  return (
    <OtopCarousel
      title="Product & Service"
      description={`Local products and services from ${villageName}.`}
      emptyMessage={
        items.length === 0
          ? "This village does not have products or services yet."
          : undefined
      }
    >
      {items.map((item) => (
        <ProductServiceCard
          key={item.slug ?? item.id ?? item.name}
          item={item}
        />
      ))}
    </OtopCarousel>
  );
}
