import mongoose from 'mongoose'
import Attraction from '../models/Attraction'
import { AttractionCategory } from '../types'
import { connectToDatabase } from './db'
import googlePlacesService from '../services/googlePlaces.service'

// Регіони України для кращого покриття
const ukraineRegions = [
  // Великі міста
  { name: 'Київ', lat: 50.4501, lng: 30.5234 },
  { name: 'Львів', lat: 49.8397, lng: 24.0297 },
  { name: 'Одеса', lat: 46.4825, lng: 30.7233 },
  { name: 'Харків', lat: 49.9935, lng: 36.2304 },
  { name: 'Дніпро', lat: 48.464, lng: 35.046 },

  // Західна Україна
  { name: 'Чернівці', lat: 48.2908, lng: 25.9425 },
  { name: 'Ужгород', lat: 48.6208, lng: 22.2879 },
  { name: 'Івано-Франківськ', lat: 48.9226, lng: 24.7111 },
  { name: 'Луцьк', lat: 50.7472, lng: 25.3254 },
  { name: 'Тернопіль', lat: 49.5535, lng: 25.5948 },
  { name: 'Мукачево', lat: 48.4414, lng: 22.7178 },
  { name: 'Трускавець', lat: 49.2781, lng: 23.5067 },
  { name: 'Буковель', lat: 48.3587, lng: 24.4058 },
  { name: 'Яремче', lat: 48.4561, lng: 24.5561 },

  // Центральна Україна
  { name: 'Вінниця', lat: 49.2328, lng: 28.4811 },
  { name: 'Житомир', lat: 50.2547, lng: 28.6587 },
  { name: 'Черкаси', lat: 49.4444, lng: 32.0598 },
  { name: 'Кропивницький', lat: 48.5079, lng: 32.2623 },
  { name: 'Полтава', lat: 49.5883, lng: 34.5514 },
  { name: 'Умань', lat: 48.7484, lng: 30.2218 },
  { name: 'Канів', lat: 49.7533, lng: 31.4603 },

  // Північна Україна
  { name: 'Чернігів', lat: 51.4982, lng: 31.2893 },
  { name: 'Суми', lat: 50.9216, lng: 34.8003 },
  { name: 'Батурин', lat: 51.3419, lng: 32.8932 },

  // Південна Україна
  { name: 'Херсон', lat: 46.6354, lng: 32.6169 },
  { name: 'Миколаїв', lat: 46.975, lng: 31.9946 },
  { name: 'Запоріжжя', lat: 47.8388, lng: 35.1396 },
  { name: 'Асканія-Нова', lat: 46.4602, lng: 33.9876 },
  { name: 'Білгород-Дністровський', lat: 46.1938, lng: 30.3461 },

  // Східна Україна
  { name: "Слов'янськ", lat: 48.8535, lng: 37.6047 },
  { name: 'Святогірськ', lat: 49.0381, lng: 37.5494 },

  // Відомі історичні місця
  { name: "Кам'янець-Подільський", lat: 48.6722, lng: 26.5629 },
  { name: 'Хотин', lat: 48.5228, lng: 26.4983 },
  { name: 'Олесько', lat: 49.965, lng: 24.895 },
  { name: 'Підгірці', lat: 49.9464, lng: 24.9819 },
  { name: 'Жовква', lat: 50.0694, lng: 23.9744 },

  // Природні пам'ятки
  { name: 'Шацькі озера', lat: 51.4881, lng: 23.8586 },
  { name: 'Озеро Синевир', lat: 48.6167, lng: 23.6833 },
  { name: 'Говерла', lat: 48.1603, lng: 24.5003 },
]

