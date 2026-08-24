import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  PANADURA_CENTER,
  PANADURA_DEFAULT_ZOOM,
  deriveParcelMetrics,
  type LatLng,
} from "../lib/geo";
import { useTheme } from "../state/theme";

export type MapBasemap = "voyager" | "satellite";

const TILES: Record<
  MapBasemap,
  { url: string; attribution: string; maxZoom: number }
> = {
  voyager: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
  },
};

interface ParcelMapProps {
  ring: LatLng[] | null;
  onApply: (ring: LatLng[], metrics: { siteAreaM2: number; frontageM: number }) => void;
  onClear: () => void;
  className?: string;
  height?: number | string;
}

function DrawHandler({
  drawing,
  draft,
  setDraft,
  onComplete,
}: {
  drawing: boolean;
  draft: LatLng[];
  setDraft: (pts: LatLng[]) => void;
  onComplete: (pts: LatLng[]) => void;
}) {
  useMapEvents({
    click(e) {
      if (!drawing) return;
      setDraft([...draft, { lat: e.latlng.lat, lng: e.latlng.lng }]);
    },
    dblclick(e) {
      if (!drawing) return;
      L.DomEvent.stop(e.originalEvent);
      if (draft.length >= 3) onComplete(draft);
    },
  });
  return null;
}

function FitToRing({ ring }: { ring: LatLng[] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!ring || ring.length < 2) return;
    const bounds = L.latLngBounds(ring.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.35), { animate: true });
  }, [ring, map]);
  return null;
}

function InvalidateOnResize() {
  const map = useMap();
  useEffect(() => {
    const t = window.setTimeout(() => map.invalidateSize(), 80);
    return () => window.clearTimeout(t);
  }, [map]);
  return null;
}

export default function ParcelMap({ ring, onApply, onClear, className, height = 420 }: ParcelMapProps) {
  const { resolved } = useTheme();
  const [basemap, setBasemap] = useState<MapBasemap>("voyager");
  const [drawing, setDrawing] = useState(false);
  const [draft, setDraft] = useState<LatLng[]>([]);

  const activeRing = drawing ? draft : ring ?? [];
  const previewMetrics = useMemo(() => {
    if (activeRing.length < 3) return null;
    return deriveParcelMetrics(activeRing);
  }, [activeRing]);

  const finishDraft = useCallback(
    (pts: LatLng[]) => {
      if (pts.length < 3) return;
      const metrics = deriveParcelMetrics(pts);
      onApply(pts, { siteAreaM2: metrics.siteAreaM2, frontageM: metrics.frontageM });
      setDraft([]);
      setDrawing(false);
    },
    [onApply]
  );

  const startDraw = () => {
    setDraft([]);
    setDrawing(true);
  };

  const cancelDraw = () => {
    setDraft([]);
    setDrawing(false);
  };

  const fill = resolved === "dark" ? "rgba(43, 203, 184, 0.28)" : "rgba(15, 111, 102, 0.22)";
  const stroke = resolved === "dark" ? "#2bcbb8" : "#0f6f66";

  return (
    <div
      className={className}
      style={{
        borderRadius: 16,
        border: "1px solid var(--surface-2-border)",
        background: "var(--surface-1)",
        overflow: "hidden",
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"
        style={{ borderColor: "var(--surface-2-border)" }}
      >
        <div>
          <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
            Draw your parcel on the map
          </h3>
          <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "var(--ink-3)" }}>
            {drawing
              ? "Click corners on the map. Double-click or press Complete when finished (3+ points)."
              : "Sketch the boundary — area and frontage feed the regulation engine automatically."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex rounded-full p-0.5"
            style={{ background: "var(--surface-sunken)", border: "1px solid var(--line)" }}
          >
            {(
              [
                ["voyager", "Map"],
                ["satellite", "Satellite"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setBasemap(id)}
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: basemap === id ? "var(--surface-1)" : "transparent",
                  color: basemap === id ? "var(--ink-1)" : "var(--ink-3)",
                  boxShadow: basemap === id ? "var(--shadow-sm)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {!drawing ? (
            <>
              <button
                type="button"
                onClick={startDraw}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold"
                style={{ background: "var(--brand)", color: "var(--surface-1)" }}
              >
                {ring?.length ? "Redraw" : "Start drawing"}
              </button>
              {ring && ring.length >= 3 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{ border: "1px solid var(--line-strong)", color: "var(--ink-2)" }}
                >
                  Clear
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={draft.length < 3}
                onClick={() => finishDraft(draft)}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold disabled:opacity-40"
                style={{ background: "var(--brand)", color: "var(--surface-1)" }}
              >
                Complete
              </button>
              <button
                type="button"
                onClick={cancelDraw}
                className="rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ border: "1px solid var(--line-strong)", color: "var(--ink-2)" }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ height, position: "relative" }} className={drawing ? "cursor-crosshair" : undefined}>
        <MapContainer
          center={[PANADURA_CENTER.lat, PANADURA_CENTER.lng]}
          zoom={PANADURA_DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          doubleClickZoom={false}
          zoomControl
          attributionControl
        >
          <TileLayer
            key={basemap}
            url={TILES[basemap].url}
            attribution={TILES[basemap].attribution}
            maxZoom={TILES[basemap].maxZoom}
            subdomains={basemap === "voyager" ? "abcd" : undefined}
          />
          <InvalidateOnResize />
          <FitToRing ring={!drawing ? ring : null} />
          <DrawHandler
            drawing={drawing}
            draft={draft}
            setDraft={setDraft}
            onComplete={finishDraft}
          />

          {activeRing.length >= 3 && (
            <Polygon
              positions={activeRing.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{
                color: stroke,
                weight: 2.5,
                fillColor: fill,
                fillOpacity: 1,
              }}
            />
          )}
          {drawing && draft.length >= 2 && (
            <Polyline
              positions={draft.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{ color: stroke, weight: 2, dashArray: "6 6" }}
            />
          )}
          {(drawing ? draft : ring ?? []).map((p, i) => (
            <CircleMarker
              key={`${p.lat}-${p.lng}-${i}`}
              center={[p.lat, p.lng]}
              radius={5}
              pathOptions={{
                color: "#fff",
                weight: 2,
                fillColor: stroke,
                fillOpacity: 1,
              }}
            />
          ))}
        </MapContainer>

        {previewMetrics && (
          <div
            className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-xl border px-3 py-2 text-xs shadow-lg backdrop-blur-md"
            style={{
              background: "color-mix(in srgb, var(--surface-1) 92%, transparent)",
              borderColor: "var(--surface-2-border)",
              color: "var(--ink-1)",
            }}
          >
            <span className="font-mono-data font-bold">{previewMetrics.siteAreaM2.toLocaleString()}</span> m²
            <span className="mx-2" style={{ color: "var(--ink-3)" }}>
              ·
            </span>
            <span className="font-mono-data font-bold">{previewMetrics.frontageM}</span> m frontage
          </div>
        )}
      </div>
    </div>
  );
}
