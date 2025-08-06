// src/app/[channel]/layout.tsx
import { ChannelsListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql/fetch";
import { print } from "graphql";

export default async function ChannelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ channel: string }>;
}) {
  const { channel } = await params;

  // Ambil daftar channel untuk navigasi
  const { shop } = await executeGraphQL<{
    shop: { channels: { id: string; slug: string; name: string }[] };
  }>(
    "https://store-dglxxmc9.saleor.cloud/graphql/",
    {
      method: "POST",
      body: JSON.stringify({
        query: print(ChannelsListDocument),
      }),
    }
  );

  return (
    <div>
      {/* Navbar dengan daftar channel */}
      <nav className="bg-gray-100 p-4">
        <select
          value={channel}
          onChange={(e) => (window.location.href = `/${e.target.value}`)}
        >
          {shop.channels.map((ch) => (
            <option key={ch.id} value={ch.slug}>
              {ch.name}
            </option>
          ))}
        </select>
      </nav>

      <main>{children}</main>
    </div>
  );
}