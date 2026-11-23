import { supabase } from './supabase'

export interface Recording {
  id: string; name: string; storage_path: string; mime_type: string
  duration_seconds: number; size_bytes: number; created_at: string
}
const BUCKET = 'recordings'

function db() {
  if (!supabase) throw new Error('Supabase não configurado')
  return supabase
}

export async function listRecordings(): Promise<Recording[]> {
  const { data, error } = await db().from('recordings').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Recording[]
}

// Envia o áudio e só então cria o registro. Se o registro falhar, remove o arquivo (sem sobras).
export async function saveRecording(userId: string, blob: Blob, name: string, durationSeconds: number): Promise<Recording> {
  const mime = (blob.type || 'audio/webm').split(';')[0]
  const ext = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm'
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
  const up = await db().storage.from(BUCKET).upload(path, blob, { contentType: mime })
  if (up.error) throw up.error
  const ins = await db().from('recordings')
    .insert({ name, storage_path: path, mime_type: mime, duration_seconds: durationSeconds, size_bytes: blob.size })
    .select().single()
  if (ins.error) {
    await db().storage.from(BUCKET).remove([path])
    throw ins.error
  }
  return ins.data as Recording
}

export async function renameRecording(id: string, name: string): Promise<Recording> {
  const { data, error } = await db().from('recordings').update({ name }).eq('id', id).select().single()
  if (error) throw error
  return data as Recording
}

export async function deleteRecording(rec: Recording): Promise<void> {
  const { data, error } = await db().from('recordings').delete().eq('id', rec.id).select()
  if (error) throw error
  if (!data || data.length === 0) throw new Error('A gravação não foi apagada.')
  await db().storage.from(BUCKET).remove([rec.storage_path]) // se falhar, só sobra um arquivo órfão
}

export async function getPlaybackUrl(rec: Recording): Promise<string> {
  const { data, error } = await db().storage.from(BUCKET).createSignedUrl(rec.storage_path, 3600)
  if (error) throw error
  return data.signedUrl
}