// Більш конкретні запити для пошуку цікавих місць
const searchQueries = [
  // Історичні пам'ятки
  { query: "історичні пам'ятки", category: AttractionCategory.HISTORICAL },
  { query: 'замки', category: AttractionCategory.HISTORICAL },
  { query: 'палаци', category: AttractionCategory.HISTORICAL },
  { query: 'фортеці', category: AttractionCategory.HISTORICAL },
  { query: 'стародавні руїни', category: AttractionCategory.HISTORICAL },
  { query: 'історичні монументи', category: AttractionCategory.HISTORICAL },

  // Культурні пам'ятки
  { query: 'музеї', category: AttractionCategory.CULTURAL },
  { query: 'художні галереї', category: AttractionCategory.CULTURAL },
  { query: 'театри', category: AttractionCategory.CULTURAL },
  { query: 'культурні центри', category: AttractionCategory.CULTURAL },

  // Природні пам'ятки
  { query: 'національні парки', category: AttractionCategory.NATURAL },
  { query: 'водоспади', category: AttractionCategory.NATURAL },
  { query: 'озера', category: AttractionCategory.NATURAL },
  { query: 'гори', category: AttractionCategory.NATURAL },
  { query: 'печери', category: AttractionCategory.NATURAL },
  { query: 'природні заповідники', category: AttractionCategory.NATURAL },
  { query: 'ботанічні сади', category: AttractionCategory.NATURAL },

  // Релігійні пам'ятки
  { query: 'церкви', category: AttractionCategory.RELIGIOUS },
  { query: 'монастирі', category: AttractionCategory.RELIGIOUS },
  { query: 'собори', category: AttractionCategory.RELIGIOUS },
  { query: 'синагоги', category: AttractionCategory.RELIGIOUS },
  { query: 'мечеті', category: AttractionCategory.RELIGIOUS },

  // Розважальні пам'ятки
  { query: 'парки розваг', category: AttractionCategory.ENTERTAINMENT },
  { query: 'аквапарки', category: AttractionCategory.ENTERTAINMENT },
  { query: 'зоопарки', category: AttractionCategory.ENTERTAINMENT },
  { query: 'акваріуми', category: AttractionCategory.ENTERTAINMENT },

  // Специфічні українські пам'ятки
  { query: 'Чорнобиль', category: AttractionCategory.HISTORICAL },
  { query: 'Софіївський парк', category: AttractionCategory.NATURAL },
  { query: 'Тунель кохання', category: AttractionCategory.NATURAL },
  { query: 'Острів Хортиця', category: AttractionCategory.HISTORICAL },
]

// Допоміжна функція для визначення категорії на основі типів
const determineCategoryFromTypes = (types: string[]): AttractionCategory => {
  if (types.includes('church') || types.includes('place_of_worship')) {
    return AttractionCategory.RELIGIOUS
  } else if (
    types.includes('museum') ||
    types.includes('art_gallery') ||
    types.includes('library')
  ) {
    return AttractionCategory.CULTURAL
  } else if (
    types.includes('amusement_park') ||
    types.includes('zoo') ||
    types.includes('aquarium')
  ) {
    return AttractionCategory.ENTERTAINMENT
  } else if (
    types.includes('natural_feature') ||
    types.includes('park') ||
    types.includes('campground')
  ) {
    return AttractionCategory.NATURAL
  } else {
    return AttractionCategory.HISTORICAL // За замовчуванням для історичних місць/пам'яток
  }
}

// Функція для перекладу категорій українською
const getCategoryNameUkr = (category: AttractionCategory): string => {
  switch (category) {
    case AttractionCategory.HISTORICAL:
      return 'історична'
    case AttractionCategory.CULTURAL:
      return 'культурна'
    case AttractionCategory.NATURAL:
      return 'природна'
    case AttractionCategory.RELIGIOUS:
      return 'релігійна'
    case AttractionCategory.ENTERTAINMENT:
      return 'розважальна'
    default:
      return 'туристична'
  }
}

