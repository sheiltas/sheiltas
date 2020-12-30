// @ts-ignore
import ReactNode from "react";

// Sheilta categories
export enum categories {
  aroundTheYear = "במעגל השנה",
  destructionToSalvation = "מחורבן לגאולה",
  prayersAndBlessings = "תפילות וברכות",
  synagogueAndSacredObjects = "בית כנסת וחפצי קדושה",
  sabbath = "שבת",
  mourning = "אבלות",
  kosherKitchen = "כשרות המטבח",
  circleOfLife = "במעגל החיים",
  marriageAndPurity = "אישות וטהרה",
  betweenAManAndHisFriend = "בין אדם לחברו",
  betweenIsraelAndGentiles = "בין ישראל לגוי",
  charity = "צדקה",
  faithAndView = "אמונה והשקפה",
  educationAndCounselingAndNames = "חינוך, ייעוץ, שמות",
  customs = "מנהגים",
  animals = "בעלי חיים",
  monetary = "ממונות",
}

// Sheilta Subcategories
export type aroundTheYearSubcategories =
  | "שלושת השבועות"
  | "תשעה באב"
  | "תשעת הימים"
  | "ראש השנה"
  | "אלול"
  | "עשרת ימי תשובה"
  | "יום כיפורים"
  | "סוכות"
  | "ארבעת המינים"
  | "שמחת תורה"
  | "סוכה"
  | "חנוכה"
  | "פורים"
  | "פסח"
  | "כשרות הפסח"
  | "חג הפסח"
  | "מכירת חמץ"
  | "הלכות יום טוב"
  | "שבועות"
  | "ימים מיוחדים";

export type destructionToSalvationSubcategories =
  | "ארץ ישראל"
  | "חורבן"
  | "גאולה"
  | "בית מקדש";

export type prayersAndBlessingsSubcategories =
  | "תפילה"
  | "ברכות ההודיה"
  | "ברכות הנהנין";

export type synagogueAndSacredObjectsSubcategories =
  | "בית כנסת"
  | "תפילין"
  | "גניזה"
  | "מזוזה"
  | "קדושת ספרים"
  | "ספר תורה";

export type sabbathSubcategories =
  | "מלאכות שבת"
  | "אמירה לגוי"
  | "הנאה ממלאכה אסורה"
  | "מצוות השבת"
  | "כבוד השבת"
  | "תפילות בשבת"
  | "סעודות"
  | "קידוש והבדלה"
  | "קבלת שבת והדלקת נרות"
  | "טיפול בחולה בשבת"
  | "עירוב"
  | "מוקצה"
  | "ערב שבת";

export type mourningSubcategories =
  | "שבעה"
  | "אבלות כללי"
  | "לוויה וקבורה"
  | "יארצייט";

export type kosherKitchenSubcategories =
  | "תולעים"
  | "מאכלי ובישול גוי"
  | "כשרות הבשר"
  | "בשר בחלב"
  | "הגעלת וטבילת כלים"
  | "תרופות והמרחב הציבורי"
  | "הפרשת חלה"
  | "מצוות התלויות בארץ"
  | "כלאים"
  | "תרומות ומעשות"
  | "ערלה"
  | "שמיטה"
  | "מאכלים אסורים מחמת סכנה"
  | "יין נסך וסתם יינם";

export type circleOfLifeSubcategories =
  | "שגרת בוקר"
  | "שגרת ערב"
  | "קעקוע"
  | "נדרים ושבועות"
  | "שילוח הקן"
  | "ברית מילה"
  | "בל תשחית"
  | "גילוח - תער"
  | "לא ילבש"
  | "שעטנז";

export type marriageAndPuritySubcategories =
  | "ממזרות ויוחסין"
  | "גיור ובירורי יהדות"
  | "מניעת היריון, הפלות"
  | "ייחוד"
  | "נדה וטבילה"
  | "טומאת כהנים"
  | "נישואין"
  | "גירושין"
  | "אישות"
  | "צניעות"
  | "יבום וחליצה"
  | "פריה ורביה";

export type betweenAManAndHisFriendSubcategories =
  | "שקר"
  | "כיבוד הורים"
  | "לפני עיוור"
  | "כיבוד תלמידי חכמים"
  | "לשון הרע"
  | "בין ישראל לגוי"
  | "חוקות הגוי"
  | "גרים"
  | "עבודה זרה"
  | "לא תחנם"
  | "צדקה"
  | "הלכות צדקה"
  | "מעשר כספים";

export type betweenIsraelAndGentilesSubcategories =
  | "לא תחנם"
  | "עבודה זרה"
  | "גרים"
  | "חוקות הגוי";

export type charitySubcategories = "מעשר כספים";

// extends type faithAndViewSubcategories = ''

// extends type customsSubcategories = ''

export type educationAndCounselingAndNamesSubcategories =
  | "מנהגים"
  | "קבלה"
  | "אינטרנט"
  | "חזרה בתשובה";

export type animalsSubcategories = "סירוס" | "צער בעלי חיים";

export type monetarySubcategories =
  | "מקח וממכר"
  | "מי שפרע"
  | "אונאה ומקח טעות"
  | "גוי"
  | "מצרנות"
  | "מתנה"
  | "אסמכתא, גמירות דעת"
  | "אונס ומודעה"
  | "עובד ומעביד"
  | "שטרות"
  | "בל תלין"
  | "בית הדין"
  | "דינא דמלכותא"
  | "עדות"
  | "וועד בית"
  | "חוזים והסכמים"
  | "שוכר"
  | "שוכרים וושתפים"
  | "הלוואה"
  | "פועלים"
  | "ערבות"
  | "דינא דגרמי"
  | "ערכאות"
  | "שומרים"
  | "ירושה"
  | "שליחות"
  | "שכירות פועלים"
  | "שירותי קבלנות"
  | "השבת אבידה"
  | "גזילה וגנבה"
  | "נזקים"
  | "תיווך והשקעות"
  | "ריבית"
  | "שכנים"
  | "מיסים"
  | "זכויות יוצרים"
  | "שואל";

export type subcategories = aroundTheYearSubcategories &
  destructionToSalvationSubcategories &
  prayersAndBlessingsSubcategories &
  synagogueAndSacredObjectsSubcategories &
  sabbathSubcategories &
  monetarySubcategories &
  kosherKitchenSubcategories &
  circleOfLifeSubcategories &
  marriageAndPuritySubcategories &
  betweenAManAndHisFriendSubcategories &
  betweenIsraelAndGentilesSubcategories &
  charitySubcategories &
  animalsSubcategories &
  educationAndCounselingAndNamesSubcategories;

export type locales = "he" | "en";

export interface ChildrenProps {
  children: ReactNode;
}

export interface loginObj {
  username: string;
  password: string;
}
