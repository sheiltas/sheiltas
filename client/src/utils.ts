import { categoriesKeys, subcategoriesHebrew } from './types';

export const categoriesKeysArray = [
  'aroundTheYear',
  'destructionToSalvation',
  'prayersAndBlessings',
  'synagogueAndSacredObjects',
  'sabbath',
  'mourning',
  'kosherKitchen',
  'circleOfLife',
  'marriageAndPurity',
  'betweenAManAndHisFriend',
  'betweenIsraelAndGentiles',
  'charity',
  'faithAndView',
  'educationAndCounselingAndNames',
  'customs',
  'animals',
  'monetary'
] as const;

export const mapCategoriesKeysToHebrewSubcategories: Record<
  categoriesKeys,
  subcategoriesHebrew[]
> = {
  animals: ['צער בעלי חיים', 'סירוס'],
  aroundTheYear: [
    'שלושת השבועות',
    'תשעה באב',
    'תשעת הימים',
    'ראש השנה',
    'אלול',
    'עשרת ימי תשובה',
    'יום כיפורים',
    'סוכות',
    'ארבעת המינים',
    'שמחת תורה',
    'סוכה',
    'חנוכה',
    'פורים',
    'פסח',
    'כשרות הפסח',
    'חג הפסח',
    'מכירת חמץ',
    'הלכות יום טוב',
    'שבועות',
    'ימים מיוחדים'
  ],
  betweenAManAndHisFriend: [
    'שקר',
    'כיבוד הורים',
    'לפני עיוור',
    'כיבוד תלמידי חכמים',
    'לשון הרע',
    'בין ישראל לגוי',
    'חוקות הגוי',
    'גרים',
    'עבודה זרה',
    'לא תחנם',
    'צדקה',
    'הלכות צדקה',
    'מעשר כספים'
  ],
  betweenIsraelAndGentiles: ['לא תחנם', 'עבודה זרה', 'גרים', 'חוקות הגוי'],
  charity: ['מעשר כספים'],
  circleOfLife: [
    'שגרת בוקר',
    'שגרת ערב',
    'קעקוע',
    'נדרים ושבועות',
    'שילוח הקן',
    'ברית מילה',
    'בל תשחית',
    'גילוח - תער',
    'לא ילבש',
    'שעטנז'
  ],
  destructionToSalvation: ['ארץ ישראל', 'חורבן', 'גאולה', 'בית מקדש'],
  educationAndCounselingAndNames: ['מנהגים', 'קבלה', 'אינטרנט', 'חזרה בתשובה'],
  kosherKitchen: [
    'תולעים',
    'מאכלי ובישול גוי',
    'כשרות הבשר',
    'בשר בחלב',
    'הגעלת וטבילת כלים',
    'תרופות והמרחב הציבורי',
    'הפרשת חלה',
    'מצוות התלויות בארץ',
    'כלאים',
    'תרומות ומעשות',
    'ערלה',
    'שמיטה',
    'מאכלים אסורים מחמת סכנה',
    'יין נסך וסתם יינם'
  ],
  marriageAndPurity: [
    'ממזרות ויוחסין',
    'גיור ובירורי יהדות',
    'מניעת היריון, הפלות',
    'ייחוד',
    'נדה וטבילה',
    'טומאת כהנים',
    'נישואין',
    'גירושין',
    'אישות',
    'צניעות',
    'יבום וחליצה',
    'פריה ורביה'
  ],
  monetary: [
    'מקח וממכר',
    'מי שפרע',
    'אונאה ומקח טעות',
    'גוי',
    'מצרנות',
    'מתנה',
    'אסמכתא, גמירות דעת',
    'אונס ומודעה',
    'עובד ומעביד',
    'שטרות',
    'בל תלין',
    'בית הדין',
    'דינא דמלכותא',
    'עדות',
    'וועד בית',
    'חוזים והסכמים',
    'שוכר',
    'שוכרים וושתפים',
    'הלוואה',
    'פועלים',
    'ערבות',
    'דינא דגרמי',
    'ערכאות',
    'שומרים',
    'ירושה',
    'שליחות',
    'שכירות פועלים',
    'שירותי קבלנות',
    'השבת אבידה',
    'גזילה וגנבה',
    'נזקים',
    'תיווך והשקעות',
    'ריבית',
    'שכנים',
    'מיסים',
    'זכויות יוצרים',
    'שואל'
  ],
  mourning: ['שבעה', 'אבלות כללי', 'לוויה וקבורה', 'יארצייט'],
  prayersAndBlessings: ['תפילה', 'ברכות ההודיה', 'ברכות הנהנין'],
  sabbath: [
    'מלאכות שבת',
    'אמירה לגוי',
    'הנאה ממלאכה אסורה',
    'מצוות השבת',
    'כבוד השבת',
    'תפילות בשבת',
    'סעודות',
    'קידוש והבדלה',
    'קבלת שבת והדלקת נרות',
    'טיפול בחולה בשבת',
    'עירוב',
    'מוקצה',
    'ערב שבת'
  ],
  synagogueAndSacredObjects: [
    'בית כנסת',
    'תפילין',
    'גניזה',
    'מזוזה',
    'קדושת ספרים',
    'ספר תורה'
  ],
  faithAndView: [],
  customs: []
};

export const languages = ['he', 'en'] as const;

export const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return { e };
  }
};
