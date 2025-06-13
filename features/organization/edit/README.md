# Organization Logo Feature

This feature allows organizations to upload and manage their logos, which will appear on invoices and other documents.

## Features

- **Logo Upload**: Upload organization logos in PNG, JPG, or SVG format
- **Logo Preview**: Real-time preview of uploaded logos
- **Logo Deletion**: Remove existing logos
- **Invoice Integration**: Logos automatically appear on generated invoice PDFs
- **File Validation**: Automatic validation of file type and size (max 2MB)

## Components

### GeneralSettingsTab
The main UI component for logo management, located in the General Settings tab of organization settings.

**Features:**
- Drag & drop file upload interface
- Image preview with proper aspect ratio
- Upload and delete buttons
- File validation feedback

### Actions

#### uploadLogoAction
Server action that handles logo upload to Supabase Storage.

**Process:**
1. Validates file type (must be image)
2. Validates file size (max 2MB)
3. Uploads to `organization-logos` bucket
4. Updates organization record with logo URL
5. Returns public URL

#### deleteLogoAction
Server action that removes logos from storage and database.

**Process:**
1. Extracts file path from current logo URL
2. Removes file from Supabase Storage
3. Updates organization record to remove logo URL

## Storage Structure

Logos are stored in Supabase Storage under the `organization-logos` bucket with the following structure:
```
organization-logos/
├── {organization-id}/
│   ├── logo-{timestamp}.png
│   ├── logo-{timestamp}.jpg
│   └── logo-{timestamp}.svg
```

## Invoice Integration

The logo functionality is integrated with the invoice PDF generation system:

1. **PDF Generation**: `generateInvoicePdf.tsx` fetches organization data including logo URL
2. **PDF Template**: `InvoicePdfView.tsx` displays the logo in the invoice header
3. **Responsive Layout**: Logo is properly sized and positioned in the PDF layout

## Usage

### In Organization Settings
1. Navigate to Dashboard → Settings
2. Go to the "Général" tab
3. Use the logo upload section to add/remove logos

### In Invoice PDFs
Logos automatically appear in the header of generated invoice PDFs when present.

## File Requirements

- **Supported formats**: PNG, JPG, JPEG, SVG
- **Maximum size**: 2MB
- **Recommended dimensions**: 200x200px or similar square/rectangular ratio
- **Background**: Transparent PNG recommended for best results

## Error Handling

The system includes comprehensive error handling for:
- Invalid file types
- Files exceeding size limits
- Storage upload failures
- Network connectivity issues
- Missing organization context

## Security

- File uploads are validated on both client and server side
- Files are stored in organization-specific folders
- Only authenticated organization members can upload/delete logos
- Public URLs are generated for PDF inclusion but require proper organization context 