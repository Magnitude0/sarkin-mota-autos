import { useConvex, useMutation } from "convex/react";
import { ImagePlus, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Car } from "@/components/site/CarCard";

const STATUS_OPTIONS = ["available", "sold", "reserved"] as const;
const BADGE_OPTIONS = [
  { value: "", label: "None" },
  { value: "new", label: "New" },
  { value: "hot", label: "Hot" },
] as const;
const BODY_TYPES = ["", "SUV", "Sedan", "Luxury", "Truck", "Electric"] as const;

interface MachineModalProps {
  open: boolean;
  onClose: () => void;
  editing: Car | null;
}

export function MachineModal({ open, onClose, editing }: MachineModalProps) {
  const convex = useConvex();
  const saveCar = useMutation(api.inventory.saveCar);
  const generateUploadUrl = useMutation(api.inventory.generateUploadUrl);

  const [form, setForm] = useState({
    title: "",
    price: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    fuel: "",
    bodyType: "",
    engine: "",
    transmission: "",
    color: "",
    status: "available" as (typeof STATUS_OPTIONS)[number],
    badge: "" as (typeof BADGE_OPTIONS)[number]["value"],
    description: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        title: editing.title,
        price: String(editing.price),
        make: editing.make ?? "",
        model: editing.model ?? "",
        year: editing.year ? String(editing.year) : "",
        mileage: editing.mileage ?? "",
        fuel: editing.fuel ?? "",
        bodyType: editing.bodyType ?? "",
        engine: editing.engine ?? "",
        transmission: editing.transmission ?? "",
        color: editing.color ?? "",
        status: editing.status,
        badge: editing.badge,
        description: editing.description ?? "",
      });
      setImages(editing.images ?? []);
    } else {
      setForm({
        title: "",
        price: "",
        make: "",
        model: "",
        year: "",
        mileage: "",
        fuel: "",
        bodyType: "",
        engine: "",
        transmission: "",
        color: "",
        status: "available",
        badge: "",
        description: "",
      });
      setImages([]);
    }
    setError(null);
  }, [open, editing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of list) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = (await res.json()) as { storageId: string };
        const url = await convex.query(api.inventory.getStorageUrl, {
          storageId,
        });
        if (url) setImages((prev) => [...prev, url]);
      }
    } catch {
      setError("One or more images failed to upload. Try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    const title = form.title.trim();
    const price = Number(form.price);
    if (!title) {
      setError("Title is required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("A valid price in Naira is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveCar({
        id: editing?._id,
        images,
        data: {
          title,
          price,
          make: form.make.trim() || undefined,
          model: form.model.trim() || undefined,
          year: form.year ? Number(form.year) : undefined,
          mileage: form.mileage.trim() || undefined,
          fuel: form.fuel.trim() || undefined,
          bodyType: form.bodyType || undefined,
          engine: form.engine.trim() || undefined,
          transmission: form.transmission.trim() || undefined,
          color: form.color.trim() || undefined,
          status: form.status,
          badge: form.badge,
          description: form.description.trim() || undefined,
        },
      });
      onClose();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save machine. Try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={editing ? "Edit machine" : "Add machine"}
      className="fixed inset-0 z-[1500] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[20px] border border-gold/25 bg-[#151517] shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-white/10 px-7 py-5">
          <h2 className="font-display text-lg font-black text-white">
            {editing ? "Edit Machine" : "Add New Machine"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[#bbb] transition-colors hover:border-gold/50 hover:text-gold"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-sm text-[#ff8b97]"
            >
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="m-title" className="field-label">
                Title *
              </label>
              <input
                id="m-title"
                className="input-dark"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Toyota Highlander 2021"
              />
            </div>

            <div>
              <label htmlFor="m-price" className="field-label">
                Price (₦) *
              </label>
              <input
                id="m-price"
                type="number"
                min={0}
                className="input-dark"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="18500000"
              />
            </div>
            <div>
              <label htmlFor="m-year" className="field-label">
                Year
              </label>
              <input
                id="m-year"
                type="number"
                min={1980}
                max={2030}
                className="input-dark"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2021"
              />
            </div>

            <div>
              <label htmlFor="m-make" className="field-label">
                Make
              </label>
              <input
                id="m-make"
                className="input-dark"
                value={form.make}
                onChange={(e) => set("make", e.target.value)}
                placeholder="Toyota"
              />
            </div>
            <div>
              <label htmlFor="m-model" className="field-label">
                Model
              </label>
              <input
                id="m-model"
                className="input-dark"
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="Highlander"
              />
            </div>

            <div>
              <label htmlFor="m-mileage" className="field-label">
                Mileage
              </label>
              <input
                id="m-mileage"
                className="input-dark"
                value={form.mileage}
                onChange={(e) => set("mileage", e.target.value)}
                placeholder="45,000 km"
              />
            </div>
            <div>
              <label htmlFor="m-fuel" className="field-label">
                Fuel Type
              </label>
              <input
                id="m-fuel"
                className="input-dark"
                value={form.fuel}
                onChange={(e) => set("fuel", e.target.value)}
                placeholder="Petrol / Diesel / Electric"
              />
            </div>

            <div>
              <label htmlFor="m-body" className="field-label">
                Body Type
              </label>
              <select
                id="m-body"
                className="select-dark"
                value={form.bodyType}
                onChange={(e) => set("bodyType", e.target.value)}
              >
                {BODY_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b === "" ? "Select body type" : b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="m-engine" className="field-label">
                Engine
              </label>
              <input
                id="m-engine"
                className="input-dark"
                value={form.engine}
                onChange={(e) => set("engine", e.target.value)}
                placeholder="3.5L V6"
              />
            </div>

            <div>
              <label htmlFor="m-trans" className="field-label">
                Transmission
              </label>
              <input
                id="m-trans"
                className="input-dark"
                value={form.transmission}
                onChange={(e) => set("transmission", e.target.value)}
                placeholder="Automatic"
              />
            </div>
            <div>
              <label htmlFor="m-color" className="field-label">
                Color
              </label>
              <input
                id="m-color"
                className="input-dark"
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                placeholder="Pearl White"
              />
            </div>

            <div>
              <label htmlFor="m-status" className="field-label">
                Status
              </label>
              <select
                id="m-status"
                className="select-dark"
                value={form.status}
                onChange={(e) =>
                  set("status", e.target.value as typeof form.status)
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="m-badge" className="field-label">
                Badge
              </label>
              <select
                id="m-badge"
                className="select-dark"
                value={form.badge}
                onChange={(e) => set("badge", e.target.value as typeof form.badge)}
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="m-desc" className="field-label">
                Description
              </label>
              <textarea
                id="m-desc"
                rows={4}
                className="textarea-dark resize-none"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Full details about this machine…"
              />
            </div>
          </div>

          {/* Images */}
          <div className="mt-5">
            <p className="field-label">Images</p>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload machine images"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void uploadFiles(e.dataTransfer.files);
              }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                dragOver
                  ? "border-gold bg-gold/10"
                  : "border-white/20 hover:border-gold/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) void uploadFiles(e.target.files);
                }}
              />
              {uploading ? (
                <Loader2 className="h-7 w-7 animate-spin text-gold" />
              ) : (
                <UploadCloud className="h-7 w-7 text-gold" />
              )}
              <p className="text-sm font-semibold text-white">
                {uploading ? "Uploading…" : "Drag & drop images here"}
              </p>
              <p className="text-xs text-[#888]">
                or click to browse — JPG, PNG, WEBP
              </p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((src, i) => (
                  <div
                    key={src + i}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                  >
                    <img
                      src={src}
                      alt={`Machine image ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove image ${i + 1}`}
                      onClick={() => removeImage(i)}
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-red group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-7 py-4">
          <button type="button" onClick={onClose} className="btn btn-outline-white btn-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-red btn-sm disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                {editing ? "Save Changes" : "Add Machine"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
