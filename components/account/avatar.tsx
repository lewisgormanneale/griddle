import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const downloadImage = async (path: string) => {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);

        if (error) throw error;

        const bucketUrl = URL.createObjectURL(data);
        setAvatarUrl(bucketUrl);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    };
    if (url) {
      downloadImage(url);
    }
  }, [url]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2" style={{ width: size }}>
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full border"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="rounded-full bg-muted border"
          style={{ height: size, width: size }}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={triggerFileInput}
        className={cn("w-full", uploading && "cursor-not-allowed opacity-50")}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Avatar"}
      </Button>
    </div>
  );
}
