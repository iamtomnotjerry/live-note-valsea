/** Float32 mono (-1..1) -> Int16 PCM little-endian samples */
export function float32ToPcm16(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i] ?? 0));
    out[i] = s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
  }
  return out;
}

/** Downsample mono float32 to 16 kHz Int16 PCM (VALSEA RTT input). */
export function downsampleTo16kPcm16(
  input: Float32Array,
  inputSampleRate: number,
): Int16Array {
  const outRate = 16000;
  if (!input.length) return new Int16Array(0);
  if (inputSampleRate === outRate) {
    return float32ToPcm16(input);
  }
  const ratio = inputSampleRate / outRate;
  const outLength = Math.floor(input.length / ratio);
  const out = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(Math.floor((i + 1) * ratio), input.length);
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j] ?? 0;
    const avg = sum / Math.max(1, end - start);
    const s = Math.max(-1, Math.min(1, avg));
    out[i] = s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
  }
  return out;
}

export function pcm16ToBase64(pcm: Int16Array): string {
  const u8 = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  let binary = "";
  for (let i = 0; i < u8.length; i++) {
    binary += String.fromCharCode(u8[i]!);
  }
  return btoa(binary);
}
