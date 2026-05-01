'use client'
import style from '@/styles/create_post_page_styles/create_post.module.css'
import Uploader from "@/components/create_post_page_components/image_uploader";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { wilayas } from '@/data/auth_data/data';
import { imageItem } from '@/types/types';
import { submitHouseInformation, submitHouseUpdate, getNookDetail, deleteNookPicture, resolveShortUrl, uploadImage } from './actions/createpost';
import { useTransition } from 'react';
import { getCompressedNookImages } from '@/lib/functions';
import { useMediaQuery } from '@mui/material';
import Create_post_mobile_nav from '@/components/create_post_page_components/create_post_page_mobile_nav';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(
  () => import('@/components/create_post_page_components/MapPicker'),
  { ssr: false }
)
const CATEGORIES = ['family', 'single', 'couple'];
const RULES = ['animals', 'smoking', 'noise'];
const FEATURES = ['pool', 'wifi', 'heating', 'television', 'kitchen', 'microwave', 'dishes', 'freezer', 'stove', 'oven', 'fridge', 'washing_machine', 'cleaning_product', 'air_conditioning', 'parking', 'sea_view'];

const FEATURE_NAME_TO_FORM: Record<string, string> = {
  'Pool': 'pool', 'Wifi': 'wifi', 'Heating': 'heating',
  'Air Conditioning': 'air_conditioning', 'Television': 'television',
  'Kitchen': 'kitchen', 'Microwave': 'microwave', 'Fridge': 'fridge',
  'Washing machine': 'washing_machine', 'Cleaning products': 'cleaning_product',
  'Sea view': 'sea_view', 'Parking': 'parking', 'Dishes': 'dishes',
  'Freezer': 'freezer', 'Stove': 'stove', 'Oven': 'oven',
};

const TYPES_TO_CATEGORIES: Record<string, string[]> = {
  'AL': ['family', 'couple', 'single'],
  'FA': ['family'],
  'NC': ['family', 'single'],
  'NM': ['family', 'couple'],
};

function parseGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  try {
    // Most common: /place/Name/@lat,lng,zoom or /@lat,lng,zoom
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    // ?q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    // ?ll=lat,lng
    const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  } catch (e) { /* ignore */ }
  return null;
}