// Функція для заповнення бази даних різноманітними пам'ятками
const fetchUkraineAttractions = async () => {
  try {
    await connectToDatabase()

    // Очищення існуючих даних
    await Attraction.deleteMany({})
    console.info("Очищено існуючі дані про пам'ятки")

    let totalFetched = 0
    const MAX_ATTRACTIONS = 2000
    const ATTRACTIONS_PER_REGION_QUERY = 3 // Обмеження на регіон і запит для забезпечення різноманітності
    const RADIUS = 20000 // Радіус для пошуку
    const seenPlaceIds = new Set() // Відстеження вже оброблених місць

    // Ітерація по кожному регіону та комбінації запитів
    for (const region of ukraineRegions) {
      if (totalFetched >= MAX_ATTRACTIONS) break

      for (const { query, category } of searchQueries) {
        if (totalFetched >= MAX_ATTRACTIONS) break

        console.info(`Пошук "${query}" біля ${region.name}...`)

        try {
          // Пошук місць у цьому регіоні за цим запитом
          const places = await googlePlacesService.searchPlaces(
            `${query} в ${region.name} Україна`,
            region,
            RADIUS
          )

          console.info(`Знайдено ${places.length} результатів для "${query}" біля ${region.name}`)

          // Обробка обмеженої кількості місць для кожного регіону-запиту для забезпечення різноманітності
          let regionQueryCount = 0

          for (const place of places) {
            if (totalFetched >= MAX_ATTRACTIONS) break
            if (regionQueryCount >= ATTRACTIONS_PER_REGION_QUERY) break

            try {
              // Пропускаємо, якщо вже оброблено
              if (seenPlaceIds.has(place.placeId)) {
                console.info(`Вже оброблено ${place.name}, пропускаємо`)
                continue
              }

              seenPlaceIds.add(place.placeId)

              // Пропускаємо, якщо місце вже існує в базі даних
              const exists = await Attraction.findOne({ googlePlaceId: place.placeId })
              if (exists) {
                console.info(`Пам'ятка ${place.name} вже існує, пропускаємо`)
                continue
              }

              // Отримання детальної інформації
              const details = await googlePlacesService.getPlaceDetails(place.placeId)

              // Пропускаємо місця з дуже низькими рейтингами або без рейтингів
              if (details.rating && details.rating < 3.5) {
                console.info(`Пропускаємо ${place.name} через низький рейтинг: ${details.rating}`)
                continue
              }

              // Визначення найбільш підходящої категорії
              const detectedCategory = details.types
                ? determineCategoryFromTypes(details.types)
                : category

              const categoryNameUkr = getCategoryNameUkr(detectedCategory)

              // Формуємо опис, використовуючи доступні дані з Google
              let description = ''

              // Спочатку спробуємо використати редакційний опис від Google
              if (details.editorial_summary?.overview) {
                description = details.editorial_summary.overview
                console.info(`Використовуємо редакційний опис для ${place.name}`)
              }
              // Якщо немає редакційного опису, спробуємо використати відгуки
              else if (details.reviews && details.reviews.length > 0) {
                // Знайдемо відгук українською або англійською мовою з найвищим рейтингом
                const bestReview = details.reviews
                  .filter(
                    (review: { language: string }) =>
                      review.language === 'uk' || review.language === 'en'
                  )
                  .sort((a: { rating: number }, b: { rating: number }) => b.rating - a.rating)[0]

                if (bestReview) {
                  description = bestReview.text
                  console.info(`Використовуємо відгук для ${place.name}`)
                }
              }

              // Якщо все ще немає опису, використовуємо стандартний шаблон
              if (!description) {
                description = `Відома ${categoryNameUkr} пам'ятка, розташована в районі ${region.name}, Україна.`
                console.info(`Використовуємо стандартний опис для ${place.name}`)
              }

              // Створення нової пам'ятки
              const newAttraction = new Attraction({
                name: place.name,
                description: description,
                category: detectedCategory,
                location: place.location,
                images:
                  place.photos && place.photos.length > 0
                    ? place.photos.slice(0, 5)
                    : ['https://i.ibb.co/7xj9GNNn/default-image.png'],
                rating: place.rating || 4.0,
                address: place.address,
                googlePlaceId: place.placeId,
              })

              await newAttraction.save()
              totalFetched++
              regionQueryCount++
              console.info(`Збережено ${place.name} (${totalFetched}/${MAX_ATTRACTIONS})`)

              // Додавання невеликої затримки, щоб уникнути досягнення обмежень API
              await new Promise(resolve => setTimeout(resolve, 300))
            } catch (placeError) {
              console.error(`Помилка обробки місця ${place.name}:`, placeError)
              continue
            }
          }
        } catch (searchError) {
          console.error(`Помилка пошуку "${query}" біля ${region.name}:`, searchError)
          continue
        }
      }

      // Додавання більшої затримки між регіонами, щоб запобігти досягненню обмежень API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.info(
      `Успішно отримано та збережено ${totalFetched} різноманітних пам'яток по всій Україні`
    )

    // Закриття з'єднання з базою даних
    await mongoose.disconnect()
    console.info("З'єднання з базою даних закрито")
  } catch (error) {
    console.error("Помилка отримання пам'яток:", error)
    process.exit(1)
  }
}

// Запуск скрипта
fetchUkraineAttractions()
