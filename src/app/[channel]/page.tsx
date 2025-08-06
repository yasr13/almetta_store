// src/app/[channel]/page.tsx
import { print } from "graphql";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql/fetch";

export const revalidate = 60;

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = await params;

  try {
    const data = await executeGraphQL<{
      collection: {
        products: { edges: { node: any }[] };
      };
    }>(
      "https://store-dglxxmc9.saleor.cloud/graphql/",
      {
        method: "POST",
        body: JSON.stringify({
          query: print(ProductListByCollectionDocument),
          variables: {
            slug: "homepage",
            channel,
          },
        }),
      }
    );

    const products = data.collection?.products?.edges.map(({ node }) => node) || [];

    return (
      <main className="py-8">
        <h1 className="text-3xl font-bold text-center">Produk Kami</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 px-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow">
                <img
                  src={product.thumbnail?.url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-lg text-gray-700">
                    Rp{(product.pricing?.priceRange?.start?.gross?.amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Produk tidak ditemukan.</p>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return <div className="text-center py-12">Gagal memuat produk.</div>;
  }
}