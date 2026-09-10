/**
 * API client. All data flows through here.
 *
 * Mock mode (current): served from src/lib/mock/db.ts, shaped exactly like
 * the frozen LLD-B contracts. Real mode: flip USE_REAL_API to true and the
 * same functions hit the gateway — only BASE_URL needs to change.
 */

const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === "true";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  trace_id?: string;
}

export class ContractError extends Error {
  constructor(public problem: ApiError) {
    super(problem.detail);
    this.name = "ContractError";
  }
}

/** Methods that write a decision or spend model tokens — the frozen contract
 * requires an Idempotency-Key on every one, so a double tap on hotel wifi
 * cannot produce two scoring runs or two calibration entries. */
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function newIdempotencyKey(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  // Non-secure context fallback (contract only requires minLength 8).
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  // Demo identity. The real deployment sends a verified JWT and the backend
  // reads the same three facts from it; what the backend does next (push the
  // identity into the database session so row level security applies) is
  // identical either way.
  if (!headers.has("X-CE-Actor")) {
    headers.set("X-CE-Actor", currentActor());
  }
  if (WRITE_METHODS.has(method) && !headers.has("Idempotency-Key")) {
    headers.set("Idempotency-Key", newIdempotencyKey());
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method,
    headers,
    // Never cached, and never prerendered.
    //
    // Next caches fetches in Server Components and will happily render a page
    // at BUILD time and serve that HTML forever. The manager console then
    // shows whatever the queue contained the last time Vercel deployed:
    // observed here as "0 recommendations waiting" while the API had nine.
    // Every read on this client is a read of live coaching data about a real
    // decision someone is about to make, so none of it may be stale.
    cache: "no-store",
  });

  if (!res.ok) {
    const problem = (await res.json().catch(() => ({}))) as Partial<ApiError>;
    throw new ContractError({
      type: problem.type ?? "about:blank",
      title: problem.title ?? "Request failed",
      status: res.status,
      detail: problem.detail ?? `HTTP ${res.status}`,
      instance: problem.instance,
      trace_id: problem.trace_id,
    });
  }
  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  /** Multipart upload. Separate from post() because the browser has to set
   * its own Content-Type with the boundary, and request() always sets JSON. */
  upload: async <T>(path: string, file: Blob, filename: string): Promise<T> => {
    const form = new FormData();
    form.append("file", file, filename);
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: form,
      headers: {
        "X-CE-Actor": currentActor(),
        "Idempotency-Key": newIdempotencyKey(),
      },
    });
    if (!res.ok) {
      const problem = (await res.json().catch(() => ({}))) as Partial<ApiError>;
      throw new ContractError({
        type: problem.type ?? "about:blank",
        title: problem.title ?? "Upload failed",
        status: res.status,
        detail: problem.detail ?? `HTTP ${res.status}`,
      });
    }
    return res.json() as Promise<T>;
  },
};

/** Who the browser is acting as. Derived from the route so the manager and
 * staff views get different identities without a login step, which keeps the
 * demo to one click while still exercising the real authorisation path. */
export function currentActor(): string {
  if (typeof window !== "undefined") {
    const override = window.localStorage.getItem("ce_actor");
    if (override) return override;
    if (window.location.pathname.startsWith("/staff")) return "Diego";
  }
  return "Marta";
}

export const isRealApi = (): boolean => USE_REAL_API;
