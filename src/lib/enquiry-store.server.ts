import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export interface StoredEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string | null;
  service: string;
  message: string;
  createdAt: string;
}

// In-memory cache across server requests on this instance
const inMemoryEnquiries: StoredEnquiry[] = [];

function getCacheFilePath(): string {
  try {
    return path.join(os.tmpdir(), "dma_website_enquiries.json");
  } catch {
    return "/tmp/dma_website_enquiries.json";
  }
}

export function saveServerEnquiry(enquiry: StoredEnquiry): void {
  // 1. Save in memory cache
  const exists = inMemoryEnquiries.some(
    (e) => e.id === enquiry.id || (e.email === enquiry.email && e.createdAt === enquiry.createdAt)
  );
  if (!exists) {
    inMemoryEnquiries.unshift(enquiry);
  }

  // 2. Persist to temp file storage
  try {
    const filePath = getCacheFilePath();
    let list: StoredEnquiry[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        list = JSON.parse(raw);
      } catch {
        list = [];
      }
    }
    const alreadyInFile = list.some(
      (e) => e.id === enquiry.id || (e.email === enquiry.email && e.createdAt === enquiry.createdAt)
    );
    if (!alreadyInFile) {
      list.unshift(enquiry);
      if (list.length > 300) list = list.slice(0, 300);
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not persist server enquiry to file:", err);
  }
}

export function getServerEnquiries(): StoredEnquiry[] {
  const mergedMap = new Map<string, StoredEnquiry>();

  // In-memory items
  for (const item of inMemoryEnquiries) {
    mergedMap.set(item.id, item);
  }

  // Read from file
  try {
    const filePath = getCacheFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const list = JSON.parse(raw) as StoredEnquiry[];
      if (Array.isArray(list)) {
        for (const item of list) {
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not read server enquiries file:", err);
  }

  return Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
