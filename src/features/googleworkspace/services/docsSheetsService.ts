// src/features/googleworkspace/services/docsSheetsService.ts
// Servicio para Google Docs y Google Sheets API

import { getValidAccessToken } from './googleOAuthService'

// Interfaces
export interface GoogleDoc {
  documentId: string
  title: string
  body?: {
    content: any[]
  }
}

export interface GoogleSheet {
  spreadsheetId: string
  properties: {
    title: string
  }
  sheets: Array<{
    properties: {
      sheetId: number
      title: string
    }
  }>
}

export interface CreateDocParams {
  title: string
  content?: string
}

// ============================= DOCS =============================

/**
 * Crear documento Google Doc
 */
export async function createDoc(params: CreateDocParams): Promise<GoogleDoc> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const doc = {
    title: params.title
  }

  const response = await fetch(
    'https://docs.googleapis.com/v1/documents?fields=documentId,title',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doc)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al crear documento')
  }

  const createdDoc = await response.json()

  // Si hay contenido inicial, agregarlo
  if (params.content) {
    await appendTextToDoc(createdDoc.documentId, params.content)
  }

  return createdDoc
}

/**
 * Agregar texto al documento
 */
export async function appendTextToDoc(
  documentId: string,
  text: string
): Promise<void> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido.')
  }

  const requests = [
    {
      insertText: {
        location: {
          index: 1 // Insertar al final (-1 es el final, pero 1 funciona para docs nuevos)
        },
        text: text
      }
    }
  ]

  const response = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al agregar texto')
  }
}

/**
 * Obtener documento
 */
export async function getDoc(documentId: string): Promise<GoogleDoc> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido.')
  }

  const response = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al obtener documento')
  }

  return await response.json()
}

/**
 * Obtener URL del documento
 */
export function getDocUrl(documentId: string): string {
  return `https://docs.google.com/document/d/${documentId}/edit`
}

// ============================= SHEETS =============================

/**
 * Crear hoja de cálculo Google Sheet
 */
export async function createSheet(params: CreateDocParams): Promise<GoogleSheet> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const spreadsheet = {
    properties: {
      title: params.title
    },
    sheets: [
      {
        properties: {
          title: 'Hoja 1'
        }
      }
    ]
  }

  const response = await fetch(
    'https://sheets.googleapis.com/v4/spreadsheets?fields=spreadsheetId,properties,sheets',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spreadsheet)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al crear hoja de cálculo')
  }

  const createdSheet = await response.json()

  // Si hay contenido inicial, agregarlo
  if (params.content) {
    // Asumimos que el contenido es un valor simple para la celda A1
    await updateCell(createdSheet.spreadsheetId, 'Hoja 1', 'A1', [[params.content]])
  }

  return createdSheet
}

/**
 * Actualizar celda
 */
export async function updateCell(
  spreadsheetId: string,
  sheetName: string,
  cellRange: string,
  values: string[][]
): Promise<void> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido.')
  }

  const range = `'${sheetName}'!${cellRange}`

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: values
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al actualizar celda')
  }
}

/**
 * Obtener valores de un rango
 */
export async function getValues(
  spreadsheetId: string,
  sheetName: string,
  cellRange: string = 'A1:Z100'
): Promise<string[][]> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido.')
  }

  const range = `'${sheetName}'!${cellRange}`

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al obtener valores')
  }

  const data = await response.json()
  return data.values || []
}

/**
 * Agregar fila a la hoja
 */
export async function appendRow(
  spreadsheetId: string,
  sheetName: string,
  values: string[]
): Promise<void> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido.')
  }

  const range = `'${sheetName}'!A1:Z1`

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [values]
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al agregar fila')
  }
}

/**
 * Obtener URL de la hoja de cálculo
 */
export function getSheetUrl(spreadsheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
}
