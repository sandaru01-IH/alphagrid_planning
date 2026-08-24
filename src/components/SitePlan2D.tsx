import { motion } from "framer-motion";

interface Props {
  siteWidthM: number;
  siteDepthM: number;
  footprintWidthM: number;
  footprintDepthM: number;
  governingConstraint: "setback" | "coverage";
}

export default function SitePlan2D({ siteWidthM, siteDepthM, footprintWidthM, footprintDepthM, governingConstraint }: Props) {
  const pad = 24;
  const size = 260;
  const scale = Math.min((size - pad * 2) / Math.max(siteWidthM, 1), (size - pad * 2) / Math.max(siteDepthM, 1));

  const siteW = siteWidthM * scale;
  const siteD = siteDepthM * scale;
  const fpW = footprintWidthM * scale;
  const fpD = footprintDepthM * scale;

  const siteX = (size - siteW) / 2;
  const siteY = (size - siteD) / 2;
  const fpX = (size - fpW) / 2;
  const fpY = (size - fpD) / 2;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
      <rect x={0} y={0} width={size} height={size} fill="var(--surface-0)" rx={12} />
      <rect
        x={siteX}
        y={siteY}
        width={Math.max(siteW, 1)}
        height={Math.max(siteD, 1)}
        fill="none"
        stroke="var(--ink-3)"
        strokeDasharray="4 3"
        strokeWidth={1.2}
      />
      <motion.rect
        initial={{ x: fpX, y: fpY, width: Math.max(fpW, 0), height: Math.max(fpD, 0) }}
        animate={{ x: fpX, y: fpY, width: Math.max(fpW, 0), height: Math.max(fpD, 0) }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        fill={governingConstraint === "setback" ? "var(--gold)" : "var(--brand)"}
        fillOpacity={0.28}
        stroke={governingConstraint === "setback" ? "var(--gold-strong)" : "var(--brand-strong)"}
        strokeWidth={1.5}
        rx={2}
      />
      <text x={siteX} y={siteY - 8} fontSize={9} fill="var(--ink-3)" fontFamily="IBM Plex Mono, monospace">
        parcel {siteWidthM}×{siteDepthM.toFixed(1)}m
      </text>
    </svg>
  );
}
