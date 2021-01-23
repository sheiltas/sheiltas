import { readFile } from 'fs';
import { join } from 'path';
import { languages } from '../../../client/src/utils';
import { Category, Locale } from '../../../client/src/types';
import LocaleModel from '../models/locals';
import SheiltaModel from '../models/sheilta';
import CategoryModel from '../models/category';
import SubcategoryModel from '../models/subcategory';
import UserModel from '../models/users';

export const baseCategoriesKeysArray = [
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

// Sheilta Subcategories
export type aroundTheYearSubcategories =
    | 'שלושת השבועות'
    | 'תשעה באב'
    | 'תשעת הימים'
    | 'ראש השנה'
    | 'אלול'
    | 'עשרת ימי תשובה'
    | 'יום כיפורים'
    | 'סוכות'
    | 'ארבעת המינים'
    | 'שמחת תורה'
    | 'סוכה'
    | 'חנוכה'
    | 'פורים'
    | 'פסח'
    | 'כשרות הפסח'
    | 'חג הפסח'
    | 'מכירת חמץ'
    | 'הלכות יום טוב'
    | 'שבועות'
    | 'ימים מיוחדים';

export type destructionToSalvationSubcategories = 'ארץ ישראל' | 'חורבן' | 'גאולה' | 'בית מקדש';

export type prayersAndBlessingsSubcategories = 'תפילה' | 'ברכות ההודיה' | 'ברכות הנהנין';

export type synagogueAndSacredObjectsSubcategories =
    | 'בית כנסת'
    | 'תפילין'
    | 'גניזה'
    | 'מזוזה'
    | 'קדושת ספרים'
    | 'ספר תורה';

export type sabbathSubcategories =
    | 'מלאכות שבת'
    | 'אמירה לגוי'
    | 'הנאה ממלאכה אסורה'
    | 'מצוות השבת'
    | 'כבוד השבת'
    | 'תפילות בשבת'
    | 'סעודות'
    | 'קידוש והבדלה'
    | 'קבלת שבת והדלקת נרות'
    | 'טיפול בחולה בשבת'
    | 'עירוב'
    | 'מוקצה'
    | 'ערב שבת';

export type mourningSubcategories = 'שבעה' | 'אבלות כללי' | 'לוויה וקבורה' | 'יארצייט';

export type kosherKitchenSubcategories =
    | 'תולעים'
    | 'מאכלי ובישול גוי'
    | 'כשרות הבשר'
    | 'בשר בחלב'
    | 'הגעלת וטבילת כלים'
    | 'תרופות והמרחב הציבורי'
    | 'הפרשת חלה'
    | 'מצוות התלויות בארץ'
    | 'כלאים'
    | 'תרומות ומעשות'
    | 'ערלה'
    | 'שמיטה'
    | 'מאכלים אסורים מחמת סכנה'
    | 'יין נסך וסתם יינם';

export type circleOfLifeSubcategories =
    | 'שגרת בוקר'
    | 'שגרת ערב'
    | 'קעקוע'
    | 'נדרים ושבועות'
    | 'שילוח הקן'
    | 'ברית מילה'
    | 'בל תשחית'
    | 'גילוח - תער'
    | 'לא ילבש'
    | 'שעטנז';

export type marriageAndPuritySubcategories =
    | 'ממזרות ויוחסין'
    | 'גיור ובירורי יהדות'
    | 'מניעת היריון, הפלות'
    | 'ייחוד'
    | 'נדה וטבילה'
    | 'טומאת כהנים'
    | 'נישואין'
    | 'גירושין'
    | 'אישות'
    | 'צניעות'
    | 'יבום וחליצה'
    | 'פריה ורביה';

export type betweenAManAndHisFriendSubcategories =
    | 'שקר'
    | 'כיבוד הורים'
    | 'לפני עיוור'
    | 'כיבוד תלמידי חכמים'
    | 'לשון הרע'
    | 'בין ישראל לגוי'
    | 'חוקות הגוי'
    | 'גרים'
    | 'עבודה זרה'
    | 'לא תחנם'
    | 'צדקה'
    | 'הלכות צדקה'
    | 'מעשר כספים';

export type betweenIsraelAndGentilesSubcategories = 'לא תחנם' | 'עבודה זרה' | 'גרים' | 'חוקות הגוי';

export type charitySubcategories = 'מעשר כספים';

// extends type faithAndViewSubcategories = ''

// extends type customsSubcategories = ''

export type educationAndCounselingAndNamesSubcategories = 'מנהגים' | 'קבלה' | 'אינטרנט' | 'חזרה בתשובה';

export type animalsSubcategories = 'סירוס' | 'צער בעלי חיים';

export type monetarySubcategories =
    | 'מקח וממכר'
    | 'מי שפרע'
    | 'אונאה ומקח טעות'
    | 'גוי'
    | 'מצרנות'
    | 'מתנה'
    | 'אסמכתא, גמירות דעת'
    | 'אונס ומודעה'
    | 'עובד ומעביד'
    | 'שטרות'
    | 'בל תלין'
    | 'בית הדין'
    | 'דינא דמלכותא'
    | 'עדות'
    | 'וועד בית'
    | 'חוזים והסכמים'
    | 'שוכר'
    | 'שוכרים וושתפים'
    | 'הלוואה'
    | 'פועלים'
    | 'ערבות'
    | 'דינא דגרמי'
    | 'ערכאות'
    | 'שומרים'
    | 'ירושה'
    | 'שליחות'
    | 'שכירות פועלים'
    | 'שירותי קבלנות'
    | 'השבת אבידה'
    | 'גזילה וגנבה'
    | 'נזקים'
    | 'תיווך והשקעות'
    | 'ריבית'
    | 'שכנים'
    | 'מיסים'
    | 'זכויות יוצרים'
    | 'שואל';

export type subcategoriesHebrew =
    | aroundTheYearSubcategories
    | destructionToSalvationSubcategories
    | prayersAndBlessingsSubcategories
    | synagogueAndSacredObjectsSubcategories
    | sabbathSubcategories
    | monetarySubcategories
    | kosherKitchenSubcategories
    | circleOfLifeSubcategories
    | marriageAndPuritySubcategories
    | betweenAManAndHisFriendSubcategories
    | betweenIsraelAndGentilesSubcategories
    | charitySubcategories
    | animalsSubcategories
    | educationAndCounselingAndNamesSubcategories
    | mourningSubcategories;

// Sheilta categories
export type categoriesKeys = typeof baseCategoriesKeysArray[number];

export const mapCategoriesKeysToHebrewSubcategories: Record<categoriesKeys, subcategoriesHebrew[]> = {
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
    synagogueAndSacredObjects: ['בית כנסת', 'תפילין', 'גניזה', 'מזוזה', 'קדושת ספרים', 'ספר תורה'],
    faithAndView: [],
    customs: []
};

export const initDB = async () => {
    const adminExists = await UserModel.findOne({ username: 'admin' });
    if (adminExists) {
        console.log('DB already exists');
        return;
    }

    readFile(
        join(__dirname, '../../../resources/localesData.json'),
        { encoding: 'utf-8' },
        async (err, data) => {
            if (err) {
                return console.error('Error in reading sheiltas:', err);
            }
            const localesData = JSON.parse(data);
            const locales = Object.keys(localesData.en).map(
                (key) =>
                    new LocaleModel({
                        key,
                        translation: languages.reduce((acc, language) => {
                            acc[language] = localesData[language][key];
                            return acc;
                        }, {} as Locale['translation'])
                    })
            );

            const subcategories = locales.reduce((acc, locale) => {
                const { _id: localeId, translation } = locale;
                const hebrewName = Object.values(mapCategoriesKeysToHebrewSubcategories).find((value) =>
                    value.includes(translation.he as subcategoriesHebrew)
                );
                return hebrewName
                    ? acc.concat(
                          new SubcategoryModel({
                              name: localeId,
                              subcategories: []
                          })
                      )
                    : acc;
            }, []);

            const categories = locales.reduce((acc, locale) => {
                const { key, _id: localeId } = locale;
                const isCategory = baseCategoriesKeysArray.includes(key as categoriesKeys);
                return isCategory
                    ? acc.concat(
                          new CategoryModel({
                              name: localeId,
                              subcategories: mapCategoriesKeysToHebrewSubcategories[key as categoriesKeys]
                                  .map((heSubcategory) =>
                                      locales.find(
                                          (singleLocale) => singleLocale.translation.he === heSubcategory
                                      )
                                  )
                                  .map((subcategoryLocale) =>
                                      subcategories.find(
                                          (subcategory) => subcategory.name === subcategoryLocale._id
                                      )
                                  )
                          })
                      )
                    : acc;
            }, [] as Category[]);

            try {
                await Promise.all([
                    LocaleModel.insertMany(locales),
                    CategoryModel.insertMany(categories),
                    SubcategoryModel.insertMany(subcategories),
                    UserModel.create({ fullName: 'Full name', password: '0000', username: 'admin' })
                ]);
                console.log('Initiated DB successfully');
            } catch (e) {
                console.log('Error in init DB:', e);
            }
        }
    );
};

export const initSheiltas = () =>
    readFile(join(__dirname, '../../resources/initSheiltas.json'), { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return console.error('err', err);
        }
        SheiltaModel.insertMany(JSON.parse(data)).then(() => console.log('Initiated sheiltas successfully'));
    });

export const updateLocals = async () => {
    const localesFromDB = await LocaleModel.find({}, ['key']).lean();
    readFile(
        join(__dirname, '../../../resources/localesData.json'),
        { encoding: 'utf-8' },
        async (err, data) => {
            if (err) {
                return console.error('Error in reading sheiltas:', err);
            }

            const localesData = JSON.parse(data);
            const localesKeys = Object.keys(localesData.he);

            const newLocales = localesKeys.reduce((acc, key) => {
                return localesFromDB.some((locale) => locale.key === key)
                    ? acc
                    : acc.concat(
                          new LocaleModel({
                              key,
                              translation: languages.reduce((acc, language) => {
                                  acc[language] = localesData[language][key];
                                  return acc;
                              }, {} as Locale['translation'])
                          })
                      );
            }, []);

            try {
                await LocaleModel.insertMany(newLocales);
                console.log('Updated locales successfully');
            } catch (e) {
                console.error('Error in updating locales: ', e);
            }
        }
    );
};
