// src/features/googleworkspace/services/driveService.ts
// Servicio para Google Drive API

import { getValidAccessToken } from './googleOAuthService'

// Interfaces
export interface DriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  thumbnailLink?: string
  size?: string
  modifiedTime: string
  owners?: Array<{ displayName: string; emailAddress: string }>
  shared: boolean
}

export interface UploadFileParams {
  name: string
  content: Blob | File
  mimeType?: string
  parents?: string[]
}

/**
 * Listar archivos
 */
export async function listFiles(
  pageSize: number = 20,
  query?: string
): Promise<DriveFile[]> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const params = new URLSearchParams({
    pageSize: pageSize.toString(),
    fields: 'files(id,name,mimeType,webViewLink,thumbnailLink,size,modifiedTime,owners,shared)',
    orderBy: 'modifiedTime desc'
  })

  if (query) {
    params.set('q', query)
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al listar archivos')
  }

  const data = await response.json()
  return data.files || []
}

/**
 * Subir archivo
 */
export async function uploadFile(params: UploadFileParams): Promise<DriveFile> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  // Metadata del archivo
  const metadata = {
    name: params.name,
    mimeType: params.mimeType || params.content.type || 'application/octet-stream',
    parents: params.parents || []
  }

  // Crear multipart request
  const boundary = '-------314159265358979323846'
  const delimiter = `\r\n--${boundary}\r\n`
  const closeDelimiter = `\r\n--${boundary}--`

  const metadataPart =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata)

  const mediaPart =
    '\r\nContent-Type: ' + params.mimeType + '\r\n\r\n'

  const requestBody = metadataPart + mediaPart + closeDelimiter

  // Convertir Blob a ArrayBuffer
  const arrayBuffer = await params.content.arrayBuffer()
  const combinedBody = new Blob([
    requestBody,
    arrayBuffer
  ], { type: `multipart/related; boundary=${boundary}` })

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=*',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: combinedBody
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al subir archivo')
  }

  return await response.json()
}

/**
 * Crear carpeta
 */
export async function createFolder(name: string, parentId?: string): Promise<DriveFile> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentId ? [parentId] : []
  }

  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files?fields=*',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al crear carpeta')
  }

  return await response.json()
}

/**
 * Compartir archivo
 */
export async function shareFile(
  fileId: string,
  email: string,
  role: 'reader' | 'writer' | 'commenter' = 'writer'
): Promise<void> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const permission = {
    role,
    type: 'user',
    emailAddress: email
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?sendNotificationEmail=true`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(permission)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al compartir archivo')
  }
}

/**
 * Buscar archivos
 */
export async function searchFiles(query: string, pageSize: number = 20): Promise<DriveFile[]> {
  // Escape comillas en la query
  const escapedQuery = query.replace(/'/g, "\\'")
  const searchQuery = `name contains '${escapedQuery}'`

  return listFiles(pageSize, searchQuery)
}

/**
 * Obtener enlace de compartir
 */
export function getShareLink(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
}

/**
 * Formatear tamaño de archivo
 */
export function formatFileSize(bytes?: string): string {
  if (!bytes) return 'Desconocido'

  const size = parseInt(bytes)
  const units = ['B', 'KB', 'MB', 'GB']
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    unitIndex++
  }

  return `${(size / Math.pow(1024, unitIndex)).toFixed(1)} ${units[unitIndex]}`
}

/**
 * Obtener icono según tipo MIME
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.includes('folder')) return '📁'
  if (mimeType.includes('pdf')) return '📄'
  if (mimeType.includes('image')) return '🖼️'
  if (mimeType.includes('video')) return '🎥'
  if (mimeType.includes('audio')) return '🎵'
  if (mimeType.includes('document')) return '📝'
  if (mimeType.includes('spreadsheet')) return '📊'
  if (mimeType.includes('presentation')) return '📽️'
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️'
  return '📎'
}