export default function CreatePost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const [NumberOf_Inputs, setNumberOf_Inputs] = useState({ 1: false, 2: false, 3: false });
  const [tenantsAndPriceActive, setTenantsAndPriceActive] = useState({ 1: false, 2: false })
  const { register, handleSubmit, setValue, watch, setFocus, getValues, reset, formState: { errors } } = useForm({
    defaultValues: {
      house_type: 'apartment',
      wilaya: "01",
      categories: [],
      rules: [],
      features: [],
    }
  });
  const [images, setImages] = useState<imageItem[]>([]);
  const [imageError, setImageError] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapLabel, setMapLabel] = useState<string | null>(null);

  const selectedType = watch('house_type');
  const watchedCheckBoxes = {
    categories: watch('categories'),
    rules: watch('rules'),
    features: watch('features'),
  }
  const numberOf_Values = {
    1: getValues('bedrooms'),
    2: getValues('beds'),
    3: getValues('bathrooms')
  }
  const tenantsAndPrice_Values = {
    1: getValues('max_tenants'),
    2: getValues('price_per_night')
  }
  const location = watch('location');
  const toggleCheckbox = (section_name: string, item: string) => {
    if (watchedCheckBoxes[section_name].includes(`${item}`)) {
      setValue(`${section_name}`, watchedCheckBoxes[section_name].filter((el) => el !== item))
    } else {
      setValue(`${section_name}`, [...watchedCheckBoxes[section_name], `${item}`])
    }
  }
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (NumberOf_Inputs[1]) setFocus('bedrooms');
    if (NumberOf_Inputs[2]) setFocus('beds');
    if (NumberOf_Inputs[3]) setFocus('bathrooms');
    if (tenantsAndPriceActive[1]) setFocus('max_tenants');
    if (tenantsAndPriceActive[2]) setFocus('price_per_night');
  }, [NumberOf_Inputs, tenantsAndPriceActive])

  useEffect(() => {
    if (!editId) return;
    getNookDetail(editId).then((post) => {
      if (!post) return;
      const houseType = (post.title?.split(' in ')[0] ?? 'apartment').toLowerCase();
      const features = (post.features ?? [])
        .map((f: string) => FEATURE_NAME_TO_FORM[f])
        .filter(Boolean);
      const categories = TYPES_TO_CATEGORIES[post.house?.Types_of_Renters ?? 'AL'] ?? ['family', 'couple', 'single'];
      const rules: string[] = [];
      if (post.house_rules?.allows_animals) rules.push('animals');
      if (post.house_rules?.allows_smoking) rules.push('smoking');
      if (post.house_rules?.allows_noise) rules.push('noise');

      reset({
        house_type: houseType,
        wilaya: post.location?.State ?? '01',
        categories,
        rules,
        features,
        description: post.house?.Description ?? '',
        price_per_night: post.house?.Price ?? '',
        bedrooms: post.house?.num_bedroom ?? '',
        bathrooms: post.house?.num_bathroom ?? '',
        beds: '',
        max_tenants: '',
        latitude: String(post.location?.Latitude ?? ''),
        longitude: String(post.location?.Longitude ?? ''),
        county: post.location?.County ?? '',
        map_country: post.location?.Country ?? '',
        location: '',
      });
      if (post.location) {
        setMapLabel([post.location.County, post.location.State, post.location.Country].filter(Boolean).join(', '));
      }
      if (post.house_pictures?.length) {
        setImages(post.house_pictures
          .filter((p: any) => p.URL)
          .map((p: any) => ({ id: -p.id, url: p.URL, backendId: p.id }))
        );
      }
    });
  }, [editId]);

  useEffect(() => {
    const isGoogleMaps = location && (location.includes('google.com/maps') || location.includes('goo.gl'));
    if (!isGoogleMaps) return;

    const run = async () => {
      let fullUrl = location;
      if (!location.includes('google.com/maps')) {
        const resolved = await resolveShortUrl(location);
        if (!resolved) return;
        fullUrl = resolved;
      }
      const coords = parseGoogleMapsUrl(fullUrl);
      if (!coords) return;
      setValue('latitude', String(coords.lat));
      setValue('longitude', String(coords.lng));
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=en`,
        { headers: { 'Accept-Language': 'en' } }
      )
        .then(r => r.json())
        .then(data => {
          const addr = data.address || {};
          const label = [
            addr.city || addr.town || addr.municipality || addr.village,
            addr.state,
            addr.country,
          ].filter(Boolean).join(', ');
          if (label) setMapLabel(label);
          setValue('county', addr.city || addr.town || addr.county || '');
          setValue('map_country', addr.country || 'Algeria');
          if (addr.state) {
            const matched = wilayas.find(w =>
              (addr.state as string).toLowerCase().includes(w.name.toLowerCase()) ||
              w.name.toLowerCase().includes((addr.state as string).toLowerCase())
            );
            if (matched) setValue('wilaya', matched.code);
          }
        })
        .catch(() => setMapLabel(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`));
    };

    run();
  }, [location]);

  const handleSubmitForm = (data) => {
    if (!isEditMode && images.length === 0) {
      setImageError(true);
      return;
    }
    setImageError(false);
    startTransition(async () => {
      const compressedImages = await getCompressedNookImages(images);
      const uploadAll = (postId: string, imgs: Blob[]) =>
        Promise.all(imgs.map((img, i) => {
          const fd = new FormData();
          fd.append('file', img, `image_${i}.webp`);
          return uploadImage(postId, fd);
        }));

      if (isEditMode) {
        const res = await submitHouseUpdate(editId!, data);
        if (!res.success) return;
        if (compressedImages.length > 0) {
          await uploadAll(res.post_id!, compressedImages);
        }
      } else {
        const res = await submitHouseInformation(data);
        if (!res.success) return;
        await uploadAll(String(res.post_id), compressedImages);
      }
      router.push('/mynooks');
    });
  }
  const screenWidth = useMediaQuery('(max-width:850px)')

  return (
    <>
      {screenWidth && <Create_post_mobile_nav />}
      <form style={{ position: 'relative' }} onSubmit={handleSubmit((data) => { console.log(data);handleSubmitForm(data)})}>
        {isPending && <div className={style.loading}>{isEditMode ? 'Updating post' : 'Uploading post'}</div>}
        {!screenWidth && <div className={style.create_post_header}>{isEditMode ? 'Edit your nook' : 'Post a new nook'}</div>}
        <div className={style.create_post_container}>
          <Uploader
            images={images}
            setImages={setImages}
            onRemove={(item) => {
              if (item.backendId && editId) deleteNookPicture(editId, item.backendId);
            }}
          />
          <div className={style.house_information_container}>
            <div className={style.house_information_firstSection}>
              <div className={style.type_categores_rules_container}>
                <div className={style.section_container} id={screenWidth ? undefined : style.type_section}>
                  <div className={style.section_title}>
                    Type
                  </div>
                  <div className={style.section_radio}>
                    <input style={{ display: "none" }} {...register('house_type')} type="radio" value='apartment' />
                    <input style={{ display: "none" }} {...register('house_type')} type="radio" value='villa' />
                    <input style={{ display: "none" }} {...register('house_type')} type="radio" value='chalet' />
                    <button type='button' id='apartment' onClick={(e) => setValue("house_type", "apartment")} className={selectedType === 'apartment' ? style.selected : undefined}>Apartment</button>
                    <button type='button' id='villa' onClick={(e) => setValue("house_type", "villa")} className={selectedType === 'villa' ? style.selected : undefined}>Villa</button>
                    <button type='button' id='chalet' onClick={(e) => setValue("house_type", "chalet")} className={selectedType === 'chalet' ? style.selected : undefined}>Chalet</button>
                  </div>
                </div>
                <div className={style.section_container} id={screenWidth ? undefined : style.categories_section}>
                  <div className={style.section_title}>
                    Categories
                  </div>
                  <div className={style.section_chechbox}>
                    {CATEGORIES.map((category, i) => {
                      return (
                        <div key={category}>
                          <input style={{ display: "none" }} {...register('categories', i === 0 ? { validate: v => v.length > 0 } : {})} type="checkbox" value={category} />
                          <button type='button' id={category} onClick={() => toggleCheckbox("categories", category)} className={watchedCheckBoxes.categories.includes(category) ? style.selected : undefined}>{category.charAt(0).toLocaleUpperCase() + category.slice(1)}</button>
                        </div>
                      )
                    })}
                    {errors.categories && <span className={style.field_error}>Select at least one category</span>}
                  </div>
                </div>
                <div className={style.section_container} id={screenWidth ? undefined : style.rules_section}>
                  <div className={style.section_title}>
                    Rules
                  </div>
                  <div className={style.section_chechbox}>
                    {RULES.map((rule) => {
                      return (
                        <div key={rule}>
                          <input style={{ display: "none" }} {...register('rules')} type="checkbox" value={rule} />
                          <button type='button' id={rule} onClick={() => toggleCheckbox("rules", rule)} className={watchedCheckBoxes.rules.includes(rule) ? style.selected : undefined}>{rule.charAt(0).toLocaleUpperCase() + rule.slice(1)}</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <input type="hidden" {...register('wilaya')} />
              <div className={style.location_numberOf_container}>
                <div className={style.section_container} id={screenWidth ? undefined : style.location_section}>
                  <div className={style.section_title}>
                    Location
                  </div>
                  <div className={style.location_input_row}>
                    <input className={location ? style.filled_input : undefined} type="url" {...register('location')} placeholder='Paste a Google Maps link (optional)' />
                    <button type="button" className={`${style.map_icon_btn} ${mapLabel ? style.map_icon_btn_active : ''}`} onClick={() => setMapOpen(true)} title="Pick location on map">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                      </svg>
                    </button>
                  </div>
                  {mapLabel && <span className={style.map_confirmed_label}>{mapLabel}</span>}
                  <input type="hidden" {...register('latitude', isEditMode ? {} : { required: true })} />
                  <input type="hidden" {...register('longitude', isEditMode ? {} : { required: true })} />
                  <input type="hidden" {...register('county')} />
                  <input type="hidden" {...register('map_country')} />
                  {errors.latitude && <span className={style.field_error}>Please pick a location on the map</span>}
                </div>
                <div className={style.section_container} id={screenWidth ? undefined : style.tentants_and_price_section}>
                  <div className={style.tenants_and_price}>
                    <div
                      id={style.price_per_night_div}
                      tabIndex={tenantsAndPriceActive[2] ? -1 : 0}
                      onClick={() => setTenantsAndPriceActive((prev) => { return { ...prev, 2: true } })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTenantsAndPriceActive((prev) => { return { ...prev, 2: true } }) } }}
                      className={tenantsAndPrice_Values[2] ? style.filled_input : undefined}
                    >
                      {tenantsAndPriceActive[2] ? <input type="number" {...register('price_per_night', { required: true, min: 1 })} min={1} onBlur={() => setTenantsAndPriceActive((prev) => { return { ...prev, 2: false } })} /> : `${tenantsAndPrice_Values[2]?.length > 0 ? tenantsAndPrice_Values[2] + " DA" : "Price per night"}`}
                    </div>
                    {errors.price_per_night && <span className={style.field_error}>Price is required</span>}
                    <div
                      tabIndex={tenantsAndPriceActive[1] ? -1 : 0}
                      onClick={() => setTenantsAndPriceActive((prev) => { return { ...prev, 1: true } })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTenantsAndPriceActive((prev) => { return { ...prev, 1: true } }) } }}
                      className={tenantsAndPrice_Values[1] ? style.filled_input : undefined}
                    >
                      {tenantsAndPriceActive[1] ? <input type="number" {...register('max_tenants', isEditMode ? { min: 1 } : { required: true, min: 1 })} min={1} onBlur={() => setTenantsAndPriceActive((prev) => { return { ...prev, 1: false } })} /> : `${tenantsAndPrice_Values[1] || "Max number of tenants"}`}
                    </div>
                    {errors.max_tenants && <span className={style.field_error}>Max tenants is required</span>}
                  </div>
                </div>
                <div className={style.section_container} id={screenWidth ? undefined : style.numberOf_buttons_section}>
                  <div className={style.section_title}>
                    Number of
                  </div>
                  <div className={style.numberof_buttons_container}>
                    <div
                      tabIndex={NumberOf_Inputs[1] ? -1 : 0}
                      onClick={() => setNumberOf_Inputs((prev) => { return { ...prev, 1: true } })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNumberOf_Inputs((prev) => { return { ...prev, 1: true } }) } }}
                      className={!numberOf_Values[1] ? style.number_of_buttons : `${style.number_of_buttons} ${style.filled_input}`}
                    >
                      {NumberOf_Inputs[1] ? <input type="number" {...register('bedrooms', { required: true, min: 1 })} min={1} onBlur={() => setNumberOf_Inputs((prev) => { return { ...prev, 1: false } })} /> : `${numberOf_Values[1] || "Bedrooms"}`}
                    </div>
                    <div
                      id={style.number_of_beds}
                      tabIndex={NumberOf_Inputs[2] ? -1 : 0}
                      onClick={() => setNumberOf_Inputs((prev) => { return { ...prev, 2: true } })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNumberOf_Inputs((prev) => { return { ...prev, 2: true } }) } }}
                      className={!numberOf_Values[2] ? style.number_of_buttons : `${style.number_of_buttons} ${style.filled_input}`}
                    >
                      {NumberOf_Inputs[2] ? <input type="number" {...register('beds', isEditMode ? { min: 1 } : { required: true, min: 1 })} min={1} onBlur={() => setNumberOf_Inputs((prev) => { return { ...prev, 2: false } })} /> : `${numberOf_Values[2] || "Beds"}`}
                    </div>
                    <div
                      tabIndex={NumberOf_Inputs[3] ? -1 : 0}
                      onClick={() => setNumberOf_Inputs((prev) => { return { ...prev, 3: true } })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNumberOf_Inputs((prev) => { return { ...prev, 3: true } }) } }}
                      className={!numberOf_Values[3] ? style.number_of_buttons : `${style.number_of_buttons} ${style.filled_input}`}
                    >
                      {NumberOf_Inputs[3] ? <input type="number" {...register('bathrooms', { required: true, min: 1 })} min={1} onBlur={() => setNumberOf_Inputs((prev) => { return { ...prev, 3: false } })} /> : `${numberOf_Values[3] || "Bathrooms"}`}
                    </div>
                  </div>
                  {(errors.bedrooms || errors.beds || errors.bathrooms) && <span className={style.field_error}>Please fill in all number of fields</span>}
                </div>
              </div>
            </div>
            <div className={style.house_information_features}>
              <div className={style.section_container} id={screenWidth ? undefined : style.features_section}>
                <div className={style.section_title}>
                  Features
                </div>
                <div className={style.section_chechbox} id={screenWidth ? undefined : style.featrues_checkbox}>
                  {FEATURES.map((feature) => {
                    return (
                      <div key={feature}>
                        <input style={{ display: "none" }} {...register('features')} type="checkbox" value={feature} />
                        <button type='button' id={feature} onClick={() => toggleCheckbox("features", feature)} className={watchedCheckBoxes.features.includes(feature) ? style.selected : undefined}>{(feature.charAt(0).toLocaleUpperCase() + feature.slice(1)).replaceAll('_', ' ')}</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className={style.house_information_description}>
              <div className={style.section_container} id={screenWidth ? undefined : style.description_section}>
                <textarea className={style.description} rows={10} {...register('description', { required: true })} placeholder='write a description of your nook' />
              {errors.description && <span className={style.field_error}>Description is required</span>}
              </div>
            </div>
            {imageError && <span className={style.field_error}>At least one picture is required</span>}
            <button disabled={isPending} type='submit' id={style.submit_button}>{!isPending ? (isEditMode ? 'Update your nook' : 'Post your nook') : (isEditMode ? 'Updating...' : 'Submitting ...')}</button>
          </div>
        </div>
      </form>
      {mapOpen && (
        <MapPicker
          onClose={() => setMapOpen(false)}
          onConfirm={(loc) => {
            setValue('latitude', String(loc.lat))
            setValue('longitude', String(loc.lng))
            setValue('county', loc.baladia)
            setValue('map_country', loc.country)
            const wilayas_match = wilayas.find(w =>
              loc.wilaya.toLowerCase().includes(w.name.toLowerCase()) ||
              w.name.toLowerCase().includes(loc.wilaya.toLowerCase())
            )
            if (wilayas_match) setValue('wilaya', wilayas_match.code)
            setMapLabel([loc.baladia, loc.wilaya, loc.country].filter(Boolean).join(', '))
            setMapOpen(false)
          }}
        />
      )}
    </>
  );
}
