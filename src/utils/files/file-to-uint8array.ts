export async function fileToUint8Array(file: File): Promise<Uint8Array | undefined | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      if (!ev.target) {
        resolve(null);
      }
      const bytes = ev.target!.result;
      if (!bytes) {
        resolve(null);
      }

      resolve(new Uint8Array(bytes as ArrayBuffer));
    };
    reader.onerror = err => {
      reject(err);
    };
    reader.readAsArrayBuffer(file);
  });
}
