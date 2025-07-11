// Fallback data when Supabase is not available
export const fallbackLectures = [
  {
    id: "fallback-1",
    title: "Beispiel Khutba 1",
    title_translations: {
      de: "Die Bedeutung des Gebets im Islam",
      ar: "أهمية الصلاة في الإسلام",
      orig: "Die Bedeutung des Gebets im Islam"
    },
    content: "Eine inspirierende Khutba über die Bedeutung und den Wert des täglichen Gebets im Leben eines Muslims...",
    created_at: new Date().toISOString(),
    created_by: "system",
    num_views: 0,
    type: "Khutba",
    status: "Public",
    mosque_id: "fallback-mosque-1",
    translation_map: {},
    mosque: {
      name: "Beispiel Moschee",
      handle: "beispiel-moschee"
    }
  },
  {
    id: "fallback-2", 
    title: "Beispiel Khutba 2",
    title_translations: {
      de: "Gemeinschaft und Zusammenhalt",
      ar: "المجتمع والتماسك",
      orig: "Gemeinschaft und Zusammenhalt"
    },
    content: "Eine Reflektion über die Wichtigkeit der Gemeinschaft und des Zusammenhalts in der muslimischen Ummah...",
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    created_by: "system",
    num_views: 0,
    type: "Khutba",
    status: "Public", 
    mosque_id: "fallback-mosque-2",
    translation_map: {},
    mosque: {
      name: "Gemeinde Moschee",
      handle: "gemeinde-moschee"
    }
  },
  {
    id: "fallback-3",
    title: "Beispiel Khutba 3", 
    title_translations: {
      de: "Dankbarkeit im Alltag",
      ar: "الامتنان في الحياة اليومية",
      orig: "Dankbarkeit im Alltag"
    },
    content: "Eine Betrachtung über die Rolle der Dankbarkeit in unserem täglichen Leben und spirituellen Wachstum...",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    created_by: "system",
    num_views: 0,
    type: "Khutba",
    status: "Public",
    mosque_id: "fallback-mosque-3",
    translation_map: {},
    mosque: {
      name: "Al-Noor Moschee",
      handle: "al-noor-moschee"
    }
  }
];

export const getFallbackLectures = () => {
  console.log("Using fallback lecture data due to database connectivity issues");
  return fallbackLectures;
};
