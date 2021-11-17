const skinList = [
  'spi_sd_chr_cos_ai-casl-00',
  'spi_sd_chr_cos_ai-idol-00',
  'spi_sd_chr_cos_ai-idol-02',
  'spi_sd_chr_cos_ai-kait-00',
  'spi_sd_chr_cos_ai-mizg-00',
  'spi_sd_chr_cos_ai-schl-00',
  'spi_sd_chr_cos_ai-trng-00',
  'spi_sd_chr_cos_aoi-casl-00',
  'spi_sd_chr_cos_aoi-idol-00',
  'spi_sd_chr_cos_aoi-idol-02',
  'spi_sd_chr_cos_aoi-kait-00',
  'spi_sd_chr_cos_aoi-mizg-00',
  'spi_sd_chr_cos_aoi-schl-00',
  'spi_sd_chr_cos_aoi-trng-00',
  'spi_sd_chr_cos_chs-casl-00',
  'spi_sd_chr_cos_chs-idol-00',
  'spi_sd_chr_cos_chs-idol-01',
  'spi_sd_chr_cos_chs-idol-02',
  'spi_sd_chr_cos_chs-mizg-00',
  'spi_sd_chr_cos_chs-mizg-01',
  'spi_sd_chr_cos_chs-schl-00',
  'spi_sd_chr_cos_chs-seik-00',
  'spi_sd_chr_cos_chs-trng-00',
  'spi_sd_chr_cos_hrk-casl-00',
  'spi_sd_chr_cos_hrk-idol-00',
  'spi_sd_chr_cos_hrk-idol-01',
  'spi_sd_chr_cos_hrk-idol-02',
  'spi_sd_chr_cos_hrk-mizg-00',
  'spi_sd_chr_cos_hrk-mizg-01',
  'spi_sd_chr_cos_hrk-schl-00',
  'spi_sd_chr_cos_hrk-trng-00',
  'spi_sd_chr_cos_kkr-casl-00',
  'spi_sd_chr_cos_kkr-idol-00',
  'spi_sd_chr_cos_kkr-idol-02',
  'spi_sd_chr_cos_kkr-mizg-00',
  'spi_sd_chr_cos_kkr-schl-00',
  'spi_sd_chr_cos_kkr-seik-00',
  'spi_sd_chr_cos_kkr-trng-00',
  'spi_sd_chr_cos_koh-casl-00',
  'spi_sd_chr_cos_ktn-casl-00',
  'spi_sd_chr_cos_ktn-idol-00',
  'spi_sd_chr_cos_ktn-idol-01',
  'spi_sd_chr_cos_ktn-idol-02',
  'spi_sd_chr_cos_ktn-mizg-00',
  'spi_sd_chr_cos_ktn-mizg-01',
  'spi_sd_chr_cos_ktn-schl-00',
  'spi_sd_chr_cos_ktn-trng-00',
  'spi_sd_chr_cos_mei-casl-00',
  'spi_sd_chr_cos_mei-idol-00',
  'spi_sd_chr_cos_mei-idol-01',
  'spi_sd_chr_cos_mei-idol-02',
  'spi_sd_chr_cos_mei-mizg-00',
  'spi_sd_chr_cos_mei-mizg-01',
  'spi_sd_chr_cos_mei-rock-00',
  'spi_sd_chr_cos_mei-schl-00',
  'spi_sd_chr_cos_mei-trng-00',
  'spi_sd_chr_cos_mna-casl-00',
  'spi_sd_chr_cos_mna-idol-00',
  'spi_sd_chr_cos_mna-mizg-00',
  'spi_sd_chr_cos_mna-schl-00',
  'spi_sd_chr_cos_mna-trng-00',
  'spi_sd_chr_cos_ngs-casl-00',
  'spi_sd_chr_cos_ngs-idol-00',
  'spi_sd_chr_cos_ngs-idol-01',
  'spi_sd_chr_cos_ngs-idol-02',
  'spi_sd_chr_cos_ngs-mizg-00',
  'spi_sd_chr_cos_ngs-mizg-01',
  'spi_sd_chr_cos_ngs-schl-00',
  'spi_sd_chr_cos_ngs-trng-00',
  'spi_sd_chr_cos_rei-casl-00',
  'spi_sd_chr_cos_rei-idol-00',
  'spi_sd_chr_cos_rei-idol-01',
  'spi_sd_chr_cos_rei-idol-02',
  'spi_sd_chr_cos_rei-mizg-00',
  'spi_sd_chr_cos_rei-mizg-01',
  'spi_sd_chr_cos_rei-rock-00',
  'spi_sd_chr_cos_rei-schl-00',
  'spi_sd_chr_cos_rei-trng-00',
  'spi_sd_chr_cos_rio-casl-00',
  'spi_sd_chr_cos_rio-halw-00',
  'spi_sd_chr_cos_rio-idol-00',
  'spi_sd_chr_cos_rio-idol-02',
  'spi_sd_chr_cos_rio-mizg-00',
  'spi_sd_chr_cos_rio-schl-00',
  'spi_sd_chr_cos_rio-trng-00',
  'spi_sd_chr_cos_rui-casl-00',
  'spi_sd_chr_cos_rui-idol-00',
  'spi_sd_chr_cos_rui-idol-02',
  'spi_sd_chr_cos_rui-mizg-00',
  'spi_sd_chr_cos_rui-mizg-01',
  'spi_sd_chr_cos_rui-schl-00',
  'spi_sd_chr_cos_rui-trng-00',
  'spi_sd_chr_cos_ski-casl-00',
  'spi_sd_chr_cos_ski-idol-00',
  'spi_sd_chr_cos_ski-idol-01',
  'spi_sd_chr_cos_ski-idol-02',
  'spi_sd_chr_cos_ski-kifj-00',
  'spi_sd_chr_cos_ski-mizg-00',
  'spi_sd_chr_cos_ski-mizg-01',
  'spi_sd_chr_cos_ski-schl-00',
  'spi_sd_chr_cos_ski-trng-00',
  'spi_sd_chr_cos_skr-casl-00',
  'spi_sd_chr_cos_skr-fest-00',
  'spi_sd_chr_cos_skr-idol-00',
  'spi_sd_chr_cos_skr-idol-01',
  'spi_sd_chr_cos_skr-idol-02',
  'spi_sd_chr_cos_skr-mizg-00',
  'spi_sd_chr_cos_skr-mizg-01',
  'spi_sd_chr_cos_skr-schl-00',
  'spi_sd_chr_cos_skr-trng-00',
  'spi_sd_chr_cos_smr-casl-00',
  'spi_sd_chr_cos_smr-idol-00',
  'spi_sd_chr_cos_smr-idol-02',
  'spi_sd_chr_cos_smr-mizg-00',
  'spi_sd_chr_cos_smr-mizg-01',
  'spi_sd_chr_cos_smr-schl-00',
  'spi_sd_chr_cos_smr-trng-00',
  'spi_sd_chr_cos_stm-bksd-00',
  'spi_sd_chr_cos_suz-anml-00',
  'spi_sd_chr_cos_suz-casl-00',
  'spi_sd_chr_cos_suz-idol-00',
  'spi_sd_chr_cos_suz-idol-01',
  'spi_sd_chr_cos_suz-idol-02',
  'spi_sd_chr_cos_suz-mizg-00',
  'spi_sd_chr_cos_suz-mizg-01',
  'spi_sd_chr_cos_suz-schl-00',
  'spi_sd_chr_cos_suz-trng-00',
  'spi_sd_chr_cos_szk-casl-00',
  'spi_sd_chr_cos_szk-chna-00',
  'spi_sd_chr_cos_szk-idol-00',
  'spi_sd_chr_cos_szk-idol-01',
  'spi_sd_chr_cos_szk-idol-02',
  'spi_sd_chr_cos_szk-mizg-00',
  'spi_sd_chr_cos_szk-mizg-01',
  'spi_sd_chr_cos_szk-schl-00',
  'spi_sd_chr_cos_szk-trng-00',
  'spi_sd_chr_cos_yu-casl-00',
  'spi_sd_chr_cos_yu-idol-00',
  'spi_sd_chr_cos_yu-idol-02',
  'spi_sd_chr_cos_yu-mizg-00',
  'spi_sd_chr_cos_yu-mizg-01',
  'spi_sd_chr_cos_yu-schl-00',
  'spi_sd_chr_cos_yu-trng-00',
];
const skeletonList = [
  ...skinList,
  'spi_sd_chr_mot_cmn',
  'spi_sd_chr_mot_fan_handshake',
  'spi_sd_chr_mot_fan_photo-session',
  'spi_sd_chr_mot_fan_sign',
  'spi_sd_chr_mot_guild',
  'spi_sd_chr_mot_lesson',
  'spi_sd_chr_mot_live',
  'spi_sd_chr_mot_promo_event-booth',
  'spi_sd_chr_mot_promo_event-stage',
  'spi_sd_chr_mot_promo_fashion-model',
  'spi_sd_chr_mot_promo_flyers',
  'spi_sd_chr_mot_promo_police',
  'spi_sd_chr_mot_promo_pr-shooting',
  'spi_sd_chr_mot_promo_quiz-program',
  'spi_sd_chr_mot_promo_radio-distribution',
  'spi_sd_chr_mot_promo_swimwear-shooting',
  'spi_sd_chr_mot_promo_video-distribution',
  'spi_sd_chr_mot_ref_bedrock-bath',
  'spi_sd_chr_mot_ref_cafe',
  'spi_sd_chr_mot_ref_dormitory',
  'spi_sd_chr_mot_ref_hot-spring',
  'spi_sd_chr_mot_ref_shopping',
  'spi_sd_chr_mot_ref_theme-park',
  'spi_sd_chr_mot_tour',
  // "spi_sd_eff_lesson",
  // "spi_sd_eff_tour",
  // "spi_sd_env_live-00",
  // "spi_sd_env_promo_event-booth-00_00",
  // "spi_sd_env_promo_event-booth-00_01",
  // "spi_sd_env_promo_event-booth-00_02",
  // "spi_sd_env_promo_event-booth-00_03",
  // "spi_sd_env_promo_event-booth-00_04",
  // "spi_sd_env_promo_event-booth-00_05",
  // "spi_sd_env_promo_event-booth-00_06",
  // "spi_sd_env_promo_event-stage-00_00",
  // "spi_sd_env_promo_event-stage-00_01",
  // "spi_sd_env_promo_event-stage-00_02",
  // "spi_sd_env_promo_event-stage-00_03",
  // "spi_sd_env_promo_event-stage-00_04",
  // "spi_sd_env_promo_event-stage-00_05",
  // "spi_sd_env_promo_fashion-model-00_00",
  // "spi_sd_env_promo_fashion-model-00_01",
  // "spi_sd_env_promo_flyers-00_00",
  // "spi_sd_env_promo_flyers-00_01",
  // "spi_sd_env_promo_flyers-00_02",
  // "spi_sd_env_promo_flyers-00_03",
  // "spi_sd_env_promo_flyers-00_04",
  // "spi_sd_env_promo_police-00_00",
  // "spi_sd_env_promo_police-00_01",
  // "spi_sd_env_promo_pr-shooting-00_00",
  // "spi_sd_env_promo_quiz-program-00_00",
  // "spi_sd_env_promo_radio-distribution-00_00",
  // "spi_sd_env_promo_swimwear-shooting-00_00",
  // "spi_sd_env_promo_swimwear-shooting-00_01",
  // "spi_sd_env_promo_video-distribution-00_00",
  // "spi_sd_env_ref_cafe-00_00",
  // "spi_sd_env_ref_dormitory-00_00",
  // "spi_sd_env_ref_hot-spring-00_00",
  // "spi_sd_env_ref_shopping-00_00",
  // "spi_sd_env_ref_shopping-00_01",
  // "spi_sd_env_ref_theme-park-00_00",
  // "spi_sd_env_ref_theme-park-00_01",
  // "spi_sd_env_ref_theme-park-00_02",
  // "spi_sd_npc_fan_cmn_female-00",
  // "spi_sd_npc_fan_cmn_male-00",
  // "spi_sd_npc_fan_photo-session_cameraman",
  // "spi_sd_prop_fan_handshake",
  // "spi_sd_prop_fan_photo-session",
  // "spi_sd_prop_fan_sign",
  // "spi_sd_prop_guild",
  // "spi_sd_prop_live",
  // "spi_sd_prop_promo_event-booth",
  // "spi_sd_prop_promo_event-stage",
  // "spi_sd_prop_promo_flyers",
  // "spi_sd_prop_promo_police",
  // "spi_sd_prop_promo_quiz-program",
  // "spi_sd_prop_promo_radio-distribution",
  // "spi_sd_prop_promo_swimwear-shooting",
  // "spi_sd_prop_promo_video-distribution",
  // "spi_sd_prop_ref_bedrock-bath",
  // "spi_sd_prop_ref_cafe",
  // "spi_sd_prop_ref_dormitory",
  // "spi_sd_prop_ref_hot-spring",
  // "spi_sd_prop_ref_shopping",
  // "spi_sd_prop_ref_theme-park"
];
export { skeletonList, skinList };
