"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/my_nooks_styles/seller_profile.module.css";
import Loading from "@/components/loading";
import { getSellerProfile, getMyProfile, changeProfilePicture } from "@/app/(main_page)/actions/profile";
import { PublicSellerProfile, PublicNookCard } from "@/types/api_types";
import { getWilayaName } from "@/data/auth_data/data";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getFullImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
  return null;
}

function NookCard({ nook }: { nook: PublicNookCard }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const imageUrl = getFullImageUrl(nook.primary_image);
  const wilayaName = getWilayaName(nook.wilaya ?? "") || nook.wilaya || "";
  const displayTitle = wilayaName
    ? `${nook.title.split(" in ")[0]} in ${wilayaName}`
    : nook.title;

  return (
    <div className={styles.nook_card} onClick={() => router.push(`/post/${nook.id}`)}>
      <div className={styles.nook_image_wrap}>
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={nook.title}
            fill
            className={styles.nook_image}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={styles.nook_fallback}>🏠</span>
        )}
      </div>
      <div className={styles.nook_info}>
        <p className={styles.nook_title}>{displayTitle}</p>
        <div className={styles.nook_footer}>
          <span className={styles.nook_price}>{nook.price_per_night} DA / night</span>
          <span className={styles.nook_rating}>★ {nook.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.seller_id as string;

  const [profile, setProfile] = useState<PublicSellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!sellerId) return;
    Promise.all([getSellerProfile(sellerId), getMyProfile()]).then(([data, me]) => {
      if (!data) { setError("Profile not found."); setLoading(false); return; }
      setProfile(data);
      setAvatarUrl(getFullImageUrl(data.seller.profile_picture));
      if (me && String(me.id) === String(sellerId)) setIsOwner(true);
      setLoading(false);
    }).catch(() => { setError("Failed to load profile."); setLoading(false); });
  }, [sellerId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);
    const result = await changeProfilePicture(formData);
    setUploadLoading(false);
    if (result.success) {
      setAvatarUrl(URL.createObjectURL(file));
    } else {
      setUploadError(result.error ?? 'Failed to update picture.');
    }
    e.target.value = '';
  };

  if (loading) return <Loading text="Loading profile..." />;
  if (error || !profile) return <div className={styles.error}>{error ?? "Profile not found."}</div>;

  const { seller, nooks } = profile;

  const grouped = nooks.reduce<Record<string, PublicNookCard[]>>((acc, nook) => {
    const key = getWilayaName(nook.wilaya ?? "") || nook.wilaya || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(nook);
    return acc;
  }, {});

  return (
    <main className={styles.page}>
      <section className={styles.profile_header}>
        <div className={styles.avatar_container}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={seller.full_name}
              width={120}
              height={120}
              className={styles.avatar}
            />
          ) : (
            <div
              className={styles.avatar}
              style={{
                width: 120, height: 120,
                background: "linear-gradient(135deg, #220E67, #7c5cdb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem", color: "white",
              }}
            >
              {seller.full_name[0]?.toUpperCase()}
            </div>
          )}
          <div className={styles.rating_badge}>★ {seller.rating.toFixed(1)}</div>
          {isOwner && (
            <>
              <button
                className={styles.change_picture_btn}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
                title="Change profile picture"
              >
                {uploadLoading ? (
                  <span className={styles.upload_spinner} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </>
          )}
          {uploadError && (
            <p className={styles.upload_error}>{uploadError}</p>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{seller.full_name}</h1>
          <p className={styles.role}>
            Host since {seller.host_since}
            {seller.location ? ` · ${seller.location}` : ""}
          </p>
          <div className={styles.contact_info}>
            <span>{seller.email}</span>
            {seller.mobile_number && <span>{seller.mobile_number}</span>}
            {seller.date_of_birth && <span>Born {seller.date_of_birth}</span>}
          </div>
        </div>

        <div className={styles.stats_grid}>
          <div className={styles.stat_box}>
            <span className={styles.stat_value}>{seller.nooks_count}</span>
            <span className={styles.stat_label}>Nooks</span>
          </div>
          <div className={styles.stat_box}>
            <span className={styles.stat_value}>{seller.reservations_count}</span>
            <span className={styles.stat_label}>Reservations</span>
          </div>
          <div className={styles.stat_box}>
            <span className={styles.stat_value}>{seller.reviews_count}</span>
            <span className={styles.stat_label}>Reviews</span>
          </div>
        </div>
      </section>

      <section className={styles.properties_section}>
        {nooks.length === 0 ? (
          <div className={styles.city_group}>
            <p className={styles.no_nooks}>This host has no active nooks yet.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([wilaya, wilayaNooks]) => (
            <div key={wilaya} className={styles.city_group}>
              <h2 className={styles.city_title}>📍 {wilaya}</h2>
              <div className={styles.cards_grid}>
                {wilayaNooks.map((nook) => (
                  <NookCard key={nook.id} nook={nook} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
