import { notFound } from "next/navigation"

import { OfficialAssetDetailPage } from "@/components/official-assets-page"
import { getOfficialAssetById } from "@/lib/official-assets"

export default async function OfficialAssetDetailRoute({
  params,
}: {
  params: Promise<{ assetId: string }>
}) {
  const { assetId } = await params
  const asset = getOfficialAssetById(assetId)

  if (!asset) {
    notFound()
  }

  return <OfficialAssetDetailPage asset={asset} />
}
