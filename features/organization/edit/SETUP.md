# Organization Logo Setup

## Supabase Storage Bucket Setup

Before using the organization logo feature, you need to create the required storage bucket in Supabase.

### 1. Create Storage Bucket

In your Supabase dashboard:

1. Go to **Storage** → **Buckets**
2. Click **New bucket**
3. Set the following configuration:

```
Bucket name: organization-logos
Public bucket: true (for PDF generation access)
File size limit: 2MB
Allowed MIME types: image/png, image/jpeg, image/jpg, image/svg+xml
```

### 2. Set Bucket Policies

Create the following RLS policies for the `organization-logos` bucket:

#### Policy 1: Allow authenticated users to upload to their organization folder
```sql
CREATE POLICY "Users can upload to their organization folder" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'organization-logos' AND
  (storage.foldername(name))[1] IN (
    SELECT organization_id::text 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
);
```

#### Policy 2: Allow authenticated users to delete from their organization folder
```sql
CREATE POLICY "Users can delete from their organization folder" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'organization-logos' AND
  (storage.foldername(name))[1] IN (
    SELECT organization_id::text 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
);
```

#### Policy 3: Allow public read access for PDF generation
```sql
CREATE POLICY "Public read access for logos" ON storage.objects
FOR SELECT USING (bucket_id = 'organization-logos');
```

### 3. Alternative: Manual Bucket Creation via SQL

If you prefer to create the bucket via SQL:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'organization-logos',
  'organization-logos',
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
);
```

### 4. Verify Setup

After setup, verify that:

1. The bucket `organization-logos` exists
2. The bucket is public (for PDF access)
3. RLS policies are correctly applied
4. File size and MIME type restrictions are in place

### 5. Environment Variables

Ensure your environment has the necessary Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing the Setup

1. Navigate to your application's organization settings
2. Go to the "Général" tab
3. Try uploading a test logo (PNG/JPG under 2MB)
4. Verify the logo appears in the preview
5. Generate an invoice PDF to confirm the logo appears

## Troubleshooting

### Common Issues

1. **Upload fails with "bucket not found"**
   - Verify the bucket name is exactly `organization-logos`
   - Check bucket exists in Supabase dashboard

2. **Upload fails with "permission denied"**
   - Verify RLS policies are correctly applied
   - Check user is authenticated and member of organization

3. **Logo doesn't appear in PDF**
   - Verify bucket is public
   - Check logo URL is accessible
   - Ensure PDF generation has proper organization context

4. **File size/type errors**
   - Verify bucket MIME type restrictions
   - Check file size limit (2MB)
   - Ensure client-side validation matches server-side

### Debug Commands

Check bucket configuration:
```sql
SELECT * FROM storage.buckets WHERE id = 'organization-logos';
```

Check RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

Check organization membership:
```sql
SELECT * FROM organization_members WHERE user_id = auth.uid();
``` 