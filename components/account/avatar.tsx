import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useCurrentUserImage } from "@/hooks/use-current-user-image";

export default function Avatar({
  uid,
  size,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) {
  const profileImage = useCurrentUserImage();
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

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
    <div>
      {profileImage.avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={profileImage.avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
